/**
 * Arche content model. Everything the UI renders is data-driven so
 * services, projects and copy can evolve without rebuilding components.
 * Current commercial offering is deliberately limited to four services;
 * Other capabilities may expand later — never presented as current offerings.
 */

export type ServicePackage = {
  name: string;
  price: string;
  unit: string;
  includes: string[];
  deposit?: string;
};

export type Service = {
  slug: string;
  n: string;
  title: string;
  short: string;
  tagline: string;
  arc: [string, string, string]; // the transformation arc
  desc: string;
  problems: string[];
  offerings: { k: string; v: string }[];
  process: { k: string; v: string }[];
  deliverables: string[];
  turnaround: string;
  packages: ServicePackage[];
  seo: { title: string; desc: string };
};

export const services: Service[] = [
  {
    slug: "video-production",
    n: "01",
    title: "Video Production & Editing",
    short: "Video",
    tagline: "Every frame has a story. Let's make it worth watching.",
    arc: ["RAW", "DECISIONS", "CONTENT"],
    desc: "We transform raw footage and creative ideas into engaging visual experiences. From short-form social content to long-form storytelling, promotional videos and motion graphics, ARCHE helps brands and creators communicate their stories with clarity, creativity and impact.",
    problems: [
      "Hours of footage, no publishing rhythm",
      "Content that loses viewers in the first seconds",
      "Inconsistent pacing, grading and sound across posts",
      "Long-form assets never repurposed into short-form",
    ],
    offerings: [
      { k: "Short-form", v: "Reels, Shorts and TikTok edits cut for high retention." },
      { k: "Long-form", v: "YouTube videos, podcasts and talks with narrative structure." },
      { k: "Brand films", v: "Promotional and ad edits built for impact and conversion." },
      { k: "Motion graphics", v: "Titles, kinetic captions, grading and sound design." },
    ],
    process: [
      { k: "Ingest", v: "We review every frame of the raw material." },
      { k: "Select", v: "Usable footage is kept. The rest is deliberately rejected." },
      { k: "Assemble", v: "The sequence is built and tightened on the timeline." },
      { k: "Finish", v: "Grade, captions, sound design and multi-ratio delivery." },
    ],
    deliverables: [
      "High-retention 9:16 and 16:9 master video exports",
      "Styled kinetic captions, sound design and color grading",
      "Organized project files and source archive",
      "Dedicated revision rounds and transparent turnaround",
    ],
    turnaround: "Short-form: 3–5 working days. Long-form: 5–8 working days.",
    packages: [
      {
        name: "Short-Form Basic",
        price: "₹799",
        unit: "per video",
        includes: ["Up to 30s cut", "Clean cuts & pauses removed", "English captions", "Basic color & sound balancing"],
      },
      {
        name: "Short-Form Standard",
        price: "₹1,499",
        unit: "per video",
        includes: ["Up to 60s cut", "Hook-focused pacing", "Styled captions & B-roll overlays", "Sound design & 2 revisions"],
      },
    ],
    seo: {
      title: "Video Production & Editing — ARCHE CREATIVE STUDIOS",
      desc: "Editorial video editing and production for creators and brands: short-form reels, long-form YouTube, podcasts and promotional films.",
    },
  },
  {
    slug: "pitch-decks-storytelling",
    n: "02",
    title: "Pitch Decks & Storytelling",
    short: "Pitch Decks",
    tagline: "Don't just present an idea. Make people believe in it.",
    arc: ["IDEA", "STORY", "IMPACT"],
    desc: "We help founders, businesses, professionals and creators transform complex information into compelling presentations. Through structured storytelling, research, visual communication and purposeful slide design, we help every idea communicate its value with clarity and confidence.",
    problems: [
      "Decks packed with text that investors skip",
      "Weak narrative arc obscuring market opportunity",
      "Inconsistent typography and unpolished charts",
      "Hours lost fighting slide formatting tools",
    ],
    offerings: [
      { k: "Investor pitch decks", v: "Narrative architecture, market sizing and financial models." },
      { k: "Competition decks", v: "Hackathon and accelerator pitches designed for immediate impact." },
      { k: "Business proposals", v: "Sales decks and client proposals that close high-value deals." },
      { k: "Slide redesign", v: "Existing rough decks converted into modern, executive presentations." },
    ],
    process: [
      { k: "Discover", v: "Review idea, audience, traction and key presentation objectives." },
      { k: "Structure", v: "Map the narrative spine before touching visual slides." },
      { k: "Design", v: "Craft layouts, typography, bespoke diagrams and data visuals." },
      { k: "Refine", v: "Iterate feedback rounds and export presentation-ready files." },
    ],
    deliverables: [
      "Presentation-ready high-resolution PDF",
      "Fully editable PPTX file with source assets",
      "Bespoke data charts, diagrams and icon sets",
      "Executive deck summaries and script notes",
    ],
    turnaround: "Clear Deck: 3–4 days. Narrative Deck: 5–7 days. Full Deck: 7–10 days.",
    packages: [
      {
        name: "Clear Deck",
        price: "₹3,999",
        unit: "up to 8 slides",
        includes: ["Clean layouts & visual hierarchy", "Brand styling & icons", "Editable PPTX + PDF", "1 revision round"],
      },
      {
        name: "Narrative Pitch Deck",
        price: "₹7,999",
        unit: "up to 12 slides",
        includes: ["Storyline refinement", "Custom diagrams & charts", "Editable PPTX + PDF", "2 revision rounds"],
      },
    ],
    seo: {
      title: "Pitch Decks & Storytelling — ARCHE CREATIVE STUDIOS",
      desc: "Startup pitch decks, investor presentations and executive business proposals designed to communicate value with clarity and confidence.",
    },
  },
  {
    slug: "web-development",
    n: "03",
    title: "Web Development",
    short: "Web Dev",
    tagline: "Digital interfaces engineered for impact and performance.",
    arc: ["CONCEPT", "CODE", "EXPERIENCE"],
    desc: "We build websites that look exceptional, load fast and work seamlessly. From landing pages to complete business websites and creative portfolios, ARCHE designs and develops digital experiences that turn visitors into believers and customers.",
    problems: [
      "A website that looks fine but produces zero leads",
      "Cluttered page builder bloat slowing load times",
      "Broken mobile experiences losing phone traffic",
      "Templates that make high-value brands look generic",
    ],
    offerings: [
      { k: "Landing pages", v: "Single-purpose conversion pages engineered for campaigns." },
      { k: "Business websites", v: "Multi-page brand flagships built on modern tech stacks." },
      { k: "Portfolio sites", v: "Interactive showcases for creators, studios and executives." },
      { k: "Web applications", v: "Custom portals, dashboards and database-driven tools." },
    ],
    process: [
      { k: "Structure", v: "Information architecture before any visual design." },
      { k: "Design", v: "Responsive layouts, micro-interactions and design tokens." },
      { k: "Build", v: "Clean modern code with zero bloated frameworks." },
      { k: "Deploy", v: "Performance audit, analytics, launch and handover." },
    ],
    deliverables: [
      "Fully responsive production build with custom animations",
      "Lead generation forms, WhatsApp and email integrations",
      "SEO-ready meta structure and lightning fast load times",
      "Post-launch support window and clean code handover",
    ],
    turnaround: "Landing page: 4–6 days. Starter site: 7–10 days. Business site: 2–3 weeks.",
    packages: [
      {
        name: "Landing Page",
        price: "₹4,999",
        unit: "one page",
        includes: ["Single-page high conversion layout", "Mobile responsive & fast loading", "Lead form + WhatsApp CTA", "Basic SEO setup"],
      },
      {
        name: "Starter Business Site",
        price: "₹9,999",
        unit: "up to 4 pages",
        includes: ["Home, About, Services, Contact", "Branded visual design & animations", "Contact form & social integration", "2 revision rounds"],
      },
    ],
    seo: {
      title: "Web Development — ARCHE CREATIVE STUDIOS",
      desc: "Fast, responsive and conversion-focused websites: landing pages, business websites, portfolio sites and custom web applications.",
    },
  },
  {
    slug: "ai-solutions-automation",
    n: "04",
    title: "AI Solutions & Automation",
    short: "AI & Automation",
    tagline: "Intelligent systems that think, automate and accelerate.",
    arc: ["INPUT", "INTELLIGENCE", "OUTCOME"],
    desc: "We build practical AI systems and workflow automations that help businesses save time, respond faster and operate efficiently. From AI assistants to lead qualification bots and end-to-end process automation, ARCHE connects technology to everyday operations.",
    problems: [
      "Hours lost every day to manual copy-paste between tools",
      "Customer inquiries arriving after hours and going cold",
      "Scattered documents nobody on the team can search",
      "Repetitive workflows bottlenecking business growth",
    ],
    offerings: [
      { k: "AI Chatbots", v: "Website and WhatsApp assistants trained on your business data." },
      { k: "Workflow automation", v: "Multi-step operations running without human babysitting." },
      { k: "Lead pipelines", v: "Instant lead capture, enrichment, qualification and notifications." },
      { k: "Custom AI tools", v: "Document parsing, content generation and workflow integrations." },
    ],
    process: [
      { k: "Audit", v: "Map manual bottlenecks and identify high-ROI opportunities." },
      { k: "Architect", v: "Design the automated data pipeline with fallbacks." },
      { k: "Implement", v: "Build, configure API keys and test with real company data." },
      { k: "Deploy", v: "Live testing, team walkthrough and continuous monitoring." },
    ],
    deliverables: [
      "Trained and deployed AI chatbot or workflow pipeline",
      "Complete platform setup (Make / Zapier / n8n / APIs)",
      "Automated lead capture, email & WhatsApp alerts",
      "Step-by-step documentation and team handover walkthrough",
    ],
    turnaround: "Basic assistant: 4–6 days. Workflow: 5–7 days. Advanced: 10–14 days.",
    packages: [
      {
        name: "Basic Website Assistant",
        price: "₹5,999",
        unit: "one assistant",
        includes: ["FAQ assistant grounded on business data", "Website embed widget", "Lead capture with email alerts", "Platform setup & handover"],
      },
      {
        name: "Workflow Pipeline",
        price: "₹8,999",
        unit: "up to 3 workflows",
        includes: ["Lead capture to Google Sheets / CRM", "Auto confirmation & notifications", "Multi-app integration", "Testing & documentation"],
      },
    ],
    seo: {
      title: "AI Solutions & Automation — ARCHE CREATIVE STUDIOS",
      desc: "Practical AI chatbots, lead capture pipelines and workflow automation designed to save time, reduce repetition and scale operations.",
    },
  },
];

