"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export function ScrollProgressPetal() {
  const { scrollYProgress } = useScroll();
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 6 main sections mapping
  const activePetals = useTransform(scrollYProgress, [0, 1], [0, 6.5]);

  // Pointed petal with a wide circular base, drawn to overlap beautifully
  const petalPath = "M 50 43 C 68 35, 68 15, 50 2 C 32 15, 32 35, 50 43 Z";

  // Hooks must be called at the top level
  const fill0 = useTransform(activePetals, [0, 1], [0, 1]);
  const fill1 = useTransform(activePetals, [1, 2], [0, 1]);
  const fill2 = useTransform(activePetals, [2, 3], [0, 1]);
  const fill3 = useTransform(activePetals, [3, 4], [0, 1]);
  const fill4 = useTransform(activePetals, [4, 5], [0, 1]);
  const fill5 = useTransform(activePetals, [5, 6], [0, 1]);
  
  const fills = [fill0, fill1, fill2, fill3, fill4, fill5];

  // Pulse effect transforms
  const pulseOpacity = useTransform(activePetals, [5.9, 6], [0, 1]);
  const pulseScale = useTransform(activePetals, [5.9, 6, 6.5], [1, 1.4, 1.5]);

  return (
    <div
      className={`fixed z-[90] pointer-events-none transition-all duration-500 ease-out ${
        isMobile
          ? "bottom-6 left-1/2 -translate-x-1/2 scale-75"
          : "right-10 top-1/2 -translate-y-1/2"
      }`}
    >
      <div className="relative w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
        {/* The SVG Container */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm"
        >
          {fills.map((fill, index) => {
            return (
              <g key={index} style={{ transformOrigin: "50px 50px", transform: `rotate(${index * 60}deg)` }}>
                {/* Outline (always visible, champagne gold) */}
                <path
                  d={petalPath}
                  fill="none"
                  stroke="#D4B483" // Champagne
                  strokeWidth="1.5"
                  className="transition-colors duration-300"
                />
                {/* Dynamic Fill (Rose) */}
                <motion.path
                  d={petalPath}
                  fill="#D9778A" // Rose
                  style={{ opacity: fill }}
                />
              </g>
            );
          })}
          {/* Center hole mask representation */}
          <circle cx="50" cy="50" r="6.5" fill="#FAF6F2" opacity="0.9" />
        </svg>

        {/* Pulse effect when fully scrolled */}
        <motion.div
           className="absolute inset-0 rounded-full bg-rose/20 -z-10"
           style={{
              opacity: pulseOpacity,
              scale: pulseScale,
           }}
        />
      </div>
    </div>
  );
}
