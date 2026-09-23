function colorForScore(score) {
  if (score >= 90) return "#16a34a"; // green
  if (score >= 70) return "#0ea5a0"; // brand teal
  if (score >= 50) return "#eab308"; // yellow
  return "#dc2626"; // red
}

export default function ScoreCircle({ score, grade, size = 160, label }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score ?? 0));
  const offset = circumference - (clamped / 100) * circumference;
  const color = colorForScore(clamped);

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="12"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(90 ${size / 2} ${size / 2})`}
          className="fill-slate-900 font-bold"
          style={{ fontSize: size * 0.28 }}
        >
          {grade || clamped}
        </text>
      </svg>
      {label && <div className="text-sm font-medium text-slate-500">{label}</div>}
    </div>
  );
}
