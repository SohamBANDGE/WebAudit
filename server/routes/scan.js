const express = require("express");
const { v4: uuidv4 } = require("uuid");

const { analyzeHtml } = require("../services/htmlAnalyzer");
const { getPageSpeed } = require("../services/pagespeed");
const { buildReport } = require("../services/scoring");
const reportStore = require("../services/reportStore");
const { scanRateLimiter } = require("../middleware/rateLimit");

const router = express.Router();

function normalizeUrl(input) {
  let value = (input || "").trim();
  if (!value) return null;
  if (!/^https?:\/\//i.test(value)) {
    value = `https://${value}`;
  }
  try {
    const parsed = new URL(value);
    return parsed.toString();
  } catch (_) {
    return null;
  }
}

router.post("/", scanRateLimiter, async (req, res) => {
  const targetUrl = normalizeUrl(req.body?.url);

  if (!targetUrl) {
    return res.status(400).json({
      error: "Please enter a valid website URL, e.g. https://example.com",
    });
  }

  let checks = [];
  try {
    const analysis = await analyzeHtml(targetUrl);
    checks = analysis.checks;
  } catch (err) {
    return res.status(422).json({
      error:
        "We couldn't reach that website. Please check the URL and try again.",
    });
  }

  // PageSpeed is best-effort: if it fails, we still return the HTML-based
  // checks as a partial report rather than failing the whole request.
  let pagespeed = null;
  let pagespeedError = null;
  try {
    pagespeed = await getPageSpeed(targetUrl, "mobile");
  } catch (err) {
    pagespeedError =
      err.code === "NO_API_KEY"
        ? "PageSpeed API key not configured — performance data skipped."
        : "PageSpeed Insights couldn't analyze this URL right now.";
  }

  const report = buildReport({ url: targetUrl, checks, pagespeed, pagespeedError });

  const id = uuidv4();
  reportStore.save(id, report);

  return res.json({ id, ...report });
});

module.exports = router;
