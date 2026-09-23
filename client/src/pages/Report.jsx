import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { RotateCcw, Download } from "lucide-react";
import ScoreCircle from "../components/ScoreCircle.jsx";
import ReportCard from "../components/ReportCard.jsx";
import LeadForm from "../components/LeadForm.jsx";
import { getReport } from "../lib/api.js";

export default function Report({ report: reportFromState, onScanAnother }) {
  const { id } = useParams();
  const [report, setReport] = useState(reportFromState);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    // If the user navigated here directly (e.g. refreshed the page), the
    // in-memory report from App state is gone — fetch it by id instead.
    if (reportFromState) {
      setReport(reportFromState);
      return;
    }
    getReport(id)
      .then(setReport)
      .catch((err) => setLoadError(err.message));
  }, [id, reportFromState]);

  if (loadError) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-red-600 font-medium">{loadError}</p>
        <button onClick={onScanAnother} className="mt-4 text-brand-600 font-semibold">
          Scan a website
        </button>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center text-slate-500">
        Loading report...
      </div>
    );
  }

  const categories = Object.values(report.categories);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 print-area">
      <div className="text-center mb-10">
        <p className="text-sm text-slate-500 break-all">{report.url}</p>
        <div className="flex justify-center mt-4">
          <ScoreCircle
            score={report.overallScore}
            grade={report.overallGrade}
            size={180}
            label="Overall score"
          />
        </div>
        {report.partial && (
          <p className="mt-4 inline-block text-sm text-yellow-700 bg-yellow-50 rounded-lg px-4 py-2">
            This is a partial report — some performance data couldn't be retrieved.
          </p>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <ReportCard key={cat.label} category={cat} />
        ))}
      </div>

      <div className="no-print flex flex-col sm:flex-row gap-3 justify-center mt-10">
        <button
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 font-semibold px-6 py-3 transition-colors"
        >
          <Download size={18} />
          Download PDF Report
        </button>
        <button
          onClick={onScanAnother}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 transition-colors"
        >
          <RotateCcw size={18} />
          Scan Another Website
        </button>
      </div>

      <div className="no-print mt-16 bg-white rounded-2xl border border-slate-200 p-8">
        <h2 className="text-xl font-bold text-center text-slate-900">
          Want help fixing these issues?
        </h2>
        <p className="text-center text-slate-600 mt-2 mb-6">
          Leave your details and we'll reach out to help you improve your score.
        </p>
        <LeadForm scannedUrl={report.url} />
      </div>
    </div>
  );
}
