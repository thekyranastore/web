function buildAreaPath(points: number[], width: number, height: number) {
  if (points.length === 0) return { line: "", area: "" };

  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const stepX = width / Math.max(points.length - 1, 1);

  const coords = points.map((value, index) => {
    const x = index * stepX;
    const y = height - ((value - min) / range) * height;
    return [x, y];
  });

  const line = coords.map(([x, y], index) => `${index === 0 ? "M" : "L"}${x},${y}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;

  return { line, area };
}

export function RevenueSparkline({ points }: { points: number[] }) {
  const width = 600;
  const height = 160;
  const { line, area } = buildAreaPath(points, width, height);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-40 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {area && <path d={area} fill="url(#revenue-fill)" stroke="none" />}
      {line && (
        <path d={line} fill="none" stroke="var(--primary)" strokeWidth={2} strokeLinecap="round" />
      )}
    </svg>
  );
}
