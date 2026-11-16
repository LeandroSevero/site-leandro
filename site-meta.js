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
   Fluxo animado: trilha SVG de borda a borda, pulsos de luz, anel de carregamento em cada etapa
   e laço de observabilidade. O pulso nunca passa por dentro dos círculos: ele para na borda de uma
   etapa, o anel carrega ao redor dela e, ao completar, um novo pulso sai pela borda do lado oposto.
   ========================================================= */

const SVG_NS = 'http://www.w3.org/2000/svg';
const PULSE_SPEED = 0.16; // px por ms ao longo da trilha
const MIN_HOP_MS = 420; // duração mínima de um pulso entre duas etapas
const LOAD_MS = 700; // carregamento do anel de cada etapa no fluxo contínuo
const LOOP_MS = 3000; // tempo do laço de Produção de volta a Código no fluxo contínuo
const CYCLE_GAP_MS = 1100; // etapas concluídas ficam à mostra antes de um novo ciclo
const RING_VIEW = 80; // viewBox do anel
const RING_R = 37; // raio do anel no viewBox
const RING_STROKE = 3;

const flow = {
  root: null, svg: null, track: null, loop: null, pulseLayer: null,
  nodes: [], arcs: [], loopLabel: null,
  segs: [], loopLen: 0, edgeR: 0,
  pulses: [], visible: false, paused: false, running: false,
  raf: 0, last: 0, simulating: false, vertical: false,
  // ciclo contínuo: 'gap' (pausa entre ciclos), 'load' (anel carregando), 'travel' (pulso na trilha)
  cycle: { phase: 'gap', step: 0, p: 0, wait: CYCLE_GAP_MS - 400 },
  sim: null, // carregamento conduzido pela narração do "Simular publicação"
};

const center = (el, base) => {
  const r = el.getBoundingClientRect();
  return { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2 };
};
const f1 = (n) => n.toFixed(1);

// Recalcula os segmentos da trilha (da borda de uma etapa à borda da seguinte) e o laço
// (da borda de saída de Produção até a borda de entrada de Código).
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

  // Borda externa do anel: é ali que a trilha termina e recomeça
  const ring = nodes[0].querySelector('.flow-ring').getBoundingClientRect();
  const R = (ring.width / 2) * ((RING_R + RING_STROKE / 2) / (RING_VIEW / 2)) + 1;
  flow.edgeR = R;

  flow.segs = dots.slice(0, -1).map((p, i) => {
    const q = dots[i + 1];
    const dist = Math.hypot(q.x - p.x, q.y - p.y) || 1;
    const ux = (q.x - p.x) / dist;
    const uy = (q.y - p.y) / dist;
    const a = { x: p.x + ux * R, y: p.y + uy * R };
    const b = { x: q.x - ux * R, y: q.y - uy * R };
    return { a, b, len: Math.max(0, dist - 2 * R) };
  });
  track.setAttribute('d', flow.segs.map((s) => `M${f1(s.a.x)} ${f1(s.a.y)} L${f1(s.b.x)} ${f1(s.b.y)}`).join(' '));

  // Laço: sai pela borda de Produção (direita no desktop, de baixo no celular), passa pelo selo
  // "Observabilidade" e entra pela borda de Código (esquerda no desktop, de cima no celular)
  const lbl = loopLabel.getBoundingClientRect();
  let d;
  if (!flow.vertical) {
    const y0 = first.y;
    const yL = lbl.top - base.top + lbl.height / 2;
    const room = Math.min(first.x - R, base.width - (last.x + R));
    const e = Math.max(10, Math.min(28, room - 6));
    const r = Math.min(14, e, (yL - y0) / 2);
    const xr = last.x + R + e;
    const xl = first.x - R - e;
    d = `M${f1(last.x + R)} ${f1(y0)} H${f1(xr - r)} Q${f1(xr)} ${f1(y0)} ${f1(xr)} ${f1(y0 + r)} V${f1(yL - r)} Q${f1(xr)} ${f1(yL)} ${f1(xr - r)} ${f1(yL)} H${f1(xl + r)} Q${f1(xl)} ${f1(yL)} ${f1(xl)} ${f1(yL - r)} V${f1(y0 + r)} Q${f1(xl)} ${f1(y0)} ${f1(xl + r)} ${f1(y0)} H${f1(first.x - R)}`;
  } else {
    const x = lbl.left - base.left + lbl.width / 2;
    const room = Math.min(first.y - R, base.height - (last.y + R));
    const e = Math.max(8, Math.min(22, room - 4));
    const r = Math.min(10, e, (first.x - x) / 2);
    const yb = last.y + R + e;
    const yt = first.y - R - e;
    d = `M${f1(last.x)} ${f1(last.y + R)} V${f1(yb - r)} Q${f1(last.x)} ${f1(yb)} ${f1(last.x - r)} ${f1(yb)} H${f1(x + r)} Q${f1(x)} ${f1(yb)} ${f1(x)} ${f1(yb - r)} V${f1(yt + r)} Q${f1(x)} ${f1(yt)} ${f1(x + r)} ${f1(yt)} H${f1(first.x - r)} Q${f1(first.x)} ${f1(yt)} ${f1(first.x)} ${f1(yt + r)} V${f1(first.y - R)}`;
  }
  loop.setAttribute('d', d);
  flow.loopLen = loop.getTotalLength();
};

