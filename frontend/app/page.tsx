"use client";

import { useState } from "react";
import { AresLogo } from "@/components/AresLogo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: implement Supabase sign-in
  }

  return (
    <main className="relative min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* Content container */}
      <div className="flex flex-col items-center w-full max-w-[420px]">

        {/* Logo */}
        <div className="mb-16 flex items-center justify-center">
          <AresLogo />
        </div>

        {/* Form container */}
        <div className="w-full flex flex-col pb-4">

          {/* Inputs + Button */}
          <form onSubmit={handleSignIn} className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[60px] px-5 border border-[#E5E7EB] rounded-[10px] text-lg text-[#6B7280] placeholder:text-[#6B7280] bg-white focus:outline-none focus:border-gray-300"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[60px] px-5 border border-[#E5E7EB] rounded-[10px] text-lg text-[#6B7280] placeholder:text-[#6B7280] bg-white focus:outline-none focus:border-gray-300"
              />
            </div>

            <button
              type="submit"
              className="w-full h-[60px] bg-black text-white font-semibold text-lg uppercase tracking-[0.45px] rounded-[10px] hover:bg-neutral-900 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </form>

          {/* Links */}
          <div className="flex flex-col items-center pt-8">
            <a
              href="/forgot-password"
              className="text-xs font-semibold tracking-[1.2px] uppercase text-[#666666] leading-4 hover:text-black transition-colors"
            >
              Forgot Password?
            </a>
            <a
              href="/register"
              className="text-xs font-semibold tracking-[1.2px] uppercase text-[#666666] leading-4 hover:text-black transition-colors mt-4"
            >
              Create an Account
            </a>
          </div>

        </div>

        {/* ARES branding */}
        <p className="mt-8 text-[10px] font-bold tracking-[3px] uppercase text-[#9CA3AF]">
          Ares
        </p>

      </div>

      {/* Bottom-right decoration placeholder */}
      <div className="absolute right-8 bottom-8 w-12 h-12" />
    </main>
  );
}
