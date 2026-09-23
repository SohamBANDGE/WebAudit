import { useMemo, useState } from "react";

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "this",
  "from",
  "your",
  "you",
  "are",
  "how",
  "what",
  "why",
  "can",
  "into",
  "about",
  "best",
  "top",
  "get",
  "use",
  "using",
  "near",
]);

function hashNumber(text, min, max) {
  let hash = 0;

  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }

  return min + (hash % (max - min + 1));
}

function buildKeywords(topic) {
  const cleanTopic = topic
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ");

  if (!cleanTopic) return [];

  const words = cleanTopic
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

  const base = words.join(" ");

  const suggestions = [
    base,
    `best ${base}`,
    `${base} guide`,
    `${base} tips`,
    `${base} tools`,
    `${base} services`,
    `${base} for beginners`,
    `how to ${base}`,
    `${base} examples`,
    `${base} benefits`,
    `${base} strategy`,
    `${base} checklist`,
  ];

  const unique = [...new Set(suggestions)];

  return unique.map((keyword, index) => {
    const volume = hashNumber(`${keyword}-volume`, 100, 18000);
    const difficulty = hashNumber(`${keyword}-difficulty`, 15, 85);
    const competition = hashNumber(`${keyword}-competition`, 20, 95);
    const cpc = (hashNumber(`${keyword}-cpc`, 20, 450) / 100).toFixed(2);

    let intent = "Informational";

    if (
      keyword.includes("buy") ||
      keyword.includes("price") ||
      keyword.includes("services")
    ) {
      intent = "Transactional";
    } else if (
      keyword.includes("best") ||
      keyword.includes("tools") ||
      keyword.includes("examples")
    ) {
      intent = "Commercial";
    } else if (keyword.startsWith("how to")) {
      intent = "Informational";
    }

    return {
      id: index + 1,
      keyword,
      volume,
      difficulty,
      competition,
      cpc,
      intent,
    };
  });
}

function difficultyLabel(value) {
  if (value < 35) return "Easy";
  if (value < 65) return "Medium";
  return "Hard";
}

export default function KeywordResearch() {
  const [topic, setTopic] = useState("");
  const [searchedTopic, setSearchedTopic] = useState("");

  const keywords = useMemo(
    () => buildKeywords(searchedTopic),
    [searchedTopic]
  );

  function handleSearch(event) {
    event.preventDefault();

    if (!topic.trim()) return;

    setSearchedTopic(topic.trim());
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <div className="mb-3 inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300">
            Assignment 2
          </div>

          <h1 className="text-4xl font-bold tracking-tight">
            Keyword Research Lab
          </h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            Discover keyword ideas, search intent, estimated search volume,
            competition and keyword difficulty for your target topic.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl"
        >
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Enter your topic or seed keyword
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
              placeholder="Example: digital marketing"
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />

            <button
              type="submit"
              className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Research Keywords
            </button>
          </div>
        </form>

        {!searchedTopic && (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-12 text-center">
            <div className="mb-4 text-5xl">🔑</div>
            <h2 className="text-xl font-semibold">
              Start your keyword research
            </h2>
            <p className="mt-2 text-slate-400">
              Enter a topic above to generate a keyword research table.
            </p>
          </div>
        )}

        {searchedTopic && keywords.length > 0 && (
          <>
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">Seed Topic</p>
                <p className="mt-2 font-semibold">{searchedTopic}</p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">Keywords Found</p>
                <p className="mt-2 text-2xl font-bold text-cyan-300">
                  {keywords.length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">Low Difficulty</p>
                <p className="mt-2 text-2xl font-bold text-emerald-400">
                  {keywords.filter((k) => k.difficulty < 35).length}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
                <p className="text-sm text-slate-400">Commercial Ideas</p>
                <p className="mt-2 text-2xl font-bold text-purple-300">
                  {keywords.filter((k) => k.intent === "Commercial").length}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-xl">
              <div className="border-b border-slate-800 px-5 py-4">
                <h2 className="font-semibold">Keyword Suggestions</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Metrics shown here are simulated estimates for the college
                  practical and are not live Google Keyword Planner data.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-slate-950 text-slate-400">
                    <tr>
                      <th className="px-5 py-4">Keyword</th>
                      <th className="px-5 py-4">Volume</th>
                      <th className="px-5 py-4">Difficulty</th>
                      <th className="px-5 py-4">Competition</th>
                      <th className="px-5 py-4">CPC</th>
                      <th className="px-5 py-4">Intent</th>
                    </tr>
                  </thead>

                  <tbody>
                    {keywords.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-slate-800 transition hover:bg-slate-800/50"
                      >
                        <td className="px-5 py-4 font-medium text-white">
                          {item.keyword}
                        </td>

                        <td className="px-5 py-4 text-slate-300">
                          {item.volume.toLocaleString()}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={
                              item.difficulty < 35
                                ? "rounded-full bg-emerald-400/10 px-3 py-1 text-emerald-400"
                                : item.difficulty < 65
                                ? "rounded-full bg-yellow-400/10 px-3 py-1 text-yellow-400"
                                : "rounded-full bg-red-400/10 px-3 py-1 text-red-400"
                            }
                          >
                            {difficultyLabel(item.difficulty)}{" "}
                            {item.difficulty}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-slate-300">
                          {item.competition}%
                        </td>

                        <td className="px-5 py-4 text-slate-300">
                          ${item.cpc}
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-cyan-300">
                            {item.intent}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6">
              <h2 className="font-semibold text-cyan-300">
                💡 SEO Strategy
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                For a practical SEO campaign, prioritize relevant keywords
                with lower difficulty, then create content that matches the
                user's search intent. Use the selected keyword naturally in
                the page title, H1, meta description, headings and body
                content.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}