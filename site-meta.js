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
    if (isReduced() && term.body && !term.run?.disabled) fillTerminal();
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
const PULSE_GAP_MS = 1200; // pausa entre um ciclo completo e o próximo
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

const TRAIL_DOTS = 12; // círculos do rastro
const TRAIL_GAP = 6; // px entre eles ao longo da trilha

// Pulso = cabeça luminosa + rastro que se dissipa atrás dela
const makePulse = (kind) => {
  const g = document.createElementNS(SVG_NS, 'g');
  g.setAttribute('class', `flow-pulse flow-pulse-${kind}`);
  const trail = [];
  for (let i = 0; i < TRAIL_DOTS; i += 1) {
    const c = document.createElementNS(SVG_NS, 'circle');
    c.setAttribute('class', 'flow-trail');
    c.setAttribute('r', (4.5 * (1 - i / TRAIL_DOTS) + 0.8).toFixed(2));
    c.setAttribute('opacity', '0');
    trail.push(c);
    g.append(c);
  }
  const head = document.createElementNS(SVG_NS, 'g');
  const halo = document.createElementNS(SVG_NS, 'circle');
  halo.setAttribute('r', '16');
  halo.setAttribute('fill', 'url(#flow-pulse-grad)');
  const core = document.createElementNS(SVG_NS, 'circle');
  core.setAttribute('r', '4');
  core.setAttribute('class', 'flow-pulse-dot');
  head.append(halo, core);
  g.append(head);
  const path = kind === 'loop' ? flow.loop : flow.track;
  const start = path.getPointAtLength(0);
  head.setAttribute('transform', `translate(${start.x} ${start.y})`); // nasce no início da trilha, nunca na origem
  flow.pulseLayer.append(g);
  g._head = head;
  g._trail = trail;
  return g;
};

