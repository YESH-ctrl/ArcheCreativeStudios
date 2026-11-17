import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { announcePreviewDone, markPreviewPlayed } from "../lib/autoplay";

/**
 * Video Editing Service Demo (PROMPT 09, autoplay per PROMPT 24)
 *
 * Sequence: RAW -> SELECT -> CUT -> MOTION -> CAPTIONS -> GRADE -> EXPORT
 * Fully scrubbable by visitor via playhead or waveform drag / touch-drag.
 * Non-drag hover on any segment box jumps directly to that stage.
 * Mobile includes an auto-play fallback button.
 *
 * The playhead is CONTINUOUS (a 0..1 value written to a `--ph` custom
 * property, so the head and the played part of the waveform move every
 * frame without re-rendering React); the stage it sits in is the discrete
 * value derived from it. On first view it scrubs the whole RAW -> EXPORT
 * range once, slowly (~4.6s), then hands control to the visitor — any
 * pointer input kills the auto pass immediately and for good.
 */

const SLUG = "video-editing";
/** Seconds for the first-view auto pass across the full range. */
const AUTO_SCRUB = 4.6;

export const STAGES = [
  { id: "raw", label: "RAW", name: "Raw Footage", desc: "Uncut, unprocessed camera output." },
  { id: "select", label: "SELECT", name: "Selection Scan", desc: "Flagging high-retention takes, dropping dead air." },
  { id: "cut", label: "CUT", name: "In/Out Cut Markers", desc: "Pacing cuts dialed with millisecond precision." },
  { id: "motion", label: "MOTION", name: "Kinetic Graphics", desc: "Visual pacing accents and punch-in motion." },
  { id: "captions", label: "CAPTIONS", name: "Dynamic Captions", desc: "Subtitles timed line-by-line for soundless watch." },
  { id: "grade", label: "GRADE", name: "Color & Finish", desc: "Rich contrast with restrained lime accent wash." },
  { id: "export", label: "EXPORT", name: "Master Export", desc: "High-bitrate deliverable ready for platform release." },
] as const;

export type VideoStageId = (typeof STAGES)[number]["id"];

const SEGMENTS = [
  { id: "s1", label: "01", stageIndex: 0, width: "13%" },
  { id: "s2", label: "02", stageIndex: 1, width: "16%" },
  { id: "s3", label: "03", stageIndex: 2, width: "18%" },
  { id: "s4", label: "04", stageIndex: 3, width: "15%" },
  { id: "s5", label: "05", stageIndex: 4, width: "14%" },
  { id: "s6", label: "06", stageIndex: 5, width: "24%" },
];