const TRAIL_DOTS = 12; // círculos do rastro
const TRAIL_GAP = 6; // px entre eles ao longo da trilha
const ABSORB = TRAIL_DOTS * TRAIL_GAP; // depois de parar na borda, o rastro alcança a cabeça e some

// Pulso = cabeça luminosa + rastro que se dissipa atrás dela
const makePulseEl = (kind, start) => {
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
  head.setAttribute('transform', `translate(${f1(start.x)} ${f1(start.y)})`); // nasce na borda, nunca na origem
  flow.pulseLayer.append(g);
  g._head = head;
  g._trail = trail;
  return g;
};

// Ponto a uma distância d do início do caminho do pulso, sempre preso entre as duas bordas
const pointOn = (p, d) => {
  const k = Math.max(0, Math.min(p.len, d));
  if (p.seg) {
    const { a, b } = p.seg;
    const t = p.len ? k / p.len : 1;
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }
  return flow.loop.getPointAtLength(k);
};

// kind 'track' (segmento i, da etapa i para a i+1) ou 'loop'; onArrive roda quando o pulso encosta na borda
const spawnPulse = (kind, i, durMs, onArrive) => {
  const seg = kind === 'track' ? flow.segs[i] : null;
  const len = seg ? seg.len : flow.loopLen;
  const speed = durMs ? Math.max(0.2, len / (PULSE_SPEED * durMs)) : 1;
  const p = { kind, seg, len, d: 0, speed, arrived: false, onArrive };
  p.el = makePulseEl(kind, pointOn(p, 0));
  flow.pulses.push(p);
  return p;
};

const arrive = (p) => {
  if (p.arrived) return;
  p.arrived = true;
  p.d = Math.max(p.d, p.len); // chegada entregue antes da hora (pausa ou troca de layout): o pulso fica na borda
  if (p.kind === 'loop' && !flow.simLoop) flow.loopLabel.classList.remove('is-active');
  p.onArrive?.();
};

const placePulse = (p) => {
  const head = pointOn(p, p.d);
  const fade = p.arrived ? Math.max(0, 1 - (p.d - p.len) / (ABSORB * 0.7)) : 1;
  p.el._head.setAttribute('transform', `translate(${f1(head.x)} ${f1(head.y)})`);
  p.el._head.setAttribute('opacity', fade.toFixed(3));
  p.el._trail.forEach((c, i) => {
    const d = p.d - (i + 1) * TRAIL_GAP;
    if (d < 0) {
      c.setAttribute('opacity', '0');
      return;
    }
    const q = pointOn(p, d);
    c.setAttribute('cx', f1(q.x));
    c.setAttribute('cy', f1(q.y));
    c.setAttribute('opacity', (0.42 * (1 - i / TRAIL_DOTS) ** 1.6 * fade).toFixed(3));
  });
};

/* ---------- Anel de carregamento e estados das etapas ---------- */

const setRing = (i, p) => {
  const arc = flow.arcs[i];
  if (!arc) return;
  const v = Math.max(0, Math.min(1, p));
  arc.style.strokeDashoffset = (100 * (1 - v)).toFixed(2);
  arc.style.opacity = v > 0.01 ? '1' : '0'; // sem o ponto da ponta arredondada quando o anel está vazio
};

