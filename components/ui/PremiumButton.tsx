"use client";

import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

type Variant = "primary" | "secondary" | "ghost" | "gold" | "icon";
type Size = "sm" | "md" | "lg";

// ─── Shared base ──────────────────────────────────────────────────────────────
// motion-safe: scopes transforms to users who haven't requested reduced motion.
// Transitions are already killed by globals.css for prefers-reduced-motion.

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "border select-none cursor-pointer " +
  "transition-[transform,box-shadow,background-color,border-color,opacity] " +
  "duration-[220ms] ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-cream " +
  "disabled:cursor-not-allowed disabled:opacity-50 " +
  "motion-safe:active:scale-[0.98]";

// ─── Variants ─────────────────────────────────────────────────────────────────

const variants: Record<Variant, string> = {
  // Rich dark background — ink or deep espresso, cream text, subtle gold border.
  // The primary CTA; must stand out against any hero or card background.
  primary:
    "bg-ink text-cream border-gold/[0.18] " +
    "shadow-[0_1px_10px_rgba(30,24,19,0.10)] " +
    "motion-safe:hover:-translate-y-px hover:brightness-[1.08] hover:border-gold/[0.30] " +
    "hover:shadow-[0_4px_18px_rgba(30,24,19,0.16)]",

  // Translucent cream — warm background, espresso text, sandy border.
  // Softer than primary but still clearly actionable.
  secondary:
    "bg-cream/[0.82] text-espresso border-sand " +
    "shadow-[0_1px_8px_rgba(90,70,54,0.06)] " +
    "motion-safe:hover:-translate-y-px hover:bg-cream hover:border-nude " +
    "hover:shadow-[0_3px_14px_rgba(90,70,54,0.09)]",

  // Fully transparent — elegant outline treatment, minimal presence.
  // Good alongside a primary button or on light backgrounds.
  ghost:
    "bg-transparent text-ink border-espresso/[0.2] " +
    "motion-safe:hover:-translate-y-px hover:bg-cream/[0.55] hover:border-espresso/[0.32]",

  // Brand gold — the most luxurious CTA tone. Warm #be9e63 background with
  // deep ink text. Reads as premium cosmetic / luxury beauty at a glance.
  gold:
    "bg-gold text-ink border-gold/[0.35] " +
    "shadow-[0_1px_12px_rgba(190,158,99,0.18)] " +
    "motion-safe:hover:-translate-y-px hover:brightness-[1.06] hover:border-gold/[0.55] " +
    "hover:shadow-[0_4px_20px_rgba(190,158,99,0.28)]",

  // For icon-only controls (hamburger, close, etc.). Square, no padding.
  // No lift on hover — icon buttons don't benefit from translate.
  icon:
    "bg-transparent text-ink border-transparent " +
    "hover:bg-sand/[0.45] hover:border-sand/[0.55]",
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs tracking-[0.08em]",
  md: "h-11 px-6 text-sm tracking-[0.06em]",
  lg: "h-12 px-8 text-[0.95rem] tracking-[0.05em]",
};

// Icon variant uses a fixed square rather than horizontal padding.
const iconSizes: Record<Size, string> = {
  sm: "h-9 w-9",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

// ─── Props ────────────────────────────────────────────────────────────────────

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type AsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & {
    href: string;
  };

type AsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

export type PremiumButtonProps = AsLink | AsButton;

// ─── Component ────────────────────────────────────────────────────────────────

export default function PremiumButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: PremiumButtonProps) {
  const isIcon = variant === "icon";
  const cls = cn(
    base,
    variants[variant],
    isIcon ? iconSizes[size] : sizes[size],
    className,
  );

  const href = (rest as { href?: string }).href;

  if (href) {
    const { href: _omit, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };
    const isExternal = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        className={cls}
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...anchorRest}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
