"use client";

import { useEffect, useRef, useState } from "react";

export function LiveLendingCounter() {
  const [lentAmount, setLentAmount] = useState(0);
  const startRef = useRef(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    // US Banks lend roughly $57,000 every second
    const RATE = 57000;
    offsetRef.current = Math.floor(Math.random() * 200000) + 50000;
    startRef.current = performance.now();

    let raf: number;
    const tick = () => {
      const elapsed = (performance.now() - startRef.current) / 1000;
      setLentAmount(offsetRef.current + elapsed * RATE);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="mt-8 flex flex-col gap-1 rounded-xl border border-charcoal/10 bg-charcoal/[0.035] px-4 py-3 max-w-sm">
      <p className="text-[11px] text-charcoal/55 leading-tight">
        While you&apos;ve been on this page, US banks have lent out:
      </p>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="pulse-dot flex-shrink-0" aria-hidden="true" />
        <p className="font-headline text-[18px] font-light tracking-tight text-charcoal/85 tabular-nums">
          ${Math.floor(lentAmount).toLocaleString()}
        </p>
      </div>
      <p className="text-[9px] uppercase tracking-[0.1em] text-charcoal/35 mt-1">
        of customer deposits
      </p>
    </div>
  );
}
