import { type Product } from "@/lib/products";
import PremiumButton from "@/components/ui/PremiumButton";
import { cn } from "@/lib/cn";

type Variant = "overlay" | "stack";

/**
 * Presentational product card — Soft Luxury / Editorial Beauty aesthetic.
 *
 * - `overlay`: warm translucent card flanking the hero at end of scroll.
 * - `stack`:   semi-opaque card used in normal flow (mobile / future sections).
 */
export default function ProductCard({
  product,
  variant = "stack",
}: {
  product: Product;
  variant?: Variant;
}) {
  const buyHref = product.checkoutUrl ?? "#";

  return (
    <article
      className={cn(
        "group flex h-full flex-col justify-between rounded-2xl border p-6",
        "transition-[background-color,box-shadow,border-color] duration-300",
        variant === "overlay"
          ? [
              // Warm cream glass — editorial beauty, not futuristic.
              // Soft blur keeps the product visible underneath.
              "border-sand/55 bg-cream/[0.78] backdrop-blur-[10px]",
              "shadow-[0_8px_40px_rgba(90,70,54,0.10)]",
              "hover:bg-cream/[0.88] hover:border-nude/70",
              "hover:shadow-[0_12px_48px_rgba(90,70,54,0.14)]",
            ].join(" ")
          : [
              // Clean off-white card for normal flow / mobile.
              "border-sand/50 bg-white/[0.88]",
              "shadow-[0_2px_16px_rgba(90,70,54,0.06)]",
              "hover:bg-white hover:shadow-[0_4px_24px_rgba(90,70,54,0.10)]",
            ].join(" "),
      )}
    >
      <div>
        <p className="text-[0.68rem] uppercase tracking-[0.38em] text-gold">
          {product.line}
        </p>
        <h3 className="mt-2 font-serif text-3xl font-light leading-none text-ink">
          {product.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-espresso/85">
          {product.description}
        </p>

        {product.badges.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {product.badges.map((badge) => (
              <li
                key={badge}
                className="rounded-full border border-espresso/15 px-3 py-1 text-[0.68rem] uppercase tracking-wider text-espresso/60"
              >
                {badge}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6">
        <PremiumButton
          href={buyHref}
          variant="gold"
          size="md"
          className="w-full"
          aria-label={`Comprar ${product.line} ${product.name}`}
          data-shopify-handle={product.handle}
        >
          Comprar {product.name}
        </PremiumButton>
      </div>
    </article>
  );
}
