import { Resend } from 'resend';
import { createHash } from 'crypto';
import { getDb, ensureIndexes } from './lib/mongodb.js';

const NAME_PATTERN = /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'\-]+$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DAILY_LIMIT = 2;
const DB_NAME = 'contact';

const validateFields = ({ name, email, phone, subject, message }) => {
  const errors = {};

  const n = (name || '').trim();
  if (!n) errors.name = 'Nome completo é obrigatório.';
  else if (n.length < 3) errors.name = 'Nome deve ter pelo menos 3 caracteres.';
  else if (n.length > 120) errors.name = 'Nome deve ter no máximo 120 caracteres.';
  else if (!NAME_PATTERN.test(n)) errors.name = 'Nome deve conter apenas letras, espaços, acentos, hífen e apóstrofo.';

  const e = (email || '').trim();
  if (!e) errors.email = 'E-mail é obrigatório.';
  else if (e.length > 254) errors.email = 'E-mail deve ter no máximo 254 caracteres.';
  else if (!EMAIL_PATTERN.test(e)) errors.email = 'Informe um e-mail válido.';

  const p = (phone || '').trim();
  if (p) {
    const digits = p.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 11) errors.phone = 'Informe um telefone válido: (99) 99999-9999.';
  }

  const s = (subject || '').trim();
  if (!s) errors.subject = 'Assunto é obrigatório.';
  else if (s.length < 3) errors.subject = 'Assunto deve ter pelo menos 3 caracteres.';
  else if (s.length > 120) errors.subject = 'Assunto deve ter no máximo 120 caracteres.';

  const m = (message || '').trim();
  if (!m) errors.message = 'Mensagem é obrigatória.';
  else if (m.length < 10) errors.message = 'Mensagem deve ter pelo menos 10 caracteres.';
  else if (m.length > 1000) errors.message = 'Mensagem deve ter no máximo 1000 caracteres.';

  return Object.keys(errors).length > 0 ? errors : null;
};

const verifyTurnstile = async (token, remoteip) => {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { success: false };

  const formData = new URLSearchParams();
  formData.append('secret', secret);
  formData.append('response', token);
  if (remoteip) formData.append('remoteip', remoteip);

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });

  const data = await res.json();
  return { success: !!data.success };
};

const getToday = () => {
  return new Date().toISOString().slice(0, 10);
};

const getTomorrowMidnight = () => {
  const d = new Date();
  d.setUTCHours(24, 0, 0, 0);
  return d;
};

const hashValue = (value) => {
  return createHash('sha256').update(value).digest('hex');
};

const checkRateLimit = async (rateLimits, type, key) => {
  const day = getToday();
  const doc = await rateLimits.findOne({ type, key, day });
  return doc ? doc.count : 0;
};

const incrementRateLimit = async (rateLimits, type, key) => {
  const day = getToday();
  const expiresAt = getTomorrowMidnight();
  await rateLimits.updateOne(
    { type, key, day },
    {
      $inc: { count: 1 },
      $setOnInsert: { type, key, day, createdAt: new Date(), expiresAt },
    },
    { upsert: true }
  );
};

