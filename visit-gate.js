import { dictionaries } from './i18n.js';
import { TURNSTILE_SITE_KEY, loadTurnstileScript, getTurnstileTheme } from './turnstile.js';

const COOKIE_NAME = 'ls_verified';
const CRAWLER_UA = /bot|crawler|spider|crawling|slurp|facebookexternalhit|whatsapp|telegram|discord|embedly|preview|lighthouse/i;

// Códigos 110xxx/400xxx da Cloudflare indicam erro de configuração (sitekey, hostname): não bloquear o visitante.
const CONFIG_ERROR = /^(110|400)\d{3}$/;

const getLang =() => localStorage.getItem('lang') || 'pt-BR';
const t = (key) => (dictionaries[getLang()] || dictionaries['pt-BR'])[key] || '';

const isVerified = () => document.cookie.split('; ').includes(`${COOKIE_NAME}=1`);

export const initVisitGate = () => {
  const root = document.documentElement;
  const gate = document.getElementById('visit-gate');
  const widget = document.getElementById('visit-gate-widget');
  const status = document.getElementById('visit-gate-status');
  const retryBtn = document.getElementById('visit-gate-retry');
  const pageRegions = [...document.body.children].filter((el) => el !== gate && el.tagName !== 'SCRIPT');

  const release = () => {
    pageRegions.forEach((el) => el.removeAttribute('inert'));
    root.classList.remove('gate-pending');
    if (!gate) return;
    gate.classList.add('visit-gate--done');
    setTimeout(() => gate.remove(), 400);
  };

  if (!gate || !widget || isVerified() || !TURNSTILE_SITE_KEY || CRAWLER_UA.test(navigator.userAgent)) {
    release();
    return;
  }

  root.classList.add('gate-pending');
  pageRegions.forEach((el) => el.setAttribute('inert', ''));
  gate.removeAttribute('hidden');

  let widgetId = null;

  const setStatus = (key) => {
    status.textContent = key ? t(key) : '';
    gate.classList.toggle('visit-gate--error', key === 'gate.error');
    retryBtn.hidden = key !== 'gate.error';
  };

  const showError = () => setStatus('gate.error');

  const confirmToken = async (token) => {
    let res;
    try {
      res = await fetch('/api/verify-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
    } catch {
      release();
      return;
    }
    if (res.status === 400) {
      showError();
      return;
    }
    release();
  };

  retryBtn.addEventListener('click', () => {
    setStatus(null);
    if (window.turnstile && widgetId !== null) window.turnstile.reset(widgetId);
  });

  loadTurnstileScript()
    .then(() => {
      widgetId = window.turnstile.render(widget, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: getTurnstileTheme(),
        language: getLang() === 'en' ? 'en' : 'pt-br',
        callback: confirmToken,
        'before-interactive-callback': () => setStatus('gate.challenge'),
        'error-callback': (code) => {
          if (CONFIG_ERROR.test(String(code))) release();
          else showError();
          return true;
        },
        'expired-callback': () => window.turnstile.reset(widgetId),
        'timeout-callback': () => window.turnstile.reset(widgetId),
      });
    })
    .catch(release);
};
