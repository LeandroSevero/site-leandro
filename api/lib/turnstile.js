export const getRemoteIp = (req) =>
  (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();

export const verifyTurnstile = async (token, remoteip) => {
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
