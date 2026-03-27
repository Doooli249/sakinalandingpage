"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

interface SakinaLogoProps {
  /** Rendered pixel size (square) */
  size?: number;
  /** Trigger the bloom reveal animation */
  bloom?: boolean;
  /** Delay in seconds before bloom starts */
  delay?: number;
  className?: string;
}

export function SakinaLogo({
  size = 40,
  bloom = false,
  delay = 0,
  className = "",
}: SakinaLogoProps) {
  const shouldReduce = useReducedMotion();
  const animate = bloom && !shouldReduce;

  return (
    <motion.div
      className={className}
      initial={animate ? { opacity: 0, scale: 0.85, filter: "blur(4px)" } : false}
      animate={animate ? { opacity: 1, scale: 1, filter: "blur(0px)" } : false}
      transition={{
        delay,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
      }}
    >
      <Image
        src="/assets/sakina-logo.png"
        alt="Sakina Foundation Logo"
        width={size}
        height={size}
        className="object-contain drop-shadow-sm scale-[2.2]"
        priority
      />
    </motion.div>
  );
}
