"use client";

import { useState, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";
import { WorkspaceNav } from "@/components/WorkspaceNav";
import { Footer } from "@/components/Footer";

interface Analysis {
  id: string;
  initial: string;
  company: string;
  date: string;
  status: "analyzed" | "processing" | "flagged";
  score: number | null;
  darkBg: boolean;
}

const ANALYSES: Analysis[] = [
  {
    id: "1",
    initial: "V",
    company: "Vertex Systems",
    date: "Oct 24, 2024",
    status: "analyzed",
    score: 8.4,
    darkBg: true,
  },
  {
    id: "2",
    initial: "N",
    company: "Nebula Health",
    date: "Oct 23, 2024",
    status: "processing",
    score: null,
    darkBg: false,
  },
  {
    id: "3",
    initial: "F",
    company: "Flow Logic",
    date: "Oct 21, 2024",
    status: "flagged",
    score: 4.2,
    darkBg: false,
  },
  {
    id: "4",
    initial: "K",
    company: "Kinetica Robotics",
    date: "Oct 19, 2024",
    status: "analyzed",
    score: 9.1,
    darkBg: true,
  },
];

const STATUS_CONFIG: Record<
  "analyzed" | "processing" | "flagged",
  { label: string; className: string }
> = {
  analyzed: {
    label: "Analyzed",
    className: "bg-[#F0FDF4] border border-[#DCFCE7] text-[#15803D]",
  },
  processing: {
    label: "Processing",
    className: "bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8]",
  },
  flagged: {
    label: "Flagged",
    className: "bg-[#FEF2F2] border border-[#FEE2E2] text-[#B91C1C]",
  },
};

function PdfIcon() {
  return (
    <svg
      width="37"
      height="44"
      viewBox="0 0 37 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 4C3 2.9 3.9 2 5 2H23L35 14V40C35 41.1 34.1 42 33 42H5C3.9 42 3 41.1 3 40V4Z"
        fill="white"
        stroke="#9CA3AF"
        strokeWidth="2"
      />
      <path d="M23 2L35 14H25C23.9 14 23 13.1 23 12V2Z" fill="#9CA3AF" />
      <text
        x="9"
        y="32"
        fontSize="10"
        fontWeight="700"
        fill="#9CA3AF"
        fontFamily="Inter, sans-serif"
        letterSpacing="1"
      >
        PDF
      </text>
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 5H9M9 5L5.5 1.5M9 5L5.5 8.5"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface StatusBadgeProps {
  status: "analyzed" | "processing" | "flagged";
}

function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center px-3 py-[3.5px] rounded-full text-xs font-semibold tracking-[0.6px] uppercase ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

interface CompanyAvatarProps {
  initial: string;
  darkBg: boolean;
}

function CompanyAvatar({ initial, darkBg }: CompanyAvatarProps) {
  return (
    <div
      className={`flex items-center justify-center w-10 h-10 flex-shrink-0 ${
        darkBg ? "bg-black" : "bg-[#F3F4F6]"
      }`}
    >
      <span
        className={`text-xs font-bold leading-4 ${
          darkBg ? "text-white" : "text-black"
        }`}
      >
        {initial}
      </span>
    </div>
  );
}

export default function WorkspacePage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [thesis, setThesis] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleDragOver(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(): void {
    setIsDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") {
      setUploadedFile(file);
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>): void {
    const file = e.target.files?.[0] ?? null;
    setUploadedFile(file);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <WorkspaceNav />

      {/* Main */}
      <main className="flex-1 flex flex-col items-center pt-32 px-12">
        <div className="w-full max-w-[896px] pb-40">
          {/* Heading */}
          <h1 className="text-[48px] font-semibold leading-[72px] tracking-[-1.2px] text-black text-center">
            Start New
            <br />
            Analysis
          </h1>

          {/* Upload area — mt-16 = 64px gap (136px top - 72px heading = 64px) */}
          <div className="mt-16">
            <div
              className={`relative flex flex-col items-center justify-center h-96 border-2 cursor-pointer transition-colors ${
                isDragging
                  ? "border-black bg-gray-50"
                  : "border-[#D1D5DB] bg-[rgba(249,250,251,0.3)]"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              {uploadedFile ? (
                <div className="flex flex-col items-center gap-4">
                  <PdfIcon />
                  <p className="text-xl font-medium text-black">
                    {uploadedFile.name}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="mb-6">
                    <PdfIcon />
                  </div>
                  <p className="text-xl font-medium text-black">
                    Drag and drop pitch deck (PDF)
                  </p>
                  <p className="mt-2 text-base text-[#666666]">
                    or{" "}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="underline text-[#666666] hover:text-black transition-colors"
                    >
                      browse files
                    </button>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Investment thesis — mt-8 = 32px gap (552px - 520px = 32px) */}
          <div className="mt-8 flex flex-col gap-3">
            <label className="text-xs font-bold tracking-[1.2px] uppercase text-[#6B7280] leading-4">
              Optional: Investment Thesis
            </label>
            <textarea
              value={thesis}
              onChange={(e) => setThesis(e.target.value)}
              placeholder="Paste your investment thesis here for context-aware analysis..."
              className="w-full h-[60px] border-2 border-[#E5E7EB] px-6 py-[17.5px] text-lg text-black placeholder:text-[#D1D5DB] focus:outline-none focus:border-black resize-none leading-[22px]"
            />
          </div>

          {/* Recent Analyses — mt-[328px] gap (968px - 640px = 328px) */}
          <div className="mt-[328px] flex flex-col gap-12">
            {/* Section header */}
            <div className="flex flex-row justify-between items-end">
              <h2 className="text-2xl font-semibold leading-8 tracking-[-0.6px] text-black">
                Recent
                <br />
                Analyses
              </h2>
              <button
                type="button"
                className="flex flex-row items-center gap-2"
              >
                <span className="text-sm font-bold tracking-[1.4px] uppercase text-black leading-5">
                  View All
                </span>
                <ArrowRightIcon />
              </button>
            </div>

            {/* Table with black top border */}
            <div className="border-t border-black">
              {/* Header row */}
              <div className="flex flex-row h-[65px] items-center border-b border-[#F3F4F6]">
                <div className="flex-none w-[396px] px-[1px] flex items-center">
                  <span className="text-xs font-bold tracking-[1.2px] uppercase text-[#9CA3AF] leading-4">
                    Company Name
                  </span>
                </div>
                <div className="flex-none w-[193px] px-[1px] flex items-center">
                  <span className="text-xs font-bold tracking-[1.2px] uppercase text-[#9CA3AF] leading-4">
                    Date
                  </span>
                </div>
                <div className="flex-none w-[213px] px-[1px] flex items-center">
                  <span className="text-xs font-bold tracking-[1.2px] uppercase text-[#9CA3AF] leading-4">
                    Status
                  </span>
                </div>
                <div className="flex-1 px-[1px] flex justify-end">
                  <span className="text-xs font-bold tracking-[1.2px] uppercase text-[#9CA3AF] leading-4">
                    Score
                  </span>
                </div>
              </div>

              {/* Body rows */}
              <div className="flex flex-col">
                {ANALYSES.map((analysis, index) => (
                  <div
                    key={analysis.id}
                    className={`flex flex-row h-[105px] items-center ${
                      index > 0 ? "border-t border-[#F9FAFB]" : ""
                    }`}
                  >
                    {/* Company */}
                    <div className="flex-none w-[396px] flex flex-row items-center gap-4">
                      <CompanyAvatar
                        initial={analysis.initial}
                        darkBg={analysis.darkBg}
                      />
                      <span className="text-lg font-medium text-black leading-7">
                        {analysis.company}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex-none w-[193px] px-[1px]">
                      <span className="text-base text-[#666666]">
                        {analysis.date}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="flex-none w-[213px] px-[1px]">
                      <StatusBadge status={analysis.status} />
                    </div>

                    {/* Score */}
                    <div className="flex-1 flex justify-end px-[1px]">
                      <span
                        className={`text-lg font-bold leading-7 ${
                          analysis.score === null
                            ? "text-[#D1D5DB]"
                            : "text-black"
                        }`}
                      >
                        {analysis.score !== null
                          ? analysis.score.toFixed(1)
                          : "--"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer with top border */}
      <div className="border-t border-[#F3F4F6]">
        <Footer />
      </div>
    </div>
  );
}
