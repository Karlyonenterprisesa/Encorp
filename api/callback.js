/* Decap CMS — passo 2 do login GitHub (OAuth).
   Rota: /api/callback  (a «Authorization callback URL» da OAuth App do GitHub).
   Troca o código por um token e devolve-o à janela do CMS. */
const render = (status, content) => `<!doctype html><html lang="pt"><head><meta charset="utf-8"><title>Autenticação</title></head><body><script>
(function () {
  var msg = ${JSON.stringify(status)} === 'success'
    ? 'authorization:github:success:' + ${JSON.stringify(JSON.stringify(content))}
    : 'authorization:github:error:' + ${JSON.stringify(JSON.stringify(content))};
  function receive(e) {
    window.opener.postMessage(msg, e.origin);
    window.removeEventListener('message', receive, false);
    setTimeout(function () { window.close(); }, 300);
  }
  if (window.opener) {
    window.addEventListener('message', receive, false);
    window.opener.postMessage('authorizing:github', '*');
  } else {
    document.body.textContent = 'Abra o CMS em /admin e tente de novo.';
  }
})();
</script></body></html>`;

const cookie = (req, name) => {
  const m = (req.headers.cookie || '').match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? m[1] : '';
};

module.exports = async (req, res) => {
  const send = (code, status, content) => {
    res.statusCode = code;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Set-Cookie', 'ec_oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=0');
    res.end(render(status, content));
  };
  try {
    const q = new URL(req.url, 'https://x').searchParams;
    const code = q.get('code');
    const state = q.get('state');
    if (!code) return send(400, 'error', { message: 'Código de autorização em falta.' });
    if (!state || state !== cookie(req, 'ec_oauth_state')) return send(400, 'error', { message: 'Estado inválido. Tente iniciar sessão de novo.' });
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      return send(500, 'error', { message: 'Faltam GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET na Vercel.' });
    }
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const data = await r.json();
    if (data.error || !data.access_token) {
      return send(401, 'error', { message: data.error_description || data.error || 'O GitHub não devolveu um token.' });
    }
    return send(200, 'success', { token: data.access_token, provider: 'github' });
  } catch (e) {
    return send(500, 'error', { message: 'Erro no servidor: ' + (e && e.message ? e.message : e) });
  }
};
