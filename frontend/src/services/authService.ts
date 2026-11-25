
import api, { BASE_URL } from "../lib/api";
import axios from "axios";
import { tokenStore } from "../lib/tokenStore";

import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  SignupData,
  TokenResponse,
} from "../types/auth";

const sessionRestoreClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    const response = await api.post<LoginResponse>(
      "/auth/login",
      {
        email: credentials.email.toLowerCase(),
        password: credentials.password,
      }
    );

    const { access_token, user } = response.data;

    tokenStore.set(access_token);

    return user;
  },

  async signup(data: SignupData): Promise<void> {
    await api.post("/auth/signup", {
      ...data,
      email: data.email.toLowerCase(),
    });
  },

  async refresh(): Promise<string> {
    const response = await api.post<TokenResponse>("/auth/refresh");

    const accessToken = response.data.access_token;

    tokenStore.set(accessToken);

    return accessToken;
  },

  async getMe(): Promise<AuthUser> {
    const response = await api.get<AuthUser>("/auth/me");

    return response.data;
  },

  async getMeAfterRefresh(): Promise<AuthUser> {
    const response = await sessionRestoreClient.get<AuthUser>("/auth/me", {
      headers: { Authorization: `Bearer ${tokenStore.get()}` },
    });

    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } finally {
      // Clear frontend authentication state even if
      // the logout request encounters an error.
      tokenStore.clear();
    }
  },
};
