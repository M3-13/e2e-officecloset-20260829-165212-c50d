import { useState, type CSSProperties, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

function errorMessage(error: unknown): string {
  if (error instanceof AuthApiError) {
    switch (error.status) {
      case 401:
        return "E-Mail oder Passwort ist falsch.";
      case 429:
        return "Zu viele Anmeldeversuche. Bitte versuche es in einer Minute erneut.";
      default:
        return error.message;
    }
  }
  return error instanceof Error ? error.message : "Anmeldung fehlgeschlagen.";
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const justRegistered = (location.state as { registered?: boolean } | null)
    ?.registered;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/wardrobe", { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="page">
      <header className="page-header">
        <h1>Anmelden</h1>
        <p className="page-subtitle">
          Melde dich an, um auf deine Garderobe zuzugreifen.
        </p>
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
            autoComplete="current-password"
            required
          />
        </label>

        <button
          className="btn btn--primary"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Anmelden …" : "Anmelden"}
        </button>

        <p className="page-subtitle">
          Noch kein Konto? <Link to="/register">Jetzt registrieren</Link>
        </p>
      </form>
    </section>
  );
}
