import { cn } from "@/lib/utils";

type TrendBarsProps = {
  data: number[];
  color?: string;
  trackColor?: string;
  className?: string;
};

/**
 * Dependency-free animated vertical bar chart. Each bar grows from the
 * baseline on mount with a staggered delay.
 */
export function TrendBars({
  data,
  color = "var(--chart-1)",
  trackColor = "color-mix(in srgb, var(--foreground) 8%, transparent)",
  className,
}: TrendBarsProps) {
  const max = Math.max(...data) || 1;

  return (
    <div className={cn("flex items-end gap-1.5", className)} role="img" aria-hidden>
      {data.map((value, index) => (
        <div
          key={index}
          className="flex h-full flex-1 items-end overflow-hidden rounded-sm"
          style={{ background: trackColor }}
        >
          <span
            className="chart-bar w-full rounded-sm"
            style={{
              height: `${Math.max((value / max) * 100, 6)}%`,
              background: color,
              animationDelay: `${index * 55}ms`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
