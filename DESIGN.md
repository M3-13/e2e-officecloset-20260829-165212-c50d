# Design — Project Identity

> This document is project-long-lived. Tokens are not changed without
> the Architect's approval. Developers MUST use these tokens
> instead of improvising their own colors/spacings.

## Style Direction

Dunkler, warmer Red-Carpet-/Hollywood-Look mit tiefem Anthrazit, Champagner-Gold und serifenbetonter Display-Typografie — glamourös, aber ruhig und klar bedienbar.

## Colors

- `--color-bg`: **#12100D**
- `--color-fg`: **#F5EFE2**
- `--color-accent`: **#C9A24B**
- `--color-border`: **#3A3228**
- `--color-muted`: **#A79B87**

## Typography

- `font_family`: 'Didot', 'Bodoni MT', 'Times New Roman', Georgia, serif
- `heading_weight`: 700
- `body_weight`: 400

## Spacing Scale

- `--space-0`: 4px
- `--space-1`: 8px
- `--space-2`: 12px
- `--space-3`: 16px
- `--space-4`: 24px
- `--space-5`: 32px
- `--space-6`: 48px

## Border-Radii

- `--radius-sm`: 4px
- `--radius-md`: 8px
- `--radius-lg`: 16px
- `--radius-pill`: 999px

## Components

### Button

min-height 44px, padding 12px 24px, radius md, font-weight 700, letter-spacing .02em; primary: bg accent #C9A24B, color bg #12100D, border 1px solid accent; hover: bg #D6B25C; active: bg #B18A3A; disabled: opacity .5, cursor not-allowed; secondary: bg transparent, color fg #F5EFE2, border 1px solid border #3A3228; secondary hover: border accent; danger: bg transparent, color #E2A099, border 1px solid #B3564A.

### Card

bg #1A1713, border 1px solid border #3A3228, radius lg 16px, padding 16px, shadow 0 8px 24px rgba(0,0,0,.35); Bildbereich im Verhältnis 4:5, radius md 8px, overflow hidden.

### Input

bg #1A1713, border 1px solid border #3A3228, radius md 8px, padding 12px 16px, min-height 44px, color fg #F5EFE2; placeholder color muted #A79B87; focus: border accent #C9A24B, box-shadow 0 0 0 3px rgba(201,162,75,.25); error: border #B3564A.

### FilterPill

min-height 40px, padding 8px 16px, radius pill 999px, bg transparent, border 1px solid border #3A3228, color muted #A79B87; hover: border accent #C9A24B; selected: bg accent #C9A24B, color bg #12100D, border accent.

### Modal

Overlay bg rgba(10,8,6,.7), backdrop-blur 4px; Dialog bg #1A1713, border 1px solid border #3A3228, radius lg 16px, padding 24px, max-width 520px, shadow 0 24px 64px rgba(0,0,0,.5).

### Navbar

height 64px, bg rgba(18,16,13,.9), backdrop-blur 8px, border-bottom 1px solid border #3A3228; Logo serif, font-weight 700, letter-spacing .04em, color fg #F5EFE2; Links color muted #A79B87, hover color fg.

### ImageTile

radius md 8px, object-fit cover, aspect-ratio 4/5, border 1px solid border #3A3228, bg #1A1713; hover: border accent #C9A24B.

### EmptyState

border 1px dashed border #3A3228, radius lg 16px, padding 32px, text-align center, color muted #A79B87.

### Alert

bg #1A1713, border-left 3px solid accent #C9A24B, radius md 8px, padding 12px 16px, color fg #F5EFE2; error: border-left #B3564A; success: border-left #7FA06E.

## Layout Principles

- Container max-width 1200px, zentriert; horizontale Abstände 16px mobil, 24px ab 640px, 32px ab 1280px.
- Breakpoints: 640px, 960px, 1280px; mobile-first Flex- und Grid-Layouts.
- Garderobe als responsives Bild-Grid: 2 Spalten unter 640px, 3 Spalten 640–959px, 4 Spalten 960–1279px, 5 Spalten ab 1280px; Abstand 16px.
- Outfit-Creator: Auswahl-/Filterleiste links (240–320px), Bildzusammenstellung als Bühne rechts; unter 960px vertikal gestapelt.
- Gold-Akzent nur für primäre Aktionen, aktive Filter und Fokus sparsam einsetzen; dunkle Flächen und großzügige Abstände erzeugen das Bühnen-Gefühl.
- Seitenstruktur: Navbar oben fixiert, Hauptbereich mit max-width, Footer mit Impressum- und Datenschutz-Links auf jeder Seite erreichbar.
