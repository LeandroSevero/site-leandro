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

const FORM_STATE = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
  RATE_LIMIT: 'rate_limit',
};

const classifyError = (res, data) => {
  if (res.status === 429 || (data && data.rateLimited)) return FORM_STATE.RATE_LIMIT;
  return FORM_STATE.ERROR;
};

const showFormBody = (form) => {
  const formBody = form.querySelector('.contact-form-body');
  const resultPanel = form.querySelector('.contact-form-result-panel');
  if (formBody) {
    formBody.removeAttribute('hidden');
    formBody.removeAttribute('aria-hidden');
  }
  if (resultPanel) resultPanel.remove();
};

const hideFormBodyAndShow = (form, panelHtml) => {
  const formBody = form.querySelector('.contact-form-body');
  const existing = form.querySelector('.contact-form-result-panel');
  if (existing) existing.remove();

  if (formBody) {
    formBody.setAttribute('hidden', '');
    formBody.setAttribute('aria-hidden', 'true');
  }

  const panel = document.createElement('div');
  panel.className = 'contact-form-result-panel';
  panel.innerHTML = panelHtml;
  form.appendChild(panel);
};

const setFormState = (form, submitBtn, state, { message = '' } = {}) => {
  if (state === FORM_STATE.LOADING) {
    submitBtn.disabled = true;
    submitBtn.setAttribute('aria-busy', 'true');
    submitBtn.innerHTML = `
      <span class="contact-form-spinner" aria-hidden="true"></span>
      <span>Enviando sua mensagem...</span>
    `;
    return;
  }

  if (state === FORM_STATE.IDLE) {
    submitBtn.disabled = false;
    submitBtn.removeAttribute('aria-busy');
    submitBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
      <span>Enviar mensagem</span>
    `;
    showFormBody(form);
    return;
  }

  submitBtn.disabled = false;
  submitBtn.removeAttribute('aria-busy');
  submitBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13"></line>
      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
    <span>Enviar mensagem</span>
  `;

  if (state === FORM_STATE.SUCCESS) {
    hideFormBodyAndShow(form, `
      <div class="contact-form-result contact-form-result--success" role="status" aria-live="polite">
        <div class="contact-form-result-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h3 class="contact-form-result-title">Mensagem enviada com sucesso.</h3>
        <p class="contact-form-result-text">${message || 'Em breve entrarei em contato. Obrigado pelo seu interesse!'}</p>
        <p class="contact-form-result-note">O formulário permite no máximo <strong>2 envios por dia</strong>.</p>
        <button type="button" class="contact-form-result-btn contact-form-result-btn--primary" data-action="reset">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 .49-3.51"></path>
          </svg>
          Enviar novamente
        </button>
      </div>
    `);
  } else if (state === FORM_STATE.RATE_LIMIT) {
    hideFormBodyAndShow(form, `
      <div class="contact-form-result contact-form-result--rate-limit" role="alert" aria-live="assertive">
        <div class="contact-form-result-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <h3 class="contact-form-result-title">Limite diário atingido.</h3>
        <p class="contact-form-result-text">Você já utilizou o limite de <strong>2 mensagens</strong> hoje.</p>
        <p class="contact-form-result-text" style="margin-top: -0.5rem;">Tente novamente amanhã.</p>
        <button type="button" class="contact-form-result-btn contact-form-result-btn--secondary" data-action="back">
          Voltar
        </button>
      </div>
    `);
  } else {
    hideFormBodyAndShow(form, `
      <div class="contact-form-result contact-form-result--error" role="alert" aria-live="assertive">
        <div class="contact-form-result-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3 class="contact-form-result-title">Não foi possível enviar sua mensagem.</h3>
        <p class="contact-form-result-text">${message || 'Ocorreu um erro inesperado. Tente novamente em instantes.'}</p>
        <button type="button" class="contact-form-result-btn contact-form-result-btn--primary" data-action="retry">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 .49-3.51"></path>
          </svg>
          Tentar novamente
        </button>
      </div>
    `);
  }
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
    const existing = form.querySelector('.contact-form-feedback');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = 'contact-form-feedback contact-form-feedback--error';
    el.setAttribute('role', 'alert');
    el.textContent = 'Confirme que você não é um robô antes de enviar.';
    const submitBtnEl = form.querySelector('#contact-form-submit');
    submitBtnEl && submitBtnEl.parentNode.insertBefore(el, submitBtnEl);
    return;
  }

  const existing = form.querySelector('.contact-form-feedback');
  if (existing) existing.remove();

  const name = form.querySelector('#cf-name').value.trim();
  const email = form.querySelector('#cf-email').value.trim();
  const phone = form.querySelector('#cf-phone').value.trim();
  const subject = form.querySelector('#cf-subject').value.trim();
  const message = form.querySelector('#cf-message').value.trim();

  setFormState(form, submitBtn, FORM_STATE.LOADING);

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ turnstileToken, name, email, phone, subject, message }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      if (data.errors) {
        showFormBody(form);
        Object.entries(data.errors).forEach(([fieldName, msg]) => {
          const input = form.querySelector(`#cf-${fieldName}`);
          if (input) setFieldError(input, msg);
        });
        setFormState(form, submitBtn, FORM_STATE.IDLE);
        resetTurnstile();
        return;
      }

      const errorState = classifyError(res, data);
      const errorMessage = data.message || 'Não foi possível enviar sua mensagem no momento.';
      setFormState(form, submitBtn, errorState, { message: errorMessage });
      resetTurnstile();
      return;
    }

    setFormState(form, submitBtn, FORM_STATE.SUCCESS, {
      message: data.message || 'Em breve entrarei em contato. Obrigado pelo seu interesse!',
    });

    resetTurnstile();
  } catch (err) {
    setFormState(form, submitBtn, FORM_STATE.ERROR, {
      message: 'Não foi possível enviar sua mensagem no momento. Verifique sua conexão e tente novamente.',
    });
    resetTurnstile();
  }
};

const resetFormFully = (form, submitBtn) => {
  showFormBody(form);
  form.reset();

  form.querySelectorAll('.contact-form-input--error').forEach((el) => {
    setFieldError(el, null);
  });

  form.querySelectorAll('.contact-form-counter').forEach((counter) => {
    const fieldName = counter.dataset.field;
    const max = parseInt(counter.dataset.max, 10);
    const input = form.querySelector(`#cf-${fieldName}`);
    if (input) updateCounter(input, counter, max);
  });

  const feedback = form.querySelector('.contact-form-feedback');
  if (feedback) feedback.remove();

  resetTurnstile();
  setFormState(form, submitBtn, FORM_STATE.IDLE);
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

  form.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === 'reset') {
      resetFormFully(form, submitBtn);
    } else if (action === 'retry') {
      showFormBody(form);
      setFormState(form, submitBtn, FORM_STATE.IDLE);
      resetTurnstile();
    } else if (action === 'back') {
      showFormBody(form);
      setFormState(form, submitBtn, FORM_STATE.IDLE);
    } else if (action === 'close') {
      closeModal();
    }
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

    const resultPanel = form.querySelector('.contact-form-result-panel');
    if (resultPanel) {
      resultPanel.remove();
      showFormBody(form);
      setFormState(form, submitBtn, FORM_STATE.IDLE);
    }

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
