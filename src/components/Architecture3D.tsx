import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/gsap";
import { getLenis } from "../lib/useLenis";
import { StageGlyph } from "./StageGlyph";

/**
 * THE ARCHE SYSTEM MODEL — 5-Stage Spatial Engine Architecture.
 *
 * Reimagined as an interactive high-tech architecture workbench:
 * - 01 INPUT: Multi-Modal Signal Ingestion (Audio, 4K Raw, Webhooks, Prompts)
 * - 02 INTELLIGENCE: Cognitive & Context Engine (Neural intent, embeddings, semantic reasoning)
 * - 03 SYSTEM: Kernel Orchestration & State Machine (Event bus, agent threads, failsafe buffers)
 * - 04 ACTION: Autonomous Execution Mesh (Compilers, render pipelines, tool dispatch)
 * - 05 OUTPUT: Deterministic Master Deliverable (100% verified production release)
 *
 * Includes:
 * - Interactive node selector with real-time circuit traces & pulse rings
 * - Visual simulation bay with distinct interactive interfaces per stage
 * - Real-time live telemetry console with streaming system logs
 * - "Simulate Packet Flow" interactive trigger
 * - Full-pipeline convergence view locking all 5 engines into one synchronized machine
 */

export interface SystemStageData {
  id: "input" | "intelligence" | "system" | "action" | "output";
  num: string;
  title: string;
  subtitle: string;
  tagline: string;
  desc: string;
  metrics: { label: string; value: string; unit?: string }[];
  specs: { k: string; v: string }[];
  logs: string[];
}

