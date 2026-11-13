import { getDb } from './mongodb.js';

// Lógica compartilhada por /api/health (privado, detalhado) e /api/status (público, resumido).
// - ping real no MongoDB (conta como atividade no cluster gratuito do Atlas)
// - confere se as variáveis de Turnstile, Resend e contato existem (nunca lê nem devolve valores)

const DB_NAME = 'contact';
const PING_TIMEOUT_MS = 4000;

export const REQUIRED_ENV = {
  turnstile: ['VITE_TURNSTILE_SITE_KEY', 'TURNSTILE_SECRET_KEY'],
  resend: ['RESEND_API_KEY'],
  contato: ['CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL'],
};

const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(Object.assign(new Error('timeout'), { name: 'TimeoutError' })), ms)),
  ]);

const checkMongo = async () => {
  const started = Date.now();
  try {
    const db = await withTimeout(getDb(DB_NAME), PING_TIMEOUT_MS);
    await withTimeout(db.command({ ping: 1 }), PING_TIMEOUT_MS);
    return { ok: true, ms: Date.now() - started };
  } catch (err) {
    return { ok: false, ms: Date.now() - started, erro: err?.name || 'Error' };
  }
};

const checkEnv = (names) => {
  const missing = names.filter((name) => !process.env[name]);
  return missing.length ? { ok: false, faltando: missing } : { ok: true };
};

// Retorna { ok, failed, checks } com o detalhe de cada check (uso interno / endpoint autenticado).
export const runHealthChecks = async () => {
  const checks = { mongodb: await checkMongo() };
  for (const [name, vars] of Object.entries(REQUIRED_ENV)) {
    checks[name] = checkEnv(vars);
  }
  const failed = Object.keys(checks).filter((name) => !checks[name].ok);
  return { ok: failed.length === 0, failed, checks };
};
