import { cn } from "@/lib/utils";

type SakinaFlowerLogoProps = {
  className?: string;
};

export function SakinaFlowerLogo({ className }: SakinaFlowerLogoProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      <circle cx="60" cy="60" r="9" stroke="currentColor" strokeWidth="4" />
      <path
        d="M60 22C73 22 83 32 83 45C83 58 73 66 60 66C47 66 37 58 37 45C37 32 47 22 60 22Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M93 45C106 45 116 55 116 68C116 81 106 91 93 91C80 91 70 81 70 68C70 55 80 45 93 45Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M27 45C40 45 50 55 50 68C50 81 40 91 27 91C14 91 4 81 4 68C4 55 14 45 27 45Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M60 70C73 70 83 80 83 93C83 106 73 116 60 116C47 116 37 106 37 93C37 80 47 70 60 70Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
