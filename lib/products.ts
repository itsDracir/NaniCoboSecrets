export type ProductId = "rinse" | "leave-in";

/**
 * Product shape for the HYDRA line.
 *
 * Shopify fields are intentionally optional — UI renders today with copy only
 * and can be wired to the Storefront API later without changing any component.
 * To connect Shopify:
 *   1. Fill `shopifyVariantId` (gid://shopify/ProductVariant/...) per product.
 *   2. Set `checkoutUrl` or replace the buy button's href with an add-to-cart
 *      handler that uses `shopifyVariantId`.
 *   3. Optionally populate `price` from the Storefront API.
 */
export interface Product {
  id: ProductId;
  /** Brand line this product belongs to. */
  line: string;
  /** Display name. */
  name: string;
  /** Shopify product handle (slug). Ready for Storefront API lookups. */
  handle: string;
  /** Short marketing line shown on cards (tagline). */
  tagline: string;
  /** Longer description shown on cards and future PDP views. */
  description: string;
  /** Key benefit chips. */
  badges: string[];
  /** Product shot under /public, e.g. "/products/rinse.jpg". */
  image?: string;
  /** Display price, e.g. "29 €". Leave undefined until Shopify is connected. */
  price?: string;
  /** Shopify variant GID — fill when Shopify is connected. */
  shopifyVariantId?: string;
  /** Direct checkout/cart permalink — fill when Shopify is connected. */
  checkoutUrl?: string;
}

export const HYDRA_PRODUCTS: Product[] = [
  {
    id: "rinse",
    line: "HYDRA",
    name: "Rinse",
    handle: "hydra-rinse",
    tagline: "Reconstruye, hidrata y protege.",
    description:
      "Reconstruye la fibra capilar desde el interior. Aporta brillo, suavidad y fuerza, dejando el cabello más manejable, resistente y libre de nudos.",
    badges: ["Reparación", "Hidratación profunda"],
  },
  {
    id: "leave-in",
    line: "HYDRA",
    name: "Leave-In",
    handle: "hydra-leave-in",
    tagline: "Tu imprescindible para un cabello impecable.",
    description:
      "Nutre, desenreda y protege al instante con fórmula ligera sin enjuague. Reduce el frizz, mejora la suavidad y deja el cabello brillante y cuidado todo el día.",
    badges: ["Sin aclarado", "Anti-frizz"],
  },
];
