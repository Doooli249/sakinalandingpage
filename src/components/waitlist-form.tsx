"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { isValidEmail } from "@/lib/utils";
import { SakinaButton } from "@/components/ui/sakina-button";

// Animated checkmark — draws on mount
function AnimatedCheck() {
  const shouldReduce = useReducedMotion();
  return (
    <motion.svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      initial={shouldReduce ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.path
        d="M4 11l5.5 5.5L18 6"
        stroke="#D9778A"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={shouldReduce ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      />
    </motion.svg>
  );
}

function useWaitlistCount() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/waitlist", { signal: controller.signal })
      .then((r) => r.json())
      .then((d: { count?: number }) => setCount(d.count ?? null))
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return count;
}

export function WaitlistForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [motivation, setMotivation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const count = useWaitlistCount();
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedName = firstName.trim().slice(0, 100);
    const normalized = email.trim().toLowerCase().slice(0, 254);
    const trimmedMotivation = motivation.trim().slice(0, 1000);

    if (!trimmedName) {
      setError("Please enter your first name.");
      return;
    }
    if (!isValidEmail(normalized)) {
      setError("Please enter a valid email address.");
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setIsSubmitting(true);
      setError("");
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: trimmedName,
          email: normalized,
          motivation: trimmedMotivation,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError("We couldn't submit right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "https://sakina.io";
    const text = "I just reserved my founding spot at Sakina — the first US bank account where your deposits are legally guaranteed to never be lent out. Worth a look:";

    if (navigator.share) {
      try {
        await navigator.share({ title: "Sakina — Tranquility for your money.", text, url });
      } catch {
        // user dismissed — that's fine
      }
      return;
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  if (submitted) {
    return (
      <motion.div
        className="space-y-5"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Success card */}
        <div className="rounded-2xl border border-rose/22 bg-rose/5 p-7 text-center">
          <motion.div
            className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-rose/28 bg-cream"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          >
            <AnimatedCheck />
          </motion.div>
          <motion.p
            className="font-headline text-2xl font-light text-charcoal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            You&rsquo;re on the list.
          </motion.p>
          <motion.p
            className="mt-2 text-[14px] leading-relaxed text-charcoal/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
          >
            Founding member spot reserved. We&rsquo;ll send launch updates when the time comes.
          </motion.p>
        </div>

        {/* Share prompt */}
        <div className="rounded-2xl border border-mauve/22 bg-white/60 p-6">
          <p className="font-headline text-[1rem] font-medium text-charcoal">
            Know someone who&rsquo;d care about this?
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-charcoal/55">
            Every person you refer moves you higher on the launch list and helps us build Sakina with the right community from day one.
          </p>
            <SakinaButton
              onClick={handleShare}
              animateBackground={false}
              className="mt-4 w-full px-6 py-3 text-[14px]"
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mr-2">
                    <path d="M2 7l3.5 3.5L12 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Link copied
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="mr-2">
                    <path d="M9 1h4v4M13 1L7 7M6 3H2a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V9" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Share Sakina with a friend
                </>
              )}
            </SakinaButton>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Social proof counter */}
      {count !== null && (
        <div className="flex items-center gap-2 rounded-full border border-rose/20 bg-rose/5 px-3.5 py-2">
          <span className="pulse-dot" />
          <p className="text-[12px] text-charcoal/60">
            <span className="font-medium text-charcoal">{count.toLocaleString()}</span> founding members have already joined
          </p>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="first_name"
            className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-charcoal/45"
          >
            First Name
          </label>
          <input id="first_name" type="text" required value={firstName}
            onChange={(e) => setFirstName(e.target.value)} placeholder="Ada"
            maxLength={100} autoComplete="given-name"
            className="h-11 w-full rounded-xl border border-mauve/28 bg-white/60 px-4 text-[14px] text-charcoal placeholder:text-charcoal/28 outline-none transition focus:border-rose/45 focus:ring-2 focus:ring-rose/18"
          />
        </div>
        <div>
          <label htmlFor="email"
            className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-charcoal/45"
          >
            Email Address
          </label>
          <input id="email" type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="ada@example.com"
            maxLength={254} autoComplete="email"
            className="h-11 w-full rounded-xl border border-mauve/28 bg-white/60 px-4 text-[14px] text-charcoal placeholder:text-charcoal/28 outline-none transition focus:border-rose/45 focus:ring-2 focus:ring-rose/18"
          />
        </div>
      </div>

      <div>
        <label htmlFor="motivation"
          className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-charcoal/45"
        >
          What matters most to you about how your bank handles your money?{" "}
          <span className="normal-case tracking-normal text-charcoal/30">(optional)</span>
        </label>
        <textarea id="motivation" rows={2} value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          placeholder="Optional — but we actually read every single response."
          maxLength={1000}
          className="w-full resize-none rounded-xl border border-mauve/28 bg-white/60 px-4 py-3 text-[14px] text-charcoal placeholder:text-charcoal/28 outline-none transition focus:border-rose/45 focus:ring-2 focus:ring-rose/18"
        />
      </div>

      <SakinaButton
        type="submit"
        disabled={isSubmitting}
        className="h-14 w-full text-[15px] font-medium tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Saving your spot…" : "I'm Ready — Claim My Founding Spot"}
      </SakinaButton>

      {error ? (
        <p role="alert" className="text-[12px] text-red-500">{error}</p>
      ) : (
        <div className="flex flex-col gap-1 text-[11px] text-charcoal/38">
          <p>We will never sell your information. Ever.</p>
          <p>No spam — launch updates only.</p>
          <p>Built in Colorado. Launching across America.</p>
        </div>
      )}
    </form>
  );
}
