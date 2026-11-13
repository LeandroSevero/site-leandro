import { timingSafeEqual } from 'crypto';
import { runHealthChecks } from './lib/health-checks.js';

// Check de saúde do site e keep-alive do MongoDB Atlas.
// - Chamado 1x por dia pelo cron da Vercel (Authorization: Bearer <CRON_SECRET>, enviado automaticamente)
//   e toda segunda pelo GitHub Action (Authorization: Bearer <HEALTHCHECK_TOKEN>).
// - O ping abre uma conexão real com o cluster: conta como atividade e evita que o
//   cluster gratuito do Atlas seja pausado por falta de uso.
// - Nunca devolve valores de variáveis nem envia e-mail.
// - A mesma lógica (api/lib/health-checks.js) alimenta o /api/status público, que só diz operational/degraded.

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

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ status: 'error' });
  }

  if (!isAuthorized(req)) {
    return res.status(401).json({ status: 'unauthorized' });
  }

  const { ok, failed, checks } = await runHealthChecks();
  if (!ok) {
    console.error('[api/health] check falhou', { falhas: failed, mongodb: checks.mongodb.erro || null });
    return res.status(503).json({ status: 'error', failed, checks, timestamp: new Date().toISOString() });
  }

  return res.status(200).json({ status: 'ok', checks, timestamp: new Date().toISOString() });
}
