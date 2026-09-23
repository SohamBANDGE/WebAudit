import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

export default function ScanForm({ onScan, loading }) {
  const [url, setUrl] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim() || loading) return;
    onScan(url.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl mx-auto flex flex-col sm:flex-row gap-3"
    >
      <input
        type="text"
        inputMode="url"
        placeholder="yourwebsite.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        aria-label="Website URL"
      />
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 transition-colors"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Analyzing your website...
          </>
        ) : (
          <>
            <Search size={18} />
            Scan Now
          </>
        )}
      </button>
    </form>
  );
}
