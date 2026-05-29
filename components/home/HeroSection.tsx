"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { HYDRA_PRODUCTS } from "@/lib/products";
import HeroCopy from "@/components/hero/HeroCopy";
import HeroProductReveal from "@/components/hero/HeroProductReveal";
import ResponsiveProductImage from "@/components/ui/ResponsiveProductImage";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Image-first homepage hero with a scroll choreography.
 *
 * Narrative (desktop, motion allowed):
 *   rest   → copy left · two bottles to the right (slightly smaller)
 *   scroll → copy recedes & fades · bottles glide to centre (different speeds
 *            for depth) · background drifts subtly · the product cards
 *            (description + "Comprar" buttons — rescued from the old reveal)
 *            fade in flanking the centred bottles.
 *
 * The flanking cards reuse `HeroProductReveal` (overlay) + `ProductCard`, the
 * elements that closed the old video ScrollTrigger. No video logic survives.
 *
 * Layout strategy — one DOM, three states driven by Tailwind variants:
 *   • motion + ≥lg  → absolute layered stage, short pin, full right→centre.
 *   • motion + <lg  → normal-flow column, light entrance, cards stacked below.
 *   • reduced-motion (any width) → normal-flow column, everything visible,
 *     NO JS animation (the `motion-safe:` classes simply don't apply).
 */
export default function HeroSection() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const gradient = useRef<HTMLDivElement>(null);
  const texture = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const leaveBottle = useRef<HTMLDivElement>(null);
  const rinseBottle = useRef<HTMLDivElement>(null);
  const reveal = useRef<HTMLDivElement>(null);
  const stackReveal = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // ── Desktop + motion: pinned right→centre choreography ────────────────────
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "none", force3D: true },
          scrollTrigger: {
            trigger: stage.current,
            start: "top top",
            end: "+=120%",
            scrub: 1,
            pin: stage.current,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Copy cedes the stage — fades and drifts left as the product takes over.
        tl.to(copy.current, { autoAlpha: 0, xPercent: -6, ease: "power1.in" }, 0);

        // Bottles travel from right → centre. Different start offsets + eases give
        // a sense of depth (front bottle leads, back bottle trails).
        tl.fromTo(
          leaveBottle.current,
          { x: () => window.innerWidth * 0.18, scale: 0.95 },
          { x: 0, scale: 1, y: -8, ease: "power2.out" },
          0,
        );
        tl.fromTo(
          rinseBottle.current,
          { x: () => window.innerWidth * 0.25, scale: 0.93 },
          { x: 0, scale: 1, y: 6, ease: "power2.out" },
          0.04,
        );

        // Background layers drift with less intensity (subtle parallax).
        tl.to(gradient.current, { yPercent: 4 }, 0);
        tl.to(texture.current, { yPercent: -3 }, 0);

        // Rescued final content fades in flanking the centred product.
        tl.fromTo(
          reveal.current,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, ease: "power2.out" },
          0.55,
        );
      });

      // ── Tablet + mobile + motion: light entrance, no pin, no lateral travel ───
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power3.out", force3D: true } })
          .from(copy.current, { autoAlpha: 0, y: 24, duration: 0.85 })
          .from(
            [leaveBottle.current, rinseBottle.current],
            { autoAlpha: 0, y: 30, scale: 0.96, duration: 0.9, stagger: 0.12 },
            "-=0.4",
          );

        // Stacked cards animate in when scrolled into view.
        gsap.from(stackReveal.current, {
          autoAlpha: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: stackReveal.current, start: "top 85%", once: true },
        });
      });

      // Reduced motion: no branch runs → content rests in its visible final state.
    },
    { scope: root },
  );

  const bottleClass =
    "h-[34vh] max-h-[600px] w-auto object-contain drop-shadow-[0_24px_40px_rgba(90,70,54,0.18)] sm:h-[42vh] lg:h-[60vh]";

  return (
    <section ref={root} aria-labelledby="hero-heading" className="relative bg-cream">
      <div
        ref={stage}
        className="relative flex min-h-[100svh] flex-col items-center justify-center gap-12 overflow-hidden px-6 pb-16 pt-28 sm:px-10 motion-safe:lg:block motion-safe:lg:gap-0 motion-safe:lg:p-0"
      >
        {/* Background gradient — oversized vertically so parallax never reveals edges */}
        <div
          ref={gradient}
          aria-hidden="true"
          className="absolute -bottom-[8%] -top-[8%] left-0 right-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: "url(/home/backgrounds/soft-beige-gradient.webp)" }}
        />
        {/* Salon texture — subtle warmth, kept very low so it never muddies the copy */}
        <div
          ref={texture}
          aria-hidden="true"
          className="absolute -bottom-[8%] -top-[8%] left-0 right-0 -z-10 bg-cover bg-center opacity-[0.10] mix-blend-multiply"
          style={{ backgroundImage: "url(/home/backgrounds/salon-texture.webp)" }}
        />

        {/* Copy */}
        <div
          ref={copy}
          className="relative z-20 w-full max-w-xl motion-safe:lg:absolute motion-safe:lg:inset-0 motion-safe:lg:flex motion-safe:lg:max-w-none motion-safe:lg:items-center"
        >
          <div className="motion-safe:lg:px-20">
            <HeroCopy headingId="hero-heading" />
          </div>
        </div>

        {/* Product bottles — single instance, repositioned per breakpoint.
            Each bottle is wrapped so GSAP transforms the box, not the <picture>. */}
        <div className="relative z-10 flex w-full items-end justify-center gap-4 sm:gap-6 motion-safe:lg:absolute motion-safe:lg:inset-0 motion-safe:lg:items-center motion-safe:lg:gap-8">
          <div ref={leaveBottle} className="will-change-transform">
            <ResponsiveProductImage
              product="leave-in"
              alt="Leave-In de NaniCobo Secrets"
              priority
              className={bottleClass}
            />
          </div>
          <div ref={rinseBottle} className="will-change-transform">
            <ResponsiveProductImage
              product="rinse"
              alt="Rinse de NaniCobo Secrets"
              priority
              className={bottleClass}
            />
          </div>
        </div>

        {/* Rescued final content — flanking cards. Desktop + motion only. */}
        <div ref={reveal} className="absolute inset-0 z-30 hidden motion-safe:lg:block">
          <HeroProductReveal products={HYDRA_PRODUCTS} variant="overlay" />
        </div>
      </div>

      {/* Scroll anchor for the buy CTAs */}
      <div id="hydra-productos" aria-hidden="true" className="h-0 scroll-mt-24" />

      {/* Rescued final content — stacked grid. Mobile/tablet always; desktop only
          under reduced motion (where the overlay choreography never runs). */}
      <div
        ref={stackReveal}
        className="px-6 py-16 sm:px-10 lg:hidden motion-reduce:lg:block motion-reduce:lg:px-20"
      >
        <HeroProductReveal products={HYDRA_PRODUCTS} variant="stack" />
      </div>
    </section>
  );
}
