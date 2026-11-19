import { useEffect, useRef, useState } from "react";
import { servicesData, STUDIO_INFO } from "../data/services";
import { SCENES } from "../components/Scenes";
import { DownloadButton } from "../components/DownloadButton";
import { Link, usePage } from "../lib/router";
import { useReveal, useParallax } from "../lib/reveal";

export function ServicesIndexPage() {
  usePage(
    "Services & Capabilities | ARCHE Creative Studios",
    "Explore Arche's creative technology services: Video Production & Editing (from ₹799), Pitch Decks & Storytelling (from ₹3,999), Web Development (from ₹7,999), and AI Automations (from ₹5,999)."
  );
  useReveal();
  useParallax();

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* 1. HERO OVERVIEW SECTION                                         */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative w-full pt-[130px] pb-[clamp(44px,6vw,84px)] border-b border-[var(--line)]">
        <div className="wrap">
          {/* Breadcrumb / Kicker */}
          <div className="flex items-center gap-[10px] mb-[16px]">
            <span className="h-[6px] w-[6px] rounded-full bg-[var(--accent)]" />
            <p className="mono mono-a text-[11px] uppercase tracking-wider">
              ARCHE CREATIVE STUDIOS // SERVICES
            </p>
          </div>

          <h1 className="d1 max-w-[16ch]" data-r="mask">
            Ideas Deserve More Than Execution. They Deserve Impact.
          </h1>

          <p
            className="body mt-[22px] max-w-[58ch] text-[var(--muted)] text-[clamp(16px,1.6vw,20px)] leading-relaxed"
            data-r="meta"
            data-r-delay="120"
          >
            From intelligent automation and digital development to visual storytelling and powerful presentations, ARCHE CREATIVE STUDIOS brings technology and creativity together to help businesses transform ideas into meaningful outcomes.
          </p>

          {/* Prominent Catalogue Download Banner */}
          <div
            className="mt-[clamp(28px,3.8vw,48px)] flex flex-wrap items-center gap-[16px] rounded-[8px] border border-[var(--line)] bg-[var(--card)] p-[clamp(18px,2.4vw,28px)] shadow-sm"
            data-r="meta"
            data-r-delay="200"
          >
            <div className="flex-1 min-w-[280px]">
              <div className="flex items-center gap-[8px] mb-[4px]">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-ink)] font-semibold">
                  Comprehensive Overview
                </span>
                <span className="h-[3px] w-[3px] rounded-full bg-[var(--line)]" />
                <span className="font-mono text-[10px] text-[var(--muted)]">4 Verticals · Pricing · Scope Frameworks</span>
              </div>
              <h3 className="font-semibold text-[17px] text-[var(--fg)]">
                The Complete ARCHE Service Catalogue
              </h3>
              <p className="text-[13px] text-[var(--muted)] mt-[2px]">
                Download our comprehensive PDF guide containing full tier breakdowns, deliverables, turnaround schedules, and commercial terms.
              </p>
            </div>

            <DownloadButton
              filename={STUDIO_INFO.completeCataloguePdf}
              label="Download Complete Service Catalogue"
              variant="primary"
              className="py-[13px] px-[22px] text-[12px]"
            />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 2. FOUR DISTINCTIVE SERVICE CARDS                                */}
      {/* ---------------------------------------------------------------- */}
      <section className="w-full py-[clamp(60px,8vw,120px)] bg-[var(--bg)]">
        <div className="wrap flex flex-col gap-[clamp(44px,6vw,88px)]">
          {servicesData.map((s, i) => (
            <ServiceVerticalCard key={s.slug} service={s} flip={i % 2 === 1} />
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 3. GENERAL DISCLAIMER & INQUIRY CTA                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="w-full border-t border-[var(--line)] py-[48px] bg-[var(--bg-2)]">
        <div className="wrap flex flex-col md:flex-row items-baseline justify-between gap-[20px]">
          <div className="max-w-[720px]">
            <p className="mono text-[11px] text-[var(--accent-ink)] uppercase mb-[6px]">
              ● Transparency & Scope
            </p>
            <p className="text-[13px] text-[var(--muted)] leading-relaxed">
              {STUDIO_INFO.generalDisclaimer}
            </p>
          </div>
          <Link to="/contact" className="btn self-start md:self-auto" data-cursor="START">
            Start a Project <span className="arw">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}

function ServiceVerticalCard({
  service,
  flip,
}: {
  service: (typeof servicesData)[number];
  flip: boolean;
}) {
  const Scene = SCENES[service.slug];
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (e) => {
        if (e[0].isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`grid items-center gap-[clamp(28px,4vw,64px)] rounded-[12px] border border-[var(--line)] bg-[var(--card)] p-[clamp(22px,3.5vw,48px)] shadow-sm md:grid-cols-12 ${
        flip ? "md:[&>*:first-child]:order-2" : ""
      }`}
    >
      {/* Content Column */}
      <div className="flex flex-col gap-[18px] md:col-span-6">
        <div className="flex items-baseline gap-[14px]">
          <span className="numeral outline-t" style={{ fontSize: "clamp(36px,4.5vw,72px)" }}>
            {service.n}
          </span>
          <div>
            <span className="mono text-[10px] text-[var(--accent-ink)] uppercase tracking-wider block mb-[2px]">
              VERTICAL {service.n}
            </span>
            <h2 className="d3" style={{ fontSize: "clamp(24px,2.8vw,42px)" }} data-r="mask">
              {service.title}
            </h2>
          </div>
        </div>

        <p className="body text-[var(--muted)]" data-r="meta">
          {service.description}
        </p>

        {/* Deliverable Highlights */}
        <div className="rounded-[6px] border border-[var(--line)] bg-[var(--bg)] p-[14px]">
          <span className="mono text-[10px] uppercase text-[var(--accent-ink)] font-semibold block mb-[8px]">
            What We Deliver:
          </span>
          <ul className="grid grid-cols-1 gap-[6px] text-[13px] text-[var(--fg)]">
            {service.deliveryExamples.map((item, idx) => (
              <li key={idx} className="flex items-start gap-[8px]">
                <span className="text-[var(--accent-ink)] font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing & CTA Action Cluster */}
        <div className="flex flex-wrap items-center justify-between gap-[14px] border-t border-[var(--line)] pt-[16px]">
          <div>
            <span className="mono text-[10px] text-[var(--muted)] uppercase block">Investment</span>
            <span className="font-mono text-[16px] font-bold text-[var(--fg)]">
              {service.startingPriceLabel}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-[10px]">
            <Link
              to={`/services/${service.slug}`}
              className="btn"
              cursor="OPEN"
            >
              Explore Service <span className="arw">→</span>
            </Link>

            <DownloadButton
              filename={service.pdfFilename}
              label="Download Service Guide"
              variant="ghost"
            />
          </div>
        </div>
      </div>

      {/* Interactive Motion Scene Column */}
      <div
        className="md:col-span-6 w-full overflow-hidden rounded-[8px] border border-[var(--line)] bg-[#0c0c0d] p-[clamp(12px,1.8vw,20px)] shadow-inner"
        data-r="fade"
      >
        {Scene ? <Scene active={active} /> : null}
      </div>
    </div>
  );
}

