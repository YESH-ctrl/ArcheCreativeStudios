import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "../lib/gsap";
import { getLenis } from "../motion/SmoothScroll";

export const INTRO_KEY = "arche_intro";

/** Evaluated dynamically — before the intro marks the session as booted. */
export const isIntroActive = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return !sessionStorage.getItem(INTRO_KEY);
  } catch {
    return false;
  }
};

/**
 * Arche branded intro (once per browser session) — Total about 2.9s.
 * 
 * - t0.0: lock scroll, set loading class on root, wait for document.fonts.ready (1.2s max)
 * - Monogram animation order (strict sequence):
 *     1. A appears first (t0.0 -> t0.45) via left-to-right reveal
 *     2. C appears second (t0.48 -> t0.88) after A is established, sweeping in
 *     3. Central lime dot appears last (t0.90 -> t1.10) after C is complete
 * - t0.95 to 1.45: wordmark "Arche" rises letter by letter from masks
 * - t1.15 to 1.35: accent square settles
 * - t1.65 to 1.95: logo group moves up 24px and fades out
 * - t1.9 to 2.9: ARCH APERTURE (page reveal)
 * - t2.2: Hero reveal starts (event: arche:hero-reveal-start)
 * - t2.4: Nav fades in (event: arche:nav-reveal-start)
 */
