
import axios, {
  type InternalAxiosRequestConfig,
} from "axios";

// const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
const BASE_URL = 'http://127.0.0.1:8000/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Separate instance: refresh requests must not recursively
// trigger the same response interceptor.
const refreshClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

let refreshPromise: Promise<string> | null = null;

// Attach access token to every outgoing request.
api.interceptors.request.use((config) => {
  // Let the browser add the multipart boundary for FormData requests.
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    config.headers.delete("Content-Type");
  }

  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Catch expired access tokens.
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as RetryableRequest;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      // If another request is already refreshing,
      // wait for that same refresh operation.
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const refreshToken =
            localStorage.getItem("refresh_token");

          if (!refreshToken) {
            throw new Error("No refresh token available");
          }

          const response = await refreshClient.post<TokenResponse>(
            "/auth/refresh",
            { refresh_token: refreshToken }
          );

          const { access_token, refresh_token } = response.data;

          // Store BOTH tokens because rotation invalidates
          // the previous refresh token.
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);

          return access_token;
        })().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      // Retry the original failed request.
      return api(originalRequest);

    } catch (refreshError) {
      // Only clear the session when refresh is rejected.
      if (
        axios.isAxiosError(refreshError) &&
        [401, 403].includes(refreshError.response?.status ?? 0)
      ) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        window.location.href = "/signin";
      }

      return Promise.reject(refreshError);
    }
  }
);

export default api;
