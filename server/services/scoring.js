const STATUS_POINTS = {
  pass: 1,
  warn: 0.5,
  fail: 0,
};

function scoreFromChecks(checks) {
  if (!checks.length) return null;

  const total = checks.reduce(
    (sum, check) => sum + STATUS_POINTS[check.status],
    0
  );

  return Math.round((total / checks.length) * 100);
}

function letterGrade(score) {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}

function buildReport({
  url,
  checks,
  pagespeed,
  pagespeedError,
  meta = {},
}) {
  // ---------------------------------------------------------
  // CATEGORY CHECKS
  // ---------------------------------------------------------

  const seoChecks = checks.filter(
    (check) => check.category === "seo"
  );

  const technicalChecks = checks.filter(
    (check) => check.category === "technical"
  );

  const contentChecks = checks.filter(
    (check) => check.category === "content"
  );

  const mobileChecksFromHtml = checks.filter(
    (check) => check.category === "mobile"
  );

  // ---------------------------------------------------------
  // CATEGORY SCORES
  // ---------------------------------------------------------

  const seoScore = scoreFromChecks(seoChecks) ?? 0;

  const technicalScore =
    scoreFromChecks(technicalChecks) ?? 0;

  const contentScore =
    scoreFromChecks(contentChecks) ?? 0;

  // ---------------------------------------------------------
  // MOBILE
  // ---------------------------------------------------------

  let mobileScore =
    scoreFromChecks(mobileChecksFromHtml) ?? 0;

  const mobileChecks = [...mobileChecksFromHtml];

  if (pagespeed) {
    mobileChecks.push({
      id: "psi-mobile-friendly",
      category: "mobile",
      label: "Mobile usability (PageSpeed)",
      status: pagespeed.mobileFriendly
        ? "pass"
        : "warn",
      detail: pagespeed.mobileFriendly
        ? "Google's PageSpeed data indicates an acceptable mobile experience."
        : "Google's PageSpeed data suggests mobile usability could be improved.",
      tip:
        "Test the website on real mobile devices and check font sizes, spacing and tap targets.",
    });

    mobileScore = Math.round(
      (mobileScore + (pagespeed.mobileFriendly ? 100 : 50)) / 2
    );
  }

  // ---------------------------------------------------------
  // PERFORMANCE
  // ---------------------------------------------------------

  const performanceChecks = [];

  let performanceScore = null;

  if (pagespeed) {
    performanceScore = pagespeed.performanceScore;

    performanceChecks.push({
      id: "psi-performance",
      category: "performance",
      label: "PageSpeed performance score",
      status:
        performanceScore >= 90
          ? "pass"
          : performanceScore >= 50
            ? "warn"
            : "fail",
      detail:
        `Google PageSpeed performance score: ${performanceScore}/100.`,
      tip:
        "Optimize images, JavaScript, CSS, caching and server response time.",
    });

    performanceChecks.push({
      id: "psi-lcp",
      category: "performance",
      label: "Largest Contentful Paint (LCP)",
      status: "warn",
      detail:
        `LCP: ${pagespeed.coreWebVitals.lcp}.`,
      tip:
        "Aim for an LCP around 2.5 seconds or less.",
    });

    performanceChecks.push({
      id: "psi-cls",
      category: "performance",
      label: "Cumulative Layout Shift (CLS)",
      status: "warn",
      detail:
        `CLS: ${pagespeed.coreWebVitals.cls}.`,
      tip:
        "Reserve space for images, advertisements and dynamically loaded content.",
    });

    performanceChecks.push({
      id: "psi-inp",
      category: "performance",
      label: "Interactivity",
      status: "warn",
      detail:
        `Interactivity metric: ${pagespeed.coreWebVitals.inp}.`,
      tip:
        "Reduce long JavaScript tasks and unnecessary client-side processing.",
    });
  } else {
    performanceChecks.push({
      id: "psi-unavailable",
      category: "performance",
      label: "PageSpeed data",
      status: "warn",
      detail:
        pagespeedError ||
        "PageSpeed Insights data was unavailable.",
      tip:
        "Check your PageSpeed API configuration and try again.",
    });
  }

  // ---------------------------------------------------------
  // CATEGORIES
  // ---------------------------------------------------------

  const categories = {
    seo: {
      label: "SEO Basics",
      score: seoScore,
      checks: seoChecks,
    },

    technical: {
      label: "Technical SEO",
      score: technicalScore,
      checks: technicalChecks,
    },

    performance: {
      label: "Performance / Speed",
      score: performanceScore,
      checks: performanceChecks,
      unavailable: performanceScore === null,
    },

    mobile: {
      label: "Mobile-Friendliness",
      score: mobileScore,
      checks: mobileChecks,
    },

    content: {
      label: "Content Quality",
      score: contentScore,
      checks: contentChecks,
    },
  };

  // ---------------------------------------------------------
  // OVERALL SCORE
  // ---------------------------------------------------------

  const scoredCategories = Object.values(categories)
    .filter((category) => category.score !== null);

  const overallScore = scoredCategories.length
    ? Math.round(
        scoredCategories.reduce(
          (sum, category) => sum + category.score,
          0
        ) / scoredCategories.length
      )
    : 0;

  // ---------------------------------------------------------
  // RECOMMENDATIONS
  // ---------------------------------------------------------

  const recommendations = checks
    .filter((check) => check.status !== "pass")
    .map((check) => ({
      label: check.label,
      status: check.status,
      detail: check.detail,
      tip: check.tip,
    }));

  return {
    url,

    scannedAt: new Date().toISOString(),

    overallScore,

    overallGrade: letterGrade(overallScore),

    categories,

    meta,

    recommendations,

    partial: !pagespeed,
  };
}

module.exports = {
  buildReport,
  letterGrade,
};