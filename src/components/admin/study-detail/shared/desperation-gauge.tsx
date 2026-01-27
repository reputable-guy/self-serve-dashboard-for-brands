/**
 * Desperation/Urgency Gauge
 *
 * Visual gauge showing urgency level (1-10) with color coding.
 */

interface DesperationGaugeProps {
  level: number;
  showLabel?: boolean;
}

export function DesperationGauge({ level, showLabel = false }: DesperationGaugeProps) {
  const percentage = (level / 10) * 100;
  const color = level >= 8 ? "bg-rose-500" : level >= 5 ? "bg-amber-500" : "bg-emerald-500";

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-medium text-slate-500 tabular-nums">
        {level}/10
      </span>
      {showLabel && (
        <span className="text-xs text-slate-400">
          {level >= 8 ? "High" : level >= 5 ? "Moderate" : "Low"}
        </span>
      )}
    </div>
  );
}

export default DesperationGauge;
