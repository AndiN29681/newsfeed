# CLAUDE.md – Projektregeln für Claude Code

Dieses Dokument beschreibt, wie an diesem Projekt gearbeitet werden soll. Es ist für Claude Code optimiert und enthält alle relevanten Richtlinien, Konventionen und Einschränkungen.

---

## Architekturprinzipien

- **RSS-First**: Alle Nachrichten stammen aus RSS-Feeds. Keine Datenbank, kein externes Scraper-Setup.
- **Proxy-basiertes CORS-Handling**: Externe RSS-Feeds werden über den internen Proxy `/api/rss-proxy` abgerufen, um CORS-Probleme zu umgehen.
- **Client-seitige Suche**: Die Suche findet vollständig im Browser statt. Kein Backend-Search-Index.
- **Stateless**: Keine Session-Speicherung, kein Login, keine Nutzerdaten.
- **Next.js App Router**: `src/app/` für alle Seiten und Routen.

---

## Coding Style

- **TypeScript** überall. Keine `any`-Typen, immer explizite Typen.
- **`'use client'`** bei allen Komponenten, die Interaktivität benötigen (Suchleiste, Ergebnisliste).
- **Kleine, fokussierte Funktionen**: Jede Funktion hat eine klare Aufgabe.
- **Async/Await** statt `.then()` Ketten.
- **Fehlerbehandlung**: Jede async-Funktion hat `try/catch` und gibt bei Fehler einen sinnvollen Default zurück (`[]`, `null`, `''`).
- **Keine Magic Numbers**: Alle Limits (z. B. max 10 Ergebnisse, 5s Timeout) als Konstante definieren.
- **Kommentare auf Deutsch**: Alle Kommentare und User-Facing-Texte auf Deutsch.
- **Einzeilige Kommentare** mit `//` für Inline-Erklärungen.

---

## Namenskonventionen

| Element | Konvention | Beispiel |
|---------|-----------|----------|
| Dateien | `kebab-case.ts` | `rss.ts`, `search-bar.tsx` |
| Komponenten | `PascalCase.tsx` | `SearchBar.tsx`, `ResultCard.tsx` |
| Funktionen | `camelCase` | `fetchRssFeed()`, `searchNews()` |
| Konstanten | `UPPER_SNAKE_CASE` | `germanFeeds`, `MAX_RESULTS` |
| Types | `PascalCase` | `NewsItem`, `BareArticle` |
| API-Routen | `kebab-case` | `rss-proxy/route.ts` |
| Verzeichnisse | `kebab-case` | `src/lib/`, `src/components/` |

---

## Projektregeln

1. **Keine API-Keys committen**. `.env`-Dateien sind in `.gitignore` aufgenommen.
2. **Jede neue RSS-URL** muss in `src/lib/rss.ts` unter den entsprechenden regionalen Arrays (`localMunichFeeds`, `freisingErdingFeeds`, `goslarHarzFeeds`) oder den Themen-Arrays (`automotiveFeeds`, `cyclingFeeds`, `kiFeeds`) eingetragen werden.
3. **Jeder neue Feed** muss über den Proxy `/api/rss-proxy` abgerufen werden – niemals direkt von der Client-Seite.
4. **Jede Suchanfrage** muss den Fortschrittsbalken aktualisieren (`rssProgress`).
5. **Keine verschachtelten `<form>`-Elemente** – das verursacht einen Hydration-Fehler.
6. **`versionInfo`** muss immer statisch sein (keine `typeof window`-Checks, keine `Date.now()`-Abhängigkeiten im Render-Pfad).
7. **`next.config.ts`** muss `images.remotePatterns` für alle externen Image-Domains enthalten.

---

## Erlaubte Libraries

| Bibliothek | Zweck | Status |
|-----------|-------|--------|
| `next` (v16+) | Framework, Routing, API-Routes | ✅ Erlaubt |
| `react` (v19+) | UI-Komponenten | ✅ Erlaubt |
| `lucide-react` | Icons | ✅ Erlaubt |
| `@anthropic-ai/sdk` | Claude API für Zusammenfassungen | ✅ Erlaubt |
| `typescript` | Typisierung | ✅ Erlaubt |

---

## Verbotene Libraries

| Bibliothek | Grund |
|-----------|-------|
| `axios` | Kein HTTP-Client nötig – `fetch` reicht |
| `zustand` / `redux` | Kein globaler State nötig |
| `mongodb` / `prisma` | Keine Datenbank |
| `cheerio` / `puppeteer` | Kein Server-Side-Scraping |
| `cors` / `helmet` | Proxy ist intern, keine externen Middleware nötig |
| Jede andere RSS-Bibliothek | Eigenes Parsing mit `DOMParser` |

---

## Teststrategie

- **Lokaler Test**: `npm run dev` → `http://localhost:3000` → Suche nach Begriffen testen.
- **Proxy-Test**: `curl "http://localhost:3000/api/rss-proxy?url=https://www.deutschlandfunk.de/nachrichten-100.rss"` → XML-Antwort prüfen.
- **Keine Unit-Tests** für das Frontend (zu klein, zu einfach).
- **Keine E2E-Tests** (kein Testing-Framework konfiguriert).
- **Manuelle Regression**: Nach jedem Commit die Suche mit 2–3 verschiedenen Begriffen testen.

---

## Commit-Konventionen

```
<typ>(<bereich>): <kurze beschreibung>

[optional: längere erklärung]
```