export function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const logoGroup = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(() => isIntroActive());

  useEffect(() => {
    if (!visible) {
      document.documentElement.classList.remove("arche-intro-loading");
      document.body.classList.remove("arche-intro-loading");
      window.dispatchEvent(new CustomEvent("arche:hero-reveal-start", { detail: { isIntroMode: false } }));
      window.dispatchEvent(new CustomEvent("arche:nav-reveal-start"));
      window.dispatchEvent(new CustomEvent("arche:intro-done"));
      return;
    }

    // Set loading class on root to keep page background ink and page content hidden
    document.documentElement.classList.add("arche-intro-loading");
    document.body.classList.add("arche-intro-loading");

    // Lock scroll with Lenis
    const lockScroll = () => {
      const lenis = getLenis();
      if (lenis) {
        lenis.stop();
      } else {
        setTimeout(() => getLenis()?.stop(), 60);
      }
    };
    lockScroll();

    let cancelled = false;
    let completed = false;
    let tl: gsap.core.Timeline | null = null;

    // Wait for document.fonts.ready with a 1.2s timeout
    const fontsReady = Promise.race([
      typeof document !== "undefined" && document.fonts ? document.fonts.ready : Promise.resolve(),
      new Promise((res) => setTimeout(res, 1200)),
    ]);

    fontsReady.then(() => {
      if (cancelled) return;

      const heroWrapper = document.getElementById("hero-aperture-wrap") || document.getElementById("hero");
      const aperture = { w: 0, h: 0 };

      const updateAperture = () => {
        if (!heroWrapper) return;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const curW = aperture.w;
        const curH = aperture.h;
        const topInset = Math.max(0, H - curH);
        const sideInset = Math.max(0, (W - curW) / 2);
        const threshold = 0.6 * W;
        let r = 0;
        if (curW < threshold) {
          r = curW / 2;
        } else {
          const maxR = threshold / 2;
          const p = Math.min(1, Math.max(0, (curW - threshold) / (W - threshold || 1)));
          r = maxR * (1 - p);
        }
        heroWrapper.style.clipPath = `inset(${topInset.toFixed(1)}px ${sideInset.toFixed(1)}px 0px ${sideInset.toFixed(1)}px round ${r.toFixed(1)}px ${r.toFixed(1)}px 0px 0px)`;
      };

      if (heroWrapper) {
        heroWrapper.style.willChange = "clip-path";
        updateAperture();
      }

      const prefersReduced = prefersReducedMotion();

      tl = gsap.timeline({
        defaults: { ease: "none" },
      });
      if (typeof window !== "undefined") {
        (window as any).__archeIntroTl = tl;
      }

      if (prefersReduced) {
        // Reduced motion: show complete static logo immediately without animation delay
        gsap.set(".intro-layer-full", { opacity: 1 });
        gsap.set(".intro-layer-a", { opacity: 0 });
        gsap.set(".intro-layer-c", { opacity: 0 });
        gsap.set(".intro-char", { yPercent: 0 });
        gsap.set(dotRef.current, { y: 0, opacity: 1, scale: 1 });
        gsap.set(logoGroup.current, { y: 0, opacity: 1 });

        tl.to(
          logoGroup.current,
          {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
          },
          0.6
        );

        tl.to(
          aperture,
          {
            w: () => window.innerWidth,
            h: () => window.innerHeight,
            duration: 0.8,
            ease: "power2.inOut",
            onUpdate: updateAperture,
            onComplete: () => {
              completed = true;
              if (heroWrapper) {
                heroWrapper.style.clipPath = "";
                heroWrapper.style.removeProperty("clip-path");
                heroWrapper.style.willChange = "";
              }
              document.documentElement.classList.remove("arche-intro-loading");
              document.body.classList.remove("arche-intro-loading");
              getLenis()?.start();
              try {
                sessionStorage.setItem(INTRO_KEY, "1");
                sessionStorage.setItem("arche:booted", "1");
              } catch {}
              window.dispatchEvent(new CustomEvent("arche:intro-done"));
              setVisible(false);
            },
          },
          0.7
        );

        tl.add(() => {
          window.dispatchEvent(new CustomEvent("arche:hero-reveal-start", { detail: { isIntroMode: true } }));
        }, 0.9);

        tl.add(() => {
          window.dispatchEvent(new CustomEvent("arche:nav-reveal-start"));
        }, 1.1);

        return;
      }

      // Initial states for sequential reveal of A and C
      gsap.set(".intro-layer-a", { opacity: 0, clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" });
      gsap.set(".intro-layer-c", { opacity: 0, clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)" });
      gsap.set(".intro-layer-full", { opacity: 0 });
      gsap.set(dotRef.current, { y: -100, opacity: 0, scale: 1 });
      gsap.set(".intro-char", { yPercent: 120 });
      gsap.set(logoGroup.current, { y: 0, opacity: 1 });

      // Step 1: t0.0 to 0.45 — Reveal A smoothly first (wipe left-to-right across A)
      tl.to(
        ".intro-layer-a",
        {
          opacity: 1,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.45,
          ease: "power2.out",
        },
        0.0
      );

      // Step 2: t0.45 to 0.85 — Once A is established, reveal C smoothly
      tl.to(
        ".intro-layer-c",
        {
          opacity: 1,
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 0.40,
          ease: "power2.out",
        },
        0.45
      );

      // Step 3: at t0.85, reveal complete full monogram
      tl.to(
        ".intro-layer-full",
        {
          opacity: 1,
          duration: 0.05,
        },
        0.85
      );

      // Step 4: t0.88 to 1.40: wordmark "Arche Creative Studios" rises letter by letter from masks
      tl.fromTo(
        ".intro-char",
        {
          yPercent: 120,
        },
        {
          yPercent: 0,
          duration: 0.38,
          stagger: 0.022,
          ease: "expo.out",
        },
        0.88
      );

      // Step 5: t1.15 to 1.40: trailing wordmark accent square settles beside wordmark
      tl.to(
        dotRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.35,
          ease: "back.out(1.6)",
        },
        1.15
      );

      // Step 6: t1.65 to 1.95: logo group moves up 24px and fades out
      tl.to(
        logoGroup.current,
        {
          y: -24,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        },
        1.65
      );

      // t1.9 to 2.9: ARCH APERTURE
      tl.to(
        aperture,
        {
          w: () => window.innerWidth,
          h: () => window.innerHeight,
          duration: 1.0,
          ease: "power4.inOut",
          onUpdate: updateAperture,
          onComplete: () => {
            completed = true;
            if (heroWrapper) {
              heroWrapper.style.clipPath = "";
              heroWrapper.style.removeProperty("clip-path");
              heroWrapper.style.willChange = "";
            }
            document.documentElement.classList.remove("arche-intro-loading");
            document.body.classList.remove("arche-intro-loading");
            getLenis()?.start();
            try {
              sessionStorage.setItem(INTRO_KEY, "1");
              sessionStorage.setItem("arche:booted", "1");
            } catch {}
            window.dispatchEvent(new CustomEvent("arche:intro-done"));
            setVisible(false);
          },
        },
        1.9
      );

      // t2.2: Hero reveal starts during aperture
      tl.add(() => {
        window.dispatchEvent(new CustomEvent("arche:hero-reveal-start", { detail: { isIntroMode: true } }));
      }, 2.2);

      // t2.4: Nav fades in
      tl.add(() => {
        window.dispatchEvent(new CustomEvent("arche:nav-reveal-start"));
      }, 2.4);
    });

    return () => {
      cancelled = true;
      if (!completed) {
        tl?.kill();
        const heroWrapper = document.getElementById("hero-aperture-wrap") || document.getElementById("hero");
        if (heroWrapper) {
          heroWrapper.style.clipPath = "";
          heroWrapper.style.removeProperty("clip-path");
          heroWrapper.style.willChange = "";
        }
      }
      document.documentElement.classList.remove("arche-intro-loading");
      document.body.classList.remove("arche-intro-loading");
      getLenis()?.start();
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[10000] grid place-items-center overflow-hidden pointer-events-none"
      style={{
        background: "transparent",
        color: "var(--solid-fg)",
      }}
      aria-hidden="true"
    >
      <div
        ref={logoGroup}
        className="relative flex items-center justify-center gap-[clamp(10px,2vw,18px)] select-none px-4"
        style={{ transformOrigin: "50% 50%" }}
      >
        {/* Exact AC Monogram from updated source artwork with sequential reveal */}
        <div
          className="intro-ac-monogram relative select-none flex-shrink-0"
          style={{
            height: "clamp(48px, 6vw, 76px)",
            width: "calc(clamp(48px, 6vw, 76px) * (310 / 234))",
          }}
        >
          {/* Layer 1: Monogram A */}
          <img
            src="/arche-logo-a.png"
            alt="Arche Logo A"
            className="intro-layer-a absolute inset-0 w-full h-full object-contain pointer-events-none"
          />

          {/* Layer 2: Monogram C */}
          <img
            src="/arche-logo-c.png"
            alt="Arche Logo C"
            className="intro-layer-c absolute inset-0 w-full h-full object-contain pointer-events-none"
          />

          {/* Layer 3: Complete Monogram */}
          <img
            src="/arche%20logo.jpeg"
            alt="Arche Logo"
            className="intro-layer-full absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{ opacity: prefersReducedMotion() ? 1 : 0 }}
          />
        </div>

        {/* Wordmark "Arche Creative Studios" and falling lime dot */}
        <div className="flex items-baseline gap-[clamp(6px,1.2vw,12px)]">
          <span
            className="inline-flex items-baseline"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(24px, 4.2vw, 56px)",
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1,
              color: "var(--solid-fg)",
              whiteSpace: "nowrap",
            }}
          >
            {"Arche Creative Studios".split("").map((char, i) => (
              <span key={i} className="inline-block overflow-hidden" style={{ verticalAlign: "bottom" }}>
                <span className="intro-char inline-block">
                  {char === " " ? "\u00A0" : char}
                </span>
              </span>
            ))}
          </span>

          {/* Lime dot falling from above beside wordmark */}
          <span
            ref={dotRef}
            className="intro-dot inline-block flex-shrink-0"
            style={{
              width: "clamp(6px, 0.9vw, 10px)",
              height: "clamp(6px, 0.9vw, 10px)",
              background: "var(--accent)",
              alignSelf: "flex-start",
              marginTop: "clamp(4px, 0.7vw, 8px)",
              transformOrigin: "50% 100%",
              opacity: 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}