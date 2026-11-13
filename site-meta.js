import { dictionaries } from './i18n.js';

// Seção "Sobre o site" (fluxo animado, simulação de deploy e painel ao vivo) e linha de versão no rodapé.
// Versão e data do deploy vêm do Vite (define em vite.config.js). Somente dados reais: nada de métricas inventadas.

/* global __APP_VERSION__, __BUILD_DATE__ */
const BUILD = {
  version: typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '',
  date: typeof __BUILD_DATE__ !== 'undefined' ? __BUILD_DATE__ : '',
};
const VERSION_LABEL = BUILD.version ? `v${BUILD.version}` : 'dev';

const STATUS_REFRESH_MS = 5 * 60 * 1000;
const FETCH_TIMEOUT_MS = 8000;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const isReduced = () => reducedMotion.matches;

const getLocale = () => {
  try { return localStorage.getItem('lang') || 'pt-BR'; } catch { return 'pt-BR'; }
};
const t = (key, vars = {}) => {
  const dict = dictionaries[getLocale()] || dictionaries['pt-BR'];
  return (dict[key] || dictionaries['pt-BR'][key] || '').replace(/\{(\w+)\}/g, (_, k) => (k in vars ? vars[k] : ''));
};

const formatDate = (iso) => {
  const d = new Date(iso);
  if (!iso || Number.isNaN(d.getTime())) return '';
  const parts = new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit', year: 'numeric' }).formatToParts(d);
  const get = (type) => parts.find((p) => p.type === type)?.value || '';
  return getLocale() === 'en' ? `${get('month')}/${get('day')}/${get('year')}` : `${get('day')}/${get('month')}/${get('year')}`;
};

/* =========================================================
   Painel ao vivo: status real, tempo de resposta medido no navegador, versão e data do deploy
   ========================================================= */

const live = { state: 'loading', latency: null, shownLatency: 0 };

const renderStatus = () => {
  const box = document.getElementById('live-status');
  const text = document.getElementById('live-status-text');
  if (!box || !text) return;
  box.dataset.state = live.state;
  text.textContent = t(`site.status.${live.state}`);
};

let latencyRaf = 0;
const renderLatency = (animate = false) => {
  const el = document.getElementById('live-latency');
  if (!el) return;
  cancelAnimationFrame(latencyRaf);
  if (live.latency == null) {
    el.textContent = '-';
    return;
  }
  const target = live.latency;
  const write = (n) => { el.textContent = t('site.live.ms', { n }); };
  if (!animate || isReduced()) {
    live.shownLatency = target;
    write(target);
    return;
  }
  const from = live.shownLatency || 0;
  const start = performance.now();
  const dur = 900;
  const step = (now) => {
    const p = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    const v = Math.round(from + (target - from) * eased);
    live.shownLatency = v;
    write(v);
    if (p < 1) latencyRaf = requestAnimationFrame(step);
  };
  latencyRaf = requestAnimationFrame(step);
};

const renderBuildInfo = () => {
  const v = document.getElementById('live-version');
  const u = document.getElementById('live-updated');
  if (v) v.textContent = VERSION_LABEL;
  if (u) u.textContent = formatDate(BUILD.date) || 'dev';
};

const fetchStatus = async () => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  const t0 = performance.now();
  try {
    const res = await fetch('/api/status', { headers: { Accept: 'application/json' }, cache: 'no-store', signal: controller.signal });
    if (!res.ok) throw new Error('http');
    const data = await res.json();
    if (data.status !== 'operational' && data.status !== 'degraded') throw new Error('formato');
    live.latency = Math.max(1, Math.round(performance.now() - t0));
    live.state = data.status;
  } catch {
    live.state = 'unavailable';
    live.latency = null;
  } finally {
    clearTimeout(timer);
    renderStatus();
    renderLatency(true);
  }
};

/* =========================================================
   Rodapé: "v2.3.0 · Atualizado em DD/MM/AAAA"
   ========================================================= */