const buildEmailHtml = ({ name, email, phone, subject, message }) => {
  const sentAt = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const row = (label, value) =>
    value
      ? `<tr>
          <td style="padding:10px 16px;font-size:13px;font-weight:600;color:#64748b;width:120px;vertical-align:top;white-space:nowrap;">${label}</td>
          <td style="padding:10px 16px;font-size:14px;color:#1e293b;word-break:break-word;">${value.replace(/\n/g, '<br>')}</td>
        </tr>`
      : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr>
          <td style="background:#1a5fa8;border-radius:12px 12px 0 0;padding:28px 32px;">
            <p style="margin:0;font-size:11px;font-weight:600;color:rgba(255,255,255,0.6);letter-spacing:0.08em;text-transform:uppercase;">Contato via Site</p>
            <h1 style="margin:8px 0 0;font-size:20px;font-weight:700;color:#ffffff;">${subject.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h1>
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;padding:0;border-radius:0 0 12px 12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
              ${row('Nome', name)}
              <tr><td colspan="2" style="height:1px;background:#f1f5f9;padding:0;"></td></tr>
              ${row('E-mail', `<a href="mailto:${email}" style="color:#1a5fa8;text-decoration:none;">${email}</a>`)}
              <tr><td colspan="2" style="height:1px;background:#f1f5f9;padding:0;"></td></tr>
              ${phone ? row('Telefone', phone) + '<tr><td colspan="2" style="height:1px;background:#f1f5f9;padding:0;"></td></tr>' : ''}
              ${row('Mensagem', message.replace(/</g, '&lt;').replace(/>/g, '&gt;'))}
              <tr><td colspan="2" style="height:1px;background:#f1f5f9;padding:0;"></td></tr>
              ${row('Enviado em', sentAt)}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 0 0;text-align:center;">
            <p style="margin:0;font-size:12px;color:#94a3b8;">Este e-mail foi gerado automaticamente a partir do formulário de contato do site.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método não permitido.' });
  }

  const { turnstileToken, name, email, phone, subject, message } = req.body || {};

  if (!turnstileToken) {
    return res.status(400).json({ success: false, message: 'Token de segurança ausente. Recarregue a página e tente novamente.' });
  }

  const fieldErrors = validateFields({ name, email, phone, subject, message });
  if (fieldErrors) {
    return res.status(400).json({ success: false, message: 'Verifique os campos e tente novamente.', errors: fieldErrors });
  }

  const remoteip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();

  try {
    const turnstile = await verifyTurnstile(turnstileToken, remoteip);
    if (!turnstile.success) {
      return res.status(400).json({ success: false, message: 'Verificação de segurança falhou. Tente novamente.' });
    }
  } catch {
    return res.status(500).json({ success: false, message: 'Erro ao verificar segurança. Tente novamente.' });
  }

  const emailNormalized = (email || '').trim().toLowerCase();
  const emailHash = hashValue(emailNormalized);

  let db;
  try {
    db = await getDb(DB_NAME);
    await ensureIndexes(db);
  } catch {
    return res.status(500).json({ success: false, message: 'Erro de conexão com banco de dados. Tente novamente mais tarde.' });
  }

  const rateLimits = db.collection('contact_rate_limits');

  try {
    const [ipCount, emailCount] = await Promise.all([
      checkRateLimit(rateLimits, 'ip', remoteip || 'unknown'),
      checkRateLimit(rateLimits, 'email', emailHash),
    ]);

    if (ipCount >= DAILY_LIMIT || emailCount >= DAILY_LIMIT) {
      return res.status(429).json({ success: false, message: 'Limite diário de mensagens atingido. Tente novamente amanhã.' });
    }
  } catch {
    return res.status(500).json({ success: false, message: 'Erro ao verificar limite de envios. Tente novamente mais tarde.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    return res.status(500).json({ success: false, message: 'Configuração de e-mail ausente. Tente novamente mais tarde.' });
  }

  const cleanName = (name || '').trim();
  const cleanEmail = (email || '').trim();
  const cleanPhone = (phone || '').trim();
  const cleanSubject = (subject || '').trim();
  const cleanMessage = (message || '').trim();

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `${cleanName} <${fromEmail}>`,
      to: [toEmail],
      reply_to: cleanEmail,
      subject: `[Contato do Site] ${cleanSubject}`,
      html: buildEmailHtml({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        subject: cleanSubject,
        message: cleanMessage,
      }),
    });

    if (error) {
      return res.status(500).json({ success: false, message: 'Não foi possível enviar o e-mail. Tente novamente mais tarde.' });
    }
  } catch {
    return res.status(500).json({ success: false, message: 'Erro interno ao enviar. Tente novamente mais tarde.' });
  }

  try {
    const now = new Date();
    await Promise.all([
      db.collection('contact_submissions').insertOne({
        name: cleanName,
        email: cleanEmail,
        emailNormalized,
        phone: cleanPhone,
        subject: cleanSubject,
        message: cleanMessage,
        ip: remoteip || 'unknown',
        createdAt: now,
      }),
      incrementRateLimit(rateLimits, 'ip', remoteip || 'unknown'),
      incrementRateLimit(rateLimits, 'email', emailHash),
    ]);
  } catch {
  }

  return res.status(200).json({ success: true, message: 'Mensagem enviada com sucesso.' });
}
