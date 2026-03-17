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

export function HeroForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
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
        body: JSON.stringify({ first_name: firstName.trim(), email: normalized }),
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

  if (submitted) {
    return (
      <div className="rounded-2xl border border-rose/22 bg-rose/5 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-rose/28 bg-cream">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7l3.5 3.5L12 3" stroke="#D9778A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p className="font-headline text-[15px] font-medium text-charcoal">You&rsquo;re on the list.</p>
            <p className="text-[13px] text-charcoal/55">Founding spot reserved. We&rsquo;ll see you at launch.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Social proof counter — always render something */}
      <div className="flex items-center gap-2">
        <span className="pulse-dot" aria-hidden="true" />
        {count !== null ? (
          <p className="text-[12px] text-charcoal/60">
            <span className="font-medium text-charcoal">{count.toLocaleString()}</span> founding members have already joined
          </p>
        ) : (
          <p className="text-[12px] text-charcoal/40">Joining founding members&hellip;</p>
        )}
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-2.5 sm:flex-row">
        <input
          type="text"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
          aria-label="First name"
          className="h-12 min-w-0 flex-1 rounded-xl border border-mauve/28 bg-white/70 px-4 text-[14px] text-charcoal placeholder:text-charcoal/35 outline-none transition focus:border-rose/45 focus:ring-2 focus:ring-rose/18"
        />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          aria-label="Email address"
          className="h-12 min-w-0 flex-1 rounded-xl border border-mauve/28 bg-white/70 px-4 text-[14px] text-charcoal placeholder:text-charcoal/35 outline-none transition focus:border-rose/45 focus:ring-2 focus:ring-rose/18"
        />
        <ShimmerButton
          type="submit"
          disabled={isSubmitting}
          className="h-12 border-none rounded-full px-8 text-[14px] disabled:opacity-60"
          shimmerColor="#ffffff"
          shimmerSize="0.1em"
          background="linear-gradient(145deg, #d9778a, #c08497)"
        >
          <span className="relative z-10 whitespace-pre text-white tracking-wide font-medium">
            {isSubmitting ? "Saving…" : "Claim My Spot"}
          </span>
        </ShimmerButton>
      </form>

      {error ? (
        <p className="text-[12px] text-red-500">{error}</p>
      ) : (
        <p className="text-[11px] text-charcoal/42">Free forever · No credit check · Launch updates only</p>
      )}
    </div>
  );
}
