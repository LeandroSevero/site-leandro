const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY;

let turnstileWidgetId = null;
let turnstileToken = null;

const RULES = {
  name: {
    required: true,
    minLength: 3,
    maxLength: 120,
    pattern: /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'\-]+$/,
    messages: {
      required: 'Nome completo é obrigatório.',
      minLength: 'Nome deve ter pelo menos 3 caracteres.',
      maxLength: 'Nome deve ter no máximo 120 caracteres.',
      pattern: 'Nome deve conter apenas letras, espaços, acentos, hífen e apóstrofo.',
    },
  },
  email: {
    required: true,
    maxLength: 254,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    messages: {
      required: 'E-mail é obrigatório.',
      maxLength: 'E-mail deve ter no máximo 254 caracteres.',
      pattern: 'Informe um e-mail válido.',
    },
  },
  phone: {
    required: false,
    maxLength: 15,
    messages: {
      maxLength: 'Telefone inválido.',
      pattern: 'Informe um telefone válido: (99) 99999-9999.',
    },
  },
  subject: {
    required: true,
    minLength: 3,
    maxLength: 120,
    messages: {
      required: 'Assunto é obrigatório.',
      minLength: 'Assunto deve ter pelo menos 3 caracteres.',
      maxLength: 'Assunto deve ter no máximo 120 caracteres.',
    },
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000,
    messages: {
      required: 'Mensagem é obrigatória.',
      minLength: 'Mensagem deve ter pelo menos 10 caracteres.',
      maxLength: 'Mensagem deve ter no máximo 1000 caracteres.',
    },
  },
};

const validateField = (fieldName, rawValue) => {
  const value = rawValue.trim();
  const rule = RULES[fieldName];
  if (!rule) return null;

  if (rule.required && !value) return rule.messages.required;
  if (!rule.required && !value) return null;

  if (rule.minLength && value.length < rule.minLength) return rule.messages.minLength;
  if (rule.maxLength && value.length > rule.maxLength) return rule.messages.maxLength;

  if (fieldName === 'phone' && value) {
    const digits = value.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) return rule.messages.pattern;
  }

  if (rule.pattern && !rule.pattern.test(value)) return rule.messages.pattern;

  return null;
};

const setFieldError = (input, errorMsg) => {
  const field = input.closest('.contact-form-field');
  const errorEl = field && field.querySelector('.contact-form-error');

  if (errorMsg) {
    input.classList.add('contact-form-input--error');
    input.setAttribute('aria-invalid', 'true');
    if (errorEl) {
      errorEl.textContent = errorMsg;
      errorEl.removeAttribute('hidden');
    }
  } else {
    input.classList.remove('contact-form-input--error');
    input.setAttribute('aria-invalid', 'false');
    if (errorEl) {
      errorEl.textContent = '';
      errorEl.setAttribute('hidden', '');
    }
  }
};

const applyPhoneMask = (input) => {
  let v = input.value.replace(/\D/g, '').slice(0, 11);
  if (v.length > 10) {
    v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  } else if (v.length > 6) {
    v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
  } else if (v.length > 2) {
    v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
  } else if (v.length > 0) {
    v = v.replace(/^(\d{0,2})$/, '($1');
  }
  input.value = v;
};

const updateCounter = (input, counterEl, max) => {
  const len = input.value.trim().length;
  counterEl.textContent = `${len}/${max}`;
  counterEl.classList.toggle('contact-form-counter--near', len >= max * 0.85);
  counterEl.classList.toggle('contact-form-counter--over', len > max);
};

const loadTurnstileScript = () => {
  return new Promise((resolve) => {
    if (window.turnstile) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    document.head.appendChild(script);
  });
};

const renderTurnstile = (container) => {
  if (!window.turnstile || !TURNSTILE_SITE_KEY) return;
  turnstileToken = null;
  turnstileWidgetId = window.turnstile.render(container, {
    sitekey: TURNSTILE_SITE_KEY,
    theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
    callback: (token) => { turnstileToken = token; },
    'expired-callback': () => { turnstileToken = null; },
    'error-callback': () => { turnstileToken = null; },
  });
};

const resetTurnstile = () => {
  if (window.turnstile && turnstileWidgetId !== null) {
    window.turnstile.reset(turnstileWidgetId);
  }
  turnstileToken = null;
};

