import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

// ─── Icons ────────────────────────────────────────────────────────────────────

function SpreadsheetIcon(): React.ReactElement {
  return (
    <svg width="25" height="23" viewBox="0 0 25 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.9" y="0.9" width="23.2" height="21.2" rx="2.1" stroke="black" strokeWidth="1.8" />
      <line x1="0.9" y1="7.5" x2="24.1" y2="7.5" stroke="black" strokeWidth="1.8" />
      <line x1="8.5" y1="7.5" x2="8.5" y2="22.1" stroke="black" strokeWidth="1.8" />
      <line x1="16.5" y1="7.5" x2="16.5" y2="22.1" stroke="black" strokeWidth="1.8" />
    </svg>
  );
}

function GridIcon(): React.ReactElement {
  return (
    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="10" height="10" rx="1" fill="black" />
      <rect x="13" y="0" width="10" height="10" rx="1" fill="black" />
      <rect x="0" y="13" width="10" height="10" rx="1" fill="black" />
      <rect x="13" y="13" width="10" height="10" rx="1" fill="black" />
    </svg>
  );
}

function RadarIcon(): React.ReactElement {
  return (
    <svg width="24" height="25" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="13.5" cy="13.5" r="12" stroke="black" strokeWidth="2" />
      <circle cx="13.5" cy="13.5" r="5.5" stroke="black" strokeWidth="2" />
      <circle cx="13.5" cy="13.5" r="2" fill="black" />
    </svg>
  );
}

