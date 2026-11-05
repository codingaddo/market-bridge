const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.primary-nav');

if (menuButton && navigation) {
  const label = menuButton.querySelector('.sr-only');

  const setMenu = (open) => {
    menuButton.setAttribute('aria-expanded', String(open));
    navigation.classList.toggle('is-open', open);
    if (label) label.textContent = open ? 'Close navigation' : 'Open navigation';
  };

  menuButton.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  navigation.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) setMenu(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
      setMenu(false);
      menuButton.focus();
    }
  });

  // Close when tapping anywhere outside the capsule or its menu.
  const shell = menuButton.closest('.nav-shell');
  document.addEventListener('pointerdown', (event) => {
    if (navigation.classList.contains('is-open') && shell && !shell.contains(event.target)) setMenu(false);
  });

  // Close as soon as the visitor starts scrolling the page.
  let openedAt = 0;
  menuButton.addEventListener('click', () => { openedAt = window.scrollY; });
  window.addEventListener('scroll', () => {
    if (navigation.classList.contains('is-open') && Math.abs(window.scrollY - openedAt) > 12) setMenu(false);
  }, { passive: true });
}

const year = document.querySelector('#current-year');
if (year) year.textContent = String(new Date().getFullYear());

/* FAQ accordion: one answer open at a time, with a smooth slide.
   The markup uses <details name="faq">, so without JavaScript the browser
   still keeps only one open (without animation). */
const faqItems = Array.from(document.querySelectorAll('.faq-list details'));

if (faqItems.length && typeof Element.prototype.animate === 'function') {
  const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const timing = { duration: 320, easing: 'cubic-bezier(.2, .7, .2, 1)' };
  const running = new WeakMap();

  // Script manages exclusivity so the item that closes can animate too.
  faqItems.forEach((item) => item.removeAttribute('name'));

  const animate = (item, opening) => {
    const answer = item.querySelector('.faq-answer');
    const previous = running.get(item);
    const from = answer.getBoundingClientRect().height;
    if (previous) previous.cancel();

    if (opening) {
      item.classList.remove('is-closing');
      item.open = true;
    } else {
      item.classList.add('is-closing');
    }

    if (!motionOk) {
      if (!opening) {
        item.open = false;
        item.classList.remove('is-closing');
      }
      return;
    }

    const to = opening ? answer.scrollHeight : 0;
    const animation = answer.animate(
      [
        { height: `${opening && !previous ? 0 : from}px`, opacity: opening ? 0 : 1 },
        { height: `${to}px`, opacity: opening ? 1 : 0 },
      ],
      timing,
    );
    running.set(item, animation);
    animation.onfinish = () => {
      running.delete(item);
      if (!opening) {
        item.open = false;
        item.classList.remove('is-closing');
      }
    };
  };

  faqItems.forEach((item) => {
    item.querySelector('summary').addEventListener('click', (event) => {
      event.preventDefault();
      const opening = !item.open || item.classList.contains('is-closing');
      if (opening) {
        faqItems.forEach((other) => {
          if (other !== item && other.open && !other.classList.contains('is-closing')) animate(other, false);
        });
      }
      animate(item, opening);
    });
  });
}

