import { useCallback, useEffect, useState } from "react";
import {
  CATEGORIES,
  CATEGORY_LABELS,
  createItem,
  deleteItem,
  listItems,
  updateItem,
  type Category,
  type Item,
} from "../api/items";
import WardrobeItemCard from "../components/WardrobeItemCard";
import WardrobeForm from "../components/WardrobeForm";
import "./wardrobe.css";

interface FormPayload {
  name: string;
  category: Category;
  image: File | null;
}

export default function WardrobePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Item | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async (activeCategory: Category | null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listItems(activeCategory ?? undefined);
      setItems(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Garderobe konnte nicht geladen werden.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(category);
  }, [category, load]);

  function openCreate() {
    setEditing(null);
    setFormError(null);
    setFormOpen(true);
  }

  function openEdit(item: Item) {
    setEditing(item);
    setFormError(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
    setFormError(null);
  }

  async function handleSubmit(data: FormPayload) {
    setSubmitting(true);
    setFormError(null);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("category", data.category);
      if (data.image) {
        formData.append("image", data.image);
      }

      if (editing) {
        await updateItem(editing.id, formData);
      } else {
        await createItem(formData);
      }

      closeForm();
      await load(category);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Speichern fehlgeschlagen.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(item: Item) {
    setBusyId(item.id);
    try {
      await deleteItem(item.id);
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Löschen fehlgeschlagen.",
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="page">
      <header className="page-header">
        <h1>Garderobe</h1>
        <p className="page-subtitle">Deine persönliche Garderobe.</p>
      </header>

      <div className="wardrobe-toolbar">
        <div className="filter-bar" role="group" aria-label="Kategorie-Filter">
          <button
            type="button"
            className={
              category === null ? "filter-pill filter-pill--active" : "filter-pill"
            }
            onClick={() => setCategory(null)}
          >
            Alle
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={
                category === c ? "filter-pill filter-pill--active" : "filter-pill"
              }
              onClick={() => setCategory(c)}
            >
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>

        <button type="button" className="btn btn--primary" onClick={openCreate}>
          Neues Stück
        </button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      {loading ? (
        <div className="empty-state">Garderobe wird geladen …</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          {category
            ? "Keine Stücke in dieser Kategorie."
            : "Deine Garderobe ist noch leer."}
        </div>
      ) : (
        <div className="item-grid">
          {items.map((item) => (
            <WardrobeItemCard
              key={item.id}
              item={item}
              onEdit={openEdit}
              onDelete={handleDelete}
              busy={busyId === item.id}
            />
          ))}
        </div>
      )}

      {formOpen && (
        <WardrobeForm
          item={editing}
          submitting={submitting}
          error={formError}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}
    </section>
  );
}
