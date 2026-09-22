export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 90 24"
      className={className}
      role="img"
      aria-label="Kirana"
    >
      <text
        x="0"
        y="19"
        fontSize="20"
        fontWeight="800"
        letterSpacing="-0.5"
        fill="var(--foreground)"
        fontFamily="var(--font-sans)"
      >
        Kirana
      </text>
    </svg>
  );
}
