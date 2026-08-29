import { useState, type FormEvent } from "react";
import type { Category, Item } from "../api/items";
import { CATEGORIES, CATEGORY_LABELS } from "../api/items";

interface WardrobeFormProps {
  item?: Item | null;
  submitting: boolean;
  error: string | null;
  onSubmit: (data: { name: string; category: Category; image: File | null }) => void;
  onCancel: () => void;
}

export default function WardrobeForm({
  item,
  submitting,
  error,
  onSubmit,
  onCancel,
}: WardrobeFormProps) {
  const isEdit = item != null;
  const [name, setName] = useState(item?.name ?? "");
  const [category, setCategory] = useState<Category>(
    item?.category ?? "oberteil",
  );
  const [image, setImage] = useState<File | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      return;
    }
    onSubmit({ name: name.trim(), category, image });
  }

  return (
    <div className="form-overlay" role="dialog" aria-modal="true">
      <form className="card wardrobe-form" onSubmit={handleSubmit}>
        <h2 className="wardrobe-form__title">
          {isEdit ? "Stück bearbeiten" : "Neues Stück"}
        </h2>

        {error && <div className="alert alert--error">{error}</div>}

        <label className="wardrobe-form__field">
          <span className="wardrobe-form__label">Name</span>
          <input
            className="input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="z. B. Rotes Abendkleid"
            required
          />
        </label>

        <label className="wardrobe-form__field">
          <span className="wardrobe-form__label">Kategorie</span>
          <select
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </label>

        <label className="wardrobe-form__field">
          <span className="wardrobe-form__label">
            Bild{isEdit ? " (optional, neues Bild ersetzt das alte)" : ""}
          </span>
          <input
            className="input"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            required={!isEdit}
          />
        </label>

        <div className="wardrobe-form__actions">
          <button
            type="button"
            className="btn btn--secondary"
            onClick={onCancel}
            disabled={submitting}
          >
            Abbrechen
          </button>
          <button
            type="submit"
            className="btn btn--primary"
            disabled={submitting || (!isEdit && !image)}
          >
            {submitting ? "Speichern …" : isEdit ? "Speichern" : "Anlegen"}
          </button>
        </div>
      </form>
    </div>
  );
}
