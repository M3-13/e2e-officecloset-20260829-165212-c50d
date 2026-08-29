import { useState, type CSSProperties, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthApiError } from "../api/auth";

const formStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-3)",
};

const fieldStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-1)",
  textAlign: "left",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function errorMessage(error: unknown): string {
  if (error instanceof AuthApiError) {
    switch (error.status) {
      case 409:
        return "Diese E-Mail-Adresse ist bereits registriert.";
      case 400:
      case 422:
        return "Bitte gib eine gültige E-Mail-Adresse und ein Passwort an.";
      case 429:
        return "Zu viele Anfragen. Bitte versuche es später erneut.";
      default:
        return error.message;
    }
  }
  return error instanceof Error ? error.message : "Registrierung fehlgeschlagen.";
}

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!EMAIL_PATTERN.test(email)) {
      setError("Bitte gib eine gültige E-Mail-Adresse an.");
      return;
    }
    if (password.length === 0) {
      setError("Bitte gib ein Passwort an.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await register(email, password);
      navigate("/login", { replace: true, state: { registered: true } });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page">
      <header className="page-header">
        <h1>Registrieren</h1>
        <p className="page-subtitle">Erstelle dein Konto.</p>
      </header>

      <form className="card" style={formStyle} onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        )}

        <label style={fieldStyle}>
          <span style={{ color: "var(--color-muted)" }}>E-Mail</span>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label style={fieldStyle}>
          <span style={{ color: "var(--color-muted)" }}>Passwort</span>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
        </label>

        <button
          className="btn btn--primary"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Registrieren …" : "Registrieren"}
        </button>

        <p className="page-subtitle">
          Schon ein Konto? <Link to="/login">Anmelden</Link>
        </p>
      </form>
    </section>
  );
}
