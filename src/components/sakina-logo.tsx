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

// ── Seed of Life paths ────────────────────────────────────────────────────────

const FLOWER_PATH =
  "M 100 22.06 " +
  "A 45 45 0 0 1 167.5 61.03 " +
  "A 45 45 0 0 1 167.5 138.97 " +
  "A 45 45 0 0 1 100 177.94 " +
  "A 45 45 0 0 1 32.5 138.97 " +
  "A 45 45 0 0 1 32.5 61.03 " +
  "A 45 45 0 0 1 100 22.06 Z";

// 7 circles: center (C0) + 6 outer at 0°, 60°, 120°, 180°, 240°, 300°
// In SVG coordinates (y-down), 60° standard = upper-right region
const CIRCLES = [
  { cx: 100,   cy: 100    }, // C0 — center
  { cx: 145,   cy: 100    }, // C1 — 0°
  { cx: 122.5, cy: 61.03  }, // C2 — 60°
  { cx: 77.5,  cy: 61.03  }, // C3 — 120°
  { cx: 55,    cy: 100    }, // C4 — 180°
  { cx: 77.5,  cy: 138.97 }, // C5 — 240°
  { cx: 122.5, cy: 138.97 }, // C6 — 300°
];

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
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const clipId = `fc-${uid}`;
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

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* Clip path constrains the inner circle strokes to the flower silhouette */}
        <clipPath id={clipId}>
          <path d={FLOWER_PATH} />
        </clipPath>
      </defs>

      {/* ── Rose fill ── */}
      <motion.path d={FLOWER_PATH} fill="#D9778A" {...fadeIn(0.1, 0.5)} />

      {/* ── 7 inner circles — cream strokes, clipped ── */}
      <g clipPath={`url(#${clipId})`}>
        {CIRCLES.map((c, i) => (
          <motion.circle
            key={i}
            cx={c.cx}
            cy={c.cy}
            r={45}
            fill="none"
            stroke="#FAF6F2"
            strokeWidth="2"
            {...(animate
              ? {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  transition: {
                    delay: delay + 0.4 + i * 0.07,
                    duration: 0.4,
                    ease: "easeOut" as const,
                  },
                }
              : {})}
          />
        ))}
      </g>

      {/* ── Champagne outer border — draws in via pathLength ── */}
      <motion.path
        d={FLOWER_PATH}
        fill="none"
        stroke="#D4B483"
        strokeWidth="3"
        strokeLinejoin="round"
        {...(animate
          ? {
              initial: { pathLength: 0, opacity: 0 },
              animate: { pathLength: 1, opacity: 1 },
              transition: { delay, duration: 1.0, ease: "easeOut" as const },
            }
          : {})}
      />

      {/* ── Center dot — springs in last ── */}
      <motion.circle
        cx="100"
        cy="100"
        r={3.5}
        fill="#FAF6F2"
        {...(animate
          ? {
              initial: { scale: 0, opacity: 0 },
              animate: { scale: 1, opacity: 1 },
              // Subtle spring overshoot
              transition: {
                delay: delay + 0.95,
                duration: 0.35,
                ease: [0.34, 1.56, 0.64, 1] as const,
              },
            }
          : {})}
      />
    </svg>
  );
}
