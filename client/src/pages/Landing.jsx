import { ScanSearch, Gauge, ClipboardList, ShieldCheck, Zap, UserX } from "lucide-react";
import ScanForm from "../components/ScanForm.jsx";

const STEPS = [
  {
    icon: ScanSearch,
    title: "1. Enter your URL",
    text: "Paste your website address — no signup or install needed.",
  },
  {
    icon: Gauge,
    title: "2. We scan it",
    text: "We check SEO basics, speed, mobile-friendliness, and content quality.",
  },
  {
    icon: ClipboardList,
    title: "3. Get your report",
    text: "See a plain-English score card with tips to fix every issue.",
  },
];

const TRUST = [
  { icon: ShieldCheck, text: "100% Free" },
  { icon: UserX, text: "No Signup Required" },
  { icon: Zap, text: "Instant Results" },
];

export default function Landing({ onScan, loading, error }) {
  return (
    <div>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Is your website losing you customers?
        </h1>
        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
          Get a free, instant audit of your site's SEO, speed, mobile-friendliness,
          and content — with clear fixes for every issue we find.
        </p>

        <div className="mt-8">
          <ScanForm onScan={onScan} loading={loading} />
          {error && (
            <p className="mt-3 text-sm text-red-600 font-medium">{error}</p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {TRUST.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm font-medium text-slate-600">
              <Icon size={18} className="text-brand-600" />
              {text}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-10">
            How it works
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 mb-4">
                  <Icon size={26} />
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-600 mt-2">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
