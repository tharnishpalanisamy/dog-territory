import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import axios from "axios";

import { authService } from "../services/authService";
import { tokenStore } from "../lib/tokenStore";
import type { AuthUser, LoginCredentials } from "../types/auth";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  authError: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  retrySessionRestore: () => Promise<void>;
  updateUser: (updates: object) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// StrictMode mounts effects twice in development. Share one rotation request
// so both effect runs cannot consume the same single-use refresh cookie.
let initializationPromise: Promise<AuthUser> | null = null;

function restoreSession(): Promise<AuthUser> {
  if (!initializationPromise) {
    initializationPromise = authService
      .refresh()
      .then(() => authService.getMeAfterRefresh())
      .finally(() => {
        initializationPromise = null;
      });
  }

  return initializationPromise;
}

function hasStoredSession(): boolean {
  return localStorage.getItem("hasSession") === "true";
}

function isAuthenticationFailure(error: unknown): boolean {
  return axios.isAxiosError(error) && error.response?.status === 401;
}

function errorMessage(error: unknown): string {
  if (axios.isAxiosError(error) && !error.response) {
    return "The server could not be reached. Check your connection and retry.";
  }

  return "The server could not restore your session. Please retry.";
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const retrySessionRestore = useCallback(async () => {
    if (!hasStoredSession()) {
      setUser(null);
      setAuthError(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setAuthError(null);
    try {
      const currentUser = await restoreSession();
      setUser(currentUser);
    } catch (error) {
      if (isAuthenticationFailure(error)) {
        tokenStore.clear();
        localStorage.removeItem("hasSession");
        setUser(null);
        setAuthError(null);
      } else {
        // Keep any existing user during a temporary outage; on cold start,
        // show a retry state rather than falsely declaring the user signed out.
        setAuthError(errorMessage(error));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    if (!hasStoredSession()) {
      setIsLoading(false);
      return () => {
        active = false;
      };
    }

    void restoreSession()
      .then((currentUser) => {
        if (active) {
          setUser(currentUser);
          setAuthError(null);
        }
      })
      .catch((error: unknown) => {
        if (!active) return;

        if (isAuthenticationFailure(error)) {
          tokenStore.clear();
          localStorage.removeItem("hasSession");
          setUser(null);
          setAuthError(null);
        } else {
          setAuthError(errorMessage(error));
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      tokenStore.clear();
      localStorage.removeItem("hasSession");
      setUser(null);
      setAuthError(null);
      setIsLoading(false);
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);
    return () => window.removeEventListener("auth:session-expired", handleSessionExpired);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const currentUser = await authService.login(credentials);
      localStorage.setItem("hasSession", "true");
      setUser(currentUser);
      return currentUser;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      tokenStore.clear();
      setUser(null);
      setAuthError(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const currentUser = await authService.getMe();
    setUser(currentUser);
  }, []);

  const updateUser = useCallback((updates: object) => {
    setUser((currentUser) =>
      currentUser ? ({ ...currentUser, ...updates } as AuthUser) : currentUser,
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        authError,
        isAuthenticated: user !== null,
        login,
        logout,
        refreshUser,
        retrySessionRestore,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
