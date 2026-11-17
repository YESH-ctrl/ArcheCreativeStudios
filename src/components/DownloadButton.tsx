import React from "react";

export interface DownloadButtonProps {
  filename: string;
  label?: string;
  variant?: "primary" | "ghost" | "card";
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Reusable, accessible PDF download button matching ARCHE design tokens.
 * Triggers a real browser download attribute to public/downloads/
 */
export function DownloadButton({
  filename,
  label = "Download Service Guide",
  variant = "ghost",
  className = "",
  style,
}: DownloadButtonProps) {
  const downloadUrl = `/downloads/${encodeURIComponent(filename)}`;

  const baseStyle: React.CSSProperties = {
    ...style,
  };

  return (
    <a
      href={downloadUrl}
      download={filename}
      className={`group relative inline-flex items-center gap-[9px] rounded-full border px-[18px] py-[10px] font-mono text-[11px] uppercase tracking-[0.12em] select-none transition-all duration-300 ${variant === "primary"
          ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#0c0c0d]"
          : "border-[var(--line)] bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--accent-deep)] hover:bg-[var(--accent)] hover:text-[#0c0c0d]"
        } ${className}`}
      style={baseStyle}
      data-magnetic
      data-cursor="DOWNLOAD"
      title={`Download ${filename}`}
      aria-label={`Download ${label} (PDF)`}
    >
      {/* PDF download document icon */}
      <svg
        className="h-[13px] w-[13px] flex-shrink-0 transition-transform duration-300 group-hover:translate-y-[1px]"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 2H4a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6L9 2z" />
        <path d="M9 2v4h4" />
        <path d="M8 8v4" />
        <path d="M6 10l2 2 2-2" />
      </svg>

      <span className="truncate">{label}</span>

      {/* Subtle indicator tag */}
      <span
        className="rounded-[3px] px-[4px] py-[1px] text-[9px] tracking-normal font-mono transition-colors duration-300"
        style={{
          background: "rgba(12,12,13,0.06)",
        }}
      >
        PDF
      </span>
    </a>
  );
}
