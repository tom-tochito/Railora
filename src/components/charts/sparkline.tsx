import { cn } from "@/lib/utils";

type SparklineProps = {
  data: number[];
  /** CSS color or token, e.g. "var(--chart-1)". */
  color?: string;
  className?: string;
  /** Internal viewBox height; controls the curve aspect, not the rendered size. */
  height?: number;
  strokeWidth?: number;
  fill?: boolean;
  showDot?: boolean;
  id?: string;
};

/**
 * Dependency-free animated area sparkline. Pure SVG + CSS draw-in (no JS, no
 * chart library). The wrapper stretches to its container; the end dot is an
 * HTML element positioned by percentage so it stays circular when stretched.
 */
export function Sparkline({
  data,
  color = "var(--chart-1)",
  className,
  height = 64,
  strokeWidth = 2,
  fill = true,
  showDot = true,
  id = "spark",
}: SparklineProps) {
  const width = 100;
  const pad = strokeWidth + 1;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = data.length === 1 ? width / 2 : (index / (data.length - 1)) * width;
    const y = pad + (1 - (value - min) / range) * (height - pad * 2);
    return [x, y] as const;
  });

  const line = points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
  const area = `${line} L ${width} ${height} L 0 ${height} Z`;
  const [lastX, lastY] = points[points.length - 1];
  const gradientId = `${id}-grad`;

  return (
    <div className={cn("relative", className)} role="img" aria-hidden>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="block h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {fill ? <path d={area} fill={`url(#${gradientId})`} className="chart-area" /> : null}
        <path
          d={line}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={100}
          vectorEffect="non-scaling-stroke"
          className="chart-line"
        />
      </svg>
      {showDot ? (
        <span
          className="chart-dot pointer-events-none absolute size-2 rounded-full"
          style={{
            left: `${lastX}%`,
            top: `${(lastY / height) * 100}%`,
            background: color,
            color,
          }}
        />
      ) : null}
    </div>
  );
}