const renderFooter = () => {
  const el = document.getElementById('footer-build');
  if (!el) return;
  const date = formatDate(BUILD.date);
  el.textContent = date ? `${VERSION_LABEL} · ${t('footer.updated', { date })}` : `${VERSION_LABEL} · dev`;
  el.hidden = false;
};

/* =========================================================
   Fluxo animado: trilha SVG, pulsos de luz, etapas que acendem e laço de observabilidade
   ========================================================= */

const SVG_NS = 'http://www.w3.org/2000/svg';
const PULSE_SPEED = 0.16; // px por ms ao longo da trilha
const PULSE_GAP_MS = 2600; // intervalo entre pulsos no modo contínuo
const STEP_LIT_MS = 900; // tempo que uma etapa fica acesa depois que o pulso passa

const flow = {
  root: null, svg: null, track: null, loop: null, pulseLayer: null,
  nodes: [], loopLabel: null,
  trackLen: 0, loopLen: 0, stepAt: [],
  pulses: [], visible: false, paused: false, running: false,
  raf: 0, last: 0, sinceSpawn: PULSE_GAP_MS, simulating: false,
  vertical: false,
};

const center = (el, base) => {
  const r = el.getBoundingClientRect();
  return { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2 };
};

// Recalcula a trilha (entre os centros das etapas) e o laço (de Produção de volta para Código).
const layoutFlow = () => {
  const { root, svg, track, loop, nodes, loopLabel } = flow;
  if (!root) return;
  const base = root.getBoundingClientRect();
  svg.setAttribute('viewBox', `0 0 ${Math.round(base.width)} ${Math.round(base.height)}`);
  svg.setAttribute('width', Math.round(base.width));
  svg.setAttribute('height', Math.round(base.height));

  const dots = nodes.map((n) => center(n.querySelector('.flow-dot'), base));
  const first = dots[0];
  const last = dots[dots.length - 1];
  flow.vertical = Math.abs(last.y - first.y) > Math.abs(last.x - first.x);

  track.setAttribute('d', dots.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' '));
  flow.trackLen = track.getTotalLength();

  // Distância de cada etapa ao longo da trilha
  let acc = 0;
  flow.stepAt = dots.map((p, i) => {
    if (i) acc += Math.hypot(p.x - dots[i - 1].x, p.y - dots[i - 1].y);
    return acc;
  });

  // Laço: sai de Produção, passa pelo selo "Observabilidade" e volta para Código
  // (abaixo das etapas no desktop; à esquerda delas no layout vertical)
  const lbl = loopLabel.getBoundingClientRect();
  const r = 22; // raio das curvas
  let d;
  if (!flow.vertical) {
    const y = lbl.top - base.top + lbl.height / 2;
    const yLast = nodes[nodes.length - 1].getBoundingClientRect().bottom - base.top + 6;
    const yFirst = nodes[0].getBoundingClientRect().bottom - base.top + 6;
    d = `M${last.x} ${yLast} L${last.x} ${y - r} Q${last.x} ${y} ${last.x - r} ${y} L${first.x + r} ${y} Q${first.x} ${y} ${first.x} ${y - r} L${first.x} ${yFirst}`;
  } else {
    const x = lbl.left - base.left + lbl.width / 2;
    const dotR = nodes[0].querySelector('.flow-dot').getBoundingClientRect().width / 2 + 4;
    d = `M${last.x - dotR} ${last.y} L${x + r} ${last.y} Q${x} ${last.y} ${x} ${last.y - r} L${x} ${first.y + r} Q${x} ${first.y} ${x + r} ${first.y} L${first.x - dotR} ${first.y}`;
  }
  loop.setAttribute('d', d);
  flow.loopLen = loop.getTotalLength();
};

