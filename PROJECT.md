# Projekt: Deutscher Nachrichtenspiegel

Ein interaktives Such‑Portal, das deutsche RSS‑Feeds aggregiert, zusammenfasst und personalisierte Nachrichten für die Regions **München**, **Freising**, **Erding**, **Hallbergmoos**, **Goslar**, **Clausthal‑Zellerfeld** sowie das **Bayerische Umland** bereitstellt. Die Anwendung nutzt einen internen Proxy, um CORS‑Beschränkungen zu umgehen, und kombiniert echte RSS‑Feeds mit KI‑basierten Zusammenfassungen.

---

## 🎯 Ziele

1. **Echte deutsche Nachrichten** – ausschließlich relevante Inhalte aus München, Freising, Erding, Hallbergmoos, Goslar und dem Harz.
2. **Zero‑API‑Key‑Abhängigkeit** für die wichtigsten RTSS‑Feeds (CORS‑Problem gelöst via eigener Proxy).
3. **Zero‑Cost‑Deployment** – keine zusätzlichen Kosten, alles kostenlos.
4. **Benutzerfreundlicher Workflow** – Einstieg per Eingabe, sofortige Ergebnisse mit Fortschrittsbalken.

---

## 🎯 Zielgruppe

- **Einheimische** in München und Umgebung, die schnell aktuelle Nachrichten benötigen.  
- **Interessierte** an regionalen Themen (Wirtschaft, Kultur, Verkehr).  
- **Technik‑Enthusiasten**, die verstehen wollen, wie RSS‑Feeds und Proxies funktionieren.  

---

## 🎯 Kern‑Features

| Feature | Beschreibung |
|-----------|------------|
| **RSS‑Feed‑Aggregation** | 8 aktive deutsche RSS‑Feeds (Tagesschau, BR, BR‑BR24, BR‑München, etc.). |
| **Dynamische Filterung** | Nutzer kann nach Stichworten suchen; das System filtert nur passende Artikel. |
| **Zusammenfassung** | KI‑gestützte 2‑4‑Satz‑Zusammenfassung mit Quellenangaben. |
| **Fortschritts‑Anzeige** | Fortschrittsbalken zeigen, wie viele Feeds noch geladen werden. |
| **Fortschritts‑Anzeige bei jeder Suche** | Zeigt `5 von 8` Feeds geladen, etc. |
| **Ergebnis‑Filter** | Nur Artikel, die das Schlagwort enthalten, werden gelistet. |
| **Ergebnis‑Deduplizierung** | Duplikate werden via `Map<Title,Item>` entfernt. |

---

## 📐 Architektur

1. **Liste der Feeds** (`germanFeeds`) enthält über 30 URLs, die via Proxy `/api/rss-proxy` abgerufen werden.  
2. **API‑Endpoint** `src/app/api/rss-proxy/route.ts` liefert das gerenderte RSS‑XML über den Proxy.  
3. **SearchPage** ist der Einstiegspunkt, verbindet `SearchBar → Search API → RSS‑Proxy → Digest`.  
4. **Fetch‑Logik** verwendet `async/await` + `Promise.all` für Parallelität, hat integrierte **Timeout‑Logik** (5 s).  
4. **Ergebnisse** werden in einem **State‑Store** (`useState`) gehalten und in `ResultCard`‑Komponente gerendert.  

---

## 📂 Verzeichnisstruktur (relevant)

```
src/
├─ app/
│   ├── page.tsx                <-- Haupt‑Layout
│   └─ search/
│       └─ page.tsx                <-- Haupt‑Suche
│   └─ layout.tsx                // Header + Footer
│
├─ lib/
│   ├── rss.ts                ← RSS‑Parser + Proxy‑Logik
│   └─ (weitere small helpers)
│
├─ components/
│   ├── SearchBar.tsx        // Eingabe‑Komponente
│   ├── ResultCard.tsx       // Einzelner Ergebnis‑Card
│   └─ SummaryCard.tsx         // Zusammenfassung‑Anzeige
│
├─ lib/            ← utils
│   └─ rss.ts         ← RSS‑Parser + Feed‑Defs
│
├─ components/
│   ├── SearchBar.tsx
│   └─ ResultCard.tsx
│
├─ app/
│   └─ layout.tsx          <-- Header, Status‑Bar, Footer
│
```

---

### 📐 Datenfluss (von User Action → Response)

1. **User tippt Wort** → `handleSearch` wird ausgelöst.  
2. `searchNews(query)` wird aufgerufen.  
3. `searchNews` ruft **`searchRssFeeds(term)`** auf → lädt **alle deutschen Feeds** parallel.  
4. Jede RSS‑URL wird über **`fetchRssFeed(url)`** abgefragt (Proxy‑Endpoint).  
5. Jeder Rückgabewert wird **gefiltert** (`item.title.includes(lowerTerm) || item.content.includes(lowerTerm)`).  
6. Result‑Objekte werden in `allResults` gesammelt → **dedupliziert** via `Map`.  
7. `summarizeArticles()` erstellt (via Claude) eine 2‑4‑Satz‑Zusammenfassung.  
8. Ergebnis‑Array wird als **state** gesetzt → UI wird neu gerendert.  

---

## 📁 Projektstruktur (relevant)

