# MarketBridge sample landing page

A lightweight, mobile-first demonstration website for a generic Ghana-focused business, built with semantic HTML, CSS and minimal vanilla JavaScript. It deploys directly to Netlify with no build step.

## Configuration

| Item | Value |
| --- | --- |
| Contact form | Formspree, `https://formspree.io/f/xzeeovrd` |
| WhatsApp | `+233551817972` (`https://wa.me/233551817972`) |
| Success page | `thanks.html` (also served at `/thank-you`) |

## Contact form and spam protection

- With JavaScript, the form validates inline and submits to Formspree with `fetch`. Visitors stay on the page and see a confirmation message.
- Without JavaScript, the form posts normally and uses the browser's built-in validation.
- A Formspree `_gotcha` honeypot catches simple bots. It uses the `hidden` attribute (`display: none`), so browser autofill and password managers never fill it in. The previous version moved it off-screen instead, and Chrome autofilled it. That sent real enquiries to the Spam tab.

### Recommended Formspree settings (form dashboard → Settings)

1. **Turn reCAPTCHA off.** Formspree rejects AJAX submissions while its reCAPTCHA is on. Its shared reCAPTCHA Enterprise key also shows visitors a "free quota exceeded" warning. With reCAPTCHA off, the honeypot and Formspree's automatic spam filtering stay in place.
2. If reCAPTCHA stays on, the script falls back to a normal form post, so no enquiry is lost. Visitors then see Formspree's CAPTCHA and thank-you pages. To send them back to this site afterwards, set the form's redirect URL to `https://<your-site>.netlify.app/thanks.html` (if your Formspree plan supports it).

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

- No framework, external fonts or third-party scripts
- All main content is in the initial HTML
- A single small, deferred JavaScript file
- Responsive, accessible layout with visible focus states
