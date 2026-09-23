const axios = require("axios");

const PSI_ENDPOINT =
  "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

/**
 * Calls Google PageSpeed Insights for a given URL + strategy (mobile/desktop)
 * and normalizes the parts of the response we care about.
 */
async function getPageSpeed(targetUrl, strategy = "mobile") {
  const apiKey = process.env.PAGESPEED_API_KEY;
  if (!apiKey) {
    const err = new Error("PAGESPEED_API_KEY is not configured on the server.");
    err.code = "NO_API_KEY";
    throw err;
  }

  const { data } = await axios.get(PSI_ENDPOINT, {
    params: {
      url: targetUrl,
      key: apiKey,
      strategy,
      category: ["performance", "seo", "accessibility"],
    },
    timeout: 25000,
    paramsSerializer: {
      indexes: null, // send category=performance&category=seo&category=accessibility
    },
  });

  const lighthouse = data.lighthouseResult;
  const categories = lighthouse?.categories || {};
  const audits = lighthouse?.audits || {};

  const performanceScore = Math.round((categories.performance?.score ?? 0) * 100);
  const seoScore = Math.round((categories.seo?.score ?? 0) * 100);
  const accessibilityScore = Math.round((categories.accessibility?.score ?? 0) * 100);

  const lcp = audits["largest-contentful-paint"]?.displayValue ?? "N/A";
  const cls = audits["cumulative-layout-shift"]?.displayValue ?? "N/A";
  const inp = audits["interactive"]?.displayValue ?? audits["max-potential-fid"]?.displayValue ?? "N/A";

  const mobileFriendly =
    data.loadingExperience?.metrics?.["CUMULATIVE_LAYOUT_SHIFT_SCORE"]?.category !== "SLOW";

  return {
    strategy,
    performanceScore,
    seoScore,
    accessibilityScore,
    coreWebVitals: { lcp, cls, inp },
    mobileFriendly,
  };
}

module.exports = { getPageSpeed };
