"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { SakinaLogo } from "@/components/sakina-logo";

export function MagneticCard() {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Motion values for tracking cursor relative to card center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    // Check if device supports hover (disables heavy 3D effect on touch devices)
    if (window.matchMedia("(hover: none)").matches) {
       setTimeout(() => setIsMobile(true), 0);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    // Calculate distance from center of bounding box (-0.5 to 0.5)
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => !isMobile && setIsHovered(true);
  
  const handleMouseLeave = () => {
    if (isMobile) return;
    setIsHovered(false);
    // Smoothly return to center
    mouseX.set(0);
    mouseY.set(0);
  };

  // Dampen the values for smooth spring physics
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  // Map mouse position to rotation angles (max 15 degrees tilt)
  const rotateX = useTransform(springY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-15, 15]);

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center p-8 w-full max-w-[400px] mx-auto md:max-w-none perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          scale: isHovered && !isMobile ? 1.05 : 1,
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative w-[320px] aspect-[1.586/1] md:w-[480px] rounded-3xl"
      >
        {/* Dynamic shadow that responds to tilt */}
        <motion.div
           className="absolute -inset-4 rounded-[40px] bg-rose/20 blur-2xl z-0"
           style={{
             x: useTransform(springX, [-0.5, 0.5], [-20, 20]),
             y: useTransform(springY, [-0.5, 0.5], [-20, 20]),
             opacity: isHovered && !isMobile ? 0.6 : 0.3
           }}
        />
        
        {/* The Card Surface */}
        <div className="absolute inset-0 z-10 rounded-3xl overflow-hidden border-[0.5px] border-black/5 shadow-2xl bg-[#F8F5F0]">
           {/* Card physical texture — CSS noise instead of external image */}
           <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "180px 180px" }} />
           
           {/* Card top row: chip + logo */}
           <div className="absolute inset-0 p-8 flex items-start justify-between">
              {/* EMV Chip */}
              <div className="w-14 h-[42px] rounded-lg border border-[#d4b483]/40 bg-gradient-to-br from-[#e8d5b5] to-[#c5a065] shadow-sm ml-2 relative overflow-hidden mt-1">
                {/* Chip lines */}
                <div className="absolute inset-0 opacity-40">
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-black/20" />
                  <div className="absolute top-0 bottom-0 left-1/3 w-px bg-black/20" />
                  <div className="absolute top-0 bottom-0 right-1/3 w-px bg-black/20" />
                  <div className="absolute rounded-[100%] border border-black/20 w-6 h-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Logo Area */}
              <div className="flex flex-col items-center gap-1.5 mr-4">
                 <div className="text-[#D9778A]">
                   <SakinaLogo size={40} />
                 </div>
                 <span className="font-headline text-charcoal/70 tracking-[0.15em] text-[13px] font-medium uppercase">SAKINA</span>
              </div>
           </div>

           {/* Card bottom: number + expiry */}
           <div className="absolute bottom-0 left-0 right-0 px-10 pb-7 flex flex-col gap-2.5">
             {/* Masked card number */}
             <p className="font-mono text-[clamp(13px,2.5vw,17px)] tracking-[0.22em] text-charcoal/50 select-none">
               •••• •••• •••• 4242
             </p>
             <div className="flex items-end justify-between">
               <div>
                 <p className="text-[9px] uppercase tracking-[0.18em] text-charcoal/35 mb-0.5">Member Since</p>
                 <p className="font-mono text-[12px] tracking-[0.12em] text-charcoal/55">2026</p>
               </div>
               <div className="text-right">
                 <p className="text-[9px] uppercase tracking-[0.18em] text-charcoal/35 mb-0.5">Status</p>
                 <p className="text-[11px] font-medium tracking-[0.12em] text-charcoal/60 uppercase">Founding Member</p>
               </div>
             </div>
           </div>
           
           {/* Specular highlight (glare) overlay */}
           <motion.div
             className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"
             style={{
               opacity: isHovered && !isMobile ? 1 : 0,
               backgroundPosition: useTransform(
                  [springX, springY],
                  ([x, y]) => `${(typeof x === 'number' ? x : 0) * 100}% ${(typeof y === 'number' ? y : 0) * 100}%`
               ),
               backgroundSize: "200% 200%",
             }}
           />
        </div>
      </motion.div>
    </div>
  );
}
