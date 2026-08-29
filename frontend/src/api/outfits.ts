import { del, get, post, put } from "./client";

export type Category =
  | "oberteil"
  | "unterteil"
  | "schuhe"
  | "accessoires"
  | "kleid";

export interface Item {
  id: number;
  name: string;
  category: Category;
  image_url: string;
}

export interface Outfit {
  id: number;
  name: string;
  occasion: string;
  items: Item[];
}

export interface OutfitInput {
  name: string;
  occasion: string;
  item_ids: number[];
}

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000";

export function resolveImageUrl(path: string): string {
  if (!path) {
    return "";
  }
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  return `${BACKEND_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function listOutfits(): Promise<Outfit[]> {
  return get<Outfit[]>("/outfits");
}

export function getOutfit(id: number): Promise<Outfit> {
  return get<Outfit>(`/outfits/${id}`);
}

export function createOutfit(input: OutfitInput): Promise<Outfit> {
  return post<Outfit>("/outfits", input);
}

export function updateOutfit(id: number, input: OutfitInput): Promise<Outfit> {
  return put<Outfit>(`/outfits/${id}`, input);
}

export function deleteOutfit(id: number): Promise<void> {
  return del<void>(`/outfits/${id}`);
}
