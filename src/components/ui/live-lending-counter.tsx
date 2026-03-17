"use client";

import { useEffect, useState } from "react";

export function LiveLendingCounter() {
  const [lentAmount, setLentAmount] = useState(0);

  useEffect(() => {
    // US Banks lend roughly $57,000 every second
    const LENDING_RATE_PER_SECOND = 57000;
    // Update interval (ms) - 50ms gives a fast "rolling" effect without destroying performance
    const INTERVAL = 50; 
    const incrementPerTick = LENDING_RATE_PER_SECOND / (1000 / INTERVAL);

    // Initial random offset to make it look like it's been running
    setTimeout(() => {
        setLentAmount(Math.floor(Math.random() * 200000) + 50000);
    }, 0);

    const timer = setInterval(() => {
      setLentAmount((prev) => prev + incrementPerTick);
    }, INTERVAL);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-8 flex flex-col gap-1 rounded-xl border border-rose/15 bg-rose/5 px-4 py-3 max-w-sm">
      <p className="text-[11px] text-charcoal/60 leading-tight">
        While you&apos;ve been on this page, traditional banks have lent out:
      </p>
      <div className="flex items-center gap-2 mt-0.5">
        <span className="pulse-dot flex-shrink-0 bg-red-500" />
        <p className="font-mono text-[16px] font-medium tracking-tight text-[#ba465b]">
          ${Math.floor(lentAmount).toLocaleString()}
        </p>
      </div>
      <p className="text-[9px] uppercase tracking-[0.1em] text-red-900/40 mt-1">
        of customer deposits
      </p>
    </div>
  );
}
