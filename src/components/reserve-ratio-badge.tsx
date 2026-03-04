"use client";

import { useEffect, useState } from "react";

export function ReserveRatioBadge() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1200;

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setValue(Number((progress * 100).toFixed(1)));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--sakina-mauve)]/70 bg-white/70 px-4 py-2 text-sm text-[color:var(--sakina-charcoal)] shadow-sm backdrop-blur">
      <span className="font-medium">Reserve Ratio</span>
      <span className="font-semibold text-[color:var(--sakina-rose)]">{value.toFixed(1)}%</span>
    </div>
  );
}
