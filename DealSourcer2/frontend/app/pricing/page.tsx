import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

function PersonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="6" r="4" stroke="black" strokeWidth="1.8" />
      <path d="M2 18c0-4.418 3.582-8 8-8s8 3.582 8 8" stroke="black" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg width="27" height="26" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="13.5" cy="13" r="11.1" stroke="black" strokeWidth="1.8" />
      <circle cx="13.5" cy="13" r="6" stroke="black" strokeWidth="1.8" />
      <path d="M13.5 2V0M13.5 26V24M2 13H0M26.5 13H27" stroke="black" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TableIcon() {
  return (
    <svg width="25" height="22" viewBox="0 0 25 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.9" y="0.9" width="23.2" height="20.2" rx="2.1" stroke="black" strokeWidth="1.8" />
      <line x1="0.9" y1="7" x2="24.1" y2="7" stroke="black" strokeWidth="1.8" />
      <line x1="8.5" y1="7" x2="8.5" y2="21.1" stroke="black" strokeWidth="1.8" />
      <line x1="16.5" y1="7" x2="16.5" y2="21.1" stroke="black" strokeWidth="1.8" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="17" height="13" viewBox="0 0 17 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.5 6L6.5 11L15.5 1.5" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface Plan {
  icon: React.ReactNode;
  name: string;
  price: string;
  priceLabel: string;
  features: string[];
  cta: string;
}

const plans: Plan[] = [
  {
    icon: <PersonIcon />,
    name: "Analyst",
    price: "$0",
    priceLabel: "/mo",
    features: [
      "5 pitch deck analyses/mo",
      "Basic market mapping",
      "PDF export",
    ],
    cta: "Get Started",
  },
  {
    icon: <BadgeIcon />,
    name: "Principal",
    price: "$499",
    priceLabel: "/mo",
    features: [
      "Unlimited analyses",
      "Advanced market mapping",
      "Sentiment engine",
      "Priority support",
    ],
    cta: "Get Started",
  },
  {
    icon: <TableIcon />,
    name: "Firm",
    price: "Custom",
    priceLabel: "",
    features: [
      "Everything in Principal",
      "Multi-seat access",
      "Custom integrations",
      "Dedicated success manager",
    ],
    cta: "Contact Sales",
  },
];

export default function PricingPage() {
  return (
    <div className="relative bg-white overflow-x-hidden">
      <Nav activePath="/pricing" />

      <div className="flex flex-col">

        {/* ── Hero ── */}
        <section className="flex flex-col items-center pt-[222px] pb-[95px] px-6 min-h-[600px]">
          <div className="flex flex-col items-center gap-8 w-full max-w-[896px]">

            <h1 className="text-[84px] leading-[92px] font-semibold tracking-[-1.68px] text-black text-center w-full">
              Simple, transparent pricing
            </h1>

            <div className="flex flex-col items-center max-w-[672px] w-full">
              <p className="text-2xl leading-8 text-[#666666] text-center">
                Start for free. Scale as your deal flow grows.
              </p>
            </div>

          </div>
        </section>

        {/* ── Pricing Cards ── */}
        <section className="px-6 w-full pb-[296px]">
          <div className="flex flex-row justify-center items-start gap-[100px] max-w-[1184px] mx-auto">
            {plans.map((plan) => (
              <div key={plan.name} className="flex flex-col w-[247px]">

                {/* Icon circle */}
                <div className="w-20 h-20 rounded-full bg-[#F7F7F7] flex items-center justify-center mb-2">
                  {plan.icon}
                </div>

                {/* Plan name */}
                <h3 className="text-2xl font-semibold tracking-[1.2px] uppercase text-black leading-8 mb-2">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-[48px] font-bold leading-none text-black">
                    {plan.price}
                  </span>
                  {plan.priceLabel && (
                    <span className="text-lg text-[#666666]">{plan.priceLabel}</span>
                  )}
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-6 mb-12">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckIcon />
                      <span className="text-base text-[#666666] leading-6">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  type="button"
                  className="w-full h-14 bg-black text-white text-sm font-semibold tracking-[0.35px] uppercase hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  {plan.cta}
                </button>

              </div>
            ))}
          </div>
        </section>

        {/* ── Trusted By ── */}
        <section className="w-full bg-[#FAFAFA] pt-[34px] pb-[120px] px-8">
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
    </div>
  );
}
