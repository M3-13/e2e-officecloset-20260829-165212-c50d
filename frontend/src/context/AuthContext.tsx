import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { TOKEN_KEY } from "../api/client";
import {
  deleteAccount as apiDeleteAccount,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
  type LoginResponse,
  type User,
} from "../api/auth";

export type { User };

const USER_KEY = "auth_user";

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function readStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof (parsed as User).id === "number" &&
      typeof (parsed as User).email === "string"
    ) {
      return parsed as User;
    }
    return null;
  } catch {
    return null;
  }
}

function storeToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // storage may be unavailable; the in-memory token still works
  }
}

function storeUser(user: User): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // storage may be unavailable; the in-memory user still works
  }
}

function clearStoredAuth(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // ignore — in-memory state is already being cleared
  }
}

function userIdFromToken(token: string): number | null {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) {
      return null;
    }
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const decoded: { sub?: unknown } = JSON.parse(atob(padded));
    if (typeof decoded.sub === "number") {
      return decoded.sub;
    }
    if (typeof decoded.sub === "string") {
      return Number(decoded.sub);
    }
    return null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser);
  const [token, setToken] = useState<string | null>(readStoredToken);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const response: LoginResponse = await apiLogin(email, password);
      const nextUser: User = {
        id: userIdFromToken(response.access_token) ?? 0,
        email,
      };
      storeToken(response.access_token);
      storeUser(nextUser);
      setToken(response.access_token);
      setUser(nextUser);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      await apiRegister(email, password);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
    void apiLogout().catch(() => {
      // local sign-out is already complete; the server call is best-effort
    });
  }, []);

  const deleteAccount = useCallback(async () => {
    setLoading(true);
    try {
      await apiDeleteAccount();
      clearStoredAuth();
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, token, loading, login, register, logout, deleteAccount }),
    [user, token, loading, login, register, logout, deleteAccount],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth muss innerhalb von AuthProvider verwendet werden");
  }
  return context;
}
