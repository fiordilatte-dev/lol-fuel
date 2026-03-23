interface PriceChangeIndicatorProps {
  change: number;
  className?: string;
}

export function PriceChangeIndicator({
  change,
  className = "",
}: PriceChangeIndicatorProps) {
  const isPositive = change > 0;
  const isZero = change === 0;
  const arrow = isPositive ? "▲" : isZero ? "—" : "▼";
  const color = isPositive
    ? "text-red-500"
    : isZero
      ? "text-[#888888]"
      : "text-green-500";

  return (
    <span className={`inline-flex items-center gap-1 text-sm font-mono ${color} ${className}`}>
      <span>{arrow}</span>
      <span>{Math.abs(change).toFixed(1)}¢ today</span>
    </span>
  );
}
