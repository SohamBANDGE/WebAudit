import { useMemo, useState } from "react";

const keywordData = [
  {
    keyword: "digital marketing",
    cpc: 2.4,
    competition: "High",
  },
  {
    keyword: "digital marketing services",
    cpc: 3.2,
    competition: "High",
  },
  {
    keyword: "digital marketing agency",
    cpc: 3.8,
    competition: "High",
  },
  {
    keyword: "online marketing",
    cpc: 2.1,
    competition: "Medium",
  },
  {
    keyword: "seo services",
    cpc: 2.9,
    competition: "High",
  },
  {
    keyword: "social media marketing",
    cpc: 1.9,
    competition: "Medium",
  },
];

function getKeywordData(keyword) {
  const existing = keywordData.find(
    (item) =>
      item.keyword.toLowerCase() ===
      keyword.trim().toLowerCase()
  );

  if (existing) {
    return existing;
  }

  // Deterministic simulated CPC
  let hash = 0;

  for (let i = 0; i < keyword.length; i++) {
    hash =
      (hash * 31 + keyword.charCodeAt(i)) >>> 0;
  }

  const cpc = 1 + (hash % 300) / 100;

  return {
    keyword,
    cpc: Number(cpc.toFixed(2)),
    competition: "Medium",
  };
}

function calculateCampaign({
  budget,
  days,
  keywords,
  clicks,
}) {
  const dailyBudget = Number(budget) || 0;
  const duration = Number(days) || 1;

  const totalBudget = dailyBudget * duration;

  const averageCpc =
    keywords.length > 0
      ? keywords.reduce(
          (sum, item) => sum + item.cpc,
          0
        ) / keywords.length
      : 0;

  const estimatedClicks =
    averageCpc > 0
      ? Math.floor(totalBudget / averageCpc)
      : 0;

  const selectedClicks =
    clicks > 0 ? Math.min(clicks, estimatedClicks) : estimatedClicks;

  const estimatedImpressions =
    selectedClicks > 0
      ? selectedClicks * 18
      : 0;

  const estimatedSpend =
    selectedClicks * averageCpc;

  const remainingBudget =
    Math.max(totalBudget - estimatedSpend, 0);

  const ctr =
    estimatedImpressions > 0
      ? (selectedClicks / estimatedImpressions) * 100
      : 0;

  return {
    totalBudget,
    averageCpc,
    estimatedClicks,
    estimatedImpressions,
    estimatedSpend,
    remainingBudget,
    ctr,
  };
}

