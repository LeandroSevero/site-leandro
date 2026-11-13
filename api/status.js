import { runHealthChecks } from './lib/health-checks.js';

// Status PÚBLICO do site (sem token), usado pelo painel ao vivo da seção "Sobre o site".
// Reaproveita os checks do /api/health, mas responde SÓ:
//   {"status":"operational"|"degraded","checkedAt":"<ISO>"}
// Nunca expõe nomes de variáveis, tempos internos nem mensagens de erro.
// Cache na CDN da Vercel por 5 min (s-maxage=300), servindo a resposta anterior por até
// mais 10 min enquanto revalida: o banco é consultado no máximo a cada ~5 min, não a cada visita.

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(405).json({ status: 'degraded', checkedAt: new Date().toISOString() });
  }

  let status = 'degraded';
  try {
    const { ok } = await runHealthChecks();
    status = ok ? 'operational' : 'degraded';
  } catch {
    status = 'degraded';
  }

  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  return res.status(200).json({ status, checkedAt: new Date().toISOString() });
}
