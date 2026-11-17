import { useEffect, useRef, useState } from "react";
import { Link } from "../lib/router";
import { prefersReducedMotion } from "../lib/gsap";
import {
  STARTER_CHIPS,
  processDiscoveryTurn,
  INITIAL_DISCOVERY_STATE,
  rememberLastTrigger,
  type DiscoveryState,
  type DiscoveryResult,
  type ProjectBrief,
} from "../data/intents";

type Phase = "idle" | "thinking" | "typing";

type Message =
  | { role: "user"; text: string; id: number }
  | {
      role: "agent";
      lines: string[];
      revealed: number;
      label: string;
      id: number;
      brief?: ProjectBrief | null;
      serviceSlug?: string;
    };

const GREETING = "I'm the Arche discovery assistant. What is your team looking to build or solve?";

const CORE_SERVICES = [
  {
    slug: "video-production",
    n: "01",
    short: "Video",
    title: "Video Production & Editing",
    tagline: "Reels, Shorts, YouTube, Long-form & Motion",
    startingPrice: "From ₹799",
    query: "I need video production and editing.",
  },
  {
    slug: "pitch-decks-storytelling",
    n: "02",
    short: "Pitch Decks",
    title: "Pitch Decks & Storytelling",
    tagline: "Investor presentations, keynote & sales slides",
    startingPrice: "From ₹3,999",
    query: "I need an investor pitch deck.",
  },
  {
    slug: "web-development",
    n: "03",
    short: "Web Dev",
    title: "Web Development",
    tagline: "High-performance websites with fluid 2D motion",
    startingPrice: "From ₹7,999",
    query: "I need a high-performance website.",
  },
  {
    slug: "ai-solutions-automation",
    n: "04",
    short: "AI & Automations",
    title: "AI Solutions & Automation",
    tagline: "Event-driven workflows, custom agents & CRM sync",
    startingPrice: "From ₹2,499",
    query: "I want to automate my business workflow.",
  },
];

let seq = 1;

