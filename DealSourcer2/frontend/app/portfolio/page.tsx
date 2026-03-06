import { AppNav } from "@/components/AppNav";
import { Footer } from "@/components/Footer";

// ─── Icons ─────────────────────────────────────────────────────────────────────

function FilterIcon(): React.ReactElement {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="1" x2="18" y2="1" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="3" y1="6" x2="15" y2="6" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="11" x2="12" y2="11" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon(): React.ReactElement {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7.5" cy="7.5" r="5.5" stroke="black" strokeWidth="1.5" />
      <line x1="12" y1="12" x2="17" y2="17" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  isAlert?: boolean;
}

interface Investment {
  initials: string;
  name: string;
  sector: string;
  entry: string;
  round: string;
  healthScore: number;
  darkAvatar: boolean;
}

type SignalType = "critical" | "market" | "growth" | "news";

interface Signal {
  type: SignalType;
  time: string;
  title: string;
  description: string;
}

// ─── Data ──────────────────────────────────────────────────────────────────────

const investments: Investment[] = [
  {
    initials: "VS",
    name: "Vertex Systems",
    sector: "SaaS",
    entry: "Q1 2023",
    round: "Series A",
    healthScore: 9.4,
    darkAvatar: true,
  },
  {
    initials: "NH",
    name: "Nebula Health",
    sector: "Bio / AI",
    entry: "Q3 2023",
    round: "Seed",
    healthScore: 7.1,
    darkAvatar: false,
  },
  {
    initials: "FL",
    name: "Flow Logic",
    sector: "AI Ops",
    entry: "Q4 2023",
    round: "Series B",
    healthScore: 4.8,
    darkAvatar: false,
  },
  {
    initials: "KR",
    name: "Kinetica Robotics",
    sector: "AI / Hardware",
    entry: "Q1 2024",
    round: "Seed Plus",
    healthScore: 9.1,
    darkAvatar: true,
  },
  {
    initials: "AS",
    name: "Aether Soft",
    sector: "LLM Infra",
    entry: "Q2 2024",
    round: "Pre-Seed",
    healthScore: 6.5,
    darkAvatar: false,
  },
];

const signals: Signal[] = [
  {
    type: "critical",
    time: "2m ago",
    title: "Founder sentiment drop",
    description:
      "Flow Logic (FL) social engagement and internal comms signals show 24% decline in leadership sentiment.",
  },
  {
    type: "market",
    time: "1h ago",
    title: "Competitor funding round",
    description:
      "Direct competitor to Vertex Systems raised $45M Series B at 18x forward revenue. Market multiples expanding.",
  },
  {
    type: "growth",
    time: "4h ago",
    title: "Headcount Surge",
    description:
      "Kinetica Robotics (KR) increased engineering headcount by 12% in last 30 days. Core focus on LLM integration.",
  },
  {
    type: "news",
    time: "Yesterday",
    title: "Acquisition Rumor",
    description:
      "Reports suggest major tech incumbent is looking at Nebula Health's patent portfolio for strategic acquisition.",
  },
];

const signalConfig: Record<
  SignalType,
  { label: string; badgeBg: string; badgeText: string }
> = {
  critical: {
    label: "Critical",
    badgeBg: "bg-[#FEF2F2]",
    badgeText: "text-[#DC2626]",
  },
  market: {
    label: "Market",
    badgeBg: "bg-[#EFF6FF]",
    badgeText: "text-[#2563EB]",
  },
  growth: {
    label: "Growth",
    badgeBg: "bg-[#F0FDF4]",
    badgeText: "text-[#16A34A]",
  },
  news: {
    label: "News",
    badgeBg: "bg-[#F9FAFB]",
    badgeText: "text-[#6B7280]",
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getHealthColor(score: number): string {
  if (score >= 8) return "text-[#16A34A]";
  if (score >= 6) return "text-[#F97316]";
  return "text-[#DC2626]";
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function StatCard({ label, value, isAlert = false }: StatCardProps): React.ReactElement {
  return (
    <div className="flex-1 flex flex-col gap-2 p-8 bg-white">
      <p
        className={`text-xs font-bold uppercase tracking-[1.2px] ${
          isAlert ? "text-[#EF4444]" : "text-[#9CA3AF]"
        }`}
      >
        {label}
      </p>
      <p
        className={`text-[36px] leading-[40px] font-normal ${
          isAlert ? "text-[#DC2626]" : "text-black"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function InvestmentRow({
  inv,
  isFirst,
}: {
  inv: Investment;
  isFirst: boolean;
}): React.ReactElement {
  return (
    <div
      className={`flex items-center h-[97px] ${
        isFirst ? "" : "border-t border-[#F9FAFB]"
      }`}
    >
      {/* Company */}
      <div className="w-[280px] flex items-center gap-4">
        <div
          className={`w-8 h-8 flex items-center justify-center flex-shrink-0 ${
            inv.darkAvatar ? "bg-black" : "bg-[#F3F4F6]"
          }`}
        >
          <span
            className={`text-[10px] font-bold leading-none ${
              inv.darkAvatar ? "text-white" : "text-black"
            }`}
          >
            {inv.initials}
          </span>
        </div>
        <span className="text-base font-semibold text-black">{inv.name}</span>
      </div>

      {/* Sector */}
      <div className="w-[140px]">
        <span className="text-sm text-[#666666]">{inv.sector}</span>
      </div>

      {/* Entry */}
      <div className="w-[91px]">
        <span className="text-sm text-[#666666]">{inv.entry}</span>
      </div>

      {/* Round */}
      <div className="w-[103px]">
        <span className="text-sm text-[#666666]">{inv.round}</span>
      </div>

      {/* Health Score */}
      <div className="flex-1 flex justify-end">
        <span className={`text-lg font-bold ${getHealthColor(inv.healthScore)}`}>
          {inv.healthScore}
        </span>
      </div>
    </div>
  );
}

function SignalCard({ signal }: { signal: Signal }): React.ReactElement {
  const config = signalConfig[signal.type];
  const isNews = signal.type === "news";

  return (
    <div className="relative pl-[18px] min-h-[106px]">
      {/* Left vertical border */}
      <div
        className={`absolute left-0 top-0 bottom-0 border-l-2 border-black ${
          isNews ? "opacity-60" : ""
        }`}
      />

      {/* Content */}
      <div className="pt-2 flex flex-col gap-[6px]">
        {/* Badge + Timestamp */}
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center px-2 py-[2px] text-[10px] font-bold uppercase tracking-[1px] ${config.badgeBg} ${config.badgeText}`}
          >
            {config.label}
          </span>
          <span className="text-[10px] leading-[15px] text-[#9CA3AF]">
            {signal.time}
          </span>
        </div>

        {/* Title */}
        <p className="text-sm font-semibold text-black leading-5">{signal.title}</p>

        {/* Description */}
        <p className="text-xs leading-5 text-[#666666]">{signal.description}</p>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function PortfolioPage(): React.ReactElement {
  return (
    <div className="bg-white min-h-screen">
      <AppNav activePath="/portfolio" />

      {/* Main */}
      <main className="pt-24 px-12 pb-[100px] flex flex-col gap-24 max-w-[1280px] mx-auto">

        {/* ── Header: Title + Stats ── */}
        <div className="flex flex-col gap-16">
          <h1 className="text-[48px] leading-[72px] font-semibold tracking-[-1.2px] text-black">
            Portfolio Intelligence
          </h1>

          {/* Stats bar — 1px gaps between white cards on a gray background */}
          <div className="flex gap-[1px] bg-[#F3F4F6] border border-[#F3F4F6]">
            <StatCard label="Total Investments" value="12" />
            <StatCard label="Cumulative TVPI" value="2.4x" />
            <StatCard label="Deployment" value="64%" />
            <StatCard label="Active Flags" value="02" isAlert />
          </div>
        </div>

        {/* ── Two-Column Section ── */}
        <div className="flex gap-16">

          {/* Left — Active Investments */}
          <div className="flex flex-col gap-8 w-[768px] flex-none">

            {/* Section header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold uppercase tracking-[2px] text-black">
                Active Investments
              </h2>
              <div className="flex items-center gap-4">
                <button type="button" aria-label="Filter" className="hover:opacity-60 transition-opacity">
                  <FilterIcon />
                </button>
                <button type="button" aria-label="Search" className="hover:opacity-60 transition-opacity">
                  <SearchIcon />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="border-t border-black">
              {/* Header Row */}
              <div className="flex border-b border-[#F3F4F6]">
                <div className="w-[280px] py-6 px-[1px]">
                  <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#9CA3AF]">
                    Company
                  </span>
                </div>
                <div className="w-[140px] py-6 px-[1px]">
                  <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#9CA3AF]">
                    Sector
                  </span>
                </div>
                <div className="w-[91px] py-6 px-[1px]">
                  <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#9CA3AF]">
                    Entry
                  </span>
                </div>
                <div className="w-[103px] py-6 px-[1px]">
                  <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#9CA3AF]">
                    Round
                  </span>
                </div>
                <div className="flex-1 py-6 px-[1px] flex justify-end">
                  <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#9CA3AF]">
                    Health Score
                  </span>
                </div>
              </div>

              {/* Body Rows */}
              <div>
                {investments.map((inv, index) => (
                  <InvestmentRow key={inv.initials} inv={inv} isFirst={index === 0} />
                ))}
              </div>
            </div>
          </div>

          {/* Right — Real-Time Signals */}
          <div className="flex flex-col gap-8 w-[352px] flex-none">
            <h2 className="text-xl font-bold uppercase tracking-[2px] text-black">
              Real-Time Signals
            </h2>

            {/* Signal cards */}
            <div className="flex flex-col gap-6">
              {signals.map((signal) => (
                <SignalCard key={signal.title} signal={signal} />
              ))}
            </div>

            {/* View All button */}
            <button
              type="button"
              className="w-full py-4 border border-black text-[10px] font-bold uppercase tracking-[1px] text-black hover:bg-black hover:text-white transition-colors"
            >
              View All Signals
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
