# MarketBridge sample landing page

A lightweight, mobile-first demonstration website for a Ghana-focused financial record-keeping service for traders and small businesses. It is built with semantic HTML, CSS and minimal vanilla JavaScript. It deploys to Netlify (or Cloudflare Pages) with no build step.

## Configuration

| Item | Value |
| --- | --- |
| Contact form | Formspree, `https://formspree.io/f/xzeeovrd` |
| WhatsApp | `+233551817972` (`https://wa.me/233551817972`) |
| Success page | `thanks.html` (also served at `/thank-you`) |
| Canonical URL | `https://marketbridge-sample.netlify.app/` |

If the live address is different, update the canonical link, `og:url` and the JSON-LD `url` and `logo` in `index.html`.

## Contact form and spam protection

- With JavaScript, the form validates inline and submits to Formspree with `fetch`. Visitors stay on the page and see a confirmation message.
- Without JavaScript, the form posts normally and uses the browser's built-in validation.
- A Formspree `_gotcha` honeypot catches simple bots. It uses the `hidden` attribute (`display: none`), so browser autofill and password managers never fill it in. The previous version moved it off-screen instead, and Chrome autofilled it. That sent real enquiries to the Spam tab.

### Formspree settings

- **reCAPTCHA: off** (current setting). Formspree only accepts AJAX submissions with reCAPTCHA off, and this also removes its CAPTCHA page and "free quota exceeded" warning. The honeypot and Formspree's automatic spam filtering stay active.
- If reCAPTCHA is turned back on, the script falls back to a normal form post, so no enquiry is lost. Visitors then pass through Formspree's CAPTCHA page.

## Design

"The honest receipt": calm porcelain surfaces, one cedi-green accent, system fonts, and monospace figures for every amount. The logo is a lowercase m drawn as two bridge arches with a gold coin (`assets/favicon.svg`, also inline in the header and footer).

Page order:
1. Floating capsule navigation
2. Hero with a printed daily receipt
3. Partner associations
4. Features (bento)
5. How it works (the one dark band)
6. Stories: stats and testimonials
7. Call-to-action panel
8. FAQ
9. Contact form
10. Footer

Partner names, figures and testimonials are illustrative, and the footer says so.

## Motion

- Below-the-fold content fades and slides in once, using `IntersectionObserver`. Only opacity and transform are animated.
- Setup runs after the `load` event, and only elements that start below the viewport are hidden. Without JavaScript, everything is visible.
- The hero receipt prints line by line on load (CSS only).
- The floating nav is frosted glass: the page shows through it, and it turns smoky with light text over the dark section. It compacts after the first scroll, tucks away while scrolling down, returns on scroll up, and a soft pill marks the section in view. Nav links land sections flush with the top of the window, so the glass always floats over the section you chose.
- On phones, the menu opens as a glass panel that fades and slides in. It closes on a link tap, a tap outside it, scrolling, or Escape.
- FAQ answers slide open and closed, and only one is open at a time. Without JavaScript, `<details name="faq">` keeps the one-at-a-time behaviour without animation.
- The WhatsApp button sits above the "Powered by Netlify" badge that Netlify adds on free plans. `_headers` allows that badge's inline script by hash, plus inline styles.
- WhatsApp greeting: on every page load, after about 5 seconds or once the visitor scrolls past the hero, the WhatsApp button pulses once and a small glass card says "Questions about your records? Chat with us on WhatsApp." The status line shows "Online now" during opening hours (Monday to Saturday, 8:00–18:00, Ghana time) and when replies resume otherwise. The card stays for up to 60 seconds, or until the visitor closes it, taps it, opens the menu or reaches the contact form.
- `prefers-reduced-motion` turns off all of these animations.

## Local preview

```bash
npx serve .
```

## Deployment

No build step. The publish directory is the repository root.

Headers and the `/thank-you` rewrite live in `_headers` and `_redirects`. Both Netlify and Cloudflare Pages read these files, so they are not repeated in `netlify.toml`, which would send them twice.

### Netlify (current)

Import the GitHub repository (Add new project → Import an existing project → GitHub). Leave the build command empty and set the publish directory to `.` (`netlify.toml` already sets both). Project name: `marketbridge-sample`. Every push to `main` redeploys.

### Cloudflare Pages (alternative)

Connect the repository with framework preset None, an empty build command and `/` as the output directory, or run `npx wrangler pages deploy . --project-name marketbridge-sample`. If you move hosts, update the canonical, `og:url` and JSON-LD URLs to the new address. Leave Cloudflare Web Analytics' automatic script injection off, or add its domain to the CSP in `_headers`.

## Performance approach

- No framework, external fonts, images or third-party scripts (all graphics are inline SVG or CSS)
- All main content is in the initial HTML
- A single small, deferred JavaScript file
- Responsive, accessible layout with visible focus states, tested at 360, 390, 768, 1024 and 1440px
- `ProfessionalService` structured data (JSON-LD) and a canonical URL
