# WebAudit — Free Website & SEO Audit Tool

Users enter a website URL and get back a plain-English report on SEO basics,
performance, mobile-friendliness, and content quality, scored 0–100 with an
A–F grade.

```
webaudit/
├── client/   React (Vite) + Tailwind frontend
└── server/   Node/Express backend (PageSpeed API + Cheerio HTML analysis)
```

## 1. Get a free Google PageSpeed Insights API key

1. Go to https://developers.google.com/speed/docs/insights/v5/get-started
2. Create (or select) a Google Cloud project.
3. Enable the **PageSpeed Insights API** for that project.
4. Create an **API key** under "Credentials" and copy it.

No billing account is required for normal, reasonable usage — the API has a
generous free quota, which is also why this app rate-limits scans (5 per hour
per IP) by default.

## 2. Run the backend

```bash
cd server
npm install
cp .env.example .env
# edit .env and paste your API key into PAGESPEED_API_KEY
npm run dev        # or: npm start
```

The API starts on `http://localhost:5000` by default. `GET /api/health`
should return `{ "ok": true }` once it's running.

If `PAGESPEED_API_KEY` is missing or the PageSpeed call fails/times out, the
backend still returns the SEO/content/mobile checks as a **partial report**
instead of failing the whole scan.

## 3. Run the frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. In dev mode, Vite proxies `/api/*` requests to
the backend on port 5000 (see `client/vite.config.js`), so no extra config
is needed.

## How a scan works

`POST /api/scan { url }`:

1. Fetches the raw HTML with `axios` and parses it with **Cheerio**, checking:
   title tag + length, meta description + length, single `<h1>`, images
   missing `alt` text, a `<meta name="viewport">` tag, a favicon link,
   internal vs. external link counts, and approximate word count.
2. Calls the **Google PageSpeed Insights API** (mobile strategy) for a
   performance score, Core Web Vitals (LCP, CLS, interactivity), and a
   mobile-usability signal. This step is best-effort — failures degrade to
   a partial report rather than an error.
3. Combines both into four category scores (SEO / Performance / Mobile /
   Content) and an overall score + letter grade, stored in `server/data/reports.json`
   so it can be re-fetched via `GET /api/report/:id`.

`POST /api/lead { name, email, message, scannedUrl }` appends to
`server/data/leads.json` (swap this for a real database or CRM/email
integration when you're ready to go to production).

## Notes & things to customize before shipping

- **Storage:** leads and reports are stored as local JSON files for
  simplicity. For production, swap `server/services/reportStore.js` and
  `server/routes/lead.js` for a real database (Postgres, MongoDB, etc.).
- **PDF export:** the "Download PDF Report" button uses the browser's native
  print dialog (`window.print()`) with a print stylesheet that hides
  navigation/buttons. For a pixel-perfect downloadable PDF instead, swap this
  for a library like `puppeteer` (server-side) or `jspdf`/`html2canvas`
  (client-side).
- **Rate limiting:** `express-rate-limit` is configured for 5 scans/hour per
  IP in `server/middleware/rateLimit.js` — adjust to fit your PageSpeed quota.
- **Deploying:** frontend → Vercel/Netlify (`npm run build` in `client/`,
  publish `client/dist`); backend → Render/Railway/Fly.io. Set
  `PAGESPEED_API_KEY` and `CLIENT_ORIGIN` as environment variables on the
  backend host, and point the frontend's API calls at your deployed backend
  URL (or keep the Vite proxy pattern with a reverse proxy in production).
