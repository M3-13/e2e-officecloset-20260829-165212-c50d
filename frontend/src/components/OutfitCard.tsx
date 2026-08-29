import type { Outfit } from "../api/outfits";
import { resolveImageUrl } from "../api/outfits";

interface OutfitCardProps {
  outfit: Outfit;
  onOpen: (outfit: Outfit) => void;
  onEdit: (outfit: Outfit) => void;
  onDelete: (outfit: Outfit) => void;
}

export default function OutfitCard({
  outfit,
  onOpen,
  onEdit,
  onDelete,
}: OutfitCardProps) {
  const items = outfit.items ?? [];
  const preview = items.slice(0, 4);
  const overflow = items.length - preview.length;

  return (
    <article className="outfit-card card">
      <button
        type="button"
        className="outfit-card__media"
        onClick={() => onOpen(outfit)}
        aria-label={`${outfit.name} öffnen`}
      >
        {preview.length === 0 ? (
          <span className="outfit-card__empty">Keine Teile</span>
        ) : (
          <div className="outfit-card__grid">
            {preview.map((item) => (
              <img
                key={item.id}
                src={resolveImageUrl(item.image_url)}
                alt={item.name}
                className="outfit-card__img"
              />
            ))}
          </div>
        )}
        {overflow > 0 && (
          <span className="outfit-card__overflow">+{overflow}</span>
        )}
      </button>

      <div className="outfit-card__body">
        <h3 className="outfit-card__name">{outfit.name}</h3>
        {outfit.occasion && (
          <span className="outfit-card__occasion">{outfit.occasion}</span>
        )}
      </div>

      <div className="outfit-card__actions">
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => onEdit(outfit)}
        >
          Bearbeiten
        </button>
        <button
          type="button"
          className="btn btn--danger"
          onClick={() => onDelete(outfit)}
        >
          Löschen
        </button>
      </div>
    </article>
  );
}
