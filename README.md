# MarketBridge sample website

A lightweight, mobile-first, two-page demonstration website for a Ghana-focused financial record-keeping service for traders and small businesses. It is built with semantic HTML, CSS and minimal vanilla JavaScript, and deploys to Netlify with no build step.

## Site structure

| Page | File | Live URL |
| --- | --- | --- |
| Homepage | `index.html` | https://marketbridge-sample.netlify.app/ |
| Contact | `contact.html` | https://marketbridge-sample.netlify.app/contact.html |
| Thank-you (noindex) | `thanks.html` | https://marketbridge-sample.netlify.app/thanks (also `/thank-you`) |

```
index.html        Homepage: hero, associations, features, how it works, stories, FAQ, contact CTA, footer
contact.html      Contact page: heading, intro, contact details, hours, WhatsApp, Formspree form, privacy note
thanks.html       Confirmation page (not indexed)
styles.css        Shared styles for every page
script.js         Shared script: menu, nav, FAQ, reveal, form, WhatsApp greeting
sitemap.xml       Both public pages
robots.txt        Allows everything and points to the sitemap
_headers          Security and cache headers (Netlify and Cloudflare Pages)
_redirects        /thank-you → /thanks
netlify.toml      Build settings only
assets/
  favicon.svg                    Logo
  img/*.webp                     Responsive photos (the only image files the pages load)
  og/marketbridge-og.jpg         Social-sharing image (1200 × 630)
  source/*-original.jpg          Original photographs (kept for reference, never referenced by the pages)
```

The homepage has no form. Every "Book a walkthrough", "Contact" and "Send us a message" link points to `contact.html`.

### Navigation

- Homepage: Features (`#benefits`), How it works (`#how-it-works`), Stories (`#trust`), FAQ (`#faq`), Contact (`contact.html`). A soft pill marks the section in view.
- Contact page: the same items link to `index.html#benefits`, `index.html#how-it-works`, `index.html#trust` and `index.html#faq`. Contact carries `aria-current="page"` in the nav and footer.
- The logo links to the top of the homepage from both pages. The Contact page also has a breadcrumb and a "Back to the homepage" link.

## Configuration

| Item | Value |
| --- | --- |
| Contact form | Formspree, `https://formspree.io/f/xzeeovrd` (sample endpoint) |
| WhatsApp | `+233 55 181 7972`, `https://wa.me/233551817972` (sample number) |
| Canonical URLs | `https://marketbridge-sample.netlify.app/` and `https://marketbridge-sample.netlify.app/contact.html` |

Every displayed number and every `wa.me` link on both pages uses `233551817972`. To change the number, search the project for `233551817972` and `+233 55 181 7972` and replace both forms, including the JSON-LD `telephone` fields.

## Contact form and spam protection

The form lives only on `contact.html`. It has a full name, email, optional phone and message field, and a hidden `_subject` that labels the email.

- **With JavaScript**, fields validate inline with specific messages (`aria-invalid` plus a linked error). The form submits to Formspree with `fetch`, and the visitor stays on the page. Success and error messages appear in a `role="status"` live region that receives focus.
- **Without JavaScript**, the form posts normally to Formspree and the browser's built-in validation applies.
- **Spam protection:**
  - A Formspree `_gotcha` honeypot catches simple bots. It uses the `hidden` attribute (`display: none`), so people, keyboard users and browser autofill never reach it. An earlier version moved it off-screen instead, Chrome autofilled it, and real enquiries went to the Spam tab.
  - Formspree's automatic spam filtering also stays on.
- **reCAPTCHA is off** in the Formspree dashboard, because Formspree only accepts AJAX submissions without it. If it is turned back on, the script falls back to a normal post, so no enquiry is lost.

### Form ownership

`xzeeovrd` is a sample endpoint for this demonstration only. **The final client website will use a Formspree form created in the client's own Formspree account**, so enquiries go to the client's inbox and the client controls the spam settings and data. To switch:
1. Create the form in the client's account and turn reCAPTCHA off.
2. Replace the `action` URL in `contact.html`.
3. Send a test enquiry.

