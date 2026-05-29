# CLAUDE.md — NaniCobo Secrets

## 1. Project Context

NaniCobo Secrets is a premium haircare / salon brand. The website must be built as a high-end ecommerce and brand experience, with strong focus on performance, responsive design, clean frontend architecture and future Shopify integration.

The current priority is the homepage rebuild.

The previous direction based on using a heavy video as the main homepage visual is now deprecated. Do not continue developing the video-first approach unless explicitly requested later.

The new official direction is based on:

- Real product assets.
- Responsive product images by device.
- Optimized WebP assets.
- Layered visual composition.
- Static / lightweight background assets.
- Subtle GSAP animations.
- ScrollTrigger only where technically justified.
- Performance-first implementation.
- Mobile-first responsive behavior.
- Shopify-compatible architecture.

## 2. Current Technical Direction

The frontend should be built as a custom/headless-style experience compatible with a future Shopify backend.

Shopify will eventually manage:

- Products.
- Checkout.
- Orders.
- Payments.
- Inventory.

The frontend should maintain visual freedom and premium UX while remaining ready to connect to Shopify through an appropriate approach such as:

- Shopify Storefront API.
- Hydrogen if the project moves into Shopify-native React architecture.
- A React / Next / Vite frontend consuming Shopify data, depending on the final stack decision.

For now, do not hardcode the architecture into Shopify too early unless requested. Keep components modular and data-ready.

## 3. New Homepage Direction

The homepage must no longer depend on a full-screen hero video.

Replace the previous video-first concept with a product-image-first concept using optimized assets.

Available assets include:

### Product assets

Leave-In:

- Mobile version.
- Tablet version.
- Desktop version.

Rinse:

- Mobile version.
- Tablet version.
- Desktop version.

### Background assets

- `soft-beige-gradient.webp`
- `salon-texture.webp`

These assets should be organized in a clean, scalable folder structure.

Recommended structure:

```txt
src/
  assets/
    images/
      home/
        products/
          leave-in/
            leave-in-mobile.webp
            leave-in-tablet.webp
            leave-in-desktop.webp
          rinse/
            rinse-mobile.webp
            rinse-tablet.webp
            rinse-desktop.webp
        backgrounds/
          soft-beige-gradient.webp
          salon-texture.webp
        textures/
        shadows/
```

Adapt the naming to the real filenames in the project, but keep the structure clear.

## 4. Homepage Component Architecture

Do not build the entire homepage in a single file.

Recommended component structure:

```txt
src/
  components/
    home/
      HeroSection.jsx / .tsx
      ProductShowcase.jsx / .tsx
      RitualSection.jsx / .tsx
      BenefitsSection.jsx / .tsx
      SalonExperienceSection.jsx / .tsx
      FinalCTA.jsx / .tsx
    ui/
      Button.jsx / .tsx
      ResponsiveProductImage.jsx / .tsx
      SectionContainer.jsx / .tsx
      SectionHeading.jsx / .tsx
```

Start only with the `HeroSection` unless instructed otherwise.

## 5. Current Implementation Priority

The first development phase must focus on:

1. Inspecting the current project structure.
2. Identifying existing homepage files and video-related code.
3. Removing or disabling the old video-first implementation.
4. Organizing the new image assets.
5. Creating a static responsive `HeroSection`.
6. Using correct mobile / tablet / desktop product assets.
7. Applying the `soft-beige-gradient.webp` background.
8. Testing whether `salon-texture.webp` adds value as a subtle overlay.
9. Ensuring the layout is stable before adding animations.
10. Adding GSAP only after the static version is approved.

Do not implement the full homepage at once.

## 6. Responsive Image Rules

The homepage must not load oversized desktop product images on mobile.

Use the most appropriate strategy depending on the actual stack:

- `<picture>` and `<source>` tags for standard HTML / React.
- Framework image components if available.
- CSS media queries only when technically justified.
- Clean imports and explicit asset mapping if using React.

Expected behavior:

- Mobile viewport loads mobile asset.
- Tablet viewport loads tablet asset.
- Desktop viewport loads desktop asset.
- No layout shift.
- No image distortion.
- Explicit width / height or aspect-ratio handling where possible.
- Hero image should be prioritized carefully if it is above the fold.

## 7. GSAP Rules

Do not add GSAP until the static hero is visually and responsively correct.

When GSAP is added:

- Keep animations subtle.
- Avoid excessive timelines.
- Avoid scroll-jacking.
- Avoid heavy transforms on large images in mobile.
- Respect `prefers-reduced-motion`.
- Clean up animations on component unmount.
- Use `gsap.context()` in React if applicable.
- Use ScrollTrigger only where scroll-based animation has a clear purpose.

Acceptable animation patterns:

- Initial opacity fade.
- Slight `y` movement.
- Slight scale from `0.96` to `1`.
- Very soft product floating movement.
- Very light parallax on background layers.

Avoid:

- Fast motion.
- Excessive blur.
- Complex pinned sections in the first phase.
- Large scroll-controlled video behavior.
- Animations that harm Core Web Vitals.

## 8. Performance Requirements

Prioritize:

- Lightweight first load.
- Optimized images.
- Stable layout.
- Minimal JavaScript.
- Lazy loading for below-the-fold assets.
- No unnecessary animation libraries beyond GSAP if already chosen.
- Avoid large video files in the hero.
- Avoid unused imports.
- Avoid loading every product version at once if preventable.
- Use preload only for the critical above-the-fold hero asset if justified.

Core principles:

- Mobile-first.
- Performance-first.
- Premium feel through composition, not heavy media.

## 9. Accessibility Requirements

Every image must have appropriate alt text.

Product images should include descriptive alt text, for example:

- `Leave-In de NaniCobo Secrets`
- `Rinse de NaniCobo Secrets`

The hero must preserve:

- Correct heading hierarchy.
- Accessible buttons / links.
- Sufficient contrast.
- Keyboard navigability.
- Reduced motion support.

## 10. SEO Requirements

Keep SEO basics clean:

- One clear `h1` on the homepage.
- Semantic sections.
- Proper image alt text.
- Avoid text embedded only in images.
- Avoid CLS from media loading.
- Keep metadata easy to update later.

## 11. Development Workflow For Claude

When asked to implement this homepage direction, Claude should first respond with a technical plan, not immediate broad changes.

Claude should inspect and report:

1. Current project stack.
2. Existing homepage entry file.
3. Existing asset folders.
4. Existing video implementation to remove or replace.
5. Recommended final asset paths.
6. Components to create or modify.
7. Exact files that will be edited.
8. Step-by-step implementation order.

After confirmation, Claude should implement only the approved phase.

## 12. Deprecated Direction

The following approach is deprecated:

- Full-screen video hero.
- Scroll-driven heavy video.
- Video as the main homepage experience.
- Large video files driving the core visual identity.

Do not continue this route unless explicitly requested later.

## 13. Current Immediate Task

The immediate task is to start the new homepage route by creating a static, responsive, product-image-based `HeroSection` using the new assets.

Expected first deliverable:

- Clean asset organization.
- Static hero.
- Responsive product image handling.
- Background gradient.
- Optional subtle texture overlay.
- No GSAP yet unless approved after the static result.
