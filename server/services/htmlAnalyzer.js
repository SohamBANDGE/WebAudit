const axios = require("axios");
const cheerio = require("cheerio");
const { URL } = require("url");

const USER_AGENT =
  "Mozilla/5.0 (compatible; WebAuditBot/1.0; +https://example.com/bot)";

async function checkResource(url) {
  try {
    const response = await axios.get(url, {
      headers: { "User-Agent": USER_AGENT },
      timeout: 7000,
      maxRedirects: 5,
      validateStatus: () => true,
    });

    return response.status >= 200 && response.status < 400;
  } catch (_) {
    return false;
  }
}

function extractKeywords(text) {
  const stopWords = new Set([
    "the", "and", "for", "with", "that", "this", "from", "your",
    "you", "are", "was", "were", "have", "has", "had", "not",
    "but", "can", "will", "our", "their", "they", "them", "about",
    "into", "more", "than", "then", "also", "its", "it's", "what",
    "when", "where", "which", "who", "how", "why", "all", "any",
    "a", "an", "of", "to", "in", "on", "at", "is", "it", "as",
    "be", "by", "or", "we", "he", "she", "i"
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !stopWords.has(word));

  const frequency = {};

  for (const word of words) {
    frequency[word] = (frequency[word] || 0) + 1;
  }

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([keyword, count]) => ({ keyword, count }));
}

