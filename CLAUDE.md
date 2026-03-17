# CLAUDE.md — Sakina

Read this fully before writing a single line of code or copy.
This is not a generic banking app. Every decision must connect back to this context.

---

## What Sakina Is

Sakina is a financial technology company (not a bank) offering the first American debit card account where user deposits are 100% safeguarded — legally guaranteed to never be lent out, invested in anything, used as collateral, or touched in any way without explicit user consent.

The word "Sakina" (سكينة) is Arabic for tranquility — the divine stillness and peace that comes from knowing something precious is completely safe. This is not a marketing word. It is the product promise encoded in the brand name.

**Tagline: "Tranquility for your money."**

---

## The Problem We Are Solving

Under fractional reserve banking — the system used by every major US bank — when a customer deposits $5,000, the bank is legally permitted to lend out up to 97% of it immediately. That deposit may then fund:

- Fossil fuel extraction (Wells Fargo alone has committed hundreds of billions to fossil fuel financing since the Paris Agreement)
- Weapons manufacturers and defense contractors
- Predatory payday lenders and consumer debt companies
- Speculative derivatives, mortgage-backed securities
- Private prison financing and immigration detention facilities
- Tobacco, alcohol, and gambling industry loans

The US banking market held **$17.9 trillion** in deposits as of 2024. None of it is sitting still in a vault.

**73% of Americans** say they want their financial decisions to align with their personal values. Fewer than 15% have ever taken action to switch. The barrier is not motivation — it is that no product existed that combined ethical safeguarding WITH a modern debit + rewards experience. Sakina is that product.

---

## How Sakina Works

**1. Safeguarded Deposits**
User funds held in a custodial FBO (For Benefit Of) account at an FDIC-insured partner bank. Legally segregated from the partner bank's own assets. A contractual non-lending covenant prohibits any use of these funds beyond facilitating card transactions. Monthly independent third-party audit confirms 1:1 reserves.

**2. Debit Card**
Full Visa debit card issued via BaaS partner (Unit or Synctera). Accepted at 100M+ merchants worldwide. Physical + virtual card. Instant freeze/unfreeze. Real-time notifications.

**3. Rewards**
1-3% cashback on everyday purchases. Bonus cashback at ethical/B-Corp merchants. Optional crypto cashback (Bitcoin, Ethereum, or stablecoin).

**4. Proof of Reserves Dashboard**
Real-time public dashboard showing total user deposits vs safeguarded funds. Ratio always 1:1. Verified monthly. No traditional US neobank does this. This is Sakina's most powerful trust differentiator.

---

## Who This Is For

Sakina is not niche. But the launch strategy is focused on beachhead communities who already have the vocabulary and motivation for this product.

**Primary beachhead: Muslim Americans (~3.5M adults)**
- Islamic law prohibits riba (interest) and funding of harmful industries
- No adequate US product currently serves this need
- Tight community networks = low CAC via mosques, Islamic centers, MSAs
- Sakina's structure aligns perfectly without being marketed as "Islamic banking"

**Secondary targets:**
- ESG / SRI community (environmentally conscious consumers)
- Crypto-native users (attracted by crypto cashback + custody-like positioning)
- Gen Z / Millennials disillusioned with Wall Street
- Faith communities (evangelical Christians, Quakers, Mennonites)
- Privacy advocates
- First-time bankers who want to start right

**CRITICAL: Never position Sakina as exclusively Islamic or Muslim.** It is for anyone with values. The Muslim community is the launch beachhead only.

---

## Founder Story

**Founder:** Adil (Arabic for "fair" and "just")
**Age:** 24 | **Background:** Sudanese-American, Muslim, based in Colorado

Watched his community navigate a financial system not built for them — people he loves kept money in cash, under mattresses, in informal networks, not because they were unsophisticated but because every mainstream option came with a quiet ethical compromise their faith and conscience wouldn't allow.

His name means fair. His product is named peace. Traditional banks are neither.

This is both a Muslim story AND a universal American story about 73% of people who feel their money doesn't reflect who they are.

---

## Purpose of This Landing Page

This is a **pre-launch waitlist page**. Sakina does not exist as a live product yet.

Goals:
1. Collect waitlist signups (name + email + optional motivation)
2. Educate visitors on the problem (most have no idea what their bank does)
3. Build trust before the product exists
4. Segment the audience (optional text field gives qualitative data)
5. Create enough emotional resonance that people refer friends

**Success metric:** Conversion rate from visitor to waitlist signup.
**Secondary metric:** Referral rate.

This is NOT a product page. Nothing to buy or download yet. Every element serves one goal: earning the email address.

---

## Brand & Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `cream` | `#FAF6F2` | Primary background. 70-80% of all surfaces. Philosophy: Safety. |
| `rose` | `#D9778A` | Primary accent. Buttons, links, highlights, glow. **NEVER as background fill.** Philosophy: Human warmth. |
| `charcoal` | `#1C1C1C` | All text (headlines + body). Icons. **NEVER pure black.** Philosophy: Trust & seriousness. |
| `mauve` | `#C08497` | Card backgrounds (5-10% opacity tint only). Divider lines. Subtle gradients. |
| `champagne` | `#D4B483` | **EXTREMELY sparingly. Max 2 uses per page.** Thin divider lines, micro icon accents only. |

### Design Rules
- This is NOT playful pink. This is COMPOSED pink.
- Warm, human, and serious in equal measure.
- Never use Rose as a section background fill.
- Never use pure `#000000` black anywhere.
- Never use cold grays or blues — they break the warmth.
- CTA button glow: `box-shadow: 0 0 24px rgba(217, 119, 138, 0.35)` — soft, not neon.