/* Header shadow once the page scrolls. */
if ('IntersectionObserver' in window) {
  const header = document.querySelector('.site-header');

  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.className = 'scroll-sentinel';
  document.body.prepend(sentinel);

  new IntersectionObserver(([entry]) => {
    if (header) header.classList.toggle('is-scrolled', !entry.isIntersecting);
  }).observe(sentinel);

  /* Adaptive glass: watch a thin band at the top of the viewport (where the
     capsule floats) and switch to the smoky variant over dark sections. */
  const darkSections = document.querySelectorAll('[data-nav-dark]');
  if (header && darkSections.length) {
    const underNav = new Set();
    let bandObserver = null;

    const watchBand = () => {
      if (bandObserver) bandObserver.disconnect();
      underNav.clear();
      const bandBottom = Math.max(window.innerHeight - 52, 0);
      bandObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) underNav.add(entry.target);
          else underNav.delete(entry.target);
        });
        header.classList.toggle('on-dark', underNav.size > 0);
      }, { rootMargin: `-40px 0px -${bandBottom}px 0px` });
      darkSections.forEach((section) => bandObserver.observe(section));
    };

    watchBand();
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(watchBand, 200);
    });
  }

  /* Floating nav: tucks away while scrolling down, returns on any scroll up.
     It stays put while the menu is open, while it has keyboard focus, and
     briefly after a nav link is used. */
  if (header) {
    let lastY = window.scrollY;
    let ticking = false;
    let holdUntil = 0;

    const setHidden = (hidden) => header.classList.toggle('is-hidden', hidden);

    const onScroll = () => {
      ticking = false;
      const y = window.scrollY;
      const delta = y - lastY;
      if (Math.abs(delta) < 6) return;
      lastY = y;
      const menuOpen = menuButton && menuButton.getAttribute('aria-expanded') === 'true';
      if (delta < 0 || y < 400 || menuOpen || header.contains(document.activeElement) || Date.now() < holdUntil) {
        setHidden(false);
      } else {
        setHidden(true);
      }
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(onScroll);
      }
    }, { passive: true });

    header.addEventListener('focusin', () => setHidden(false));
    header.addEventListener('click', (event) => {
      if (event.target instanceof HTMLAnchorElement) holdUntil = Date.now() + 1200;
    });
  }

  /* Section indicator: a soft pill slides behind the link for the section in view. */
  if (navigation) {
    const links = Array.from(navigation.querySelectorAll('a[href^="#"]:not(.nav-cta)'));
    const indicator = document.createElement('span');
    indicator.className = 'nav-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    navigation.prepend(indicator);

    const setActive = (id) => {
      let active = null;
      links.forEach((link) => {
        const match = link.getAttribute('href') === `#${id}`;
        if (match) {
          link.setAttribute('aria-current', 'true');
          active = link;
        } else {
          link.removeAttribute('aria-current');
        }
      });
      indicator.classList.toggle('is-active', Boolean(active));
      if (active) {
        indicator.style.width = `${active.offsetWidth}px`;
        indicator.style.transform = `translateX(${active.offsetLeft}px)`;
      }
    };

    const visible = new Map();
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.set(entry.target.id, entry.target);
        else visible.delete(entry.target.id);
      });
      const ids = Array.from(visible.keys());
      setActive(ids.length ? ids[ids.length - 1] : null);
    }, { rootMargin: '-45% 0px -50% 0px' });

    links.forEach((link) => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section) spy.observe(section);
    });
  }
}

/* Scroll reveal: runs once per element. The observer's first report tells us
   which elements start off screen; only those are hidden and animated, so
   nothing visible is hidden. Setup waits for the load event so it never
   forces style or layout work ahead of the first paint. */
const initReveal = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const items = Array.from(document.querySelectorAll('.reveal'));
  const footer = document.querySelector('.site-footer');
  const seen = new WeakSet();

  const finish = (event) => {
    if (event.propertyName !== 'transform') return;
    const el = event.currentTarget;
    el.classList.remove('reveal-pending', 'is-visible');
    el.style.transitionDelay = '';
    el.removeEventListener('transitionend', finish);
  };

  const show = (el) => {
    observer.unobserve(el);
    if (!el.classList.contains('reveal-pending') || el.classList.contains('is-visible')) return;
    el.addEventListener('transitionend', finish);
    el.classList.add('is-visible');
  };

  // A fast scroll can carry an element past the viewport between observer
  // callbacks, so revealing one element also reveals everything above it.
  const showUpTo = (index) => {
    for (let i = 0; i <= index; i += 1) show(items[i]);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (el === footer) {
          if (entry.isIntersecting) showUpTo(items.length - 1);
          return;
        }
        const firstReport = !seen.has(el);
        seen.add(el);

        if (firstReport) {
          const rootBottom = entry.rootBounds ? entry.rootBounds.bottom : window.innerHeight;
          if (entry.isIntersecting || entry.boundingClientRect.top < rootBottom) {
            observer.unobserve(el); // on screen or already scrolled past: leave it visible
          } else {
            const group = el.parentElement.closest('[data-stagger]');
            if (group && el.parentElement === group) {
              const index = Array.prototype.indexOf.call(group.children, el);
              el.style.transitionDelay = `${index * 90}ms`;
            }
            el.classList.add('reveal-pending');
          }
          return;
        }

        if (entry.isIntersecting) showUpTo(items.indexOf(el));
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  items.forEach((el) => observer.observe(el));
  if (footer) observer.observe(footer);
};

if (document.readyState === 'complete') initReveal();
else window.addEventListener('load', initReveal, { once: true });

/* Contact form: inline validation plus AJAX submission to Formspree.
   Without JavaScript the form still posts normally and the browser's
   built-in validation applies. */
const form = document.querySelector('.contact-form');

