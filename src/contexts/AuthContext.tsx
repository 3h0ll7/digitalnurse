import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api-client";

export interface CareUnit {
  id: string;
  name: string;
  type?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  organization?: string;
  units: CareUnit[];
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  activeUnit: CareUnit | null;
  isSessionLoading: boolean;
  isAuthLoading: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  register: (payload: {
    fullName: string;
    email: string;
    password: string;
    organization?: string;
  }) => Promise<void>;
  logout: () => void;
  setActiveUnit: (unitId: string) => void;
  secureRequest: <T>(path: string, options?: RequestInit) => Promise<T>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = "digitalNurseToken";

const getStoredToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<AuthUser | null>(null);
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setIsSessionLoading(false);
        return;
      }
      try {
        const { user: profile } = await apiFetch<{ user: AuthUser }>("/api/auth/me", { token });
        setUser(profile);
        setActiveUnitId(profile.units?.[0]?.id ?? null);
      } catch (error) {
        setToken(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem(TOKEN_KEY);
        }
      } finally {
        setIsSessionLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const persistToken = useCallback((value: string | null) => {
    setToken(value);
    if (typeof window === "undefined") return;
    if (value) {
      localStorage.setItem(TOKEN_KEY, value);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  const runAuthRequest = useCallback(
    async <T,>(factory: () => Promise<T>): Promise<T> => {
      setIsAuthLoading(true);
      try {
        return await factory();
      } finally {
        setIsAuthLoading(false);
      }
    },
    []
  );

  const login = useCallback(
    async (payload: { email: string; password: string }) => {
      const response = await runAuthRequest(() =>
        apiFetch<{ token: string; user: AuthUser }>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify(payload),
          auth: false,
        })
      );
      persistToken(response.token);
      setUser(response.user);
      setActiveUnitId(response.user.units?.[0]?.id ?? null);
    },
    [persistToken, runAuthRequest]
  );

  const register = useCallback(
    async (payload: { fullName: string; email: string; password: string; organization?: string }) => {
      const response = await runAuthRequest(() =>
        apiFetch<{ token: string; user: AuthUser }>("/api/auth/signup", {
          method: "POST",
          body: JSON.stringify(payload),
          auth: false,
        })
      );
      persistToken(response.token);
      setUser(response.user);
      setActiveUnitId(response.user.units?.[0]?.id ?? null);
    },
    [persistToken, runAuthRequest]
  );

  const logout = useCallback(() => {
    setUser(null);
    setActiveUnitId(null);
    persistToken(null);
  }, [persistToken]);

  const setActiveUnit = useCallback((unitId: string) => {
    setActiveUnitId(unitId);
  }, []);

  const secureRequest = useCallback(
    async <T,>(path: string, options: RequestInit = {}) => {
      if (!token) {
        throw new Error("Not authenticated");
      }
      return apiFetch<T>(path, { ...options, token });
    },
    [token]
  );

  const activeUnit = useMemo(() => {
    if (!user || !activeUnitId) return null;
    return user.units?.find((unit) => unit.id === activeUnitId) ?? null;
  }, [user, activeUnitId]);

  const value = useMemo(
    () => ({
      user,
      token,
      activeUnit,
      isSessionLoading,
      isAuthLoading,
      login,
      register,
      logout,
      setActiveUnit,
      secureRequest,
    }),
    [
      user,
      token,
      activeUnit,
      isSessionLoading,
      isAuthLoading,
      login,
      register,
      logout,
      setActiveUnit,
      secureRequest,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
