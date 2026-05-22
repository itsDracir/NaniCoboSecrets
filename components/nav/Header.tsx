"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import PremiumButton from "@/components/ui/PremiumButton";

const NAV_LINKS = [
  { label: "Catálogo", href: "#hydra-productos" },
  { label: "Contacto", href: "#contacto" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      {/* ─── Fixed header ──────────────────────────────────────────────────── */}
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled ? "py-3" : "py-5",
        )}
        style={
          scrolled
            ? {
                // Warm cream frosted — reads as premium, not techy
                background: "rgba(246,241,234,0.94)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderBottom: "1px solid rgba(236,224,210,0.75)",
                boxShadow: "0 1px 20px rgba(90,70,54,0.06)",
              }
            : undefined
        }
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-10">
          {/* Brand logo */}
          <a
            href="/"
            onClick={close}
            className="relative z-10 flex items-baseline gap-[0.28em] font-serif text-xl font-light tracking-[0.14em] text-ink transition-opacity duration-200 hover:opacity-70"
            aria-label="NaniCobo Secrets — inicio"
          >
            NANI COBO
            <span className="font-sans text-[0.58em] font-light tracking-[0.48em] text-gold">
              secrets
            </span>
          </a>

          {/* Desktop nav */}
          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Navegación principal"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-[0.13em] text-espresso/70 transition-colors duration-200 hover:text-ink"
              >
                {link.label}
              </a>
            ))}
            <DesktopSearch />
            <PremiumButton href="#hydra-productos" variant="secondary" size="sm">
              Comprar
            </PremiumButton>
          </nav>

          {/* Hamburger — mobile only */}
          <PremiumButton
            variant="icon"
            size="md"
            onClick={() => setOpen((p) => !p)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="relative z-[60] md:hidden"
          >
            <span
              className={cn(
                "block h-px w-5 origin-center bg-ink transition-transform duration-300 ease-out",
                open && "translate-y-[6px] rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-px w-5 bg-ink transition-opacity duration-300",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "block h-px w-5 origin-center bg-ink transition-transform duration-300 ease-out",
                open && "-translate-y-[6px] -rotate-45",
              )}
            />
          </PremiumButton>
        </div>
      </header>

      {/* ─── Mobile menu overlay ─────────────────────────────────────────────── */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
        className={cn(
          "fixed inset-0 z-40 flex flex-col md:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        style={{
          // Warm cream — editorial spa feel, not tech glass
          background: "rgba(246,241,234,0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          opacity: open ? 1 : 0,
          transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div
          className="flex h-full flex-col px-8 pb-12 pt-24"
          style={{
            transform: open ? "translateY(0)" : "translateY(12px)",
            transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <MobileSearch />

          <nav className="mt-8 flex flex-col gap-1" aria-label="Menú móvil">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={close}
                className={cn(
                  "flex items-center rounded-2xl px-5 py-5",
                  "border border-transparent",
                  "hover:border-sand/55 hover:bg-cream/[0.5]",
                  "transition-[background-color,border-color] duration-200",
                  "font-serif text-2xl font-light tracking-wide text-ink",
                )}
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(8px)",
                  transition: `opacity 0.35s ease ${80 + i * 55}ms, transform 0.35s ease ${80 + i * 55}ms`,
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div
            className="mt-auto"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(8px)",
              transition: "opacity 0.35s ease 260ms, transform 0.35s ease 260ms",
            }}
          >
            <PremiumButton
              href="#hydra-productos"
              variant="primary"
              size="lg"
              className="w-full justify-center"
              onClick={close}
            >
              Comprar ahora
            </PremiumButton>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Mobile search ────────────────────────────────────────────────────────────
function MobileSearch() {
  const [query, setQuery] = useState("");

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl px-5 py-4",
        "border border-sand/60 bg-cream/[0.55]",
        "transition-[border-color,background-color] duration-200",
        "focus-within:border-nude focus-within:bg-cream/[0.8]",
      )}
    >
      <svg
        className="h-4 w-4 flex-shrink-0 text-espresso/50"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
      </svg>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar productos…"
        className="flex-1 bg-transparent text-sm text-ink placeholder:text-espresso/38 outline-none"
        aria-label="Buscar productos"
      />
      {query && (
        <button
          onClick={() => setQuery("")}
          className="flex-shrink-0 text-espresso/40 transition-colors hover:text-espresso/70"
          aria-label="Limpiar búsqueda"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Desktop inline search ────────────────────────────────────────────────────
function DesktopSearch() {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  useEffect(() => {
    if (!expanded) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpanded(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [expanded]);

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-full border overflow-hidden",
        "transition-all duration-300 ease-out",
        expanded
          ? "w-44 border-sand bg-cream/[0.65] px-4"
          : "w-8 border-transparent",
      )}
      style={{ height: "2.25rem" }}
    >
      <button
        onClick={() => {
          setExpanded((v) => !v);
          if (expanded) setQuery("");
        }}
        aria-label="Buscar productos"
        className="flex-shrink-0 text-espresso/60 transition-colors hover:text-ink"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
      </button>
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar…"
        className={cn(
          "bg-transparent text-xs text-ink placeholder:text-espresso/38 outline-none py-2",
          "transition-all duration-300",
          expanded ? "w-full opacity-100" : "w-0 opacity-0 pointer-events-none",
        )}
        aria-label="Buscar productos"
        aria-hidden={!expanded}
        tabIndex={expanded ? 0 : -1}
      />
    </div>
  );
}