const placePulse = (p, path) => {
  const pt = path.getPointAtLength(p.d);
  p.el._head.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
  p.el._trail.forEach((c, i) => {
    const d = p.d - (i + 1) * TRAIL_GAP;
    if (d < 0) {
      c.setAttribute('opacity', '0');
      return;
    }
    const q = path.getPointAtLength(d);
    c.setAttribute('cx', q.x.toFixed(1));
    c.setAttribute('cy', q.y.toFixed(1));
    c.setAttribute('opacity', (0.42 * (1 - i / TRAIL_DOTS) ** 1.6).toFixed(3));
  });
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
    if (!flow.simulating && !flow.pulses.length) {
      flow.sinceSpawn += dt; // conta a pausa só depois que o ciclo anterior (trilha + laço) terminou
      if (flow.sinceSpawn >= PULSE_GAP_MS) {
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
        placePulse(p, flow.track);
      } else {
        if (p.d >= flow.loopLen) {
          p.el.remove();
          flow.loopLabel.classList.remove('is-active');
          if (!flow.simulating) lightStep(0, 500); // o laço volta a Código e fecha o ciclo
          return false;
        }
        placePulse(p, flow.loop);
        flow.loopLabel.classList.toggle('is-active', flow.simLoop || (p.d > flow.loopLen * 0.35 && p.d < flow.loopLen * 0.65));
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

/* ---------- Simulação de publicação com terminal narrado ---------- */

// Destaque rápido em Produção e uma piscada verde no status do painel
const celebrate = () => {
  if (isReduced()) return;
  const prod = flow.nodes[flow.nodes.length - 1];
  prod.classList.remove('is-celebrate');
  void prod.offsetWidth; // reinicia a animação
  prod.classList.add('is-celebrate');
  setTimeout(() => prod.classList.remove('is-celebrate'), 1300);
  const status = document.getElementById('live-status');
  if (status && status.dataset.state === 'operational') {
    status.classList.remove('is-flash');
    void status.offsetWidth;
    status.classList.add('is-flash');
    setTimeout(() => status.classList.remove('is-flash'), 1200);
  }
};

// Roteiro: 5 etapas do pipeline + observabilidade. A linha final da observabilidade usa dados reais.
const script = () => {
  const v = VERSION_LABEL;
  const stages = [0, 1, 2, 3, 4].map((i) => ({
    step: i,
    head: `[${i + 1}/5] ${t(`site.step.${i}`)}`,
    stage: t(`site.stage.${i}`),
    lines: [1, 2, 3].map((n) => t(`site.sim.${i}.${n}`, { v })).filter(Boolean),
    ok: t(`site.sim.${i}.ok`, { v }),
  }));
  stages.push({
    step: 'loop',
    head: `[∞] ${t('site.loop')}`,
    stage: t('site.stage.loop'),
    lines: [t('site.sim.loop.1'), t('site.sim.loop.2')],
    ok: null, // preenchida com o status real
  });
  return stages;
};

// Linha final da observabilidade a partir do status real (/api/status) e do tempo medido no navegador
const statusLine = () => {
  if (live.state === 'operational' || live.state === 'degraded') {
    const label = t(`site.sim.status.${live.state}`);
    return { text: live.latency != null ? `${label} · ${t('site.sim.responded', { n: live.latency })}` : label, kind: live.state === 'operational' ? 'ok' : 'warn' };
  }
  return { text: t('site.sim.status.unavailable'), kind: 'warn' };
};

const term = { body: null, run: null, runText: null, bar: null, stageEl: null, announceEl: null, token: 0 };

const totalRows = () => script().reduce((n, s) => n + 2 + s.lines.length, 0) + 1; // cabeçalho + linhas + ok, e a final

const setProgress = (done) => {
  const pct = Math.min(100, Math.round((done / totalRows()) * 100));
  term.bar.style.width = `${pct}%`;
};

const setStage = (name, text) => {
  term.stageEl.textContent = '';
  if (name) {
    const b = document.createElement('strong');
    b.textContent = `${name}: `;
    term.stageEl.append(b);
  }
  term.stageEl.append(text);
};

// Anúncio para leitores de tela: só cabeçalhos das etapas e o resultado final
const announce = (text) => { term.announceEl.textContent = text; };

const scrollTerminal = () => { term.body.scrollTop = term.body.scrollHeight; };

const addRow = (kind, text = '') => {
  const row = document.createElement('div');
  row.className = `flow-term-row flow-term-${kind}`;
  if (kind === 'cmd') {
    const prompt = document.createElement('span');
    prompt.className = 'flow-term-prompt';
    prompt.textContent = '> ';
    row.append(prompt);
  } else if (kind === 'ok' || kind === 'warn') {
    const mark = document.createElement('span');
    mark.className = 'flow-term-mark';
    mark.textContent = kind === 'ok' ? '✓ ' : '! ';
    row.append(mark);
  }
  const txt = document.createElement('span');
  txt.textContent = text;
  row.append(txt);
  term.body.append(row);
  scrollTerminal();
  return txt;
};

// Estado ocioso: uma linha discreta convidando a simular
const idleTerminal = () => {
  term.body.textContent = '';
  const row = addRow('idle', `> ${t('site.term.idle')}`);
  row.parentElement.classList.add('flow-term-idle');
  setStage('', t('site.stage.idle'));
  setProgress(0);
  term.idle = true;
};

// Tudo preenchido de uma vez (movimento reduzido ou troca de idioma depois de simular)
const fillTerminal = () => {
  term.idle = false;
  term.body.textContent = '';
  for (const s of script()) {
    addRow('head', s.head);
    s.lines.forEach((l) => addRow('cmd', l));
    if (s.ok) addRow('ok', s.ok);
    else { const st = statusLine(); addRow(st.kind, st.text); }
  }
  addRow('final', t('site.sim.final'));
  setStage(t('site.sim.doneLabel'), t('site.stage.done'));
  setProgress(totalRows());
};

const wait = (ms, token) => new Promise((resolve, reject) => {
  setTimeout(() => (token === term.token ? resolve() : reject(new Error('cancelado'))), ms);
});

const CHAR_MS = 13; // digitação
const MIN_RUN_MS = 12800; // a simulação completa nunca termina antes de ~12,8s (faixa pedida: 12 a 15s)
const SPIN_MS = 300; // linha "em execução" com spinner
const typeText = async (span, text, token) => {
  for (const ch of text) {
    span.textContent += ch;
    await wait(CHAR_MS, token);
  }
};

const spin = async (span, token) => {
  const s = document.createElement('span');
  s.className = 'flow-spinner';
  s.setAttribute('aria-hidden', 'true');
  span.after(s);
  scrollTerminal();
  try {
    await wait(SPIN_MS, token);
  } finally {
    s.remove();
  }
};

// Envia um pulso da etapa anterior até a etapa alvo; a etapa acende quando o pulso chega.
const pulseTo = (stepIndex, token) => new Promise((resolve) => {
  if (!flow.running) startLoop();
  const from = flow.stepAt[Math.max(0, stepIndex - 1)] || 0;
  const dist = (flow.stepAt[stepIndex] || 0) - from;
  // chega em ~0,45s, qualquer que seja a distância entre as etapas (desktop ou celular)
  const speed = Math.max(1.6, dist / (PULSE_SPEED * 450));
  const pulse = { kind: 'track', d: from, el: makePulse('track'), lit: Math.max(-1, stepIndex - 1), speed };
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

const finishRun = () => {
  term.run.disabled = false;
  term.run.removeAttribute('aria-busy');
  term.ran = true;
  term.runText.textContent = t('site.runAgain');
  if (document.activeElement === document.body) term.run.focus({ preventScroll: true });
};

const simulate = async () => {
  term.token += 1;
  const token = term.token;
  term.run.setAttribute('aria-busy', 'true');
  term.runText.textContent = t('site.running');
  term.run.disabled = true;

  if (isReduced()) {
    await fetchStatus();
    if (token !== term.token) return;
    fillTerminal();
    applyStatic();
    announce(t('site.sim.final'));
    finishRun();
    return;
  }

  flow.simulating = true;
  resetPulses();
  clearSteps();
  term.body.textContent = '';
  term.idle = false;
  let done = 0;
  const tick = () => { done += 1; setProgress(done); };
  const startedAt = performance.now();
  setProgress(0);
  try {
    for (const s of script()) {
      const isLoop = s.step === 'loop';
      setStage(isLoop ? t('site.loop') : t(`site.step.${s.step}`), s.stage);
      announce(s.head);
      addRow('head', s.head);
      tick();
      // O pulso avança junto com a narração; a etapa acende quando ele chega
      if (isLoop) {
        flow.simLoop = true; // o selo fica aceso durante toda a narração da observabilidade
        flow.loopLabel.classList.add('is-active');
        // percorre o laço de Produção de volta a Código em ~2,6s, junto com a narração
        flow.pulses.push({ kind: 'loop', d: 0, el: makePulse('loop'), speed: Math.max(1, flow.loopLen / (PULSE_SPEED * 2600)) });
      } else if (s.step === 0) {
        flow.nodes[0].classList.add('is-active');
      } else {
        pulseTo(s.step, token);
      }
      for (const line of s.lines) {
        const span = addRow('cmd');
        await typeText(span, line, token);
        await spin(span, token);
        tick();
      }
      let okText = s.ok;
      let kind = 'ok';
      if (isLoop) {
        await fetchStatus(); // status e tempo de resposta reais, também atualizam o painel
        if (token !== term.token) return;
        ({ text: okText, kind } = statusLine());
      }
      addRow(kind, okText);
      tick();
      if (isLoop) {
        flow.simLoop = false;
        flow.loopLabel.classList.remove('is-active');
      } else {
        flow.nodes[s.step].classList.remove('is-active');
        flow.nodes[s.step].classList.add('is-done');
      }
      await wait(220, token);
    }
    const remaining = MIN_RUN_MS - (performance.now() - startedAt);
    if (remaining > 0) await wait(remaining, token);
    addRow('final', t('site.sim.final'));
    tick();
    setStage(t('site.sim.doneLabel'), t('site.stage.done'));
    announce(t('site.sim.final'));
    celebrate();
    await wait(1600, token);
  } catch {
    flow.simLoop = false;
    return; // simulação reiniciada ou interrompida
  }
  flow.simulating = false;
  flow.sinceSpawn = 0;
  flow.nodes.forEach((n) => n.classList.remove('is-done'));
  finishRun();
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
  term.bar = document.getElementById('flow-progress-bar');
  term.stageEl = document.getElementById('flow-stage');
  term.announceEl = document.getElementById('flow-announce');

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

  // Tooltip e pausa sem estado fixo: mouse (enter/leave), teclado (focus/blur) e toque (some sozinho).
  // Clique não seleciona nada: o botão não guarda foco nem classe de "ativo".
  const pausers = [...flow.nodes, flow.loopLabel];
  const TOUCH_TIP_MS = 3000;
  const shown = new Map(); // etapa -> motivos (mouse, foco, toque)
  let touchTimer = 0;
  let touchScrollY = 0; // posição da página quando o tooltip de toque abriu
  const holderOf = (el) => el.closest('.flow-step, .flow-loop-wrap');
  const setTip = (el, reason, on) => {
    const reasons = shown.get(el) || new Set();
    if (on) reasons.add(reason); else reasons.delete(reason);
    if (reasons.size) shown.set(el, reasons); else shown.delete(el);
    holderOf(el).classList.toggle('is-tip', reasons.size > 0);
    flow.paused = shown.size > 0;
    flow.root.classList.toggle('is-paused', flow.paused);
  };
  const clearTouch = () => {
    clearTimeout(touchTimer);
    pausers.forEach((el) => setTip(el, 'touch', false));
  };

  pausers.forEach((el) => {
    const holder = holderOf(el);
    holder.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') setTip(el, 'mouse', true); });
    holder.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') setTip(el, 'mouse', false); });
    // Clique com mouse ou toque não deixa o botão focado (o foco fixava o tooltip)
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); });
    el.addEventListener('pointerup', (e) => {
      if (e.pointerType === 'mouse') return;
      const wasOpen = shown.get(el)?.has('touch');
      clearTouch();
      if (!wasOpen) {
        setTip(el, 'touch', true);
        touchScrollY = window.scrollY;
        touchTimer = setTimeout(clearTouch, TOUCH_TIP_MS);
      }
    });
    // Teclado: aparece no foco e some no blur
    el.addEventListener('focus', () => setTip(el, 'focus', true));
    el.addEventListener('blur', () => setTip(el, 'focus', false));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setTip(el, 'focus', false);
    });
  });
  // Toque fora ou rolagem fecham o tooltip de toque
  document.addEventListener('pointerdown', (e) => {
    if (!pausers.some((el) => el.contains(e.target))) clearTouch();
  }, { passive: true });
  // Só rolagem real fecha: ajustes mínimos do navegador (imagens carregando, barra de endereço) não contam
  window.addEventListener('scroll', () => {
    if (shown.size && Math.abs(window.scrollY - touchScrollY) > 12) clearTouch();
  }, { passive: true });

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
      announce('');
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