export function VideoEditingDemo({
  active = false,
  preview = false,
}: {
  active?: boolean;
  preview?: boolean;
}) {
  const LAST = STAGES.length - 1;
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0); // continuous playhead position, 0..1
  const proxy = useRef({ p: 0 });
  const tween = useRef<gsap.core.Tween | null>(null);
  const autoStarted = useRef(false);
  const startTimer = useRef(0);

  const currentStage = STAGES[stageIndex];

  /**
   * Write a playhead position. The head and the played waveform are driven
   * straight off the `--ph` custom property (no React work per frame); the
   * stage state only changes when the head crosses into the next stage.
   */
  const applyPos = (p: number) => {
    const v = Math.max(0, Math.min(1, p));
    posRef.current = v;
    trackRef.current?.style.setProperty("--ph", v.toFixed(4));
    const idx = Math.round(v * LAST);
    setStageIndex((prev) => (prev === idx ? prev : idx));
  };

  const stopTween = () => {
    tween.current?.kill();
    tween.current = null;
    setIsPlaying(false);
  };

  /** Glide the playhead to an absolute position. */
  const glideTo = (p: number, duration: number, ease = "power2.inOut", onDone?: () => void) => {
    if (prefersReducedMotion()) {
      applyPos(p);
      onDone?.();
      return;
    }
    stopTween();
    setIsPlaying(duration > 0.6);
    proxy.current.p = posRef.current;
    tween.current = gsap.to(proxy.current, {
      p,
      duration,
      ease,
      onUpdate: () => applyPos(proxy.current.p),
      onComplete: () => {
        tween.current = null;
        setIsPlaying(false);
        onDone?.();
      },
    });
  };

  /** The visitor took the playhead: no auto pass from here on. */
  const takeOver = () => {
    autoStarted.current = true;
    if (startTimer.current) window.clearTimeout(startTimer.current);
    stopTween();
  };

  const jumpToStage = (idx: number) => {
    takeOver();
    glideTo(Math.max(0, Math.min(LAST, idx)) / LAST, 0.4);
  };

  useEffect(
    () => () => {
      if (startTimer.current) window.clearTimeout(startTimer.current);
      tween.current?.kill();
    },
    []
  );

  /* PROMPT 28 — Video Editing: auto-scrub sequence across RAW → EXPORT plays on view */
  useEffect(() => {
    if (autoStarted.current || !active || preview) return;
    const id = window.setTimeout(() => {
      startTimer.current = 0;
      autoStarted.current = true;
      markPreviewPlayed(SLUG);
      glideTo(1, AUTO_SCRUB, "sine.inOut", () => announcePreviewDone(SLUG));
    }, 450);
    startTimer.current = id;
    return () => {
      window.clearTimeout(id);
      if (startTimer.current === id) startTimer.current = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, preview]);

  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (preview) return;
    takeOver();
    setIsScrubbing(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    updateFromPointer(e.clientX);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isScrubbing) return;
    updateFromPointer(e.clientX);
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isScrubbing) return;
    setIsScrubbing(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  };

  const updateFromPointer = (clientX: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    applyPos((clientX - rect.left) / rect.width);
  };

  /** PLAY / PAUSE — a visitor-triggered pass over the same range. */
  const toggleAutoPlay = () => {
    if (preview) return;
    takeOver();
    if (isPlaying) return; // takeOver() already stopped it
    if (posRef.current > 0.995) applyPos(0);
    glideTo(1, 3.2, "sine.inOut");
  };

  // Map stage to segment selection
  const activeSegmentIdx = Math.min(stageIndex, SEGMENTS.length - 1);

  return (
    <div
      className="video-demo relative flex h-full flex-col justify-between gap-[12px] p-[16px] select-none"
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Top Meta Header */}
      <div className="flex items-center justify-between border-b pb-[10px]" style={{ borderColor: "var(--line)" }}>
        <div className="flex min-w-0 items-center gap-[8px]">
          <span className="block h-[6px] w-[6px] flex-none rounded-full" style={{ background: "var(--accent-deep)" }} />
          <span className="mono mono-fg whitespace-nowrap">STAGE: {currentStage.label}</span>
          <span className="mono hidden truncate text-[10px] opacity-60 sm:inline">· {currentStage.name}</span>
        </div>
        <div className="flex items-center gap-[12px]">
          <span className="mono text-[10px] opacity-50">
            0{stageIndex + 1} / 0{STAGES.length}
          </span>
          {/* Mobile fallback auto-play */}
          <button
            type="button"
            onClick={toggleAutoPlay}
            className="flex items-center gap-[4px] rounded-full border px-[8px] py-[2px] font-mono text-[9px] uppercase transition-colors"
            style={{
              borderColor: isPlaying ? "var(--accent-deep)" : "var(--line)",
              background: isPlaying ? "var(--accent-deep)" : "transparent",
              color: isPlaying ? "var(--solid)" : "var(--fg)",
            }}
            aria-label={isPlaying ? "Pause auto scrub" : "Auto play preview"}
            data-cursor="CLICK"
          >
            {isPlaying ? "⏸⏸ PAUSE" : "▶ PLAY"}
          </button>
        </div>
      </div>

      {/* Main Preview Screen (responsive 16/9 with real studio monitors) */}
      <div
        data-slab="engine"
        className="relative mx-auto w-full max-w-[440px] overflow-hidden rounded-[5px] border select-none"
        style={{
          aspectRatio: "16 / 9",
          borderColor: "rgba(200, 241, 79, 0.25)",
          background: "#08080a",
          boxShadow: "0 10px 30px -10px rgba(0,0,0,0.8), 0 0 1px 1px rgba(200,241,79,0.1)",
        }}
      >
        {/* Persistent Camera HUD Framing Marks & Telemetry */}
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-[10px]">
          {/* Top HUD Row */}
          <div className="flex items-center justify-between text-[8px] font-mono tracking-widest text-[#a1a1aa]/70">
            <div className="flex items-center gap-[6px]">
              <span className="inline-block h-[5px] w-[5px] rounded-full bg-red-500 animate-pulse" />
              <span className="text-white font-semibold">4K DCI · PRORES</span>
            </div>
            <div className="flex items-center gap-[8px]">
              <span>ISO 800</span>
              <span>1/48</span>
              <span>5600K</span>
            </div>
          </div>

          {/* Center Crosshairs */}
          <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 4V9M12 15V20M4 12H9M15 12H20" stroke="var(--accent)" strokeWidth="1" strokeLinecap="round" />
              <circle cx="12" cy="12" r="2.5" stroke="var(--accent)" strokeWidth="0.8" />
            </svg>
          </div>

          {/* Right VU Audio Meter Bar */}
          <div className="absolute right-[8px] top-1/2 -translate-y-1/2 flex flex-col gap-[2px] opacity-75">
            {[90, 75, 82, 60, 45, 30].map((_, i) => (
              <span
                key={i}
                className="h-[3px] w-[7px] rounded-[0.5px] transition-all duration-150"
                style={{
                  background: i === 0 ? "#ef4444" : i === 1 ? "#eab308" : "var(--accent)",
                  opacity: (stageIndex * 2 + i) % 3 === 0 ? 0.9 : 0.35,
                }}
              />
            ))}
          </div>

          {/* Bottom HUD Framing Brackets */}
          <div className="flex items-center justify-between text-[8px] font-mono text-[#a1a1aa]/60">
            <span>⌜ 2.39:1 CINEMASCOPE ⌟</span>
            <span className="text-[var(--accent)] font-semibold">TC 00:04:18:22</span>
          </div>
        </div>

        {/* State 0: RAW */}
        <div
          className="absolute inset-0 flex flex-col justify-between p-[16px] transition-opacity duration-200"
          style={{
            opacity: stageIndex === 0 ? 1 : 0,
            filter: "saturate(0.4) contrast(0.85) brightness(0.9)",
            background: "radial-gradient(circle at 50% 50%, #1e2025 0%, #0a0b0e 100%)",
          }}
        >
          <div className="flex justify-between items-start font-mono text-[9px] text-[#8e8e93]">
            <span className="text-[#a1a1aa]">RED MONSTRO 8K VV [LOG3G10]</span>
            <span className="text-red-400 font-bold">● 24.000 FPS</span>
          </div>
          <div className="my-auto flex flex-col items-center gap-[6px]">
            <div className="rounded border border-dashed border-white/20 bg-black/40 px-[14px] py-[6px] backdrop-blur-sm">
              <span className="font-mono text-[11px] font-semibold text-white/90 tracking-widest uppercase">
                RAW UNGRADED LOG FOOTAGE
              </span>
            </div>
            <span className="font-mono text-[8.5px] text-[#8e8e93] tracking-wide">
              FLAT SENSOR READOUT · WIDE DYNAMIC RANGE
            </span>
          </div>
          <div className="flex justify-between font-mono text-[8.5px] text-[#71717a]">
            <span>GAMMA: LOG3G10</span>
            <span>COLOR SPACE: REDWIDEGAMUTRGB</span>
          </div>
        </div>

        {/* State 1: SELECT */}
        <div
          className="absolute inset-0 flex flex-col justify-between p-[16px] transition-opacity duration-200"
          style={{
            opacity: stageIndex === 1 ? 1 : 0,
            background: "linear-gradient(135deg, #1c1d22 0%, #0c0d10 100%)",
          }}
        >
          <div className="flex justify-between items-start font-mono text-[9px]">
            <span style={{ color: "var(--accent)" }}>AI RETENTION SCAN // 3 TAKES</span>
            <span className="text-white/70">SELECT RATIO: 18%</span>
          </div>
          <div className="my-auto grid grid-cols-3 gap-[8px] max-w-[340px] mx-auto w-full">
            <div className="rounded border border-white/10 bg-black/40 p-[6px] text-center opacity-40">
              <span className="block font-mono text-[8px] text-[#8e8e93]">TAKE 01</span>
              <span className="font-mono text-[9px] text-red-400 font-medium">42% DROP</span>
            </div>
            <div className="rounded border border-white/10 bg-black/40 p-[6px] text-center opacity-40">
              <span className="block font-mono text-[8px] text-[#8e8e93]">TAKE 02</span>
              <span className="font-mono text-[9px] text-amber-400 font-medium">61% TRIM</span>
            </div>
            <div className="rounded border border-[var(--accent)] bg-[var(--accent)]/10 p-[6px] text-center shadow-[0_0_12px_rgba(200,241,79,0.2)]">
              <span className="block font-mono text-[8px] text-[var(--accent)] font-bold">TAKE 03 ★</span>
              <span className="font-mono text-[9px] text-white font-bold">98% KEEP</span>
            </div>
          </div>
          <div className="flex justify-between font-mono text-[8.5px] text-[#a1a1aa]">
            <span>DEAD AIR PURGED: -03:42</span>
            <span className="text-[var(--accent)]">GOLDEN TAKE LOCKED</span>
          </div>
        </div>

        {/* State 2: CUT */}
        <div
          className="absolute inset-0 flex flex-col justify-between p-[16px] transition-opacity duration-200"
          style={{
            opacity: stageIndex === 2 ? 1 : 0,
            background: "linear-gradient(135deg, #18191f 0%, #0b0c10 100%)",
          }}
        >
          <div className="flex justify-between items-start font-mono text-[9px]">
            <span className="text-[var(--accent)]">RHYTHMIC IN/OUT SPLICE</span>
            <span className="text-white/80">PRECISION: ±1 FRAME</span>
          </div>
          <div className="my-auto flex flex-col items-center gap-[6px]">
            <div className="flex items-center gap-[10px]">
              <span className="rounded border border-white/20 bg-black/50 px-[8px] py-[3px] font-mono text-[9px] text-[#c8f14f]">
                IN 00:01:04.12
              </span>
              <span className="text-[var(--accent)] font-mono text-[11px] font-bold">✂ SPLICE</span>
              <span className="rounded border border-white/20 bg-black/50 px-[8px] py-[3px] font-mono text-[9px] text-[#c8f14f]">
                OUT 00:08:19.04
              </span>
            </div>
            <div className="h-[2px] w-[200px] bg-white/20 relative rounded-full overflow-hidden">
              <div className="h-full bg-[var(--accent)] w-[65%]" />
            </div>
            <span className="font-mono text-[9px] text-white/90 tracking-wide">
              PACE MATCHED TO VOCAL CADENCE & MUSIC BEAT
            </span>
          </div>
          <div className="flex justify-between font-mono text-[8.5px] text-[#a1a1aa]">
            <span>CUT DURATION: 07.25s</span>
            <span>AUDIO J-CUT / L-CUT SYNCED</span>
          </div>
        </div>

        {/* State 3: MOTION */}
        <div
          className="absolute inset-0 flex flex-col justify-between p-[16px] transition-opacity duration-200 overflow-hidden"
          style={{
            opacity: stageIndex === 3 ? 1 : 0,
            background: "radial-gradient(circle at 50% 50%, #20222a 0%, #0c0d12 100%)",
          }}
        >
          <div className="flex justify-between items-start font-mono text-[9px]">
            <span className="text-white">KINETIC MOTION ENGINE</span>
            <span style={{ color: "var(--accent)" }}>SMOOTH CUBIC-OUT</span>
          </div>
          <div className="my-auto flex flex-col items-center">
            <div className="relative border-2 border-dashed border-[#c8f14f] bg-[#c8f14f]/5 px-[20px] py-[10px] rounded-[4px] shadow-[0_0_20px_rgba(200,241,79,0.15)]">
              <span className="font-mono text-[13px] font-bold tracking-widest text-white">
                PUNCH IN // 115%
              </span>
              <span className="absolute -top-[4px] -left-[4px] h-[8px] w-[8px] bg-[#c8f14f] rounded-full" />
              <span className="absolute -top-[4px] -right-[4px] h-[8px] w-[8px] bg-[#c8f14f] rounded-full" />
              <span className="absolute -bottom-[4px] -left-[4px] h-[8px] w-[8px] bg-[#c8f14f] rounded-full" />
              <span className="absolute -bottom-[4px] -right-[4px] h-[8px] w-[8px] bg-[#c8f14f] rounded-full" />
            </div>
            <span className="mt-[8px] font-mono text-[8.5px] text-[var(--accent)] tracking-wider">
              KEYFRAMES: (0.16, 1, 0.3, 1) · SPEED RAMP
            </span>
          </div>
          <div className="flex justify-between font-mono text-[8.5px] text-[#71717a]">
            <span>TRANSITION: SEAMLESS WHIP</span>
            <span>MOTION BLUR: 180° SHUTTER</span>
          </div>
        </div>

        {/* State 4: CAPTIONS */}
        <div
          className="absolute inset-0 flex flex-col justify-between p-[16px] transition-opacity duration-200"
          style={{
            opacity: stageIndex === 4 ? 1 : 0,
            background: "linear-gradient(135deg, #1b1d22 0%, #0a0b0e 100%)",
          }}
        >
          <div className="flex justify-between items-start font-mono text-[9px] text-[#a1a1aa]">
            <span className="text-white">DYNAMIC SOCIAL SUBTITLES</span>
            <span style={{ color: "var(--accent)" }}>AI ACCURACY 99.8%</span>
          </div>
          <div className="my-auto text-center flex flex-col items-center gap-[8px]">
            <span className="inline-block rounded-[4px] bg-black/90 px-[14px] py-[6px] font-sans text-[14px] font-bold tracking-tight text-white border border-white/20 shadow-2xl">
              “Systems that turn ideas into <span className="text-[#0c0c0d] bg-[var(--accent)] px-[6px] py-[1px] rounded shadow-[0_0_12px_rgba(200,241,79,0.5)]">leverage</span>.”
            </span>
            <div className="flex items-center gap-[4px]">
              <span className="h-[2px] w-[18px] bg-[var(--accent)]" />
              <span className="font-mono text-[8.5px] text-[#a1a1aa] uppercase tracking-wider">
                AUTO-TIMED WORD-BY-WORD POP
              </span>
              <span className="h-[2px] w-[18px] bg-[var(--accent)]" />
            </div>
          </div>
          <div className="flex justify-between font-mono text-[8.5px] text-[#71717a]">
            <span>READABILITY OPTIMIZED</span>
            <span>MOBILE SAFE ZONE COMPLIANT</span>
          </div>
        </div>

        {/* State 5: GRADE (Split Wipe Before/After) */}
        <div
          className="absolute inset-0 flex flex-col justify-between p-[16px] transition-opacity duration-200"
          style={{
            opacity: stageIndex === 5 ? 1 : 0,
            background: "linear-gradient(90deg, #141518 0%, #141518 48%, #1f2715 48%, #2d381c 100%)",
            boxShadow: "inset 0 0 50px rgba(200, 241, 79, 0.12)",
          }}
        >
          <div className="flex justify-between items-start font-mono text-[9px] z-10">
            <span className="text-white/60">BEFORE: FLAT LOG</span>
            <span className="text-[#c8f14f] font-bold">AFTER: ARCHE 35MM FILM</span>
          </div>

          {/* Split divider visual */}
          <div className="absolute inset-y-0 left-[48%] w-[2px] bg-[var(--accent)] shadow-[0_0_12px_rgba(200,241,79,0.8)] z-10 flex items-center justify-center">
            <div className="h-[20px] w-[20px] rounded-full bg-[var(--accent)] text-[#0c0c0d] flex items-center justify-center text-[10px] font-bold shadow-lg">
              ⬌
            </div>
          </div>

          <div className="my-auto z-10 flex justify-between items-center px-[10px]">
            <div className="text-left font-mono text-[8.5px] text-[#8e8e93]">
              <div>DESATURATED</div>
              <div>FLAT CONTRAST</div>
            </div>
            <div className="text-right font-mono text-[8.5px] text-[#c8f14f]">
              <div className="font-bold">RICH HIGHLIGHT ROLLOFF</div>
              <div>FILM GRAIN + WARM BLACKS</div>
            </div>
          </div>

          <div className="flex justify-between font-mono text-[8.5px] text-[#a1a1aa] z-10">
            <span>LUT: ARCHE MASTER KODAK 5219</span>
            <span className="text-[#c8f14f]">DCI-P3 WIDE COLOR GAMUT</span>
          </div>
        </div>

        {/* State 6: EXPORT */}
        <div
          className="absolute inset-0 flex flex-col justify-between p-[16px] transition-opacity duration-200"
          style={{
            opacity: stageIndex === 6 ? 1 : 0,
            background: "radial-gradient(circle at 50% 50%, #1c2612 0%, #0a0e08 100%)",
          }}
        >
          <div className="flex justify-between items-start font-mono text-[9px] text-[#c8f14f]">
            <span className="font-bold">RENDER PIPELINE 100%</span>
            <span>BITRATE: 45 MBPS</span>
          </div>
          <div className="my-auto flex flex-col items-center gap-[6px]">
            <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#c8f14f] text-[#0c0c0d] font-bold text-[20px] shadow-[0_0_24px_rgba(200,241,79,0.5)]">
              ✓
            </div>
            <span className="font-mono text-[12px] font-bold tracking-widest text-white uppercase">
              MASTER READY FOR DISTRIBUTION
            </span>
            <span className="font-mono text-[8.5px] text-[#c8f14f]/80">
              OPTIMIZED FOR YOUTUBE 4K, TIKTOK, REELS & BROADCAST
            </span>
          </div>
          <div className="flex justify-between font-mono text-[8.5px] text-[#c8f14f]/90">
            <span>APPLE PRORES 422 HQ / H.265</span>
            <span>AUDIO: 24-BIT 48KHZ LPCM</span>
          </div>
        </div>
      </div>

      {/* Timeline Structure (Multi-track NLE Environment) */}
      <div className="flex flex-col gap-[6px]">
        <div className="flex items-center justify-between gap-[8px] text-[10px] font-mono opacity-60">
          <span className="hidden sm:inline">MULTI-TRACK TIMELINE (V2 / V1 / A1)</span>
          <span className="sm:hidden">TIMELINE (TAP TO JUMP)</span>
          <span className="flex-none whitespace-nowrap text-[9px]" style={{ color: "var(--accent-ink)" }}>
            STAGE {stageIndex + 1}/7 · {currentStage.label}
          </span>
        </div>

        {/* Track V2: Motion Graphics & Dynamic Captions Layer */}
        <div className="flex items-center gap-[6px] h-[16px]">
          <span className="mono text-[8px] text-[var(--faint)] w-[16px] flex-none">V2</span>
          <div className="flex-1 flex gap-[4px] h-full">
            <div
              className="rounded-[2px] border text-[7.5px] font-mono px-[5px] flex items-center transition-all duration-200 overflow-hidden"
              style={{
                width: "48%",
                borderColor: stageIndex >= 3 ? "var(--accent-deep)" : "var(--line)",
                background: stageIndex >= 3 ? "color-mix(in srgb, var(--accent) 15%, var(--card))" : "var(--card)",
                color: stageIndex >= 3 ? "var(--accent-ink)" : "var(--faint)",
                opacity: stageIndex >= 3 ? 1 : 0.35,
              }}
            >
              TITLE_OVERLAY // 115%
            </div>
            <div
              className="rounded-[2px] border text-[7.5px] font-mono px-[5px] flex items-center transition-all duration-200 overflow-hidden"
              style={{
                width: "48%",
                borderColor: stageIndex >= 4 ? "var(--accent-deep)" : "var(--line)",
                background: stageIndex >= 4 ? "color-mix(in srgb, var(--accent) 15%, var(--card))" : "var(--card)",
                color: stageIndex >= 4 ? "var(--accent-ink)" : "var(--faint)",
                opacity: stageIndex >= 4 ? 1 : 0.35,
              }}
            >
              DYNAMIC_CAPTIONS.SRT
            </div>
          </div>
        </div>

        {/* Track V1: A-Roll Primary Cuts */}
        <div className="flex items-center gap-[6px] h-[30px]">
          <span className="mono text-[8px] text-[var(--faint)] w-[16px] flex-none">V1</span>
          <div className="flex-1 flex gap-[3px] h-full">
            {SEGMENTS.map((seg, i) => {
              const isHighlighted = i === activeSegmentIdx;
              const isPast = i < activeSegmentIdx;
              return (
                <button
                  key={seg.id}
                  type="button"
                  onMouseEnter={() => {
                    if (!preview && !isScrubbing) jumpToStage(seg.stageIndex);
                  }}
                  onClick={() => jumpToStage(seg.stageIndex)}
                  data-slab={`s${i + 1}`}
                  className="group relative h-full rounded-[2px] border transition-all duration-150 flex items-center justify-between px-[5px] overflow-hidden"
                  style={{
                    width: seg.width,
                    borderColor: isHighlighted
                      ? "var(--accent-deep)"
                      : isPast
                      ? "rgba(12, 12, 13, 0.4)"
                      : "var(--line)",
                    background: isHighlighted
                      ? "color-mix(in srgb, var(--accent-deep) 15%, var(--card))"
                      : "var(--card)",
                  }}
                  data-cursor="SELECT"
                  aria-label={`Jump to ${STAGES[seg.stageIndex].label}`}
                >
                  <span
                    className="font-mono text-[8px] transition-colors"
                    style={{ color: isHighlighted ? "var(--accent-ink)" : "var(--muted)" }}
                  >
                    {seg.label}
                  </span>
                  {isHighlighted && (
                    <span className="h-[4px] w-[4px] rounded-full bg-[var(--accent-deep)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Waveform Scrub Track (Track A1) */}
      <div className="flex flex-col gap-[6px]">
        <div className="flex items-center gap-[6px]">
          <span className="mono text-[8px] text-[var(--faint)] w-[16px] flex-none">A1</span>
          <div className="flex-1 flex justify-between items-center text-[9px] font-mono opacity-60">
            <span>AUDIO SYNC / WAVEFORM SCRUB</span>
            <span style={{ color: "var(--accent-ink)" }}>
              STAGE: {currentStage.label}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-[6px]">
          <span className="w-[16px] flex-none" aria-hidden />
          <div
            ref={trackRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            data-slab="grain"
            className="vd-track relative h-[40px] flex-1 cursor-ew-resize rounded-[4px] border overflow-hidden p-[2px] touch-none"
          style={{
            borderColor: isScrubbing ? "var(--accent-deep)" : "var(--line)",
            background: "var(--bg-2)",
          }}
          data-cursor="DRAG"
          role="slider"
          tabIndex={0}
          aria-label="Video timeline scrubber"
          aria-valuemin={0}
          aria-valuemax={STAGES.length - 1}
          aria-valuenow={stageIndex}
          aria-valuetext={currentStage.label}
          onKeyDown={(e) => {
            if (e.key === "Home") {
              e.preventDefault();
              takeOver();
              applyPos(0);
            } else if (e.key === "End") {
              e.preventDefault();
              takeOver();
              applyPos(1);
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              takeOver();
              applyPos(Math.min(1, posRef.current + 1 / LAST));
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              takeOver();
              applyPos(Math.max(0, posRef.current - 1 / LAST));
            }
          }}
        >
          {/* Waveform: one faint bed, one lime copy clipped to the playhead.
              Both read the same `--ph` value, so the sweep is continuous. */}
          {[false, true].map((played) => (
            <svg
              key={played ? "played" : "bed"}
              className={`absolute inset-0 h-full w-full ${played ? "vd-wave-played" : ""}`}
              preserveAspectRatio="none"
              viewBox="0 0 300 40"
              aria-hidden
            >
              {Array.from({ length: 48 }).map((_, i) => {
                const height = 6 + ((i * 23) % 24);
                const x = i * 6.3 + 3;
                return (
                  <line
                    key={i}
                    x1={x}
                    y1={20 - height / 2}
                    x2={x}
                    y2={20 + height / 2}
                    stroke={played ? "var(--accent-deep)" : "var(--faint)"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity={played ? 1 : 0.4}
                  />
                );
              })}
            </svg>
          ))}

          {/* Draggable Playhead */}
          <div
            className="vd-playhead pointer-events-none absolute top-0 bottom-0 w-[2px]"
            style={{
              background: "var(--accent-deep)",
              boxShadow: "0 0 8px var(--accent-deep)",
            }}
          >
            {/* Playhead Grab Notch */}
            <div
              data-slab="signal"
              className="absolute -top-[2px] left-1/2 h-[10px] w-[10px] -translate-x-1/2 rounded-full border border-black"
              style={{ background: "var(--accent)" }}
            />
          </div>
        </div>
      </div>
    </div>

      {/* Bottom Stage Progress Steps Bar (replaces static RAW -> STORY) */}
      <div
        className="flex items-center justify-between border-t pt-[8px] mt-[2px]"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="hide-scroll flex min-w-0 flex-1 items-center gap-[4px] overflow-x-auto whitespace-nowrap max-[420px]:text-[7.5px]">
          {STAGES.map((st, i) => {
            const isCurrent = i === stageIndex;
            const isPassed = i < stageIndex;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => jumpToStage(i)}
                className="flex-none font-mono text-[8.5px] tracking-wider transition-colors max-[420px]:text-[7.5px]"
                style={{
                  color: isCurrent
                    ? "var(--accent-deep)"
                    : isPassed
                    ? "var(--fg)"
                    : "var(--faint)",
                  fontWeight: isCurrent ? 600 : 400,
                }}
              >
                {st.label}
                {i < STAGES.length - 1 && <span className="mx-[4px] text-[var(--line)]">→</span>}
              </button>
            );
          })}
        </div>
        <span className="mono text-[9px] text-[var(--accent-ink)] hidden sm:inline">
          {currentStage.desc}
        </span>
      </div>
    </div>
  );
}
