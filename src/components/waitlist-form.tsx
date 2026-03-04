"use client";

import { FormEvent, useState } from "react";

export function WaitlistForm() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [motivation, setMotivation] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalized)) {
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
      setFirstName("");
      setEmail("");
      setMotivation("");
    } catch {
      setError("We couldn’t submit right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-rose/40 bg-cream p-6 shadow-[0_14px_30px_rgba(28,28,28,0.08)]">
        <p className="text-xl font-semibold text-charcoal">You are on the list.</p>
        <p className="mt-2 text-sm text-charcoal/75">
          Founding member spot reserved. We will send launch updates and early-access details.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-mauve/35 bg-cream p-5 shadow-[0_18px_34px_rgba(28,28,28,0.08)]"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="first_name" className="mb-1 block text-xs font-medium uppercase tracking-[0.14em] text-charcoal/70">
            First Name
          </label>
          <input
            id="first_name"
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Ada"
            className="h-11 w-full rounded-xl border border-mauve/40 bg-white/70 px-4 text-sm text-charcoal outline-none ring-rose transition focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-medium uppercase tracking-[0.14em] text-charcoal/70">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ada@example.com"
            className="h-11 w-full rounded-xl border border-mauve/40 bg-white/70 px-4 text-sm text-charcoal outline-none ring-rose transition focus:ring-2"
          />
        </div>
      </div>

      <div>
        <label htmlFor="motivation" className="mb-1 block text-xs font-medium uppercase tracking-[0.14em] text-charcoal/70">
          What matters most to you about how your bank handles your money?
        </label>
        <textarea
          id="motivation"
          rows={4}
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          placeholder="Optional — but we actually read every response."
          className="w-full rounded-xl border border-mauve/40 bg-white/70 px-4 py-3 text-sm text-charcoal outline-none ring-rose transition focus:ring-2"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="rose-glow h-12 w-full rounded-xl bg-rose px-6 text-sm font-semibold text-white transition duration-300 hover:brightness-110 disabled:opacity-70"
      >
        {isSubmitting ? "Saving your spot..." : "I’m Ready — Save My Spot"}
      </button>

      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : (
        <div className="space-y-1 text-xs text-charcoal/70">
          <p>🔒 We will never sell your information. Ever.</p>
          <p>📭 No spam. Launch updates only.</p>
          <p>🇺🇸 Built in Colorado. Launching across America.</p>
        </div>
      )}
    </form>
  );
}
