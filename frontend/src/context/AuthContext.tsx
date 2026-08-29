import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { TOKEN_KEY } from "../api/client";

export interface User {
  id: number;
  email: string;
}

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

export function AuthProvider({ children }: { children: ReactNode }) {
  const value: AuthContextValue = {
    user: null,
    token: readStoredToken(),
    loading: false,
    login: async () => {},
    register: async () => {},
    logout: () => {},
    deleteAccount: async () => {},
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth muss innerhalb von AuthProvider verwendet werden");
  }
  return context;
}
