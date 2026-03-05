"use client";

import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { DemoCalendar } from "@/components/DemoCalendar";

function LightningIcon(): React.ReactElement {
  return (
    <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0L0 9.5H6.5L5.5 17L14 7.5H7.5L8 0Z" fill="black" />
    </svg>
  );
}

function ChipIcon(): React.ReactElement {
  return (
    <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="0" width="8" height="16" rx="1" fill="black" />
      <rect x="0" y="4" width="2" height="2" fill="black" />
      <rect x="0" y="8" width="2" height="2" fill="black" />
      <rect x="10" y="4" width="2" height="2" fill="black" />
      <rect x="10" y="8" width="2" height="2" fill="black" />
    </svg>
  );
}

function ShieldIcon(): React.ReactElement {
  return (
    <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 0L0 3.5V9C0 13 3 16 7 17C11 16 14 13 14 9V3.5L7 0Z" fill="black" />
    </svg>
  );
}

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <LightningIcon />,
    title: "Accelerated Workflow",
    description:
      "Reduce due diligence time by 70% with automated pitch deck ingestion and analysis.",
  },
  {
    icon: <ChipIcon />,
    title: "Proprietary AI Engine",
    description:
      "Leverage models trained specifically on private market data and investment theses.",
  },
  {
    icon: <ShieldIcon />,
    title: "Institutional Security",
    description:
      "Enterprise-grade data protection. Your deal flow data remains yours and private.",
  },
];

export default function DemoPage(): React.ReactElement {
  const [fullName, setFullName] = useState("");
  const [firmName, setFirmName] = useState("");
  const [workEmail, setWorkEmail] = useState("");

  return (
    <div className="relative bg-white overflow-x-hidden">
      <Nav activePath="/demo" />

      <div className="flex flex-col">

        {/* ── Hero section ── */}
        <section className="flex flex-col items-center pt-[160px] pb-[200px] px-8 min-h-[1400px]">
          <div className="flex flex-row items-start gap-24 w-full max-w-[1216px]">

            {/* Left: heading + feature bullets */}
            <div className="flex flex-col gap-12 w-[560px] flex-shrink-0">

              <h1 className="text-[48px] leading-[53px] font-semibold tracking-[-0.96px] text-black">
                Experience the future of venture analysis
              </h1>

              <div className="flex flex-col gap-8">
                {features.map((f) => (
                  <div key={f.title} className="flex flex-row items-start gap-6">
                    {/* Icon circle */}
                    <div className="w-10 h-10 rounded-full bg-[#F7F7F7] flex items-center justify-center flex-shrink-0">
                      {f.icon}
                    </div>
                    {/* Text */}
                    <div className="flex flex-col gap-2">
                      <h3 className="text-sm font-bold uppercase tracking-[0.7px] text-black leading-5">
                        {f.title}
                      </h3>
                      <p className="text-base text-[#666666] leading-[26px]">
                        {f.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right: booking form card */}
            <div className="flex-1 border border-[#F3F4F6] rounded-[2px] pt-10 px-10 pb-14">
              <div className="flex flex-col gap-6">

                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-[1.2px] text-[#666666] leading-4">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-[60px] border-2 border-[#E5E7EB] px-6 text-base text-[#6B7280] placeholder:text-[#6B7280] focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                {/* Firm Name + Work Email */}
                <div className="flex flex-row gap-6">
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-xs font-bold uppercase tracking-[1.2px] text-[#666666] leading-4">
                      Firm Name
                    </label>
                    <input
                      type="text"
                      placeholder="Ventures Inc."
                      value={firmName}
                      onChange={(e) => setFirmName(e.target.value)}
                      className="w-full h-[60px] border-2 border-[#E5E7EB] px-6 text-base text-[#6B7280] placeholder:text-[#6B7280] focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-xs font-bold uppercase tracking-[1.2px] text-[#666666] leading-4">
                      Work Email
                    </label>
                    <input
                      type="email"
                      placeholder="jane@firm.com"
                      value={workEmail}
                      onChange={(e) => setWorkEmail(e.target.value)}
                      className="w-full h-[60px] border-2 border-[#E5E7EB] px-6 text-base text-[#6B7280] placeholder:text-[#6B7280] focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                {/* Calendar date picker */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-[1.2px] text-[#666666] leading-4">
                    Select a Date
                  </label>
                  <DemoCalendar />
                </div>

                {/* Submit */}
                <button
                  type="button"
                  className="w-full h-[60px] bg-black text-white text-base font-bold uppercase tracking-[1.6px] hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Confirm Request
                </button>

              </div>
            </div>

          </div>
        </section>

        {/* ── Trusted By ── */}
        <section className="w-full bg-[#FAFAFA] py-[120px] px-8">
          <div className="flex flex-col gap-16 max-w-[1216px] mx-auto">
            <p className="text-sm font-semibold tracking-[1.4px] uppercase text-[#666666] text-center">
              Empowering Investment Teams At
            </p>
            <div className="flex justify-center items-center gap-24 opacity-50">
              <span className="text-2xl font-bold text-black">SEQUOIA |||</span>
              <span className="text-[30px] font-bold tracking-[-1.5px] text-black leading-9">a16z</span>
              <div className="flex items-center gap-2">
                <span className="text-black font-bold text-base leading-none">/</span>
                <span className="text-xl font-medium tracking-[4px] uppercase text-black">BENCHMARK</span>
              </div>
              <span className="text-2xl font-bold tracking-[2.4px] uppercase text-black">KLEINER</span>
              <span className="text-xl font-bold tracking-[-0.5px] uppercase text-black">
                FOUNDER&apos;S FUND
              </span>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <Footer />

      </div>
    </div>
  );
}