export default function GoogleAdsSimulator() {
  const [campaignName, setCampaignName] =
    useState("");

  const [business, setBusiness] =
    useState("");

  const [location, setLocation] =
    useState("India");

  const [audience, setAudience] =
    useState("");

  const [keywordInput, setKeywordInput] =
    useState("");

  const [selectedKeywords, setSelectedKeywords] =
    useState([]);

  const [headline1, setHeadline1] =
    useState("");

  const [headline2, setHeadline2] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [finalUrl, setFinalUrl] =
    useState("");

  const [dailyBudget, setDailyBudget] =
    useState(500);

  const [duration, setDuration] =
    useState(7);

  const [simulatedClicks, setSimulatedClicks] =
    useState("");

  const [generated, setGenerated] =
    useState(false);

  function addKeyword() {
    const keyword = keywordInput.trim();

    if (!keyword) return;

    if (
      selectedKeywords.some(
        (item) =>
          item.keyword.toLowerCase() ===
          keyword.toLowerCase()
      )
    ) {
      return;
    }

    const data = getKeywordData(keyword);

    setSelectedKeywords([
      ...selectedKeywords,
      data,
    ]);

    setKeywordInput("");
  }

  function removeKeyword(keyword) {
    setSelectedKeywords(
      selectedKeywords.filter(
        (item) => item.keyword !== keyword
      )
    );
  }

  function handleGenerate(event) {
    event.preventDefault();

    if (!campaignName.trim()) {
      alert("Enter a campaign name.");
      return;
    }

    if (!business.trim()) {
      alert("Enter your business or product.");
      return;
    }

    if (selectedKeywords.length === 0) {
      alert("Add at least one keyword.");
      return;
    }

    setGenerated(true);
  }

  const results = useMemo(() => {
    if (!generated) return null;

    return calculateCampaign({
      budget: dailyBudget,
      days: duration,
      keywords: selectedKeywords,
      clicks: Number(simulatedClicks) || 0,
    });
  }, [
    generated,
    dailyBudget,
    duration,
    selectedKeywords,
    simulatedClicks,
  ]);

  function resetCampaign() {
    setCampaignName("");
    setBusiness("");
    setLocation("India");
    setAudience("");
    setKeywordInput("");
    setSelectedKeywords([]);
    setHeadline1("");
    setHeadline2("");
    setDescription("");
    setFinalUrl("");
    setDailyBudget(500);
    setDuration(7);
    setSimulatedClicks("");
    setGenerated(false);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* HEADER */}
        <div className="mb-8">
          <div className="mb-3 inline-flex rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-1 text-sm text-orange-300">
            Assignment 3 · Google Ads
          </div>

          <h1 className="text-4xl font-bold tracking-tight">
            Google Ads Campaign Simulator
          </h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            Create a mock Google Ads campaign with
            keywords, ad copy, audience targeting and
            budget calculations.
          </p>
        </div>

        <form onSubmit={handleGenerate}>

          {/* CAMPAIGN SETUP */}
          <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">

            <h2 className="text-xl font-semibold">
              1. Campaign Setup
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Campaign Name
                </label>

                <input
                  value={campaignName}
                  onChange={(e) =>
                    setCampaignName(e.target.value)
                  }
                  placeholder="Example: Summer Digital Marketing Campaign"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Business / Product
                </label>

                <input
                  value={business}
                  onChange={(e) =>
                    setBusiness(e.target.value)
                  }
                  placeholder="Example: Digital Marketing Agency"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Target Location
                </label>

                <input
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  placeholder="India"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Target Audience
                </label>

                <input
                  value={audience}
                  onChange={(e) =>
                    setAudience(e.target.value)
                  }
                  placeholder="Example: Students, startups, small businesses"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-400"
                />
              </div>

            </div>
          </section>

          {/* KEYWORDS */}
          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold">
              2. Campaign Keywords
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add keywords that potential customers might
              search for.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">

              <input
                value={keywordInput}
                onChange={(e) =>
                  setKeywordInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addKeyword();
                  }
                }}
                placeholder="Example: digital marketing services"
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-400"
              />

              <button
                type="button"
                onClick={addKeyword}
                className="rounded-xl bg-orange-500 px-6 py-3 font-semibold text-slate-950 hover:bg-orange-400"
              >
                + Add Keyword
              </button>

            </div>

            {selectedKeywords.length > 0 && (
              <div className="mt-5 space-y-3">

                {selectedKeywords.map((item) => (
                  <div
                    key={item.keyword}
                    className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div>
                      <p className="font-medium">
                        {item.keyword}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Estimated CPC: $
                        {item.cpc.toFixed(2)}
                        {" · "}
                        Competition:{" "}
                        {item.competition}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeKeyword(item.keyword)
                      }
                      className="w-fit rounded-lg bg-red-400/10 px-3 py-2 text-sm text-red-400 hover:bg-red-400/20"
                    >
                      Remove
                    </button>

                  </div>
                ))}

              </div>
            )}
          </section>

          {/* AD COPY */}
          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold">
              3. Ad Copy
            </h2>

            <div className="mt-6 grid gap-5">

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Headline 1
                </label>

                <input
                  value={headline1}
                  onChange={(e) =>
                    setHeadline1(e.target.value)
                  }
                  placeholder="Grow Your Business Online"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Headline 2
                </label>

                <input
                  value={headline2}
                  onChange={(e) =>
                    setHeadline2(e.target.value)
                  }
                  placeholder="Affordable Digital Marketing"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Ad Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  rows={4}
                  placeholder="Write a short and attractive advertisement description..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Final URL
                </label>

                <input
                  value={finalUrl}
                  onChange={(e) =>
                    setFinalUrl(e.target.value)
                  }
                  placeholder="https://example.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-400"
                />
              </div>

            </div>
          </section>

          {/* BUDGET */}
          <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <h2 className="text-xl font-semibold">
              4. Campaign Budget
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-3">

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Daily Budget (₹)
                </label>

                <input
                  type="number"
                  min="1"
                  value={dailyBudget}
                  onChange={(e) =>
                    setDailyBudget(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Campaign Duration (Days)
                </label>

                <input
                  type="number"
                  min="1"
                  value={duration}
                  onChange={(e) =>
                    setDuration(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Optional Simulated Clicks
                </label>

                <input
                  type="number"
                  min="0"
                  value={simulatedClicks}
                  onChange={(e) =>
                    setSimulatedClicks(e.target.value)
                  }
                  placeholder="Auto calculate"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-orange-400"
                />
              </div>

            </div>
          </section>

          {/* BUTTONS */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">

            <button
              type="submit"
              className="rounded-xl bg-orange-500 px-7 py-3 font-bold text-slate-950 hover:bg-orange-400"
            >
              🚀 Generate Campaign Report
            </button>

            <button
              type="button"
              onClick={resetCampaign}
              className="rounded-xl border border-slate-700 px-7 py-3 font-semibold text-slate-300 hover:bg-slate-800"
            >
              Clear Campaign
            </button>

          </div>
        </form>

        {/* RESULTS */}
        {results && (
          <div className="mt-8">

            <div className="mb-6 rounded-2xl border border-orange-400/20 bg-orange-400/5 p-6">
              <p className="text-sm text-orange-300">
                Campaign Generated
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {campaignName}
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                {business} · {location}
              </p>
            </div>

            {/* RESULT CARDS */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">
                  Total Budget
                </p>

                <p className="mt-2 text-3xl font-bold text-orange-300">
                  ₹
                  {results.totalBudget.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">
                  Estimated Impressions
                </p>

                <p className="mt-2 text-3xl font-bold text-cyan-300">
                  {results.estimatedImpressions.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">
                  Estimated Clicks
                </p>

                <p className="mt-2 text-3xl font-bold text-emerald-300">
                  {results.estimatedClicks.toLocaleString(
                    "en-IN"
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">
                  Estimated Spend
                </p>

                <p className="mt-2 text-3xl font-bold text-purple-300">
                  ₹
                  {results.estimatedSpend.toFixed(2)}
                </p>
              </div>

            </div>

            {/* BILLING */}
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <h2 className="text-xl font-semibold">
                5. Mock Billing Report
              </h2>

              <div className="mt-5 overflow-x-auto">

                <table className="w-full text-left text-sm">

                  <tbody>

                    <tr className="border-b border-slate-800">
                      <td className="py-4 text-slate-400">
                        Daily Budget
                      </td>

                      <td className="py-4 text-right font-semibold">
                        ₹
                        {Number(dailyBudget).toLocaleString(
                          "en-IN"
                        )}
                      </td>
                    </tr>

                    <tr className="border-b border-slate-800">
                      <td className="py-4 text-slate-400">
                        Campaign Duration
                      </td>

                      <td className="py-4 text-right font-semibold">
                        {duration} days
                      </td>
                    </tr>

                    <tr className="border-b border-slate-800">
                      <td className="py-4 text-slate-400">
                        Average CPC
                      </td>

                      <td className="py-4 text-right font-semibold">
                        ₹
                        {results.averageCpc.toFixed(2)}
                      </td>
                    </tr>

                    <tr className="border-b border-slate-800">
                      <td className="py-4 text-slate-400">
                        Estimated CTR
                      </td>

                      <td className="py-4 text-right font-semibold">
                        {results.ctr.toFixed(2)}%
                      </td>
                    </tr>

                    <tr className="border-b border-slate-800">
                      <td className="py-4 text-slate-400">
                        Estimated Spend
                      </td>

                      <td className="py-4 text-right font-semibold text-orange-300">
                        ₹
                        {results.estimatedSpend.toFixed(2)}
                      </td>
                    </tr>

                    <tr>
                      <td className="py-4 text-slate-400">
                        Remaining Budget
                      </td>

                      <td className="py-4 text-right font-semibold text-emerald-300">
                        ₹
                        {results.remainingBudget.toFixed(2)}
                      </td>
                    </tr>

                  </tbody>

                </table>

              </div>
            </div>

            {/* AD PREVIEW */}
            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">

              <h2 className="text-xl font-semibold">
                Ad Preview
              </h2>

              <div className="mt-5 max-w-2xl rounded-xl border border-slate-700 bg-white p-5 text-slate-900">

                <div className="text-xs font-medium text-emerald-700">
                  Sponsored · {finalUrl || "example.com"}
                </div>

                <h3 className="mt-2 text-xl font-semibold text-blue-700">
                  {headline1 ||
                    "Your First Advertisement"}
                  {" · "}
                  {headline2 || "Grow Your Business"}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description ||
                    "Create an attractive advertisement that reaches your target audience."}
                </p>

              </div>
            </div>

            {/* DISCLAIMER */}
            <div className="mt-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-5">

              <p className="text-sm leading-6 text-yellow-200">
                <strong>Practical note:</strong> This is a
                Google Ads campaign simulator for academic
                purposes. CPC, impressions, clicks, CTR and
                billing values are simulated estimates and
                are not live Google Ads data.
              </p>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}