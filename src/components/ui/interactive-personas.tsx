"use client";

import { motion, useReducedMotion } from "framer-motion";

type Persona = {
  id: string;
  frustration: string;
  label: string;
  resolution: string;
};

const personas: Persona[] = [
  {
    id: "faith",
    frustration:
      "Every option came with a quiet compromise my conscience wouldn\u2019t allow. I don\u2019t need Islamic branding \u2014 I need a legal structure that actually protects my deposits.",
    label: "Faith-driven",
    resolution:
      "Sakina\u2019s non-lending covenant isn\u2019t marketing. It\u2019s a contractual guarantee that your money is never used in ways your faith prohibits.",
  },
  {
    id: "climate",
    frustration:
      "I changed my diet, my travel, my purchases \u2014 years ago. Then I found out my bank has poured billions into fossil fuel pipelines since the Paris Agreement. With my money.",
    label: "Climate-aware",
    resolution:
      "Your deposits at Sakina fund exactly nothing. No pipelines. No extraction. No compromises disguised as interest rates.",
  },
  {
    id: "justice",
    frustration:
      "I looked up what my bank actually finances. Private prisons. Weapons manufacturers. Predatory lenders. I\u2019ve been looking for an alternative for three years. Every one was a different shade of the same compromise.",
    label: "Values-driven",
    resolution:
      "Sakina doesn\u2019t invest your deposits \u2014 period. There\u2019s no portfolio to audit because your money never leaves your account.",
  },
  {
    id: "custody",
    frustration:
      "I believe in controlling my own funds. But I can\u2019t pay rent in Bitcoin, and I\u2019m tired of choosing between self-custody principles and a functioning bank account.",
    label: "Custody-minded",
    resolution:
      "Full Visa debit card. Real-world spending. And your deposits stay exactly where you put them \u2014 the self-custody ethos, without the volatility.",
  },
  {
    id: "everyone",
    frustration:
      "I just want to know my money is still there. All of it. All the time. I didn\u2019t realize that was too much to ask \u2014 until I learned what fractional reserve banking actually means.",
    label: "Anyone paying attention",
    resolution:
      "It\u2019s not too much to ask. Sakina keeps 100% of your deposit, verified monthly by independent audit. That\u2019s it. That\u2019s the product.",
  },
];

// Hand-picked micro-rotations — not random, not uniform. Each card has a
// distinct resting angle like notes pinned to a board.
const cardTilts = [-1.2, 0.8, -0.6, 1.1, -0.9];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

export function InteractivePersonas() {
  const shouldReduce = useReducedMotion();

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {personas.map((persona, i) => {
        const isLast = i === personas.length - 1;
        const tilt = shouldReduce ? 0 : cardTilts[i] ?? 0;

        return (
          <motion.article
            key={persona.id}
            className={`group relative rounded-2xl bg-white p-7 md:p-9 flex flex-col ${
              isLast ? "md:col-span-2 md:max-w-2xl md:mx-auto" : ""
            }`}
            style={{
              boxShadow:
                "0 2px 12px rgba(28,28,28,0.05), 0 0 0 1px rgba(28,28,28,0.04)",
              rotate: tilt,
            }}
            custom={i}
            initial={shouldReduce ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={cardVariants}
            whileHover={{
              rotate: 0,
              boxShadow:
                "0 12px 40px rgba(217,119,138,0.12), 0 0 0 1px rgba(217,119,138,0.10)",
              y: -3,
            }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Rose accent line at top — grows on hover */}
            <div className="absolute top-0 left-8 right-8 h-[2px] rounded-full bg-gradient-to-r from-rose/20 via-rose/10 to-transparent overflow-hidden">
              <div className="h-full w-0 group-hover:w-full bg-gradient-to-r from-rose/60 via-rose/30 to-transparent rounded-full transition-all duration-500 ease-out" />
            </div>

            {/* Frustration quote */}
            <blockquote className="mt-2">
              <p className="font-headline text-[1.05rem] md:text-[1.15rem] italic font-light text-charcoal/80 leading-[1.65]">
                &ldquo;{persona.frustration}&rdquo;
              </p>
            </blockquote>

            {/* Persona label */}
            <p className="mt-5 text-[11px] uppercase tracking-[0.22em] text-rose/70 font-semibold">
              {persona.label}
            </p>

            {/* Resolution */}
            <p className="mt-3 text-[14px] md:text-[15px] text-charcoal/55 leading-relaxed">
              {persona.resolution}
            </p>

            {/* CTA */}
            <div className="mt-6 pt-5 border-t border-charcoal/[0.06]">
              <a
                href="#waitlist"
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-rose hover:text-rose/80 transition-colors"
              >
                <span>This is me — join the waitlist<span className="sr-only"> as a {persona.label} user</span></span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8h10m0 0L9.5 4.5M13 8l-3.5 3.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
