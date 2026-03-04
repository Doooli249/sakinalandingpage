import type { Metadata } from "next";
import { Caveat, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-headline",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-signature",
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
      <body className={`${inter.variable} ${playfair.variable} ${caveat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