## Photographs

Four real camera photographs from Wikimedia Commons, none AI-generated. Licences were checked on each file page and in the Commons API metadata. CC BY-SA allows commercial use and adaptation with attribution; adapted versions carry the same licence. The people pictured are not MarketBridge customers.

| Use | Title and author | Licence | Original file | Original size | Dimensions |
| --- | --- | --- | --- | --- | --- |
| Homepage hero | ["A traditional market woman"](https://commons.wikimedia.org/wiki/File:A_traditional_market_woman.jpg) by JustSwanzy | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | `assets/source/market-trader-original.jpg` | **2,784,921 B (2.66 MB)** | **4032 × 3024** (Pixel 3 XL, 4 Mar 2023) |
| Contact header | ["Market Stalls"](https://commons.wikimedia.org/wiki/File:Market_Stalls.jpg) by Marvellousdurowaiye | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | `assets/source/grain-market-original.jpg` | 2,118,491 B (2.02 MB) | 5181 × 3454 |
| Features (beside text) | ["Market Woman Selling"](https://commons.wikimedia.org/wiki/File:Market_Woman_Selling.jpg) by Fquasie | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | `assets/source/fish-seller-original.jpg` | 1,510,866 B (1.44 MB) | 5184 × 3456 |
| Stories (beside quotes) | ["Kente Kumasi 2010-06-30"](https://commons.wikimedia.org/wiki/File:Kente_Kumasi_2010-06-30.jpg) by Adam Jones | [CC BY-SA 2.0](https://creativecommons.org/licenses/by-sa/2.0/) | `assets/source/textiles-original.jpg` | 3,097,321 B (2.95 MB) | 3456 × 2304 |

**Attribution.** At the client's request the pages carry no visible credit line; an HTML comment in each footer points here. CC BY-SA requires attribution "reasonable to the medium", so for the final client site either restore a credit line (a one-line footer note is enough) or replace these photos with the client's own photography, with model releases from the people pictured.

### Generated WebP files

All visible photos are WebP, generated with [sharp](https://sharp.pixelplumbing.com/) (libvips): `effort: 6`, `smartSubsample: true`, EXIF stripped. Quality 68 for the photos, 58 for the tall Contact crop and 50 for the busy textile print, chosen by eye so none shows visible artefacts.

| File | Dimensions | Size | Served to |
| --- | --- | --- | --- |
| `market-trader-1200.webp` | 1200 × 800 | 120,184 B (117.4 KB) | Homepage hero, 1000 px and up |
| `market-trader-1600.webp` | 1600 × 1067 | 172,596 B (168.6 KB) | Homepage hero, 1000 px and up |
| `market-trader-2400.webp` | 2400 × 1600 | 310,850 B (303.6 KB) | Homepage hero, large or 2× screens |
| `market-trader-portrait-480.webp` | 480 × 960 | 66,646 B (65.1 KB) | Homepage hero, phones |
| `market-trader-portrait-768.webp` | 768 × 1536 | 121,172 B (118.3 KB) | Homepage hero, phones and tablets |
| `market-trader-portrait-1080.webp` | 1080 × 2160 | 190,736 B (186.3 KB) | Homepage hero, 3× phones |
| `grain-market-1200.webp` | 1200 × 800 | 122,420 B (119.6 KB) | Contact header, 1000 px and up |
| `grain-market-1600.webp` | 1600 × 1067 | 192,044 B (187.5 KB) | Contact header, 1000 px and up |
| `grain-market-2400.webp` | 2400 × 1600 | 365,600 B (357.0 KB) | Contact header, large or 2× screens |
| `grain-market-portrait-480.webp` | 480 × 960 | 61,364 B (59.9 KB) | Contact header, phones |
| `grain-market-portrait-768.webp` | 768 × 1536 | 135,432 B (132.3 KB) | Contact header, phones and tablets |
| `grain-market-portrait-1080.webp` | 1080 × 2160 | 235,672 B (230.1 KB) | Contact header, 3× phones |
| `fish-seller-480.webp` | 480 × 320 | 28,034 B (27.4 KB) | Features photo (lazy) |
| `fish-seller-768.webp` | 768 × 512 | 52,070 B (50.8 KB) | Features photo (lazy) |
| `fish-seller-1200.webp` | 1200 × 800 | 91,268 B (89.1 KB) | Features photo (lazy) |
| `fish-seller-1600.webp` | 1600 × 1067 | 130,002 B (127.0 KB) | Features photo (lazy) |
| `textiles-480.webp` | 480 × 320 | 51,678 B (50.5 KB) | Stories photo (lazy) |
| `textiles-768.webp` | 768 × 512 | 116,116 B (113.4 KB) | Stories photo (lazy) |
| `textiles-1200.webp` | 1200 × 800 | 243,432 B (237.7 KB) | Stories photo (lazy) |
| `textiles-1600.webp` | 1600 × 1067 | 377,692 B (368.8 KB) | Stories photo (lazy) |

A phone loading the homepage downloads one 118 KB hero file instead of the 2.66 MB original (about 96% smaller), and the two lower photos only once they scroll near.

Crops: the hero and Contact header have a 3:2 frame for wide screens and a tall 1:2 crop for phones, so the person stays in frame above the headline. The photos beside text keep their full 3:2 frame.

### Responsive image markup

The homepage hero and the Contact header use a `<picture>` element for art direction: the tall crop below 1000 px, the wide frame above. The image fills the full-width hero (`object-fit: cover`, tuned `object-position`) with a dark veil rising from the bottom, so the centred white type stays readable and the person in the photo stays clear above the headline.

```html
<picture class="hero-photo">
  <source media="(min-width: 1000px)" type="image/webp"
    srcset="…market-trader-1200.webp 1200w, …-1600.webp 1600w, …-2400.webp 2400w"
    sizes="100vw" width="2400" height="1600" />
  <img src="assets/img/market-trader-portrait-768.webp"
    srcset="…portrait-480.webp 480w, …portrait-768.webp 768w, …portrait-1080.webp 1080w"
    sizes="100vw" width="1080" height="2160"
    loading="eager" fetchpriority="high" decoding="async"
    alt="A market trader in Ghana at her stall, arranging bunches of green and ripe plantain…" />
</picture>
```

- `sizes` is `100vw`: the hero runs edge to edge.
- The panel has a fixed minimum height and the `<img>` is absolutely positioned inside it, so nothing moves when the file arrives (CLS 0). Explicit `width`/`height` are still set.
- The two photos beside text (Features and Stories) are plain `<img>` elements with `srcset`, a `sizes` that matches their half-width column, `width`/`height`, `loading="lazy"` and `decoding="async"`. The hero and Contact header are never lazy-loaded.
- Nothing stretches: every image has `object-fit: cover` and a fixed aspect ratio, and no width ever scrolls sideways.

### Header preload

Both pages preload the same responsive candidates in the `<head>`, one link per art-direction branch. The `media` queries are mutually exclusive, so the browser fetches only one file, the same one the `<picture>` then uses:

```html
<link rel="preload" as="image" type="image/webp" media="(min-width: 1000px)"
  imagesrcset="…market-trader-1200.webp 1200w, …-1600.webp 1600w, …-2400.webp 2400w"
  imagesizes="100vw" fetchpriority="high" />
<link rel="preload" as="image" type="image/webp" media="(max-width: 999px)"
  imagesrcset="…portrait-480.webp 480w, …portrait-768.webp 768w, …portrait-1080.webp 1080w"
  imagesizes="100vw" fetchpriority="high" />
```

## SEO, Open Graph and Twitter/X

Each page has its own title, meta description, canonical URL, Open Graph tags and Twitter/X tags:

| | Homepage | Contact |
| --- | --- | --- |
| Title | MarketBridge \| Financial records for Ghanaian traders | Contact MarketBridge \| Book a free walkthrough |
| Canonical / `og:url` | `https://marketbridge-sample.netlify.app/` | `https://marketbridge-sample.netlify.app/contact.html` |
| Structured data | `ProfessionalService` (with `ContactPoint`) and `FAQPage` | `ContactPage` with `BreadcrumbList` and the business's `ContactPoint` and hours |

Both pages also carry:
- `og:image`, `og:image:type`, `og:image:width` (1200), `og:image:height` (630) and `og:image:alt`;
- `twitter:card` = `summary_large_image`, plus `twitter:title`, `twitter:description`, `twitter:image` and `twitter:image:alt`.

All image URLs are absolute: `https://marketbridge-sample.netlify.app/assets/og/marketbridge-og.jpg`.

**Social image:** `assets/og/marketbridge-og.jpg` is a 1200 × 630 JPEG of 84,598 B (82.6 KB). It shows the MarketBridge logo, the headline "Know where every cedi goes." and the cropped hero photo with a "Profit today" chip. It was rendered from HTML in headless Chrome, then compressed with mozjpeg at quality 82. It is a JPEG for compatibility with social platforms and never appears as a visible photo on the site.

All page content is in the HTML. JavaScript only adds behaviour.

### Sitemap and robots

`sitemap.xml` lists the homepage and the Contact page. `thanks.html` is `noindex` and left out. `robots.txt`:

```
User-agent: *
Allow: /
Sitemap: https://marketbridge-sample.netlify.app/sitemap.xml
```

## Design

"The honest receipt": calm porcelain surfaces, one cedi-green accent, system fonts and monospace figures for every amount. The logo is a lowercase m drawn as two bridge arches with a gold coin (`assets/favicon.svg`, also inline in the header and footer).

The layout follows a few rules: one idea per section, photos beside text rather than full-width (except the two heroes), small type (16 px body, 14 px captions, headings capped at about 38 px), compact buttons (42 px) and cards, and one spacing scale (`--sp-1` to `--sp-6`) used everywhere so nothing feels crowded.

Homepage order:
1. Floating capsule navigation
2. Hero: edge-to-edge market photograph with the centred headline, two buttons and three trust points
3. Partner associations
4. "Your day on one page": heading and three small icon features beside the sample receipt, which prints line by line as it scrolls into view
5. Features: intro beside a photo, then four small tiles
6. How it works
7. Stories: centred heading, a centred row of three figures, then the market photo beside a featured quote with two shorter quotes beneath
8. FAQ
9. Contact call-to-action
10. Footer

Contact page order: edge-to-edge photo header (centred heading, intro and one line of facts), then the ways to reach us on the left (WhatsApp with a live open/closed status, hours and offices as icon rows, plus "what happens next") and the form card on the right. On phones the form comes first.

Partner names, figures and testimonials are illustrative, and the footer says so on every page.

## Motion

- Below-the-fold content fades and slides in once using `IntersectionObserver`. Without JavaScript, everything is visible.
- The sample receipt prints line by line once it scrolls into view (CSS animation, started by `IntersectionObserver`; without JavaScript it prints on load).
- **Floating glass nav:**
  - turns smoky over the dark section;
  - compacts after the first scroll, tucks away while scrolling down and returns on scroll up.
- **Phone menu:** a glass panel that fades in. It closes on a link tap, a tap outside it, scrolling or Escape.
- **FAQ:** answers slide open and closed, one at a time. Without JavaScript, `<details name="faq">` keeps the one-at-a-time behaviour.
- **WhatsApp greeting (homepage):**
  - appears after about 5 seconds, or once the visitor scrolls past the hero;
  - shows the opening-hours status in Ghana time;
  - stays up to 60 seconds, or until the visitor closes it, taps it, opens the menu or presses Escape.
- **WhatsApp button:** floats above Netlify's free-plan "Powered by Netlify" badge on both pages. `_headers` allows the badge's inline script by hash.
- `prefers-reduced-motion` turns all of these animations off.

## Deployment (Netlify)

No build step: the publish directory is the repository root. Headers live in `_headers` and the `/thank-you` rewrite in `_redirects`; `netlify.toml` holds only build settings, so headers are not sent twice.

1. In Netlify: Add new project → Import an existing project → GitHub → choose the repository.
2. Leave the build command empty. The publish directory is `.`, which `netlify.toml` already sets.
3. Every push to `main` redeploys automatically, usually within 15 seconds. Check the commit hash under Deploys.

CSS and JS URLs carry a version query (`?v=…`) and are served with `max-age=0, must-revalidate`. After changing either file, bump the version in all three HTML files. Images under `/assets/` are cached for 7 days; give replaced images a new file name.

To preview locally: `npx serve .`

## Testing

The site was tested at 360, 390, 768, 1024 and 1440px on both pages, in Chrome (Puppeteer) and in WebKit (Playwright, iPhone 13 emulation). The checks covered:
- no horizontal scrolling and no overlapping content;
- the hero photo loading the expected file at the correct aspect ratio;
- nav links between pages, landing flush on homepage sections;
- the mobile menu (open, outside tap, scroll and Escape all close it);
- FAQ behaviour and the WhatsApp greeting;
- visible keyboard focus and reduced motion;
- form validation, mocked success, a server error, and the reCAPTCHA fallback;
- every WhatsApp link pointing to `233551817972`;
- no console errors.

### PageSpeed Insights (mobile)

The official PageSpeed Insights API was over its shared daily quota on 5 November 2026, so the figures below come from Lighthouse 13.6 run from a Windows laptop against the production deployment (commit `d388059`), mobile preset, two runs per page. They are not official PSI numbers; run https://pagespeed.web.dev/ in Mobile mode for those.

| Page | Performance | Accessibility | Best Practices | SEO | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Homepage, as served | 74–76 | 100 | 100 | 100 | 2.6–2.7 s | 710–840 ms | 0 |
| Homepage, Netlify badge blocked | 93–97 | 100 | 100 | 100 | 1.9–2.4 s | 60–140 ms | 0 |
| Contact, as served | 84–99 | 100 | 100 | 100 | 1.8–2.5 s | 20–400 ms | 0 |

**What the gap is.** Netlify injects a "Powered by Netlify" badge script (`/.netlify/scripts/hud`) on free-plan sites. The trace shows one 813 ms long task from that script, which builds an iframe whose own styling costs about 2 s of style and layout work; the site's own JavaScript totals 7 ms. Everything else (image sizing, preload, layout shift, accessibility, SEO) meets the targets. The badge cannot be switched off on the free plan, and because it is served from the site's own origin the Content Security Policy cannot exclude it. On the client's own paid Netlify plan (or any other host) it is absent, and the page scores in the 90s.

## Client handover

1. **Domain:** connect the client's domain in Netlify (Domain management). Update the canonical, `og:url`, `og:image`, `twitter:image` and JSON-LD URLs in `index.html` and `contact.html`, plus `sitemap.xml` and `robots.txt`.
2. **Form:** create the Formspree form in the client's account (reCAPTCHA off). Replace the `action` URL in `contact.html` and send a test enquiry.
3. **WhatsApp:** replace `233551817972` / `+233 55 181 7972` with the client's number everywhere, including JSON-LD.
4. **Content:**
   - Replace the illustrative partners, figures and testimonials with real, approved ones, then remove the "illustrative" note.
   - Replace the hero photo with the client's own photography if available. Regenerate the WebP files at the same names and sizes, or update `srcset`/`imagesrcset`.
   - Update the photo credit.
5. **Hosting:**
   - Transfer the Netlify project and GitHub repository to the client's accounts.
   - On a paid Netlify plan, the badge can be removed; then drop the badge allowances from the CSP in `_headers`.
6. **Final checks:** re-run PageSpeed Insights (mobile) on both pages. Submit `sitemap.xml` in Google Search Console.
