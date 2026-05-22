"use client";

import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type Variant = "glass" | "glass-gold" | "glass-dark";
type Size = "sm" | "md" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full " +
  "font-medium backdrop-blur-xl border " +
  "transition-all duration-300 ease-out select-none cursor-pointer " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

const variants: Record<Variant, string> = {
  glass:
    "border-white/35 bg-white/[0.12] text-ink " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_0_rgba(0,0,0,0.04),0_4px_20px_rgba(0,0,0,0.08)] " +
    "hover:bg-white/[0.22] hover:border-white/50 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_6px_28px_rgba(0,0,0,0.12)]",
  "glass-gold":
    "border-gold/40 bg-gold/[0.1] text-espresso " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-1px_0_rgba(190,158,99,0.08),0_4px_20px_rgba(190,158,99,0.12)] " +
    "hover:bg-gold/[0.18] hover:border-gold/55 hover:text-ink",
  "glass-dark":
    "border-ink/30 bg-ink/[0.85] text-cream " +
    "shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_20px_rgba(30,24,19,0.22)] " +
    "hover:bg-ink/[0.95] hover:border-ink/45",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs tracking-[0.08em]",
  md: "h-11 px-6 text-sm tracking-[0.06em]",
  lg: "h-14 px-8 text-[0.95rem] tracking-[0.05em]",
};

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

export type LiquidGlassButtonProps = AsLink | AsButton;

export default function LiquidGlassButton({
  variant = "glass",
  size = "md",
  className,
  children,
  ...rest
}: LiquidGlassButtonProps) {
  const cls = cn(base, variants[variant], sizes[size], className);

  // Specular highlight — the white shimmer at the top edge that reads as "glass"
  const inner = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[3px] top-[2px] h-[45%] rounded-full bg-gradient-to-b from-white/55 to-transparent"
      />
      <span className="relative z-10">{children}</span>
    </>
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
        {inner}
      </a>
    );
  }

  return (
    <button className={cls} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {inner}
    </button>
  );
}
