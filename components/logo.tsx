import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6 stroke-foreground", className)}
    >
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
      <path d="M8.5 8.5v.01" />
      <path d="M16 15.5v.01" />
      <path d="M12 12v.01" />
      <path d="M11 17v.01" />
      <path d="M7 14v.01" />
    </svg>
  );
}
