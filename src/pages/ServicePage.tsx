import { useEffect, useState } from "react";
import { getServiceBySlug, servicesData, STUDIO_INFO, type PackageItem } from "../data/services";
import { SCENES } from "../components/Scenes";
import { DownloadButton } from "../components/DownloadButton";
import { Link, usePage, navigate } from "../lib/router";
import { useReveal, useParallax } from "../lib/reveal";

export function ServicePage({ slug }: { slug: string }) {
  const service = getServiceBySlug(slug);
  usePage(service ? service.seo.title : "Service | ARCHE Creative Studios");
  useReveal();
  useParallax();

  const [sceneActive, setSceneActive] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSceneActive(true), 250);
    return () => clearTimeout(t);
  }, [slug]);

  if (!service) {
    return (
      <section className="flex min-h-[70svh] w-full items-center">
        <div className="wrap">
          <h1 className="d2">Service not found.</h1>
          <p className="body mt-[16px] text-[var(--muted)]">
            The requested service vertical does not exist or has moved.
          </p>
          <Link to="/services" className="btn mt-[24px]">
            Explore All Services <span className="arw">→</span>
          </Link>
        </div>
      </section>
    );
  }

  const Scene = SCENES[service.slug];
  const otherServices = servicesData.filter((x) => x.slug !== service.slug);

  const handleSelectPackage = (pkgName: string) => {
    try {
      sessionStorage.setItem(
        "arche:prefill",
        JSON.stringify({
          service: service.title,
          package: pkgName,
        })
      );
    } catch {
      /* ignore */
    }
    navigate("/contact");
  };

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* 1. HERO SECTION & POSITIONING                                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative w-full pt-[130px] pb-[clamp(40px,5vw,70px)] border-b border-[var(--line)]">
        <div className="wrap">
          {/* Breadcrumbs */}
          <div className="mb-[20px] flex items-center gap-[10px]">
            <Link to="/services" className="mono lnk text-[12px] text-[var(--muted)]">
              Services
            </Link>
            <span className="text-[var(--line)] font-mono">/</span>
            <span className="mono text-[12px] text-[var(--accent-ink)] font-semibold">
              {service.title}
            </span>
          </div>

          <div className="max-w-[980px]">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent-ink)] font-semibold block mb-[10px]">
              VERTICAL {service.n} · {service.short.toUpperCase()}
            </span>

            <h1 className="d1 max-w-[18ch]" data-r="mask">
              {service.headline}
            </h1>

            <p
              className="body mt-[22px] max-w-[62ch] text-[var(--muted)] text-[clamp(16px,1.5vw,20px)] leading-relaxed"
              data-r="meta"
            >
              {service.description}
            </p>
          </div>

          {/* Action Row: Request + Direct PDF Download */}
          <div className="mt-[clamp(28px,3.6vw,44px)] flex flex-wrap items-center gap-[14px]">
            <button
              onClick={() => handleSelectPackage(service.title)}
              className="btn"
              data-cursor="START"
              data-magnetic
            >
              Start a Project <span className="arw">→</span>
            </button>

            <DownloadButton
              filename={service.pdfFilename}
              label={service.pdfLabel}
              variant="ghost"
              className="py-[12px] px-[20px]"
            />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 2. DEDICATED SERVICE MOTION EXPERIENCE                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="w-full py-[clamp(44px,6vw,80px)] bg-[var(--bg-2)] border-b border-[var(--line)]">
        <div className="wrap">
          <div className="mb-[24px] flex flex-col md:flex-row md:items-end justify-between gap-[16px]">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-ink)] font-semibold block mb-[4px]">
                Interactive Demonstration
              </span>
              <h2 className="d3 text-[clamp(22px,2.8vw,38px)]">
                {service.title} in Action
              </h2>
            </div>
            <p className="font-mono text-[11px] text-[var(--muted)] max-w-[42ch]">
              Illustrative simulation of ARCHE's precision workflow, structure and craft.
            </p>
          </div>

          <div className="w-full overflow-hidden rounded-[10px] border border-[var(--line)] bg-[#0c0c0d] p-[clamp(12px,2vw,24px)] shadow-xl">
            {Scene ? <Scene active={sceneActive} /> : null}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 3. SERVICES OFFERED BREAKDOWN                                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="w-full py-[clamp(48px,6.5vw,96px)] border-b border-[var(--line)] bg-[var(--bg)]">
        <div className="wrap">
          <div className="max-w-[700px] mb-[clamp(28px,4vw,52px)]">
            <span className="mono mono-a text-[11px] uppercase tracking-wider block mb-[8px]">
              Scope Capabilities
            </span>
            <h2 className="d2 text-[clamp(28px,3.5vw,56px)]">
              What We Deliver
            </h2>
            <p className="body text-[var(--muted)] mt-[10px]">
              Every engagement is delivered with structured revisions, transparent turnaround timelines, and dedicated brand alignment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
            {service.servicesOffered.map((item, idx) => (
              <div
                key={idx}
                className="rounded-[8px] border border-[var(--line)] bg-[var(--card)] p-[20px] transition-transform duration-300 hover:-translate-y-[2px] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-[11px] font-bold text-[var(--accent-ink)] block mb-[10px]">
                    0{idx + 1}
                  </span>
                  <h3 className="font-semibold text-[16px] text-[var(--fg)] leading-snug">
                    {item}
                  </h3>
                </div>
                <div className="mt-[16px] flex items-center gap-[6px] font-mono text-[10px] text-[var(--muted)]">
                  <span className="h-[4px] w-[4px] rounded-full bg-[var(--accent)]" />
                  <span>Production Ready</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 4. SPECIALIST DEEP DIVES (PITCH DECKS / SPECIFIC FORMATS)        */}
      {/* ---------------------------------------------------------------- */}
      {service.specialistDeepDives && service.specialistDeepDives.length > 0 && (
        <section className="w-full py-[clamp(48px,6vw,90px)] border-b border-[var(--line)] bg-[var(--bg-2)]">
          <div className="wrap">
            <div className="max-w-[720px] mb-[clamp(28px,3.5vw,48px)]">
              <span className="mono mono-a text-[11px] uppercase tracking-wider block mb-[6px]">
                Specialized Formats
              </span>
              <h2 className="d3 text-[clamp(24px,3vw,44px)]">
                Purpose-Built Presentation Architectures
              </h2>
              <p className="text-[14px] text-[var(--muted)] mt-[8px]">
                Different audiences require fundamentally different storytelling structures. Here is how we architect each format:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
              {service.specialistDeepDives.map((deep, idx) => (
                <div
                  key={idx}
                  className="rounded-[8px] border border-[var(--line)] bg-[var(--card)] p-[22px] shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-[17px] text-[var(--fg)] mb-[6px]">
                      {deep.title}
                    </h3>
                    <p className="text-[12px] text-[var(--muted)] mb-[14px] leading-relaxed">
                      {deep.purpose}
                    </p>
                    <ul className="space-y-[5px] border-t border-[var(--line)] pt-[12px]">
                      {deep.elements.map((el, elIdx) => (
                        <li key={elIdx} className="text-[12px] text-[var(--fg)] flex items-start gap-[6px]">
                          <span className="text-[var(--accent-ink)] font-bold">›</span>
                          <span>{el}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* 5. STRUCTURED PRICING TIERS & PACKAGES                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="w-full py-[clamp(60px,8vw,110px)] bg-[var(--bg)] border-b border-[var(--line)]">
        <div className="wrap">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-[20px] mb-[clamp(32px,4vw,60px)]">
            <div>
              <p className="mono mono-a text-[11px] uppercase tracking-wider mb-[8px]">
                Transparent Investment
              </p>
              <h2 className="d2 text-[clamp(30px,4vw,64px)]">
                Packages & Rates
              </h2>
              <p className="body text-[var(--muted)] mt-[10px] max-w-[52ch]">
                Proposed ARCHE launch rates in INR. Clear limits, revision allowances, and turnaround estimates upfront.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-[6px]">
              <span className="mono text-[11px] text-[var(--accent-ink)] font-semibold">
                ● PROPOSED LAUNCH RATES (INR)
              </span>
              <span className="mono text-[10px] text-[var(--muted)]">
                Scope confirmed in formal written proposal
              </span>
            </div>
          </div>

          {/* Render each Package Group */}
          <div className="space-y-[clamp(40px,5vw,70px)]">
            {service.packageGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-[20px]">
                <div className="border-b border-[var(--line)] pb-[12px]">
                  <h3 className="font-semibold text-[20px] text-[var(--fg)]">
                    {group.groupTitle}
                  </h3>
                  {group.groupSubtitle && (
                    <p className="text-[13px] text-[var(--muted)] mt-[2px]">
                      {group.groupSubtitle}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
                  {group.packages.map((pkg) => (
                    <PricingCard
                      key={pkg.id}
                      pkg={pkg}
                      onSelect={() => handleSelectPackage(`${service.title} — ${pkg.name}`)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Specialist Services Table/Grid */}
          {service.specialistServices && service.specialistServices.length > 0 && (
            <div className="mt-[clamp(44px,6vw,80px)] rounded-[10px] border border-[var(--line)] bg-[var(--card)] p-[clamp(20px,3vw,36px)] shadow-sm">
              <div className="mb-[20px]">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-ink)] font-semibold block mb-[4px]">
                  Custom Scopes
                </span>
                <h3 className="font-semibold text-[20px] text-[var(--fg)]">
                  Specialist Services
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
                {service.specialistServices.map((spec, sIdx) => (
                  <div
                    key={sIdx}
                    className="flex flex-col justify-between rounded-[6px] border border-[var(--line)] bg-[var(--bg)] p-[16px]"
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-[10px] mb-[6px]">
                        <h4 className="font-semibold text-[15px] text-[var(--fg)]">
                          {spec.name}
                        </h4>
                        <span className="font-mono text-[13px] font-bold text-[var(--accent-ink)] whitespace-nowrap">
                          {spec.price}
                        </span>
                      </div>
                      {spec.description && (
                        <p className="text-[12px] text-[var(--muted)] leading-relaxed">
                          {spec.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleSelectPackage(`${service.title} — ${spec.name}`)}
                      className="mt-[14px] text-left font-mono text-[11px] text-[var(--fg)] hover:text-[var(--accent-ink)] font-semibold flex items-center gap-[4px]"
                    >
                      Enquire about this <span className="arw">→</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Care Plans / Maintenance */}
          {service.carePlans && service.carePlans.length > 0 && (
            <div className="mt-[clamp(36px,5vw,60px)] rounded-[10px] border border-[var(--line)] bg-[var(--bg-2)] p-[clamp(20px,3vw,36px)] shadow-sm">
              <div className="mb-[20px]">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-ink)] font-semibold block mb-[4px]">
                  Ongoing Reliability
                </span>
                <h3 className="font-semibold text-[20px] text-[var(--fg)]">
                  Maintenance & Care Plans
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[18px]">
                {service.carePlans.map((care, cIdx) => (
                  <div
                    key={cIdx}
                    className="rounded-[8px] border border-[var(--line)] bg-[var(--card)] p-[20px] flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-[10px] mb-[6px]">
                        <h4 className="font-semibold text-[17px] text-[var(--fg)]">
                          {care.name}
                        </h4>
                        <span className="font-mono text-[16px] font-bold text-[var(--fg)]">
                          {care.price}
                          <span className="text-[11px] text-[var(--muted)] font-normal"> /{care.unit}</span>
                        </span>
                      </div>
                      <p className="text-[12px] text-[var(--muted)] mb-[12px]">
                        {care.summary}
                      </p>
                      <ul className="space-y-[6px] border-t border-[var(--line)] pt-[10px]">
                        {care.features.map((feat, fIdx) => (
                          <li key={fIdx} className="text-[12px] text-[var(--fg)] flex items-start gap-[6px]">
                            <span className="text-[var(--accent-ink)] font-bold">✓</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleSelectPackage(`${service.title} Care Plan — ${care.name}`)}
                      className="btn btn-ghost mt-[16px] w-full justify-center text-[11px]"
                    >
                      Select Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add-ons List */}
          {service.addOns && service.addOns.length > 0 && (
            <div className="mt-[clamp(32px,4vw,50px)]">
              <div className="border-b border-[var(--line)] pb-[10px] mb-[16px]">
                <h3 className="font-semibold text-[17px] text-[var(--fg)]">
                  Available Add-Ons & Enhancements
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[10px]">
                {service.addOns.map((add, aIdx) => (
                  <div
                    key={aIdx}
                    className="flex items-center justify-between rounded-[6px] border border-[var(--line)] bg-[var(--card)] px-[16px] py-[12px]"
                  >
                    <span className="text-[13px] text-[var(--fg)] font-medium">
                      {add.name}
                    </span>
                    <span className="font-mono text-[12px] font-semibold text-[var(--accent-ink)] whitespace-nowrap ml-[8px]">
                      {add.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Disclaimers (Prompt Section 9) */}
          <div className="mt-[clamp(36px,5vw,56px)] rounded-[8px] border border-[var(--line)] bg-[var(--card)] p-[clamp(16px,2vw,24px)] text-[12px] text-[var(--muted)] space-y-[8px]">
            <p className="font-semibold text-[var(--fg)]">
              ● Specific Service Note:
            </p>
            <p className="leading-relaxed">
              {service.disclaimer}
            </p>
            <p className="pt-[6px] border-t border-[var(--line)] leading-relaxed">
              {STUDIO_INFO.generalDisclaimer}
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 6. CROSS-NAVIGATION TO OTHER SERVICES                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="w-full py-[clamp(44px,6vw,80px)] bg-[var(--bg-2)] border-b border-[var(--line)]">
        <div className="wrap">
          <div className="mb-[24px]">
            <span className="mono mono-a text-[10px] uppercase tracking-wider block mb-[4px]">
              Explore Other Capabilities
            </span>
            <h3 className="font-semibold text-[22px] text-[var(--fg)]">
              Other ARCHE Verticals
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
            {otherServices.map((other) => (
              <Link
                key={other.slug}
                to={`/services/${other.slug}`}
                className="group rounded-[8px] border border-[var(--line)] bg-[var(--card)] p-[20px] transition-all duration-300 hover:border-[var(--accent-deep)] hover:shadow-md"
                cursor="OPEN"
              >
                <div className="flex items-baseline justify-between mb-[8px]">
                  <span className="mono text-[10px] text-[var(--accent-ink)]">
                    VERTICAL {other.n}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--muted)]">
                    {other.startingPrice}
                  </span>
                </div>
                <h4 className="font-semibold text-[16px] text-[var(--fg)] group-hover:text-[var(--accent-ink)] transition-colors">
                  {other.title}
                </h4>
                <p className="text-[12px] text-[var(--muted)] mt-[6px] line-clamp-2">
                  {other.tagline}
                </p>
                <span className="mt-[14px] inline-flex items-center gap-[4px] font-mono text-[10px] text-[var(--fg)] group-hover:text-[var(--accent-ink)] font-semibold">
                  View vertical <span className="arw">→</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function PricingCard({
  pkg,
  onSelect,
}: {
  pkg: PackageItem;
  onSelect: () => void;
}) {
  return (
    <div
      className={`relative flex flex-col justify-between rounded-[10px] border p-[clamp(20px,2.4vw,32px)] transition-all duration-300 shadow-sm ${
        pkg.popular
          ? "border-[var(--accent-deep)] bg-[var(--card)] ring-1 ring-[var(--accent)]"
          : "border-[var(--line)] bg-[var(--card)] hover:border-[var(--line-strong,rgba(12,12,13,0.3))]"
      }`}
    >
      {pkg.popular && (
        <span className="absolute -top-[11px] left-[24px] rounded-full bg-[var(--accent)] px-[10px] py-[2px] font-mono text-[9px] font-bold text-[#0c0c0d] tracking-wider uppercase shadow-sm">
          Recommended
        </span>
      )}

      <div>
        {/* Tier Header */}
        <div className="flex items-baseline justify-between gap-[8px] mb-[4px]">
          <h4 className="font-bold text-[19px] text-[var(--fg)] tracking-tight">
            {pkg.name}
          </h4>
        </div>

        <p className="text-[13px] text-[var(--muted)] mb-[16px] min-h-[38px] leading-relaxed">
          {pkg.summary}
        </p>

        {/* Price Lockup */}
        <div className="border-y border-[var(--line)] py-[14px] mb-[18px]">
          <div className="flex items-baseline gap-[6px]">
            <span className="font-mono text-[clamp(26px,2.8vw,36px)] font-bold text-[var(--fg)] tracking-tight">
              {pkg.price}
            </span>
            <span className="font-mono text-[11px] text-[var(--muted)] uppercase tracking-wider">
              / {pkg.unit}
            </span>
          </div>
          <span className="font-mono text-[10px] text-[var(--muted)] mt-[2px] block">
            Excl. third-party subscriptions
          </span>
        </div>

        {/* Turnaround & Revisions Metadata */}
        {(pkg.turnaround || pkg.revisions) && (
          <div className="mb-[18px] grid grid-cols-1 gap-[6px] rounded-[6px] bg-[var(--bg)] p-[10px] font-mono text-[11px] text-[var(--fg)] border border-[var(--line)]">
            {pkg.turnaround && (
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)] text-[10px]">Turnaround:</span>
                <span className="font-semibold">{pkg.turnaround}</span>
              </div>
            )}
            {pkg.revisions && (
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)] text-[10px]">Revisions:</span>
                <span className="font-semibold">{pkg.revisions}</span>
              </div>
            )}
          </div>
        )}

        {/* Features Inclusions */}
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-ink)] font-semibold block mb-[10px]">
            Package Inclusions:
          </span>
          <ul className="space-y-[8px]">
            {pkg.features.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-[8px] text-[13px] text-[var(--fg)] leading-snug">
                <span className="text-[var(--accent-ink)] font-bold flex-shrink-0 mt-[1px]">
                  ✓
                </span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={onSelect}
        className={`btn mt-[24px] w-full justify-center ${
          pkg.popular ? "" : "btn-ghost"
        }`}
        data-cursor="START"
      >
        Request This Package <span className="arw">→</span>
      </button>
    </div>
  );
}
