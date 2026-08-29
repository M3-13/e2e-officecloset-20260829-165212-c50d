import { apiFetch, del } from "./client";

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

export const CATEGORIES: Category[] = [
  "oberteil",
  "unterteil",
  "schuhe",
  "accessoires",
  "kleid",
];

export const CATEGORY_LABELS: Record<Category, string> = {
  oberteil: "Oberteil",
  unterteil: "Unterteil",
  schuhe: "Schuhe",
  accessoires: "Accessoires",
  kleid: "Kleid",
};

const BACKEND_BASE =
  import.meta.env.VITE_BACKEND_URL ?? "http://localhost:8000";

export function listItems(category?: Category): Promise<Item[]> {
  const query = category
    ? `?category=${encodeURIComponent(category)}`
    : "";
  return apiFetch<Item[]>(`/items${query}`);
}

export function createItem(formData: FormData): Promise<Item> {
  return apiFetch<Item>("/items", { method: "POST", body: formData });
}

export function updateItem(id: number, formData: FormData): Promise<Item> {
  return apiFetch<Item>(`/items/${id}`, { method: "PUT", body: formData });
}

export function deleteItem(id: number): Promise<void> {
  return del<void>(`/items/${id}`);
}

export function itemImageUrl(imageUrl: string): string {
  return `${BACKEND_BASE}${imageUrl}`;
}
