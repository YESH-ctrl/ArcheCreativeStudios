import { useState, useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/gsap";
import { announcePreviewDone, markPreviewPlayed } from "../lib/autoplay";

const SLUG = "pitch-decks-storytelling";

export interface PitchDeckDemoProps {
  active?: boolean;
  preview?: boolean;
}

interface SlideData {
  step: string;
  stage: string;
  kicker: string;
  title: string;
  subtitle: string;
  metricLabel: string;
  metricValue: string;
  diagramType: "problem" | "solution" | "opportunity" | "impact";
  takeaway: string;
}

const SLIDES: SlideData[] = [
  {
    step: "01",
    stage: "PROBLEM",
    kicker: "01 // COGNITIVE FRICTION",
    title: "Dense Decks Lose 68% of Investor Attention Within 30 Seconds",
    subtitle:
      "Unstructured bullet points, inconsistent charts, and weak storytelling obscure great ideas. Investors skim, get confused, and pass.",
    metricLabel: "Attention Drop",
    metricValue: "-68%",
    diagramType: "problem",
    takeaway: "Disconnected story leads to lost investor conviction.",
  },
  {
    step: "02",
    stage: "SOLUTION",
    kicker: "02 // NARRATIVE ARCHITECTURE",
    title: "Sequential Story Architecture Engineered to Build Conviction",
    subtitle:
      "We structure presentations around a clear narrative spine: Hook → Problem Urgency → Solution Proof → Unit Economics → The Ask.",
    metricLabel: "Story Clarity",
    metricValue: "99.4%",
    diagramType: "solution",
    takeaway: "Every slide earns the right to the next slide.",
  },
  {
    step: "03",
    stage: "MARKET",
    kicker: "03 // MARKET OPPORTUNITY",
    title: "$14.2B Addressable Market With Clear Expansion Horizons",
    subtitle:
      "Data-backed TAM, SAM, and SOM sizing visualized through bespoke diagrams, defensible unit economics, and verified market research.",
    metricLabel: "Total Market",
    metricValue: "$14.2B",
    diagramType: "opportunity",
    takeaway: "Clear defensibility and scalable growth vector.",
  },
  {
    step: "04",
    stage: "TRACTION",
    kicker: "04 // TRACTION & THE ASK",
    title: "+180% QoQ Traction With Clear Capital Allocation Model",
    subtitle:
      "Clean financial roadmap, locked pilot customers, and concrete fundraising milestones that inspire confidence and accelerate term sheets.",
    metricLabel: "QoQ Velocity",
    metricValue: "+180%",
    diagramType: "impact",
    takeaway: "High-momentum execution backed by real pipeline.",
  },
];

export function PitchDeckDemo({
  active = true,
  preview = false,
}: PitchDeckDemoProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const progressTimer = useRef<number | null>(null);

  const SLIDE_DURATION = 4600; // 4.6 seconds per slide
  const TICK = 40;

  const autoAnnounced = useRef(false);

  useEffect(() => {
    if (!active || preview) return;
    markPreviewPlayed(SLUG);

    if (prefersReducedMotion()) {
      announcePreviewDone(SLUG);
      return;
    }

    const timer = window.setTimeout(() => {
      if (!autoAnnounced.current) {
        autoAnnounced.current = true;
        announcePreviewDone(SLUG);
      }
    }, 6200);

    return () => window.clearTimeout(timer);
  }, [active, preview]);

  useEffect(() => {
    if (!active || preview || !isPlaying || prefersReducedMotion()) {
      if (progressTimer.current) window.clearInterval(progressTimer.current);
      return;
    }

    setProgress(0);
    const stepIncrement = (TICK / SLIDE_DURATION) * 100;

    progressTimer.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIdx((idx) => {
            const next = (idx + 1) % SLIDES.length;
            if (next === 0 && !autoAnnounced.current) {
              autoAnnounced.current = true;
              announcePreviewDone(SLUG);
            }
            return next;
          });
          return 0;
        }
        return prev + stepIncrement;
      });
    }, TICK);

    return () => {
      if (progressTimer.current) window.clearInterval(progressTimer.current);
    };
  }, [active, preview, isPlaying, currentIdx]);

  const slide = SLIDES[currentIdx];

  const handleSelectSlide = (idx: number) => {
    setCurrentIdx(idx);
    setProgress(0);
    setIsPlaying(false);
  };

  return (
    <div
      className="relative flex h-full w-full flex-col justify-between overflow-hidden p-[clamp(10px,1.4vw,18px)] text-[#f4f2ed] select-none"
      style={{
        background: "linear-gradient(180deg, #131418 0%, #0d0e11 100%)",
        minHeight: 360,
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* 1. TOP STUDIO CONTROLS HEADER                                      */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-wrap items-center justify-between gap-[8px] border-b border-[rgba(244,242,237,0.1)] pb-[10px]">
        {/* Studio Identifier */}
        <div className="flex items-center gap-[8px]">
          <span className="flex h-[8px] w-[8px] items-center justify-center">
            <span className="h-[6px] w-[6px] rounded-full bg-[var(--accent)] animate-pulse" />
          </span>
          <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-[var(--accent)] font-semibold">
            PRESENTATION STUDIO // SLIDE {slide.step} OF 04
          </span>
        </div>

        {/* Slide Stage Pills + Play/Pause */}
        <div className="flex items-center gap-[4px]">
          {SLIDES.map((s, idx) => (
            <button
              key={s.step}
              type="button"
              onClick={() => handleSelectSlide(idx)}
              className={`rounded-[3px] px-[7px] py-[3px] font-mono text-[9px] uppercase tracking-wider transition-all duration-200 ${
                currentIdx === idx
                  ? "bg-[var(--accent)] text-[#0c0c0d] font-bold shadow-[0_0_10px_rgba(200,241,79,0.3)]"
                  : "bg-[rgba(244,242,237,0.06)] text-[rgba(244,242,237,0.6)] hover:bg-[rgba(244,242,237,0.12)] hover:text-[#f4f2ed]"
              }`}
              data-cursor="SELECT"
              title={`Switch to slide ${s.step} (${s.stage})`}
            >
              {s.stage}
            </button>
          ))}

          {/* Play / Pause toggle */}
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "Pause auto presentation" : "Play auto presentation"}
            className="ml-[4px] flex h-[22px] w-[22px] items-center justify-center rounded-[3px] border border-[rgba(244,242,237,0.16)] bg-[rgba(244,242,237,0.04)] font-mono text-[9px] text-[rgba(244,242,237,0.7)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            data-cursor="CLICK"
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>
        </div>
      </div>

      {/* Progress Bar of current slide */}
      <div className="h-[2px] w-full bg-[rgba(244,242,237,0.08)] overflow-hidden my-[6px]">
        <div
          className="h-full bg-[var(--accent)] transition-all ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. MAIN SLIDE CANVAS DISPLAY                                       */}
      {/* ------------------------------------------------------------------ */}
      <div
        className="relative my-auto flex flex-col justify-between rounded-[6px] border border-[rgba(244,242,237,0.1)] p-[clamp(12px,1.6vw,20px)] shadow-inner"
        style={{
          background: "linear-gradient(135deg, rgba(22,23,28,0.95) 0%, rgba(14,15,18,0.98) 100%)",
          minHeight: 220,
        }}
      >
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 rounded-[6px]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(244,242,237,0.12) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />

        {/* Slide Top Metadata */}
        <div className="relative z-10 flex items-center justify-between mb-[8px]">
          <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-[rgba(244,242,237,0.5)]">
            ARCHE CREATIVE STUDIOS · EXECUTIVE DECK SYSTEM
          </span>
          <span className="rounded-full border border-[rgba(200,241,79,0.35)] bg-[rgba(200,241,79,0.08)] px-[8px] py-[2px] font-mono text-[8.5px] uppercase text-[var(--accent)] font-semibold">
            {slide.kicker}
          </span>
        </div>

        {/* Slide Body: Narrative Left + Dynamic Visual Diagram Right */}
        <div className="relative z-10 grid gap-[14px] md:grid-cols-12 items-center my-auto">
          {/* Narrative Content */}
          <div className="md:col-span-7 flex flex-col gap-[6px]">
            <h3
              key={slide.title}
              className="text-[clamp(15px,1.55vw,22px)] font-semibold leading-[1.2] tracking-[-0.03em] text-[#f4f2ed]"
            >
              {slide.title}
            </h3>
            <p className="text-[clamp(11px,0.95vw,13px)] text-[rgba(244,242,237,0.7)] leading-relaxed">
              {slide.subtitle}
            </p>
            <div className="mt-[4px] flex items-center gap-[6px]">
              <span className="text-[var(--accent)] font-mono text-[10px]">↳</span>
              <span className="font-mono text-[10px] text-[var(--accent-ink)] font-medium">
                {slide.takeaway}
              </span>
            </div>
          </div>

          {/* Bespoke Story Diagram */}
          <div className="md:col-span-5 rounded-[6px] border border-[rgba(244,242,237,0.12)] bg-[#090a0d] p-[12px] flex flex-col justify-between">
            {/* 01. Problem Diagram */}
            {slide.diagramType === "problem" && (
              <div className="flex flex-col gap-[8px]">
                <div className="flex items-center justify-between font-mono text-[8.5px]">
                  <span className="text-[rgba(244,242,237,0.5)]">NARRATIVE COHESION</span>
                  <span className="text-[#ff6b6b] font-bold">DISCONNECTED</span>
                </div>
                <div className="flex items-center justify-between gap-[3px] py-[4px]">
                  {["FRAGMENT", "NO ARC", "DENSE TEXT", "DROP-OFF"].map((label, i) => (
                    <div
                      key={label}
                      className="flex-1 rounded-[2px] border border-[#ff6b6b]/40 bg-[#ff6b6b]/10 py-[6px] text-center font-mono text-[7px] text-[rgba(244,242,237,0.85)] font-semibold"
                      style={{
                        transform: `translateY(${i % 2 === 0 ? -2 : 2}px)`,
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
                <div className="rounded-[3px] bg-[#ff6b6b]/10 px-[6px] py-[3px] font-mono text-[8px] text-[#ff8e8e] text-center">
                  Loss of story flow → 68% drop in retention
                </div>
              </div>
            )}

            {/* 02. Solution Diagram */}
            {slide.diagramType === "solution" && (
              <div className="flex flex-col gap-[8px]">
                <div className="flex items-center justify-between font-mono text-[8.5px]">
                  <span className="text-[rgba(244,242,237,0.5)]">4-PHASE NARRATIVE FLOW</span>
                  <span className="text-[var(--accent)] font-bold">SYNCHRONIZED</span>
                </div>
                <div className="relative flex items-center justify-between gap-[3px] py-[4px]">
                  <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-[var(--accent)] -translate-y-1/2 opacity-70" />
                  {["HOOK", "PROOF", "MOAT", "THE ASK"].map((label) => (
                    <div
                      key={label}
                      className="relative z-10 flex-1 rounded-[2px] border border-[var(--accent)] bg-[#0c0d10] py-[6px] text-center font-mono text-[7px] font-bold text-[var(--accent)] shadow-[0_0_8px_rgba(200,241,79,0.2)]"
                    >
                      {label}
                    </div>
                  ))}
                </div>
                <div className="rounded-[3px] bg-[var(--accent)]/10 px-[6px] py-[3px] font-mono text-[8px] text-[var(--accent-ink)] text-center font-medium">
                  Sequential conviction with zero cognitive drag
                </div>
              </div>
            )}

            {/* 03. Opportunity Diagram */}
            {slide.diagramType === "opportunity" && (
              <div className="flex flex-col gap-[6px]">
                <div className="flex items-center justify-between font-mono text-[8.5px]">
                  <span className="text-[rgba(244,242,237,0.5)]">MARKET CONCENTRIC SIZING</span>
                  <span className="text-[var(--accent)] font-bold">$14.2B TAM</span>
                </div>
                <div className="flex items-end justify-between gap-[5px] h-[48px] pt-[4px]">
                  <div className="flex-1 bg-[rgba(244,242,237,0.12)] h-[28%] rounded-t-[2px] flex items-center justify-center font-mono text-[7px] text-[rgba(244,242,237,0.6)]">
                    $850M
                  </div>
                  <div className="flex-1 bg-[rgba(244,242,237,0.28)] h-[55%] rounded-t-[2px] flex items-center justify-center font-mono text-[7px] text-[rgba(244,242,237,0.85)]">
                    $4.8B
                  </div>
                  <div className="flex-1 bg-[var(--accent)] h-[95%] rounded-t-[2px] shadow-[0_0_12px_rgba(200,241,79,0.35)] flex items-center justify-center font-mono text-[7px] font-bold text-[#0c0c0d]">
                    $14.2B
                  </div>
                </div>
                <div className="flex justify-between font-mono text-[7.5px] text-[rgba(244,242,237,0.5)]">
                  <span>SOM (Obtainable)</span>
                  <span>SAM (Serviceable)</span>
                  <span className="text-[var(--accent)] font-bold">TAM (Total)</span>
                </div>
              </div>
            )}

            {/* 04. Impact Diagram */}
            {slide.diagramType === "impact" && (
              <div className="flex flex-col gap-[6px]">
                <div className="flex items-center justify-between font-mono text-[8.5px]">
                  <span className="text-[rgba(244,242,237,0.5)]">COMPOUNDING TRACTION</span>
                  <span className="text-[var(--accent)] font-bold">+180% QoQ</span>
                </div>
                <svg className="w-full h-[46px] overflow-visible" viewBox="0 0 160 46">
                  <defs>
                    <linearGradient id="pitchGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c8f14f" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#c8f14f" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 0,42 Q 45,40 85,24 T 160,4 L 160,46 L 0,46 Z"
                    fill="url(#pitchGrad)"
                  />
                  <path
                    d="M 0,42 Q 45,40 85,24 T 160,4"
                    fill="none"
                    stroke="var(--accent)"
                    strokeWidth="2.5"
                  />
                  <circle cx="160" cy="4" r="3.5" fill="var(--accent)" />
                  <circle cx="85" cy="24" r="2.5" fill="#f4f2ed" />
                </svg>
                <div className="flex justify-between font-mono text-[7.5px] text-[rgba(244,242,237,0.5)]">
                  <span>SEED ROUND</span>
                  <span>SERIES A</span>
                  <span className="text-[var(--accent)] font-bold">SCALE & ARR</span>
                </div>
              </div>
            )}

            {/* Bottom Key Metric Strip */}
            <div className="mt-[6px] flex items-center justify-between border-t border-[rgba(244,242,237,0.1)] pt-[5px]">
              <span className="font-mono text-[8px] text-[rgba(244,242,237,0.5)] uppercase">
                {slide.metricLabel}
              </span>
              <span className="font-mono text-[11px] font-bold text-[var(--accent)]">
                {slide.metricValue}
              </span>
            </div>
          </div>
        </div>

        {/* Slide Canvas Footer */}
        <div className="relative z-10 flex items-center justify-between border-t border-[rgba(244,242,237,0.08)] pt-[6px] font-mono text-[8px] text-[rgba(244,242,237,0.4)] mt-[6px]">
          <span>CONFIDENTIAL INVESTOR MEMO // ARCHE STUDIOS</span>
          <span>FORMAT: EDITABLE PPTX + VECTOR PDF</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 3. BOTTOM SLIDE FILMSTRIP THUMBNAILS                               */}
      {/* ------------------------------------------------------------------ */}
      <div className="mt-[10px] flex items-center gap-[8px] overflow-x-auto pt-[4px]">
        {SLIDES.map((s, idx) => (
          <button
            key={s.step}
            type="button"
            onClick={() => handleSelectSlide(idx)}
            className={`group flex-1 min-w-[70px] rounded-[4px] border p-[6px] text-left transition-all duration-200 ${
              currentIdx === idx
                ? "border-[var(--accent)] bg-[rgba(200,241,79,0.08)] shadow-[0_0_8px_rgba(200,241,79,0.2)]"
                : "border-[rgba(244,242,237,0.1)] bg-[rgba(244,242,237,0.03)] hover:border-[rgba(244,242,237,0.3)] hover:bg-[rgba(244,242,237,0.06)]"
            }`}
            data-cursor="SELECT"
          >
            <div className="flex items-center justify-between mb-[2px]">
              <span
                className={`font-mono text-[8px] font-bold ${
                  currentIdx === idx ? "text-[var(--accent)]" : "text-[rgba(244,242,237,0.5)]"
                }`}
              >
                SLIDE {s.step}
              </span>
              <span
                className={`h-[3px] w-[3px] rounded-full ${
                  currentIdx === idx ? "bg-[var(--accent)]" : "bg-[rgba(244,242,237,0.3)]"
                }`}
              />
            </div>
            <span
              className={`block truncate font-mono text-[8.5px] uppercase ${
                currentIdx === idx ? "text-[#f4f2ed] font-semibold" : "text-[rgba(244,242,237,0.6)]"
              }`}
            >
              {s.stage}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
