"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import Image from "next/image";

// Inline Sakina wordmark — avoids importing the logo component
function InlineLogo({ size = 20 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size }} className="relative flex-shrink-0">
      <Image src="/assets/sakina-logo.png" alt="" fill className="object-contain scale-[2.2]" />
    </div>
  );
}

const metrics = [
  { label: "Total Deposits", value: "$0", sub: "Pre-launch · Growing" },
  { label: "Safeguarded", value: "$0", sub: "Always equal to deposits" },
  { label: "Reserve Ratio", value: "1:1", sub: "Contractually guaranteed" },
];

export function ProofDashboard() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div
      ref={ref}
      className="w-full overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-[0_12px_48px_rgba(28,28,28,0.07),0_2px_8px_rgba(28,28,28,0.04)]"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between border-b border-charcoal/8 px-6 py-4">
        <div className="flex items-center gap-3">
          <InlineLogo size={22} />
          <span className="font-headline text-[13px] font-medium tracking-[0.14em] text-charcoal/80">
            SAKINA
          </span>
          <span className="text-charcoal/20 text-sm">·</span>
          <span className="text-[12px] text-charcoal/48 tracking-[0.04em]">
            Proof of Reserves
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="pulse-dot flex-shrink-0" aria-label="Live indicator" />
          <span className="text-[10px] uppercase tracking-[0.18em] text-charcoal/40 font-medium">
            Live
          </span>
        </div>
      </div>

      {/* ── Metric cards ── */}
      <div className="grid grid-cols-3 divide-x divide-charcoal/[0.06]">
        {metrics.map((m, idx) => (
          <motion.div
            key={m.label}
            className="px-5 py-5"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, delay: idx * 0.08, ease: "easeOut" }}
          >
            <p className="text-[10px] uppercase tracking-[0.18em] text-charcoal/38 font-medium">
              {m.label}
            </p>
            <p className="font-headline mt-1.5 text-[1.5rem] font-light text-charcoal leading-none">
              {m.value}
            </p>
            <p className="mt-1 text-[11px] text-charcoal/38">{m.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Bar visualisation ── */}
      <div className="px-6 pb-2 pt-5">
        <p className="mb-4 text-[10px] uppercase tracking-[0.2em] text-charcoal/35 font-medium">
          Reserve visualisation · illustrative
        </p>
        <div className="flex items-end gap-5 h-28">
          {/* Deposits bar */}
          <div className="flex flex-1 flex-col items-center gap-2">
            <div className="relative w-full overflow-hidden rounded-t-lg bg-charcoal/[0.06]" style={{ height: 88 }}>
              <motion.div
                className="absolute bottom-0 w-full rounded-t-lg"
                style={{
                  background: "linear-gradient(to top, rgba(217,119,138,0.55), rgba(192,132,151,0.25))",
                }}
                initial={{ height: 0 }}
                animate={inView ? { height: "100%" } : { height: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.0, duration: 0.4 }}
              >
                <span className="font-headline text-sm text-charcoal/60 font-light">$X</span>
              </motion.div>
            </div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-charcoal/40">Deposits</p>
          </div>

          {/* Equals divider */}
          <div className="flex flex-col items-center justify-center pb-6 flex-shrink-0">
            <motion.span
              className="font-headline text-xl text-charcoal/25 italic leading-none"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              =
            </motion.span>
          </div>

          {/* Safeguarded bar */}
          <div className="flex flex-1 flex-col items-center gap-2">
            <div className="relative w-full overflow-hidden rounded-t-lg bg-charcoal/[0.06]" style={{ height: 88 }}>
              <motion.div
                className="absolute bottom-0 w-full rounded-t-lg"
                style={{
                  background: "linear-gradient(to top, rgba(217,119,138,0.7), rgba(192,132,151,0.35))",
                }}
                initial={{ height: 0 }}
                animate={inView ? { height: "100%" } : { height: 0 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
              />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 1.1, duration: 0.4 }}
              >
                <span className="font-headline text-sm text-charcoal/60 font-light">$X</span>
              </motion.div>
            </div>
            <p className="text-[10px] uppercase tracking-[0.14em] text-charcoal/40">Safeguarded</p>
          </div>
        </div>

        <motion.p
          className="mt-4 text-center text-[11px] text-charcoal/35 italic"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
        >
          Both bars always reach the same height. That is the entire point.
        </motion.p>
      </div>

      {/* ── Audit footer ── */}
      <div className="mt-4 flex items-center justify-between border-t border-charcoal/[0.06] px-6 py-3.5">
        <p className="text-[11px] text-charcoal/38">
          Verified monthly · Independent third-party auditor
        </p>
        <motion.span
          className="text-[11px] font-medium text-rose/65 cursor-default"
          whileHover={{ color: "#D9778A" }}
        >
          Ask your bank to do the same →
        </motion.span>
      </div>
    </div>
  );
}
