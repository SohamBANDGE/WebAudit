import {
  ScanSearch,
  Gauge,
  ClipboardList,
  ShieldCheck,
  Zap,
  UserX,
  KeyRound,
  FileText,
  Megaphone,
  ArrowRight,
  Search,
  BarChart3,
} from "lucide-react";

import { Link } from "react-router-dom";
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

const TOOLS = [
  {
    icon: ScanSearch,
    number: "Assignment 1",
    title: "SEO Audit",
    description:
      "Scan any website and analyze SEO basics, technical issues, speed, mobile-friendliness and content quality.",
    button: "Start SEO Audit",
    link: "/",
    iconClass: "bg-teal-50 text-teal-600",
    buttonClass: "bg-teal-600 hover:bg-teal-700",
  },
  {
    icon: KeyRound,
    number: "Assignment 2",
    title: "Keyword Research",
    description:
      "Discover keyword ideas with simulated search volume, difficulty, competition, CPC and search intent.",
    button: "Research Keywords",
    link: "/keywords",
    iconClass: "bg-blue-50 text-blue-600",
    buttonClass: "bg-blue-600 hover:bg-blue-700",
  },
  {
    icon: FileText,
    number: "Assignment 2",
    title: "Content Optimizer",
    description:
      "Analyze your SEO title, meta description, keyword usage, content length, headings and keyword density.",
    button: "Optimize Content",
    link: "/content-optimizer",
    iconClass: "bg-purple-50 text-purple-600",
    buttonClass: "bg-purple-600 hover:bg-purple-700",
  },
  {
    icon: Megaphone,
    number: "Assignment 3",
    title: "Google Ads Simulator",
    description:
      "Build a mock advertising campaign with keywords, ad copy, audience, budget and simulated billing.",
    button: "Create Campaign",
    link: "/google-ads",
    iconClass: "bg-orange-50 text-orange-600",
    buttonClass: "bg-orange-600 hover:bg-orange-700",
  },
];

export default function Landing({ onScan, loading, error }) {
  return (
    <div className="bg-slate-50">

      {/* =====================================================
          HERO / SEO AUDIT
      ====================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center">

        <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700">
          <BarChart3 size={16} />
          Digital Marketing & SEO Toolkit
        </div>

        <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Analyze. Optimize. Advertise.
        </h1>

        <p className="mt-5 text-lg text-slate-600 max-w-3xl mx-auto">
          WebAudit is a practical digital marketing toolkit for
          website SEO auditing, keyword research, content
          optimization and Google Ads campaign simulation.
        </p>

        {/* SEO AUDIT CARD */}
        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">

          <div className="flex flex-col items-center">

            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 text-brand-600">
              <Search size={28} />
            </div>

            <p className="mt-4 text-sm font-semibold text-brand-600">
              ASSIGNMENT 1
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              SEO Website Audit
            </h2>

            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Check your website's SEO, performance, mobile
              friendliness and content quality with a detailed
              audit report.
            </p>

            <div className="w-full mt-7">
              <ScanForm onScan={onScan} loading={loading} />

              {error && (
                <p className="mt-3 text-sm text-red-600 font-medium">
                  {error}
                </p>
              )}
            </div>

          </div>
        </div>

        {/* TRUST */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {TRUST.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-2 text-sm font-medium text-slate-600"
            >
              <Icon size={18} className="text-brand-600" />
              {text}
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          ASSIGNMENTS / TOOLS
      ====================================================== */}
      <section className="border-y border-slate-200 bg-white py-16">

        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-12">

            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">
              WebAudit Toolkit
            </p>

            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              Explore All Assignments
            </h2>

            <p className="mt-3 max-w-2xl mx-auto text-slate-600">
              Complete your digital marketing practical work
              using four interactive tools across three assignments.
            </p>

          </div>

          {/* TOOL CARDS */}
          <div className="grid gap-6 sm:grid-cols-2">

            {TOOLS.map(
              ({
                icon: Icon,
                number,
                title,
                description,
                button,
                link,
                iconClass,
                buttonClass,
              }) => (
                <div
                  key={title}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >

                  <div className="flex items-start justify-between">

                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${iconClass}`}
                    >
                      <Icon size={24} />
                    </div>

                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                      {number}
                    </span>

                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-900">
                    {title}
                  </h3>

                  <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-600">
                    {description}
                  </p>

                  <Link
                    to={link}
                    className={`mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition ${buttonClass}`}
                  >
                    {button}
                    <ArrowRight size={16} />
                  </Link>

                </div>
              )
            )}

          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ====================================================== */}
      <section className="py-16">

        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          <h2 className="text-2xl font-bold text-center text-slate-900 mb-10">
            How SEO Audit Works
          </h2>

          <div className="grid sm:grid-cols-3 gap-8">

            {STEPS.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="text-center"
              >

                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 mb-4">
                  <Icon size={26} />
                </div>

                <h3 className="font-semibold text-slate-900">
                  {title}
                </h3>

                <p className="text-sm text-slate-600 mt-2">
                  {text}
                </p>

              </div>
            ))}

          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER MESSAGE
      ====================================================== */}
      <section className="border-t border-slate-200 bg-slate-900 py-10">

        <div className="max-w-5xl mx-auto px-4 text-center">

          <h2 className="text-xl font-bold text-white">
            One Platform. Three Assignments.
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            SEO Audit · Keyword Research · Content Optimization · Google Ads
          </p>

        </div>
      </section>

    </div>
  );
}