import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createItem,
  deleteItem,
  itemImageUrl,
  listItems,
  updateItem,
} from "./items";

describe("api/items", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("listItems ruft /items ohne Kategorie auf", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [],
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("localStorage", { getItem: () => null });

    await listItems();

    const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/api/v1/items");
    expect(url).not.toContain("?");
  });

  it("listItems hängt den Kategorie-Filter als Query an", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [],
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("localStorage", { getItem: () => null });

    await listItems("kleid");

    const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/api/v1/items?category=kleid");
  });

  it("createItem sendet multipart per POST an /items", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        id: 1,
        name: "Rotes Kleid",
        category: "kleid",
        image_url: "/uploads/abc.jpg",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("localStorage", { getItem: () => null });

    const form = new FormData();
    form.append("name", "Rotes Kleid");
    const result = await createItem(form);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/api/v1/items");
    expect(init.method).toBe("POST");
    expect(init.body).toBe(form);
    expect(result.id).toBe(1);
  });

  it("updateItem sendet multipart per PUT an /items/{id}", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 7, name: "Neu", category: "oberteil", image_url: "/uploads/x.jpg" }),
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("localStorage", { getItem: () => null });

    const form = new FormData();
    form.append("name", "Neu");
    await updateItem(7, form);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/api/v1/items/7");
    expect(init.method).toBe("PUT");
  });

  it("deleteItem sendet DELETE an /items/{id}", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      json: async () => null,
    });
    vi.stubGlobal("fetch", fetchMock);
    vi.stubGlobal("localStorage", { getItem: () => null });

    await deleteItem(3);

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toContain("/api/v1/items/3");
    expect(init.method).toBe("DELETE");
  });

  it("itemImageUrl stellt VITE_BACKEND_URL dem relativen Pfad voran", () => {
    const url = itemImageUrl("/uploads/abc.jpg");
    expect(url).toContain("/uploads/abc.jpg");
    expect(url.startsWith("http")).toBe(true);
    expect(url.indexOf("/uploads")).toBeGreaterThan(0);
  });
});