const beginLoad = (i) => {
  const node = flow.nodes[i];
  setRing(i, 0);
  node.classList.remove('is-done');
  node.classList.add('is-loading');
};

const completeLoad = (i) => {
  const node = flow.nodes[i];
  setRing(i, 1);
  node.classList.remove('is-loading');
  node.classList.add('is-done');
};

// Toque de luz na borda de Código quando o laço fecha o ciclo
const ping = (i) => {
  const node = flow.nodes[i];
  node.classList.remove('is-ping');
  void node.offsetWidth; // reinicia a animação
  node.classList.add('is-ping');
  clearTimeout(node._pingTimer);
  node._pingTimer = setTimeout(() => node.classList.remove('is-ping'), 900);
};

const clearSteps = () => flow.nodes.forEach((n, i) => {
  clearTimeout(n._pingTimer);
  n.classList.remove('is-loading', 'is-done', 'is-ping');
  setRing(i, 0);
});

/* ---------- Ciclo contínuo ---------- */

const restartCycle = (wait = 0) => {
  flow.cycle = { phase: 'gap', step: 0, p: 0, wait };
};

const finishCycleStep = (i) => {
  completeLoad(i);
  const c = flow.cycle;
  c.phase = 'travel';
  if (i < flow.nodes.length - 1) {
    // trechos curtos (celular) ganham uma duração mínima para o pulso ser visto
    spawnPulse('track', i, Math.max(MIN_HOP_MS, flow.segs[i].len / PULSE_SPEED), () => {
      if (flow.simulating || c !== flow.cycle) return;
      c.phase = 'load';
      c.step = i + 1;
      c.p = 0;
      beginLoad(i + 1);
    });
  } else {
    // Produção no ar: o pulso segue pelo laço de Observabilidade de volta até a borda de Código
    spawnPulse('loop', 0, LOOP_MS, () => {
      if (flow.simulating || c !== flow.cycle) return;
      ping(0);
      c.phase = 'gap';
      c.wait = 0;
    });
  }
};

const cycleTick = (dt) => {
  const c = flow.cycle;
  if (c.phase === 'gap') {
    c.wait += dt;
    if (c.wait >= CYCLE_GAP_MS) {
      clearSteps();
      c.phase = 'load';
      c.step = 0;
      c.p = 0;
      beginLoad(0);
    }
  } else if (c.phase === 'load') {
    c.p += dt / LOAD_MS;
    setRing(c.step, c.p);
    if (c.p >= 1) finishCycleStep(c.step);
  }
};

// Simulação: o anel avança com a narração da etapa e só completa no "✓"
const simTick = (now) => {
  const s = flow.sim;
  if (!s || s.loadedAt == null) return;
  setRing(s.step, Math.min(0.95, (now - s.loadedAt) / Math.max(1, s.endAt - s.loadedAt)));
};

