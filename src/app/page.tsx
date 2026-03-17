"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useScroll, useTransform, MotionValue, AnimatePresence } from "framer-motion";
import { WaitlistForm } from "@/components/waitlist-form";
import { HeroForm } from "@/components/hero-form";
import { SakinaLogo } from "@/components/sakina-logo";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { GooeyText } from "@/components/ui/gooey-text-morphing";
import { ReserveVisualizer } from "@/components/ui/reserve-visualizer";
import { FeatureSteps } from "@/components/ui/feature-section";
import { MagneticCard } from "@/components/ui/magnetic-card";
import { LiveLendingCounter } from "@/components/ui/live-lending-counter";
import { ScrollProgressPetal } from "@/components/ui/scroll-progress-petal";
import { InteractivePersonas } from "@/components/ui/interactive-personas";

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
    setTimeout(() => setIsPointer(true), 0);

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

const howSteps = [
  { step: "01", title: "Join the waitlist today",
    content: "Add your name and email. No credit check, no SSN, no commitment.", image: "/assets/blue-card-1.jpg" },
  { step: "02", title: "Get early access at launch",
    content: "Founding members get in first with permanent launch benefits locked in.", image: "/assets/pink-money-2.jpg" },
  { step: "03", title: "Deposit. Get your card. Breathe.",
    content: "Virtual card same day, physical card in five business days. Safeguards from the first dollar.", image: "/assets/pink-money-3.jpg" },
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

// ── Intro Screen (Interactive) ────────────────────────────────────────────────

function IntroScreen({ onUnlock }: { onUnlock: () => void }) {
  useEffect(() => {
    // Prevent scrolling on the body while the intro is active
    document.body.style.overflow = "hidden";
    
    // Unlock on scroll or swipe
    const handleScroll = () => {
      onUnlock();
    };

    window.addEventListener("wheel", handleScroll, { passive: true, once: true });
    window.addEventListener("touchmove", handleScroll, { passive: true, once: true });
    window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === " ") handleScroll();
    }, { once: true });


    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchmove", handleScroll);
    };
  }, [onUnlock]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream px-6 overflow-hidden"
    >
      {/* "Gooey" blurred background dot */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.55, 0.75, 0.55] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[90vw] max-w-[800px] aspect-square rounded-full bg-[#c08497]/40 blur-[120px] pointer-events-none"
      />
      
      <div className="relative z-10 w-full max-w-4xl text-center flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-rose text-[11px] font-medium tracking-[0.25em] uppercase mb-4"
        >
          The quiet reality
        </motion.p>
        
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.8, duration: 1 }}
           className="h-[140px] md:h-[180px] flex items-center justify-center w-full mb-8 relative"
        >
           <GooeyText 
             texts={[
               "Your bank is cheating on you.",
               "With fossil fuels.",
               "With weapons manufacturers.",
               "Using your own money.",
               "Take your power back."
             ]} 
             morphTime={1.6} 
             cooldownTime={1.8} 
             className="font-headline text-[clamp(2.5rem,6vw,5.5rem)] font-bold text-charcoal text-center leading-[1.1] tracking-tight"
           />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 1 }}
          className="mt-6 flex flex-col items-center gap-4 cursor-pointer"
          onClick={onUnlock}
        >
          <p className="text-[11px] uppercase font-bold tracking-[0.3em] text-charcoal/40 pt-10">
            Swipe up to end it
          </p>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-px h-16 bg-gradient-to-t from-charcoal/50 to-transparent"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });

  // Only show the intro overlay once per visitor (skip on return visits)
  const [showIntro, setShowIntro] = useState(false);
  useEffect(() => {
    // We use a new key to force it for users who saw the old version
    if (!localStorage.getItem("sakina_intro_interactive")) {
      setTimeout(() => setShowIntro(true), 0);
      localStorage.setItem("sakina_intro_interactive", "1");
    }
  }, []);

  return (
    <main className="section-shell bg-cream text-charcoal">
      <AnimatePresence>
        {showIntro && <IntroScreen onUnlock={() => setShowIntro(false)} />}
      </AnimatePresence>

      {/* Skip to content — visible on keyboard focus */}
      <a href="#hero" className="skip-link">Skip to content</a>

      <CursorDot />
      <StickyNav />
      <ScrollProgressPetal />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section id="hero" className="relative pb-20 pt-8 md:pb-28 md:pt-10">
        <BackgroundGradientAnimation
          gradientBackgroundStart="#FAF6F2"
          gradientBackgroundEnd="#FAF6F2"
          firstColor="217, 119, 138" /* Rose */
          secondColor="192, 132, 151" /* Mauve */
          thirdColor="212, 180, 131" /* Champagne */
          fourthColor="250, 246, 242" /* Cream */
          fifthColor="217, 119, 138" /* Rose */
          pointerColor="217, 119, 138"
          size="100%"
          blendingValue="multiply"
          className="absolute inset-0 z-0 opacity-40"
          interactive={true}
        >
          <div className="geo-pattern pointer-events-none absolute inset-0 opacity-20" />
        </BackgroundGradientAnimation>

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
                className="font-headline text-[clamp(2.6rem,5.8vw,5.2rem)] leading-[1.04] text-charcoal"
              >
                <span className="font-light">Stop funding what you </span>
                <em className="font-light italic text-charcoal/65">oppose.</em>
                <br />
                <span className="font-light">Keep your money </span>
                <em className="font-light italic text-charcoal/65">safe.</em>
              </motion.h1>

              <motion.p {...fadeUp(0.3)}
                className="mt-6 max-w-lg text-[15px] leading-[1.75] text-charcoal/65"
              >
                Sakina is the first US debit card account where your deposits are 100% safeguarded. Never lent out to fossil fuels or defense contractors, never invested, and never touched without your consent.
              </motion.p>

              <motion.p {...fadeUp(0.4)}
                className="mt-4 max-w-lg text-[15px] leading-[1.75] text-charcoal/65"
              >
                Just your money, resting safely. Real Visa card. Real rewards. Real calm.
              </motion.p>

              <motion.div {...fadeUp(0.52)} className="mt-9">
                <HeroForm />
              </motion.div>

              <motion.div {...fadeUp(0.62)} className="mt-4">
                <LiveLendingCounter />
              </motion.div>
            </div>

            {/* Hero image — Magnetic Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.85, ease: "easeOut" }}
              className="relative mt-12 md:mt-20 w-full flex justify-center md:block"
            >
              <MagneticCard />
              {/* Decorative logo card — floats beside hero image */}
              <motion.div
                initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.4, duration: 0.6 }}
                className="warm-frame absolute -bottom-16 -left-10 lg:-left-20 hidden items-center justify-center rounded-2xl p-5 md:flex z-20"
              >
                <SakinaLogo size={88} />
              </motion.div>
            </motion.div>
          </div>
          
          {/* Prominent Scroll Hint */}
          <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <motion.a
              href="#problem"
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex flex-col items-center gap-3 cursor-pointer group"
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
          <div className="text-center h-48 md:h-64 flex flex-col items-center justify-center">
            <GooeyText
              texts={["Lending it out", "Funding fossil fuels", "Taking the profit", "Leaving you the risk"]}
              morphTime={1.2}
              cooldownTime={1.5}
              className="w-full h-full"
              textClassName="text-cream text-[3rem] sm:text-[4.5rem] md:text-[6rem] leading-none whitespace-nowrap"
            />
            <motion.p {...fadeUp(0.1)}
              className="mt-6 text-sm font-light uppercase tracking-[0.24em] text-rose"
            >
              None of this is sitting in your account right now.
            </motion.p>
          </div>

          <motion.h2 {...fadeUp(0.15)}
            className="font-headline mx-auto mt-14 max-w-3xl text-center text-[clamp(1.8rem,4vw,3.2rem)] font-light leading-tight text-cream"
          >
            This is what they are doing with your money right now.
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

          <motion.div {...fadeUp(0.4)} className="mt-16 flex justify-center">
             <div className="relative w-full max-w-sm aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden border border-cream/10">
                {/* To view the image attached in chat, save it to public/assets/money-jar.jpg */}
                <Image src="/assets/money-jar.jpg" alt="A glass jar full of money with a Where to next label" fill className="object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent pointer-events-none" />
             </div>
          </motion.div>

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

      {/* ── Comparison — Interactive Visualizer ───────────────────────────── */}
      <section id="comparison" className="px-6 py-20 md:py-28 relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,119,138,0.03),transparent_40%)]" />
        <div className="mx-auto max-w-5xl relative z-10">
          <motion.div {...fadeUp(0)} className="text-center md:text-left mb-16 grid md:grid-cols-[1fr_auto] gap-8 items-end">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.26em] text-rose/80">
                The honest comparison
              </p>
              <h2 className="font-headline mt-3 text-[clamp(1.8rem,4vw,3.2rem)] font-light leading-tight text-charcoal">
                Your bank vs. Sakina.
                <span className="block italic text-charcoal/50"> See it for yourself.</span>
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-charcoal/65">
                Move the slider to see exactly how much of your money a traditional bank actually keeps in reserve, compared to what Sakina legally guarantees.
              </p>
            </div>
            {/* Piggy bank visual element */}
            <div className="hidden md:block w-32 h-32 relative opacity-90">
               <Image src="/assets/piggy-bank.jpg" alt="Pink piggy bank" fill className="object-cover rounded-2xl shadow-sm mix-blend-multiply border border-charcoal/10" />
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.2)}>
            <ReserveVisualizer />
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

          {/* Interactive Personas Grid */}
          <div className="mt-16 w-[100vw] relative left-1/2 -translate-x-1/2 px-6 pb-8">
            <InteractivePersonas />
          </div>

          <motion.div {...fadeUp(0.2)} className="mt-8 flex flex-col items-center gap-5 text-center">
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
      <section id="how_it_works" className="px-6 py-20 md:py-28 bg-[#fffaf5]">
        <div className="mx-auto max-w-6xl">
          <motion.div {...fadeUp(0)} className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.26em] text-rose/80 font-medium">How it works</p>
            <h2 className="font-headline mt-3 text-[clamp(1.8rem,4vw,3.2rem)] font-light leading-tight text-charcoal">
              Three steps to banking that finally makes sense.
            </h2>
          </motion.div>

          <motion.div {...fadeUp(0.15)}>
            <FeatureSteps 
              features={howSteps}
              title=""
              autoPlayInterval={4000}
              imageHeight="h-[300px] md:h-[400px]"
            />
          </motion.div>
        </div>
      </section>

      {/* ── Founder note ─────────────────────────────────────────────────── */}
      <section id="founder" className="px-6 py-20 md:py-32 relative overflow-hidden bg-[#FBF7F3]">
        {/* Champagne lamp-light radial glow top right */}
        <div className="pointer-events-none absolute -right-[20%] -top-[10%] w-[80%] h-[80%] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,180,131,0.15),transparent_60%)] blur-3xl" />

        <div className="mx-auto max-w-3xl relative z-10">
          <motion.div {...fadeUp(0)}>
            <p className="text-[11px] uppercase tracking-[0.26em] text-charcoal/45 font-medium">From the founder</p>
            <h2 className="font-headline mt-4 text-[clamp(2rem,5vw,3.4rem)] font-light text-charcoal">
              Why I built this.
            </h2>
            <hr className="champagne-rule mt-8 mb-12" />

            <div className="space-y-8 font-signature text-[24px] md:text-[28px] leading-[1.6] text-charcoal">
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