### Typography
- **Headlines:** Playfair Display (elegant serif — conveys trust + refinement)
- **Body/UI:** Inter (clean, modern, readable)
- **Founder note only:** Caveat (handwriting — human, personal, warm)

---

## Page Sections & Animation Direction

| Section | Feeling | Key Animation |
|---------|---------|---------------|
| Hero | Stepping into a quiet room after chaos | "SAKINA" fades in, holds 2s, tagline appears word-by-word, hero blooms open |
| Problem | Shock → anger → awakening | Counter races to $17.9T, freezes, text: "None of this is sitting in your account right now." |
| Solution | Something finally coming to rest | Calm ripple from center, four feature blocks stagger in |
| Proof | Trust being built in real time | Balance scale enters empty, fills 1:1, green checkmark pulses once |
| Personas | Recognition — "that's me" | Six cards deal in one by one |
| How It Works | Clarity and simplicity | 3-step flow with clean line connectors |
| Stats | Scale of problem + answer | Numbers count up from 0 on scroll entry |
| Founder Note | Human. Vulnerable. Real. | Handwriting-style font, off-white textured bg, warm light feel |
| Waitlist | Warm invitation — "come in" | Form has soft rose pulse (heartbeat glow). CTA glows once on entry. |
| Footer | Minimal. Clean. | Legal disclaimer always present. |

---

## Animation Standards

- Use high-impact section entrances with subtle stagger.
- Avoid constant noisy motion.
- Preferred effects: fade-up + slight y offset, staggered card reveal, count-up for stats, subtle glow pulse on CTA.
- **Reduced motion (`prefers-reduced-motion`):** disable infinite loops, remove dramatic transforms, keep transitions minimal. All Framer Motion animations must respect this.

---

## Waitlist UX Requirements

**Form fields:**
- `first_name` (required)
- `email` (required, client + server validation)
- `motivation` (optional textarea) — placeholder: `"Optional — but we actually read every single response."`

**Behavior:**
- Submit to `POST /api/waitlist` as JSON.
- Show loading state during submit.
- Success state: `"You're on the list. We'll see you at launch."`
- Show useful, specific error states.
- No page reload on submit — React state only.

**Trust signals always visible below form:**
- No data selling. Ever.
- No spam. Launch updates only.
- Built in Colorado. Launching across America.

---

## Tech Stack

- **Framework:** Next.js App Router + TypeScript
- **Styling:** Tailwind CSS with custom color tokens (see above)
- **Animations:** Framer Motion — `useInView` for all scroll triggers
- **Fonts:** Google Fonts (Playfair Display, Inter, Caveat)
- **Backend:** Supabase — table `waitlist_signups` with fields: `id`, `first_name`, `email`, `motivation`, `created_at`
- **Deploy:** Vercel

**Env vars required:**
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## Content Standards

- Tone: clear, calm, evidence-forward, human.
- Avoid jargon unless briefly explained.
- Every major claim should have one support line.
- CTA copy must be specific and action-oriented.
- **Never use:** "seamless", "frictionless", "cutting-edge", "revolutionary", or any generic fintech language.
- Never make this feel like a crypto product or a startup cliché.

---

## File Edit Priorities

When redesigning, edit in this order:
1. `src/app/page.tsx`
2. `src/app/globals.css`
3. Shared components (`src/components/...`)
4. Metadata (`src/app/layout.tsx`)
5. API only if needed (`src/app/api/waitlist/route.ts`)

---

## Redesign Workflow (always follow)

1. Audit current page — visual problems, clarity problems, conversion friction.
2. Propose section-by-section changes briefly. Get alignment before coding.
3. Implement directly in code.
4. Ensure provided image assets are actively used.
5. Run `npm run lint` and `npm run build`.
6. Summarize: files changed, why, verification status.

---

## Acceptance Checklist

A build is "done" only if:
- [ ] Hero communicates mission in <5 seconds.
- [ ] CTA appears above the fold and in later sections.
- [ ] Waitlist form works end-to-end (Supabase or mock fallback).
- [ ] Visual style matches palette rules above.
- [ ] Typography is deliberate and consistent.
- [ ] Provided brand assets/images are visible on page.
- [ ] Page passes `npm run lint` and `npm run build`.
- [ ] Mobile layout is clean at 390px width.
- [ ] Legal footer/disclaimer present.
- [ ] Reduced motion handled correctly.

---

## SEO

Always keep/update in `src/app/layout.tsx`:
- `title`
- `meta description`
- OG title/description
- Keywords: ethical banking, halal banking, Islamic finance, proof of reserves, values-aligned banking

---

## What to Never Do

- Never use pure `#000000` black anywhere
- Never use Rose `#D9778A` as a section background fill
- Never use cold gray or blue tones
- Never use stock photography — illustrated or abstract visuals only
- Never use generic fintech language ("seamless", "frictionless", "cutting-edge")
- Never make this feel like a crypto product or startup cliché
- Never make the CTA glow neon — soft and composed only
- Never add more than 2 uses of Champagne `#D4B483` per page
- Never position Sakina as exclusively Islamic/Muslim — it is for anyone with values

---

## Prompt Macros

When asked **"redesign homepage"** → prioritize hero + CTA + trust proof + waitlist conversion.
When asked **"add section"** → include headline, body, proof line, CTA path.
When asked **"improve styling"** → update both structure and motion, not just colors.

---

## The One Line That Goes On Everything

**"Tranquility for your money."**
