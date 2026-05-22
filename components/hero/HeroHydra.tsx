"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { HYDRA_PRODUCTS } from "@/lib/products";
import HeroCopy from "./HeroCopy";
import HeroProductReveal from "./HeroProductReveal";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const VIDEO_SRC = "/videos/hero_hydrav2_scrub.mp4";
const PIN_DISTANCE = "+=200%";

// ─── WHY <canvas> instead of <video> for the visual output ───────────────────
//
// Browsers deliberately defer <video> element frame renders during active scroll
// to protect scroll performance. The decoder IS seeking (currentTime changes),
// but the compositor texture upload is queued for "later" — meaning the visible
// frame only changes when scrolling stops.
//
// canvas.drawImage(video) copies the decoded frame into the canvas's own paint
// surface inside the JS paint cycle, which is NOT subject to this deferral.
// The canvas updates on every frame where a new 'seeked' event fires — even
// while the user is actively scrolling.
//
// Architecture:
//   <video>  → hidden, alive in DOM → browser keeps decoder pipeline active
//   <canvas> → visible, receives frames via drawImage() on every 'seeked' event
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── WHY static images for first/last frame ──────────────────────────────────
//
// The PNG photos (2752×1536) are sharper than the scrub video (1920×1080) and
// load instantly as browser-decoded images. The video only serves as the
// transition between the two states — it never needs to be seen at rest.
//
// Layer order (bottom → top):
//   canvas       → video scrub output, always rendering
//   lastFrame    → fades in during the final 15% of scroll
//   firstFrame   → fades out during the first 15% of scroll
//   gradients + copy + reveal cards
//
// ─────────────────────────────────────────────────────────────────────────────

const LAST_FADE_START = 0.92;  // start late so video frame ≈ lastFrame PNG (no double-product flash)

