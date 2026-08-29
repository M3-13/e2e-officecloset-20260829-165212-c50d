import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createOutfit,
  deleteOutfit,
  listOutfits,
  resolveImageUrl,
  updateOutfit,
} from "./outfits";

describe("api/outfits", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("resolveImageUrl stellt relativen Pfaden die Backend-URL voran", () => {
    expect(resolveImageUrl("/uploads/a.jpg")).toBe(
      "http://localhost:8000/uploads/a.jpg",
    );
  });

  it("resolveImageUrl normalisiert Pfade ohne führenden Slash", () => {
    expect(resolveImageUrl("uploads/a.jpg")).toBe(
      "http://localhost:8000/uploads/a.jpg",
    );
  });

  it("resolveImageUrl lässt absolute URLs unverändert", () => {
    expect(resolveImageUrl("https://cdn.example.com/a.jpg")).toBe(
      "https://cdn.example.com/a.jpg",
    );
  });

  it("resolveImageUrl liefert bei leerem Pfad einen leeren String", () => {
    expect(resolveImageUrl("")).toBe("");
  });

  it("listOutfits ruft GET /outfits auf", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: async () => [] });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("localStorage", { getItem: () => null });

    await listOutfits();

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/api/v1/outfits");
    expect(init.method).toBeUndefined();
  });

  it("createOutfit sendet POST mit name, occasion und item_ids", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 201, json: async () => ({ id: 1 }) });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("localStorage", { getItem: () => null });

    await createOutfit({ name: "Gala-Look", occasion: "Gala", item_ids: [1, 2] });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/api/v1/outfits");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual({
      name: "Gala-Look",
      occasion: "Gala",
      item_ids: [1, 2],
    });
  });

  it("updateOutfit sendet PUT an /outfits/{id}", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: async () => ({ id: 5 }) });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("localStorage", { getItem: () => null });

    await updateOutfit(5, { name: "X", occasion: "Alltag", item_ids: [3] });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/api/v1/outfits/5");
    expect(init.method).toBe("PUT");
  });

  it("deleteOutfit sendet DELETE an /outfits/{id}", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 204, json: async () => null });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("localStorage", { getItem: () => null });

    await deleteOutfit(5);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/api/v1/outfits/5");
    expect(init.method).toBe("DELETE");
  });
});
