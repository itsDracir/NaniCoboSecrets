import { type Product } from "@/lib/products";
import ProductCard from "@/components/product/ProductCard";
import { cn } from "@/lib/cn";

type Variant = "overlay" | "stack";

/**
 * Product reveal shown at the end of the hero scroll.
 *
 * - `overlay`: two cards flanking the product visual on left and right.
 *   Parent must be `absolute inset-0` so this fills the stage.
 * - `stack`: normal-flow grid for mobile (below the hero).
 */
export default function HeroProductReveal({
  products,
  variant = "stack",
  className,
}: {
  products: Product[];
  variant?: Variant;
  className?: string;
}) {
  // ── Overlay: flanking layout — cards on both sides, center free for the product visual
  if (variant === "overlay") {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-between",
          "px-5 lg:px-10 xl:px-14",
          className,
        )}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[240px] lg:w-[256px] xl:w-[278px]"
          >
            <ProductCard product={product} variant="overlay" />
          </div>
        ))}
      </div>
    );
  }

  // ── Stack: normal-flow grid for mobile / below-hero sections
  return (
    <div className={cn("mx-auto w-full max-w-4xl", className)}>
      <div className="mb-6 text-center sm:text-left">
        <p className="text-[0.7rem] uppercase tracking-[0.4em] text-gold">
          La línea
        </p>
        <h2 className="mt-2 font-serif text-3xl font-light text-ink sm:text-4xl">
          Descubre HYDRA
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} variant="stack" />
        ))}
      </div>
    </div>
  );
}
