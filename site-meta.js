import { dictionaries } from './i18n.js';

// Indicador de status ao vivo (seção "Como este site é feito") e linha de versão/último deploy no rodapé.
// Os dados de build vêm do Vite (define em vite.config.js), a partir das variáveis de sistema da Vercel.

/* global __APP_VERSION__, __BUILD_COMMIT__, __BUILD_DATE__, __BUILD_REPO__ */
const BUILD = {
  version: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '',
  commit: typeof __BUILD_COMMIT__ !== 'undefined' ? __BUILD_COMMIT__ : '',
  date: typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : '',
  repo: typeof __BUILD_REPO__ !== 'undefined' && __BUILD_REPO__ ? __BUILD_REPO__ : 'LeandroSevero/site-leandro',
};

const STATUS_REFRESH_MS = 5 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;

const getLocale = () => {
  try { return localStorage.getItem('lang') || 'pt-BR'; } catch { return 'pt-BR'; }
};
const t = (key, vars = {}) => {
  const dict = dictionaries[getLocale()] || dictionaries['pt-BR'];
  return (dict[key] || dictionaries['pt-BR'][key] || '').replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : ''));
};

/* ---------- Status ao vivo ---------- */

const statusState = { state: 'loading', checkedAt: null };

const renderStatus = () => {
  const box = document.getElementById('site-status');
  if (!box) return;
  const textEl = box.querySelector('.site-status-text');
  const timeEl = box.querySelector('.site-status-time');
  const { state, checkedAt } = statusState;
  box.dataset.state = state;
  textEl.removeAttribute('data-i18n'); // o texto passa a ser controlado por este módulo
  textEl.textContent = t(`build.status.${state}`);
  if ((state === 'operational' || state === 'degraded') && checkedAt) {
    const minutes = Math.max(0, Math.floor((Date.now() - checkedAt.getTime()) / 60000));
    timeEl.textContent = minutes < 1 ? t('build.status.checkedNow') : t('build.status.checkedMin', { n: minutes });
    timeEl.hidden = false;
  } else {
    timeEl.textContent = '';
    timeEl.hidden = true;
  }
};

const fetchStatus = async () => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch('/api/status', { headers: { Accept: 'application/json' }, signal: controller.signal });
    if (!res.ok) throw new Error('http');
    const data = await res.json();
    if (data.status !== 'operational' && data.status !== 'degraded') throw new Error('formato');
    const checkedAt = new Date(data.checkedAt);
    statusState.state = data.status;
    statusState.checkedAt = Number.isNaN(checkedAt.getTime()) ? new Date() : checkedAt;
  } catch {
    statusState.state = 'unavailable';
    statusState.checkedAt = null;
  } finally {
    clearTimeout(timer);
    renderStatus();
  }
};

/* ---------- Versão e último deploy (rodapé) ---------- */

const formatDate = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const parts = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric' }).formatToParts(d);
  const get = (type) => parts.find((p) => p.type === type)?.value || '';
  return getLocale() === 'en' ? `${get('year')}-${get('month')}-${get('day')}` : `${get('day')}/${get('month')}/${get('year')}`;
};

const renderBuild = () => {
  const el = document.getElementById('footer-build');
  if (!el) return;
  el.textContent = '';
  const version = BUILD.version ? `v${BUILD.version}` : 'dev';
  el.append(`${t('footer.version')} ${version} · `);

  if (!BUILD.commit) {
    el.append('dev'); // build local, sem as variáveis de sistema da Vercel
  } else {
    const short = BUILD.commit.slice(0, 7);
    const date = formatDate(BUILD.date);
    if (date) el.append(`${t('footer.lastDeploy')}: ${date} · `);
    el.append('commit ');
    const a = document.createElement('a');
    a.href = `https://github.com/${BUILD.repo}/commit/${BUILD.commit}`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'footer-commit';
    a.textContent = short;
    a.setAttribute('aria-label', t('footer.commitAria', { sha: short }));
    el.append(a);
  }
  el.hidden = false;
};

/* ---------- Inicialização ---------- */

export const initSiteMeta = () => {
  renderBuild();
  renderStatus();
  fetchStatus();
  setInterval(fetchStatus, STATUS_REFRESH_MS); // a CDN guarda a resposta por 5 min
  setInterval(renderStatus, 60 * 1000); // atualiza o "verificado há X min"
  document.addEventListener('site:lang', () => { renderStatus(); renderBuild(); });
};