const makePulse = (kind) => {
  const g = document.createElementNS(SVG_NS, 'g');
  g.setAttribute('class', `flow-pulse flow-pulse-${kind}`);
  const start = (kind === 'loop' ? flow.loop : flow.track).getPointAtLength(0);
  g.setAttribute('transform', `translate(${start.x} ${start.y})`); // nasce no início da trilha, nunca na origem
  const halo = document.createElementNS(SVG_NS, 'circle');
  halo.setAttribute('r', kind === 'loop' ? '9' : '14');
  halo.setAttribute('fill', 'url(#flow-pulse-grad)');
  const core = document.createElementNS(SVG_NS, 'circle');
  core.setAttribute('r', kind === 'loop' ? '2.5' : '3.5');
  core.setAttribute('class', 'flow-pulse-dot');
  g.append(halo, core);
  flow.pulseLayer.append(g);
  return g;
};

const spawnPulse = (onDone) => {
  flow.pulses.push({ kind: 'track', d: 0, el: makePulse('track'), lit: -1, onDone });
};

const lightStep = (i, ms = STEP_LIT_MS) => {
  const node = flow.nodes[i];
  if (!node) return;
  node.classList.add('is-active');
  clearTimeout(node._litTimer);
  node._litTimer = setTimeout(() => node.classList.remove('is-active'), ms);
};

const clearSteps = () => flow.nodes.forEach((n) => { clearTimeout(n._litTimer); n.classList.remove('is-active', 'is-done'); });

const tick = (now) => {
  const dt = Math.min(64, now - (flow.last || now));
  flow.last = now;
  if (!flow.paused) {
    if (!flow.simulating) {
      flow.sinceSpawn += dt;
      if (flow.sinceSpawn >= PULSE_GAP_MS && !flow.pulses.some((p) => p.kind === 'track')) {
        flow.sinceSpawn = 0;
        spawnPulse();
      }
    }
    flow.pulses = flow.pulses.filter((p) => {
      if (p.dead) {
        p.el.remove();
        return false;
      }
      p.d += PULSE_SPEED * dt * (p.speed || 1);
      if (p.kind === 'track') {
        while (p.lit + 1 < flow.stepAt.length && p.d >= flow.stepAt[p.lit + 1]) {
          p.lit += 1;
          if (p.onStep) p.onStep(p.lit); else lightStep(p.lit);
        }
        if (p.d >= flow.trackLen) {
          p.el.remove();
          if (p.onDone) p.onDone();
          if (!flow.simulating) flow.pulses.push({ kind: 'loop', d: 0, el: makePulse('loop') });
          return false;
        }
        const pt = flow.track.getPointAtLength(p.d);
        p.el.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
      } else {
        if (p.d >= flow.loopLen) {
          p.el.remove();
          return false;
        }
        const pt = flow.loop.getPointAtLength(p.d);
        p.el.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
        flow.loopLabel.classList.toggle('is-active', p.d > flow.loopLen * 0.35 && p.d < flow.loopLen * 0.65);
      }
      return true;
    });
  }
  flow.raf = requestAnimationFrame(tick);
};

const startLoop = () => {
  if (flow.running || isReduced()) return;
  flow.running = true;
  flow.last = 0;
  flow.raf = requestAnimationFrame(tick);
};
const stopLoop = () => {
  flow.running = false;
  cancelAnimationFrame(flow.raf);
};

const resetPulses = () => {
  flow.pulses.forEach((p) => p.el.remove());
  flow.pulses = [];
  flow.loopLabel.classList.remove('is-active');
};

// Estado estático para quem prefere menos movimento: todas as etapas concluídas.
const applyStatic = () => {
  stopLoop();
  resetPulses();
  flow.nodes.forEach((n) => { clearTimeout(n._litTimer); n.classList.remove('is-active'); n.classList.add('is-done'); });
};

/* ---------- Simulação de deploy com mini terminal ---------- */

