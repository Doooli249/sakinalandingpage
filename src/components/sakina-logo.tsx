"use client";

/**
 * SakinaLogo — Seed of Life geometric flower
 *
 * Geometry: 7 circles of equal radius r=45, center + 6 outer at 60° intervals,
 * center-to-center = r. This produces the classic Islamic-geometric "Seed of Life"
 * pattern with 6 outer pointed tips. One tip points directly up (90° standard).
 *
 * Outer flower tip coordinates (at r√3 from center):
 *   Top:         (100, 22.06)
 *   Upper-right: (167.5, 61.03)
 *   Lower-right: (167.5, 138.97)
 *   Bottom:      (100, 177.94)
 *   Lower-left:  (32.5, 138.97)
 *   Upper-left:  (32.5, 61.03)
 *
 * Each outer arc sweeps 120° (clockwise, SVG sweep-flag=1, large-arc-flag=0).
 */

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

// ── New 6-Petal Logo Path ────────────────────────────────────────────────────────

// Pointed petal with a wide circular base, drawn to overlap beautifully
const FLOWER_PATH = "M 50 43 C 68 35, 68 15, 50 2 C 32 15, 32 35, 50 43 Z";

// ── Component ─────────────────────────────────────────────────────────────────

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

  // Helper so we don't repeat ourselves
  const fadeIn = (d: number, dur = 0.45) =>
    animate
      ? {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay: delay + d, duration: dur, ease: "easeOut" as const },
        }
      : {};

  // 6 petals rotated by 60 degrees each
  const petals = [0, 1, 2, 3, 4, 5];

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Container for the 6 petals */}
      <g>
        {petals.map((index) => {
          return (
            <motion.g 
              key={index} 
              style={{ transformOrigin: "50px 50px", transform: `rotate(${index * 60}deg)` }}
              // If blooming, stagger the petal appearances slightly
              {...(animate
                ? {
                    initial: { opacity: 0, scale: 0.8 },
                    animate: { opacity: 1, scale: 1 },
                    transition: {
                      delay: delay + 0.1 + (index * 0.05), // Stagger petals slightly
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1] as const,
                    },
                  }
                : {})}
            >
              {/* Solid Rose Fill */}
              <motion.path 
                d={FLOWER_PATH} 
                fill="#D9778A" 
                {...fadeIn(0.1, 0.5)}
              />
              
              {/* Champagne Outline drawing effect */}
              <motion.path
                d={FLOWER_PATH}
                fill="none"
                stroke="#D4B483"
                strokeWidth="1.5"
                strokeLinejoin="round"
                {...(animate
                  ? {
                      initial: { pathLength: 0, opacity: 0 },
                      animate: { pathLength: 1, opacity: 1 },
                      transition: { delay: delay + 0.3, duration: 1.2, ease: "easeOut" as const },
                    }
                  : {})}
              />
            </motion.g>
          );
        })}
      </g>
      {/* Center circle cut-out */}
      <motion.circle 
        cx="50" 
        cy="50" 
        r="6.5" 
        fill="#FAF6F2"
        {...(animate 
          ? {
              initial: { scale: 0 },
              animate: { scale: 1 },
              transition: { delay: delay + 0.8, duration: 0.4, ease: "backOut" }
            }
          : {})}
      />
    </svg>
  );
}