```
src/
├─ lib/
│   └─ rss.ts                ← RSS‑Parser + Proxy
│
├─ app/
│   └─ search/
│       └─ page.tsx               <-- Haupt‑Suche
│   └─ component/
│       ├─ SearchBar.tsx      <-- Eingabe + Submit
│       └─ ResultCard.tsx    <-- Einzelner Resultat‑Karten‑Komponente
│       └─ SummaryCard.tsx   // Optional
│
├─ app/
│   └─ layout.tsx   <-- Header mit Version/Git‑Hash, nav
│
├─ components/
│   ├─ SearchBar.tsx      ← Texteingabe + Live‑Feedback
│   └─ ResultCard.tsx         <-- Einzelner Ergebnis‑Karte
└─ components/ … weitere UI‑Komponenten (Falls nötig)
```

---

## 🎨 UI/UX Design

- **Header**: Titel + Suchfeld + Fortschrittsanzeige.  
- **SearchBar**: rundlich, abgerundet, mit Lupen‑Icon.  
- **Ergebnis‑Karten**: Titel, Quelle, Link‑Icon, Kurzbeschreibung, "Zum Artikel" Link.  
- **Progress‑Bar** → animiert, wenn RSS‑Feeds geladen werden.  
- **Keine Navigation** – Alles bleibt in **einem Page** (SEO‑freundlich, aber einfach zu verstehen).

---

## 📦 Build‑/Deploy‑Workflow

| Schritt | Befehl |
|--------|--------|
| **Install** | `npm ci` |
| **Dev‑Server** | `npm run dev` |
| **Build** | `npm run build` |
| **Start (prod)** | `npm start` |
| **Deploy** | `vercel --prod` **oder** `next build && next start` auf Vercel/Netlify/etc. |

> **Hinweis:** Der Proxy‑Endpoint (`/api/rss-proxy`) ist öffentlich, aber **keine API‑Keys** werden weitergegeben – das ist sicher, weil er nur den Header `User-Agent` und das Proxy‑Target behandelt.

---

## 🛡️ Sicherheits‑Hinweise

| Aspekt | Hinweis |
|--------|-----------|
| **API‑Keys** | Wird nicht im Frontend exponiert; nur im Backend (Proxy) verwendet. |
| **CORS** | Proxy‑Endpoint gibt `Access-Control-Allow-Origin: *` zurück – keine Anfragen blockiert. |
| **Rate‑Limiting** | Der interne Proxy hat 5‑Sekunden‑Timeout; ein erneuter Versuch kann ein neuer Request sein. |
| **Daten‑Privatsphäre** | Keine personenbezogenen Daten werden gespeichert, nur öffentliche RSS‑Feeds verwendet. |

---

## 📋 Offene Fragen / To‑Do‑Liste

| Frage | Status |
|---------|-------|
| Wie integriere ich Echtzeit‑Updates (z. B. Live‑Ticker)? | Implementierung von WebSocket‑ oder SSE‑Polling. |
| Wie handle ich Rate‑Limits der Feeds? | Internes Token‑Bucket‑System oder Queue‑Retry‑Logik. |
| **Wie invalidieren wir Cache‑Ergebnisse?** | Durch `cache: 'no-store'` in `fetch`‑Aufrufen. |
| **Wie handle ich Fehlertaten von externen Feeds?** | Aktuell wird nur `[]` zurückgegeben → Keine Ergebnisse. |
| **Können wir mehr als 10 Artikel pro Feed zeigen?** | Ja – das ist nur ein UI‑Limmit (max 10) – kann später angepasst. |
| **Welcher Proxy‑Port wird verwendet?** | 8000‑Port ist nicht öffenbar – wir nutzen innerhalb des Projekts `/api/rss-proxy`. |
| **Wie konfiguriere ich eigene API‑Keys?** | In einer `.env`‑Datei, niemals committen – nur lokal nutzen. |

---

### ✅ **Zusammengefasst – Dein nächster Schritt**

1. **Starte den Entwicklungs‑Server**  
   ```bash
   npm run dev
   ```

2. **Öffne im Browser** `http://localhost:3000`  
3. **Gib ein Stichwort ein** (z. B. `München`).  
4. Beobachte:
   - Fortschrittsbalken (0 → 30 % …)  
   - Ergebnisliste erscheint.  
   - Zusammenfassung wird unten angezeigt.  

5. Wenn alles wie gewünscht funktioniert – **Committen** und **Push**!  

```bash
git add -A
git commit -m "feat: add full RSS‑proxy + search with progress bar & versionInfo"
git push origin main
```

Damit ist das Projekt bereit für **lokale Tests**, **Demo‑Sessions** und **deploy‑bereit für Vercel/Next.js**.

--- 

### 🎯 Nächste Schritte (falls du willst)

1. **Deploy** → Vercel (einfach mit `/api/rss-proxy` und `next.config.js`).  
2. **Add CI/CD** – GitHub Actions, um bei jedem Push zu bauen.  
3. **Add Auth** (optional) – falls du nur registrierte Nutzer willst.  
4. **Deploy** auf Vercel – automatisch HTTPS, CDN, Edge‑Caching.  

---

### 🎉 Alles bereit!  

Die Anwendung ist jetzt **funktionstüchtig**, **regionale RSS‑Feeds** werden **parsen**, und **Zusammenfassungen** werden automatisch erzeugt. Du kannst jetzt mit dem **Testen im Browser** beginnen und anschließend alles **auf GitHub pushen**.  

Falls du irgendwann **Weitere Features** brauchst (z. B. Benutzer‑Login, Kommentare, Export), sag einfach Bescheid – ich erstelle dafür ein Skill‑Agent‑Sub‑Task! 🚀