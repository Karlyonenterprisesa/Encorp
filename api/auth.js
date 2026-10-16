/* Decap CMS — passo 1 do login GitHub (OAuth).
   Rota: /api/auth  →  redireciona para o GitHub.
   Variáveis na Vercel: GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET (opcional: GITHUB_SCOPE). */
const crypto = require('node:crypto');

module.exports = (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.end('Falta a variável GITHUB_CLIENT_ID na Vercel (Settings → Environment Variables).');
  }
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const redirectUri = `${proto}://${host}/api/callback`;
  const scope = process.env.GITHUB_SCOPE || 'repo,user';
  const state = crypto.randomBytes(16).toString('hex');

  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', scope);
  url.searchParams.set('state', state);

  res.setHeader('Set-Cookie', `ec_oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=600`);
  res.statusCode = 302;
  res.setHeader('Location', url.toString());
  res.end();
};
