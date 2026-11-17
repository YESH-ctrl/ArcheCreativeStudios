import { useState, useEffect, type FormEvent } from "react";
import { STUDIO_INFO } from "../data/services";
import { submitContactEnquiry, mailtoFallbackUrl, type ContactFormPayload } from "../lib/inquiries";
import { usePage } from "../lib/router";
import { useReveal } from "../lib/reveal";

const SERVICE_OPTIONS = [
  "Video Production & Editing",
  "Pitch Decks & Storytelling",
  "Web Development",
  "AI Solutions & Automation",
  "Multiple Services",
  "Not Sure Yet",
];

export function ContactPage() {
  usePage("Contact | ARCHE Creative Studios");
  useReveal();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [projectDetails, setProjectDetails] = useState("");
  const [honey, setHoney] = useState("");

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    service: false,
    projectDetails: false,
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "unconfigured">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Check for prefill from service pages
  useEffect(() => {
    try {
      const prefillRaw = sessionStorage.getItem("arche:prefill");
      if (prefillRaw) {
        const data = JSON.parse(prefillRaw);
        if (data.service) {
          const match = SERVICE_OPTIONS.find((opt) =>
            opt.toLowerCase().includes(data.service.toLowerCase())
          );
          if (match) setService(match);
        }
        if (data.package) {
          setProjectDetails(`I am interested in: ${data.package}\n\n`);
        }
        sessionStorage.removeItem("arche:prefill");
      }
    } catch {
      /* ignore */
    }
  }, []);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isNameValid = name.trim().length > 1;
  const isServiceValid = service.length > 0;
  const isDetailsValid = projectDetails.trim().length > 4;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Honeypot check
    if (honey) {
      setStatus("success");
      return;
    }

    setTouched({
      name: true,
      email: true,
      service: true,
      projectDetails: true,
    });

    if (!isNameValid || !isEmailValid || !isServiceValid || !isDetailsValid) {
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    const payload: ContactFormPayload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      service,
      projectDetails: projectDetails.trim(),
    };

    const res = await submitContactEnquiry(payload);

    if (res.ok) {
      setStatus("success");
    } else if (res.reason === "unconfigured") {
      // Direct mailto fallback if backend key is not yet set
      setStatus("unconfigured");
    } else {
      setStatus("error");
      setErrorMessage(
        res.reason === "network"
          ? "Network connectivity issue. Please click below to send via your email client or try again."
          : "Enquiry submission was rejected. Please contact us directly via email or phone."
      );
    }
  };

  const payloadForMailto: ContactFormPayload = {
    name,
    email,
    phone,
    service: service || "General Enquiry",
    projectDetails: projectDetails || "Let's discuss my project.",
  };

  return (
    <div className="w-full pt-[130px] pb-[clamp(60px,8vw,110px)] bg-[var(--bg)] min-h-[85vh]">
      <div className="wrap">
        {/* Header */}
        <div className="max-w-[760px] mb-[clamp(32px,4vw,56px)]">
          <div className="flex items-center gap-[8px] mb-[12px]">
            <span className="h-[6px] w-[6px] rounded-full bg-[var(--accent)]" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-[var(--accent-ink)] font-semibold">
              ARCHE // START A CONVERSATION
            </span>
          </div>

          <h1 className="d1 text-[clamp(36px,5.2vw,78px)]" data-r="mask">
            Have an Idea? Let's Build It Together.
          </h1>

          <p className="body mt-[18px] text-[var(--muted)] text-[clamp(16px,1.5vw,19px)] leading-relaxed" data-r="meta">
            Tell us a little about your project. Our team will understand your requirements and get in touch to discuss the right solution for your business.
          </p>
        </div>

        {/* Form and Contact Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[clamp(32px,5vw,64px)] items-start">
          {/* Main Contact Form Container */}
          <div className="lg:col-span-8 rounded-[12px] border border-[var(--line)] bg-[var(--card)] p-[clamp(24px,3.8vw,48px)] shadow-sm">
            {status === "success" ? (
              <div className="py-[32px] text-left space-y-[18px]" role="alert">
                <div className="inline-flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[rgba(200,241,79,0.2)] text-[var(--accent-ink)] font-bold text-[20px]">
                  ✓
                </div>
                <h2 className="text-[26px] font-bold text-[var(--fg)] tracking-tight">
                  Enquiry Received
                </h2>
                <p className="text-[16px] text-[var(--fg)] max-w-[54ch] leading-relaxed">
                  Thank you for reaching out to ARCHE! Your project enquiry has been received. Our team will get in touch with you shortly.
                </p>
                <div className="pt-[16px] border-t border-[var(--line)]">
                  <button
                    onClick={() => {
                      setStatus("idle");
                      setName("");
                      setEmail("");
                      setPhone("");
                      setService("");
                      setProjectDetails("");
                      setTouched({ name: false, email: false, service: false, projectDetails: false });
                    }}
                    className="btn btn-ghost text-[11px]"
                  >
                    Send Another Message <span className="arw">→</span>
                  </button>
                </div>
              </div>
            ) : status === "unconfigured" ? (
              <div className="py-[24px] space-y-[16px]" role="alert">
                <div className="inline-flex items-center gap-[8px] text-[var(--accent-ink)] font-mono text-[12px] font-semibold">
                  <span>●</span> DIRECT EMAIL READY
                </div>
                <h3 className="text-[22px] font-bold text-[var(--fg)]">
                  Your details are ready to send directly
                </h3>
                <p className="text-[14px] text-[var(--muted)] leading-relaxed">
                  Click the button below to open your preferred email client with all your project details pre-filled directly to <strong>{STUDIO_INFO.email}</strong>.
                </p>
                <div className="flex flex-wrap items-center gap-[12px] pt-[10px]">
                  <a
                    href={mailtoFallbackUrl(payloadForMailto)}
                    className="btn"
                  >
                    Open in Email Client <span className="arw">→</span>
                  </a>
                  <button
                    onClick={() => setStatus("idle")}
                    className="btn btn-ghost text-[11px]"
                  >
                    Edit Form
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-[22px]">
                {/* Honeypot field for anti-spam */}
                <input
                  type="text"
                  name="_gotcha"
                  value={honey}
                  onChange={(e) => setHoney(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  style={{ display: "none" }}
                  aria-hidden="true"
                />

                {status === "error" && (
                  <div className="rounded-[6px] border border-[#ff5c5c]/30 bg-[#ff5c5c]/10 p-[14px] text-[13px] text-[#ff5c5c]" role="alert">
                    <p className="font-semibold mb-[6px]">{errorMessage}</p>
                    <a
                      href={mailtoFallbackUrl(payloadForMailto)}
                      className="underline font-mono text-[12px]"
                    >
                      Click here to send directly via email client →
                    </a>
                  </div>
                )}

                {/* Grid: Name & Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
                  {/* Full Name */}
                  <div className="space-y-[6px]">
                    <label htmlFor="contact-name" className="block font-mono text-[11px] uppercase tracking-wider text-[var(--fg)] font-semibold">
                      Full Name <span className="text-[var(--accent-ink)]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="e.g. Yeswanth Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                      className={`w-full rounded-[6px] border bg-[var(--bg)] px-[14px] py-[11px] text-[14px] text-[var(--fg)] placeholder-[var(--muted)]/50 focus:outline-none focus:ring-1 ${
                        touched.name && !isNameValid
                          ? "border-[#ff5c5c] focus:ring-[#ff5c5c]"
                          : "border-[var(--line)] focus:border-[var(--accent-deep)] focus:ring-[var(--accent)]"
                      }`}
                    />
                    {touched.name && !isNameValid && (
                      <span className="font-mono text-[10px] text-[#ff5c5c] block">
                        Please enter your full name.
                      </span>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="space-y-[6px]">
                    <label htmlFor="contact-email" className="block font-mono text-[11px] uppercase tracking-wider text-[var(--fg)] font-semibold">
                      Email Address <span className="text-[var(--accent-ink)]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="e.g. name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                      className={`w-full rounded-[6px] border bg-[var(--bg)] px-[14px] py-[11px] text-[14px] text-[var(--fg)] placeholder-[var(--muted)]/50 focus:outline-none focus:ring-1 ${
                        touched.email && !isEmailValid
                          ? "border-[#ff5c5c] focus:ring-[#ff5c5c]"
                          : "border-[var(--line)] focus:border-[var(--accent-deep)] focus:ring-[var(--accent)]"
                      }`}
                    />
                    {touched.email && !isEmailValid && (
                      <span className="font-mono text-[10px] text-[#ff5c5c] block">
                        Please enter a valid email address.
                      </span>
                    )}
                  </div>
                </div>

                {/* Grid: Phone / WhatsApp & Service Interested In */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
                  {/* Phone / WhatsApp (Optional) */}
                  <div className="space-y-[6px]">
                    <label htmlFor="contact-phone" className="block font-mono text-[11px] uppercase tracking-wider text-[var(--fg)] font-semibold">
                      Phone / WhatsApp Number <span className="text-[var(--muted)] text-[10px] lowercase font-normal">(optional)</span>
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-[6px] border border-[var(--line)] bg-[var(--bg)] px-[14px] py-[11px] text-[14px] text-[var(--fg)] placeholder-[var(--muted)]/50 focus:border-[var(--accent-deep)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    />
                  </div>

                  {/* Service Interested In */}
                  <div className="space-y-[6px]">
                    <label htmlFor="contact-service" className="block font-mono text-[11px] uppercase tracking-wider text-[var(--fg)] font-semibold">
                      Service Interested In <span className="text-[var(--accent-ink)]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="contact-service"
                        required
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        onBlur={() => setTouched((p) => ({ ...p, service: true }))}
                        className={`w-full rounded-[6px] border bg-[var(--bg)] px-[14px] py-[11px] text-[14px] text-[var(--fg)] focus:outline-none focus:ring-1 appearance-none cursor-pointer ${
                          touched.service && !isServiceValid
                            ? "border-[#ff5c5c] focus:ring-[#ff5c5c]"
                            : "border-[var(--line)] focus:border-[var(--accent-deep)] focus:ring-[var(--accent)]"
                        }`}
                      >
                        <option value="" disabled>Select a vertical…</option>
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      {/* Dropdown caret */}
                      <span className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 font-mono text-[11px] text-[var(--muted)]">
                        ▼
                      </span>
                    </div>
                    {touched.service && !isServiceValid && (
                      <span className="font-mono text-[10px] text-[#ff5c5c] block">
                        Please choose a service.
                      </span>
                    )}
                  </div>
                </div>

                {/* Tell Us About Your Project */}
                <div className="space-y-[6px]">
                  <label htmlFor="contact-details" className="block font-mono text-[11px] uppercase tracking-wider text-[var(--fg)] font-semibold">
                    Tell Us About Your Project <span className="text-[var(--accent-ink)]">*</span>
                  </label>
                  <textarea
                    id="contact-details"
                    required
                    rows={5}
                    placeholder="Describe your goals, requirements, desired timeline, or reference ideas…"
                    value={projectDetails}
                    onChange={(e) => setProjectDetails(e.target.value)}
                    onBlur={() => setTouched((p) => ({ ...p, projectDetails: true }))}
                    className={`w-full rounded-[6px] border bg-[var(--bg)] p-[14px] text-[14px] text-[var(--fg)] placeholder-[var(--muted)]/50 focus:outline-none focus:ring-1 leading-relaxed ${
                      touched.projectDetails && !isDetailsValid
                        ? "border-[#ff5c5c] focus:ring-[#ff5c5c]"
                        : "border-[var(--line)] focus:border-[var(--accent-deep)] focus:ring-[var(--accent)]"
                    }`}
                  />
                  {touched.projectDetails && !isDetailsValid && (
                    <span className="font-mono text-[10px] text-[#ff5c5c] block">
                      Please provide a brief description of your project.
                    </span>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-[10px] flex flex-wrap items-center justify-between gap-[16px]">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="btn"
                    data-cursor="SEND"
                  >
                    {status === "submitting" ? (
                      <>
                        <span className="inline-block h-[10px] w-[10px] animate-spin rounded-full border-2 border-t-transparent border-[var(--bg)]" />
                        <span>Sending Enquiry…</span>
                      </>
                    ) : (
                      <>
                        Send Project Enquiry <span className="arw">→</span>
                      </>
                    )}
                  </button>

                  <span className="font-mono text-[10px] text-[var(--muted)]">
                    Direct reply within 1 business day
                  </span>
                </div>
              </form>
            )}
          </div>

          {/* Direct Studio Information & Contact Details Column */}
          <div className="lg:col-span-4 space-y-[24px]">
            <div className="rounded-[12px] border border-[var(--line)] bg-[var(--card)] p-[clamp(20px,2.5vw,32px)] shadow-sm space-y-[20px]">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-ink)] font-semibold block mb-[4px]">
                  Direct Contact
                </span>
                <h3 className="font-bold text-[20px] text-[var(--fg)]">
                  ARCHE CREATIVE STUDIOS
                </h3>
                <p className="font-mono text-[10px] text-[var(--muted)] mt-[2px] tracking-wider uppercase">
                  {STUDIO_INFO.tagline}
                </p>
              </div>

              {/* Email */}
              <div className="border-t border-[var(--line)] pt-[16px] space-y-[4px]">
                <span className="font-mono text-[10px] text-[var(--muted)] uppercase block">
                  Studio Inquiries
                </span>
                <a
                  href={`mailto:${STUDIO_INFO.email}`}
                  className="font-medium text-[15px] text-[var(--fg)] hover:text-[var(--accent-ink)] transition-colors lnk break-all"
                >
                  {STUDIO_INFO.email}
                </a>
              </div>

              {/* Phone */}
              <div className="border-t border-[var(--line)] pt-[16px] space-y-[4px]">
                <span className="font-mono text-[10px] text-[var(--muted)] uppercase block">
                  Phone / WhatsApp
                </span>
                <a
                  href={STUDIO_INFO.phoneHref}
                  className="font-medium text-[15px] text-[var(--fg)] hover:text-[var(--accent-ink)] transition-colors lnk"
                >
                  {STUDIO_INFO.phone}
                </a>
              </div>

              {/* Website */}
              <div className="border-t border-[var(--line)] pt-[16px] space-y-[4px]">
                <span className="font-mono text-[10px] text-[var(--muted)] uppercase block">
                  Official Website
                </span>
                <a
                  href={STUDIO_INFO.websiteHref}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[15px] text-[var(--fg)] hover:text-[var(--accent-ink)] transition-colors lnk"
                >
                  {STUDIO_INFO.websiteUrl}
                </a>
              </div>
            </div>

            {/* Turnaround notice card */}
            <div className="rounded-[10px] border border-[var(--line)] bg-[var(--bg-2)] p-[20px] space-y-[8px]">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent-ink)] font-semibold block">
                ● Engagement Standards
              </span>
              <p className="text-[12px] text-[var(--muted)] leading-relaxed">
                All client proposals include defined turnaround dates, revision milestones, and transparent scope boundaries in writing before work begins.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
