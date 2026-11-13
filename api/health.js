import { timingSafeEqual } from 'crypto';
import { getDb } from './lib/mongodb.js';

// Check de saúde do site e keep-alive do MongoDB Atlas.
// - Chamado 1x por dia pelo cron da Vercel (Authorization: Bearer <CRON_SECRET>, enviado automaticamente)
//   e toda segunda pelo GitHub Action (Authorization: Bearer <HEALTHCHECK_TOKEN>).
// - O ping abre uma conexão real com o cluster: conta como atividade e evita que o
//   cluster gratuito do Atlas seja pausado por falta de uso.
// - Nunca devolve valores de variáveis nem envia e-mail.

const DB_NAME = 'contact';
const PING_TIMEOUT_MS = 4000;

const REQUIRED_ENV = {
  turnstile: ['VITE_TURNSTILE_SITE_KEY', 'TURNSTILE_SECRET_KEY'],
  resend: ['RESEND_API_KEY'],
  contato: ['CONTACT_TO_EMAIL', 'CONTACT_FROM_EMAIL'],
};

const safeEqual = (a, b) => {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
};

const isAuthorized = (req) => {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return false;
  const token = header.slice('Bearer '.length).trim();
  if (!token) return false;
  const accepted = [process.env.HEALTHCHECK_TOKEN, process.env.CRON_SECRET].filter(Boolean);
  return accepted.some((secret) => safeEqual(token, secret));
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

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ status: 'error' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ status: 'unauthorized' });
  }

  const checks = { mongodb: await checkMongo() };
  for (const [name, vars] of Object.entries(REQUIRED_ENV)) {
    checks[name] = checkEnv(vars);
  }

  const failed = Object.keys(checks).filter((name) => !checks[name].ok);
  if (failed.length) {
    console.error('[api/health] check falhou', { falhas: failed, mongodb: checks.mongodb.erro || null });
    return res.status(503).json({ status: 'error', failed, checks, timestamp: new Date().toISOString() });
  }

  return res.status(200).json({ status: 'ok', checks, timestamp: new Date().toISOString() });
}