export const siteContent = {
  brand: {
    name: "ARCHE CREATIVE STUDIOS",
    line: "TECHNOLOGY MEETS CREATIVITY",
    discipline: "Video Production · Pitch Decks · Web Development · AI Solutions",
  },

  nav: {
    links: [
      { label: "Work", to: "/work" },
      { label: "Services", to: "/services" },
      { label: "Pricing", to: "/pricing" },
    ],
    cta: { label: "Start a Project", to: "/contact" },
  },

  hero: {
    kicker: "Creative Technology Studio",
    statement: "Where technology meets creativity to deliver real impact.",
    sub: "ARCHE CREATIVE STUDIOS combines video production, pitch deck storytelling, bespoke web development, and intelligent AI automation to help founders and brands scale.",
    ctaPrimary: { label: "Start a Project", to: "/contact" },
    ctaSecondary: { label: "Explore Services", to: "/services" },
  },

  whatWeDo: {
    label: "The proposition",
    lineA: "Ideas deserve more than execution.",
    lineB: "They deserve impact.",
    body: "From intelligent automation and digital development to visual storytelling and powerful presentations, ARCHE CREATIVE STUDIOS brings technology and creativity together to help businesses transform ideas into meaningful outcomes.",
  },

  servicesIntro: {
    label: "Services",
    statement: "Four dedicated verticals built for results.",
    body: "Video production, pitch deck storytelling, custom web development and practical AI solutions. Each vertical is engineered to the highest standard.",
  },

  process: {
    label: "How we work",
    statement: "From first conversation to a system that keeps improving.",
    steps: [
      { n: "01", k: "Discover", v: "Understand the business and where work is lost." },
      { n: "02", k: "Design", v: "Map the system before anything is built." },
      { n: "03", k: "Build", v: "Production-grade implementation, no shortcuts." },
      { n: "04", k: "Connect", v: "Join the new piece to the tools you already run — so nothing is orphaned." },
      { n: "05", k: "Launch", v: "Ship, measure, verify against real usage." },
      { n: "06", k: "Evolve", v: "Improve continuously as the business changes." },
    ],
  },

  faq: {
    label: "FAQ",
    statement: "Working with ARCHE CREATIVE STUDIOS.",
    items: [
      {
        q: "What does ARCHE CREATIVE STUDIOS do?",
        a: "We are a creative technology studio providing Video Production & Editing, Pitch Decks & Storytelling, Web Development, and AI Solutions & Automation.",
      },
      {
        q: "Which services are currently available?",
        a: "Exactly four: Video Production & Editing, Pitch Decks & Storytelling, Web Development, and AI Solutions & Automation.",
      },
      {
        q: "Can I hire ARCHE for only one service?",
        a: "Yes. Most clients start with a single project — such as a video package, pitch deck, website, or AI assistant — and expand as needed.",
      },
      {
        q: "Who do you work with?",
        a: "Founders, growing startups, creators, professionals, and companies who want high-quality creative and technical execution with transparent turnaround.",
      },
      {
        q: "Can you work with our existing tools?",
        a: "Yes. In web development and AI automation, we integrate with your existing CRMs, forms, spreadsheets, inboxes, and cloud infrastructure.",
      },
      {
        q: "How is pricing determined?",
        a: "We offer transparent fixed package pricing starting at ₹799 for Video Editing, ₹3,999 for Pitch Decks, ₹7,999 for Web Development, and ₹5,999 for AI Automations, with clearly defined deliverables, turnarounds, and custom enterprise quotes.",
      },
      {
        q: "How long does a project take?",
        a: "Reels and short edits take 3–5 working days. Pitch decks take 3–7 working days. Websites take 1–3 weeks. AI workflows take 1–2 weeks.",
      },
      {
        q: "What happens after I submit an inquiry?",
        a: "We review your inquiry and respond within one working day via Email or WhatsApp to confirm your scope, timeline, and next steps.",
      },
      {
        q: "Do you provide support after launch?",
        a: "Yes. Every website and AI project includes post-launch support and documentation, with ongoing monthly care plans available.",
      },
    ],
  },

  contact: {
    label: "Start a project",
    closing: "Ideas deserve impact. Let's build yours.",
    desc: "Tell us about your project, timeline and requirements. We'll respond within one working day.",
    email: "archecreativestudios@gmail.com",
    phone: "+91 7995937536",
    budgets: ["< ₹10,000", "₹10,000 – ₹25,000", "₹25,000 – ₹50,000", "₹50,000 +", "Custom quote"],
    timelines: ["Immediate (Priority)", "Within 1–2 weeks", "This month", "Planning phase"],
    channels: ["Email", "WhatsApp", "Phone Call"],
  },

  footer: {
    cols: [
      { t: "Studio", l: [{ label: "Work", to: "/work" }, { label: "Services", to: "/services" }, { label: "Pricing", to: "/pricing" }, { label: "Contact", to: "/contact" }] },
      {
        t: "Services",
        l: [
          { label: "Video Production & Editing", to: "/services/video-production" },
          { label: "Pitch Decks & Storytelling", to: "/services/pitch-decks-storytelling" },
          { label: "Web Development", to: "/services/web-development" },
          { label: "AI Solutions & Automation", to: "/services/ai-solutions-automation" },
        ],
      },
    ],
    social: [
      { label: "Instagram", href: "https://www.instagram.com/archecreativestudios/" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/arche-creative-studios/" },
    ],
    legal: "© 2026 ARCHE CREATIVE STUDIOS. All rights reserved.",
    note: "Technology Meets Creativity · Hyderabad, India",
  },
};