const showFormFeedback = (form, type, message) => {
  const existing = form.querySelector('.contact-form-feedback');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.className = `contact-form-feedback contact-form-feedback--${type}`;
  el.setAttribute('role', type === 'error' ? 'alert' : 'status');
  el.textContent = message;
  const submitBtn = form.querySelector('#contact-form-submit');
  submitBtn && form.insertBefore(el, submitBtn);
};

const handleSubmit = async (form, submitBtn) => {
  const fields = ['name', 'email', 'phone', 'subject', 'message'];
  let hasError = false;

  fields.forEach((fieldName) => {
    const input = form.querySelector(`#cf-${fieldName}`);
    if (!input) return;
    const error = validateField(fieldName, input.value);
    setFieldError(input, error);
    if (error) hasError = true;
  });

  if (hasError) return;

  if (!turnstileToken) {
    showFormFeedback(form, 'error', 'Confirme que você não é um robô antes de enviar.');
    return;
  }

  const name = form.querySelector('#cf-name').value.trim();
  const email = form.querySelector('#cf-email').value.trim();
  const phone = form.querySelector('#cf-phone').value.trim();
  const subject = form.querySelector('#cf-subject').value.trim();
  const message = form.querySelector('#cf-message').value.trim();

  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';

  const existing = form.querySelector('.contact-form-feedback');
  if (existing) existing.remove();

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ turnstileToken, name, email, phone, subject, message }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      if (data.errors) {
        Object.entries(data.errors).forEach(([fieldName, msg]) => {
          const input = form.querySelector(`#cf-${fieldName}`);
          if (input) setFieldError(input, msg);
        });
      }
      throw new Error(data.message || 'Erro ao enviar. Tente novamente.');
    }

    showFormFeedback(form, 'success', data.message || 'Mensagem enviada com sucesso! Em breve entrarei em contato.');
    form.reset();

    form.querySelectorAll('.contact-form-counter').forEach((counter) => {
      const input = counter.closest('.contact-form-field')?.querySelector('input, textarea');
      if (input) {
        const max = parseInt(counter.dataset.max, 10);
        updateCounter(input, counter, max);
      }
    });

    resetTurnstile();
  } catch (err) {
    showFormFeedback(form, 'error', err.message || 'Não foi possível enviar a mensagem. Tente novamente mais tarde.');
    resetTurnstile();
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar mensagem';
  }
};

export const initContactModal = () => {
  const overlay = document.getElementById('contact-modal-overlay');
  const modal = document.getElementById('contact-modal');
  const closeBtn = document.getElementById('contact-modal-close');
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-form-submit');
  const turnstileContainer = document.getElementById('cf-turnstile-container');

  if (!overlay || !modal || !form) return;

  const phoneInput = form.querySelector('#cf-phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => applyPhoneMask(phoneInput));
    phoneInput.addEventListener('blur', () => {
      const error = validateField('phone', phoneInput.value);
      setFieldError(phoneInput, error);
    });
  }

  form.querySelectorAll('.contact-form-counter').forEach((counter) => {
    const fieldName = counter.dataset.field;
    const max = parseInt(counter.dataset.max, 10);
    const input = form.querySelector(`#cf-${fieldName}`);
    if (!input) return;
    updateCounter(input, counter, max);
    input.addEventListener('input', () => updateCounter(input, counter, max));
  });

  ['name', 'email', 'subject', 'message'].forEach((fieldName) => {
    const input = form.querySelector(`#cf-${fieldName}`);
    if (!input) return;
    input.addEventListener('blur', () => {
      const error = validateField(fieldName, input.value);
      setFieldError(input, error);
    });
    input.addEventListener('input', () => {
      if (input.getAttribute('aria-invalid') === 'true') {
        const error = validateField(fieldName, input.value);
        setFieldError(input, error);
      }
    });
  });

  const openModal = async () => {
    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    await loadTurnstileScript();
    if (turnstileContainer && !turnstileContainer.hasChildNodes()) {
      renderTurnstile(turnstileContainer);
    }
  };

  const closeModal = () => {
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
    const feedback = form.querySelector('.contact-form-feedback');
    if (feedback) feedback.remove();
    form.querySelectorAll('.contact-form-input--error').forEach((el) => {
      setFieldError(el, null);
    });
  };

  document.querySelectorAll('[data-open-contact-modal]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  closeBtn && closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) closeModal();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSubmit(form, submitBtn);
  });
};
