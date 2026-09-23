import { useMemo, useState } from "react";

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function analyzeContent(keyword, title, metaDescription, content) {
  const target = keyword.trim().toLowerCase();
  const text = content.trim();

  if (!target || !text) {
    return null;
  }

  const lowerText = text.toLowerCase();

  // Count words
  const words = text.match(/\b[\w'-]+\b/g) || [];
  const wordCount = words.length;

  // Count keyword occurrences
  const keywordRegex = new RegExp(
    escapeRegExp(target),
    "gi"
  );

  const keywordMatches = lowerText.match(keywordRegex) || [];
  const keywordCount = keywordMatches.length;

  // Keyword density
  const density =
    wordCount > 0
      ? ((keywordCount / wordCount) * 100).toFixed(2)
      : "0.00";

  const densityNumber = Number(density);

  // Detect headings written like:
  // # Heading
  // ## Heading
  // ### Heading
  const headings = text.match(/^#{1,6}\s+.+$/gm) || [];

  // First paragraph
  const firstParagraph =
    text.split(/\n\s*\n/)[0]?.toLowerCase() || "";

  const checks = [];

  // --------------------------------
  // TITLE CHECK
  // --------------------------------
  const titleHasKeyword =
    title.trim().toLowerCase().includes(target);

  checks.push({
    name: "Keyword in SEO Title",
    passed: titleHasKeyword,
    message: titleHasKeyword
      ? "Target keyword found in the SEO title."
      : "Add the target keyword naturally to your SEO title.",
  });

  // --------------------------------
  // META DESCRIPTION
  // --------------------------------
  const metaLength = metaDescription.trim().length;

  const goodMetaLength =
    metaLength >= 120 && metaLength <= 160;

  checks.push({
    name: "Meta Description",
    passed: goodMetaLength,
    message: goodMetaLength
      ? "Meta description length is within the recommended range."
      : "Keep the meta description between 120–160 characters.",
  });

  // --------------------------------
  // KEYWORD USAGE
  // --------------------------------
  checks.push({
    name: "Keyword Usage",
    passed: keywordCount > 0,
    message:
      keywordCount > 0
        ? `Keyword appears ${keywordCount} time(s) in the content.`
        : "The target keyword was not found in the content.",
  });

  // --------------------------------
  // FIRST PARAGRAPH
  // --------------------------------
  const keywordInFirstParagraph =
    firstParagraph.includes(target);

  checks.push({
    name: "Keyword in First Paragraph",
    passed: keywordInFirstParagraph,
    message: keywordInFirstParagraph
      ? "Keyword appears in the opening paragraph."
      : "Consider adding the target keyword to the first paragraph.",
  });

  // --------------------------------
  // CONTENT LENGTH
  // --------------------------------
  const goodWordCount = wordCount >= 300;

  checks.push({
    name: "Content Length",
    passed: goodWordCount,
    message: goodWordCount
      ? "Content contains at least 300 words."
      : `Content contains ${wordCount} words. Consider expanding it to at least 300 words.`,
  });

  // --------------------------------
  // HEADINGS
  // --------------------------------
  const goodHeadings = headings.length >= 2;

  checks.push({
    name: "Content Headings",
    passed: goodHeadings,
    message: goodHeadings
      ? `${headings.length} heading(s) detected.`
      : "Add headings or subheadings to improve content structure.",
  });

  // --------------------------------
  // KEYWORD DENSITY
  // --------------------------------
  const goodDensity =
    densityNumber >= 0.5 && densityNumber <= 2.5;

  checks.push({
    name: "Keyword Density",
    passed: goodDensity,
    message: goodDensity
      ? `Keyword density is ${density}%.`
      : `Keyword density is ${density}%. Keep keyword usage natural and avoid stuffing.`,
  });

  // --------------------------------
  // TITLE LENGTH
  // --------------------------------
  const titleLength = title.trim().length;

  const goodTitleLength =
    titleLength >= 30 && titleLength <= 60;

  checks.push({
    name: "SEO Title Length",
    passed: goodTitleLength,
    message: goodTitleLength
      ? "SEO title length is within the recommended range."
      : "Aim for an SEO title around 30–60 characters.",
  });

  // --------------------------------
  // CALCULATE SCORE
  // --------------------------------
  const passedChecks = checks.filter(
    (check) => check.passed
  ).length;

  const score = Math.round(
    (passedChecks / checks.length) * 100
  );

  // --------------------------------
  // RECOMMENDATIONS
  // --------------------------------
  const recommendations = [];

  if (!titleHasKeyword) {
    recommendations.push(
      "Include the target keyword naturally in the SEO title."
    );
  }

  if (!goodTitleLength) {
    recommendations.push(
      "Adjust the SEO title to approximately 30–60 characters."
    );
  }

  if (!goodMetaLength) {
    recommendations.push(
      "Improve the meta description and keep it around 120–160 characters."
    );
  }

  if (keywordCount === 0) {
    recommendations.push(
      "Add the target keyword naturally throughout the content."
    );
  }

  if (!keywordInFirstParagraph) {
    recommendations.push(
      "Mention the target keyword naturally in the first paragraph."
    );
  }

  if (!goodWordCount) {
    recommendations.push(
      "Expand the content with useful information, examples and explanations."
    );
  }

  if (!goodHeadings) {
    recommendations.push(
      "Add H2/H3-style headings to organize the content."
    );
  }

  if (densityNumber < 0.5 && keywordCount > 0) {
    recommendations.push(
      "Use the target keyword naturally a few more times."
    );
  }

  if (densityNumber > 2.5) {
    recommendations.push(
      "Reduce repeated keyword usage to avoid keyword stuffing."
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      "The main SEO checks are satisfied. Continue improving content quality, usefulness and readability."
    );
  }

  return {
    score,
    wordCount,
    keywordCount,
    density,
    headings: headings.length,
    checks,
    recommendations,
  };
}

function getScoreLabel(score) {
  if (score >= 80) {
    return "Good";
  }

  if (score >= 60) {
    return "Needs Improvement";
  }

  return "Needs Work";
}

export default function ContentOptimizer() {
  const [keyword, setKeyword] = useState("");
  const [title, setTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [content, setContent] = useState("");
  const [analyzed, setAnalyzed] = useState(false);

  const result = useMemo(() => {
    if (!analyzed) {
      return null;
    }

    return analyzeContent(
      keyword,
      title,
      metaDescription,
      content
    );
  }, [
    analyzed,
    keyword,
    title,
    metaDescription,
    content,
  ]);

  function handleAnalyze(event) {
    event.preventDefault();

    if (!keyword.trim()) {
      alert("Please enter a target keyword.");
      return;
    }

    if (!content.trim()) {
      alert("Please enter some content to analyze.");
      return;
    }

    setAnalyzed(true);
  }

  function clearForm() {
    setKeyword("");
    setTitle("");
    setMetaDescription("");
    setContent("");
    setAnalyzed(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* PAGE HEADER */}
        <div className="mb-8">
          <div className="mb-3 inline-flex rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-1 text-sm text-purple-300">
            Assignment 2 · Content Optimization
          </div>

          <h1 className="text-4xl font-bold tracking-tight">
            SEO Content Optimizer
          </h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            Analyze your website content and check keyword
            usage, SEO title, meta description, content length,
            headings and keyword density.
          </p>
        </div>

        {/* INPUT FORM */}
        <form
          onSubmit={handleAnalyze}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl"
        >
          <h2 className="mb-6 text-xl font-semibold">
            Enter Content Details
          </h2>

          <div className="grid gap-6 lg:grid-cols-2">

            {/* TARGET KEYWORD */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Target Keyword
              </label>

              <input
                type="text"
                value={keyword}
                onChange={(event) =>
                  setKeyword(event.target.value)
                }
                placeholder="Example: digital marketing"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-purple-400"
              />
            </div>

            {/* SEO TITLE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                SEO Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Example: Digital Marketing Guide for Beginners"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-purple-400"
              />

              <p className="mt-1 text-xs text-slate-500">
                {title.length} characters
              </p>
            </div>

            {/* META DESCRIPTION */}
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Meta Description
              </label>

              <textarea
                value={metaDescription}
                onChange={(event) =>
                  setMetaDescription(event.target.value)
                }
                rows={3}
                placeholder="Write a short description of your webpage..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-purple-400"
              />

              <p className="mt-1 text-xs text-slate-500">
                {metaDescription.length} characters
              </p>
            </div>

            {/* CONTENT */}
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Sample Content
              </label>

              <textarea
                value={content}
                onChange={(event) =>
                  setContent(event.target.value)
                }
                rows={14}
                placeholder="Paste or write your sample website content here..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-purple-400"
              />

              <p className="mt-1 text-xs text-slate-500">
                {content.trim()
                  ? content.trim().split(/\s+/).length
                  : 0}{" "}
                words
              </p>
            </div>
          </div>

          {/* BUTTONS */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="rounded-xl bg-purple-500 px-6 py-3 font-semibold text-white transition hover:bg-purple-400"
            >
              Analyze Content
            </button>

            <button
              type="button"
              onClick={clearForm}
              className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-300 transition hover:bg-slate-800"
            >
              Clear
            </button>
          </div>
        </form>

        {/* RESULTS */}
        {result && (
          <div className="mt-8">

            {/* SUMMARY CARDS */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* SCORE */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">
                  SEO Score
                </p>

                <p className="mt-2 text-4xl font-bold text-purple-300">
                  {result.score}/100
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  {getScoreLabel(result.score)}
                </p>
              </div>

              {/* WORD COUNT */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">
                  Word Count
                </p>

                <p className="mt-2 text-3xl font-bold">
                  {result.wordCount}
                </p>
              </div>

              {/* KEYWORD COUNT */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">
                  Keyword Uses
                </p>

                <p className="mt-2 text-3xl font-bold text-cyan-300">
                  {result.keywordCount}
                </p>
              </div>

              {/* DENSITY */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">
                  Keyword Density
                </p>

                <p className="mt-2 text-3xl font-bold text-emerald-300">
                  {result.density}%
                </p>
              </div>
            </div>

            {/* SEO CHECKS */}
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
              <h2 className="text-xl font-semibold">
                SEO Checks
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                WebAudit checks the most important on-page
                optimization factors.
              </p>

              <div className="mt-5 space-y-3">
                {result.checks.map((check) => (
                  <div
                    key={check.name}
                    className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-white">
                        {check.name}
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        {check.message}
                      </p>
                    </div>

                    <span
                      className={
                        check.passed
                          ? "w-fit rounded-full bg-emerald-400/10 px-3 py-1 text-sm font-medium text-emerald-400"
                          : "w-fit rounded-full bg-red-400/10 px-3 py-1 text-sm font-medium text-red-400"
                      }
                    >
                      {check.passed
                        ? "✓ PASS"
                        : "⚠ FIX"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* RECOMMENDATIONS */}
            <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6">
              <h2 className="text-xl font-semibold text-cyan-300">
                💡 Optimization Recommendations
              </h2>

              <div className="mt-4 space-y-3">
                {result.recommendations.map(
                  (recommendation, index) => (
                    <div
                      key={index}
                      className="flex gap-3 text-sm leading-6 text-slate-300"
                    >
                      <span className="text-cyan-400">
                        →
                      </span>

                      <span>{recommendation}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* PRACTICAL NOTE */}
            <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-5">
              <p className="text-sm leading-6 text-yellow-200">
                <strong>Practical note:</strong> The score and
                SEO checks are calculated using WebAudit's
                local heuristic rules. Keyword metrics are
                simulated for this college practical and are
                not live Google Keyword Planner or Search
                Console data.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}