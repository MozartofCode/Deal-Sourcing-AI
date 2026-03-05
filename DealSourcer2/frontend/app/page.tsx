"use client";

import { useState } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

function BarChartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="13" width="6" height="9" rx="1" fill="black" />
      <rect x="8" y="7" width="6" height="15" rx="1" fill="black" />
      <rect x="16" y="1" width="6" height="21" rx="1" fill="black" />
    </svg>
  );
}

function GridMapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="9" height="9" rx="1" fill="black" />
      <rect x="13" y="0" width="9" height="9" rx="1" fill="black" />
      <rect x="0" y="13" width="9" height="9" rx="1" fill="black" />
      <rect x="13" y="13" width="9" height="9" rx="1" fill="black" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="13.5" cy="13.5" r="12" stroke="black" strokeWidth="2" />
      <circle cx="13.5" cy="13.5" r="5.5" stroke="black" strokeWidth="2" />
      <circle cx="13.5" cy="13.5" r="2" fill="black" />
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
    icon: <BarChartIcon />,
    title: "Automated DD",
    description:
      "Rapid, comprehensive analysis of pitch decks and cap tables. Identify red flags in seconds, not weeks.",
  },
  {
    icon: <GridMapIcon />,
    title: "Market Mapping",
    description:
      "Instant visualization of competitor landscapes and whitespace opportunities in the global ecosystem.",
  },
  {
    icon: <TargetIcon />,
    title: "Sentiment Engine",
    description:
      "Scouring social media and news for real-time founder reputation and product-market fit signals.",
  },
];

export default function LandingPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="relative bg-white overflow-x-hidden">

      <Nav activePath="/" />

      {/* ── Page sections ── */}
      <div className="flex flex-col gap-[200px] pb-20">

        {/* ── Hero ── */}
        <section className="flex flex-col items-center pt-[261px] pb-[181px] px-6 min-h-[851px]">
          <div className="flex flex-col items-center gap-8 w-full max-w-[896px]">

            {/* Headline */}
            <h1 className="text-[84px] leading-[92px] font-semibold tracking-[-1.68px] text-black text-center w-full">
              Ai-powered venture analysis
            </h1>

            {/* Subtitle */}
            <div className="flex flex-col items-center pb-7 max-w-[672px] w-full">
              <p className="text-2xl leading-8 text-[#666666] text-center">
                Upload pitch decks. Get instant thesis alignment, market analysis, and founder insights.
              </p>
            </div>

            {/* Pill email input */}
            <div className="flex flex-row items-start p-[6px] border border-black rounded-full bg-white w-[512px]">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-6 py-[15px] text-lg text-[#6B7280] placeholder:text-[#6B7280] bg-transparent focus:outline-none"
              />
              <button
                type="button"
                className="flex items-center gap-2 bg-black rounded-full px-8 py-[14px] text-white text-base font-normal whitespace-nowrap hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Get Started →
              </button>
            </div>

          </div>
        </section>

        {/* ── Features ── */}
        <section id="features" className="px-6 w-full">
          <div className="flex flex-row justify-center items-start gap-[100px] max-w-[1184px] mx-auto">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col w-[328px]">
                {/* Icon circle */}
                <div className="w-20 h-20 rounded-full bg-[#F7F7F7] flex items-center justify-center mb-10">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-semibold tracking-[1.2px] uppercase text-black leading-8 mb-6">
                  {feature.title}
                </h3>
                <p className="text-lg leading-[29px] text-[#666666]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Trusted By ── */}
        <section className="w-full bg-[#FAFAFA] py-[120px] px-8">
          <div className="flex flex-col gap-16 max-w-[1280px] mx-auto">
            <p className="text-sm font-semibold tracking-[1.4px] uppercase text-[#666666] text-center">
              Trusted by Leading Firms
            </p>
            <div className="flex justify-center items-center gap-24">
              <span className="text-2xl font-bold text-black opacity-70">
                SEQUOIA |||
              </span>
              <span className="text-[30px] font-bold tracking-[-1.5px] text-black opacity-70 leading-9">
                a16z
              </span>
              <div className="flex items-center gap-2 opacity-70">
                <span className="text-black font-bold text-base leading-none">/</span>
                <span className="text-xl font-medium tracking-[4px] uppercase text-black">
                  BENCHMARK
                </span>
              </div>
              <span className="text-2xl font-bold tracking-[2.4px] uppercase text-black opacity-70">
                KLEINER
              </span>
              <span className="text-xl font-bold tracking-[-0.5px] uppercase text-black opacity-70">
                FOUNDER&apos;S FUND
              </span>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <Footer />

      </div>

      {/* Bottom-right decoration */}
      <div className="absolute right-8 bottom-8 w-12 h-12" />
    </div>
  );
}
