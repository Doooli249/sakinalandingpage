import type { LucideIcon } from "lucide-react";

type SectionCardProps = {
  title: string;
  body: string;
  icon: LucideIcon;
};

export function SectionCard({ title, body, icon: Icon }: SectionCardProps) {
  return (
    <article className="group rounded-2xl border border-[color:var(--sakina-mauve)]/40 bg-white/70 p-6 shadow-[0_10px_30px_rgba(28,28,28,0.04)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[color:var(--sakina-champagne)]/80">
      <Icon className="mb-4 h-5 w-5 text-[color:var(--sakina-rose)]" />
      <h3 className="mb-2 text-lg font-semibold tracking-tight text-[color:var(--sakina-charcoal)]">{title}</h3>
      <p className="text-sm leading-6 text-[color:var(--sakina-charcoal)]/80">{body}</p>
    </article>
  );
}
