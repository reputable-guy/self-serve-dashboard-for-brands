/**
 * Horizontal Bar Chart
 *
 * Simple horizontal bar chart for showing distributions.
 */

interface BarChartData {
  label: string;
  value: number;
  percentage: number;
}

interface HorizontalBarChartProps {
  data: BarChartData[];
  maxValue?: number;
  colorClass?: string;
}

export function HorizontalBarChart({
  data,
  maxValue,
  colorClass = "bg-[#00D1C1]",
}: HorizontalBarChartProps) {
  const max = maxValue || Math.max(...data.map(d => d.percentage), 1);

  return (
    <div className="space-y-3">
      {data.map((item, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span
              className="text-slate-600 line-clamp-2 flex-1 pr-2"
              title={item.label}
            >
              {item.label}
            </span>
            <span className="font-medium text-slate-700 tabular-nums flex-shrink-0">
              {item.percentage}%
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${colorClass} rounded-full transition-all duration-500`}
              style={{ width: `${(item.percentage / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default HorizontalBarChart;
