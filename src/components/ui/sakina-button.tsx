import React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SakinaButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "light" | "dark";
  href?: string;
  className?: string;
  animateBackground?: boolean;
}

export const SakinaButton = React.forwardRef<HTMLButtonElement, SakinaButtonProps>(
  ({ className, children, variant = "light", href, animateBackground = true, ...props }, ref) => {
    
    // Base layout mimicking ButtonWithIconDemo
    const baseClasses = "relative font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden cursor-pointer inline-flex items-center justify-center outline-none";
    
    // Brand specific pill styling relying on existing globals.css gradients
    const lightClasses = "cta-pill border-rose/30 text-white"; 
    const darkClasses = "cta-pill-dark border-cream/20 text-charcoal";

    // Icon circle styles
    const iconLightClasses = "bg-white text-rose/90"; 
    const iconDarkClasses = "bg-charcoal text-cream/90"; 

    // Pulse animations
    const pulseClasses = variant === "light" ? "animate-warm-pulse" : "animate-dark-pulse";

    const content = (
      <>
        <span className="relative z-10 transition-all duration-500 flex items-center h-full">
          {children}
        </span>
        <div 
          className={cn(
            "absolute right-1 top-1 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45",
            variant === "light" ? iconLightClasses : iconDarkClasses
          )}
        >
          <ArrowUpRight size={18} strokeWidth={2.5} />
        </div>
      </>
    );

    if (href) {
      return (
        <a href={href} className={cn(baseClasses, variant === "light" ? lightClasses : darkClasses, animateBackground && pulseClasses, className)}>
          {content}
        </a>
      );
    }

    return (
      <button ref={ref} className={cn(baseClasses, variant === "light" ? lightClasses : darkClasses, animateBackground && pulseClasses, className)} {...props}>
        {content}
      </button>
    );
  }
);

SakinaButton.displayName = "SakinaButton";