const terminalLines = () => [
  { text: t('site.term.start', { v: VERSION_LABEL }) },
  { text: t('site.term.step', { s: t('site.term.validation') }), ok: t('site.term.ok'), step: 1 },
  { text: t('site.term.step', { s: t('site.term.staging') }), ok: t('site.term.ok'), step: 2 },
  { text: t('site.term.step', { s: t('site.term.approval') }), ok: t('site.term.ok'), step: 3 },
  { text: t('site.term.step', { s: t('site.term.production') }), ok: t('site.term.live'), step: 4 },
  { text: t('site.term.monitoring'), loop: true },
];

const term = { body: null, run: null, runText: null, token: 0 };

// Estado ocioso: uma linha discreta convidando a simular
const idleTerminal = () => {
  term.body.textContent = '';
  const row = document.createElement('span');
  row.className = 'flow-term-idle';
  row.textContent = `> ${t('site.term.idle')}`;
  term.body.append(row);
  term.idle = true;
};

const fillTerminal = () => {
  term.idle = false;
  term.body.textContent = terminalLines().map((l) => `> ${l.text}${l.ok ? ` ${l.ok}` : ''}`).join('\n');
};

const wait = (ms, token) => new Promise((resolve, reject) => {
  setTimeout(() => (token === term.token ? resolve() : reject(new Error('cancelado'))), ms);
});

const typeText = async (span, text, token) => {
  for (const ch of text) {
    span.textContent += ch;
    await wait(22, token);
  }
};

// Envia um pulso de Código até a etapa alvo e resolve quando ele chega.
const pulseTo = (stepIndex, token) => new Promise((resolve) => {
  if (!flow.running) startLoop();
  const pulse = { kind: 'track', d: flow.stepAt[Math.max(0, stepIndex - 1)] || 0, el: makePulse('track'), lit: Math.max(-1, stepIndex - 1), speed: 1.6 };
  pulse.onStep = (i) => {
    if (pulse.dead || token !== term.token) return;
    flow.nodes[i].classList.add('is-active');
    if (i >= stepIndex) {
      pulse.dead = true; // encerra o pulso na etapa alvo, sem passar pelas próximas
      resolve();
    }
  };
  pulse.onDone = () => resolve();
  flow.pulses.push(pulse);
});

const simulate = async () => {
  term.token += 1;
  const token = term.token;
  term.run.setAttribute('aria-busy', 'true');
  term.runText.textContent = t('site.running');
  term.run.disabled = true;

  if (isReduced()) {
    fillTerminal();
    applyStatic();
    term.run.disabled = false;
    term.run.removeAttribute('aria-busy');
    term.runText.textContent = t('site.run');
    return;
  }

  flow.simulating = true;
  resetPulses();
  clearSteps();
  term.body.textContent = '';
  term.idle = false;
  try {
    for (const line of terminalLines()) {
      const row = document.createElement('span');
      row.className = 'flow-term-line';
      term.body.append(row);
      const prompt = document.createElement('span');
      prompt.className = 'flow-term-prompt';
      prompt.textContent = '> ';
      const txt = document.createElement('span');
      row.append(prompt, txt);
      if (line.step === undefined && !line.loop) {
        flow.nodes[0].classList.add('is-active');
        await typeText(txt, line.text, token);
        flow.nodes[0].classList.remove('is-active');
        flow.nodes[0].classList.add('is-done');
      } else if (line.step !== undefined) {
        await typeText(txt, line.text, token);
        await pulseTo(line.step, token);
        await wait(350, token);
        const ok = document.createElement('span');
        ok.className = line.step === 4 ? 'flow-term-live' : 'flow-term-ok';
        ok.textContent = ` ${line.ok}`;
        row.append(ok);
        flow.nodes[line.step].classList.remove('is-active');
        flow.nodes[line.step].classList.add('is-done');
      } else {
        await typeText(txt, line.text, token);
        flow.pulses.push({ kind: 'loop', d: 0, el: makePulse('loop'), speed: 1.4 });
      }
      term.body.append('\n');
      await wait(180, token);
    }
    await wait(2200, token);
  } catch {
    return; // simulação reiniciada ou interrompida
  }
  flow.simulating = false;
  flow.sinceSpawn = 0;
  flow.nodes.forEach((n) => n.classList.remove('is-done'));
  term.run.disabled = false;
  term.run.removeAttribute('aria-busy');
  term.ran = true;
  term.runText.textContent = t('site.runAgain');
  if (document.activeElement === document.body) term.run.focus({ preventScroll: true });
};

