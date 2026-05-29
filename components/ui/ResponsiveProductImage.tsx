import { type ProductId } from "@/lib/products";

/**
 * Art-directed responsive product shot.
 *
 * Loads a device-specific asset so mobile never downloads the desktop file:
 *   mobile  ≤ 639px · tablet ≤ 1023px · desktop ≥ 1024px
 *
 * Strategy is <picture> + <source media> (not next/image) because we ship a
 * different physical file per breakpoint — true art direction — with a WebP
 * source and a PNG fallback for each. Intrinsic width/height reserve the box
 * to avoid layout shift; the parent controls the rendered size via className.
 *
 * Assets live under: /public/home/products/<id>/<id>-{mobile,tablet,desktop}.{webp,png}
 */

// Intrinsic dimensions of the desktop master (defines the aspect-ratio box).
// All breakpoints share the same proportions, so one ratio prevents CLS.
const DIMENSIONS: Record<ProductId, { width: number; height: number }> = {
  "leave-in": { width: 345, height: 1236 },
  rinse: { width: 354, height: 1275 },
};

export default function ResponsiveProductImage({
  product,
  alt,
  priority = false,
  className,
}: {
  product: ProductId;
  alt: string;
  /** Above-the-fold hero asset → eager + high fetch priority. */
  priority?: boolean;
  className?: string;
}) {
  const base = `/home/products/${product}/${product}`;
  const { width, height } = DIMENSIONS[product];

  return (
    <picture>
      {/* Mobile */}
      <source media="(max-width: 639px)" type="image/webp" srcSet={`${base}-mobile.webp`} />
      <source media="(max-width: 639px)" srcSet={`${base}-mobile.png`} />
      {/* Tablet */}
      <source media="(max-width: 1023px)" type="image/webp" srcSet={`${base}-tablet.webp`} />
      <source media="(max-width: 1023px)" srcSet={`${base}-tablet.png`} />
      {/* Desktop (default) */}
      <source type="image/webp" srcSet={`${base}-desktop.webp`} />
      <img
        src={`${base}-desktop.png`}
        alt={alt}
        width={width}
        height={height}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={className}
      />
    </picture>
  );
}
