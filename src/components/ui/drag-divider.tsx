"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Chaos dot — floats on the dark left side
// Pre-compute random offsets to keep render pure
const CHAOS_DOT_OFFSETS = [
  { x1: 12, x2: -8, y1: -10, y2: 14, dur: 4.2 },
  { x1: -14, x2: 6, y1: 8, y2: -12, dur: 5.1 },
  { x1: 10, x2: -12, y1: -6, y2: 10, dur: 3.8 },
  { x1: -8, x2: 14, y1: 12, y2: -8, dur: 4.6 },
  { x1: 6, x2: -10, y1: -14, y2: 6, dur: 5.5 },
  { x1: -12, x2: 8, y1: 10, y2: -14, dur: 3.5 },
  { x1: 14, x2: -6, y1: -8, y2: 12, dur: 4.9 },
  { x1: -10, x2: 12, y1: 6, y2: -10, dur: 5.8 },
  { x1: 8, x2: -14, y1: -12, y2: 8, dur: 4.0 },
  { x1: -6, x2: 10, y1: 14, y2: -6, dur: 5.3 },
];

function ChaosDot({ x, y, delay, size, index }: { x: number; y: number; delay: number; size: number; index: number }) {
  const offsets = CHAOS_DOT_OFFSETS[index % CHAOS_DOT_OFFSETS.length];
  return (
    <motion.div
      className="absolute rounded-full bg-red-500/15 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      animate={{
        x: [0, offsets.x1, offsets.x2, 0],
        y: [0, offsets.y1, offsets.y2, 0],
        opacity: [0.1, 0.4, 0.1],
      }}
      transition={{
        duration: offsets.dur,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Ambient label cluster for left side — things banks fund with your money
const CHAOS_LABELS = [
  { text: "Fossil Fuels", x: 14, y: 15 },
  { text: "Weapons", x: 68, y: 12 },
  { text: "Private Prisons", x: 10, y: 72 },
  { text: "Derivatives", x: 64, y: 70 },
  { text: "Payday Lenders", x: 72, y: 42 },
  { text: "Tobacco", x: 8, y: 44 },
];

// Stable chaos dot positions
const CHAOS_DOTS = [
  { x: 12, y: 22, delay: 0, size: 4 },
  { x: 73, y: 14, delay: 0.8, size: 3 },
  { x: 45, y: 68, delay: 1.4, size: 5 },
  { x: 82, y: 54, delay: 0.3, size: 3 },
  { x: 28, y: 80, delay: 2.1, size: 4 },
  { x: 60, y: 38, delay: 1.0, size: 3 },
  { x: 18, y: 50, delay: 1.7, size: 4 },
  { x: 90, y: 82, delay: 0.5, size: 3 },
  { x: 35, y: 12, delay: 0.6, size: 5 },
  { x: 55, y: 85, delay: 1.2, size: 3 },
];

export function DragDivider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const shouldReduce = useReducedMotion();

  // Mobile: auto-animate the slider back and forth
  useEffect(() => {
    if (hasInteracted || isDragging) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile || shouldReduce) return;

    let t = 0;
    const id = setInterval(() => {
      t += 0.012;
      setSplit(50 + Math.sin(t) * 18);
    }, 16);
    return () => clearInterval(id);
  }, [hasInteracted, isDragging, shouldReduce]);

  const getPercent = useCallback((clientX: number) => {
    if (!containerRef.current) return 50;
    const rect = containerRef.current.getBoundingClientRect();
    return Math.max(10, Math.min(90, ((clientX - rect.left) / rect.width) * 100));
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setHasInteracted(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setSplit(getPercent(e.clientX));
  };

  const handlePointerUp = () => setIsDragging(false);

  const handleContainerPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setSplit(getPercent(e.clientX));
  };

  return (
    <div>
      <div
        ref={containerRef}
        className="relative overflow-hidden select-none rounded-2xl md:rounded-3xl border border-charcoal/[0.06]"
        style={{ height: "clamp(480px, 80vh, 750px)" }}
        onPointerMove={handleContainerPointerMove}
        onPointerUp={handlePointerUp}
        aria-label="Drag to compare traditional banking vs Sakina"
        role="img"
      >
        {/* ── LEFT — Chaos (traditional bank) ── */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `polygon(0 0, ${split}% 0, ${split}% 100%, 0 100%)` }}
        >
          <div className="absolute inset-0 bg-[#0D0B09]" />
          {/* Dark red ambient glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,rgba(180,40,40,0.12),transparent_70%)]" />

          {/* Ambient noise dots */}
          {CHAOS_DOTS.map((d, i) => (
            <ChaosDot key={i} {...d} index={i} />
          ))}

          {/* Floating chaos labels — things your bank funds */}
          {CHAOS_LABELS.map((label, i) => (
            <motion.div
              key={label.text}
              className="absolute pointer-events-none"
              style={{ left: `${label.x}%`, top: `${label.y}%` }}
              animate={
                shouldReduce
                  ? {}
                  : {
                      opacity: [0.45, 0.8, 0.45],
                      y: [0, -8, 0],
                    }
              }
              transition={{
                duration: 3 + i * 0.7,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-[12px] md:text-[14px] uppercase tracking-[0.18em] text-red-400/70 font-semibold whitespace-nowrap">
                {label.text}
              </span>
            </motion.div>
          ))}

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
            <p className="text-[12px] md:text-[13px] uppercase tracking-[0.3em] text-cream/70 font-semibold mb-5">
              Your money at a traditional bank
            </p>

            {/* Big dramatic stat */}
            <motion.p
              className="font-headline text-[clamp(4rem,10vw,7rem)] font-bold text-red-500/60 leading-none mb-1"
              animate={shouldReduce ? {} : { opacity: [0.5, 0.75, 0.5] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              97%
            </motion.p>
            <p className="text-[13px] md:text-[14px] uppercase tracking-[0.22em] text-red-400/80 font-semibold mb-4">
              of your deposit — gone
            </p>

            <p className="font-headline text-[clamp(1.5rem,3.2vw,2.6rem)] font-light italic text-cream/85 leading-tight">
              Lent out before you leave the bank.
            </p>
            <p className="mt-4 text-[15px] md:text-[16px] text-cream/60 leading-relaxed max-w-md">
              Your bank funds fossil fuels, weapons, private prisons, and
              speculative derivatives — with <span className="text-red-400/90 font-medium">your money</span>.
              They keep as little as 3%.
            </p>
          </div>
        </div>

        {/* ── RIGHT — Calm (Sakina) ── */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `polygon(${split}% 0, 100% 0, 100% 100%, ${split}% 100%)` }}
        >
          <div className="absolute inset-0 bg-cream" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(217,119,138,0.07),transparent_70%)]" />

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
            <p className="text-[11px] md:text-[12px] uppercase tracking-[0.3em] text-charcoal/40 font-medium mb-6">
              Your money at Sakina
            </p>

            {/* Sakina card — larger, more premium */}
            <motion.div
              className="relative mb-8"
              animate={shouldReduce ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Card shadow layer */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[70%] h-6 rounded-full bg-rose/20 blur-2xl" />

              <div
                className="relative overflow-hidden rounded-2xl shadow-[0_32px_80px_rgba(217,119,138,0.22),0_12px_32px_rgba(28,28,28,0.12)]"
                style={{ width: 290, height: 182 }}
              >
                {/* Card background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ecc8d0] via-[#d9778a] to-[#b85a6a]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_15%,rgba(255,255,255,0.22),transparent_55%)]" />
                {/* Subtle pattern overlay */}
                <div className="absolute inset-0 opacity-[0.04]"
                  style={{ backgroundImage: "repeating-linear-gradient(135deg, transparent, transparent 8px, rgba(255,255,255,0.4) 8px, rgba(255,255,255,0.4) 9px)" }}
                />

                {/* Chip */}
                <div className="absolute left-6 top-10">
                  <div className="w-10 h-7 rounded-[5px] bg-gradient-to-br from-champagne/90 to-champagne/50 border border-champagne/40 shadow-sm" />
                </div>

                {/* Contactless icon */}
                <div className="absolute left-[4.5rem] top-[2.6rem]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white/40">
                    <path d="M8.5 16.5a7 7 0 0 1 0-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M12 14a4 4 0 0 0 0-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M5 19a10 10 0 0 1 0-14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Card number dots */}
                <div className="absolute left-6 bottom-[3.6rem] flex items-center gap-3">
                  {[0, 1, 2].map((g) => (
                    <div key={g} className="flex gap-1">
                      {[0, 1, 2, 3].map((d) => (
                        <div key={d} className="w-[5px] h-[5px] rounded-full bg-white/30" />
                      ))}
                    </div>
                  ))}
                  <span className="text-[13px] tracking-wider text-white/70 font-medium ml-1">4821</span>
                </div>

                {/* SAKINA wordmark + Visa */}
                <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                  <div>
                    <p className="font-headline text-[14px] tracking-[0.2em] text-white/95 font-semibold">
                      SAKINA
                    </p>
                    <p className="text-[9px] tracking-[0.12em] text-white/50 mt-0.5">
                      DEBIT
                    </p>
                  </div>
                  {/* Visa circles */}
                  <div className="flex">
                    <div className="w-6 h-6 rounded-full bg-white/25 border border-white/30" />
                    <div className="w-6 h-6 rounded-full bg-white/35 border border-white/30 -ml-2.5" />
                  </div>
                </div>
              </div>
            </motion.div>

            <p className="font-headline text-[clamp(1.4rem,3vw,2.2rem)] font-light text-charcoal/80 leading-tight">
              100% yours. Always.
            </p>
            <p className="mt-3 text-[14px] md:text-[15px] text-charcoal/45 max-w-sm leading-relaxed">
              Every dollar safeguarded. Legally guaranteed.
              Verified monthly by independent audit.
            </p>
          </div>
        </div>

        {/* ── Draggable divider ── */}
        <div
          className="absolute inset-y-0 z-20 flex items-center justify-center"
          style={{ left: `${split}%`, transform: "translateX(-50%)" }}
        >
          {/* Divider line with gradient fade at edges */}
          <div className="absolute inset-y-0 w-[2px] bg-gradient-to-b from-transparent via-rose/50 to-transparent" />

          {/* Handle */}
          <motion.div
            className={`relative z-10 flex h-14 w-14 cursor-grab items-center justify-center rounded-full border-2 border-rose/30 bg-white shadow-[0_8px_32px_rgba(28,28,28,0.16),0_0_0_1px_rgba(217,119,138,0.15)] active:cursor-grabbing transition-transform duration-150 ${isDragging ? "scale-110" : ""}`}
            animate={
              shouldReduce || hasInteracted
                ? {}
                : { scale: [1, 1.08, 1] }
            }
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            role="slider"
            aria-valuenow={Math.round(split)}
            aria-valuemin={10}
            aria-valuemax={90}
            aria-label="Drag to compare banking options"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") setSplit((s) => Math.max(10, s - 2));
              if (e.key === "ArrowRight") setSplit((s) => Math.min(90, s + 2));
            }}
          >
            {/* Left-right arrows */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path
                d="M7 11H15M7 11L5 9M7 11L5 13M15 11L17 9M15 11L17 13"
                stroke="#D9778A"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          {/* "Drag" hint — fades after interaction */}
          {!hasInteracted && (
            <motion.div
              className="absolute -bottom-16 whitespace-nowrap"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.8 }}
            >
              <span className="text-[11px] uppercase tracking-[0.2em] text-charcoal/35 font-medium bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-charcoal/[0.06]">
                Drag to compare
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Caption */}
      <p className="mt-6 text-center text-[14px] text-charcoal/45 tracking-[0.01em]">
        One side lends your money away.{" "}
        <span className="text-charcoal/65 font-medium">
          The other doesn&apos;t. That&apos;s Sakina.
        </span>
      </p>
    </div>
  );
}