/* ---------- Inicialização do fluxo ---------- */

const initFlow = () => {
  flow.root = document.getElementById('flow');
  if (!flow.root) return;
  flow.svg = document.getElementById('flow-svg');
  flow.track = document.getElementById('flow-track');
  flow.loop = document.getElementById('flow-loop');
  flow.pulseLayer = document.getElementById('flow-pulses');
  flow.nodes = [...flow.root.querySelectorAll('.flow-node')];
  flow.loopLabel = document.getElementById('flow-loop-label');
  term.body = document.getElementById('flow-terminal-body');
  term.run = document.getElementById('flow-run');
  term.runText = document.getElementById('flow-run-text');

  layoutFlow();
  let resizeTimer = 0;
  const relayout = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      layoutFlow();
      resetPulses();
    }, 120);
  };
  window.addEventListener('resize', relayout);
  if ('ResizeObserver' in window) new ResizeObserver(relayout).observe(flow.root);

  // Hover ou foco em uma etapa pausa o fluxo (o tooltip aparece via CSS)
  const pausers = [...flow.nodes, flow.loopLabel];
  const hovered = new Set();
  const updatePause = () => {
    flow.paused = hovered.size > 0;
    flow.root.classList.toggle('is-paused', flow.paused);
  };
  pausers.forEach((el) => {
    const step = el.closest('.flow-step, .flow-loop-wrap');
    step.addEventListener('pointerenter', () => { hovered.add(el); updatePause(); });
    step.addEventListener('pointerleave', () => { hovered.delete(el); updatePause(); });
    el.addEventListener('focus', () => { hovered.add(`f${pausers.indexOf(el)}`); updatePause(); });
    el.addEventListener('blur', () => { hovered.delete(`f${pausers.indexOf(el)}`); updatePause(); });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') el.blur();
    });
  });

  // Anima só quando a seção está visível
  const io = new IntersectionObserver((entries) => {
    flow.visible = entries.some((e) => e.isIntersecting);
    if (flow.visible) {
      layoutFlow();
      startLoop();
    } else if (!flow.simulating) {
      stopLoop();
    }
  }, { threshold: 0.15 });
  io.observe(flow.root);

  term.run.addEventListener('click', simulate);

  const applyMotionPref = () => {
    if (isReduced()) {
      applyStatic();
      fillTerminal();
    } else {
      flow.nodes.forEach((n) => n.classList.remove('is-done'));
      idleTerminal();
      if (flow.visible) startLoop();
    }
  };
  applyMotionPref();
  reducedMotion.addEventListener?.('change', applyMotionPref);

  document.addEventListener('site:lang', () => {
    if (!term.run.disabled) {
      // Sem simulação em andamento: reescreve o terminal no novo idioma
      if (isReduced() || term.ran) fillTerminal(); else idleTerminal();
      term.runText.textContent = t(term.ran && !isReduced() ? 'site.runAgain' : 'site.run');
    }
    requestAnimationFrame(layoutFlow);
  });
};

/* =========================================================
   Inicialização
   ========================================================= */

export const initSiteMeta = () => {
  renderFooter();
  renderBuildInfo();
  renderStatus();
  renderLatency();
  fetchStatus();
  setInterval(fetchStatus, STATUS_REFRESH_MS);
  initFlow();
  document.addEventListener('site:lang', () => {
    renderStatus();
    renderLatency();
    renderBuildInfo();
    renderFooter();
  });
};