export const SYSTEM_STAGES: SystemStageData[] = [
  {
    id: "input",
    num: "01",
    title: "INPUT",
    subtitle: "Raw Signal Ingestion",
    tagline: "MULTI-MODAL RAW INGESTION ENGINE",
    desc: "Ingests raw, unstructured creative and technical inputs — 8K camera logs, audio cadence, investor financials, and webhook events with zero signal loss.",
    metrics: [
      { label: "Ingest Bandwidth", value: "2.4", unit: "GB/s" },
      { label: "Signal Fidelity", value: "99.98", unit: "%" },
      { label: "Drop Rate", value: "0.00", unit: "%" },
      { label: "Protocols", value: "gRPC · S3 · Webhook", unit: "" },
    ],
    specs: [
      { k: "Media Stream", v: "8K DCI ProRes RAW · 24fps" },
      { k: "Audio Stream", v: "48kHz 24-bit LPCM Dual-Track" },
      { k: "Event Stream", v: "HTTP/2 Webhooks & API Payloads" },
      { k: "Buffer Latency", v: "1.2ms Circular Memory Ring" },
    ],
    logs: [
      "[00:00.04] RAW_STREAM_DETECTED: 4K_LOG3G10_FEED",
      "[00:00.12] INGEST_BUFFER: 64MB CIRCULAR RING ALLOCATED",
      "[00:00.28] SIGNAL_VALIDATED: CHECKSUM 0x9F4C MATCHED",
      "[00:00.35] INGEST_COMPLETE: HANDOFF TO INTELLIGENCE",
    ],
  },
  {
    id: "intelligence",
    num: "02",
    title: "INTELLIGENCE",
    subtitle: "Context & Reasoning",
    tagline: "COGNITIVE CONTEXT & SEMANTIC RESOLUTION",
    desc: "Extracts narrative intent, semantic vectors, and creative pacing. Multi-agent models synthesize raw information into an actionable production blueprint.",
    metrics: [
      { label: "Context Window", value: "128", unit: "K Tokens" },
      { label: "Inference Latency", value: "240", unit: "ms" },
      { label: "Intent Confidence", value: "99.4", unit: "%" },
      { label: "Model Architecture", value: "Multi-Agent Ensemble", unit: "" },
    ],
    specs: [
      { k: "Embedding Core", v: "Cosine Sim 1536-Dimensional" },
      { k: "Narrative Arc", v: "Hook → Proof → Moat → The Ask" },
      { k: "Retention Model", v: "Dynamic Drop-off Prediction" },
      { k: "Agent Quorum", v: "Tri-Model Consensus Verification" },
    ],
    logs: [
      "[00:00.42] CONTEXT_GRAPH_INIT: 128K TOKEN WINDOW",
      "[00:00.68] INTENT_RESOLVED: EXECUTIVE_STORY_DECK",
      "[00:00.82] RETENTION_SCORE: 98.6% CONFIDENCE ON TAKE_03",
      "[00:00.95] REASONING_LOCKED: DISPATCHING TO STATE KERNEL",
    ],
  },
  {
    id: "system",
    num: "03",
    title: "SYSTEM",
    subtitle: "Kernel & Orchestration",
    tagline: "DISTRIBUTED STATE KERNEL & ORCHESTRATION BUS",
    desc: "The central operating kernel: coordinates multiple specialized agents, manages state logic, enforces strict rollback boundaries, and guarantees zero-downtime execution.",
    metrics: [
      { label: "Event Loop", value: "0.8", unit: "ms" },
      { label: "Agent Threads", value: "16", unit: "Parallel" },
      { label: "Failsafe Redundancy", value: "3", unit: "Layers" },
      { label: "Concurrency", value: "Lock-Free Ring Buffer", unit: "" },
    ],
    specs: [
      { k: "State Machine", v: "Deterministic Hierarchical FSM" },
      { k: "Memory Store", v: "In-Memory Snapshot with WAL" },
      { k: "Agent Dispatch", v: "Video · Web · AI Automation Mesh" },
      { k: "Fallback Engine", v: "Zero-Latency Graceful Rollback" },
    ],
    logs: [
      "[00:01.05] KERNEL_CYCLE: 0.8ms PULSE SYNCHRONIZED",
      "[00:01.18] AGENT_THREAD_01 [VIDEO]: TIMELINE CONSTRUCTED",
      "[00:01.29] AGENT_THREAD_02 [WEB]: DOM COMPILER INITIATED",
      "[00:01.44] AGENT_THREAD_03 [WORKFLOW]: CRM SYNC READY",
    ],
  },
  {
    id: "action",
    num: "04",
    title: "ACTION",
    subtitle: "Execution Mesh",
    tagline: "AUTONOMOUS EXECUTION MESH & TOOL DISPATCH",
    desc: "Triggers the mechanical production: Vite bundles compile, DaVinci Resolve color passes grade, slides render with vector precision, and webhooks dispatch seamlessly.",
    metrics: [
      { label: "Execution Speed", value: "450", unit: "Ops/sec" },
      { label: "Compilation Time", value: "32", unit: "ms" },
      { label: "Tool Handshake", value: "12", unit: "ms" },
      { label: "Pipeline Status", value: "All Systems Active", unit: "" },
    ],
    specs: [
      { k: "Render Engine", v: "GPU Metal / CUDA Color Transform" },
      { k: "Code Bundler", v: "Zero-Config ESM Single-File Engine" },
      { k: "API Mesh", v: "Hubspot · Slack · Postgres Connectors" },
      { k: "Task Concurrency", v: "Parallel Asynchronous Execution" },
    ],
    logs: [
      "[00:01.58] DISPATCH_EXEC: RENDER PASS INITIATED",
      "[00:01.72] BUILD_OPTIMIZE: ZERO RUNTIME OVERHEAD",
      "[00:01.88] API_TRANSACTION: 200 OK VIA AIRGAP TUNNEL",
      "[00:02.04] ARTIFACT_GENERATED: DISPATCHED TO OUTPUT",
    ],
  },
  {
    id: "output",
    num: "05",
    title: "OUTPUT",
    subtitle: "Verified Deliverable",
    tagline: "DETERMINISTIC VERIFIED PRODUCTION DELIVERABLES",
    desc: "Every asset passes strict quality verification gates before release — high-bitrate master film, investor decks that close rounds, responsive web apps, and autonomous agents.",
    metrics: [
      { label: "Quality Audit", value: "100", unit: "% Passed" },
      { label: "Master Bitrate", value: "45", unit: "Mbps" },
      { label: "Frame Rate", value: "60.0", unit: "FPS Live" },
      { label: "Release Integrity", value: "Arche Studio Verified", unit: "" },
    ],
    specs: [
      { k: "Film Master", v: "4K DCI ProRes 422 HQ Rec.709/P3" },
      { k: "Pitch Deck", v: "Keynote / PDF Vector Master" },
      { k: "Web Application", v: "Production Lighthouse 100/100" },
      { k: "AI Automation", v: "Autonomous Production Lead Engine" },
    ],
    logs: [
      "[00:02.18] QUALITY_GATE: 24/24 VERIFICATION CHECKS PASSED",
      "[00:02.32] MASTER_CHECKSUM: 0xEE4B VERIFIED CLEAN",
      "[00:02.48] DELIVERABLE_SEALED: MASTER ASSETS READY",
      "[00:02.60] SYSTEM_STATUS: PRODUCTION COMPLETE · 100%",
    ],
  },
];