export function ArcheAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "agent", lines: [GREETING], revealed: 1, label: "Arche · Discovery", id: 0 },
  ]);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [followUps, setFollowUps] = useState<string[]>(STARTER_CHIPS);
  const [discoveryState, setDiscoveryState] = useState<DiscoveryState>(INITIAL_DISCOVERY_STATE);

  const timers = useRef<number[]>([]);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    scroller.current?.scrollTo({
      top: scroller.current.scrollHeight,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [messages, phase]);

  const send = (raw: string) => {
    const q = raw.trim();
    if (!q) return;
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];

    const userMsgId = seq++;
    const res: DiscoveryResult = processDiscoveryTurn(q, discoveryState);

    // Determine target service slug if brief is generated
    const targetSlug = res.brief?.slug || (
      res.trigger === "service:video" ? "video-production" :
      res.trigger === "service:web" ? "web-development" :
      res.trigger === "service:automation" || res.trigger === "service:agent" ? "ai-solutions-automation" :
      undefined
    );

    setMessages((prev) => [
      ...prev,
      { role: "user", text: q, id: userMsgId },
      {
        role: "agent",
        lines: res.lines,
        revealed: res.lines.length,
        label: res.label,
        id: seq++,
        brief: res.brief,
        serviceSlug: targetSlug,
      },
    ]);
    setInput("");
    setDiscoveryState(res.nextState);
    setFollowUps(res.followUps);
    rememberLastTrigger(res.trigger);

    if (res.brief) {
      try {
        sessionStorage.setItem("arche:discovery_brief", JSON.stringify(res.brief));
      } catch {
        /* storage safety */
      }
    }

    if (prefersReducedMotion()) {
      setPhase("idle");
      return;
    }

    setPhase("typing");
    const t = window.setTimeout(() => {
      setPhase("idle");
    }, 380);
    timers.current.push(t);
  };

  const reset = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setMessages([
      { role: "agent", lines: [GREETING], revealed: 1, label: "Arche · Discovery", id: 0 },
    ]);
    setInput("");
    setPhase("idle");
    setFollowUps(STARTER_CHIPS);
    setDiscoveryState(INITIAL_DISCOVERY_STATE);
    inputRef.current?.focus();
  };

  return (
    <section id="ask-arche" className="w-full py-[clamp(64px,8vw,120px)]">
      <div className="wrap">
        {/* Section Heading */}
        <div className="mb-[clamp(24px,3.2vw,44px)] flex flex-col items-center text-center">
          <p className="mono mono-a mb-[10px]" data-r="meta">
            Ask Arche
          </p>
          <h2 className="d2 max-w-[20ch]" data-r="mask">
            Discover the right service for your business.
          </h2>
          <p className="body mt-[12px] max-w-[58ch]" data-r="meta" data-r-delay="120">
            A guided interactive discovery assistant: select a core studio offering below or describe your requirement in free text.
            Instantly formulate scoped project briefs, explore dedicated service pages, and review transparent pricing.
          </p>
        </div>

        {/* Interactive Service Fast-Navigation Bar */}
        <div className="mx-auto max-w-4xl mb-[20px] grid grid-cols-2 md:grid-cols-4 gap-[10px]" data-r="meta">
          {CORE_SERVICES.map((s) => (
            <div
              key={s.slug}
              className="group flex flex-col justify-between p-[13px] rounded-[7px] border transition-all duration-300 hover:border-[var(--accent-deep)]"
              style={{ background: "var(--card)", borderColor: "var(--line)" }}
            >
              <div>
                <div className="flex items-center justify-between mb-[5px]">
                  <span className="mono text-[10px] text-[var(--accent-ink)] font-semibold">
                    {s.n} // {s.short}
                  </span>
                  <span className="mono text-[9px] px-[6px] py-[2px] rounded-full border border-[var(--line)] text-[var(--muted)]">
                    {s.startingPrice}
                  </span>
                </div>
                <h4 className="font-medium text-[13px] leading-tight text-[var(--fg)] mb-[4px]">
                  {s.title}
                </h4>
                <p className="text-[11px] text-[var(--muted)] line-clamp-2 leading-relaxed">
                  {s.tagline}
                </p>
              </div>
              <div className="mt-[10px] pt-[8px] border-t border-[var(--line)] flex items-center justify-between gap-[6px]">
                <button
                  type="button"
                  onClick={() => send(s.query)}
                  className="mono text-[10.5px] text-[var(--accent-ink)] hover:underline flex items-center gap-[3px] cursor-pointer bg-transparent border-0 p-0"
                  aria-label={`Scope ${s.title} in assistant`}
                >
                  Scope in Chat
                </button>
                <Link
                  to={`/services/${s.slug}`}
                  className="mono text-[10.5px] text-[var(--fg)] opacity-75 hover:opacity-100 flex items-center gap-[2px]"
                >
                  Page <span className="arw">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Central Interactive Discovery Chat Frame */}
        <div
          className="mx-auto max-w-4xl overflow-hidden rounded-[8px] border"
          style={{ borderColor: "var(--line)", background: "var(--card)" }}
          data-r="meta"
        >
          {/* Top Assistant Status Bar */}
          <div
            className="flex items-center justify-between border-b px-[16px] py-[12px]"
            style={{ borderColor: "var(--line)", background: "var(--bg-2)" }}
          >
            <div className="flex items-center gap-[10px]">
              <span
                className={`block h-[8px] w-[8px] rounded-full ${phase === "thinking" || phase === "typing" ? "demo-pulse" : ""}`}
                style={{ background: "var(--accent-deep)" }}
              />
              <span className="mono mono-fg font-medium">Arche Discovery Engine</span>
              <span className="mono text-[11px] text-[var(--muted)]">
                · {phase === "thinking" ? "Analyzing" : phase === "typing" ? "Synthesizing" : "Interactive Ready"}
              </span>
            </div>
            <div className="flex items-center gap-[16px]">
              <Link to="/services" className="mono text-[11px] lnk text-[var(--muted)] hidden sm:inline">
                All Services →
              </Link>
              <Link to="/pricing" className="mono text-[11px] lnk text-[var(--muted)] hidden sm:inline">
                Pricing →
              </Link>
              <button className="mono lnk text-[11px]" onClick={reset}>
                Reset
              </button>
            </div>
          </div>

          {/* Chat Messages Feed */}
          <div
            ref={scroller}
            data-lenis-prevent="true"
            className="min-h-[350px] max-h-[480px] space-y-[16px] overflow-y-auto p-[18px]"
            aria-live="polite"
          >
            {messages.map((m) =>
              m.role === "user" ? (
                <div key={m.id} className="flex justify-end">
                  <p
                    className="chat-user m-0 max-w-[85%] px-[14px] py-[10px] text-[14px] leading-[1.55]"
                    style={{
                      borderRadius: "16px 16px 4px 16px",
                      background: "var(--fg)",
                      color: "var(--bg)",
                    }}
                  >
                    {m.text}
                  </p>
                </div>
              ) : (
                <div key={m.id} className="flex justify-start">
                  <div className="max-w-[94%]">
                    <p className="mono mb-[6px] text-[11px]" style={{ color: "var(--accent-ink)" }}>
                      ● {m.label}
                    </p>
                    <div
                      className="flex flex-col gap-[6px] px-[14px] py-[12px] text-[14px] leading-[1.55]"
                      style={{
                        borderRadius: "16px 16px 16px 4px",
                        background: "var(--bg-2)",
                        color: "var(--fg)",
                      }}
                    >
                      {m.lines.slice(0, m.revealed).map((ln, i) => (
                        <p key={i} className="m-0 chat-line" style={i > 0 ? { animationDelay: "40ms" } : undefined}>
                          {ln}
                        </p>
                      ))}
                    </div>

                    {/* Interactive Redirection & Scoped Brief Card */}
                    {m.brief && (
                      <div
                        className="mt-[12px] rounded-[8px] border p-[16px] sv-rise"
                        style={{
                          background: "var(--bg)",
                          borderColor: "var(--accent-deep)",
                          boxShadow: "0 0 20px -8px color-mix(in srgb, var(--accent) 35%, transparent)",
                        }}
                      >
                        <div className="mb-[10px] flex flex-wrap items-center justify-between gap-[8px]">
                          <span className="mono text-[10.5px] text-[var(--accent-ink)] font-semibold flex items-center gap-[6px]">
                            <span className="h-[6px] w-[6px] rounded-full" style={{ background: "var(--accent-deep)" }} />
                            SCOPED DISCOVERY BRIEF // {m.brief.service.toUpperCase()}
                          </span>
                          <div className="flex items-center gap-[8px]">
                            {m.brief.startingPrice && (
                              <span className="mono text-[10px] px-[7px] py-[2px] rounded-full border border-[var(--accent-deep)] text-[var(--accent-ink)]">
                                {m.brief.startingPrice}
                              </span>
                            )}
                            <span className="mono text-[9.5px] text-[var(--muted)]">
                              {m.brief.timeline}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-[4px] text-[12.5px] border-b pb-[12px]" style={{ borderColor: "var(--line)" }}>
                          <p className="m-0 font-medium text-[var(--fg)]">
                            {m.brief.scope}
                          </p>
                          <p className="m-0 text-[11.5px] text-[var(--muted)] leading-relaxed">
                            {m.brief.details}
                          </p>
                        </div>

                        {/* Interactive Redirection Links & Action Grid */}
                        <div className="mt-[12px] grid grid-cols-1 sm:grid-cols-2 gap-[8px]">
                          <Link
                            to={`/contact?seed=${m.brief.seed}&scope=${encodeURIComponent(m.brief.scope)}`}
                            className="btn w-full justify-center text-[11.5px]"
                            data-cursor="START"
                          >
                            Start Project with this Brief <span className="arw">→</span>
                          </Link>

                          {m.brief.slug && (
                            <Link
                              to={`/services/${m.brief.slug}`}
                              className="btn btn-ghost w-full justify-center text-[11.5px]"
                              data-cursor="OPEN"
                            >
                              Explore Service Details <span className="arw">→</span>
                            </Link>
                          )}

                          <Link
                            to="/pricing"
                            className="btn btn-ghost w-full justify-center text-[11.5px]"
                          >
                            View Pricing Packages <span className="arw">→</span>
                          </Link>

                          <a
                            href={`https://Wa.me/+917995937536?text=${encodeURIComponent(`Hi Arche, I'm interested in scoping ${m.brief.service}: ${m.brief.scope}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-ghost w-full justify-center text-[11.5px] border-[#25D366]/40 hover:border-[#25D366] text-[#25D366]"
                          >
                            Chat on WhatsApp <span className="arw">↗</span>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            )}

            {phase === "typing" && (
              <div className="flex items-center gap-[8px] pl-[4px]">
                <span className="flex gap-[4px]">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="type-dot h-[5px] w-[5px] rounded-full"
                      style={{ background: "var(--accent-deep)", animationDelay: `${i * 140}ms` }}
                    />
                  ))}
                </span>
                <span className="mono text-[11px]" style={{ color: "var(--faint)" }}>
                  synthesizing response
                </span>
              </div>
            )}
          </div>

          {/* Interactive Query Input & Quick Actions */}
          <div className="border-t p-[16px]" style={{ borderColor: "var(--line)", background: "var(--card)" }}>
            {/* Suggested Interactive Follow-Up Chips */}
            <div className="mb-[12px] flex flex-wrap gap-[7px]">
              {followUps.map((p) => (
                <button
                  key={p}
                  className="chip text-[11.5px]"
                  disabled={phase !== "idle"}
                  style={{ opacity: phase !== "idle" ? 0.45 : 1 }}
                  onClick={() => send(p)}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Free-Text Prompt Form */}
            <form
              className="flex items-end gap-[10px]"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <label className="flex flex-1 flex-col">
                <span className="sr-only">Ask Arche</span>
                <input
                  ref={inputRef}
                  className="field w-full"
                  value={input}
                  disabled={phase !== "idle"}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your project (e.g. investor pitch deck, website redesign, reels editing, CRM automation)..."
                  data-cursor="ASK"
                />
              </label>
              <button
                className="btn flex-none"
                disabled={!input.trim() || phase !== "idle"}
                data-cursor="START"
                data-magnetic
              >
                Send <span className="arw">→</span>
              </button>
            </form>

            {/* Direct Redirection Quick-Bar Footer */}
            <div className="mt-[14px] pt-[10px] border-t border-[var(--line)] flex flex-wrap items-center justify-between gap-[10px] text-[11px] mono">
              <span style={{ color: "var(--muted)" }}>
                Direct Studio Shortcuts:
              </span>
              <div className="flex flex-wrap items-center gap-[12px]">
                <Link to="/services" className="lnk text-[var(--fg)] hover:text-[var(--accent-deep)]">
                  All Services →
                </Link>
                <Link to="/pricing" className="lnk text-[var(--fg)] hover:text-[var(--accent-deep)]">
                  All Pricing →
                </Link>
                <Link to="/work" className="lnk text-[var(--fg)] hover:text-[var(--accent-deep)]">
                  Selected Work →
                </Link>
                <Link to="/contact" className="lnk text-[var(--accent-ink)] font-semibold">
                  Start Project Brief →
                </Link>
                <a
                  href="https://Wa.me/+917995937536"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lnk text-[#25D366] font-medium"
                >
                  WhatsApp Support ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
