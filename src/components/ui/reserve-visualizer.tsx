"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export function ReserveVisualizer() {
  const [deposit, setDeposit] = useState(5000);

  // Traditional bank: 3% reserve ratio
  const traditionalReserve = deposit * 0.03;
  // Sakina: 100% reserve ratio
  const sakinaReserve = deposit;

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-mauve/20 bg-white/60 p-8 shadow-[0_24px_64px_rgba(28,28,28,0.05)] md:p-12">
      <div className="mb-10 text-center">
        <label htmlFor="deposit-slider" className="block text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/50">
          Slide to deposit money
        </label>
        <div className="mt-4 flex items-center justify-center gap-6">
          <span className="font-headline text-3xl font-light text-charcoal md:text-5xl">
            ${deposit.toLocaleString()}
          </span>
        </div>
        <input
          id="deposit-slider"
          type="range"
          min="1000"
          max="50000"
          step="500"
          value={deposit}
          onChange={(e) => setDeposit(Number(e.target.value))}
          className="mt-8 w-full max-w-lg accent-rose cursor-grab active:cursor-grabbing"
        />
      </div>

      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        {/* Traditional Bank Column */}
        <div className="flex flex-col">
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="text-[13px] font-medium uppercase tracking-[0.1em] text-charcoal">Traditional Bank</h3>
            <span className="text-[12px] text-rose/80 font-medium">3% Kept</span>
          </div>
          <div className="relative h-64 w-full overflow-hidden rounded-xl bg-[#fdf9f6] border border-champagne/40">
            {/* The drained away money - represents what is loaned out */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 opacity-40">
               <span className="text-[10px] uppercase tracking-[0.15em] text-charcoal/60 mb-2">Loaned Out</span>
               <span className="font-headline text-xl text-charcoal line-through">${(deposit - traditionalReserve).toLocaleString()}</span>
            </div>
            
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-rose/10 border-t border-rose/30"
              initial={{ height: "3%" }}
              animate={{ height: "3%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>
           <div className="mt-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-charcoal/55">Actually in your account</p>
              <p className="font-headline mt-1 text-2xl font-medium text-rose">${traditionalReserve.toLocaleString()}</p>
          </div>
        </div>

        {/* Sakina Column */}
        <div className="flex flex-col">
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="text-[13px] font-medium uppercase tracking-[0.1em] text-charcoal">Sakina</h3>
            <span className="text-[12px] text-emerald-600 font-medium">100% Kept</span>
          </div>
          <div className="relative h-64 w-full overflow-hidden rounded-xl bg-emerald-50/50 border border-emerald-200/50">
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
               <span className="text-[10px] uppercase tracking-[0.15em] text-emerald-700/60 mb-2">Safe & Still</span>
            </div>
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-emerald-500/10 border-t border-emerald-500/20"
              initial={{ height: "100%" }}
              animate={{ height: "100%" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            />
          </div>
          <div className="mt-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-charcoal/55">Actually in your account</p>
              <p className="font-headline mt-1 text-2xl font-medium text-emerald-600">${sakinaReserve.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
