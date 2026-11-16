// Chamadas para ação: download do currículo (com efeito visual) e contato pelo WhatsApp para oportunidades na Europa.
import { dictionaries } from './i18n.js';

const getLang = () => localStorage.getItem('lang') || 'pt-BR';
const tr = (key) => (dictionaries[getLang()] || dictionaries['pt-BR'])[key] ?? dictionaries['pt-BR'][key];
const isReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Currículo: download direto + efeito ---------- */

const CV_FILL_MS = 800; // barra de progresso preenchendo o botão
const CV_DONE_MS = 2000; // "Baixado!" fica à mostra antes de voltar ao normal

const initCvDownload = () => {
  const btn = document.querySelector('.cv-download-btn');
  const live = document.getElementById('cv-announce');
  if (!btn) return;
  const label = btn.querySelector('.cv-label');
  let timers = [];

  const reset = () => {
    timers.forEach(clearTimeout);
    timers = [];
    btn.classList.remove('is-downloading', 'is-done');
    btn.style.minWidth = '';
    label.textContent = tr('cv.download.label');
  };

  // O download começa no próprio clique (link com atributo download); a animação é só visual
  btn.addEventListener('click', () => {
    reset();
    btn.style.minWidth = `${btn.offsetWidth}px`; // o botão não encolhe com o texto mais curto
    if (live) {
      live.textContent = '';
      requestAnimationFrame(() => { live.textContent = tr('cv.download.started'); });
    }
    const done = () => {
      btn.classList.remove('is-downloading');
      btn.classList.add('is-done');
      label.textContent = tr('cv.download.done');
      timers.push(setTimeout(reset, CV_DONE_MS));
    };
    if (isReduced()) { done(); return; }
    void btn.offsetWidth; // reinicia as animações se o clique se repetir
    btn.classList.add('is-downloading');
    timers.push(setTimeout(done, CV_FILL_MS));
  });

  document.addEventListener('site:lang', () => {
    label.textContent = tr(btn.classList.contains('is-done') ? 'cv.download.done' : 'cv.download.label');
  });
};

/* ---------- WhatsApp ---------- */

// O número não aparece legível no código: fica codificado e é montado só no clique
const WA = 'NjkzNjkxNzk5MTQ1NQ==';
const waNumber = () => atob(WA).split('').reverse().join('');

export const openWhatsApp = () => {
  const url = `https://wa.me/${waNumber()}?text=${encodeURIComponent(tr('wa.message'))}`;
  const win = window.open(url, '_blank', 'noopener,noreferrer');
  if (win) win.opener = null;
};

const initWhatsApp = () => {
  document.querySelectorAll('[data-whatsapp]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openWhatsApp();
    });
  });

  // Modal de contato: a caixa "Tenho uma oportunidade na Europa" revela o botão do WhatsApp
  const check = document.getElementById('cf-europe');
  const reveal = document.getElementById('cf-whatsapp');
  if (!check || !reveal) return;
  const sync = () => {
    const on = check.checked;
    reveal.classList.toggle('is-open', on);
    reveal.setAttribute('aria-hidden', String(!on));
    reveal.inert = !on;
  };
  check.addEventListener('change', sync);
  // form.reset() (enviar novamente / fechar) desmarca a caixa sem disparar change
  check.form?.addEventListener('reset', () => setTimeout(sync));
  sync();
};

export const initCta = () => {
  initCvDownload();
  initWhatsApp();
};