async function analyzeHtml(targetUrl) {
  const { data: html, status } = await axios.get(targetUrl, {
    headers: { "User-Agent": USER_AGENT },
    timeout: 10000,
    maxRedirects: 5,
    validateStatus: (s) => s < 500,
  });

  if (status >= 400) {
    const err = new Error(`Target site responded with status ${status}`);
    err.code = "UNREACHABLE";
    throw err;
  }

  const $ = cheerio.load(html);
  const checks = [];

  // ---------------------------------------------------------
  // HTTPS
  // ---------------------------------------------------------

  const isHttps = targetUrl.toLowerCase().startsWith("https://");

  checks.push({
    id: "https",
    category: "technical",
    label: "HTTPS security",
    status: isHttps ? "pass" : "fail",
    detail: isHttps
      ? "The website is using HTTPS."
      : "The website is not using HTTPS.",
    tip: isHttps
      ? "Good. Keep your SSL/TLS certificate valid."
      : "Enable HTTPS with a valid SSL/TLS certificate.",
  });

  // ---------------------------------------------------------
  // TITLE
  // ---------------------------------------------------------

  const title = $("head > title").first().text().trim();

  if (!title) {
    checks.push({
      id: "title-present",
      category: "seo",
      label: "Title tag",
      status: "fail",
      detail: "No <title> tag was found on the page.",
      tip: "Add a unique, descriptive title between 30–60 characters.",
    });
  } else if (title.length > 60) {
    checks.push({
      id: "title-length",
      category: "seo",
      label: "Title tag length",
      status: "warn",
      detail: `Title is ${title.length} characters.`,
      tip: "Shorten your title to approximately 30–60 characters.",
    });
  } else if (title.length < 30) {
    checks.push({
      id: "title-length",
      category: "seo",
      label: "Title tag length",
      status: "warn",
      detail: `Title is only ${title.length} characters.`,
      tip: "Consider making the title more descriptive.",
    });
  } else {
    checks.push({
      id: "title-present",
      category: "seo",
      label: "Title tag",
      status: "pass",
      detail: `Title present and ${title.length} characters long.`,
      tip: "Good title length.",
    });
  }

  // ---------------------------------------------------------
  // META DESCRIPTION
  // ---------------------------------------------------------

  const metaDescription =
    $('meta[name="description"]').attr("content") || "";

  if (!metaDescription.trim()) {
    checks.push({
      id: "meta-description",
      category: "seo",
      label: "Meta description",
      status: "fail",
      detail: "No meta description tag was found.",
      tip: "Add a descriptive meta description.",
    });
  } else if (metaDescription.length > 160) {
    checks.push({
      id: "meta-description",
      category: "seo",
      label: "Meta description length",
      status: "warn",
      detail: `Meta description is ${metaDescription.length} characters.`,
      tip: "Keep the meta description around 150–160 characters.",
    });
  } else {
    checks.push({
      id: "meta-description",
      category: "seo",
      label: "Meta description",
      status: "pass",
      detail: `Present and ${metaDescription.length} characters long.`,
      tip: "Good meta description length.",
    });
  }

  // ---------------------------------------------------------
  // H1
  // ---------------------------------------------------------

  const h1s = $("h1");

  if (h1s.length === 0) {
    checks.push({
      id: "h1-present",
      category: "seo",
      label: "H1 heading",
      status: "fail",
      detail: "No <h1> tag was found.",
      tip: "Add one clear H1 describing the main topic.",
    });
  } else if (h1s.length > 1) {
    checks.push({
      id: "h1-present",
      category: "seo",
      label: "H1 heading",
      status: "warn",
      detail: `Found ${h1s.length} H1 tags.`,
      tip: "Use one primary H1 and H2/H3 for subsections.",
    });
  } else {
    checks.push({
      id: "h1-present",
      category: "seo",
      label: "H1 heading",
      status: "pass",
      detail: "Exactly one H1 tag found.",
      tip: "Good heading structure.",
    });
  }

  // ---------------------------------------------------------
  // IMAGES / ALT
  // ---------------------------------------------------------

  const images = $("img");

  const imagesMissingAlt = images.filter((_, el) => {
    const alt = $(el).attr("alt");
    return alt === undefined || alt.trim() === "";
  });

  if (images.length === 0) {
    checks.push({
      id: "img-alt",
      category: "content",
      label: "Image alt text",
      status: "pass",
      detail: "No images found on the page.",
      tip: "No image ALT issues detected.",
    });
  } else if (imagesMissingAlt.length > 0) {
    checks.push({
      id: "img-alt",
      category: "content",
      label: "Image alt text",
      status: imagesMissingAlt.length > images.length / 2
        ? "fail"
        : "warn",
      detail: `${imagesMissingAlt.length} of ${images.length} images are missing alt text.`,
      tip: "Add descriptive ALT text to meaningful images.",
    });
  } else {
    checks.push({
      id: "img-alt",
      category: "content",
      label: "Image alt text",
      status: "pass",
      detail: `All ${images.length} images have alt text.`,
      tip: "Good image accessibility.",
    });
  }

  // ---------------------------------------------------------
  // VIEWPORT
  // ---------------------------------------------------------

  const viewport = $('meta[name="viewport"]').attr("content");

  checks.push({
    id: "viewport",
    category: "mobile",
    label: "Viewport meta tag",
    status: viewport ? "pass" : "fail",
    detail: viewport
      ? `Viewport tag present: "${viewport}".`
      : "No viewport meta tag found.",
    tip: viewport
      ? "Good mobile configuration."
      : "Add a responsive viewport meta tag.",
  });

  // ---------------------------------------------------------
  // FAVICON
  // ---------------------------------------------------------

  const favicon =
    $('link[rel="icon"]').attr("href") ||
    $('link[rel="shortcut icon"]').attr("href") ||
    $('link[rel="apple-touch-icon"]').attr("href");

  checks.push({
    id: "favicon",
    category: "content",
    label: "Favicon",
    status: favicon ? "pass" : "warn",
    detail: favicon
      ? "A favicon was found."
      : "No favicon link tag was found.",
    tip: favicon
      ? "Favicon detected."
      : "Add a favicon to improve branding.",
  });

  // ---------------------------------------------------------
  // LINKS
  // ---------------------------------------------------------

  let internalLinks = 0;
  let externalLinks = 0;
  const links = [];

  const baseHost = new URL(targetUrl).host;

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");

    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return;
    }

    try {
      const resolved = new URL(href, targetUrl);

      if (resolved.host === baseHost) {
        internalLinks++;
      } else {
        externalLinks++;
      }

      links.push(resolved.toString());
    } catch (_) {
      internalLinks++;
    }
  });

  checks.push({
    id: "links",
    category: "seo",
    label: "Internal vs external links",
    status: internalLinks > 0 ? "pass" : "warn",
    detail: `${internalLinks} internal link(s), ${externalLinks} external link(s).`,
    tip:
      internalLinks > 0
        ? "Good internal linking detected."
        : "Add internal links between related pages.",
  });

  // ---------------------------------------------------------
  // WORD COUNT
  // ---------------------------------------------------------

  const bodyText = $("body").clone();
  bodyText.find("script, style, noscript").remove();

  const text = bodyText.text().replace(/\s+/g, " ").trim();
  const wordCount = text.length ? text.split(" ").length : 0;

  let wcStatus = "pass";

  if (wordCount < 150) {
    wcStatus = "fail";
  } else if (wordCount < 300) {
    wcStatus = "warn";
  }

  checks.push({
    id: "word-count",
    category: "content",
    label: "Visible text / word count",
    status: wcStatus,
    detail: `Approximately ${wordCount} words of visible text.`,
    tip:
      wcStatus === "pass"
        ? "Good amount of visible content."
        : "Consider adding useful, relevant content.",
  });

  // ---------------------------------------------------------
  // ROBOTS.TXT
  // ---------------------------------------------------------

  const siteUrl = new URL(targetUrl);

  const robotsUrl = `${siteUrl.protocol}//${siteUrl.host}/robots.txt`;
  const sitemapUrl = `${siteUrl.protocol}//${siteUrl.host}/sitemap.xml`;

  const robotsExists = await checkResource(robotsUrl);

  checks.push({
    id: "robots",
    category: "technical",
    label: "Robots.txt",
    status: robotsExists ? "pass" : "warn",
    detail: robotsExists
      ? "robots.txt is accessible."
      : "robots.txt could not be found.",
    tip: robotsExists
      ? "Good. Keep robots.txt valid and up to date."
      : "Consider creating a robots.txt file.",
  });

  // ---------------------------------------------------------
  // SITEMAP
  // ---------------------------------------------------------

  const sitemapExists = await checkResource(sitemapUrl);

  checks.push({
    id: "sitemap",
    category: "technical",
    label: "XML Sitemap",
    status: sitemapExists ? "pass" : "warn",
    detail: sitemapExists
      ? "sitemap.xml is accessible."
      : "sitemap.xml could not be found.",
    tip: sitemapExists
      ? "Good. Submit your sitemap to search engines."
      : "Create an XML sitemap for your important pages.",
  });

  // ---------------------------------------------------------
  // BASIC KEYWORD EXTRACTION
  // ---------------------------------------------------------

  const keywords = extractKeywords(text);

  return {
    checks,
    meta: {
      title,
      metaDescription,
      wordCount,
      internalLinks,
      externalLinks,
      images: images.length,
      imagesMissingAlt: imagesMissingAlt.length,
      keywords,
      robotsUrl,
      sitemapUrl,
    },
  };
}

module.exports = { analyzeHtml };