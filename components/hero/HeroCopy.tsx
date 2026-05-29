import PremiumButton from "@/components/ui/PremiumButton";
import { cn } from "@/lib/cn";

/**
 * Left-aligned hero copy: brand name, subtitle and CTAs.
 * Used by HeroSection. Pass `headingId` to wire the section's aria-labelledby.
 *
 * Typography: h1 is `w-fit` so "COBO" sets the reference width.
 * "NANI" and "secrets" use flex justify-between so their last
 * character aligns exactly with the last character of "COBO".
 */
export default function HeroCopy({
  className,
  headingId,
}: {
  className?: string;
  headingId?: string;
}) {
  return (
    <div className={cn("max-w-xl", className)}>
      <p className="mb-5 text-xs font-medium uppercase tracking-[0.45em] text-gold">
        Línea HYDRA
      </p>

      {/* w-fit: width determined by COBO's natural render.
          NANI and secrets flex-expand to match that exact width. */}
      <h1
        id={headingId}
        className="w-fit font-serif font-light text-ink"
        style={{ fontSize: "clamp(3rem,10vw,8.5rem)", lineHeight: 0.9 }}
      >
        <span className="flex justify-between" aria-hidden="true">
          <span>N</span><span>A</span><span>N</span><span>I</span>
        </span>

        <span className="block tracking-tight">COBO</span>

        <span
          className="mt-[0.25em] flex justify-between font-sans font-light text-gold"
          style={{ fontSize: "clamp(0.85rem,2.6vw,2.2rem)" }}
          aria-hidden="true"
        >
          {Array.from("secrets").map((char, i) => (
            <span key={i}>{char}</span>
          ))}
        </span>
      </h1>

      <span className="sr-only">NANI COBO secrets</span>

      <p className="mt-6 max-w-md text-lg leading-relaxed text-espresso/85 sm:text-xl">
        Hidratación transformadora para un cabello brillante y lleno de vida.
      </p>

      <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
        <PremiumButton href="#hydra-productos" variant="primary" size="lg">
          Comprar ahora
        </PremiumButton>
        <PremiumButton href="#hydra-productos" variant="ghost" size="lg">
          Descubrir productos
        </PremiumButton>
      </div>
    </div>
  );
}
