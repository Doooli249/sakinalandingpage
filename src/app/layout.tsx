import type { Metadata } from "next";
import { Caveat, Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-headline",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-signature",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sakina — Tranquility for Your Money",
  description:
    "The first American bank account where your deposits are legally guaranteed never to be lent, invested, or misused. Join the waitlist for pure, ethical banking.",
  keywords: [
    "ethical banking",
    "halal banking",
    "safe banking",
    "no fractional reserve",
    "Islamic finance",
    "debit card",
    "proof of reserves",
  ],
  openGraph: {
    title: "Sakina — Your Money. Finally Still.",
    description:
      "Banking built on one promise: your money stays yours. Always. Join the waitlist.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${jost.variable} ${caveat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
