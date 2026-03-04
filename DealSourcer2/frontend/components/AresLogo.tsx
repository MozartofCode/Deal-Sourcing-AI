interface AresLogoProps {
  className?: string;
}

export function AresLogo({ className = "w-[46px] h-[52px]" }: AresLogoProps) {
  return (
    <svg
      viewBox="0 0 46 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M23 0L44 50L23 38L2 50L23 0Z" fill="black" />
    </svg>
  );
}
