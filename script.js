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
}

const year = document.querySelector('#current-year');
if (year) year.textContent = String(new Date().getFullYear());

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
