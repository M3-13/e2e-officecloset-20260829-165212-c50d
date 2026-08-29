# Glamouröser Kleiderschrank-Manager

Ein glamouröser Kleiderschrank-Manager mit Web-Oberfläche im Hollywood-/Red-Carpet-Stil:
Benutzer registrieren sich, legen Kleidungsstücke mit Bild, Name und fester Kategorie an,
durchstöbern ihre persönliche Garderobe und kombinieren im Outfit-Creator Einzelteile zu
gespeicherten Outfits mit Name, Anlass-Tag und Bildzusammenstellung. Jeder Benutzer sieht
ausschließlich seine eigenen Daten.

## Tech-Stack

- **Backend**: Python mit FastAPI, SQLAlchemy (SQLite), JWT-Auth (PyJWT), Argon2-Passwort-Hashing
- **Frontend**: React mit Vite (TypeScript)
- **Bild-Speicher**: lokaler Upload-Ordner
- **Schnittstelle**: REST-API unter `/api/v1`

## Installation

### Backend

```bash
cd backend
py -m pip install -r requirements.txt
```

### Frontend

```bash
cd frontend
npm install
```

## Start

### Backend (Entwicklung)

```bash
py -m uvicorn app.main:app --app-dir backend --port 8000
```

Der Server antwortet danach unter `http://localhost:8000`, Health-Check unter
`http://localhost:8000/api/v1/health` (liefert `{"status":"ok"}`).

### Frontend (Entwicklung)

```bash
cd frontend
npm run dev
```

## Umgebungsvariablen

Das Backend liest seine Konfiguration aus der Umgebung. Alle Werte haben sinnvolle
Standards, sodass ein frisch geklontes Repo ohne manuelle Einrichtung startet.

| Variable | Standard | Beschreibung |
| --- | --- | --- |
| `DATABASE_URL` | `sqlite:///./wardrobe.db` | SQLAlchemy-URL der Datenbank |
| `SECRET_KEY` | (zufällig pro Start) | Signier-Schlüssel für JWTs; wenn nicht gesetzt, wird pro Start ein zufälliger Schlüssel erzeugt |
| `FRONTEND_ORIGIN` | `http://localhost:5173` | Für CORS erlaubte Frontend-Origin |
| `UPLOAD_DIR` | `backend/uploads` | Verzeichnis für hochgeladene Bilder |
| `MAX_UPLOAD_SIZE` | `5MB` | Maximalgröße eines Uploads (z. B. `5MB`, `512KB`) |

Einen festen `SECRET_KEY` für stabile Sessions über Neustarts hinweg erzeugst du so:

```bash
# PowerShell (Windows)
py -c "import secrets; print(secrets.token_hex(32))"

# Bash (Linux/macOS)
python3 -c "import secrets; print(secrets.token_hex(32))"
```

Ein vollständiges Beispiel liegt in `.env.example` (nach `.env` kopieren und Werte eintragen).

## Öffentliche API

Basis: `/api/v1`, JSON. Fehler: `{"detail": "..."}`; Validierungsfehler: `{"detail": [...]}`.
Auth: Header `Authorization: Bearer <JWT>`, Claim `sub` = `user_id`.

| Methode | Pfad | Beschreibung | Auth |
| --- | --- | --- | --- |
| `GET` | `/api/v1/health` | Health-Check → `{"status":"ok"}` | nein |
| `POST` | `/api/v1/auth/register` | `{email, password}` → `User` | nein |
| `POST` | `/api/v1/auth/login` | `{email, password}` → `{access_token, token_type}` | nein |
| `POST` | `/api/v1/auth/logout` | Abmelden → `204` | ja |
| `DELETE` | `/api/v1/account` | Konto samt Daten löschen → `204` | ja |
| `GET` | `/api/v1/items` | Eigene Kleidungsstücke (Filter `?category=`) | ja |
| `POST` | `/api/v1/items` | Multipart `name, category, image` → `Item` | ja |
| `GET` | `/api/v1/items/{id}` | Ein Kleidungsstück | ja |
| `PUT` | `/api/v1/items/{id}` | Multipart, optionales Bild | ja |
| `DELETE` | `/api/v1/items/{id}` | Stück samt Bild löschen → `204` | ja |
| `GET` | `/api/v1/outfits` | Eigene Outfits | ja |
| `POST` | `/api/v1/outfits` | `{name, occasion, item_ids}` → `Outfit` | ja |
| `GET` | `/api/v1/outfits/{id}` | Ein Outfit | ja |
| `PUT` | `/api/v1/outfits/{id}` | `{name, occasion, item_ids}` | ja |
| `DELETE` | `/api/v1/outfits/{id}` | Outfit löschen → `204` | ja |

## Datenmodelle

- `User`: `{id, email}`
- `Item`: `{id, name, category, image_url}` — `category` ∈ `oberteil | unterteil | schuhe | accessoires | kleid`
- `Outfit`: `{id, name, occasion, items: [Item]}`

`image_url` ist relativ (`/uploads/<datei>`); das Frontend stellt `VITE_BACKEND_URL` voran.

## Features

- Registrierung, Anmeldung und Abmeldung (JWT)
- Garderobe mit Bild-Upload, Kategorie-Filter, Bearbeiten und Löschen
- Outfit-Creator zum Kombinieren mehrerer Stücke zu einem Outfit mit Name und Anlass
- Besitzprüfung: jeder Benutzer sieht nur seine eigenen Stücke und Outfits
- Konto-Löschung inkl. vollständiger Datenbereinigung
- Impressum und Datenschutz
