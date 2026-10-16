import { verifyTurnstile, getRemoteIp } from './lib/turnstile.js';

const COOKIE_NAME = 'ls_verified';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
const MAX_TOKEN_LENGTH = 2048;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido.' });
  }

  const token = (req.body || {}).token;
  if (typeof token !== 'string' || !token.trim() || token.length > MAX_TOKEN_LENGTH) {
    return res.status(400).json({ success: false, message: 'Token de segurança ausente.' });
  }

  try {
    const result = await verifyTurnstile(token, getRemoteIp(req));
    if (!result.success) {
      return res.status(400).json({ success: false, message: 'Verificação de segurança falhou.' });
    }
  } catch {
    return res.status(500).json({ success: false, message: 'Erro ao verificar segurança.' });
  }

  res.setHeader('Set-Cookie', `${COOKIE_NAME}=1; Path=/; Max-Age=${COOKIE_MAX_AGE}; Secure; SameSite=Lax`);
  return res.status(200).json({ success: true });
}
