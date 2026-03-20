"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, MotionValue, AnimatePresence } from "framer-motion";
import { WaitlistForm } from "@/components/waitlist-form";
import { HeroForm } from "@/components/hero-form";
import { SakinaLogo } from "@/components/sakina-logo";
import { MagneticCard } from "@/components/ui/magnetic-card";
import { LiveLendingCounter } from "@/components/ui/live-lending-counter";
import { InteractivePersonas } from "@/components/ui/interactive-personas";

// Lazy-load heavy below-fold components
const ReserveVisualizer = dynamic(() => import("@/components/ui/reserve-visualizer").then(m => ({ default: m.ReserveVisualizer })), { ssr: false });
const PetalProgress = dynamic(() => import("@/components/ui/petal-progress").then(m => ({ default: m.PetalProgress })), { ssr: false });
const DragDivider = dynamic(() => import("@/components/ui/drag-divider").then(m => ({ default: m.DragDivider })), { ssr: false });


// ── Sticky nav with IntersectionObserver for waitlist ────────────────────────

function StickyNav() {
  const [show, setShow] = useState(false);
  const [waitlistInView, setWaitlistInView] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 380);
    window.addEventListener("scroll", onScroll, { passive: true });

    const waitlistEl = document.getElementById("waitlist");
    let observer: IntersectionObserver | null = null;
    if (waitlistEl) {
      observer = new IntersectionObserver(
        ([entry]) => setWaitlistInView(entry.isIntersecting),
        { threshold: 0.15 }
      );
      observer.observe(waitlistEl);
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  return (
    <nav
      aria-label="Site navigation"
      className={`sticky-nav ${show ? "sticky-nav-visible" : "sticky-nav-hidden"}`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2.5">
          <SakinaLogo size={26} />
          <span className="font-headline text-lg font-medium tracking-[0.1em]">SAKINA</span>
        </div>
        {!waitlistInView && (
          <a href="#waitlist" className="cta-pill px-5 py-2 text-[13px]">
            Claim Founding Spot
          </a>
        )}
      </div>
    </nav>
  );
}

// ── Scroll-Linked Typing Text ───────────────────────────────────────────────

function AnimatedWord({ word, index, totalWords, scrollProgress }: { word: string; index: number; totalWords: number; scrollProgress: MotionValue<number> }) {
  // Map scroll progress to this specific word's opacity
  const start = index / totalWords;
  const end = start + (1 / totalWords);
  const opacity = useTransform(scrollProgress, [start, end], [0.2, 1]);
  
  return (
    <motion.span style={{ opacity, display: "inline-block", marginRight: "0.25em" }}>
      {word}
    </motion.span>
  );
}

function ScrollTypingText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "start 45%"], // Animation completes as it reaches middle of screen
  });

  const words = text.split(" ");

  return (
    <p ref={ref} className={className} style={{ display: "inline-block", flexWrap: "wrap", gap: "0.25em" }}>
      {words.map((word, i) => (
         <AnimatedWord key={i} word={word} index={i} totalWords={words.length} scrollProgress={scrollYProgress} />
      ))}
    </p>
  );
}

// ── Bank ticker with keyboard pause ──────────────────────────────────────────

const TICKER_ITEMS = [
  "Wells Fargo · $65B+ fossil fuel financing (2023)",
  "JPMorgan Chase · $229B in fossil fuels since Paris Agreement",
  "Bank of America · Private prison bond underwriting",
  "Citigroup · Weapons manufacturer financing",
  "Goldman Sachs · Predatory lending investments",
  "US Banks (collective) · $3.8T in speculative derivatives",
  "Wells Fargo · $65B+ fossil fuel financing (2023)",
  "JPMorgan Chase · $229B in fossil fuels since Paris Agreement",
  "Bank of America · Private prison bond underwriting",
  "Citigroup · Weapons manufacturer financing",
  "Goldman Sachs · Predatory lending investments",
  "US Banks (collective) · $3.8T in speculative derivatives",
];

