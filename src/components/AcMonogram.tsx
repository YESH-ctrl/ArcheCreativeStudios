import React from "react";

export interface AcMonogramProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  /** When true, renders directly on dark surfaces */
  onDark?: boolean;
}

/**
 * ARCHÉ — AC Monogram Brand Symbol
 *
 * Source artwork referenced directly as public asset `/arche logo.jpeg`:
 * - Native artwork aspect ratio: 310w / 234h = 1.325:1
 * - Pure transparent background: only the A and C letterforms.
 * - Static wherever it appears outside the preloader.
 */
export function AcMonogram({
  size = 20,
  className = "",
  style,
  onDark = false,
}: AcMonogramProps) {
  const width = Math.round(size * (310 / 234));
  const height = size;

  return (
    <span
      className={`ac-monogram-wrap inline-flex items-center justify-center select-none ${className}`}
      style={{
        verticalAlign: "middle",
        ...style,
      }}
      aria-hidden="true"
    >
      <span
        className="relative inline-block overflow-hidden"
        style={{
          width,
          height,
        }}
      >
        <img
          src="/arche%20logo.jpeg"
          alt="Arche AC Monogram"
          className="w-full h-full object-contain pointer-events-none select-none"
          style={!onDark ? { filter: "brightness(0.1)" } : undefined}
        />
      </span>
    </span>
  );
}

