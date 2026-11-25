import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { authService } from "../services/authService";
import { tokenStore } from "../lib/tokenStore";

import type { AuthUser, LoginCredentials } from "../types/auth";

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updates: object) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session when the application starts.
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        await authService.refresh();

        const currentUser = await authService.getMe();

        if (mounted) {
          setUser(currentUser);
        }
      } catch {
        tokenStore.clear();

        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  // Listen for session expiration from Axios.
  useEffect(() => {
    const handleSessionExpired = () => {
      tokenStore.clear();
      setUser(null);
    };

    window.addEventListener("auth:session-expired", handleSessionExpired);

    return () => {
      window.removeEventListener("auth:session-expired", handleSessionExpired);
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const currentUser = await authService.login(credentials);

    setUser(currentUser);
    return currentUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      tokenStore.clear();
      setUser(null);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const currentUser = await authService.getMe();

    setUser(currentUser);
  }, []);

  const updateUser = useCallback((updates: object) => {
    setUser((currentUser) => currentUser ? { ...currentUser, ...updates } as AuthUser : currentUser);
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    logout,
    refreshUser,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