function BankTicker() {
  const [paused, setPaused] = useState(false);

  return (
    <div className="border-t border-cream/8 pt-4">
      <div className="mb-2 flex justify-end px-6">
        <button
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "Resume ticker" : "Pause ticker"}
          className="text-[10px] uppercase tracking-[0.22em] text-cream/30 transition-colors hover:text-cream/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cream/50 focus-visible:outline-offset-2 rounded"
        >
          {paused ? "▶ Resume" : "⏸ Pause"}
        </button>
      </div>
      <div className="marquee-outer">
        <div
          className={`marquee-track ${paused ? "marquee-paused" : ""}`}
          aria-live="off"
          aria-hidden="true"
        >
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="mx-8 whitespace-nowrap text-[11px] font-light tracking-[0.16em] text-cream/35 uppercase">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Fade-up preset ────────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const, delay },
});

// ── Data ──────────────────────────────────────────────────────────────────────

const problemItems = [
  { num: "01", title: "It gets lent out — immediately",
    body: "Banks can lend up to 97% of your deposit the moment it arrives. Your $1,000 becomes someone else's loan. You earn nothing. They keep the interest. You carry the risk." },
  { num: "02", title: "It funds what you'd never fund",
    body: "Major US banks have poured hundreds of billions into fossil fuels, weapons manufacturers, private prisons, and predatory lenders — using ordinary checking deposits like yours." },
  { num: "03", title: "It gets leveraged against you",
    body: "Derivatives. Securitized risk. Speculative positions. Banks use customer deposits as fuel for financial complexity while you carry the uncertainty." },
];

const features = [
  { num: "I",   title: "Your money stays put. Always.",
    body: "Held in a legally-segregated, FDIC-insured custodial account. Never loaned. Never collateralized. Never moved without your consent. Contractually enforced, not just promised." },
  { num: "II",  title: "A real Visa debit card. Everywhere.",
    body: "Tap to pay, shop online, use ATMs worldwide. Works like your current bank card — except your deposited money remains entirely yours." },
  { num: "III", title: "Rewards that don't cost your values.",
    body: "1–3% cashback on everyday purchases. Bonus rewards at ethical and B-Corp merchants. Optional crypto cashback in Bitcoin, Ethereum, or stablecoin." },
  { num: "IV",  title: "Proof of Reserves. Live. Public.",
    body: "Every day, Sakina shows total user deposits equal total safeguarded funds — 1:1, with independent monthly verification. No other US neobank does this." },
];

const faqs = [
  {
    q: "How does Sakina make money if you don't lend deposits?",
    a: "We earn interchange revenue — a small fee paid by merchants every time you use your Sakina debit card. This is how Apple Card and other modern cards work. We have no financial incentive to touch your deposits.",
  },
  {
    q: "Is my money actually FDIC-insured?",
    a: "Yes. Deposits are held in a custodial FBO (For Benefit Of) account at an FDIC-insured partner bank, insured up to $250,000 per depositor. The FDIC guarantee is identical to a traditional bank — the difference is what happens to your money between transactions.",
  },
  {
    q: "Is Sakina only for Muslims?",
    a: "No. Sakina is for anyone who wants their money to stay exactly where they put it. Our launch community is Muslim Americans, because Sakina's structure aligns naturally with Islamic finance principles — but the account is for everyone with values.",
  },
  {
    q: "When does Sakina launch?",
    a: "We're targeting a 2026 launch. Founding members get first access and will lock in permanent benefits from the moment they sign up.",
  },
  {
    q: "What do I actually get as a founding member?",
    a: "A limited-edition founding member Visa card, permanently higher cashback rates, zero monthly fees for life, first access at launch, and a direct line to the founding team.",
  },
];

const founderBenefits = [
  "Limited-edition founding member Visa card",
  "Higher cashback rates, permanently locked",
  "Zero monthly fees for life",
  "First access at launch",
  "Direct line to the founding team",
];

// ── FAQ Item with smooth animation ───────────────────────────────────────────

