/* Cliente mínimo para Redis por REST (Upstash / Vercel Marketplace «Upstash for Redis»), sem dependências.
   Variáveis aceites (qualquer dos pares): KV_REST_API_URL + KV_REST_API_TOKEN  |  UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN */
const URL_BASE = () => (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '').replace(/\/+$/, '');
const TOKEN = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '';

const configurado = () => !!(URL_BASE() && TOKEN());

async function cmd(...args) {
  const r = await fetch(URL_BASE(), {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + TOKEN(), 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || j.error) throw new Error('kv: ' + (j.error || r.status));
  return j.result;
}

module.exports = {
  configurado,
  get: (k) => cmd('GET', k),
  set: (k, v, opts) => cmd('SET', k, v, ...(opts && opts.nx ? ['NX'] : []), ...(opts && opts.ex ? ['EX', String(opts.ex)] : [])),
  del: (k) => cmd('DEL', k),
  incr: (k) => cmd('INCR', k),
  expire: (k, s) => cmd('EXPIRE', k, String(s)),
  ttl: (k) => cmd('TTL', k),
};
