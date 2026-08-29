import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { get } from "../api/client";
import { createOutfit, resolveImageUrl, type Item } from "../api/outfits";
import "../outfits.css";

const OCCASIONS = ["Gala", "Premiere", "Alltag", "Abendessen", "Cocktail"];

export default function CreatorPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [name, setName] = useState("");
  const [occasion, setOccasion] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await get<Item[]>("/items");
        if (!cancelled) setItems(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Die Garderobe konnte nicht geladen werden.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = items.filter((item) => selectedIds.includes(item.id));

  function toggleItem(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  async function handleSave() {
    if (!name.trim()) {
      setSaveError("Bitte gib dem Outfit einen Namen.");
      return;
    }
    if (selectedIds.length === 0) {
      setSaveError("Wähle mindestens ein Kleidungsstück aus.");
      return;
    }
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      await createOutfit({
        name: name.trim(),
        occasion,
        item_ids: selectedIds,
      });
      setSaved(true);
      setName("");
      setOccasion("");
      setSelectedIds([]);
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

  return (
    <section className="page">
      <header className="page-header">
        <h1>Outfit-Creator</h1>
        <p className="page-subtitle">
          Kombiniere deine Kleidungsstücke zu einem Outfit.
        </p>
      </header>

      {error && <div className="alert alert--error">{error}</div>}
      {saved && (
        <div className="alert alert--success">
          Outfit gespeichert. <Link to="/outfits">Zu deinen Outfits</Link>
        </div>
      )}

      <div className="creator">
        <aside className="creator__picker">
          <h2>Kleidungsstücke</h2>
          {loading ? (
            <p className="page-subtitle">Lädt …</p>
          ) : items.length === 0 ? (
            <p className="page-subtitle">Deine Garderobe ist leer.</p>
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
                  <small>{item.category}</small>
                </button>
              ))}
            </div>
          )}
        </aside>

        <div className="creator__stage">
          <h2>Deine Auswahl</h2>

          {selected.length === 0 ? (
            <div className="empty-state">
              Wähle links Kleidungsstücke aus, um dein Outfit zusammenzustellen.
            </div>
          ) : (
            <div className="stage-grid">
              {selected.map((item) => (
                <figure key={item.id} className="stage-item">
                  <button
                    type="button"
                    className="stage-item__remove"
                    onClick={() => toggleItem(item.id)}
                    aria-label={`${item.name} entfernen`}
                  >
                    ×
                  </button>
                  <img src={resolveImageUrl(item.image_url)} alt={item.name} />
                  <figcaption>{item.name}</figcaption>
                </figure>
              ))}
            </div>
          )}

          <div className="creator__form">
            <label className="field">
              <span className="field__label">Name</span>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="z. B. Roter Teppich"
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
                {OCCASIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>

            {saveError && <div className="alert alert--error">{saveError}</div>}

            <div className="creator__actions">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={clearSelection}
                disabled={selectedIds.length === 0}
              >
                Auswahl leeren
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => void handleSave()}
                disabled={saving}
              >
                {saving ? "Speichern …" : "Outfit speichern"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