const tick = (now) => {
  const dt = Math.min(64, now - (flow.last || now));
  flow.last = now;
  if (!flow.paused) {
    if (flow.simulating) simTick(now); else cycleTick(dt);
    flow.pulses = flow.pulses.filter((p) => {
      p.d += PULSE_SPEED * dt * (p.arrived ? Math.max(1, p.speed) : p.speed); // o rastro some no mesmo tempo em qualquer trecho
      if (!p.arrived && p.d >= p.len) arrive(p);
      if (p.d >= p.len + ABSORB) {
        p.el.remove();
        return false;
      }
      placePulse(p);
      if (p.kind === 'loop' && !p.arrived) {
        flow.loopLabel.classList.toggle('is-active', flow.simLoop || (p.d > p.len * 0.3 && p.d < p.len * 0.7));
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

// settle: entrega a chegada dos pulsos removidos (troca de layout no meio do caminho)
const resetPulses = (settle = false) => {
  const pending = flow.pulses.filter((p) => !p.arrived);
  flow.pulses.forEach((p) => p.el.remove());
  flow.pulses = [];
  if (!flow.simLoop) flow.loopLabel.classList.remove('is-active');
  if (settle) pending.forEach(arrive);
};

// Estado estático para quem prefere menos movimento: todas as etapas concluídas, sem pulso nem anel.
const applyStatic = () => {
  stopLoop();
  resetPulses();
  flow.nodes.forEach((n, i) => {
    clearTimeout(n._pingTimer);
    n.classList.remove('is-loading', 'is-ping');
    n.classList.add('is-done');
    setRing(i, 0);
  });
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

// Estimativa da narração de uma etapa (digitação + spinners), para o anel avançar junto com o terminal
const narrationMs = (st) => st.lines.reduce((n, l) => n + l.length * CHAR_MS * 1.2 + SPIN_MS, 0);
const LOOP_SIM_MS = 2600; // o laço de Produção a Código acompanha a narração da observabilidade
const HOP_MS = 450; // pulso de uma etapa à seguinte durante a simulação

// O anel da etapa começa a carregar quando o pulso encosta na borda dela
const simLoad = (i, endAt) => {
  const now = performance.now();
  flow.sim = { step: i, loadedAt: now, endAt: Math.max(now + 300, endAt) };
  beginLoad(i);
};

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
  flow.sim = null;
  flow.simLoop = false;
  resetPulses();
  clearSteps();
  term.body.textContent = '';
  term.idle = false;
  let done = 0;
  const tick = () => { done += 1; setProgress(done); };
  const startedAt = performance.now();
  const stages = script();
  let incoming = null; // pulso a caminho da etapa seguinte
  let stageEnd = null; // fim estimado da narração da etapa em andamento
  setProgress(0);
  try {
    for (const s of stages) {
      const isLoop = s.step === 'loop';
      setStage(isLoop ? t('site.loop') : t(`site.step.${s.step}`), s.stage);
      announce(s.head);
      addRow('head', s.head);
      tick();
      // O anel da etapa carrega enquanto o terminal narra e completa no "✓"
      stageEnd = performance.now() + narrationMs(s);
      if (isLoop) {
        flow.simLoop = true; // o selo fica aceso durante toda a narração da observabilidade
        flow.loopLabel.classList.add('is-active');
      } else if (s.step === 0) {
        simLoad(0, stageEnd);
      } else if (flow.sim && flow.sim.step === s.step) {
        flow.sim.endAt = Math.max(flow.sim.loadedAt + 300, stageEnd); // o pulso chegou antes da narração
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
        // Se o pulso ainda não encostou (animação pausada por um tooltip), a chegada é entregue agora
        if (incoming && !incoming.arrived) arrive(incoming);
        completeLoad(s.step);
        flow.sim = null;
        stageEnd = null;
        const next = s.step + 1;
        const target = token;
        if (next < flow.nodes.length) {
          incoming = spawnPulse('track', s.step, HOP_MS, () => {
            if (target === term.token) simLoad(next, stageEnd ?? performance.now() + narrationMs(stages[next]));
          });
        } else {
          // Produção no ar: o pulso segue pelo laço de Observabilidade até a borda de Código
          incoming = spawnPulse('loop', 0, LOOP_SIM_MS, () => { if (target === term.token) ping(0); });
        }
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
  flow.sim = null;
  restartCycle(0); // as etapas concluídas ficam à mostra um instante e o ciclo contínuo recomeça
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

  // Anel de carregamento ao redor de cada etapa (decorativo)
  flow.arcs = flow.nodes.map((n) => {
    const ring = document.createElementNS(SVG_NS, 'svg');
    ring.setAttribute('class', 'flow-ring');
    ring.setAttribute('viewBox', `0 0 ${RING_VIEW} ${RING_VIEW}`);
    ring.setAttribute('aria-hidden', 'true');
    ring.setAttribute('focusable', 'false');
    const mk = (cls) => {
      const c = document.createElementNS(SVG_NS, 'circle');
      c.setAttribute('class', cls);
      c.setAttribute('cx', RING_VIEW / 2);
      c.setAttribute('cy', RING_VIEW / 2);
      c.setAttribute('r', RING_R);
      c.setAttribute('pathLength', '100');
      ring.append(c);
      return c;
    };
    mk('flow-ring-base');
    const arc = mk('flow-ring-arc');
    n.querySelector('.flow-dot').prepend(ring);
    return arc;
  });

  layoutFlow();
  let resizeTimer = 0;
  const relayout = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      layoutFlow();
      resetPulses(true);
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
      clearSteps();
      restartCycle(CYCLE_GAP_MS - 400);
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
