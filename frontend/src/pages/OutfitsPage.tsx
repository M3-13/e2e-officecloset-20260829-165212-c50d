import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get } from "../api/client";
import {
  deleteOutfit,
  listOutfits,
  resolveImageUrl,
  updateOutfit,
  type Item,
  type Outfit,
  type OutfitInput,
} from "../api/outfits";
import OutfitCard from "../components/OutfitCard";
import "../outfits.css";

const OCCASIONS = ["Gala", "Premiere", "Alltag", "Abendessen", "Cocktail"];

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewing, setViewing] = useState<Outfit | null>(null);
  const [editing, setEditing] = useState<Outfit | null>(null);

  const [items, setItems] = useState<Item[]>([]);
  const [name, setName] = useState("");
  const [occasion, setOccasion] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await listOutfits();
      setOutfits(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Die Outfits konnten nicht geladen werden.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  function openEditor(outfit: Outfit) {
    setEditing(outfit);
    setName(outfit.name);
    setOccasion(outfit.occasion);
    setSelectedIds(outfit.items.map((item) => item.id));
    setSaveError(null);
    void loadItems();
  }

  async function loadItems() {
    try {
      const data = await get<Item[]>("/items");
      setItems(data);
    } catch {
      setItems([]);
    }
  }

  function closeEditor() {
    setEditing(null);
    setSaveError(null);
  }

  function toggleItem(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function handleSave() {
    if (!editing) return;
    if (!name.trim()) {
      setSaveError("Bitte gib dem Outfit einen Namen.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const input: OutfitInput = {
        name: name.trim(),
        occasion,
        item_ids: selectedIds,
      };
      await updateOutfit(editing.id, input);
      closeEditor();
      await load();
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : "Das Outfit konnte nicht gespeichert werden.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(outfit: Outfit) {
    if (!window.confirm(`Outfit „${outfit.name}" wirklich löschen?`)) {
      return;
    }
    try {
      await deleteOutfit(outfit.id);
      setViewing((v) => (v && v.id === outfit.id ? null : v));
      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Das Outfit konnte nicht gelöscht werden.",
      );
    }
  }

  const occasionOptions = OCCASIONS.includes(occasion)
    ? OCCASIONS
    : [...OCCASIONS, occasion];

  return (
    <section className="page">
      <header className="page-header">
        <h1>Outfits</h1>
        <p className="page-subtitle">Deine gespeicherten Outfits.</p>
      </header>

      {error && <div className="alert alert--error">{error}</div>}

      {loading ? (
        <div className="empty-state">Outfits werden geladen …</div>
      ) : outfits.length === 0 ? (
        <div className="empty-state">
          Du hast noch keine Outfits gespeichert.
          <br />
          Erstelle sie im <Link to="/creator">Outfit-Creator</Link>.
        </div>
      ) : (
        <div className="outfit-grid">
          {outfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              onOpen={setViewing}
              onEdit={openEditor}
              onDelete={(o) => void handleDelete(o)}
            />
          ))}
        </div>
      )}

      {viewing && (
        <div className="modal-overlay" onClick={() => setViewing(null)}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{viewing.name}</h2>
            {viewing.occasion && (
              <span className="outfit-card__occasion">{viewing.occasion}</span>
            )}
            {viewing.items.length === 0 ? (
              <p className="page-subtitle">Dieses Outfit enthält keine Teile.</p>
            ) : (
              <div className="outfit-view__grid">
                {viewing.items.map((item) => (
                  <figure key={item.id} className="outfit-view__item">
                    <img
                      src={resolveImageUrl(item.image_url)}
                      alt={item.name}
                    />
                    <figcaption>{item.name}</figcaption>
                  </figure>
                ))}
              </div>
            )}
            <div className="modal__actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => {
                  const outfit = viewing;
                  setViewing(null);
                  openEditor(outfit);
                }}
              >
                Bearbeiten
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setViewing(null)}
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="modal-overlay" onClick={closeEditor}>
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Outfit bearbeiten</h2>

            <label className="field">
              <span className="field__label">Name</span>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label className="field">
              <span className="field__label">Anlass</span>
              <select
                className="input"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
              >
                <option value="">— Anlass wählen —</option>
                {occasionOptions.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>

            <div className="field">
              <span className="field__label">Kleidungsstücke</span>
              {items.length === 0 ? (
                <p className="page-subtitle">
                  Keine Kleidungsstücke vorhanden.
                </p>
              ) : (
                <div className="picker">
                  {items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={
                        selectedIds.includes(item.id)
                          ? "picker__item picker__item--selected"
                          : "picker__item"
                      }
                      onClick={() => toggleItem(item.id)}
                      aria-pressed={selectedIds.includes(item.id)}
                    >
                      <img
                        src={resolveImageUrl(item.image_url)}
                        alt={item.name}
                        loading="lazy"
                      />
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {saveError && <div className="alert alert--error">{saveError}</div>}

            <div className="modal__actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={closeEditor}
              >
                Abbrechen
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => void handleSave()}
                disabled={saving}
              >
                {saving ? "Speichern …" : "Speichern"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
