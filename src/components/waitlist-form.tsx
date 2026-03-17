"use client";

import { FormEvent, useEffect, useState } from "react";
import { isValidEmail } from "@/lib/utils";
import { ShimmerButton } from "@/components/ui/shimmer-button";

function useWaitlistCount() {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    fetch("/api/waitlist")
      .then((r) => r.json())
      .then((d: { count?: number }) => setCount(d.count ?? null))
      .catch(() => setCount(null));
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

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!isValidEmail(normalized)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          email: normalized,
          motivation: motivation.trim(),
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
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
      <div className="space-y-5">
        {/* Success card */}
        <div className="rounded-2xl border border-rose/22 bg-rose/5 p-7 text-center">
          <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-rose/28 bg-cream">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9l4.5 4.5L15 5" stroke="#D9778A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="font-headline text-2xl font-light text-charcoal">You&rsquo;re on the list.</p>
          <p className="mt-2 text-[14px] leading-relaxed text-charcoal/55">
            Founding member spot reserved. We&rsquo;ll send launch updates when the time comes.
          </p>
        </div>

        {/* Share prompt */}
        <div className="rounded-2xl border border-mauve/22 bg-white/60 p-6">
          <p className="font-headline text-[1rem] font-medium text-charcoal">
            Know someone who&rsquo;d care about this?
          </p>
          <p className="mt-1.5 text-[13px] leading-relaxed text-charcoal/55">
            Every person you refer moves you higher on the launch list and helps us build Sakina with the right community from day one.
          </p>
          <button
            onClick={handleShare}
            className="cta-pill mt-4 inline-flex w-full items-center justify-center gap-2 px-6 py-3 text-[14px]"
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7l3.5 3.5L12 3" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Link copied
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M9 1h4v4M13 1L7 7M6 3H2a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V9" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Share Sakina with a friend
              </>
            )}
          </button>
        </div>
      </div>
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
          className="w-full resize-none rounded-xl border border-mauve/28 bg-white/60 px-4 py-3 text-[14px] text-charcoal placeholder:text-charcoal/28 outline-none transition focus:border-rose/45 focus:ring-2 focus:ring-rose/18"
        />
      </div>

      <ShimmerButton type="submit" disabled={isSubmitting}
        className="h-14 w-full rounded-2xl border-none disabled:opacity-60"
        shimmerColor="#ffffff"
        shimmerSize="0.1em"
        background="linear-gradient(145deg, #d9778a, #c08497)"
      >
        <span className="relative z-10 text-white tracking-wide font-medium">
          {isSubmitting ? "Saving your spot…" : "I'm Ready — Claim My Founding Spot"}
        </span>
      </ShimmerButton>

      {error ? (
        <p className="text-[12px] text-red-500">{error}</p>
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
