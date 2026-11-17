import { AcMonogram } from "./AcMonogram";

/**
 * Arche wordmark. The symbol is the interwoven AC monogram, set against the grotesk logotype.
 * A single accent square marks the "system active" state, echoing the node language used site-wide.
 */
export function Wordmark({
  size = 28,
  monogramScale = 1.3,
  accent = true,
  onDark = false,
}: {
  size?: number;
  monogramScale?: number;
  accent?: boolean;
  onDark?: boolean;
}) {
  const monogramH = Math.round(size * monogramScale);
  const dotSize = Math.max(5, Math.round(size * 0.22));

  return (
    <span
      className="inline-flex items-center gap-[10px] select-none"
      style={{ lineHeight: 1 }}
      aria-label="Arche"
    >
      <AcMonogram size={monogramH} onDark={onDark} style={{ alignSelf: "center" }} />
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: size,
          fontWeight: 600,
          letterSpacing: "-0.05em",
        }}
      >
        Arche
      </span>
      {accent && (
        <span
          style={{
            width: dotSize,
            height: dotSize,
            background: "var(--accent)",
            alignSelf: "flex-start",
            marginTop: Math.max(2, Math.round(size * 0.08)),
          }}
        />
      )}
    </span>
  );
}
