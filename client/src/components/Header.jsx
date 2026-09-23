import { Link } from "react-router-dom";
import { Gauge } from "lucide-react";

export default function Header() {
  return (
    <header className="no-print border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-slate-900">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-brand-500 text-white">
            <Gauge size={20} />
          </span>
          WebAudit
        </Link>
        <nav className="text-sm text-slate-500">
          <span className="hidden sm:inline">Free website & SEO audits</span>
        </nav>
      </div>
    </header>
  );
}
