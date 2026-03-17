"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { WaitlistForm } from "@/components/waitlist-form";
import { HeroForm } from "@/components/hero-form";
import { SakinaLogo } from "@/components/sakina-logo";

// ── Count-up ──────────────────────────────────────────────────────────────────

function useCountUp(target: number, start: boolean, duration = 1800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      setValue(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration, start, target]);
  return value;
}

function CountOnView({ target, formatter, className }: {
  target: number;
  formatter: (v: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const value = useCountUp(target, inView, 1800);
  return <div ref={ref} className={className}>{formatter(value)}</div>;
}

// ── Custom cursor dot (desktop pointer devices only) ──────────────────────────

function CursorDot() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springX = useSpring(mouseX, { stiffness: 280, damping: 24 });
  const springY = useSpring(mouseY, { stiffness: 280, damping: 24 });
  const [visible, setVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    // Only activate on desktop pointer devices
    if (!window.matchMedia("(pointer: fine) and (hover: hover)").matches) return;
    setIsPointer(true);

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX - 5);
      mouseY.set(e.clientY - 5);
      setVisible(true);
    };
    const leave = () => setVisible(false);
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, [mouseX, mouseY]);

  if (!isPointer) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed z-[9999] h-2.5 w-2.5 rounded-full bg-rose mix-blend-multiply"
      style={{ left: springX, top: springY, opacity: visible ? 0.65 : 0 }}
    />
  );
}

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
        {/* Hide CTA when the waitlist section is visible — user already sees the form */}
        {!waitlistInView && (
          <a href="#waitlist" className="cta-pill px-5 py-2 text-[13px]">
            Claim Founding Spot
          </a>
        )}
      </div>
    </nav>
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
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.65, ease: "easeOut" as const, delay },
});

// ── Data ──────────────────────────────────────────────────────────────────────