function GreenCheckIcon(): React.ReactElement {
  return (
    <div className="w-5 h-5 rounded-full bg-[#16A34A] flex items-center justify-center flex-shrink-0">
      <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function GreenArrowIcon(): React.ReactElement {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 10L10 2M10 2H4M10 2V8" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Mock UI Cards ─────────────────────────────────────────────────────────────

function AutomatedDDCard(): React.ReactElement {
  return (
    <div className="relative w-full h-[600px] bg-[#FAFAFA] border border-[#F3F4F6] rounded-[12px]">
      <div className="absolute top-[73px] bottom-[21px] left-[49px] right-[49px] bg-white rounded-[8px] shadow-sm p-8 flex flex-col gap-4">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="w-32 h-6 bg-[#F3F4F6] rounded" />
          <span className="text-xs font-semibold text-[#16A34A] bg-[#F0FDF4] px-3 py-1 rounded-full">
            RISK LOW
          </span>
        </div>
        {/* Two side-by-side skeleton blocks */}
        <div className="flex gap-4">
          <div className="flex-1 h-24 bg-[#F9FAFB] rounded" />
          <div className="flex-1 h-24 bg-[#F9FAFB] rounded" />
        </div>
        {/* Large block with floating icon */}
        <div className="relative h-40 bg-[#F9FAFB] rounded">
          <div className="absolute top-4 right-4 w-[45px] h-[45px] bg-[#E5E7EB] rounded" />
        </div>
        {/* Bottom skeleton bar */}
        <div className="h-20 bg-[#F9FAFB] rounded" />
      </div>
    </div>
  );
}

function MarketMappingCard(): React.ReactElement {
  return (
    <div className="w-full h-[600px] bg-[#FAFAFA] border-2 border-dashed border-[#E5E7EB] rounded-[12px] flex flex-col items-center justify-center gap-4">
      <div className="w-[50px] h-[50px] rounded-full bg-[#E5E7EB]" />
      <p className="text-sm font-medium text-[#9CA3AF] text-center max-w-[200px]">
        Interactive Ecosystem Visualization
      </p>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#D1D5DB]" />
        <div className="w-2 h-2 rounded-full bg-[#D1D5DB]" />
        <div className="w-2 h-2 rounded-full bg-[#D1D5DB]" />
      </div>
    </div>
  );
}

function SentimentStatCard(): React.ReactElement {
  return (
    <div className="w-full h-[600px] bg-[#FAFAFA] border border-[#F3F4F6] rounded-[12px] flex items-start justify-center pt-[187px]">
      <div className="bg-black rounded-[12px] px-10 py-8 flex flex-col gap-3 w-[280px]">
        <p className="text-xs uppercase tracking-[1.2px] text-white opacity-60">
          Sentiment Score
        </p>
        <p className="text-[60px] font-bold tracking-[-3px] text-white leading-none">
          +12.4%
        </p>
        <div className="flex items-center gap-2">
          <GreenArrowIcon />
          <span className="text-sm font-semibold text-[#4ADE80]">
            +12.4% vs Last Quarter
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

interface DDFeatureItemProps {
  title: string;
  description: string;
}

function DDFeatureItem({ title, description }: DDFeatureItemProps): React.ReactElement {
  return (
    <div className="flex flex-row items-center gap-4 py-4 border-b border-[#F3F4F6]">
      <GreenCheckIcon />
      <div>
        <p className="text-lg font-semibold text-black">{title}</p>
        <p className="text-base text-[#666666]">{description}</p>
      </div>
    </div>
  );
}

interface SentimentSubCardProps {
  title: string;
  description: string;
  heightClass: string;
}

function SentimentSubCard({ title, description, heightClass }: SentimentSubCardProps): React.ReactElement {
  return (
    <div className={`relative bg-[#FAFAFA] rounded-[12px] ${heightClass}`}>
      <div className="absolute top-[34px] left-[34px] w-8 h-8 bg-[#E5E7EB] rounded" />
      <p className="absolute top-[72px] left-8 right-8 text-base font-bold text-black">
        {title}
      </p>
      <p className="absolute top-[104px] left-8 right-8 text-sm text-[#666666]">
        {description}
      </p>
    </div>
  );
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const ddFeatures: DDFeatureItemProps[] = [
  {
    title: "Cap Table Verification",
    description: "Instantly validate ownership structure and dilution scenarios.",
  },
  {
    title: "Intellectual Property Audit",
    description: "Surface patent risks and licensing conflicts automatically.",
  },
  {
    title: "Financial Integrity",
    description: "Cross-reference reported metrics against industry benchmarks.",
  },
];

const sentimentSubCards: SentimentSubCardProps[] = [
  {
    title: "Social Signals",
    description: "Track founder and product mentions across platforms.",
    heightClass: "h-[216px]",
  },
  {
    title: "News Velocity",
    description: "Monitor press coverage and narrative momentum.",
    heightClass: "h-[216px]",
  },
  {
    title: "Alternative Data",
    description: "Web traffic, hiring signals, and more.",
    heightClass: "h-[196px]",
  },
  {
    title: "Founder Graph",
    description: "Map network and credibility indicators.",
    heightClass: "h-[196px]",
  },
];

const marketBullets = [
  "Dynamic Competitor Quadrants",
  "Global Ecosystem Connectivity",
  "Whitespace Analysis Alerts",
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function FeaturesPage(): React.ReactElement {
  return (
    <div className="relative bg-white overflow-x-hidden">
      <Nav activePath="/features" />

      <div className="flex flex-col">

        {/* ── Hero ── */}
        <section className="flex flex-col items-center pt-[224px] pb-[225px] px-6 min-h-[850px]">
          <div className="flex flex-col items-center gap-8 w-full max-w-[1024px]">
            <h1 className="text-[84px] leading-[92px] font-semibold tracking-[-1.68px] text-black text-center w-full">
              The Unfair Advantage
            </h1>
            <div className="flex flex-col items-center max-w-[672px] w-full">
              <p className="text-2xl leading-8 text-[#666666] text-center">
                Every feature built to compress your due diligence cycle and surface the deals that matter.
              </p>
            </div>
            <button
              type="button"
              className="border border-black rounded-full px-10 py-4 text-base font-medium text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              Request Access
            </button>
          </div>
        </section>

        {/* ── Feature Sections ── */}
        <div className="px-12 pb-[200px] flex flex-col gap-[200px] max-w-[1280px] mx-auto w-full">

          {/* Section 1 — Automated DD */}
          <div className="flex flex-row items-start gap-[100px]">

            {/* Left: text + feature list */}
            <div className="flex-1 flex flex-col">
              <div className="w-20 h-20 rounded-full bg-[#F7F7F7] flex items-center justify-center">
                <SpreadsheetIcon />
              </div>
              <h2 className="text-[48px] leading-[48px] font-semibold text-black mt-10">
                Automated DD
              </h2>
              <p className="text-xl leading-8 text-[#666666] mt-8">
                Eliminate manual screening. Our engine reads pitch decks, parses cap tables, and stress-tests financials — producing a comprehensive risk brief in under 60 seconds.
              </p>
              <div className="flex flex-col mt-12">
                {ddFeatures.map((f) => (
                  <DDFeatureItem key={f.title} title={f.title} description={f.description} />
                ))}
              </div>
            </div>

            {/* Right: mock DD card */}
            <div className="flex-1">
              <AutomatedDDCard />
            </div>

          </div>

          {/* Section 2 — Market Mapping */}
          <div className="flex flex-row items-center gap-[100px]">

            {/* Left: mock map card */}
            <div className="flex-1">
              <MarketMappingCard />
            </div>

            {/* Right: text + bullet list */}
            <div className="flex-1 flex flex-col">
              <div className="w-20 h-20 rounded-full bg-[#F7F7F7] flex items-center justify-center">
                <GridIcon />
              </div>
              <h2 className="text-[48px] leading-[48px] font-semibold text-black mt-10">
                Market Mapping
              </h2>
              <p className="text-xl leading-8 text-[#666666] mt-8">
                See the entire competitive landscape at a glance. Plot incumbents, challengers, and whitespace in real time — no spreadsheet required.
              </p>
              <ul className="flex flex-col gap-4 mt-12">
                {marketBullets.map((item) => (
                  <li key={item} className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-black flex-shrink-0" />
                    <span className="text-xl text-[#666666] leading-8">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Section 3 — Sentiment Engine */}
          <div className="flex flex-row items-start gap-[100px]">

            {/* Left: text + 2×2 sub-card grid */}
            <div className="flex-1 flex flex-col">
              <div className="w-20 h-20 rounded-full bg-[#F7F7F7] flex items-center justify-center">
                <RadarIcon />
              </div>
              <h2 className="text-[48px] leading-[48px] font-semibold text-black mt-10">
                Sentiment Engine
              </h2>
              <p className="text-xl leading-8 text-[#666666] mt-8">
                Go beyond the deck. Continuously monitor founder reputation, product traction, and market narrative with real-time signals from thousands of sources.
              </p>
              <div className="grid grid-cols-2 gap-8 mt-12">
                {sentimentSubCards.map((card) => (
                  <SentimentSubCard
                    key={card.title}
                    title={card.title}
                    description={card.description}
                    heightClass={card.heightClass}
                  />
                ))}
              </div>
            </div>

            {/* Right: stat card */}
            <div className="flex-1">
              <SentimentStatCard />
            </div>

          </div>

        </div>

        {/* ── Footer ── */}
        <Footer />

      </div>
    </div>
  );
}
