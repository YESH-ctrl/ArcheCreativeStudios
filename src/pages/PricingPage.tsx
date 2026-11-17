import { useState } from "react";
import {
  servicesData,
  STUDIO_INFO,
  type PackageItem,
  type ServiceData,
} from "../data/services";
import { DownloadButton } from "../components/DownloadButton";
import { Link, usePage, navigate } from "../lib/router";
import { useReveal, useParallax } from "../lib/reveal";
import { prefersReducedMotion } from "../lib/gsap";

export function PricingPage() {
  usePage("Pricing & Investment | ARCHE Creative Studios");
  useReveal();
  useParallax();

  const [activeVertical, setActiveVertical] = useState<string>("all");

  const handleSelectPackage = (serviceTitle: string, packageName?: string) => {
    try {
      sessionStorage.setItem(
        "arche:prefill",
        JSON.stringify({
          service: serviceTitle,
          package: packageName || "",
          build: serviceTitle,
        })
      );
    } catch {
      /* ignore */
    }
    navigate("/contact");
  };

  const filteredServices =
    activeVertical === "all"
      ? servicesData
      : servicesData.filter((s) => s.slug === activeVertical);

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* 1. HERO HEADER SECTION                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative w-full pt-[130px] pb-[clamp(44px,6vw,84px)] border-b border-[var(--line)]">
        <div className="wrap">
          {/* Breadcrumbs */}
          <div className="mb-[20px] flex items-center gap-[10px]">
            <Link to="/" className="mono lnk text-[12px]">
              Home
            </Link>
            <span className="mono text-[var(--faint)]">/</span>
            <span className="mono mono-fg text-[12px]">Pricing</span>
          </div>

          <div className="max-w-[840px]">
            <p className="mono mono-a mb-[14px]">
              // ARCHE CREATIVE STUDIOS · INVESTMENT ARCHITECTURE
            </p>
            <h1 className="d1 text-[clamp(32px,5.2vw,64px)] tracking-[-0.03em] leading-[1.08]">
              <span className="block" data-r="mask">
                Transparent Rates.
              </span>
              <span className="block" data-r="mask" data-r-delay="90">
                Honest Scopes.
              </span>
              <span className="block" data-r="mask" data-r-delay="180">
                Zero Surprises.
              </span>
            </h1>
            <p className="body mt-[22px] max-w-[62ch] text-[var(--muted)] text-[clamp(15px,1.2vw,17px)] leading-relaxed" data-r="meta">
              Every project is backed by clearly defined packages, fixed turnaround times,
              and concrete deliverables. All rates are proposed in Indian Rupees (INR) with no hidden fees or agency overhead.
            </p>
          </div>

          {/* Action Row: Catalogue Download + Quick Jump */}
          <div className="mt-[34px] flex flex-wrap items-center gap-[14px]" data-r="meta">
            <DownloadButton
              filename={STUDIO_INFO.completeCataloguePdf}
              label="Download Complete Service Catalogue"
              variant="primary"
            />
            <Link to="/contact" className="btn btn-ghost" data-cursor="START">
              Request Custom Scope <span className="arw">→</span>
            </Link>
          </div>

          {/* Quick Jump Pills / Filter */}
          <div className="mt-[40px] flex flex-wrap items-center gap-[10px]" data-r="meta">
            <button
              onClick={() => setActiveVertical("all")}
              className={`chip ${activeVertical === "all"
                  ? "border-[var(--accent)] bg-[var(--accent)] text-[#0c0c0d]"
                  : ""
                }`}
            >
              All Verticals ({servicesData.length})
            </button>
            {servicesData.map((s) => (
              <button
                key={s.slug}
                onClick={() => {
                  setActiveVertical(s.slug);
                  if (activeVertical === s.slug) {
                    document.getElementById(s.slug)?.scrollIntoView({
                      behavior: prefersReducedMotion() ? "auto" : "smooth",
                    });
                  }
                }}
                className={`chip ${activeVertical === s.slug
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[#0c0c0d]"
                    : ""
                  }`}
              >
                <span className="mono text-[10px] text-[var(--accent-ink)] mr-1">
                  {s.n}
                </span>
                {s.title} · from {s.startingPrice}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 2. SERVICES PRICING SECTIONS                                      */}
      {/* ---------------------------------------------------------------- */}
      <div className="flex flex-col divide-y divide-[var(--line)]">
        {filteredServices.map((service) => (
          <ServicePricingBlock
            key={service.slug}
            service={service}
            onSelectPackage={(pkgName) =>
              handleSelectPackage(service.title, pkgName)
            }
          />
        ))}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* 3. STUDIO PRICING PRINCIPLES & COMMERCIAL TERMS                   */}
      {/* ---------------------------------------------------------------- */}
      <section
        className="w-full py-[clamp(60px,8vw,120px)] border-t border-[var(--line)]"
        style={{ background: "var(--bg)" }}
      >
        <div className="wrap grid gap-[clamp(36px,5vw,64px)] lg:grid-cols-12">
          {/* Left Column: Heading & Disclaimer */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <p className="mono mono-a mb-[12px]">Commercial Architecture</p>
              <h2 className="d2 max-w-[14ch]" data-r="mask">
                How we price and operate.
              </h2>
              <p className="body mt-[16px] max-w-[42ch] text-[var(--muted)]">
                We operate as a modern creative technology studio, not a bloated agency or an open-ended hourly shop.
              </p>
            </div>

            <div className="mt-[32px] rounded-[6px] border border-[var(--line)] p-[18px] bg-[var(--bg-2)]">
              <span className="mono text-[10px] uppercase tracking-wider text-[var(--accent-ink)] block mb-[6px]">
                ● Scope Notice
              </span>
              <p className="font-mono text-[11px] text-[var(--muted)] leading-relaxed">
                {STUDIO_INFO.generalDisclaimer}
              </p>
            </div>
          </div>

          {/* Right Column: Key Principles */}
          <div className="lg:col-span-7 flex flex-col gap-[18px]">
            <div className="border border-[var(--line)] p-[22px_26px] rounded-[6px] bg-[var(--bg-2)]">
              <div className="flex items-center gap-[10px] mb-[8px]">
                <span className="mono text-[11px] text-[var(--accent-ink)] font-semibold">01</span>
                <h3 className="d4 font-medium">Fixed Milestones & Defined Deliverables</h3>
              </div>
              <p className="body-s text-[var(--muted)] leading-relaxed">
                Before any production sprint or development starts, you receive an exact technical scope with deliverables, duration limits, revision allowances, and total investment in writing.
              </p>
            </div>

            <div className="border border-[var(--line)] p-[22px_26px] rounded-[6px] bg-[var(--bg-2)]">
              <div className="flex items-center gap-[10px] mb-[8px]">
                <span className="mono text-[11px] text-[var(--accent-ink)] font-semibold">02</span>
                <h3 className="d4 font-medium">50% Commitment Deposit</h3>
              </div>
              <p className="body-s text-[var(--muted)] leading-relaxed">
                Engagements require a 50% deposit to lock the production timeline, with the remaining balance due upon final milestone approval and before export handoff or deployment.
              </p>
            </div>

            <div className="border border-[var(--line)] p-[22px_26px] rounded-[6px] bg-[var(--bg-2)]">
              <div className="flex items-center gap-[10px] mb-[8px]">
                <span className="mono text-[11px] text-[var(--accent-ink)] font-semibold">03</span>
                <h3 className="d4 font-medium">Structured Revision Passes</h3>
              </div>
              <p className="body-s text-[var(--muted)] leading-relaxed">
                Every tier includes consolidated revision rounds to polish timing, copy, visual styling and grading. Additional rounds or scope changes are quoted upfront at standard add-on rates.
              </p>
            </div>

            <div className="border border-[var(--line)] p-[22px_26px] rounded-[6px] bg-[var(--bg-2)]">
              <div className="flex items-center gap-[10px] mb-[8px]">
                <span className="mono text-[11px] text-[var(--accent-ink)] font-semibold">04</span>
                <h3 className="d4 font-medium">Start Single, Scale & Connect</h3>
              </div>
              <p className="body-s text-[var(--muted)] leading-relaxed">
                Start with a single vertical — whether a batch of high-retention reels, a competition pitch deck, a marketing website, or an AI assistant. As your business grows, our systems integrate seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 4. BOTTOM ACTION BANNER                                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="w-full py-[clamp(44px,6vw,72px)] border-t border-[var(--line)] bg-[var(--bg-2)]">
        <div className="wrap flex flex-col md:flex-row md:items-center justify-between gap-[24px]">
          <div>
            <span className="mono text-[11px] text-[var(--accent-ink)] block mb-[6px]">
              Ready to collaborate?
            </span>
            <h3 className="d3 font-medium">Have a custom requirement or enterprise scope?</h3>
            <p className="body-s text-[var(--muted)] mt-[6px]">
              We prepare custom scopes and tailored retained partnerships within one working day.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-[12px]">
            <Link to="/contact" className="btn" data-cursor="START">
              Start a Project <span className="arw">→</span>
            </Link>
            <DownloadButton
              filename={STUDIO_INFO.completeCataloguePdf}
              label="Download Catalogue (PDF)"
              variant="ghost"
            />
          </div>
        </div>
      </section>
    </>
  );
}

/**
 * Service vertical pricing block rendering all packages, specialist services,
 * retainers, and add-ons for a vertical.
 */
function ServicePricingBlock({
  service,
  onSelectPackage,
}: {
  service: ServiceData;
  onSelectPackage: (pkgName: string) => void;
}) {
  return (
    <section id={service.slug} className="w-full py-[clamp(50px,7vw,90px)] scroll-mt-[80px]">
      <div className="wrap">
        {/* Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-[20px] mb-[clamp(28px,4vw,48px)]">
          <div className="max-w-[720px]">
            <div className="flex items-center gap-[10px] mb-[8px]">
              <span className="mono text-[11px] text-[var(--accent-ink)] font-semibold">
                // {service.n}
              </span>
              <span className="mono text-[11px] text-[var(--muted)] uppercase">
                {service.short}
              </span>
            </div>
            <h2 className="d2 text-[clamp(26px,3.4vw,42px)]">{service.title}</h2>
            <p className="body-s text-[var(--muted)] mt-[10px] max-w-[58ch]">
              {service.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-[10px]">
            <Link
              to={`/services/${service.slug}`}
              className="mono text-[11px] uppercase tracking-wider border border-[var(--line)] px-[14px] py-[8px] rounded-full hover:border-[var(--fg)] transition-colors"
            >
              Explore Overview →
            </Link>
            <DownloadButton
              filename={service.pdfFilename}
              label="Download Guide (PDF)"
              variant="ghost"
            />
          </div>
        </div>

        {/* Package Groups */}
        {service.packageGroups.map((group, gIdx) => (
          <div key={gIdx} className="mb-[clamp(32px,4vw,56px)]">
            <div className="flex items-baseline justify-between border-b border-[var(--line)] pb-[12px] mb-[24px]">
              <div>
                <h3 className="mono text-[13px] uppercase tracking-[0.14em] text-[var(--fg)] font-semibold">
                  {group.groupTitle}
                </h3>
                {group.groupSubtitle && (
                  <p className="font-mono text-[11px] text-[var(--muted)] mt-[3px]">
                    {group.groupSubtitle}
                  </p>
                )}
              </div>
              <span className="mono text-[10px] text-[var(--accent-ink)]">
                {group.packages.length} tier{group.packages.length > 1 ? "s" : ""}
              </span>
            </div>

            {/* Packages Grid */}
            <div className="grid gap-[20px] sm:grid-cols-2 lg:grid-cols-3">
              {group.packages.map((pkg) => (
                <PricingCard
                  key={pkg.id}
                  pkg={pkg}
                  onSelect={() => onSelectPackage(pkg.name)}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Specialist Services & Add-Ons Grid */}
        <div className="grid gap-[24px] lg:grid-cols-12 mt-[36px]">
          {/* Specialist Services */}
          {service.specialistServices && service.specialistServices.length > 0 && (
            <div className="lg:col-span-7 rounded-[8px] border border-[var(--line)] p-[24px] bg-[var(--bg-2)]">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-[12px] mb-[16px]">
                <h4 className="mono text-[12px] uppercase tracking-wider text-[var(--fg)] font-semibold">
                  Specialist Services
                </h4>
                <span className="mono text-[10px] text-[var(--muted)]">Scope Scoped</span>
              </div>
              <div className="divide-y divide-[var(--line)]">
                {service.specialistServices.map((sp, sIdx) => (
                  <div
                    key={sIdx}
                    className="py-[12px] flex flex-col sm:flex-row sm:items-baseline justify-between gap-[6px]"
                  >
                    <div>
                      <span className="d4 text-[14px] font-medium block">{sp.name}</span>
                      {sp.description && (
                        <span className="body-s text-[12px] text-[var(--muted)] block mt-[2px]">
                          {sp.description}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[13px] font-semibold text-[var(--accent-ink)] whitespace-nowrap">
                      {sp.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add-Ons & Care Plans */}
          <div className={`${service.specialistServices ? "lg:col-span-5" : "lg:col-span-12"} flex flex-col gap-[20px]`}>
            {/* Add-Ons */}
            {service.addOns && service.addOns.length > 0 && (
              <div className="rounded-[8px] border border-[var(--line)] p-[24px] bg-[var(--bg-2)]">
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-[12px] mb-[16px]">
                  <h4 className="mono text-[12px] uppercase tracking-wider text-[var(--fg)] font-semibold">
                    Add-On Options
                  </h4>
                  <span className="mono text-[10px] text-[var(--muted)]">Available per request</span>
                </div>
                <div className="divide-y divide-[var(--line)]">
                  {service.addOns.map((ao, aIdx) => (
                    <div
                      key={aIdx}
                      className="py-[10px] flex items-center justify-between gap-[10px]"
                    >
                      <span className="body-s text-[13px] text-[var(--fg)]">{ao.name}</span>
                      <span className="font-mono text-[12px] font-medium text-[var(--accent-ink)] whitespace-nowrap">
                        {ao.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Care Plans (if present) */}
            {service.carePlans && service.carePlans.length > 0 && (
              <div className="rounded-[8px] border border-[var(--line)] p-[24px] bg-[var(--bg-2)]">
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-[12px] mb-[16px]">
                  <h4 className="mono text-[12px] uppercase tracking-wider text-[var(--fg)] font-semibold">
                    Monthly Care & Maintenance
                  </h4>
                  <span className="mono text-[10px] text-[var(--muted)]">Retainer</span>
                </div>
                <div className="flex flex-col gap-[14px]">
                  {service.carePlans.map((cp, cIdx) => (
                    <div
                      key={cIdx}
                      className="border border-[var(--line)] p-[14px] rounded-[6px] bg-[var(--bg)]"
                    >
                      <div className="flex items-baseline justify-between mb-[6px]">
                        <span className="font-mono text-[13px] font-semibold">{cp.name}</span>
                        <span className="font-mono text-[13px] font-semibold text-[var(--accent-ink)]">
                          {cp.price}
                          <span className="text-[10px] font-normal text-[var(--muted)]"> / {cp.unit}</span>
                        </span>
                      </div>
                      <p className="body-s text-[12px] text-[var(--muted)] mb-[8px]">{cp.summary}</p>
                      <ul className="flex flex-col gap-[4px]">
                        {cp.features.map((f, fIdx) => (
                          <li key={fIdx} className="font-mono text-[10px] text-[var(--muted)] flex items-center gap-[6px]">
                            <span className="text-[var(--accent)]">✓</span> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Specific Service Disclaimer */}
        <div className="mt-[24px] border-t border-[var(--line)] pt-[14px]">
          <p className="font-mono text-[11px] text-[var(--muted)] italic">
            * {service.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Individual package pricing card component.
 */
function PricingCard({
  pkg,
  onSelect,
}: {
  pkg: PackageItem;
  onSelect: () => void;
}) {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-[8px] border p-[clamp(20px,2.4vw,28px)] transition-all duration-300 hover:border-[var(--accent-deep)] ${pkg.popular
          ? "border-[var(--accent)] bg-[var(--bg-2)] shadow-md"
          : "border-[var(--line)] bg-[var(--bg)]"
        }`}
    >
      {/* Popular badge */}
      {pkg.popular && (
        <span
          className="absolute -top-[11px] right-[18px] rounded-full border px-[10px] py-[2px] font-mono text-[9px] uppercase tracking-[0.14em]"
          style={{
            borderColor: "var(--accent)",
            background: "var(--accent)",
            color: "#0c0c0d",
            fontWeight: 700,
          }}
        >
          Popular Choice
        </span>
      )}

      <div>
        {/* Tier Name */}
        <div className="mb-[6px]">
          <h4 className="d4 text-[17px] font-medium tracking-tight text-[var(--fg)]">
            {pkg.name}
          </h4>
          {pkg.tagline && (
            <p className="font-mono text-[11px] text-[var(--accent-ink)] mt-[2px]">
              {pkg.tagline}
            </p>
          )}
        </div>

        {/* Pricing line */}
        <div className="mt-[16px] mb-[14px] flex items-baseline gap-[6px]">
          <span className="font-mono text-[clamp(26px,2.8vw,34px)] font-bold text-[var(--fg)]">
            {pkg.price}
          </span>
          <span className="font-mono text-[11px] text-[var(--muted)]">
            / {pkg.unit}
          </span>
        </div>

        {/* Summary */}
        <p className="body-s text-[13px] text-[var(--muted)] min-h-[36px] leading-relaxed">
          {pkg.summary}
        </p>

        {/* Meta badges: Turnaround & Revisions */}
        {(pkg.turnaround || pkg.revisions) && (
          <div className="mt-[16px] flex flex-wrap gap-[6px] border-y border-[var(--line)] py-[10px]">
            {pkg.turnaround && (
              <span className="font-mono text-[10px] text-[var(--muted)] bg-[var(--bg-2)] px-[8px] py-[3px] rounded">
                ⏱ {pkg.turnaround}
              </span>
            )}
            {pkg.revisions && (
              <span className="font-mono text-[10px] text-[var(--muted)] bg-[var(--bg-2)] px-[8px] py-[3px] rounded">
                ↺ {pkg.revisions}
              </span>
            )}
          </div>
        )}

        {/* Deliverables / Features */}
        <div className="mt-[16px]">
          <span className="mono text-[10px] uppercase tracking-wider text-[var(--muted)] block mb-[10px]">
            Includes:
          </span>
          <ul className="flex flex-col gap-[8px]">
            {pkg.features.map((feat, fIdx) => (
              <li
                key={fIdx}
                className="flex items-start gap-[8px] text-[12px] text-[var(--fg)] leading-snug"
              >
                <span className="text-[var(--accent)] font-bold text-[13px] mt-[-1px]">
                  ✓
                </span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Select Button */}
      <button
        onClick={onSelect}
        className={`btn mt-[24px] w-full justify-center ${pkg.popular ? "" : "btn-ghost"
          }`}
        data-cursor="START"
      >
        Select Package <span className="arw">→</span>
      </button>
    </div>
  );
}