export default function HeroHydra() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const firstFrame = useRef<HTMLDivElement>(null);
  const lastFrame = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const reveal = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const stageEl = stage.current;
      const videoEl = video.current;
      const canvasEl = canvas.current;
      const firstFrameEl = firstFrame.current;
      const lastFrameEl = lastFrame.current;
      const copyEl = copy.current;
      const revealEl = reveal.current;
      if (!stageEl || !videoEl || !canvasEl || !firstFrameEl || !lastFrameEl || !copyEl || !revealEl) return;

      const ctx2d = canvasEl.getContext("2d", { alpha: false });
      if (!ctx2d) return;

      const mm = gsap.matchMedia();

      // ── Desktop + motion allowed ────────────────────────────────────────────
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set([copyEl, revealEl], { force3D: true });
          gsap.set(revealEl, { autoAlpha: 0, yPercent: 8, scale: 0.96 });

          videoEl.pause();
          videoEl.playbackRate = 0;

          // ── Canvas sizing (object-cover math) ────────────────────────────
          const updateCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvasEl.width = stageEl.offsetWidth * dpr;
            canvasEl.height = stageEl.offsetHeight * dpr;
          };
          updateCanvasSize();

          const drawCurrentFrame = () => {
            const vw = videoEl.videoWidth;
            const vh = videoEl.videoHeight;
            const cw = canvasEl.width;
            const ch = canvasEl.height;
            if (!vw || !vh || !cw || !ch) return;

            // Replicate CSS object-fit: cover —
            // crop the video to fill the canvas without distortion.
            const videoRatio = vw / vh;
            const canvasRatio = cw / ch;
            let sx = 0, sy = 0, sw = vw, sh = vh;

            if (videoRatio > canvasRatio) {
              sw = Math.round(vh * canvasRatio);
              sx = Math.round((vw - sw) / 2);
            } else {
              sh = Math.round(vw / canvasRatio);
              sy = Math.round((vh - sh) / 2);
            }

            ctx2d.drawImage(videoEl, sx, sy, sw, sh, 0, 0, cw, ch);
          };

          // Draw every time the video decoder finishes seeking to a new frame.
          videoEl.addEventListener("seeked", drawCurrentFrame);

          // Reveal canvas silently — firstFrame image sits on top so there's no
          // visible flash. The canvas must be ready before scroll begins.
          const revealCanvas = () => {
            drawCurrentFrame();
            canvasEl.style.opacity = "1";
          };

          if (videoEl.readyState >= 2) {
            revealCanvas();
          } else {
            videoEl.addEventListener("loadeddata", revealCanvas, { once: true });
          }

          // Recompute canvas size on container resize (e.g. DevTools open/close).
          const ro = new ResizeObserver(() => {
            updateCanvasSize();
            drawCurrentFrame();
          });
          ro.observe(stageEl);

          // ── firstFrame fade — fast out, smooth back in ────────────────────────
          //
          // onEnter handles the initial forward fade-out (time-based → feels instant).
          // The quickTo in onUpdate handles the reverse fade-in: it starts when
          // progress drops below 0.12 (still 12% from the top) so the PNG is fully
          // back before the user reaches scroll=0 — no late "pop".
          // The 0.35s duration prevents Lenis momentum from flashing through the zone.
          const firstOpacityTo = gsap.quickTo(firstFrameEl, "opacity", {
            duration: 0.35,
            ease: "power2.out",
          });

          ScrollTrigger.create({
            trigger: stageEl,
            start: "top top",
            onEnter: () =>
              gsap.to(firstFrameEl, { opacity: 0, duration: 0.20, ease: "power2.in", overwrite: true }),
          });

          // ── Video scrub + firstFrame/lastFrame crossfades ─────────────────────
          // scrub: true = progress mirrors Lenis scroll 1-to-1.
          ScrollTrigger.create({
            trigger: stageEl,
            start: "top top",
            end: PIN_DISTANCE,
            scrub: true,
            onUpdate: (self) => {
              const p = self.progress;

              // Video scrub
              const d = videoEl.duration;
              if (d && Number.isFinite(d)) {
                const targetTime = d * p;
                if (Math.abs(videoEl.currentTime - targetTime) >= 0.016) {
                  const ve = videoEl as HTMLVideoElement & { fastSeek?: (to: number) => void };
                  ve.fastSeek ? ve.fastSeek(targetTime) : (ve.currentTime = targetTime);
                }
              }

              // First frame: fade back in smoothly when approaching top.
              // Only runs inside the 12% zone to avoid interfering with the rest of the scroll.
              if (p < 0.12) {
                firstOpacityTo(self.direction === -1 ? 1 - p / 0.12 : 0);
              }

              // Last frame: fades in only in the final 8% of scroll, when the
              // video frame and the PNG are nearly identical — no double-product.
              lastFrameEl.style.opacity = String(
                Math.max(0, (p - LAST_FADE_START) / (1 - LAST_FADE_START))
              );
            },
          });

          // ── Overlay timeline — scrub: 1 adds cinematic weight ─────────────
          const tl = gsap.timeline({
            defaults: { force3D: true },
            scrollTrigger: {
              trigger: stageEl,
              start: "top top",
              end: PIN_DISTANCE,
              scrub: 1,
              pin: stageEl,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // Copy sweeps away: slow start → accelerates (power2.in = natural exit)
          tl.to(copyEl, { autoAlpha: 0, yPercent: -8, scale: 0.97, ease: "power2.in" }, 0);
          // Cards settle in: arrives with momentum → decelerates (power2.out = natural landing)
          tl.to(revealEl, { autoAlpha: 1, yPercent: 0, scale: 1, ease: "power2.out" }, 0.6);

          // Cleanup for this matchMedia branch
          return () => {
            firstOpacityTo.tween?.kill();
            videoEl.removeEventListener("seeked", drawCurrentFrame);
            ro.disconnect();
          };
        },
      );

      // ── Mobile + motion allowed ─────────────────────────────────────────────
      // No scrubbing: decoders on iOS/Android can't seek at 60fps.
      // firstFrame/lastFrame images are hidden — video plays as ambient background.
      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          canvasEl.style.display = "none";
          firstFrameEl.style.display = "none";
          lastFrameEl.style.display = "none";
          videoEl.style.opacity = "1";

          void videoEl.play().catch(() => {});

          gsap.from(copyEl, {
            autoAlpha: 0,
            y: 28,
            duration: 1.0,
            ease: "power3.out",
            force3D: true,
          });

          return () => {
            canvasEl.style.display = "";
            firstFrameEl.style.display = "";
            lastFrameEl.style.display = "";
            videoEl.style.opacity = "";
          };
        },
      );

      // ── Reduced motion ──────────────────────────────────────────────────────
      // No animation runs. All content is visible by default in markup.
      // The stage shows its cream gradient background — clean, accessible.
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="hydra-heading"
      className="relative w-full bg-cream"
    >
      <div
        ref={stage}
        className="relative h-[100svh] w-full overflow-hidden bg-gradient-to-br from-cream via-sand to-nude"
      >
        {/* Video — invisible, kept alive in DOM so the browser maintains its
            decoder pipeline. Canvas reads from this element via drawImage().
            On mobile, opacity is overridden to 1 so it displays directly. */}
        <video
          ref={video}
          className="absolute inset-0 h-full w-full object-cover opacity-0 pointer-events-none"
          src={VIDEO_SRC}
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          tabIndex={-1}
          style={{ willChange: "transform", transform: "translate3d(0,0,0)" }}
        />

        {/* Canvas — video scrub output. Starts transparent, reveals once the
            first decoded frame is ready. Sits below both photo layers. */}
        <canvas
          ref={canvas}
          className="absolute inset-0 h-full w-full transition-opacity duration-500"
          style={{
            opacity: 0,
            willChange: "transform",
            transform: "translate3d(0,0,0)",
          }}
          aria-hidden="true"
        />

        {/* Last frame photo — sits above canvas, fades in at end of scroll.
            Starts invisible; revealed as the video scrub finishes. */}
        <div
          ref={lastFrame}
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0 }}
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/HeroLastFrame.png"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        {/* First frame photo — sits above everything, fades out at start of scroll.
            Starts fully visible; hides to reveal the video scrub below. */}
        <div
          ref={firstFrame}
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 1 }}
          aria-hidden="true"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/HeroFirstFrame.png"
            alt=""
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cream/70 via-cream/25 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cream/30 via-transparent to-transparent" />

        <div ref={copy} className="absolute inset-0 z-20 flex items-center">
          <div className="px-6 sm:px-10 lg:px-20">
            <span id="hydra-heading" className="sr-only">
              HYDRA — Hidratación capilar premium
            </span>
            <HeroCopy />
          </div>
        </div>

        {/* Reveal — fills the full stage so flanking cards can position freely */}
        <div
          ref={reveal}
          className="absolute inset-0 z-30 hidden md:block"
        >
          <HeroProductReveal products={HYDRA_PRODUCTS} variant="overlay" />
        </div>
      </div>

      <div id="hydra-productos" aria-hidden="true" className="h-0 scroll-mt-24" />

      <div className="px-6 py-14 md:hidden">
        <HeroProductReveal products={HYDRA_PRODUCTS} variant="stack" />
      </div>
    </section>
  );
}
