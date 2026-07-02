import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "gold" | "solid" | "outline" | "outlineLight" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-sans font-medium uppercase tracking-[0.16em] text-[0.72rem] transition-all duration-300 rounded-full cursor-pointer disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  gold: "bg-gold text-brand-deep hover:bg-gold-soft shadow-[0_8px_24px_-12px_rgba(200,168,104,0.9)]",
  solid: "bg-brand text-cream hover:bg-brand-soft",
  outline:
    "border border-brand/40 text-brand hover:bg-brand hover:text-cream",
  outlineLight:
    "border border-cream/50 text-cream hover:bg-cream hover:text-brand",
  ghost: "text-brand hover:text-gold",
};

const sizes: Record<Size, string> = {
  sm: "px-5 py-2.5",
  md: "px-7 py-3.5",
  lg: "px-9 py-4 text-[0.78rem]",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

export function Button({
  variant = "gold",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "gold",
  size = "md",
  className,
  children,
  external,
}: CommonProps & { href: string; external?: boolean }) {
  const classes = cn(base, variants[variant], sizes[size], className);
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
