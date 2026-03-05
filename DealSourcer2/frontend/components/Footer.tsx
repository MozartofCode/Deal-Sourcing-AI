import { AresLogo } from "@/components/AresLogo";

export function Footer() {
  return (
    <footer className="relative w-full bg-white h-[434px]">
      {/* Logo — centered, slightly above the footer top */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-[29px]">
        <AresLogo className="w-10 h-12" />
      </div>

      {/* Footer content row */}
      <div className="absolute left-[48px] right-[48px] top-[200px] flex justify-center gap-16">

        {/* Left: tagline */}
        <div className="w-[456px] flex-shrink-0">
          <p className="text-lg leading-[29px] text-[#666666] max-w-[384px]">
            Built for the next generation of capital allocators. Precision intelligence for high-stakes decisions.
          </p>
        </div>

        {/* Right: link columns */}
        <div className="flex flex-1 gap-12">

          {/* Platform */}
          <div className="flex flex-col gap-8 flex-1">
            <h4 className="text-sm font-bold tracking-[0.7px] uppercase text-black leading-5">
              Platform
            </h4>
            <ul className="flex flex-col gap-4">
              <li><a href="#" className="text-base text-[#666666] leading-6 hover:text-black transition-colors">Intelligence</a></li>
              <li><a href="#" className="text-base text-[#666666] leading-6 hover:text-black transition-colors">Benchmarks</a></li>
              <li><a href="#" className="text-base text-[#666666] leading-6 hover:text-black transition-colors">Reporting</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-8 flex-1">
            <h4 className="text-sm font-bold tracking-[0.7px] uppercase text-black leading-5">
              Company
            </h4>
            <ul className="flex flex-col gap-4">
              <li><a href="#" className="text-base text-[#666666] leading-6 hover:text-black transition-colors">About</a></li>
              <li><a href="#" className="text-base text-[#666666] leading-6 hover:text-black transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-8 flex-1">
            <h4 className="text-sm font-bold tracking-[0.7px] uppercase text-black leading-5">
              Legal
            </h4>
            <ul className="flex flex-col gap-4">
              <li><a href="#" className="text-base text-[#666666] leading-6 hover:text-black transition-colors">Privacy</a></li>
              <li><a href="#" className="text-base text-[#666666] leading-6 hover:text-black transition-colors">Terms</a></li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}
