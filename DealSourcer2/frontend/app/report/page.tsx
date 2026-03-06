import { AresLogo } from "@/components/AresLogo";

const RADIUS = 118;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const FOUNDERS_LEN = CIRCUMFERENCE * 0.45;
const INVESTORS_LEN = CIRCUMFERENCE * 0.35;
const ESOP_LEN = CIRCUMFERENCE * 0.2;

interface BarData {
  h: number;
  c: string;
}

function MiniBarChart({ bars }: { bars: BarData[] }): React.ReactElement {
  return (
    <div className="flex items-end gap-1 h-12">
      {bars.map((b, i) => (
        <div key={i} className="flex-1" style={{ height: b.h, background: b.c }} />
      ))}
    </div>
  );
}

function SectionHeader({
  label,
  note,
}: {
  label: string;
  note?: string;
}): React.ReactElement {
  return (
    <div className="flex items-end justify-between border-b border-black pb-4">
      <span className="text-[12px] font-bold uppercase tracking-[3.6px] text-black leading-4">
        {label}
      </span>
      {note && (
        <span className="text-[10px] text-[#71717A] text-right leading-[15px] max-w-[448px]">
          {note}
        </span>
      )}
    </div>
  );
}

export default function ReportPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[81px] bg-white border-b border-[#F3F4F6]">
        <div className="flex items-center justify-between h-[80px] px-12 max-w-[1280px] mx-auto">
          <a href="/">
            <AresLogo className="w-8 h-9" />
          </a>
          <div className="flex items-center">
            <a
              href="#"
              className="text-[13px] font-bold uppercase tracking-[1.95px] text-black leading-5"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="text-[13px] font-bold uppercase tracking-[1.95px] text-black leading-5 pl-12"
            >
              Workspace
            </a>
            <a
              href="#"
              className="text-[13px] font-bold uppercase tracking-[1.95px] text-black leading-5 pl-12"
            >
              Portfolio
            </a>
            <div className="pl-12">
              <a
                href="#"
                className="text-[13px] font-bold uppercase tracking-[1.95px] text-black leading-5 border-b-2 border-black pb-[5px]"
              >
                Reports
              </a>
            </div>
            <div className="flex items-center gap-3 pl-8 ml-8 border-l border-[#E5E7EB]">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
                <circle cx="8.5" cy="5.5" r="3.5" fill="black" />
                <path
                  d="M1 16C1 12 16 12 16 16"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <a
                href="#"
                className="text-[13px] font-bold uppercase tracking-[1.95px] text-black leading-5"
              >
                User Profile
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Page body ── */}
      <div className="pt-[88px] px-20 pb-24 flex flex-col gap-24 max-w-[1280px] mx-auto">

        {/* ─────────────────────────────────────────────────────────────
            Section 0 — Strategic Deal Assessment
        ───────────────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-12">
          <div className="border-b border-black pb-4">
            <span className="text-[12px] font-bold uppercase tracking-[3.6px] text-black leading-4">
              Strategic Deal Assessment
            </span>
          </div>

          <div className="flex gap-12">
            {/* Col 1 — Key Investment Thesis */}
            <div className="flex-1 flex flex-col gap-[30.75px] pr-8 border-r border-[#F1F5F9]">
              <span className="text-[10px] font-bold uppercase tracking-[1px] text-black leading-[15px]">
                Key Investment Thesis
              </span>
              <div className="flex flex-col gap-[22.8px]">
                {[
                  {
                    n: "01",
                    text: "Category leadership in non-deterministic agent compliance and automated governance nodes.",
                  },
                  {
                    n: "02",
                    text: "Top-decile talent density from Tier-1 research labs (ex-DeepMind/Stanford AI Lab alignment).",
                  },
                  {
                    n: "03",
                    text: "Structural alignment within the LLM Infrastructure segment with 0.2% peer-benchmark talent ratio.",
                  },
                ].map((item) => (
                  <div key={item.n} className="flex gap-4 items-start">
                    <span className="text-[12px] font-bold text-black leading-4 pt-[3px] flex-shrink-0 min-w-[16px]">
                      {item.n}
                    </span>
                    <span className="text-[14px] text-black leading-[23px]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Col 2 — Strategic Weaknesses & Risks */}
            <div className="flex-1 flex flex-col gap-[30.75px] pr-8 border-r border-[#F1F5F9]">
              <span className="text-[10px] font-bold uppercase tracking-[1px] text-black leading-[15px]">
                Strategic Weaknesses &amp; Risks
              </span>
              <div className="flex flex-col gap-[22.8px]">
                {[
                  {
                    n: "6A",
                    text: "Significant execution risk in multi-modal horizontal scaling on mid-range hardware environments.",
                  },
                  {
                    n: "6B",
                    text: "Compressed runway relative to technical milestones; Q4 capital requirements are non-discretionary.",
                  },
                  {
                    n: "6C",
                    text: "Incipient competition in the edge-compute routing segment from legacy infrastructure incumbents.",
                  },
                ].map((item) => (
                  <div key={item.n} className="flex gap-4 items-start">
                    <span className="text-[12px] font-bold text-black leading-4 pt-[3px] flex-shrink-0 min-w-[16px]">
                      {item.n}
                    </span>
                    <span className="text-[14px] text-[#52525B] leading-[23px]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Col 3 — Underlying Value Drivers */}
            <div className="flex-1 flex flex-col gap-8">
              <span className="text-[10px] font-bold uppercase tracking-[1px] text-black leading-[15px]">
                Underlying Value Drivers
              </span>
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-[6.88px]">
                  <span className="text-[12px] font-bold uppercase text-black leading-4">
                    Proprietary IP Moat
                  </span>
                  <span className="text-[14px] text-[#71717A] leading-[23px]">
                    State-persistence protocols for non-deterministic agents protected by 4 pending
                    patent filings.
                  </span>
                </div>
                <div className="flex flex-col gap-[6.88px]">
                  <span className="text-[12px] font-bold uppercase text-black leading-4">
                    Edge Routing Protocols
                  </span>
                  <span className="text-[14px] text-[#71717A] leading-[23px]">
                    Optimized compute-routing logic yielding a 14% latency arbitrage over standard
                    peer benchmarks.
                  </span>
                </div>
                <div className="flex flex-col gap-1 pt-6 border-t border-[#F1F5F9]">
                  <span className="text-[9px] font-bold uppercase tracking-[0.9px] text-black leading-[14px]">
                    Institutional Alignment Index
                  </span>
                  <span className="text-[12px] text-[#71717A] leading-4">
                    Positioned as a core infrastructure beneficiary within the current LLM
                    consolidation cycle.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            Section 01 — Cap Table Forensic
        ───────────────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-12 pt-6">
          <SectionHeader
            label="01 — Cap Table Forensic"
            note="Source: Verified Cap Table report (9/07). Note: Ownership calculated on a fully-diluted post-money basis including unexercised ESOP."
          />

          <div className="flex gap-12 items-start">
            {/* Left — donut + legend */}
            <div className="flex flex-col gap-8 w-[341px] flex-shrink-0">
              {/* Donut */}
              <div className="flex items-center justify-center py-10">
                <div className="relative w-64 h-64 flex items-center justify-center">
                  <svg
                    width={256}
                    height={256}
                    style={{ transform: "rotate(-90deg)", position: "absolute", inset: 0 }}
                  >
                    {/* Track */}
                    <circle
                      cx={128}
                      cy={128}
                      r={RADIUS}
                      fill="none"
                      stroke="#F1F1F1"
                      strokeWidth={20}
                    />
                    {/* Founders 45% */}
                    <circle
                      cx={128}
                      cy={128}
                      r={RADIUS}
                      fill="none"
                      stroke="#000000"
                      strokeWidth={20}
                      strokeDasharray={`${FOUNDERS_LEN} ${CIRCUMFERENCE - FOUNDERS_LEN}`}
                      strokeDashoffset={0}
                    />
                    {/* Investors 35% */}
                    <circle
                      cx={128}
                      cy={128}
                      r={RADIUS}
                      fill="none"
                      stroke="#71717A"
                      strokeWidth={20}
                      strokeDasharray={`${INVESTORS_LEN} ${CIRCUMFERENCE - INVESTORS_LEN}`}
                      strokeDashoffset={-FOUNDERS_LEN}
                    />
                    {/* ESOP 20% */}
                    <circle
                      cx={128}
                      cy={128}
                      r={RADIUS}
                      fill="none"
                      stroke="#E4E4E7"
                      strokeWidth={20}
                      strokeDasharray={`${ESOP_LEN} ${CIRCUMFERENCE - ESOP_LEN}`}
                      strokeDashoffset={-(FOUNDERS_LEN + INVESTORS_LEN)}
                    />
                  </svg>
                  <div className="relative flex flex-col items-center gap-0.5">
                    <span className="text-[9px] font-bold text-[#71717A] uppercase tracking-[0.9px] leading-[14px]">
                      TOTAL EQUITY
                    </span>
                    <span className="text-2xl font-bold text-black leading-8">100.0%</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-col gap-[15.5px]">
                {[
                  { color: "#000000", label: "Founders", pct: "45.0%", textColor: "#000000" },
                  { color: "#71717A", label: "Investors", pct: "35.0%", textColor: "#71717A" },
                  { color: "#E4E4E7", label: "> ESOP", pct: "20.0%", textColor: "#71717A" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 flex-shrink-0" style={{ background: item.color }} />
                      <span
                        className="text-[14px] leading-5"
                        style={{ color: item.textColor }}
                      >
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[14px] font-bold text-black leading-5">{item.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — table */}
            <div className="flex-1">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#F1F5F9]">
                    <th className="text-left text-[10px] font-semibold uppercase tracking-[1px] text-[#71717A] pb-4 leading-3">
                      Shareholder Class
                    </th>
                    <th className="text-left text-[10px] font-semibold uppercase tracking-[1px] text-[#71717A] pb-4 leading-3">
                      Liquidation Preference
                    </th>
                    <th className="text-right text-[10px] font-semibold uppercase tracking-[1px] text-[#71717A] pb-4 leading-3">
                      Fully Diluted
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cls: "Founder Common", pref: "None", pct: "45.0%" },
                    { cls: "Series Seed Preferred", pref: "1.0x Non-Participating", pct: "15.0%" },
                    { cls: "Series A Preferred", pref: "1.0x Participating", pct: "20.0%" },
                    { cls: "Option Pool (Post-Money)", pref: "—", pct: "20.0%" },
                  ].map((row) => (
                    <tr key={row.cls} className="border-b border-[#F8FAFC]">
                      <td className="py-5 text-[14px] font-medium text-black leading-5">{row.cls}</td>
                      <td className="py-5 text-[14px] text-[#71717A] leading-5">{row.pref}</td>
                      <td className="py-5 text-[14px] font-bold text-black text-right leading-5">
                        {row.pct}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            Section 02 — Market Intelligence
        ───────────────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-12 pt-6">
          <SectionHeader label="02 — Market Intelligence" />

          <div className="flex gap-20">
            {/* Left — scatter plot */}
            <div className="flex-1 flex flex-col gap-4">
              <div
                className="relative border border-[#E5E5E5] bg-[rgba(248,250,252,0.3)]"
                style={{ aspectRatio: "1 / 1" }}
              >
                {/* Grid lines */}
                <div className="absolute inset-0 flex">
                  <div className="flex-1 border-r border-[#E2E8F0]" />
                  <div className="flex-1" />
                </div>
                <div className="absolute inset-0 flex flex-col">
                  <div className="flex-1 border-b border-[#E2E8F0]" />
                  <div className="flex-1" />
                </div>

                {/* Top axis label */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-[9px] font-bold uppercase tracking-[-0.45px] text-[#71717A] leading-[14px]">
                    Y-Relative Market Capitalization
                  </span>
                </div>

                {/* Bottom axis label */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="text-[9px] font-bold uppercase tracking-[-0.45px] text-[#71717A] leading-[14px]">
                    Market Entry Baseline
                  </span>
                </div>

                {/* Left axis label */}
                <div
                  className="absolute left-3 top-1/2"
                  style={{ transform: "translateY(-50%) rotate(180deg)", writingMode: "vertical-rl" }}
                >
                  <span className="text-[9px] font-bold uppercase tracking-[-0.45px] text-[#71717A] leading-[14px]">
                    Growth Vector
                  </span>
                </div>

                {/* Right axis label */}
                <div
                  className="absolute right-3 top-1/2"
                  style={{ transform: "translateY(-50%)", writingMode: "vertical-rl" }}
                >
                  <span className="text-[9px] font-bold uppercase tracking-[-0.45px] text-[#71717A] leading-[14px]">
                    Peer Valuation Multiple
                  </span>
                </div>

                {/* Main dot (subject company — upper right) */}
                <div
                  className="absolute w-3 h-3 rounded-full bg-black shadow-[0_0_0_4px_rgba(0,0,0,0.1)]"
                  style={{ left: "72.6%", top: "25.1%" }}
                />

                {/* Peer dots */}
                <div
                  className="absolute w-2 h-2 rounded-full border border-black"
                  style={{ left: "33.4%", top: "65.07%" }}
                />
                <div
                  className="absolute w-2 h-2 rounded-full border border-black"
                  style={{ left: "25.1%", top: "33.39%" }}
                />
                <div
                  className="absolute w-2 h-2 rounded-full border border-black"
                  style={{ left: "38%", top: "76%" }}
                />
                <div
                  className="absolute w-2 h-2 rounded-full border border-black"
                  style={{ left: "48%", top: "70%" }}
                />
              </div>
              <p className="text-[10px] text-[#71717A] leading-[15px]">
                Competitive positioning relative to top 50 indexed players in LLM Infrastructure.
                Source: Patent Database Index &amp; Crunchbase Ecosystem API.
              </p>
            </div>

            {/* Right — dark panel */}
            <div className="w-[520px] flex-shrink-0 bg-black p-12 flex flex-col gap-8">
              <div className="flex items-center gap-2">
                <div className="w-[10px] h-[10px] bg-white flex-shrink-0" />
                <span className="text-[12px] font-bold uppercase tracking-[1.2px] text-white leading-4">
                  Segment Arbitrage Analysis
                </span>
              </div>

              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                  <span className="text-[14px] font-bold uppercase tracking-[0.35px] text-white leading-5">
                    Automated Governance Nodes
                  </span>
                  <span className="text-[12px] text-[#A1A1AA] leading-5">
                    System-wide gap identified in decentralized compliance auditing for
                    non-deterministic agents.
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-[14px] font-bold uppercase tracking-[0.35px] text-white leading-5">
                    Cross-Modal Latency Arbitrage
                  </span>
                  <span className="text-[12px] text-[#A1A1AA] leading-5">
                    Immediate potential for Vertex to capture 14% of edge-compute market via
                    optimized routing protocols.
                  </span>
                </div>

                <div className="flex flex-col gap-1 pt-4 border-t border-[#27272A]">
                  <span className="text-[9px] font-bold uppercase tracking-[0.9px] text-[#71717A] leading-[14px]">
                    Strategic Observation
                  </span>
                  <span className="text-[10px] text-[#A1A1AA] leading-[15px]">
                    High probability of vertical consolidation within the Q4-Q1 window based on
                    current patent filing velocity.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            Section 03 — Sentiment Engine
        ───────────────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-12 pt-6">
          <SectionHeader label="03 — Sentiment Engine" />

          <div className="flex gap-12">
            {/* Social Velocity */}
            <div className="flex-1 border border-[#E5E5E5] p-8 flex flex-col gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[1px] text-[#71717A] leading-[15px]">
                Social Velocity
              </span>
              <MiniBarChart
                bars={[
                  { h: 9.59, c: "#F1F5F9" },
                  { h: 16.8, c: "#F1F5F9" },
                  { h: 14.39, c: "#F1F5F9" },
                  { h: 26.39, c: "#E2E8F0" },
                  { h: 21.59, c: "#CBD5E1" },
                  { h: 40.8, c: "#000000" },
                  { h: 48, c: "#000000" },
                ]}
              />
              <div className="flex items-baseline justify-between">
                <span className="text-[24px] font-bold text-black leading-8">+184%</span>
                <span className="text-[10px] font-bold text-black leading-[15px]">30D Delta</span>
              </div>
            </div>

            {/* Hiring Momentum */}
            <div className="flex-1 border border-[#E5E5E5] p-8 flex flex-col gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[1px] text-[#71717A] leading-[15px]">
                Hiring Momentum
              </span>
              <MiniBarChart
                bars={[
                  { h: 19.19, c: "#F1F5F9" },
                  { h: 21.59, c: "#F1F5F9" },
                  { h: 28.8, c: "#000000" },
                  { h: 31.19, c: "#000000" },
                  { h: 33.59, c: "#000000" },
                  { h: 31.19, c: "#000000" },
                  { h: 38.39, c: "#000000" },
                ]}
              />
              <div className="flex items-baseline justify-between">
                <span className="text-[24px] font-bold text-black leading-8">Growth Neutral</span>
                <span className="text-[10px] font-bold text-black leading-[15px]">6 Openings</span>
              </div>
            </div>

            {/* Technical Social Proof */}
            <div className="flex-1 border border-[#E5E5E5] p-8 flex flex-col gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[1px] text-[#71717A] leading-[15px]">
                Technical Social Proof
              </span>
              <MiniBarChart
                bars={[
                  { h: 43.19, c: "#000000" },
                  { h: 40.8, c: "#000000" },
                  { h: 45.59, c: "#000000" },
                  { h: 43.19, c: "#000000" },
                  { h: 44.16, c: "#000000" },
                  { h: 47.03, c: "#000000" },
                  { h: 48, c: "#000000" },
                ]}
              />
              <div className="flex items-baseline justify-between">
                <span className="text-[24px] font-bold text-black leading-8">9.8/10</span>
                <span className="text-[10px] font-bold text-black leading-[15px]">OSS Repo</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-[#71717A] leading-[15px]">
            Momentum metrics normalized against a peer group of 45 Series A infrastructure firms.
          </p>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            Section 04 — Signal Terminal
        ───────────────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-12 pt-6">
          <SectionHeader label="04 — Signal Terminal" />

          <div className="flex gap-12">
            {/* Left — unstructured sentiment feed */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="border-l-2 border-black pl-4">
                <span className="text-[10px] font-bold uppercase tracking-[1px] text-black leading-[15px]">
                  Unstructured Sentiment Feed
                </span>
              </div>

              {/* Feed item 1 */}
              <div className="flex flex-col gap-[6.88px] pb-6 border-b border-[#F1F5F9]">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-black leading-4">
                      Twitter Alpha
                    </span>
                    <span className="text-[9px] uppercase tracking-[-0.45px] text-[#71717A] leading-[14px]">
                      High Confidence Node
                    </span>
                  </div>
                  <div className="border border-black rounded-full px-2 py-0.5">
                    <span className="text-[9px] font-bold uppercase text-black leading-[14px]">
                      Positive
                    </span>
                  </div>
                </div>
                <p className="text-[14px] font-light text-black leading-[23px]">
                  &ldquo;Vertex is solving the state-persistence problem in LLMs that everyone else
                  is ignoring. Real infra play.&rdquo;
                </p>
              </div>

              {/* Feed item 2 */}
              <div className="flex flex-col gap-[6.88px] pb-6 border-b border-[#F1F5F9]">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-black leading-4">
                      HackerNews Leak
                    </span>
                    <span className="text-[9px] uppercase tracking-[-0.45px] text-[#71717A] leading-[14px]">
                      Low Confidence Node
                    </span>
                  </div>
                  <div className="border border-black rounded-full px-2 py-0.5">
                    <span className="text-[9px] font-bold uppercase text-black leading-[14px]">
                      Neutral
                    </span>
                  </div>
                </div>
                <p className="text-[14px] font-light text-black leading-[23px]">
                  &ldquo;Benchmarks looking solid, but waiting to see how they handle horizontal
                  scaling on mid-range hardware.&rdquo;
                </p>
              </div>
            </div>

            {/* Right — talent flow summary */}
            <div className="w-[438px] flex-shrink-0 bg-[#F8FAFC] p-10 flex flex-col gap-8">
              <span className="text-[10px] font-bold uppercase tracking-[1px] text-black leading-[15px]">
                Talent Flow Summary
              </span>

              <div className="flex flex-col gap-6">
                {[
                  { label: "Ex-DeepMind", value: "4 Founders" },
                  { label: "From Competitor X", value: "-2 Engineers" },
                  { label: "Stanford AI Lab", value: "3 Advisors" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-[14px] font-medium text-black leading-5">{row.label}</span>
                    <span className="text-[14px] font-bold text-black leading-5">{row.value}</span>
                  </div>
                ))}

                <div className="flex flex-col gap-[6.75px] pt-6 border-t border-[#E2E8F0]">
                  <span className="text-[9px] font-bold uppercase tracking-[0.9px] text-black leading-[14px]">
                    Strategic Observation
                  </span>
                  <p className="text-[11px] text-[#71717A] leading-[14px]">
                    Talent density index remains high. Net gain of 5 high-impact engineers in Q3.
                    Organizational structure favors technical depth over commercial breadth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            Footer
        ───────────────────────────────────────────────────────────── */}
        <footer className="flex flex-col gap-16 pt-20 border-t border-[#F1F5F9]">
          <div className="border border-[#F1F5F9] p-8 flex flex-col gap-4">
            <span className="text-[10px] font-bold uppercase tracking-[1px] text-black leading-[15px]">
              Methodology &amp; Bias Disclosure
            </span>
            <p className="text-[10px] text-[#71717A] leading-4">
              Analysis is generated through a proprietary multi-modal inference engine that
              synthesizes primary data (cap tables, financial statements) with secondary market
              signals. While algorithmic weighting is utilized to mitigate human cognitive bias,
              limitations exist in the interpretation of unstructured social feeds. All scoring is
              relative to the internal &apos;Deep Tech Benchmark 2024&apos; and is subject to
              revision as additional primary source documents are ingested. This report does not
              constitute financial advice or an investment recommendation.
            </p>
          </div>

          <div className="flex justify-center pb-8">
            <span className="text-[9px] font-medium uppercase tracking-[3.6px] text-[#D4D4D8] leading-[14px]">
              Confidential — For Institutional Use Only — No. 8829-QX
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
