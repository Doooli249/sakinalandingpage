"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const FLOWER_PATH = "M 50 43 C 68 35, 68 15, 50 2 C 32 15, 32 35, 50 43 Z";
const SECTION_IDS = ["hero", "problem", "solution", "personas", "waitlist", "faq"];
const SECTION_LABELS = ["About", "Problem", "Solution", "Who it's for", "Join", "FAQ"];

export function PetalProgress() {
  const [filled, setFilled] = useState(0);
  const shouldReduce = useReducedMotion();
  const allPulsed = filled >= 6;

  useEffect(() => {
    const observers = SECTION_IDS.map((id, idx) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setFilled((prev) => Math.max(prev, idx + 1));
          }
        },
        { threshold: 0.2, rootMargin: "0px 0px -5% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <div
      className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col items-center gap-4 select-none"
      aria-hidden="true"
    >
      {/* Flower — fills petal by petal */}
      <motion.div
        animate={
          allPulsed && !shouldReduce
            ? { scale: [1, 1.2, 1], filter: ["brightness(1)", "brightness(1.3)", "brightness(1)"] }
            : {}
        }
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <svg viewBox="0 0 100 100" width={34} height={34}>
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <g
              key={idx}
              style={{ transformOrigin: "50px 50px", transform: `rotate(${idx * 60}deg)` }}
            >
              {/* Champagne outline — always visible, very subtle */}
              <path
                d={FLOWER_PATH}
                fill="none"
                stroke="#D4B483"
                strokeWidth="1.8"
                opacity={0.28}
              />
              {/* Rose fill — fades in when section is reached */}
              <motion.path
                d={FLOWER_PATH}
                fill="#D9778A"
                initial={{ opacity: 0 }}
                animate={{ opacity: idx < filled ? 0.88 : 0 }}
                transition={
                  shouldReduce
                    ? { duration: 0 }
                    : { duration: 0.4, delay: 0, ease: "easeOut" }
                }
              />
            </g>
          ))}
          {/* Centre cutout */}
          <circle cx="50" cy="50" r="6" fill="#FAF6F2" />
        </svg>
      </motion.div>

      {/* Section dot indicators */}
      <div className="flex flex-col gap-[7px]">
        {SECTION_IDS.map((id, idx) => {
          const isActive = idx < filled;
          const isCurrent = idx === filled - 1;
          return (
            <a
              key={id}
              href={`#${id}`}
              title={SECTION_LABELS[idx]}
              className="flex items-center justify-center group"
            >
              <motion.div
                className="rounded-full transition-all"
                style={{ width: 5, height: 5 }}
                animate={{
                  backgroundColor: isActive ? "#D9778A" : "rgba(28,28,28,0.15)",
                  scale: isCurrent ? 1.5 : 1,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
