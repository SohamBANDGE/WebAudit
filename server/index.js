require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const scanRoutes = require("./routes/scan");
const leadRoutes = require("./routes/lead");
const reportRoutes = require("./routes/report");

const app = express();

const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin:
      CLIENT_ORIGIN === "*"
        ? true
        : CLIENT_ORIGIN.split(",").map((s) => s.trim()),
  })
);

app.use(express.json());

// ---------------------------------------------------------
// API
// ---------------------------------------------------------

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/scan", scanRoutes);
app.use("/api/lead", leadRoutes);
app.use("/api/report", reportRoutes);

// ---------------------------------------------------------
// SEO: robots.txt
// ---------------------------------------------------------

app.get("/robots.txt", (_req, res) => {
  res.status(200);
  res.type("text/plain");
  res.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );

  res.send(`User-agent: *
Allow: /

Sitemap: https://webaudit-jzte.onrender.com/sitemap.xml
`);
});
// ---------------------------------------------------------
// SEO: sitemap.xml
// ---------------------------------------------------------

app.get("/sitemap.xml", (_req, res) => {
  res.type("application/xml");

  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>https://webaudit-jzte.onrender.com/</loc>
  </url>

  <url>
    <loc>https://webaudit-jzte.onrender.com/keywords</loc>
  </url>

  <url>
    <loc>https://webaudit-jzte.onrender.com/content-optimizer</loc>
  </url>

  <url>
    <loc>https://webaudit-jzte.onrender.com/google-ads</loc>
  </url>

</urlset>`);
});

// ---------------------------------------------------------
// React production build
// ---------------------------------------------------------

const clientDist = path.join(__dirname, "..", "client", "dist");

app.use(express.static(clientDist));

// React Router fallback
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }

  res.sendFile(path.join(clientDist, "index.html"));
});

// ---------------------------------------------------------
// Error handler
// ---------------------------------------------------------

app.use((err, _req, res, _next) => {
  console.error(err);

  res.status(500).json({
    error: "Something went wrong on our end.",
  });
});

// ---------------------------------------------------------
// Start server
// ---------------------------------------------------------

app.listen(PORT, () => {
  console.log(
    `WebAudit API listening on http://localhost:${PORT}`
  );
});
