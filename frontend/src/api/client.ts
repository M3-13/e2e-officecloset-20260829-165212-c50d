const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

export const TOKEN_KEY = "auth_token";

export interface ApiErrorBody {
  detail: string;
}

function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function authHeaders(): Record<string, string> {
  const token = readToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...authHeaders(),
      ...(init.headers ?? {}),
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const detail =
      body && typeof (body as ApiErrorBody).detail === "string"
        ? (body as ApiErrorBody).detail
        : `Anfrage fehlgeschlagen (${response.status})`;
    throw new Error(detail);
  }

  return body as T;
}

export function get<T>(path: string): Promise<T> {
  return apiFetch<T>(path);
}

export function post<T>(path: string, data?: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: "POST",
    headers: data !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
}

export function put<T>(path: string, data?: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: "PUT",
    headers: data !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });
}

export function del<T>(path: string): Promise<T> {
  return apiFetch<T>(path, { method: "DELETE" });
}
