"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type Persona = {
  id: string;
  label: string;
  quote: string;
  image: string;
};

const personasData: Persona[] = [
  { 
    id: "faith", 
    label: "For the faith-conscious", 
    quote: "I wanted an American account that honors faith and conscience as legal structure — not as marketing copy.",
    image: "/assets/pink-money-2.jpg" // Placeholder for minimal portrait
  },
  { 
    id: "env", 
    label: "For the environmentally aware", 
    quote: "I changed my lifestyle years ago. Sakina lets my money change with it. No more fossil fuels.",
    image: "/assets/blue-card-1.jpg"
  },
  { 
    id: "crypto", 
    label: "For the crypto-native", 
    quote: "I don't trust fractional reserves. I want 1:1 backed assets. Sakina is the fiat equivalent of a cold wallet.",
    image: "/assets/pink-money-1.jpg"
  },
  { 
    id: "social", 
    label: "For the socially conscious", 
    quote: "I refuse to let my deposits fund private prisons or predatory lending. I finally found an alternative.",
    image: "/assets/bank-photo-gabby-k.jpg" 
  },
  { 
    id: "first", 
    label: "For the first-time banker", 
    quote: "I didn't want my first bank account to be tied to a system I didn't believe in.",
    image: "/assets/pink-money-3.jpg"
  },
  { 
    id: "all", 
    label: "For anyone paying attention", 
    quote: "I just want to know my money is still there. All of it. All the time.",
    image: "/assets/bank-pink-photo.jpg"
  },
];

export function InteractivePersonas() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="w-full">
      {/* Desktop Horizontal Tray */}
      <div className="hidden md:flex flex-nowrap overflow-x-auto pb-12 gap-4 hide-scrollbar snap-x">
        {personasData.map((persona) => {
          const isHovered = hoveredId === persona.id;
          const isExpanded = expandedId === persona.id;
          const isDimmed = expandedId ? false : hoveredId && hoveredId !== persona.id;

          return (
            <motion.div
              key={persona.id}
              className={`relative flex-shrink-0 cursor-pointer snap-start overflow-hidden rounded-2xl bg-[#C08497]/10 border-l-[3px] border-rose transition-all duration-500 ease-out`}
              onMouseEnter={() => setHoveredId(persona.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setExpandedId(isExpanded ? null : persona.id)}
              layout
              initial={{ width: "320px", opacity: 1 }}
              animate={{
                width: isExpanded ? "500px" : "320px",
                opacity: isDimmed ? 0.4 : 1,
                scale: isHovered && !isExpanded ? 1.03 : 1,
              }}
            >
              <div className="p-6 h-full min-h-[420px] flex flex-col justify-between">
                <div>
                  <div className="w-16 h-16 rounded-full overflow-hidden mb-6 border-2 border-champagne/40">
                    <Image src={persona.image} alt={persona.label} width={64} height={64} className="object-cover w-full h-full" />
                  </div>
                  <h3 className="font-headline text-[1.2rem] text-charcoal/90 leading-tight mb-2">
                    {persona.label}
                  </h3>
                  
                  {/* Expanded Quote */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      >
                         <p className="font-headline text-[22px] italic font-light text-charcoal/80 leading-[1.4]">
                           &quot;{persona.quote}&quot;
                         </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer labels & CTA */}
                <div className="mt-8">
                  <AnimatePresence mode="popLayout">
                    {isExpanded ? (
                      <motion.a
                        key="cta"
                        href="#waitlist"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="cta-pill inline-block w-full text-center px-5 py-3 text-sm shadow-[0_0_24px_rgba(217,119,138,0.35)]"
                         onClick={(e) => { e.stopPropagation(); }}
                      >
                        This was built for you — Join the Waitlist
                      </motion.a>
                    ) : isHovered ? (
                      <motion.p
                        key="hover-label"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-[11px] uppercase tracking-[0.2em] font-medium text-rose"
                      >
                        This is you →
                      </motion.p>
                    ) : (
                       <motion.p
                          key="default-label"
                          className="text-[11px] uppercase tracking-[0.2em] font-medium text-charcoal/40"
                       >
                          Click to expand
                       </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile Vertical Stack */}
      <div className="md:hidden space-y-4">
        {personasData.map((persona) => {
          const isExpanded = expandedId === persona.id;
          return (
             <motion.div
                key={persona.id}
                className={`relative overflow-hidden rounded-2xl bg-[#C08497]/10 border-l-[3px] border-rose transition-all duration-300`}
                onClick={() => setExpandedId(isExpanded ? null : persona.id)}
                layout
             >
                <div className="p-6 flex flex-col justify-between">
                   <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-champagne/40 flex-shrink-0">
                         <Image src={persona.image} alt={persona.label} width={48} height={48} className="object-cover w-full h-full" />
                      </div>
                      <h3 className="font-headline text-[1.1rem] text-charcoal/90 leading-tight">
                         {persona.label}
                      </h3>
                   </div>
                   
                   <AnimatePresence>
                     {isExpanded && (
                        <motion.div
                           initial={{ opacity: 0, height: 0 }}
                           animate={{ opacity: 1, height: "auto" }}
                           exit={{ opacity: 0, height: 0 }}
                           className="mb-6 mt-2"
                        >
                           <p className="font-headline text-[18px] italic font-light text-charcoal/80 leading-[1.4]">
                             &quot;{persona.quote}&quot;
                           </p>

                           <motion.a
                             href="#waitlist"
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             className="cta-pill inline-block w-full text-center px-4 py-3 mt-6 text-sm shadow-[0_0_20px_rgba(217,119,138,0.25)]"
                             onClick={(e) => { e.stopPropagation(); }}
                           >
                              Join the Waitlist
                           </motion.a>
                        </motion.div>
                     )}
                   </AnimatePresence>
                   
                   {!isExpanded && (
                      <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-rose mt-2">Tap to read →</p>
                   )}
                </div>
             </motion.div>
          )
        })}
      </div>
    </div>
  );
}
