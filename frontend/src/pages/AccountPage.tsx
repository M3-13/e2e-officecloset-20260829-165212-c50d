import { useState, type CSSProperties } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthApiError } from "../api/auth";

const cardStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-3)",
  alignItems: "flex-start",
};

const rowStyle: CSSProperties = {
  display: "flex",
  gap: "var(--space-2)",
  flexWrap: "wrap",
};

function errorMessage(error: unknown): string {
  if (error instanceof AuthApiError) {
    switch (error.status) {
      case 401:
        return "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.";
      default:
        return error.message;
    }
  }
  return error instanceof Error ? error.message : "Löschen fehlgeschlagen.";
}

export default function AccountPage() {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setError(null);
    setDeleting(true);
    try {
      await deleteAccount();
      navigate("/login", { replace: true });
    } catch (err) {
      setError(errorMessage(err));
      setDeleting(false);
      setConfirming(false);
    }
  }

  return (
    <section className="page">
      <header className="page-header">
        <h1>Konto</h1>
        <p className="page-subtitle">Verwalte dein Konto und deine Daten.</p>
      </header>

      <div className="card" style={cardStyle}>
        <p className="page-subtitle">
          Angemeldet als <strong style={{ color: "var(--color-fg)" }}>{user?.email}</strong>
        </p>
        <button className="btn btn--secondary" type="button" onClick={logout}>
          Abmelden
        </button>
      </div>

      <div className="card" style={cardStyle}>
        <h2>Konto löschen</h2>
        <p className="page-subtitle">
          Beim Löschen werden dein Konto, deine Garderobe, deine Outfits und alle
          hochgeladenen Bilder dauerhaft entfernt. Dieser Schritt kann nicht
          rückgängig gemacht werden.
        </p>

        {error && (
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        )}

        {!confirming ? (
          <button
            className="btn btn--danger"
            type="button"
            onClick={() => setConfirming(true)}
          >
            Konto löschen
          </button>
        ) : (
          <div style={cardStyle}>
            <p className="page-subtitle">
              Bist du sicher? Alle deine Daten gehen dauerhaft verloren.
            </p>
            <div style={rowStyle}>
              <button
                className="btn btn--danger"
                type="button"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Wird gelöscht …" : "Ja, Konto endgültig löschen"}
              </button>
              <button
                className="btn btn--secondary"
                type="button"
                onClick={() => setConfirming(false)}
                disabled={deleting}
              >
                Abbrechen
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
