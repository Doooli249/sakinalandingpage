"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { WaitlistForm } from "@/components/waitlist-form";

function useCountUp(target: number, start: boolean, duration = 1600) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [duration, start, target]);

  return value;
}

function CountOnView({
  target,
  formatter,
  className,
}: {
  target: number;
  formatter: (v: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const value = useCountUp(target, inView, 1600);

  return (
    <div ref={ref} className={className}>
      {formatter(value)}
    </div>
  );
}

const problemColumns = [
  {
    icon: "💸",
    title: "It gets lent out",
    body: "Banks are legally permitted to lend out up to 97% of your deposit the moment it arrives. Your $1,000 becomes someone else’s loan. You earn nothing. They pocket the interest. You bear the risk.",
  },
  {
    icon: "🛢️",
    title: "It funds things you’d never choose",
    body: "Major US banks have committed hundreds of billions to fossil fuels, weapons manufacturers, private prisons, and predatory lenders. Ordinary checking deposits help fund it.",
  },
  {
    icon: "🎲",
    title: "It gets leveraged",
    body: "Derivatives. Securitized risk. Speculative positions. Banks can treat customer deposits as fuel for complexity while customers carry the uncertainty.",
  },
];

const features = [
  {
    icon: "🔐",
    title: "Your money stays put. Always.",
    body: "Your funds are held in a legally-segregated, FDIC-insured account at our partner bank. Never loaned. Never collateralized. Never moved without your consent.",
  },
  {
    icon: "💳",
    title: "A real Visa debit card. Accepted everywhere.",
    body: "Tap to pay, shop online, and use ATMs globally. It works like your current bank card, except your deposited money remains yours in full.",
  },
  {
    icon: "💰",
    title: "Rewards that do not cost your values.",
    body: "Get 1-3% cashback on everyday purchases, with extra rewards at ethical and independent merchants.",
  },
  {
    icon: "📡",
    title: "Proof of Reserves. Live. Public.",
    body: "Every day Sakina shows that total user deposits equal total safeguarded funds. 1:1, with independent monthly verification.",
  },
];

const personas = [
  {
    icon: "🕌",
    label: "For the faith-conscious",
    quote:
      "I wanted an American account that honors faith and conscience as legal structure, not as marketing copy.",
  },
  {
    icon: "🌱",
    label: "For the environmentally aware",
    quote:
      "I changed my lifestyle years ago. Sakina lets my money change with it.",
  },
  {
    icon: "👾",
    label: "For the crypto-native",
    quote:
      "I need fiat for daily life, but I want custody clarity that feels like self-respect.",
  },
  {
    icon: "✊",
    label: "For the socially conscious",
    quote:
      "I knew there was a mismatch between my values and my bank. Sakina finally closes that gap.",
  },
  {
    icon: "🎓",
    label: "For the first-time banker",
    quote:
      "If this is my first account, I want it built on a promise I understand.",
  },
  {
    icon: "👁️",
    label: "For anyone paying attention",
    quote: "I just want to know my money is still there. All of it. All the time.",
  },
];

const howSteps = [
  {
    number: 1,
    title: "Join the waitlist today",
    body: "Add your name and email. No credit check, no SSN, no commitment.",
  },
  {
    number: 2,
    title: "Get early access when we launch",
    body: "Founding members get in first with permanent launch benefits.",
  },
  {
    number: 3,
    title: "Deposit, get your card, find your peace",
    body: "Virtual card same day, physical card in five business days, safeguards from first dollar.",
  },
];

const stats = [
  {
    display: "$17.9T",
    target: 17.9,
    formatter: (v: number) => `$${v.toFixed(1)}T`,
    label: "Total US bank deposits not sitting still in a vault.",
  },
  {
    display: "73%",
    target: 73,
    formatter: (v: number) => `${Math.round(v)}%`,
    label: "Americans who want values-aligned money behavior.",
  },
  {
    display: "$0",
    target: 0,
    formatter: () => "$0",
    label: "Amount Sakina lends from your personal deposit.",
  },
  {
    display: "1:1",
    target: 1,
    formatter: () => "1:1",
    label: "Your deposit and safeguarded funds. Always matched.",
  },
];

export default function HomePage() {
  const heroTagWords = ["TRANQUILITY", "FOR", "YOUR", "MONEY"];

  return (
    <main className="section-shell bg-cream text-charcoal">
      <div className="intro-overlay pointer-events-none fixed inset-0 z-50 flex flex-col items-center justify-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="font-headline text-6xl tracking-[0.14em] md:text-8xl"
        >
          SAKINA
        </motion.div>
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.18,
                delayChildren: 0.8,
              },
            },
          }}
          className="mt-4 flex flex-wrap justify-center gap-2 text-xs tracking-[0.22em] text-white/80"
        >
          {heroTagWords.map((word) => (
            <motion.span
              key={word}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              className="rounded-full border border-white/35 px-3 py-1"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <section id="hero" className="relative px-6 pb-16 pt-8 md:pb-24 md:pt-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_18%,rgba(217,119,138,0.2),transparent_34%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(192,132,151,0.16),transparent_28%)]" />

        <div className="relative mx-auto max-w-6xl">
          <header className="mb-9 flex items-center justify-between rounded-full border border-mauve/30 bg-white/50 px-4 py-2 backdrop-blur">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/flower-logo.jpeg"
                alt="Sakina flower logo"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full border border-charcoal/10 bg-white object-cover"
              />
              <div>
                <p className="font-headline text-xl tracking-[0.1em]">SAKINA</p>
                <p className="-mt-1 text-[11px] uppercase tracking-[0.18em] text-charcoal/60">
                  Tranquility for your money
                </p>
              </div>
            </div>
            <a href="#waitlist" className="cta-pill px-4 py-2 text-sm">
              Reserve founding access
            </a>
          </header>

          <div className="grid gap-10 md:grid-cols-[1.02fr_0.98fr] md:items-center">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.25 }}
                className="mb-4 inline-flex rounded-full border border-rose/35 bg-white/70 px-3 py-1 text-xs font-medium tracking-[0.16em] text-charcoal/70"
              >
                TRANQUILITY FOR YOUR MONEY
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="font-headline text-5xl leading-[0.98] text-charcoal md:text-7xl"
              >
                Your money should be exactly where you left it.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: 0.45 }}
                className="mt-5 whitespace-pre-line text-lg leading-relaxed text-charcoal/75"
              >
                {"Not loaned to a corporation.\nNot invested in industries you oppose.\nNot leveraged, gambled, or quietly misused.\nJust yours. Completely. Always."}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: 0.58 }}
                className="mt-6 max-w-2xl text-base leading-relaxed text-charcoal/75"
              >
                Sakina is a US checking experience built on one legally-enforced promise: your deposits are never touched, never lent, and never moved without your consent. You get a real Visa card, real rewards, and real calm.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.72 }}
                className="mt-8"
              >
                <a href="#waitlist" className="cta-pill rose-glow inline-flex px-7 py-3 text-base">
                  Join the Waitlist - Free Forever
                </a>
                <p className="mt-3 text-sm text-charcoal/65">
                  Science class version: no mystery chemistry, no hidden reactions. Just your money staying stable.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotate: -1 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75 }}
              className="relative"
            >
              <div className="warm-frame rotate-[-2deg] rounded-[1.65rem] p-3">
                <Image
                  src="/assets/bank-photo-voitkevich.jpg"
                  alt="Person using payment card"
                  width={1200}
                  height={1500}
                  className="h-[520px] w-full rounded-2xl object-cover"
                />
              </div>
              <div className="warm-frame absolute -bottom-8 -left-6 hidden w-44 rotate-6 p-2 md:block">
                <Image
                  src="/assets/flower-logo.jpeg"
                  alt="Sakina flower mark"
                  width={320}
                  height={320}
                  className="rounded-xl object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="problem" className="px-6 py-18 md:py-24">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="section-surface p-7 md:p-10"
          >
            <div className="text-center">
              <CountOnView
                target={17900000000000}
                formatter={(v) =>
                  `$${Math.round(v).toLocaleString("en-US", {
                    maximumFractionDigits: 0,
                  })}`
                }
                className="font-headline text-3xl text-charcoal md:text-6xl"
              />
              <motion.p
                initial={{ opacity: 0, scaleX: 0.8 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="mx-auto mt-3 max-w-fit border-t-2 border-rose/80 pt-2 text-sm font-medium uppercase tracking-[0.15em] text-rose"
              >
                None of this is sitting in your account right now.
              </motion.p>
            </div>

            <h2 className="font-headline mx-auto mt-8 max-w-3xl text-center text-3xl leading-tight md:text-5xl">
              Here is what happens the moment you deposit money at a traditional bank.
            </h2>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {problemColumns.map((item, idx) => (
                <motion.article
                  key={item.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: idx * 0.12 }}
                  className="rounded-2xl border border-mauve/35 bg-white/60 p-5"
                >
                  <p className="text-2xl">{item.icon}</p>
                  <h3 className="mt-2 text-xl font-semibold text-charcoal">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{item.body}</p>
                </motion.article>
              ))}
            </div>

            <div className="mt-7 text-center leading-relaxed">
              <p className="text-lg text-charcoal/85">You never agreed to this.</p>
              <p className="text-lg text-charcoal/85">You were just never given a choice.</p>
              <p className="font-headline text-3xl text-rose">Sakina is the choice.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="solution" className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.65 }}
            className="section-surface relative p-7 md:p-10"
          >
            <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_center,rgba(217,119,138,0.15),transparent_42%)]" />
            <p className="text-xs font-semibold tracking-[0.2em] text-rose">WHAT SAKINA ACTUALLY IS</p>
            <h2 className="font-headline mt-2 text-4xl md:text-5xl">Banking that keeps its promise.</h2>
            <p className="mt-3 max-w-3xl text-charcoal/75">
              Sakina means tranquility in Arabic. Every feature below is one expression of that word.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
              <div className="grid gap-4 sm:grid-cols-2">
                {features.map((feature, idx) => (
                  <motion.article
                    key={feature.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: idx * 0.1 }}
                    className="rounded-2xl border border-mauve/30 bg-white/70 p-5"
                  >
                    <p className="text-2xl">{feature.icon}</p>
                    <h3 className="mt-2 text-lg font-semibold">{feature.title}</h3>
                    <p className="mt-2 text-sm text-charcoal/75">{feature.body}</p>
                  </motion.article>
                ))}
              </div>

              <div className="grid gap-4">
                <div className="warm-frame rounded-2xl p-2">
                  <Image
                    src="/assets/bank-photo-gabby-k.jpg"
                    alt="Card reader and debit card"
                    width={1200}
                    height={760}
                    className="h-[210px] w-full rounded-xl object-cover"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="warm-frame rounded-2xl p-2">
                    <Image
                      src="/assets/pink-money-1.jpg"
                      alt="Bank and money visual"
                      width={900}
                      height={1200}
                      className="h-[220px] w-full rounded-xl object-cover"
                    />
                  </div>
                  <div className="warm-frame rounded-2xl p-2">
                    <Image
                      src="/assets/bank-pink-photo.jpg"
                      alt="Phone and card on pink background"
                      width={900}
                      height={1200}
                      className="h-[220px] w-full rounded-xl object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="proof" className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
            className="section-surface p-7 md:p-10"
          >
            <h2 className="font-headline text-center text-4xl leading-tight md:text-5xl">
              We do not ask for your trust. We earn it every single day.
            </h2>
            <p className="mx-auto mt-4 max-w-3xl text-center text-charcoal/75">
              Most banks ask you to trust without visibility. Sakina shows the reserve relationship in real time so you can verify, not guess.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
              <div className="rounded-2xl border border-mauve/35 bg-white/70 p-6">
                <div className="relative h-32">
                  <div className="absolute left-4 right-4 top-16 h-1 rounded bg-charcoal/25" />
                  <motion.div
                    initial={{ x: -26, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="absolute left-2 top-4 rounded-xl border border-rose/35 bg-cream px-4 py-2 text-sm font-semibold"
                  >
                    Your deposit
                  </motion.div>
                  <motion.div
                    initial={{ x: 26, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="absolute right-2 top-4 rounded-xl border border-rose/35 bg-cream px-4 py-2 text-sm font-semibold"
                  >
                    Sakina safeguarded funds
                  </motion.div>
                </div>
                <p className="font-headline text-center text-4xl text-rose">1:1. Every day. Verified.</p>
                <p className="mt-2 text-center text-sm text-charcoal/70">
                  Ask your current bank to show you the same thing. We will be here when they cannot.
                </p>
              </div>

              <div className="warm-frame rounded-2xl p-2">
                <Image
                  src="/assets/google-gemini-bank-lock.png"
                  alt="Bank lock visual"
                  width={920}
                  height={1300}
                  className="h-[300px] w-full rounded-xl object-cover"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="personas" className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-headline text-center text-4xl md:text-5xl">
            Sakina is for anyone who has ever wondered -
            <span className="mt-1 block text-rose">&quot;What is my bank actually doing with my money?&quot;</span>
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {personas.map((persona, idx) => (
              <motion.article
                key={persona.label}
                initial={{ opacity: 0, y: 18, rotate: -1 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.42, delay: idx * 0.08 }}
                className="rounded-2xl border border-mauve/30 bg-white/70 p-5"
              >
                <p className="text-2xl">{persona.icon}</p>
                <h3 className="mt-2 text-lg font-semibold">{persona.label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/75">{persona.quote}</p>
              </motion.article>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center gap-4 text-center">
            <p className="font-headline text-3xl">If any of those sounded like you - welcome home.</p>
            <a href="#waitlist" className="cta-pill inline-flex px-6 py-3 text-base">
              Claim your spot on the waitlist
            </a>
          </div>
        </div>
      </section>

      <section id="how_it_works" className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.62 }}
            className="section-surface p-7 md:p-10"
          >
            <h2 className="font-headline text-4xl md:text-5xl">Three steps to banking that finally makes sense.</h2>

            <div className="relative mt-8 space-y-8">
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="absolute left-4 top-3 h-[calc(100%-28px)] w-px origin-top bg-rose/55"
              />
              {howSteps.map((step, idx) => (
                <motion.article
                  key={step.number}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.12 }}
                  className="relative pl-12"
                >
                  <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border border-rose bg-rose text-sm font-semibold text-white">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-charcoal/75">{step.body}</p>
                </motion.article>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section id="stats" className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-headline text-center text-4xl md:text-5xl">
            The problem is not small.
            <span className="block">Neither is our answer.</span>
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {stats.map((stat, idx) => (
              <motion.article
                key={stat.display}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="rounded-2xl border border-mauve/35 bg-white/70 p-6"
              >
                <CountOnView
                  target={stat.target}
                  formatter={stat.formatter}
                  className="font-headline text-4xl text-charcoal md:text-5xl"
                />
                <p className="mt-2 text-sm text-charcoal/75">{stat.label}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section id="founder" className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.62 }}
            className="rounded-3xl border border-champagne/60 bg-[#fff8f3] p-8 md:p-12"
          >
            <h2 className="font-headline text-4xl md:text-5xl">Why I built this.</h2>
            <div className="mt-6 space-y-4 text-[15px] leading-7 text-charcoal/80 md:text-base">
              <p>
                My name is Adil. I am 24 years old. I am Sudanese. I am Muslim. I grew up watching my community navigate a financial system that was not built for them.
              </p>
              <p>
                For years I watched people keep money in cash and informal networks, not because they were unsophisticated, but because mainstream options came with quiet compromises that faith and conscience could not accept.
              </p>
              <p>
                This is bigger than one community. It is the story of anyone who has ever deposited a paycheck and wondered what their bank is doing with it.
              </p>
              <p>
                Sakina is the Arabic word for tranquility, the stillness that comes from knowing something precious is safe and undisturbed.
              </p>
              <p>
                We are building from Colorado with everything we have: not just a bank account, but a promise backed by law and verified by evidence.
              </p>
            </div>
            <p className="font-signature mt-8 text-4xl text-charcoal">- Adil, Co-Founder, Sakina</p>
          </motion.div>
        </div>
      </section>

      <section id="waitlist" className="px-6 pb-20 pt-12 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-[1.05fr_0.95fr] md:items-start">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.58 }}
              className="section-surface p-7 md:p-9"
            >
              <h2 className="font-headline text-4xl md:text-5xl">Your money deserves to rest.</h2>
              <p className="mt-3 text-charcoal/75">
                Founding members receive better cashback, zero monthly fees for life, and first launch access.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-charcoal/70">
                Bill Nye version: when systems are stable, everything behaves better. Let us put your money in a stable system.
              </p>

              <ul className="mt-6 space-y-2 text-sm text-charcoal/75">
                <li>• Founding member Visa card, limited edition</li>
                <li>• Higher cashback rates, locked in permanently</li>
                <li>• Zero monthly fees, for life</li>
                <li>• First access at launch</li>
                <li>• Direct access to the founding team</li>
              </ul>

              <div className="mt-8">
                <WaitlistForm />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.62 }}
              className="grid gap-4"
            >
              <div className="warm-frame rounded-2xl p-2">
                <Image
                  src="/assets/pink-money-2.jpg"
                  alt="Pink wallet and cash"
                  width={1200}
                  height={760}
                  className="h-[250px] w-full rounded-xl object-cover"
                />
              </div>
              <div className="warm-frame rounded-2xl p-2">
                <Image
                  src="/assets/bank-photo-gabby-k.jpg"
                  alt="Person tapping payment terminal"
                  width={1200}
                  height={760}
                  className="h-[230px] w-full rounded-xl object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer id="footer" className="border-t border-mauve/35 px-6 py-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/assets/flower-logo.jpeg"
                alt="Sakina flower logo"
                width={22}
                height={22}
                className="h-5 w-5 rounded-full border border-charcoal/15"
              />
              <span className="font-headline text-2xl tracking-[0.08em]">SAKINA</span>
            </div>
            <p className="mt-1 text-sm text-charcoal/75">Tranquility for your money.</p>
            <p className="mt-2 text-xs text-charcoal/65">© 2026 Sakina Financial Inc. All Rights Reserved</p>
          </div>

          <div className="text-sm text-charcoal/75">
            <p>hello@sakina.io</p>
            <div className="mt-2 flex gap-4">
              <a href="#" className="hover:text-rose">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-rose">
                Terms of Service
              </a>
              <a href="#" className="hover:text-rose">
                Contact
              </a>
            </div>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-6xl text-xs leading-relaxed text-charcoal/65">
          Sakina is a financial technology company, not a bank. Deposit accounts are FDIC-insured through our partner bank. Currently in pre-launch.
        </p>
      </footer>
    </main>
  );
}
