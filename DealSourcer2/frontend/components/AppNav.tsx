"use client";

import { AresLogo } from "@/components/AresLogo";

function UserIcon(): React.ReactElement {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8.5" cy="5.5" r="3" stroke="black" strokeWidth="1.5" />
      <path
        d="M1.5 16C1.5 12.686 4.686 10 8 10H9C12.314 10 15.5 12.686 15.5 16"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface AppNavProps {
  activePath?: string;
}

export function AppNav({ activePath }: AppNavProps): React.ReactElement {
  const base =
    "text-[13px] font-bold uppercase tracking-[1.95px] text-black hover:text-gray-500 transition-colors whitespace-nowrap";

  const cls = (path: string): string =>
    activePath === path ? `${base} pb-[3px] border-b-2 border-black` : base;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[81px] bg-white border-b border-[#F3F4F6]">
      <div className="flex items-center justify-between h-[80px] px-12 max-w-[1280px] mx-auto">
        <a href="/">
          <AresLogo className="w-8 h-9" />
        </a>

        <div className="flex items-center">
          <a href="/dashboard" className={cls("/dashboard")}>
            Dashboard
          </a>
          <a href="/workspace" className={`${cls("/workspace")} pl-12`}>
            Workspace
          </a>
          <a href="/portfolio" className={`${cls("/portfolio")} pl-12`}>
            Portfolio
          </a>
          <a href="/reports" className={`${cls("/reports")} pl-12`}>
            Reports
          </a>

          {/* Vertical separator + User Profile */}
          <div className="pl-12">
            <div className="flex items-center gap-3 pl-8 border-l border-[#E5E7EB]">
              <UserIcon />
              <a href="/profile" className={cls("/profile")}>
                User Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
