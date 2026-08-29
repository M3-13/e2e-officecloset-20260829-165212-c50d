import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiFetch, authHeaders, TOKEN_KEY } from "./client";

describe("api/client", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("hängt den Bearer-Token aus localStorage an", async () => {
    const token = "abc.def.ghi";
    vi.stubGlobal("localStorage", { getItem: () => token });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 1 }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await apiFetch("/items");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/api/v1/items");
    expect((init.headers as Record<string, string>).Authorization).toBe(
      `Bearer ${token}`,
    );
  });

  it("lässt den Authorization-Header ohne Token weg", async () => {
    vi.stubGlobal("localStorage", { getItem: () => null });
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    });
    vi.stubGlobal("fetch", fetchMock);

    await apiFetch("/items");

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it("wirft bei nicht-ok-Antworten mit der detail-Meldung", async () => {
    vi.stubGlobal("localStorage", { getItem: () => null });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ detail: "Nicht autorisiert" }),
      }),
    );

    await expect(apiFetch("/outfits")).rejects.toThrow("Nicht autorisiert");
  });

  it("authHeaders liest den Token aus dem Schlüssel auth_token", () => {
    vi.stubGlobal("localStorage", { getItem: (key: string) => (key === TOKEN_KEY ? "xyz" : null) });
    expect(authHeaders()).toEqual({ Authorization: "Bearer xyz" });
  });
});
