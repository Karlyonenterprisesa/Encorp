/* /api/visitas — contador diário de visitas, discreto, no rodapé.
   GET  → {ok, hoje, total}            (só lê)
   POST → conta 1 visita (o navegador só envia 1 vez por dia) e devolve o mesmo.
   Usa a mesma base Redis das contas (KV_REST_API_URL/TOKEN). Sem base configurada devolve {ok:false} e o rodapé esconde o contador. */
const kv = require('./_lib/kv');
const S = require('./_lib/seguranca');

module.exports = async (req, res) => {
  try {
    if (!kv.configurado()) return S.enviar(res, 200, { ok: false });
    const dia = new Date(Date.now() + 2 * 3600e3).toISOString().slice(0, 10);   // dia em Moçambique (UTC+2)
    const kd = 'vis:d:' + dia;
    if (req.method === 'POST') {
      if (!S.pedidoSeguro(req)) return S.enviar(res, 400, { ok: false });
      if (!(await S.limite('rl:vis:' + S.ipDe(req), 20, 3600))) return S.enviar(res, 429, { ok: false });
      const hoje = await kv.incrExp(kd, 90 * 86400);
      const total = await kv.incr('vis:total');
      return S.enviar(res, 200, { ok: true, hoje: Number(hoje), total: Number(total) });
    }
    if (req.method !== 'GET') return S.enviar(res, 405, { ok: false });
    const [h, t] = await Promise.all([kv.get(kd), kv.get('vis:total')]);
    return S.enviar(res, 200, { ok: true, hoje: Number(h || 0), total: Number(t || 0) });
  } catch (e) {
    return S.enviar(res, 200, { ok: false });
  }
};
