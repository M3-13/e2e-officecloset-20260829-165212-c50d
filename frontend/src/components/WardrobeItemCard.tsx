import type { Item } from "../api/items";
import { CATEGORY_LABELS, itemImageUrl } from "../api/items";

interface WardrobeItemCardProps {
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
  busy: boolean;
}

export default function WardrobeItemCard({
  item,
  onEdit,
  onDelete,
  busy,
}: WardrobeItemCardProps) {
  return (
    <article className="item-card">
      <div className="item-card__image">
        <img
          src={itemImageUrl(item.image_url)}
          alt={item.name}
          loading="lazy"
        />
      </div>
      <div className="item-card__body">
        <h3 className="item-card__name">{item.name}</h3>
        <span className="item-card__category">
          {CATEGORY_LABELS[item.category]}
        </span>
        <div className="item-card__actions">
          <button
            type="button"
            className="btn btn--secondary item-card__action"
            onClick={() => onEdit(item)}
            disabled={busy}
          >
            Bearbeiten
          </button>
          <button
            type="button"
            className="btn btn--danger item-card__action"
            onClick={() => onDelete(item)}
            disabled={busy}
          >
            Löschen
          </button>
        </div>
      </div>
    </article>
  );
}
