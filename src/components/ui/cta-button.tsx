import Link from "next/link";

interface CtaButtonProps {
  href: string;
  children: string;
  variant?: "primary" | "secondary";
}

export function CtaButton({ href, children, variant = "primary" }: CtaButtonProps) {
  const className =
    variant === "primary"
      ? "inline-flex items-center justify-center rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-400"
      : "inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-violet-400/50 hover:bg-violet-500/10";

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
