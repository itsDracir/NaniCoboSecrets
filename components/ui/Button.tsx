import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "gold" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center rounded-full font-medium tracking-wide " +
  "transition-all duration-300 ease-out select-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-cream " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-cream hover:bg-espresso shadow-[0_10px_30px_-12px_rgba(30,24,19,0.65)]",
  gold: "bg-gold text-ink hover:brightness-[1.06]",
  ghost:
    "border border-ink/25 bg-transparent text-ink hover:border-ink/60 hover:bg-ink/[0.04]",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-[0.95rem]",
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

export type ButtonProps = AsLink | AsButton;

export default function Button({
  variant = "primary",
  size = "lg",
  className,
  children,
  ...rest
}: ButtonProps) {
  const cls = cn(base, variants[variant], sizes[size], className);

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