const problemItems = [
  { num: "01", title: "It gets lent out",
    body: "Banks are legally permitted to lend up to 97% of your deposit the moment it arrives. Your $1,000 becomes someone else's loan. You earn nothing. They pocket the interest. You carry the risk." },
  { num: "02", title: "It funds things you'd never choose",
    body: "Major US banks have committed hundreds of billions to fossil fuels, weapons manufacturers, private prisons, and predatory lenders — funded by ordinary checking deposits like yours." },
  { num: "03", title: "It gets leveraged",
    body: "Derivatives. Securitized risk. Speculative positions. Banks use customer deposits as fuel for complexity while customers carry the uncertainty." },
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

const comparison = [
  { label: "Your deposit",                  traditional: "Lent out — up to 97%",          sakina: "Held in full. Always." },
  { label: "What it funds",                 traditional: "Fossil fuels, weapons, prisons", sakina: "Nothing. Zero." },
  { label: "Reserve ratio",                 traditional: "3–10% (fractional reserve)",     sakina: "1:1 (full reserve)" },
  { label: "Proof of reserves",             traditional: "None. Trust us.",                sakina: "Daily, public, verified" },
  { label: "Your explicit consent required",traditional: "No",                             sakina: "Always" },
  { label: "FDIC insured",                  traditional: "Yes",                            sakina: "Yes, via partner bank" },
];

const personas = [
  { label: "For the faith-conscious",
    quote: "I wanted an American account that honors faith and conscience as legal structure — not as marketing copy." },
  { label: "For the environmentally aware",
    quote: "I changed my lifestyle years ago. Sakina lets my money change with it." },
  { label: "For anyone paying attention",
    quote: "I just want to know my money is still there. All of it. All the time." },
];

const howSteps = [
  { n: "01", title: "Join the waitlist today",
    body: "Add your name and email. No credit check, no SSN, no commitment." },
  { n: "02", title: "Get early access at launch",
    body: "Founding members get in first with permanent launch benefits locked in." },
  { n: "03", title: "Deposit. Get your card. Breathe.",
    body: "Virtual card same day, physical card in five business days. Safeguards from the first dollar." },
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  // Only show the intro overlay once per visitor (skip on return visits)
  const [showIntro, setShowIntro] = useState(false);
  useEffect(() => {
    if (!localStorage.getItem("sakina_intro_seen")) {
      setShowIntro(true);
      localStorage.setItem("sakina_intro_seen", "1");
    }
  }, []);

  return (
    <main className="section-shell bg-cream text-charcoal">
      {/* Skip to content — visible on keyboard focus */}
      <a href="#hero" className="skip-link">Skip to content</a>

      <CursorDot />
      <StickyNav />

      {/* ── Intro overlay — logo blooms first, text follows ──────────────── */}
      {showIntro && (
        <div
          className="intro-overlay pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center"
          aria-hidden="true"
        >
          {/* Geometric flower blooms open immediately */}
          <SakinaLogo size={128} bloom delay={0} />

          {/* Brand name follows after the logo finishes drawing */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, ease: "easeOut", delay: 0.85 }}
            className="font-headline mt-6 text-[clamp(2.8rem,10vw,6rem)] font-light tracking-[0.22em] text-white"
          >
            SAKINA
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.15 }}
            className="font-headline mt-1 text-[clamp(0.95rem,2.5vw,1.4rem)] font-light italic tracking-[0.1em] text-white/50"
            dir="rtl" lang="ar"
          >
            سكينة
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="mt-5 text-[10px] tracking-[0.35em] text-white/32 uppercase"
          >
            Tranquility for your money
          </motion.p>
        </div>
      )}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section id="hero" className="relative px-6 pb-20 pt-8 md:pb-28 md:pt-10">
        <div className="geo-pattern pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_20%,rgba(217,119,138,0.13),transparent_45%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_88%_10%,rgba(192,132,151,0.09),transparent_40%)]" />
        <div className="pointer-events-none absolute inset-0 bg-cream/70" />

        {/* Arabic watermark */}
        <div
          aria-hidden="true"
          className="font-headline pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 select-none text-[clamp(8rem,22vw,18rem)] font-light leading-none text-charcoal/[0.03] md:right-10 [writing-mode:vertical-rl]"
          dir="rtl" lang="ar"
        >
          سكينة
        </div>

        <div className="relative mx-auto max-w-6xl">
          {/* Nav */}
          <header className="mb-12 flex items-center justify-between">
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

          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-start">
            <div>
              <motion.span {...fadeUp(0.1)}
                className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose/28 bg-white/55 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal/65"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-rose" />
                Pre-launch waitlist open
              </motion.span>

              {/* Product type anchor */}
              <motion.p {...fadeUp(0.13)}
                className="mb-4 text-[11px] uppercase tracking-[0.22em] text-charcoal/45"
              >
                US Checking Account · Visa Debit Card · Full-Reserve Banking
              </motion.p>

              {/* Mixed-weight headline */}
              <motion.h1 {...fadeUp(0.18)}
                className="font-headline text-[clamp(2.8rem,6vw,5.4rem)] leading-[1.04] text-charcoal"
              >
                <span className="font-light">Your money </span>
                <em className="font-light italic text-charcoal/65">should be </em>
                <span className="font-light">exactly where </span>
                <em className="font-light italic text-charcoal/65">you left it.</em>
              </motion.h1>

              <motion.p {...fadeUp(0.3)}
                className="mt-6 max-w-lg text-[15px] leading-[1.75] text-charcoal/65"
              >
                Not loaned to a corporation. Not invested in industries you oppose.
                Not leveraged, gambled, or quietly misused.
                Just yours — completely, legally, always.
              </motion.p>

              <motion.p {...fadeUp(0.4)}
                className="mt-4 max-w-lg text-[15px] leading-[1.75] text-charcoal/65"
              >
                Sakina is a US checking account built on one legally-enforced promise:
                your deposits are never touched without your consent. Real Visa card.
                Real rewards. Real calm.
              </motion.p>

              <motion.div {...fadeUp(0.52)} className="mt-9">
                <HeroForm />
              </motion.div>

              <motion.div {...fadeUp(0.62)} className="mt-10 flex items-center gap-5">
                <hr className="champagne-rule flex-1" />
                <p className="text-[11px] uppercase tracking-[0.2em] text-charcoal/50">
                  1:1 reserve · FDIC-insured · No monthly fees
                </p>
                <hr className="champagne-rule flex-1" />
              </motion.div>
            </div>

            {/* Hero image — priority load */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, rotate: -0.5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: "easeOut" }}
              className="relative mt-4 md:mt-0"
            >
              <div className="warm-frame rotate-[-1.5deg] rounded-[1.75rem] p-3 shadow-2xl">
                <Image
                  src="/assets/bank-photo-voitkevich.jpg"
                  alt="Person using Sakina debit card at a payment terminal"
                  width={1200} height={1500}
                  priority
                  className="h-[500px] w-full rounded-2xl object-cover md:h-[560px]"
                />
              </div>
              {/* Decorative logo card — floats beside hero image */}
              <motion.div
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.6 }}
                className="warm-frame absolute -bottom-6 -left-5 hidden items-center justify-center rounded-2xl p-5 md:flex"
              >
                <SakinaLogo size={88} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Problem — dark + angled ───────────────────────────────────────── */}
      <section id="problem" className="section-dark-angled relative px-6 pb-4 pt-20 md:pt-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,119,138,0.07),transparent_55%)]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="text-center">
            <CountOnView
              target={17.9}
              formatter={(v) => `$${v.toFixed(1)}T`}
              className="stat-display text-[clamp(4.5rem,14vw,10rem)] text-cream/90"
            />
            <motion.p {...fadeUp(0.1)}
              className="mt-3 text-sm font-light uppercase tracking-[0.24em] text-rose"
            >
              None of this is sitting in your account right now.
            </motion.p>
          </div>

          <motion.h2 {...fadeUp(0.15)}
            className="font-headline mx-auto mt-14 max-w-3xl text-center text-[clamp(1.8rem,4vw,3.2rem)] font-light leading-tight text-cream"
          >
            Here is what happens the moment you deposit money at a traditional bank.
          </motion.h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {problemItems.map((item, idx) => (
              <motion.article key={item.title} {...fadeUp(idx * 0.1 + 0.2)}
                className="rounded-2xl border border-cream/8 p-6 transition-colors duration-300 hover:border-rose/22"
              >
                <p className="font-headline text-[10px] tracking-[0.3em] text-rose/75 uppercase">{item.num}</p>
                <h3 className="mt-3 font-headline text-xl font-light text-cream">{item.title}</h3>
                <p className="mt-3 text-[14px] leading-[1.8] text-cream/60">{item.body}</p>
              </motion.article>
            ))}
          </div>

          <motion.div {...fadeUp(0.5)} className="mt-16 text-center">
            <p className="text-[15px] text-cream/65">You never agreed to this.</p>
            <p className="mt-1 text-[15px] text-cream/65">You were just never given a choice.</p>
            <p className="font-headline mt-5 text-[clamp(1.6rem,3.5vw,2.4rem)] font-light italic text-rose">
              Sakina is the choice.
            </p>
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
              Banking that keeps its promise.
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-charcoal/65">
              Sakina means tranquility in Arabic. Every feature below is one expression of that word.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-8">
              {features.map((f, idx) => (
                <motion.article key={f.title} {...fadeUp(idx * 0.1 + 0.1)} className="editorial-card">
                  <p className="font-headline text-[10px] tracking-[0.3em] text-rose/70 uppercase">{f.num}</p>
                  <h3 className="mt-1.5 font-headline text-xl font-medium text-charcoal">{f.title}</h3>
                  <p className="mt-2 text-[14px] leading-[1.8] text-charcoal/65">{f.body}</p>
                </motion.article>
              ))}
            </div>

            <motion.div {...fadeUp(0.2)} className="grid gap-4">
              <div className="warm-frame rounded-2xl p-2">
                <Image src="/assets/bank-photo-gabby-k.jpg" alt="Person tapping card at payment terminal"
                  width={1200} height={760} loading="lazy"
                  className="h-[200px] w-full rounded-xl object-cover" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="warm-frame rounded-2xl p-2">
                  <Image src="/assets/pink-money-1.jpg" alt="Cash and banking imagery"
                    width={900} height={1200} loading="lazy"
                    className="h-[200px] w-full rounded-xl object-cover" />
                </div>
                <div className="warm-frame rounded-2xl p-2">
                  <Image src="/assets/bank-pink-photo.jpg" alt="Phone and debit card on pink background"
                    width={900} height={1200} loading="lazy"
                    className="h-[200px] w-full rounded-xl object-cover" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Proof ────────────────────────────────────────────────────────── */}
      <section id="proof" className="bg-[#fdf9f6] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.h2 {...fadeUp(0)}
            className="font-headline mx-auto max-w-3xl text-center text-[clamp(1.8rem,4vw,3.2rem)] font-light leading-tight text-charcoal"
          >
            We do not ask for your trust.
            <span className="block italic text-rose/85"> We earn it every single day.</span>
          </motion.h2>
          <motion.p {...fadeUp(0.1)}
            className="mx-auto mt-5 max-w-2xl text-center text-[15px] leading-relaxed text-charcoal/62"
          >
            Most banks ask you to trust without visibility. Sakina shows the reserve relationship publicly — so you can verify, not guess.
          </motion.p>

          <div className="mt-16 grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <motion.div {...fadeUp(0.15)} className="section-surface p-8 md:p-10 text-center">
              <CountOnView target={1} formatter={() => "1:1"}
                className="stat-display text-[clamp(4rem,12vw,8rem)] text-charcoal" />
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="pulse-dot" aria-hidden="true" />
                <p className="text-[11px] uppercase tracking-[0.2em] text-charcoal/55 font-medium">
                  <time dateTime={new Date().toISOString().split("T")[0]}>
                    Last verified: {today}
                  </time>
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 text-left">
                <motion.div
                  initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-xl border border-rose/18 bg-rose/5 p-4"
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] text-charcoal/55">Your deposit</p>
                  <p className="font-headline mt-1 text-2xl font-medium text-charcoal">$5,000</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 14 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
                  className="rounded-xl border border-rose/18 bg-rose/5 p-4"
                >
                  <p className="text-[10px] uppercase tracking-[0.18em] text-charcoal/55">Safeguarded</p>
                  <p className="font-headline mt-1 text-2xl font-medium text-rose">$5,000</p>
                </motion.div>
              </div>
              <p className="mt-6 text-[13px] leading-relaxed text-charcoal/50">
                Ask your current bank to show you the same thing.
                <br />We will be here when they cannot.
              </p>
            </motion.div>

            <motion.div {...fadeUp(0.25)} className="warm-frame rounded-2xl p-2">
              <Image src="/assets/google-gemini-bank-lock.png" alt="Bank security lock illustration"
                width={920} height={1300} loading="lazy"
                className="h-[380px] w-full rounded-xl object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Comparison — semantic table ───────────────────────────────────── */}
      <section id="comparison" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div {...fadeUp(0)}>
            <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-rose/80">
              The honest comparison
            </p>
            <h2 className="font-headline mt-3 text-[clamp(1.8rem,4vw,3.2rem)] font-light leading-tight text-charcoal">
              Your bank vs. Sakina.
              <span className="block italic text-charcoal/50"> Side by side.</span>
            </h2>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="mt-12 overflow-hidden rounded-2xl border border-mauve/18">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-charcoal">
                  <th scope="col" className="px-6 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-cream/50 w-1/3">
                    Feature
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-cream/50 w-1/3">
                    Traditional Bank
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-rose/80 w-1/3">
                    Sakina
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, idx) => (
                  <motion.tr
                    key={row.label}
                    {...fadeUp(idx * 0.06 + 0.15)}
                    className={`border-b border-mauve/10 last:border-b-0 ${idx % 2 === 0 ? "bg-white/60" : "bg-cream/60"}`}
                  >
                    <td className="px-6 py-4 text-[13px] font-medium text-charcoal/75">{row.label}</td>
                    <td className="px-6 py-4 text-center text-[13px] leading-snug text-rose/75">{row.traditional}</td>
                    <td className="px-6 py-4 text-center text-[13px] font-medium leading-snug text-emerald-600">{row.sakina}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.div {...fadeUp(0.5)} className="mt-10 flex justify-center">
            <a href="#waitlist" className="cta-pill inline-flex px-8 py-3.5 text-[15px]">
              Open my Sakina account
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Personas — editorial, not card grid ──────────────────────────── */}
      <section id="personas" className="bg-[#fdf9f6] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-5xl">
          <motion.div {...fadeUp(0)} className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.26em] text-charcoal/50 font-medium">
              Who this is for
            </p>
            <h2 className="font-headline mt-3 text-[clamp(1.8rem,4vw,3.2rem)] font-light leading-tight text-charcoal">
              Sakina is not for everyone.
              <span className="block italic text-charcoal/50"> It is for people who have started asking questions.</span>
            </h2>
          </motion.div>

          {/* Editorial pull-quote layout — alternating columns, no cards */}
          <div className="mt-16 divide-y divide-champagne/40">
            {personas.map((persona, idx) => (
              <motion.article
                key={persona.label}
                {...fadeUp(idx * 0.07 + 0.1)}
                className={`grid gap-6 py-10 md:grid-cols-[3fr_2fr] md:items-center ${idx % 2 === 1 ? "md:[direction:rtl]" : ""}`}
              >
                <blockquote
                  className={`font-headline text-[clamp(1.25rem,2.8vw,1.85rem)] font-light italic leading-snug text-charcoal/78 ${idx % 2 === 1 ? "md:[direction:ltr]" : ""}`}
                >
                  &ldquo;{persona.quote}&rdquo;
                </blockquote>
                <p
                  className={`text-[11px] font-medium uppercase tracking-[0.26em] text-rose/75 ${idx % 2 === 1 ? "md:[direction:ltr] md:text-right" : ""}`}
                >
                  {persona.label}
                </p>
              </motion.article>
            ))}
          </div>

          <motion.div {...fadeUp(0.6)} className="mt-14 flex flex-col items-center gap-5 text-center">
            <p className="font-headline text-[clamp(1.4rem,3vw,2rem)] font-light text-charcoal">
              If any of those sounded like you — welcome home.
            </p>
            <a href="#waitlist" className="cta-pill inline-flex px-7 py-3 text-sm">
              Claim your spot on the waitlist
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section id="how_it_works" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <motion.div {...fadeUp(0)}>
            <p className="text-[11px] uppercase tracking-[0.26em] text-charcoal/50 font-medium">How it works</p>
            <h2 className="font-headline mt-3 text-[clamp(1.8rem,4vw,3.2rem)] font-light leading-tight text-charcoal">
              Three steps to banking that finally makes sense.
            </h2>
          </motion.div>

          <div className="relative mt-14 space-y-12">
            <motion.div
              initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
              viewport={{ once: true }} transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute left-5 top-2 h-[calc(100%-40px)] w-px origin-top bg-rose/28"
            />
            {howSteps.map((step, idx) => (
              <motion.article key={step.n} {...fadeUp(idx * 0.14 + 0.1)} className="relative pl-14">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-rose/35 bg-cream">
                  <span className="font-headline text-xs font-medium tracking-[0.1em] text-rose">{step.n}</span>
                </div>
                <h3 className="font-headline text-xl font-medium text-charcoal">{step.title}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-charcoal/62">{step.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Founder note ─────────────────────────────────────────────────── */}
      <section id="founder" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl">
          <motion.div {...fadeUp(0)}
            className="rounded-3xl border border-champagne/45 bg-[#fffaf5] p-10 md:p-14"
          >
            <p className="text-[11px] uppercase tracking-[0.26em] text-charcoal/45 font-medium">From the founder</p>
            <h2 className="font-headline mt-4 text-[clamp(2rem,5vw,3.4rem)] font-light text-charcoal">
              Why I built this.
            </h2>
            <hr className="champagne-rule mt-8 mb-8" />

            <div className="space-y-5 text-[15px] leading-[1.85] text-charcoal/70">
              <p className="drop-cap">
                My name is Adil. I am 24. I am Sudanese. I am Muslim. I grew up watching my community navigate a financial system that was not built for them.
              </p>
              <p>
                For years I watched people keep money in cash and informal networks — not because they were unsophisticated, but because every mainstream option came with a quiet ethical compromise their faith and conscience could not accept.
              </p>
              <p>
                This is bigger than one community. It is the story of anyone who has ever deposited a paycheck and wondered: what is my bank actually doing with my money?
              </p>
              <p>
                Sakina is the Arabic word for tranquility — the stillness that comes from knowing something precious is completely safe and undisturbed.
              </p>
              <p>
                We are building from Colorado with everything we have. Not just a bank account — a promise backed by law and verified by evidence.
              </p>
            </div>

            <p className="font-signature mt-10 text-4xl text-charcoal/75">— Adil, Co-Founder</p>
          </motion.div>
        </div>
      </section>

      {/* ── Waitlist ─────────────────────────────────────────────────────── */}
      <section id="waitlist" className="bg-[#fdf9f6] px-6 pb-24 pt-16 md:pb-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr] md:items-start">
            <motion.div {...fadeUp(0)} className="section-surface p-8 md:p-10">
              <p className="text-[11px] uppercase tracking-[0.26em] text-rose/80 font-medium">Founding membership</p>
              <h2 className="font-headline mt-3 text-[clamp(1.8rem,4vw,3rem)] font-light leading-tight text-charcoal">
                Your money deserves to rest.
              </h2>
              <p className="mt-4 text-[15px] leading-relaxed text-charcoal/65">
                Founding spots are limited. Early members lock in permanent benefits the moment they sign up.
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

            <motion.div {...fadeUp(0.15)} className="grid gap-5">
              <div className="warm-frame rounded-2xl p-2">
                <Image src="/assets/pink-money-2.jpg" alt="Pink wallet and cash — representing financial freedom"
                  width={1200} height={760} loading="lazy"
                  className="h-[260px] w-full rounded-xl object-cover" />
              </div>
              <div className="warm-frame rounded-2xl p-2">
                <Image src="/assets/bank-photo-gabby-k.jpg" alt="Person using a payment card with confidence"
                  width={1200} height={760} loading="lazy"
                  className="h-[240px] w-full rounded-xl object-cover" />
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
            <h2 className="font-headline mt-3 text-[clamp(1.8rem,4vw,3.2rem)] font-light leading-tight text-charcoal">
              Things you should know before you sign up.
            </h2>
          </motion.div>

          <div className="mt-12">
            {faqs.map((faq, idx) => (
              <motion.div key={faq.q} {...fadeUp(idx * 0.07 + 0.1)}>
                <details className="group border-b border-mauve/18 py-5 last:border-b-0">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[15px] font-medium text-charcoal [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span className="mt-0.5 flex-shrink-0 text-xl leading-none text-rose/70 transition-transform duration-200 group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-[14px] leading-[1.8] text-charcoal/62">{faq.a}</p>
                </details>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.5)} className="mt-12 text-center">
            <p className="text-[14px] text-charcoal/55">Still have questions?</p>
            <a href="mailto:hello@sakina.io" className="mt-1.5 inline-block text-[14px] text-rose transition-colors hover:underline">
              Email us at hello@sakina.io →
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer id="footer" className="border-t border-mauve/18 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <motion.p {...fadeUp(0)}
            className="font-headline mb-10 text-center text-[clamp(1.2rem,3vw,1.9rem)] font-light italic text-charcoal/55"
          >
            &ldquo;Every dollar you deposit with Sakina is a dollar that stays yours.&rdquo;
          </motion.p>
          <hr className="champagne-rule mb-10" />

          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <SakinaLogo size={22} />
                <span className="font-headline text-2xl font-light tracking-[0.1em]">SAKINA</span>
              </div>
              <p className="mt-1.5 text-[13px] text-charcoal/55">Tranquility for your money.</p>
              <p className="mt-1 text-[12px] text-charcoal/45">© 2026 Sakina Financial Inc. All rights reserved.</p>
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
