import { Link, useLocation } from "react-router-dom";
import {
  Gauge,
  Search,
  KeyRound,
  FileText,
  Megaphone,
} from "lucide-react";

export default function Header() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="no-print border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          {/* LOGO */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-lg text-slate-900"
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-brand-500 text-white">
              <Gauge size={20} />
            </span>

            WebAudit
          </Link>

          {/* NAVIGATION */}
          <nav className="flex flex-wrap items-center gap-2 text-sm">

            {/* SEO AUDIT */}
            <Link
              to="/"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                isActive("/")
                  ? "bg-brand-50 text-brand-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Search size={16} />
              SEO Audit
            </Link>

            {/* KEYWORD RESEARCH */}
            <Link
              to="/keywords"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                isActive("/keywords")
                  ? "bg-brand-50 text-brand-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <KeyRound size={16} />
              Keyword Research
            </Link>

            {/* CONTENT OPTIMIZER */}
            <Link
              to="/content-optimizer"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                isActive("/content-optimizer")
                  ? "bg-brand-50 text-brand-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <FileText size={16} />
              Content Optimizer
            </Link>

            {/* GOOGLE ADS */}
            <Link
              to="/google-ads"
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                isActive("/google-ads")
                  ? "bg-brand-50 text-brand-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Megaphone size={16} />
              Google Ads
            </Link>

          </nav>

        </div>
      </div>
    </header>
  );
}