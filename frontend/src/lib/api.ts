
import axios, { type InternalAxiosRequestConfig } from "axios";
import { tokenStore } from "./tokenStore";
// Development uses the same hostname on both origins (127.0.0.1), allowing
// credentialed cross-port requests to carry the HttpOnly refresh cookie.
export const BASE_URL = window.RUNTIME_CONFIG.API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
// username/image:version 
// Separate instance: refresh requests must not recursively
// trigger the same response interceptor.
const refreshClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface TokenResponse { access_token: string }

let refreshPromise: Promise<string> | null = null; 

// Attach access token to every outgoing request.
api.interceptors.request.use((config) => {
  // Let the browser add the multipart boundary for FormData requests.
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  }

  const accessToken = tokenStore.get() 

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Catch expired access tokens.
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const url = originalRequest.url ?? "";

    const excludedEndpoints = [
      "/auth/login",
      "/auth/signup",
      "/auth/refresh",
      "/auth/logout",
    ];

    if (excludedEndpoints.some((endpoint) => url.includes(endpoint))) {
      return Promise.reject(error) 
    }

    originalRequest._retry = true;

    try {
      // If another request is already refreshing,
      // wait for that same refresh operation.
      if (!refreshPromise) {
        refreshPromise = refreshClient.post<TokenResponse>("/auth/refresh").then(
          (response) => {
            const newAccessToken = response.data.access_token ; 
            tokenStore.set(newAccessToken ) 
            return newAccessToken
          }
        ).finally(()=>{
          refreshPromise = null 
        })
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      // Retry the original failed request.
      return api(originalRequest);
    } catch (refreshError) {
      // A rejected refresh cookie means the session is gone. Network and 5xx
      // errors are temporary and must not log the user out.
      if (axios.isAxiosError(refreshError) && refreshError.response?.status === 401) {
        tokenStore.clear();
        window.dispatchEvent(new Event("auth:session-expired"));
      }

      return Promise.reject(refreshError);
    }
  }
);

export default api;
