"use client";

import { AresLogo } from "@/components/AresLogo";
import { Footer } from "@/components/Footer";

// ── Icons ────────────────────────────────────────────────────────────────────

function DocumentIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 1.5H3.5A.5.5 0 0 0 3 2v12a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V6.5L9 1.5Z"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 1.5V6.5H14M5 10h6M5 12.5h4"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M6.5 1v7.5M3.5 6l3 3 3-3M1.5 11.5v.5a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5v-.5"
        stroke="black"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="8.5" cy="5.5" r="3" stroke="black" strokeWidth="1.2" />
      <path
        d="M1.5 16c0-3.866 3.134-7 7-7s7 3.134 7 7"
        stroke="black"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────────

interface ReportCardProps {
  title: string;
  description: string;
  date: string;
  pages: string;
}

function ReportCard({ title, description, date, pages }: ReportCardProps) {
  return (
    <div className="flex flex-col justify-between p-[35px] h-[281px] bg-[rgba(249,250,251,0.3)] border border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors">
      <div className="flex flex-col gap-[9px]">
        <h3 className="text-[22px] font-medium leading-[31px] text-black">
          {title}
        </h3>
        <p className="text-[15px] font-normal leading-[22px] text-[#666666]">
          {description}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[1.1px] text-[#9CA3AF]">
          {date} • {pages} Pages
        </span>
        <button className="flex items-center gap-[9px] group hover:opacity-60 transition-opacity">
          <span className="text-[13px] font-bold uppercase tracking-[1.32px] text-black">
            Download PDF
          </span>
          <DownloadIcon />
        </button>
      </div>
    </div>
  );
}

interface AllocationItemProps {
  label: string;
  percentage: number;
}

function AllocationItem({ label, percentage }: AllocationItemProps) {
  return (
    <div className="flex flex-col gap-[9px]">
      <div className="flex justify-between items-center">
        <span className="text-[12px] font-bold uppercase tracking-[1.2px] text-black">
          {label}
        </span>
        <span className="text-[12px] font-bold uppercase tracking-[1.2px] text-black">
          {percentage}%
        </span>
      </div>
      <div className="relative w-full h-[4px] bg-[#F3F4F6]">
        <div
          className="absolute left-0 top-0 bottom-0 bg-black"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

const reports: ReportCardProps[] = [
  {
    title: "Generative AI Infrastructure",
    description:
      "Comprehensive mapping of LLM orchestration and vector database landscape.",
    date: "OCT 2024",
    pages: "42",
  },
  {
    title: "Vertical SaaS: Manufacturing",
    description:
      "Deep-dive DD on 12 early-stage startups automating supply chain intelligence.",
    date: "SEP 2024",
    pages: "28",
  },
  {
    title: "Autonomous Agent Economy",
    description:
      "Thesis on B2B agentic workflows and cross-platform interoperability layers.",
    date: "SEP 2024",
    pages: "35",
  },
  {
    title: "Cybersecurity AI Moats",
    description:
      "Analysis of defensive AI strategies against automated threat actors.",
    date: "AUG 2024",
    pages: "51",
  },
];

const allocations: AllocationItemProps[] = [
  { label: "Infrastructure", percentage: 42 },
  { label: "Applications", percentage: 28 },
  { label: "Robotics", percentage: 18 },
  { label: "Life Sciences", percentage: 12 },
];

const xLabels = ["Q1 23", "Q2 23", "Q3 23", "Q4 23", "Q1 24", "Q2 24", "Q3 24"];

export default function ReportsPage() {
  return (
    <div className="relative bg-white min-h-screen overflow-x-hidden">
      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-[81px] bg-white border-b border-[#F3F4F6]">
        <div className="flex items-center justify-between h-[80px] px-12 max-w-[1280px] mx-auto">
          <a href="/">
            <AresLogo className="w-8 h-9" />
          </a>
          <div className="flex items-center gap-12">
            <a
              href="/dashboard"
              className="text-[13px] font-bold uppercase tracking-[1.95px] text-black hover:text-gray-400 transition-colors"
            >
              Dashboard
            </a>
            <a
              href="/workspace"
              className="text-[13px] font-bold uppercase tracking-[1.95px] text-black hover:text-gray-400 transition-colors"
            >
              Workspace
            </a>
            <a
              href="/portfolio"
              className="text-[13px] font-bold uppercase tracking-[1.95px] text-black hover:text-gray-400 transition-colors"
            >
              Portfolio
            </a>
            <div className="pb-[3px] border-b-2 border-black">
              <a
                href="/reports"
                className="text-[13px] font-bold uppercase tracking-[1.95px] text-black"
              >
                Reports
              </a>
            </div>
            <div className="flex items-center gap-3 pl-8 border-l border-[#E5E7EB]">
              <UserIcon />
              <a
                href="/profile"
                className="text-[13px] font-bold uppercase tracking-[1.95px] text-black hover:text-gray-400 transition-colors"
              >
                User Profile
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <main className="pt-[81px]">
        <div className="flex flex-col items-center px-[53px] pt-[140px] max-w-[1280px] mx-auto">
          <div className="w-full max-w-[1124px] flex flex-col">

            {/* ── Hero ──────────────────────────────────────────────────────── */}
            <div className="flex flex-col items-center gap-9">
              <h1 className="text-[53px] font-semibold leading-[79px] tracking-[-1.32px] text-center text-black">
                Intelligence
                <br />
                Reports
              </h1>
              <p className="text-[20px] font-normal leading-[31px] text-center text-[#666666] max-w-[676px]">
                Automated market mappings, deep-dive due diligence, and
                internal fund performance analytics.
              </p>
            </div>

            {/* ── CTA Button ────────────────────────────────────────────────── */}
            <div className="flex justify-center mt-[140px] mb-[200px]">
              <button className="flex items-center justify-center gap-[13px] bg-black text-white h-[66px] w-full max-w-[492px] hover:bg-neutral-800 transition-colors">
                <DocumentIcon />
                <span className="text-[15px] font-bold uppercase tracking-[1.54px]">
                  Generate Custom Report
                </span>
              </button>
            </div>

            {/* ── Automated Thesis Reports ──────────────────────────────────── */}
            <section className="flex flex-col gap-[53px] mb-[220px]">
              {/* Section header */}
              <div className="flex items-baseline justify-between pb-[18px] border-b border-black w-full">
                <h2 className="text-[26px] font-semibold leading-[35px] tracking-[-0.66px] uppercase text-black w-[383px]">
                  Automated Thesis Reports
                </h2>
                <span className="text-[13px] font-bold uppercase tracking-[1.32px] text-[#9CA3AF]">
                  Market Mappings & DD
                </span>
              </div>

              {/* 2×2 grid */}
              <div className="grid grid-cols-2 gap-[35px]">
                {reports.map((report, i) => (
                  <ReportCard key={i} {...report} />
                ))}
              </div>
            </section>

            {/* ── Firm Performance ──────────────────────────────────────────── */}
            <section className="flex flex-col gap-[53px] mb-[140px]">
              {/* Section header */}
              <div className="flex items-baseline justify-between pb-[18px] border-b border-black w-full">
                <h2 className="text-[26px] font-semibold leading-[35px] tracking-[-0.66px] uppercase text-black">
                  Firm Performance
                </h2>
                <span className="text-[13px] font-bold uppercase tracking-[1.32px] text-[#9CA3AF]">
                  Internal Analytics
                </span>
              </div>

              {/* Two-panel layout */}
              <div className="flex gap-[53px]">

                {/* Left: Fund TVPI Growth Chart */}
                <div className="flex-1 flex flex-col gap-[53px] border border-[#F3F4F6] p-[44px]">
                  {/* Fund header */}
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-bold uppercase tracking-[1.32px] text-[#9CA3AF]">
                        Fund TVPI Growth
                      </span>
                      <span className="text-[26px] font-medium leading-[35px] tracking-[-0.66px] text-black">
                        Venture Fund
                        <br />
                        III
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[26px] font-semibold leading-[35px] tracking-[-0.66px] text-black">
                        2.41x
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-[1.1px] text-[#16A34A]">
                        +12% YoY
                      </span>
                    </div>
                  </div>

                  {/* Chart */}
                  <div className="flex flex-col">
                    <div className="relative border-b border-l border-[#E5E7EB] h-[281px]">
                      <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 640 280"
                        preserveAspectRatio="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <polyline
                          points="0,245 107,228 213,218 320,192 427,158 533,112 640,62"
                          fill="none"
                          stroke="black"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle cx="640" cy="62" r="4.5" fill="black" />
                      </svg>
                    </div>
                    {/* X-axis labels */}
                    <div className="flex justify-between pt-[18px]">
                      {xLabels.map((label) => (
                        <span
                          key={label}
                          className="text-[11px] font-bold tracking-[1.1px] text-[#9CA3AF]"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Capital Allocation */}
                <div className="flex flex-col gap-9 border border-[#F3F4F6] p-[44px] w-[340px] flex-shrink-0">
                  <h3 className="text-[13px] font-bold uppercase tracking-[1.32px] text-[#9CA3AF]">
                    Capital Allocation
                  </h3>
                  <div className="flex flex-col gap-[26px]">
                    {allocations.map((item) => (
                      <AllocationItem key={item.label} {...item} />
                    ))}
                  </div>
                  <div className="pt-9 border-t border-[#F3F4F6] mt-auto">
                    <p className="text-[13px] font-normal leading-[21px] text-[#666666]">
                      Exposure concentrated in Series A seed stage entities
                      across Tier 1 hubs.
                    </p>
                  </div>
                </div>

              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
