import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthApiError, deleteAccount, login, logout, register } from "./auth";

describe("api/auth", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("register ruft POST /auth/register mit den Zugangsdaten auf", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: 1, email: "a@b.de" }),
    });
    vi.stubGlobal("localStorage", { getItem: () => null });
    vi.stubGlobal("fetch", fetchMock);

    const user = await register("a@b.de", "geheim");

    expect(user).toEqual({ id: 1, email: "a@b.de" });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/api/v1/auth/register");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      email: "a@b.de",
      password: "geheim",
    });
  });

  it("login ruft POST /auth/login auf und liefert das Token", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ access_token: "tok", token_type: "bearer" }),
    });
    vi.stubGlobal("localStorage", { getItem: () => null });
    vi.stubGlobal("fetch", fetchMock);

    const response = await login("a@b.de", "geheim");

    expect(response.access_token).toBe("tok");
    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).toContain("/api/v1/auth/login");
  });

  it("login wirft AuthApiError mit Status 401 bei falschen Zugangsdaten", async () => {
    vi.stubGlobal("localStorage", { getItem: () => null });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ detail: "Ungültige Anmeldedaten" }),
      }),
    );

    const promise = login("a@b.de", "falsch");

    await expect(promise).rejects.toBeInstanceOf(AuthApiError);
    await expect(promise).rejects.toMatchObject({ status: 401 });
  });

  it("register wirft AuthApiError mit Status 409 bei bereits registrierter E-Mail", async () => {
    vi.stubGlobal("localStorage", { getItem: () => null });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ detail: "E-Mail bereits registriert" }),
      }),
    );

    await expect(register("a@b.de", "geheim")).rejects.toMatchObject({
      status: 409,
    });
  });

  it("logout ruft POST /auth/logout auf", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      json: async () => null,
    });
    vi.stubGlobal("localStorage", { getItem: () => "tok" });
    vi.stubGlobal("fetch", fetchMock);

    await logout();

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/api/v1/auth/logout");
    expect(init.method).toBe("POST");
  });

  it("deleteAccount ruft DELETE /account auf", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      json: async () => null,
    });
    vi.stubGlobal("localStorage", { getItem: () => "tok" });
    vi.stubGlobal("fetch", fetchMock);

    await deleteAccount();

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/api/v1/account");
    expect(init.method).toBe("DELETE");
  });
});
