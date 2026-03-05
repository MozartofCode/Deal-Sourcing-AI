"use client";

import { AresLogo } from "@/components/AresLogo";

interface NavProps {
  activePath?: string;
}

export function Nav({ activePath }: NavProps) {
  const linkClass = (path: string) => {
    const base =
      "text-sm tracking-[0.35px] text-black hover:text-gray-500 transition-colors";
    const active = "font-bold";
    const inactive = "font-medium";
    return `${base} ${activePath === path ? active : inactive}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[81px] bg-white/80 backdrop-blur-[6px] border-b border-[#F3F4F6]">
      <div className="flex items-center justify-between h-[80px] px-8 max-w-[1280px] mx-auto">
        <a href="/">
          <AresLogo className="w-8 h-9" />
        </a>
        <div className="flex items-center">
          <a href="/" className={linkClass("/")}>
            Home
          </a>
          <a href="/#features" className={`${linkClass("/#features")} pl-10`}>
            Features
          </a>
          <a href="/pricing" className={`${linkClass("/pricing")} pl-10`}>
            Pricing
          </a>
          <a href="/#demo" className={`${linkClass("/#demo")} pl-10`}>
            Demo
          </a>
          <a
            href="/login"
            className="ml-10 bg-black text-white px-6 py-[10px] text-sm font-medium tracking-[0.35px] hover:bg-neutral-800 transition-colors"
          >
            Log In
          </a>
        </div>
      </div>
    </nav>
  );
}