function FaqItem({ q, a, idx }: { q: string; a: string; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div {...fadeUp(idx * 0.07 + 0.1)} className="border-b border-mauve/18 last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-start justify-between gap-4 py-5 text-left text-[15px] font-medium text-charcoal"
        aria-expanded={open}
      >
        {q}
        <motion.span
          className="mt-0.5 flex-shrink-0 text-xl leading-none text-rose/70"
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[14px] leading-[1.8] text-charcoal/62">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  useEffect(() => {
    console.log(
      "%cسكينة %c— Tranquility for your money.\n\n" +
      "%cIf you're reading this, you're exactly the kind of person we're building for.\n" +
      "Interested in what we're doing? → hello@sakina.io",
      "font-size:24px;font-weight:300;color:#D9778A;",
      "font-size:14px;color:#1C1C1C;",
      "font-size:12px;color:#666;"
    );
  }, []);

  return (
    <main className="section-shell bg-cream text-charcoal">
      {/* Skip to content — visible on keyboard focus */}
      <a href="#hero" className="skip-link">Skip to content</a>

      <StickyNav />
      <PetalProgress />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section id="hero" className="relative pb-24 pt-8 md:pb-32 md:pt-10">
        {/* Clean CSS background — geo pattern + soft directional rose gradient */}
        <div className="pointer-events-none absolute inset-0">
          <div className="geo-pattern absolute inset-0 opacity-[0.065]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_10%_50%,rgba(217,119,138,0.10),transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_35%_at_90%_15%,rgba(192,132,151,0.07),transparent_55%)]" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Arabic watermark */}
        <div
          aria-hidden="true"
          className="font-headline pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none text-[clamp(8rem,22vw,18rem)] font-light leading-none text-charcoal/[0.03] md:right-10 [writing-mode:vertical-rl]"
          dir="rtl" lang="ar"
        >
          سكينة
        </div>
          {/* Nav */}
          <header className="mb-12 flex items-center justify-between md:mb-16">
            <div className="flex items-center gap-3">
              <SakinaLogo size={34} />
              <div>
                <p className="font-headline text-xl font-medium tracking-[0.12em]">SAKINA</p>
                <p className="-mt-0.5 text-[10px] uppercase tracking-[0.22em] text-charcoal/55"
                  lang="ar" dir="rtl">
                  <span dir="ltr">سكينة · Tranquility</span>
                </p>
              </div>
            </div>
            <a href="#waitlist" className="cta-pill px-5 py-2 text-sm">
              Reserve founding access
            </a>
          </header>

          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-start md:gap-14">
            <div>
              <motion.span {...fadeUp(0.05)}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose/28 bg-white/55 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal/65"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-rose" />
                Pre-launch waitlist open
              </motion.span>

              {/* Product type anchor */}
              <motion.p {...fadeUp(0.1)}
                className="mb-4 text-[11px] uppercase tracking-[0.22em] text-charcoal/45"
              >
                US Checking Account · Visa Debit Card · Full-Reserve Banking
              </motion.p>

              {/* Mixed-weight headline — stagger per line */}
              <motion.h1
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.01 }}
                className="font-headline text-[clamp(2.8rem,6.5vw,6.4rem)] leading-[1.02] text-charcoal"
              >
                <motion.span
                  className="block font-light"
                  initial={{ opacity: 0, y: 28, clipPath: "inset(0 0 100% 0)" }}
                  whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.15 }}
                >
                  Stop funding what you{" "}
                  <em className="italic text-rose/80">oppose.</em>
                </motion.span>
                <motion.span
                  className="block font-light"
                  initial={{ opacity: 0, y: 28, clipPath: "inset(0 0 100% 0)" }}
                  whileInView={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.3 }}
                >
                  Keep your money{" "}
                  <em className="italic text-charcoal/60">yours.</em>
                </motion.span>
              </motion.h1>

              <motion.p {...fadeUp(0.4)}
                className="mt-6 max-w-lg text-[15px] md:text-[16px] leading-[1.75] text-charcoal/60"
              >
                The first US account where deposits are 100% safeguarded — never lent out, never invested, never touched without your consent.
              </motion.p>

              <motion.div {...fadeUp(0.48)} className="mt-5 flex flex-wrap gap-x-7 gap-y-2.5">
                {["Real Visa debit card", "1–3% cashback rewards", "Proof of reserves · live"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose/65" aria-hidden="true" />
                    <span className="text-[13px] text-charcoal/58">{item}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div {...fadeUp(0.56)} className="mt-9">
                <HeroForm />
              </motion.div>

              <motion.div {...fadeUp(0.64)} className="mt-4">
                <LiveLendingCounter />
              </motion.div>
            </div>

            {/* Hero visual — Sakina branded card */}
            <motion.div
              initial={{ opacity: 0, x: 24, scale: 0.96 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 }}
              className="relative mt-4 md:mt-12 w-full pb-10"
            >
              <MagneticCard />

              {/* Floating 1:1 reserve badge */}
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.92 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
                className="warm-frame absolute -bottom-2 right-0 md:-right-6 z-10 flex items-center gap-3 rounded-2xl px-4 py-3.5"
              >
                <span className="pulse-dot flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-charcoal/45">Reserve ratio · Live</p>
                  <p className="font-headline text-[1.1rem] font-light text-charcoal">1:1 · Always</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Hint — hidden on mobile to save space */}
          <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center">
            <motion.a
              href="#problem"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex flex-col items-center gap-3 cursor-pointer group"
              aria-label="Scroll to learn more"
            >
              <p className="text-[11px] uppercase font-medium tracking-[0.3em] text-charcoal/50 group-hover:text-rose transition-colors">
                Discover Sakina
              </p>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="w-7 h-11 rounded-full border-[1.5px] border-charcoal/20 group-hover:border-rose/50 flex justify-center p-1 transition-colors"
              >
                <div className="w-1 h-2.5 bg-rose/60 rounded-full" />
              </motion.div>
            </motion.a>
          </div>
        </div>
      </section>

      {/* ── Problem — dark + angled ───────────────────────────────────────── */}
      <section id="problem" className="section-dark-angled relative px-6 pb-4 pt-20 md:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,119,138,0.07),transparent_55%)]" />

        <div className="relative mx-auto max-w-6xl">
          {/* Massive editorial number — scale is the message */}
          <div className="text-center py-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
            >
              <p className="font-headline text-[clamp(5.5rem,20vw,15rem)] font-light italic leading-[0.85] text-cream tracking-tight">
                $17.9T
              </p>
              <p className="mt-5 text-[12px] uppercase tracking-[0.28em] text-rose font-medium">
                US bank deposits — none of it sitting still
              </p>
            </motion.div>
          </div>

          <motion.h2 {...fadeUp(0.15)}
            className="font-headline mx-auto mt-14 max-w-3xl text-center text-[clamp(1.8rem,4vw,3.2rem)] font-light leading-tight text-cream"
          >
            This is what they are doing with your money right now.
          </motion.h2>

          <div className="mt-12 grid gap-5 sm:gap-6 md:grid-cols-3">
            {problemItems.map((item, idx) => (
              <motion.article key={item.title} {...fadeUp(idx * 0.1 + 0.2)}
                className="group rounded-2xl border border-cream/8 p-6 md:p-7 transition-all duration-300 hover:border-rose/25 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(217,119,138,0.12)]"
              >
                <p className="font-headline text-[10px] tracking-[0.3em] text-rose uppercase">{item.num}</p>
                <h3 className="mt-3 font-headline text-lg md:text-xl font-light text-cream">{item.title}</h3>
                <p className="mt-3 text-[13px] md:text-[14px] leading-[1.8] text-cream/55">{item.body}</p>
              </motion.article>
            ))}
          </div>

          <motion.div {...fadeUp(0.4)} className="mt-16 flex justify-center">
             <div className="relative w-full max-w-sm aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-cream/10">
                {/* To view the image attached in chat, save it to public/assets/money-jar.jpg */}
                <Image src="/assets/money-jar.jpg" alt="A glass jar full of money — asking where it goes next" fill sizes="(max-width: 768px) 90vw, 384px" className="object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent pointer-events-none" />
             </div>
          </motion.div>

          <motion.div {...fadeUp(0.5)} className="mt-16 text-center">
            <p className="text-[15px] text-cream/60">You never agreed to this.</p>
            <p className="mt-1 text-[15px] text-cream/60">You were just never given a choice.</p>
            <motion.p
              className="font-headline mt-6 text-[clamp(1.6rem,3.5vw,2.6rem)] font-light italic text-rose"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] as const }}
            >
              Sakina is the choice.
            </motion.p>
            <div className="mt-8 flex justify-center">
              <a href="#waitlist" className="cta-pill-dark inline-flex px-7 py-3 text-sm">
                Reserve your founding spot
              </a>
            </div>
          </motion.div>
        </div>

        <div className="mt-16">
          <BankTicker />
        </div>
      </section>

      {/* ── Solution ─────────────────────────────────────────────────────── */}
      <section id="solution" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp(0)}>
            <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-rose/80">
              What Sakina actually is
            </p>
            <h2 className="font-headline mt-3 text-[clamp(2rem,5vw,3.8rem)] font-light leading-tight text-charcoal">
              Banking that keeps every dollar still.
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] md:text-[16px] leading-relaxed text-charcoal/60">
              Sakina means tranquility in Arabic. Every feature below is one expression of that word.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:gap-12">
            <div className="space-y-8">
              {features.map((f, idx) => (
                <motion.article key={f.title} {...fadeUp(idx * 0.08 + 0.1)} className="editorial-card group">
                  <p className="font-headline text-[10px] tracking-[0.3em] text-rose/70 uppercase transition-colors group-hover:text-rose">{f.num}</p>
                  <h3 className="mt-1.5 font-headline text-lg md:text-xl font-medium text-charcoal">{f.title}</h3>
                  <p className="mt-2 text-[13px] md:text-[14px] leading-[1.8] text-charcoal/60">{f.body}</p>
                </motion.article>
              ))}
            </div>

            <motion.div {...fadeUp(0.2)} className="grid gap-4">
              <div className="warm-frame rounded-2xl p-2 overflow-hidden">
                <Image src="/assets/bank-photo-gabby-k.jpg" alt="Person tapping their Visa card at a payment terminal"
                  width={1200} height={760} loading="lazy" sizes="(max-width: 768px) 100vw, 45vw"
                  className="h-[180px] md:h-[200px] w-full rounded-xl object-cover transition-transform duration-700 hover:scale-[1.03]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="warm-frame rounded-2xl p-2 overflow-hidden">
                  <Image src="/assets/pink-money-1.jpg" alt="Dollar bills representing deposits that stay safe"
                    width={900} height={1200} loading="lazy" sizes="(max-width: 768px) 50vw, 22vw"
                    className="h-[160px] md:h-[200px] w-full rounded-xl object-cover transition-transform duration-700 hover:scale-[1.03]" />
                </div>
                <div className="warm-frame rounded-2xl p-2 overflow-hidden">
                  <Image src="/assets/bank-pink-photo.jpg" alt="Debit card and phone on a pink surface"
                    width={900} height={1200} loading="lazy" sizes="(max-width: 768px) 50vw, 22vw"
                    className="h-[160px] md:h-[200px] w-full rounded-xl object-cover transition-transform duration-700 hover:scale-[1.03]" />
                </div>
              </div>

              {/* Compact 1:1 trust badge */}
              <motion.div {...fadeUp(0.3)}
                className="section-surface flex items-center gap-5 rounded-2xl px-5 py-5 md:px-6"
              >
                <p className="stat-display text-[clamp(2.2rem,5vw,3.2rem)] text-charcoal flex-shrink-0">1:1</p>
                <div className="border-l border-mauve/20 pl-5 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="pulse-dot flex-shrink-0" aria-hidden="true" />
                    <p className="text-[10px] uppercase tracking-[0.18em] text-charcoal/50 font-medium truncate">
                      Reserve ratio · verified monthly
                    </p>
                  </div>
                  <p className="text-[13px] text-charcoal/55 leading-relaxed">
                    Every dollar deposited = every dollar safeguarded. Independent audit. Public dashboard.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Drag Divider — visual contrast ───────────────────────────────── */}
      <section className="px-6 py-16 md:py-24 bg-cream overflow-hidden">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp(0)} className="text-center mb-10 md:mb-14">
            <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-rose/80">
              See the difference
            </p>
            <h2 className="font-headline mt-3 text-[clamp(1.8rem,4.5vw,3.4rem)] font-light leading-tight text-charcoal">
              Where does your money actually go?
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-[15px] leading-relaxed text-charcoal/50">
              Traditional banks lend out up to 97% of your deposits the moment they arrive. Sakina keeps 100%.
            </p>
          </motion.div>
          <motion.div {...fadeUp(0.15)}>
            <DragDivider />
          </motion.div>

          <motion.div {...fadeUp(0.25)} className="mt-16">
            <ReserveVisualizer />
          </motion.div>

          <motion.div {...fadeUp(0.35)} className="mt-10 flex justify-center">
            <a href="#waitlist" className="cta-pill inline-flex px-8 py-3.5 text-[15px]">
              Claim my founding spot
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Personas — editorial, not card grid ──────────────────────────── */}
      <section id="personas" className="bg-[#fdf9f6] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div {...fadeUp(0)} className="max-w-3xl mb-10 md:mb-14">
            <p className="font-headline text-[clamp(1.5rem,3.5vw,2.8rem)] font-light italic leading-snug text-charcoal/70">
              &ldquo;I just want to know my money is still there. All of it. All the time.&rdquo;
            </p>
            <p className="mt-5 md:mt-6 text-[14px] md:text-[15px] leading-relaxed text-charcoal/55">
              Different lives. Different values. The same realization: their bank was quietly working against them. These are the people building Sakina with us.
            </p>
          </motion.div>

          {/* Tension-driven Persona Cards */}
          <div>
            <InteractivePersonas />
          </div>

          <motion.div {...fadeUp(0.2)} className="mt-12 flex flex-col items-center gap-5 text-center">
            <p className="font-headline text-[clamp(1.4rem,3vw,2rem)] font-light text-charcoal">
              If any of that sounded like you — you&apos;re not alone.
            </p>
            <a href="#waitlist" className="cta-pill inline-flex px-7 py-3 text-sm">
              Claim your spot on the waitlist
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Founder note ─────────────────────────────────────────────────── */}
      <section id="founder" className="px-6 py-20 md:py-32 relative overflow-hidden bg-[#FBF7F3]">
        {/* Champagne lamp-light radial glow top right */}
        <div className="pointer-events-none absolute -right-[20%] -top-[10%] w-[80%] h-[80%] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,180,131,0.15),transparent_60%)] blur-3xl" />

        <div className="mx-auto max-w-3xl relative z-10">
          <motion.div {...fadeUp(0)}>
            <hr className="champagne-rule mb-12" />

            <div className="space-y-7 md:space-y-8 font-signature text-[22px] sm:text-[24px] md:text-[28px] leading-[1.6] text-charcoal">
              <ScrollTypingText 
                text="My name is Adil. I'm 24. I'm Sudanese. I'm Muslim. And I grew up watching my community navigate a financial system that wasn't built for them." 
              />
              <ScrollTypingText 
                text="For years I watched people keep money in cash and informal networks — not because they were unsophisticated, but because every mainstream option came with a quiet ethical compromise their faith and conscience could not accept." 
              />
              <ScrollTypingText 
                text="This is bigger than one community. It is the story of anyone who has ever deposited a paycheck and wondered: what is my bank actually doing with my money?" 
              />
              <ScrollTypingText 
                text="Sakina is the Arabic word for tranquility — the stillness that comes from knowing something precious is completely safe and undisturbed." 
              />
              <ScrollTypingText 
                text="We are building from Colorado with everything we have. Not just a bank account — a promise backed by law and verified by evidence." 
              />
            </div>

            <motion.div 
               {...fadeUp(0.2)}
               className="mt-16 flex items-center justify-between"
            >
               <p className="font-signature text-[2rem] text-charcoal">— Adil, Co-Founder</p>
               <div className="opacity-70 grayscale">
                 <SakinaLogo size={48} />
               </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Waitlist ─────────────────────────────────────────────────────── */}
      <section id="waitlist" className="bg-[#fdf9f6] px-6 pb-24 pt-16 md:pb-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-start md:gap-10">
            <motion.div {...fadeUp(0)} className="section-surface p-6 sm:p-8 md:p-10">
              <p className="text-[11px] uppercase tracking-[0.26em] text-rose/80 font-medium">Founding membership</p>
              <h2 className="font-headline mt-3 text-[clamp(1.8rem,4vw,3rem)] font-light leading-tight text-charcoal">
                Your money deserves to rest.
              </h2>
              <p className="mt-4 text-[14px] md:text-[15px] leading-relaxed text-charcoal/60">
                Founding spots are limited. Early members lock in permanent benefits from the moment they sign up.
              </p>
              <ul className="mt-7 space-y-3">
                {founderBenefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[14px] text-charcoal/68">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose/65" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-9">
                <WaitlistForm />
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.15)} className="hidden md:grid gap-5">
              <div className="warm-frame rounded-2xl p-2 overflow-hidden">
                <Image src="/assets/pink-money-2.jpg" alt="Wallet and cash representing financial independence"
                  width={1200} height={760} loading="lazy" sizes="45vw"
                  className="h-[260px] w-full rounded-xl object-cover transition-transform duration-700 hover:scale-[1.03]" />
              </div>
              <div className="warm-frame rounded-2xl p-2 overflow-hidden">
                <Image src="/assets/bank-photo-gabby-k.jpg" alt="Confidently using a payment card at checkout"
                  width={1200} height={760} loading="lazy" sizes="45vw"
                  className="h-[240px] w-full rounded-xl object-cover transition-transform duration-700 hover:scale-[1.03]" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-3xl">
          <motion.div {...fadeUp(0)}>
            <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-charcoal/50">Common questions</p>
            <h2 className="font-headline mt-3 text-[clamp(1.6rem,4vw,3.2rem)] font-light leading-tight text-charcoal">
              Before you sign up, you should know this.
            </h2>
          </motion.div>

          <div className="mt-10 md:mt-12">
            {faqs.map((faq, idx) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} idx={idx} />
            ))}
          </div>

          <motion.div {...fadeUp(0.5)} className="mt-10 text-center">
            <p className="text-[14px] text-charcoal/50">Still have questions?</p>
            <a href="mailto:hello@sakina.io" className="mt-1.5 inline-block text-[14px] text-rose font-medium transition-colors hover:underline">
              hello@sakina.io →
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer id="footer" className="border-t border-mauve/18 px-6 py-10 md:py-12">
        <div className="mx-auto max-w-6xl">
          <motion.p {...fadeUp(0)}
            className="font-headline mb-8 md:mb-10 text-center text-[clamp(1.1rem,3vw,1.9rem)] font-light italic text-charcoal/50"
          >
            &ldquo;Every dollar you deposit with Sakina is a dollar that stays yours.&rdquo;
          </motion.p>
          <hr className="champagne-rule mb-8 md:mb-10" />

          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <SakinaLogo size={22} />
                <span className="font-headline text-2xl font-light tracking-[0.1em]">SAKINA</span>
              </div>
              <p className="mt-1.5 text-[13px] text-charcoal/55">Tranquility for your money.</p>
              <p className="mt-1 text-[12px] text-charcoal/45">© 2026 Sakina Financial Inc. All rights reserved.</p>
              <p className="mt-1 text-[12px] text-charcoal/38">Built in Colorado. Launching across America.</p>
            </div>

            <nav aria-label="Footer navigation" className="text-[13px] text-charcoal/60">
              <a href="mailto:hello@sakina.io" className="block hover:text-rose transition-colors">
                hello@sakina.io
              </a>
              <div className="mt-2.5 flex gap-5">
                <a href="/privacy" className="hover:text-rose transition-colors">Privacy Policy</a>
                <a href="/terms" className="hover:text-rose transition-colors">Terms of Service</a>
                <a href="mailto:hello@sakina.io" className="hover:text-rose transition-colors">Contact</a>
              </div>
            </nav>
          </div>

          <p className="mt-8 border-t border-mauve/12 pt-6 text-[11px] leading-relaxed text-charcoal/45">
            Sakina is a financial technology company, not a bank. Banking services provided through FDIC-insured partner banks. Deposit accounts insured up to $250,000 per depositor. Currently in pre-launch. Not available in all states.
          </p>
        </div>
      </footer>
    </main>
  );
}
