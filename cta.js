// Chamadas para ação: download do currículo (com efeito visual) e contato pelo WhatsApp para oportunidades na Europa.
import { dictionaries } from './i18n.js';

const getLang = () => localStorage.getItem('lang') || 'pt-BR';
const tr = (key) => (dictionaries[getLang()] || dictionaries['pt-BR'])[key] ?? dictionaries['pt-BR'][key];
const isReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Currículo: animação e, ao fim dela, o download ---------- */

const CV_FILL_MS = 800; // seta descendo + barra de progresso até 100%
const CV_FIRE_MAX_MS = 880; // teto para disparar o download (dentro da janela de ativação do Safari/iOS)
const CV_DONE_MS = 2000; // "Baixado!" fica à mostra antes de voltar ao normal

const initCvDownload = () => {
  const btn = document.querySelector('.cv-download-btn');
  const live = document.getElementById('cv-announce');
  if (!btn) return;
  const label = btn.querySelector('.cv-label');
  const bar = btn.querySelector('.cv-progress');
  let timers = [];
  let busy = false; // animação ou "Baixado!" em andamento: novos cliques são ignorados
  let firing = false; // clique programático no próprio link (o download de verdade): passa direto

  const say = (key) => {
    if (!live) return;
    live.textContent = '';
    requestAnimationFrame(() => { live.textContent = tr(key); });
  };

  const reset = () => {
    timers.forEach(clearTimeout);
    timers = [];
    busy = false;
    btn.classList.remove('is-downloading', 'is-done');
    btn.style.minWidth = '';
    label.textContent = tr('cv.download.label');
  };

  const showDone = () => {
    btn.classList.remove('is-downloading');
    btn.classList.add('is-done');
    label.textContent = tr('cv.download.done');
    timers.push(setTimeout(reset, CV_DONE_MS));
  };

  // Download de verdade: clique programático no PRÓPRIO link (mesmo href e atributo download)
  const fire = () => {
    firing = true;
    btn.click();
    firing = false;
    say('cv.download.started');
    showDone();
  };

  btn.addEventListener('click', (e) => {
    if (firing) return; // o clique programático segue o comportamento nativo e baixa
    // Ctrl/Cmd/Shift/Alt + clique e botões que não o principal: comportamento nativo do navegador
    if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (busy) return; // durante a animação (ou o "Baixado!"), sem baixar duas vezes
    busy = true;
    timers.forEach(clearTimeout);
    timers = [];
    btn.style.minWidth = `${btn.offsetWidth}px`; // o botão não encolhe com o texto mais curto
    if (isReduced()) {
      fire(); // sem animação: baixa na hora e mostra "Baixado!"
      return;
    }
    say('cv.download.preparing');
    void btn.offsetWidth; // reinicia as animações
    btn.classList.add('is-downloading');
    // Dispara quando a barra chega a 100% (fim da animação), com um teto de segurança
    let fired = false;
    const go = () => {
      if (fired) return;
      fired = true;
      bar?.removeEventListener('animationend', onEnd);
      fire();
    };
    const onEnd = (ev) => { if (ev.animationName === 'cv-fill') go(); };
    bar?.addEventListener('animationend', onEnd);
    timers.push(setTimeout(go, CV_FIRE_MAX_MS));
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

  // Modal de contato: a caixa "Tenho uma oferta de emprego na Europa" revela o botão do WhatsApp
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
