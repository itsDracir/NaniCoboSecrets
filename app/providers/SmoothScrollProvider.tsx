"use client";

/**
 * SmoothScrollProvider — mounts Lenis on the GSAP ticker so both share the
 * same requestAnimationFrame loop.
 *
 * WHY THIS MATTERS:
 * Without this, native browser scroll gives GSAP's scrub a choppy, mechanical
 * source position to follow. On macOS trackpads the OS adds its own momentum,
 * which can conflict with GSAP's scrub interpolation and create micro-stutters.
 * Lenis replaces the scroll source with a single, physics-based smooth value
 * that GSAP ScrollTrigger reads each frame — eliminating the conflict and giving
 * the scroll a weighted, premium inertia feel throughout the site.
 *
 * lagSmoothing(0) is CRITICAL with Lenis: without it GSAP tries to compensate
 * for "dropped" frames by speeding up animations to catch up, which double-
 * corrects on top of Lenis's own smoothing and causes micro-jolts.
 */

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Global ScrollTrigger tuning — done once here so all triggers on the site
// inherit these settings.
ScrollTrigger.config({
  // Don't refresh all triggers when the mobile address bar shows/hides (which
  // changes viewport height by ~56px and can cause visible layout jumps).
  ignoreMobileResize: true,
});

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      // lerp: 0.08 — heavier than the default 0.1.
      // Each frame moves 8% of the remaining distance to the target scroll
      // position, giving a luxurious deceleration that transmits the sense of
      // weight and quality the brand needs. Lower = more inertia = more premium.
      lerp: 0.08,
      // Slightly reduced wheel sensitivity: makes deliberate scrolling feel more
      // intentional and less "zippy". Right for a slow-cinematic hero.
      wheelMultiplier: 0.8,
      // Keep native touch momentum on mobile so iOS rubber-band feels natural.
      // The desktop lerp provides the premium feel; mobile relies on the OS.
      touchMultiplier: 1.2,
      smoothWheel: true,
    });

    // Sync Lenis scroll position → ScrollTrigger on every Lenis tick.
    // This ensures ScrollTrigger always reads the smoothed Lenis position,
    // not the raw window scroll position.
    const handleLenisScroll = () => ScrollTrigger.update();
    lenis.on("scroll", handleLenisScroll);

    // Drive Lenis from GSAP's ticker so both share the same RAF.
    // Without this, Lenis and GSAP run on separate rAF loops and can be 1 frame
    // out of sync, causing a subtle shimmer between scroll position and animation.
    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);

    // CRITICAL: stop GSAP from trying to "catch up" on dropped frames.
    // Default lag smoothing accelerates animations when rAF skips a beat, which
    // conflicts with Lenis's own smooth interpolation and creates micro-jolts.
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", handleLenisScroll);
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
