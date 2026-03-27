"use client";

import { animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

// Animated number — springs when value changes
function AnimatedAmount({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    const controls = animate(prevRef.current, value, {
      duration: 0.38,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(v),
    });
    prevRef.current = value;
    return controls.stop;
  }, [value]);

  return <>${Math.round(display).toLocaleString()}</>;
}

export function ReserveVisualizer() {
  const [deposit, setDeposit] = useState(5000);
  const [hasInteracted, setHasInteracted] = useState(false);

  const kept = Math.round(deposit * 0.03);
  const lent = deposit - kept;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">

      {/* ── Deposit control ── */}
      <div className="text-center">
        <label htmlFor="deposit" className="text-[11px] font-medium uppercase tracking-[0.24em] text-charcoal/40 mb-3 block cursor-pointer">
          Your deposit
        </label>
        <p className="font-headline text-[clamp(3.2rem,9vw,5.5rem)] font-light leading-none text-charcoal tabular-nums">
          ${deposit.toLocaleString()}
        </p>
        <div className="mt-7 flex flex-col items-center gap-2">
          <input
            id="deposit"
            type="range"
            min="1000"
            max="50000"
            step="500"
            value={deposit}
            aria-label="Deposit amount"
            onChange={(e) => {
              setDeposit(Number(e.target.value));
              setHasInteracted(true);
            }}
            className="w-full max-w-xs cursor-grab accent-rose active:cursor-grabbing"
          />
          <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/28">
            {hasInteracted ? "Keep going" : "Drag to change amount"}
          </p>
        </div>
      </div>

      {/* ── Comparison cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* Traditional bank — dark, alarming */}
        <div className="flex flex-col rounded-3xl bg-charcoal p-7">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cream/35">
                Your bank keeps
              </p>
              <p className="font-headline mt-2 text-[clamp(2rem,6vw,3.2rem)] font-light leading-none text-rose tabular-nums">
                <AnimatedAmount value={kept} />
              </p>
            </div>
            <span className="mt-1 rounded-full bg-rose/15 px-3 py-1 text-[10px] font-medium tracking-wide text-rose/80">
              3%
            </span>
          </div>

          {/* Reserve bar — nearly empty */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-cream/8">
            <div className="h-full w-[3%] rounded-full bg-rose/55" />
          </div>
          <p className="mt-2 text-[10px] text-cream/22">
            of your deposit is still here
          </p>

          <div className="mt-auto border-t border-cream/8 pt-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-cream/28 mb-2">
              Lent out without asking you
            </p>
            <p className="font-headline text-2xl font-light text-cream/38 line-through tabular-nums">
              <AnimatedAmount value={lent} />
            </p>
          </div>
        </div>

        {/* Sakina — warm, full, confident */}
        <div className="flex flex-col rounded-3xl border border-rose/20 bg-rose/[0.04] p-7">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-charcoal/40">
                Sakina keeps
              </p>
              <p className="font-headline mt-2 text-[clamp(2rem,6vw,3.2rem)] font-light leading-none text-charcoal tabular-nums">
                <AnimatedAmount value={deposit} />
              </p>
            </div>
            <span className="mt-1 rounded-full bg-charcoal/8 px-3 py-1 text-[10px] font-medium tracking-wide text-charcoal/60">
              100%
            </span>
          </div>

          {/* Reserve bar — completely full */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-charcoal/8">
            <motion.div
              className="h-full rounded-full bg-rose/50"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          </div>
          <p className="mt-2 text-[10px] text-charcoal/30">
            all of your deposit is still here
          </p>

          <div className="mt-auto border-t border-charcoal/8 pt-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-charcoal/28 mb-2">
              Lent out without asking you
            </p>
            <p className="font-headline text-2xl font-light text-charcoal">
              $0
            </p>
          </div>
        </div>
      </div>

      {/* ── Bottom line ── */}
      <p className="text-center text-[13px] leading-relaxed text-charcoal/40">
        Move the slider.{" "}
        <span className="text-charcoal/60">
          Your bank doesn&apos;t change. Neither does Sakina.
        </span>
      </p>
    </div>
  );
}