if (form && window.fetch) {
  const status = form.querySelector('.form-status');
  const submitButton = form.querySelector('[type="submit"]');
  const submitLabel = submitButton.textContent;
  const phonePattern = /^[+\d][\d\s()-]{6,19}$/;

  const messages = {
    name: 'Please enter your full name.',
    email: 'Please enter a valid email address, for example name@example.com.',
    phone: 'Please enter a valid phone number, for example 024 123 4567.',
    message: 'Please tell us how we can help.',
  };

  const getFieldError = (field) => {
    const value = field.value.trim();
    if (field.required && !value) return messages[field.name];
    if (field.type === 'email' && value && !field.checkValidity()) return messages.email;
    if (field.name === 'phone' && value && !phonePattern.test(value)) return messages.phone;
    return '';
  };

  const showFieldError = (field, message) => {
    const errorEl = form.querySelector(`#${field.id}-error`);
    if (errorEl) errorEl.textContent = message;
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  };

  const setStatus = (message, type) => {
    status.textContent = message;
    status.className = `form-status${type ? ` is-${type}` : ''}`;
  };

  const fields = Array.from(form.querySelectorAll('.form-field input, .form-field textarea'));

  // Custom messages replace the browser's tooltips when JavaScript runs.
  form.noValidate = true;

  fields.forEach((field) => {
    field.addEventListener('blur', () => {
      if (field.value.trim()) showFieldError(field, getFieldError(field));
    });
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') showFieldError(field, getFieldError(field));
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    let firstInvalid = null;
    fields.forEach((field) => {
      const message = getFieldError(field);
      showFieldError(field, message);
      if (message && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      setStatus('Please correct the highlighted fields and try again.', 'error');
      firstInvalid.focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    setStatus('Sending your enquiry…');

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        form.reset();
        setStatus('Thank you. Your enquiry has been sent and we will respond shortly.', 'success');
        status.focus();
        return;
      }

      const data = await response.json().catch(() => ({}));

      // Formspree refuses AJAX while its reCAPTCHA is enabled. Fall back to a
      // normal post so the visitor completes the CAPTCHA and nothing is lost.
      if (response.status === 403 && /recaptcha/i.test(data.error || '')) {
        HTMLFormElement.prototype.submit.call(form);
        return;
      }

      if (Array.isArray(data.errors) && data.errors.length) {
        data.errors.forEach((error) => {
          const field = error.field && form.elements.namedItem(error.field);
          if (field && field.id) showFieldError(field, error.message);
        });
        setStatus(data.errors.map((error) => error.message).join(' '), 'error');
      } else {
        setStatus('Sorry, your enquiry could not be sent. Please try again or contact us on WhatsApp.', 'error');
      }
      status.focus();
    } catch {
      setStatus('Network error: please check your connection and try again, or contact us on WhatsApp.', 'error');
      status.focus();
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = submitLabel;
    }
  });
}

/* WhatsApp greeting: on every page load, after ~5 s or once the visitor
   scrolls past the hero, the button breathes once and a short message slides
   out. It stays for up to 60 s or until closed with × (for that page view). */
const teaser = document.querySelector('.wa-teaser');
const waButton = document.querySelector('.whatsapp-button');

if (teaser && waButton && 'IntersectionObserver' in window) {
  // Live status from opening hours in Ghana (GMT, no daylight saving): Mon–Sat, 8:00–18:00.
  const status = teaser.querySelector('[data-wa-status]');
  if (status) {
    const now = new Date();
    const day = now.getUTCDay();
    const hour = now.getUTCHours();
    const open = day >= 1 && day <= 6 && hour >= 8 && hour < 18;
    status.classList.toggle('is-online', open);
    if (!open) {
      const nextIsMonday = day === 0 || (day === 6 && hour >= 18);
      status.textContent = nextIsMonday ? 'Replies Monday from 8:00' : 'Replies from 8:00';
    }
  }

  let shown = false;
  let hideTimer;
  let contactVisible = false;

  const hide = () => {
    clearTimeout(hideTimer);
    if (teaser.hidden) return;
    teaser.classList.remove('is-visible');
    const done = () => { teaser.hidden = true; };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) done();
    else teaser.addEventListener('transitionend', done, { once: true });
  };

  const show = () => {
    const menuOpen = menuButton && menuButton.getAttribute('aria-expanded') === 'true';
    if (shown || contactVisible || menuOpen) return;
    shown = true;
    waButton.classList.add('is-nudging');
    waButton.addEventListener('animationend', () => waButton.classList.remove('is-nudging'), { once: true });
    setTimeout(() => {
      teaser.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => teaser.classList.add('is-visible')));
      hideTimer = setTimeout(hide, 60000);
    }, 500);
  };

  const startTimer = () => setTimeout(show, 5000);
  if (document.readyState === 'complete') startTimer();
  else window.addEventListener('load', startTimer, { once: true });

  const hero = document.querySelector('.hero');
  if (hero) {
    const heroObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
        heroObserver.disconnect();
        show();
      }
    });
    heroObserver.observe(hero);
  }

  const contact = document.querySelector('#contact');
  if (contact) {
    new IntersectionObserver(([entry]) => {
      contactVisible = entry.isIntersecting;
      if (contactVisible) hide();
    }, { threshold: 0.15 }).observe(contact);
  }

  teaser.querySelector('.wa-teaser-close').addEventListener('click', hide);
  teaser.querySelector('.wa-teaser-link').addEventListener('click', hide);
  waButton.addEventListener('click', hide);
  if (menuButton) menuButton.addEventListener('click', hide);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !teaser.hidden) hide();
  });
}