**Typen:**
| Typ | Wann |
|-----|------|
| `feat` | Neue Funktion |
| `fix` | Bugfix |
| `docs` | Dokumentation (README, PROJECT.md, CLAUDE.md) |
| `style` | Formatierung, keine Logik-Änderung |
| `refactor` | Code-Umstrukturierung |
| `chore` | Build-Tools, Config, Abhängigkeiten |
| `test` | Testdateien oder Test-Setup |

**Beispiele:**
```
feat(rss): add Deutschlandfunk feed to localMunichFeeds
fix(hydration): remove versionInfo dynamic values
feat(proxy): create internal RSS proxy for CORS bypass
chore(config): update next.config.ts image domains
```

---

## Vorgehensweise bei Refactorings

1. **Zuerst verstehen**: Lies die betroffenen Dateien vollständig durch.
2. **Kleine Schritte**: Ändere nur eine Sache pro Commit.
3. **Lokal testen**: Nach jeder Änderung `npm run dev` starten und testen.
4. **Keine Umbenennungen ohne Grund**: Dateinamen und Pfade stabil halten.
5. **Alten Code nicht löschen**, bevor der neue nicht funktioniert.
6. **Hydration-Fehler sofort beheben** – sie blockieren die Nutzung.

---

## Prioritäten (Reihenfolge)

1. **Stabilität**: Kein Crash, kein Hydration-Fehler, kein unhandled Promise-Rejection.
2. **Funktionalität**: RSS-Feeds laden und anzeigen.
3. **Suche**: Suchbegriff wird in Titel und Content gefunden.
4. **UX**: Fortschrittsbalken, klare Fehlermeldungen, responsive UI.
5. **Performance**: Parallelität bei Feed-Requests, Deduplizierung.
6. **Erweiterbarkeit**: Neue Feeds einfach hinzufügen können.

---

## Was niemals verändert werden darf

1. **`src/app/api/rss-proxy/route.ts`** – Der Proxy-Endpunkt ist die einzige Möglichkeit, CORS zu umgehen. Keine Änderungen an der Auth-Logik, es sei denn, ein neuer Proxy wird explizit benötigt.
2. **`src/lib/rss.ts` – `fetchRssFeed` Signatur** – Die Funktion muss immer `Promise<{ title: string, content: string, link: string }[]>` zurückgeben.
3. **`next.config.ts` – `images.remotePatterns`** – Muss immer `via.placeholder.com` und alle genutzten externen Domains enthalten.
4. **`'use client'` Directive** – Darf nicht aus Page-Komponenten entfernt werden.
5. **`src/app/layout.tsx` – HTML-Lang-Attribut** – Muss `lang="de"` sein für deutsche Inhalte.

---

## Qualitätsanforderungen

### Code-Qualität
- **Keine TypeScript-Fehler** (`tsc --noEmit` muss clean sein).
- **Keine unbehandelten Promise-Rejections**.
- **Jede Funktion hat JSDoc-Kommentare** (kurz, auf Deutsch).
- **Keine auskommentierten Code-Blöcke** (alte Implementierungen löschen).
- **Consistente Indentation**: 2 Spaces.
- **Consistente Quotes**: Single Quotes (`'`) überall.

### UI-Qualität
- **Keine leeren Ergebnislisten** ohne Erklärung (Zeige "Keine Ergebnisse gefunden." mit Hinweis).
- **Jede Aktion hat visuelles Feedback** (Loading-Spinner, Progress-Bar).
- **Fehlermeldungen sind nutzerfreundlich** (kein Raw-Stacktrace).
- **Responsive**: Funktioniert auf Mobile und Desktop.

### Sicherheit
- **Keine API-Keys im Frontend-Code**.
- **Keine XSS-Anfälligkeiten**: RSS-Inhalte werden immer escaped (`replace(/<[^>]*>/g, '')`).
- **Proxy-Endpunkt validiert die URL** (muss mit `http://` oder `https://` beginnen).

---

## Schnellstart für neue Entwickler

```bash
# 1. Repository klonen
git clone <repo-url>
cd newsfeed

# 2. Abhängigkeiten installieren
npm ci

# 3. Entwicklung starten
npm run dev

# 4. Im Browser öffnen
# http://localhost:3000

# 5. Suche testen
# Gib "München" oder "KI" ein → Ergebnisse erscheinen
```

---

## Häufige Fehler und Lösungen

| Fehler | Ursache | Lösung |
|--------|---------|--------|
| Hydration mismatch | `typeof window` oder `Date.now()` im Render | Statische Werte verwenden |
| Nested form error | `<form>` in `<form>` | Form nur einmal verwenden, `SearchBar` ohne `<form>` |
| CORS error | Direkter Fetch von Client | Proxy `/api/rss-proxy` verwenden |
| No results | Alle Feeds geben `[]` zurück | Proxy-URL prüfen, Feed-URL validieren |
| Image error | `via.placeholder.com` nicht whitelisted | `next.config.ts` `images.remotePatterns` erweitern |
| `versionInfo` undefined | Variable gelöscht aber noch referenziert | `versionInfo`-Referenzen aus JSX entfernen |

---

## Zusammenfassung

> **Dieses Projekt ist ein einfaches, aber gut strukturiertes RSS-Aggregator-Projekt.**  
> Die wichtigsten Regeln: **Keine API-Keys im Frontend, Proxy für CORS, kein verschachteltes `<form>`, statische Version-Info, TypeScript überall, deutsche Kommentare.**

Bei Fragen: Lies zuerst `PROJECT.md` und `AGENTS.md`, dann diese `CLAUDE.md`.