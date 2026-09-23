import ScoreCircle from "./ScoreCircle.jsx";
import CheckRow from "./CheckRow.jsx";

export default function ReportCard({ category }) {
  const { label, score, checks, unavailable } = category;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">{label}</h3>
        <ScoreCircle score={score ?? 0} size={64} />
      </div>
      {unavailable && (
        <p className="text-sm text-yellow-700 bg-yellow-50 rounded-lg p-3 mb-3">
          This category couldn't be fully measured for this scan.
        </p>
      )}
      <div className="space-y-3">
        {checks.map((c) => (
          <CheckRow key={c.id} {...c} />
        ))}
      </div>
    </div>
  );
}
