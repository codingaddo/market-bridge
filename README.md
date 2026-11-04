# MarketBridge sample landing page

A lightweight, mobile-first demonstration website for a Ghana-focused financial record-keeping service for traders and small businesses. It is built with semantic HTML, CSS and minimal vanilla JavaScript. It deploys directly to Netlify with no build step.

## Configuration

| Item | Value |
| --- | --- |
| Contact form | Formspree, `https://formspree.io/f/xzeeovrd` |
| WhatsApp | `+233551817972` (`https://wa.me/233551817972`) |
| Success page | `thanks.html` (also served at `/thank-you`) |
| Canonical URL | `https://marketbridge-sample.netlify.app/` |

If the Netlify site name is different, update the canonical link, `og:url` and the JSON-LD `url` in `index.html` to the live address.

## Contact form and spam protection

- With JavaScript, the form validates inline and submits to Formspree with `fetch`. Visitors stay on the page and see a confirmation message.
- Without JavaScript, the form posts normally and uses the browser's built-in validation.
- A Formspree `_gotcha` honeypot catches simple bots. It uses the `hidden` attribute (`display: none`), so browser autofill and password managers never fill it in. The previous version moved it off-screen instead, and Chrome autofilled it. That sent real enquiries to the Spam tab.

### Formspree settings

- **reCAPTCHA: off** (current setting). Formspree only accepts AJAX submissions with reCAPTCHA off, and this also removes its CAPTCHA page and "free quota exceeded" warning. The honeypot and Formspree's automatic spam filtering stay active.
- If reCAPTCHA is turned back on, the script falls back to a normal form post, so no enquiry is lost. Visitors then pass through Formspree's CAPTCHA page.

## Page structure

Dark hero with a sample dashboard (HTML, CSS and inline SVG), keyword ticker, benefits, four-step process, trust points, call-to-action band, contact form and footer. A round WhatsApp button is fixed to the bottom-right corner.

## Motion

- Below-the-fold content fades and slides in once, using `IntersectionObserver`. Only opacity and transform are animated.
- Setup runs after the `load` event, and only elements that start below the viewport are hidden. Without JavaScript, everything is visible.
- `prefers-reduced-motion` turns off reveals, the chart animation and the ticker.

## Local preview

```bash
npx serve .
```

## Netlify deployment

Connect the GitHub repository to Netlify:

- Build command: none
- Publish directory: `.` (repository root)

`netlify.toml` sets the security headers (CSP, HSTS, nosniff, frame denial, referrer and permissions policies) and the cache rules.

## Performance approach

- No framework, external fonts, images or third-party scripts (all graphics are inline SVG or CSS)
- All main content is in the initial HTML
- A single small, deferred JavaScript file
- Responsive, accessible layout with visible focus states, tested at 360, 390, 768, 1024 and 1440px
- `ProfessionalService` structured data (JSON-LD) and a canonical URL