export function Architecture3D() {
  const pinRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [converged, setConverged] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simPacketProgress, setSimPacketProgress] = useState(-1);
  const [autoCycle, setAutoCycle] = useState(true);

  const stage = SYSTEM_STAGES[activeIdx];

  /* ------------------------------------------------------------------ */
  /* ScrollTrigger Pinning on Desktop                                    */
  /* ------------------------------------------------------------------ */
  useLayoutEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    if (prefersReducedMotion() || typeof window === "undefined" || window.innerWidth < 900) {
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        id: "arche-system-model-pinned",
        trigger: pin,
        start: "top top",
        end: "+=320%",
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          if (p >= 0.88) {
            setConverged(true);
          } else {
            setConverged(false);
            const idx = Math.min(4, Math.floor(p / 0.176));
            setActiveIdx(idx);
          }
        },
      });
    }, pin);

    return () => ctx.revert();
  }, []);

  /* ------------------------------------------------------------------ */
  /* Auto-Cycle Timer when Idle and Not Pinned                          */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    if (!autoCycle || isSimulating || prefersReducedMotion()) return;
    const interval = window.setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SYSTEM_STAGES.length);
    }, 4800);
    return () => window.clearInterval(interval);
  }, [autoCycle, isSimulating]);

  /* ------------------------------------------------------------------ */
  /* Interactive Signal Packet Simulation                                */
  /* ------------------------------------------------------------------ */
  const fireSimulatePacket = () => {
    if (isSimulating) return;
    setAutoCycle(false);
    setIsSimulating(true);
    setConverged(false);
    setSimPacketProgress(0);

    let currentStep = 0;
    setActiveIdx(0);

    const stepInterval = window.setInterval(() => {
      currentStep += 1;
      if (currentStep <= 4) {
        setActiveIdx(currentStep);
        setSimPacketProgress((currentStep / 4) * 100);
      } else if (currentStep === 5) {
        setConverged(true);
        setSimPacketProgress(100);
      } else {
        window.clearInterval(stepInterval);
        setIsSimulating(false);
        setSimPacketProgress(-1);
      }
    }, 850);
  };

  const handleSelectStage = (idx: number) => {
    setAutoCycle(false);
    setConverged(false);
    setActiveIdx(idx);

    // If pinned on desktop, smooth scroll to corresponding scroll progress
    const st = ScrollTrigger.getById("arche-system-model-pinned");
    if (st) {
      const targetY = st.start + (idx / 4.5) * (st.end - st.start);
      const lenis = getLenis();
      if (lenis) lenis.scrollTo(targetY, { duration: 0.9 });
      else window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  const handleToggleConvergence = () => {
    setAutoCycle(false);
    setConverged((prev) => !prev);
  };

  return (
    <section
      ref={pinRef}
      id="system-architecture"
      className="on-ink relative w-full overflow-hidden border-t border-b text-[#f4f2ed] select-none"
      style={{
        borderColor: "rgba(244, 242, 237, 0.12)",
        background: "radial-gradient(ellipse 90% 60% at 50% 20%, #15161b 0%, #0a0b0d 100%)",
        minHeight: "100svh",
      }}
    >
      {/* Background Architectural Blueprint Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(200, 241, 79, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(200, 241, 79, 0.4) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
        aria-hidden
      />

      {/* Subtle Central Glow Vignette */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: "radial-gradient(circle at 50% 40%, rgba(200, 241, 79, 0.08) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      <div className="wrap relative z-10 flex h-full flex-col justify-between py-[clamp(40px,5vh,70px)]">
        {/* ============================================================== */}
        {/* 1. TOP HEADER & TELEMETRY CONTROLS                             */}
        {/* ============================================================== */}
        <header className="flex flex-col gap-[14px]">
          <div className="flex flex-wrap items-center justify-between gap-[10px]">
            <div className="flex items-center gap-[8px]">
              <span className="flex h-[8px] w-[8px] items-center justify-center">
                <span className="h-[6px] w-[6px] rounded-full bg-[var(--accent)] animate-pulse" />
              </span>
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--accent)] font-semibold">
                04 // SPATIAL ARCHITECTURE · THE SYSTEM ENGINE
              </span>
            </div>

            <div className="flex items-center gap-[6px]">
              <span className="rounded-full border border-white/10 bg-black/40 px-[10px] py-[3px] font-mono text-[9px] text-white/70">
                STATUS: <span className="text-[var(--accent)] font-semibold">OPERATIONAL 60 FPS</span>
              </span>
              <button
                type="button"
                onClick={fireSimulatePacket}
                disabled={isSimulating}
                className="flex items-center gap-[6px] rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-[12px] py-[3px] font-mono text-[9px] font-bold text-[var(--accent)] transition-all duration-200 hover:bg-[var(--accent)] hover:text-[#0c0c0d] shadow-[0_0_12px_rgba(200,241,79,0.2)] disabled:opacity-50"
                data-cursor="CLICK"
              >
                <span>⚡</span>
                <span>{isSimulating ? "SIGNAL TRANSMITTING..." : "FIRE TEST PACKET"}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-x-[30px] gap-y-[10px]">
            <div>
              <h2
                className="d1 text-white tracking-[-0.03em] font-semibold"
                style={{ fontSize: "clamp(28px, 4.2vw, 56px)", lineHeight: 1 }}
              >
                SYSTEM MODEL
              </h2>
              <p className="mt-[8px] font-mono text-[11px] text-[var(--muted)] max-w-[56ch] tracking-wide">
                A 5-stage continuous production pipeline. Raw chaos enters — clean, high-conviction deliverables emerge.
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleConvergence}
              className={`rounded-[4px] border px-[12px] py-[6px] font-mono text-[10px] uppercase tracking-wider transition-all duration-200 ${
                converged
                  ? "border-[var(--accent)] bg-[var(--accent)] text-[#0c0c0d] font-bold shadow-[0_0_16px_rgba(200,241,79,0.4)]"
                  : "border-white/15 bg-black/40 text-white/80 hover:border-white/30"
              }`}
              data-cursor="TOGGLE"
            >
              {converged ? "● UNIFIED CONVERGENCE" : "CONVERGE FULL SYSTEM →"}
            </button>
          </div>
        </header>

        {/* ============================================================== */}
        {/* 2. THE 5-STAGE PIPELINE NAVIGATION RIBBON                      */}
        {/* ============================================================== */}
        <div className="my-[clamp(16px,2.4vh,28px)]">
          <div
            role="tablist"
            aria-label="System Stages"
            className="relative flex items-center justify-between rounded-[8px] border border-white/10 bg-[#101115]/90 p-[6px] backdrop-blur-md overflow-x-auto hide-scroll"
          >
            {/* Live Signal Packet on Simulated Run */}
            {simPacketProgress >= 0 && (
              <div
                className="pointer-events-none absolute top-1/2 -translate-y-1/2 h-[6px] w-[6px] rounded-full bg-[var(--accent)] shadow-[0_0_14px_rgba(200,241,79,1)] transition-all duration-700 z-30"
                style={{ left: `calc(${simPacketProgress}% - 3px)` }}
              />
            )}

            {SYSTEM_STAGES.map((s, idx) => {
              const isActive = activeIdx === idx && !converged;
              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleSelectStage(idx)}
                  className={`group relative flex flex-1 min-w-[120px] items-center justify-between gap-[8px] rounded-[5px] px-[12px] py-[8px] transition-all duration-200 ${
                    isActive
                      ? "border border-[var(--accent)]/50 bg-[#1b1d24] text-white shadow-[0_0_14px_rgba(200,241,79,0.18)]"
                      : "border border-transparent hover:bg-white/5 text-white/60 hover:text-white"
                  }`}
                  data-cursor="SELECT"
                >
                  <div className="flex items-center gap-[8px]">
                    <span
                      className={`font-mono text-[10px] font-bold ${
                        isActive ? "text-[var(--accent)]" : "text-white/40"
                      }`}
                    >
                      {s.num}
                    </span>
                    <div className="text-left">
                      <span className="block font-mono text-[10.5px] font-semibold tracking-wider uppercase">
                        {s.title}
                      </span>
                      <span className="hidden sm:block text-[8.5px] font-mono text-[var(--muted)]">
                        {s.subtitle}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`h-[6px] w-[6px] rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-[var(--accent)] shadow-[0_0_8px_rgba(200,241,79,0.8)]"
                        : "bg-white/20 group-hover:bg-white/40"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* 3. CENTRAL HOLOGRAPHIC STAGE & TELEMETRY BAY                   */}
        {/* ============================================================== */}
        <div
          className="relative flex-1 overflow-hidden rounded-[8px] border border-white/10 bg-[#0d0e12]/95 backdrop-blur-md shadow-2xl"
          style={{ minHeight: 380 }}
        >
          {converged ? (
            /* ---------------------------------------------------------- */
            /* VIEW A: UNIFIED SYSTEM CONVERGENCE REACTOR                 */
            /* ---------------------------------------------------------- */
            <div className="flex h-full w-full flex-col items-center justify-center p-[20px] text-center">
              <div className="relative mb-[16px] flex items-center justify-center">
                <div className="h-[140px] w-[140px] rounded-full border border-dashed border-[var(--accent)]/40 animate-spin" style={{ animationDuration: "24s" }} />
                <div className="absolute h-[110px] w-[110px] rounded-full border border-[var(--accent)]/30" />
                <div className="absolute h-[70px] w-[70px] rounded-full bg-[var(--accent)]/10 flex items-center justify-center shadow-[0_0_30px_rgba(200,241,79,0.3)]">
                  <span className="font-mono text-[18px] font-bold text-[var(--accent)]">
                    ARCHE
                  </span>
                </div>
              </div>

              <div className="inline-flex items-center gap-[6px] rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-[12px] py-[4px] mb-[10px]">
                <span className="h-[6px] w-[6px] rounded-full bg-[var(--accent)] animate-ping" />
                <span className="font-mono text-[10px] font-bold text-[var(--accent)] tracking-widest uppercase">
                  SYSTEM CONVERGED · 5 ENGINES SYNCHRONIZED
                </span>
              </div>

              <h3 className="text-[clamp(18px,2.2vw,28px)] font-semibold text-white tracking-tight">
                INPUT → INTELLIGENCE → SYSTEM → ACTION → OUTPUT
              </h3>
              <p className="mt-[8px] font-mono text-[11px] text-[var(--muted)] max-w-[54ch]">
                The entire architecture functions as one continuous loop. Signal feeds intelligence, kernel delegates action, and output feeds verified quality back into the cycle.
              </p>

              {/* 5-Step Unified Chain */}
              <div className="mt-[20px] flex flex-wrap items-center justify-center gap-[8px]">
                {SYSTEM_STAGES.map((s, i) => (
                  <div
                    key={s.id}
                    onClick={() => handleSelectStage(i)}
                    className="flex items-center gap-[6px] cursor-pointer rounded border border-white/10 bg-black/40 px-[10px] py-[6px] transition-all hover:border-[var(--accent)]"
                    data-cursor="INSPECT"
                  >
                    <span className="font-mono text-[9px] text-[var(--accent)] font-bold">{s.num}</span>
                    <span className="font-mono text-[10px] text-white font-medium uppercase">{s.title}</span>
                    {i < SYSTEM_STAGES.length - 1 && (
                      <span className="font-mono text-[9px] text-white/30 ml-[4px]">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ---------------------------------------------------------- */
            /* VIEW B: ACTIVE STAGE WORKBENCH (SIMULATOR + TELEMETRY)     */
            /* ---------------------------------------------------------- */
            <div className="grid h-full w-full grid-cols-1 lg:grid-cols-[1.25fr_1fr]">
              {/* Left Column: Visual Simulator Canvas */}
              <div className="relative flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 p-[clamp(16px,2vw,24px)]">
                {/* Visualizer Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[8px]">
                    <span className="font-mono text-[10px] font-bold text-[var(--accent)]">
                      STAGE {stage.num}
                    </span>
                    <span className="font-mono text-[9px] text-white/40">·</span>
                    <span className="font-mono text-[10px] text-white/80 uppercase tracking-wider font-semibold">
                      {stage.tagline}
                    </span>
                  </div>
                  <div className="flex items-center gap-[6px]">
                    <span className="h-[6px] w-[6px] rounded-full bg-[var(--accent)]" />
                    <span className="font-mono text-[8.5px] text-white/60 uppercase">ACTIVE SIMULATION</span>
                  </div>
                </div>

                {/* Central Bespoke Animated Visual */}
                <div className="my-auto py-[16px]">
                  {stage.id === "input" && <InputVisualizer />}
                  {stage.id === "intelligence" && <IntelligenceVisualizer />}
                  {stage.id === "system" && <SystemKernelVisualizer />}
                  {stage.id === "action" && <ActionVisualizer />}
                  {stage.id === "output" && <OutputVisualizer />}
                </div>

                {/* Visualizer Footer Summary */}
                <div className="flex flex-wrap items-center justify-between gap-[8px] border-t border-white/10 pt-[12px] text-[9.5px] font-mono text-[var(--muted)]">
                  <span>ROLE: {stage.subtitle}</span>
                  <span className="text-[var(--accent)]">DETERMINISTIC LATENCY GUARANTEED</span>
                </div>
              </div>

              {/* Right Column: Telemetry & Architectural Specifications */}
              <div className="flex flex-col justify-between p-[clamp(16px,2vw,24px)] bg-[#090a0d]/70">
                <div className="flex flex-col gap-[14px]">
                  {/* Live Metrics Grid */}
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-widest text-white/40 mb-[8px]">
                      STAGE TELEMETRY & HARDWARE GAUGES
                    </span>
                    <div className="grid grid-cols-2 gap-[8px]">
                      {stage.metrics.map((m) => (
                        <div
                          key={m.label}
                          className="rounded-[4px] border border-white/10 bg-black/40 p-[8px]"
                        >
                          <span className="block font-mono text-[8.5px] text-[var(--muted)] truncate">
                            {m.label}
                          </span>
                          <div className="mt-[2px] flex items-baseline gap-[3px]">
                            <span className="font-mono text-[13px] font-bold text-white tracking-tight">
                              {m.value}
                            </span>
                            {m.unit && (
                              <span className="font-mono text-[9px] text-[var(--accent)] font-semibold">
                                {m.unit}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Architecture Specifications */}
                  <div>
                    <span className="block font-mono text-[9px] uppercase tracking-widest text-white/40 mb-[6px]">
                      PIPELINE SPECIFICATIONS
                    </span>
                    <div className="flex flex-col gap-[4px] rounded-[4px] border border-white/10 bg-black/30 p-[8px]">
                      {stage.specs.map((s) => (
                        <div key={s.k} className="flex items-center justify-between text-[9px] font-mono">
                          <span className="text-[var(--muted)]">{s.k}</span>
                          <span className="text-white/90 font-medium truncate max-w-[200px]">{s.v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Live Console Event Stream */}
                  <div>
                    <div className="flex items-center justify-between mb-[4px]">
                      <span className="font-mono text-[8.5px] uppercase tracking-widest text-white/40">
                        EVENT BUS CONSOLE
                      </span>
                      <span className="font-mono text-[8px] text-[var(--accent)] animate-pulse">● LIVE STREAM</span>
                    </div>
                    <div className="flex flex-col gap-[3px] rounded-[4px] border border-white/10 bg-[#050507] p-[8px] font-mono text-[8.5px] text-[#a1a1aa] overflow-hidden max-h-[88px]">
                      {stage.logs.map((log, i) => (
                        <div key={i} className="truncate">
                          <span className="text-[var(--accent)]/80">{log.slice(0, 10)}</span>{" "}
                          <span>{log.slice(10)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-[10px] text-right font-mono text-[8.5px] text-white/40">
                  SYSTEM ENGINE v3.4 // ARCHITECTURE 3D
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* 4. BOTTOM FOOTER CONTROLS                                      */}
        {/* ============================================================== */}
        <footer className="mt-[clamp(14px,2vh,20px)] flex flex-wrap items-center justify-between gap-[12px] pt-[12px] border-t border-white/10">
          <div className="flex items-center gap-[6px]">
            {SYSTEM_STAGES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectStage(idx)}
                className={`flex h-[24px] w-[24px] items-center justify-center rounded-full font-mono text-[9.5px] font-bold transition-all ${
                  activeIdx === idx && !converged
                    ? "bg-[var(--accent)] text-[#0c0c0d] shadow-[0_0_10px_rgba(200,241,79,0.5)]"
                    : "border border-white/20 bg-transparent text-white/60 hover:text-white hover:border-white/40"
                }`}
                data-cursor="CLICK"
              >
                {s.num}
              </button>
            ))}
          </div>

          <div className="font-mono text-[10px] text-[var(--muted)]">
            {converged ? (
              <span className="text-[var(--accent)]">● Unified convergence mode: all 5 stages active</span>
            ) : (
              <span>STAGE {stage.num}/05 · {stage.title}: {stage.desc.slice(0, 72)}…</span>
            )}
          </div>
        </footer>
      </div>
    </section>
  );
}

/* ====================================================================== */
/* BESPOKE INTERACTIVE VISUALIZERS FOR EACH STAGE                         */
/* ====================================================================== */

/** 01 INPUT: Waveform Frequency, Raw Video Frame, and Webhook Payloads */
function InputVisualizer() {
  return (
    <div className="flex flex-col gap-[12px]">
      <div className="grid grid-cols-2 gap-[8px]">
        {/* Raw Video Camera Frame */}
        <div className="rounded-[4px] border border-white/10 bg-black/50 p-[10px]">
          <div className="flex items-center justify-between text-[8px] font-mono text-white/60 mb-[6px]">
            <span className="text-red-400 font-bold">● REC RAW</span>
            <span>4K PRORES</span>
          </div>
          <div className="flex items-center justify-center h-[54px] rounded border border-dashed border-white/10 bg-white/5">
            <span className="font-mono text-[9px] text-[var(--accent)] font-semibold">
              FRAME 004128 · 24 FPS
            </span>
          </div>
        </div>

        {/* Audio Waveform Spectrum */}
        <div className="rounded-[4px] border border-white/10 bg-black/50 p-[10px]">
          <div className="flex items-center justify-between text-[8px] font-mono text-white/60 mb-[6px]">
            <span>AUDIO SPECTRUM</span>
            <span className="text-[var(--accent)]">48kHz LPCM</span>
          </div>
          <div className="flex items-end justify-between h-[54px] px-[4px] gap-[3px]">
            {[35, 60, 85, 45, 95, 70, 50, 80, 65, 90, 40, 75].map((h, i) => (
              <span
                key={i}
                className="w-full rounded-t-[1px] bg-[var(--accent)] transition-all duration-300"
                style={{
                  height: `${h}%`,
                  opacity: i % 2 === 0 ? 0.9 : 0.6,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded border border-white/10 bg-black/40 px-[10px] py-[6px] font-mono text-[9px]">
        <span className="text-white/60">INGRESS PAYLOAD:</span>
        <span className="text-[var(--accent)]">JSON WEBHOOK · CHECKSUM VERIFIED 0x9F4C</span>
      </div>
    </div>
  );
}

/** 02 INTELLIGENCE: Neural Network Graph & Vector Radar */
function IntelligenceVisualizer() {
  return (
    <div className="flex flex-col items-center justify-center gap-[12px]">
      <div className="relative flex items-center justify-center h-[110px] w-full max-w-[320px]">
        {/* Orbital Context Rings */}
        <div className="absolute h-[100px] w-[100px] rounded-full border border-dashed border-[var(--accent)]/30 animate-spin" style={{ animationDuration: "20s" }} />
        <div className="absolute h-[70px] w-[70px] rounded-full border border-white/15" />

        {/* Central Cognitive Core */}
        <div className="relative z-10 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[var(--accent)]/15 border border-[var(--accent)] shadow-[0_0_16px_rgba(200,241,79,0.4)]">
          <span className="font-mono text-[10px] font-bold text-[var(--accent)]">AI</span>
        </div>

        {/* Satellite Reasoning Nodes */}
        <div className="absolute top-[8px] left-[30px] rounded-full border border-white/20 bg-black/60 px-[6px] py-[2px] font-mono text-[7.5px] text-white">
          SEMANTIC
        </div>
        <div className="absolute top-[8px] right-[30px] rounded-full border border-white/20 bg-black/60 px-[6px] py-[2px] font-mono text-[7.5px] text-white">
          INTENT
        </div>
        <div className="absolute bottom-[8px] left-[35px] rounded-full border border-white/20 bg-black/60 px-[6px] py-[2px] font-mono text-[7.5px] text-white">
          CADENCE
        </div>
        <div className="absolute bottom-[8px] right-[35px] rounded-full border border-white/20 bg-black/60 px-[6px] py-[2px] font-mono text-[7.5px] text-white">
          NARRATIVE
        </div>
      </div>

      <div className="w-full flex items-center justify-between rounded border border-white/10 bg-black/40 px-[10px] py-[6px] font-mono text-[9px]">
        <span className="text-white/60">REASONING LATENCY:</span>
        <span className="text-[var(--accent)]">240ms · 99.4% CONFIDENCE MATRIX</span>
      </div>
    </div>
  );
}

/** 03 SYSTEM: State Octagon Kernel & Multi-Agent Dispatch */
function SystemKernelVisualizer() {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="grid grid-cols-2 gap-[8px]">
        {/* State Machine Octagon */}
        <div className="flex flex-col items-center justify-center h-[96px] rounded border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-[8px]">
          <span className="stage-glyph block w-[56px] text-[var(--accent)]">
            <StageGlyph id="system" animate className="block h-auto w-full" />
          </span>
          <span className="mt-[4px] font-mono text-[8px] font-bold text-[var(--accent)] uppercase tracking-wider">
            KERNEL OCTAGON // STATE LOCKED
          </span>
        </div>

        {/* 4 Multi-Agent Threads */}
        <div className="flex flex-col justify-between rounded border border-white/10 bg-black/50 p-[8px] font-mono text-[8px]">
          <div className="flex items-center justify-between">
            <span className="text-white/60">T1 VIDEO NLE</span>
            <span className="text-[var(--accent)]">60 FPS</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60">T2 PITCH DECK</span>
            <span className="text-[var(--accent)]">SYNCED</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60">T3 WEB COMPILER</span>
            <span className="text-[var(--accent)]">AST OK</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/60">T4 WORKFLOW RUN</span>
            <span className="text-[var(--accent)]">14× SPEED</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded border border-white/10 bg-black/40 px-[10px] py-[5px] font-mono text-[9px]">
        <span className="text-white/60">CONCURRENCY BUS:</span>
        <span className="text-[var(--accent)]">TRIPLE BUFFERED · 0.8ms EVENT LOOP</span>
      </div>
    </div>
  );
}

/** 04 ACTION: High-Speed Tool Dispatch & Compilers */
function ActionVisualizer() {
  return (
    <div className="flex flex-col gap-[8px]">
      {[
        { tool: "RESOLVE_COLOR_RENDER", time: "42ms", pct: 100, label: "LUT Pass Applied" },
        { tool: "VITE_CLIENT_BUNDLE", time: "32ms", pct: 100, label: "ESM Inlined Zero-Runtime" },
        { tool: "CRM_WEBHOOK_DISPATCH", time: "14ms", pct: 100, label: "Slack + Hubspot Synced" },
      ].map((action) => (
        <div
          key={action.tool}
          className="rounded border border-white/10 bg-black/40 p-[8px] flex flex-col gap-[4px]"
        >
          <div className="flex items-center justify-between font-mono text-[8.5px]">
            <span className="font-bold text-white tracking-wide">{action.tool}</span>
            <span className="text-[var(--accent)] font-semibold">{action.time}</span>
          </div>
          <div className="h-[3px] w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--accent)] rounded-full transition-all duration-500"
              style={{ width: `${action.pct}%` }}
            />
          </div>
          <span className="font-mono text-[7.5px] text-white/50">{action.label}</span>
        </div>
      ))}
    </div>
  );
}

/** 05 OUTPUT: Quality Gate & Master Deliverable Artifacts */
function OutputVisualizer() {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex items-center justify-center gap-[10px] rounded border border-[var(--accent)]/40 bg-[var(--accent)]/10 p-[12px] shadow-[0_0_20px_rgba(200,241,79,0.2)]">
        <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[var(--accent)] text-[#0c0c0d] font-bold text-[18px]">
          ✓
        </div>
        <div className="text-left font-mono">
          <span className="block text-[11px] font-bold text-white uppercase tracking-wider">
            PRODUCTION RELEASE 100% VERIFIED
          </span>
          <span className="block text-[8.5px] text-[var(--accent)]">
            ZERO-TRUST ARCHITECTURE · AIRGAP DELIVERED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-[6px] font-mono text-[8.5px]">
        <div className="rounded border border-white/10 bg-black/40 p-[6px]">
          <span className="text-white/60 block">4K VIDEO MASTER</span>
          <span className="text-white font-bold">PRORES 422 HQ</span>
        </div>
        <div className="rounded border border-white/10 bg-black/40 p-[6px]">
          <span className="text-white/60 block">PITCH DECK</span>
          <span className="text-white font-bold">VECTOR KEYNOTE</span>
        </div>
        <div className="rounded border border-white/10 bg-black/40 p-[6px]">
          <span className="text-white/60 block">WEB APPLICATION</span>
          <span className="text-white font-bold">60 FPS 100/100</span>
        </div>
        <div className="rounded border border-white/10 bg-black/40 p-[6px]">
          <span className="text-white/60 block">AI AUTOMATION</span>
          <span className="text-white font-bold">24/7 RUNNING</span>
        </div>
      </div>
    </div>
  );
}
