"use client";

import { AresLogo } from "@/components/AresLogo";

function UserCircleIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 17 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8.5" cy="8.5" r="8" stroke="black" strokeWidth="1.5" />
      <circle cx="8.5" cy="6.5" r="2.5" fill="black" />
      <path
        d="M2 15.5C3.2 12.5 5.5 11 8.5 11C11.5 11 13.8 12.5 15 15.5"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WorkspaceNav() {
  return (
    <nav className="sticky top-0 z-50 w-full h-[81px] bg-white border-b border-[#F3F4F6]">
      <div className="flex flex-row justify-between items-center h-[80px] px-12 max-w-[1280px] mx-auto">
        {/* Logo */}
        <a href="/">
          <AresLogo className="w-8 h-9" />
        </a>

        {/* Nav links */}
        <div className="flex flex-row items-center">
          <a
            href="/dashboard"
            className="text-[13px] font-bold tracking-[1.95px] uppercase text-black leading-5"
          >
            Dashboard
          </a>

          <div className="pl-12">
            <a
              href="/workspace"
              className="text-[13px] font-bold tracking-[1.95px] uppercase text-black leading-5 border-b-2 border-black pb-[3px]"
            >
              Workspace
            </a>
          </div>

          <div className="pl-12">
            <a
              href="/portfolio"
              className="text-[13px] font-bold tracking-[1.95px] uppercase text-black leading-5"
            >
              Portfolio
            </a>
          </div>

          <div className="pl-12">
            <a
              href="/reports"
              className="text-[13px] font-bold tracking-[1.95px] uppercase text-black leading-5"
            >
              Reports
            </a>
          </div>

          {/* Vertical separator + User Profile */}
          <div className="pl-12">
            <div className="flex flex-row items-center gap-3 border-l border-[#E5E7EB] pl-8">
              <UserCircleIcon />
              <a
                href="/profile"
                className="text-[13px] font-bold tracking-[1.95px] uppercase text-black leading-5"
              >
                User Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
