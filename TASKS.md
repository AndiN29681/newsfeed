# TASKS.md – Implementierungsplan

## 🎯 Übersicht

Dieser Plan zerlegt das **Deutschland News Aggregator-Projekt** in kleine, selbständige Tasks. Jeder Task ist:
- **Unabhängig** – liefert Mehrwert ohne vorherige Tasks
- **Zeitlich begrenzt** – max. 1–2 Std.
- **Testbar** – klare Definition of Done (DoD)

---

## 📌 CORE FEED

### 1. Projekt-Setup & Repo
- **Aufwand:** 15 Min.
- **Task-ID:** CORE-SETUP

**Definition of Done:**
- Repo für `newsfeed` erstellt
- README.md mit Projektbeschreibung
- CLAUDE.md & PROJECT.md angelegt
- `.gitignore` (node_modules, .env, .next)
- `npm ci` erfolgreich durchgeführt

---

## 📡 FEED SYSTEM

### 2. RSS-Parser-Utility
- **Aufwand:** 45 Min.
- **Task-ID:** RSS-PARSE

**Definition of Done:**
- `src/lib/rss.ts` mit `fetchRssFeed()`
- DOMParser-Implementierung vollständig
- HTML-Tags & Entities gereinigt
- Unit-Test für 1 Test-Feed

---

### 3. Lokalisation Feed-Liste
- **Aufwand:** 30 Min.
- **Task-ID:** RSS-FEED

**Definition of Done:**
- `germanFeeds[]` Array mit korrekten URLs
- Alle Feeds per Proxy testbar
- Mind. 5 gültige RSS-Feeds

---

## ⚡ SEARCH ENGINE

### 4. Such-Logik
- **Aufwand:** 60 Min.
- **Task-ID:** SEARCH-LOGIC

**Definition of Done:**
- `searchNews()` Filtert nach Stichwort
- Deduplication via `Map<Titel,Item>`
- Max. 10 Ergebnisse zurückgegeben
- `loading`, `error`, `summary` States verwaltet

---

### 5. Hydration-Fix
- **Aufwand:** 30 Min.
- **Task-ID:** HYDRATE

**Definition of Done:**
- Keine `typeof window` Checks in Render-Pfad
- `versionInfo` statisch (`dev`)
- Kein `<form>` in `<form>`
- Browser-Konsolen-Error `Cannot read property...` behoben

---

## 🌐 API & PROXY

### 6. CORS Proxy
- **Aufwand:** 45 Min.
- **Task-ID:** CORS-PROXY

**Definition of Done:**
- `src/app/api/rss-proxy/route.ts` erstellt
- CORS-Header `Access-Control-Allow-Origin: *`
- 301/302 Redirects korrekt gehandhabt
- cURL-Test erfolgreich

---

### 7. Konfiguration
- **Aufwand:** 20 Min.
- **Task-ID:** CONFIG

**Definition of Done:**
- `next.config.ts` mit Image-Domains
- `via.placeholder.com` erlaubt
- Output auf `standalone`
- Build grün

---

## 🇦‍🏛️ UX/UI

### 8. Eingabe-Komponente
- **Aufwand:** 30 Min.
- **Task-ID:** UI-SB

**Definition of Done:**
- `SearchBar` mit Form-Submit
- `onFocus`/`onBlur` Animation
- Platzhalter‑Text `Schlagwort eingeben...`
- Lösch-Button erscheint

---

### 9. Ergebnis-Darstellung
- **Aufwand:** 45 Min.
- **Task-ID:** UI-RC

**Definition of Done:**
- `ResultCard` zeigt Titel, Quelle, Link
- Bild via `next/image`
- Hover-Effekte
- Responsive Layout

---

### 10. Progress Bar
- **Aufwand:** 30 Min.
- **Task-ID:** UI-PROGRESS

**Definition of Done:**
- Balken unter Suchleiste
- `3/8 Feeds geladen` Anzeige
- Animation beim Laden
- Ausblendung nach Abschluss

---

## 🔐 SICHERHEIT

### 11. Secret-Verwaltung
- **Aufwand:** 15 Min.
- **Task-ID:** SECURITY

**Definition of Done:**
- `.env.example` mit Platzhaltern
- `.env` in `.gitignore`
- Keine Secrets im Code
- `.env.local` für lokale Entwicklung

---

### 12. XSS-Protection
- **Aufwand:** 30 Min.
- **Task-ID:** XSS-FIX

**Definition of Done:**
- Alle RSS-Inhalte gescannt
- `replace(/<[^>]*>/g, '')` angewendet
- Keine `dangerouslySetInnerHTML`
- Manuelle Test-URLs belegt

---

## 🧪 QA & TESTING

### 13. End-to-End-Tests
- **Aufwand:** 90 Min.
- **Task-ID:** TEST-E2E

**Definition of Done:**
- `npm run build` ohne Fehler
- `npm start` startet
- Suche nach `München` liefert ≥3 Treffer
- Suche nach `KI` liefert ≥1 Treffer
- Fehlermeldung bei leerem Suchfeld

---

### 14. Performance-Optimierung
- **Aufwand:** 60 Min.
- **Task-ID:** PERF

**Definition of Done:**
- Load-Time < 2s
- 8 Feeds parallel, nicht nacheinander
- Memoisation von fetchResultaten (falls nötig)
- Lighthouse Score > 90 für Performance

---

## 🚀 RELEASES

### 15. GitHub Release
- **Aufwand:** 30 Min.
- **Task-ID:** RELEASE

**Definition of Done:**
- `git tag v1.0.0`
- `git push --tags`
- CHANGELOG.md aktualisiert
- Release auf GitHub

---

## 🔄 NÄCHSTE SCHRITTE

| Reihenfolge | Task-ID | Titel |
|-------------|---------|-------|
| 1 | CORE-SETUP | Projekt-Setup & Repo |
| 5 | HYDRATE | Hydration-Fix |
| 3 | RSS-FEED | Lokalisation Feed-Liste |
| 2 | RSS-PARSE | RSS-Parser-Utility |
| 6 | CORS-PROXY | CORS Proxy |
| 4 | SEARCH-LOGIC | Such-Logik |
| 12 | XSS-FIX | XSS-Protection |
| 7 | CONFIG | Konfiguration |
| 8 | UI-SB | Eingabe-Komponente |
| 9 | UI-RC | Ergebnis-Darstellung |
| 10 | UI-PROGRESS | Progress Bar |
| 11 | SECURITY | Secret-Verwaltung |
| 13 | TEST-E2E | End-to-End-Tests |
| 14 | PERF | Performance-Optimierung |
| 15 | RELEASE | GitHub Release |

---

💡 **Tipps:**
- Parallelisierbar: UI-Aufgaben (8–10) können parallel laufen
- Priorität: Hydration (5) & CORS (6) sind Blocker für lokale Tests
- Nach jedem Task: Browser testen & kleiner Commit