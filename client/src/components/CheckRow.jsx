import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const STYLES = {
  pass: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  warn: { icon: AlertTriangle, color: "text-yellow-600", bg: "bg-yellow-50" },
  fail: { icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
};

export default function CheckRow({ label, status, detail, tip }) {
  const { icon: Icon, color, bg } = STYLES[status] || STYLES.warn;
  return (
    <div className={`rounded-lg ${bg} p-4 flex gap-3`}>
      <Icon className={`${color} shrink-0 mt-0.5`} size={20} />
      <div className="min-w-0">
        <div className="font-semibold text-slate-900">{label}</div>
        <div className="text-sm text-slate-600 mt-0.5">{detail}</div>
        {tip && tip !== "N/A" && (
          <div className="text-sm text-slate-500 mt-1 italic">Tip: {tip}</div>
        )}
      </div>
    </div>
  );
}
