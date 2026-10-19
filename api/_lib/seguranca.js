/* Segurança partilhada pelas funções /api/aluno e /api/aprendizagem.
   - Códigos de acesso: HMAC com segredo do servidor («pimenta») + scrypt com sal por utilizador. Nunca em texto simples.
   - Sessão: cookie HttpOnly assinado (HMAC) com versão revogável.
   - Pedidos que alteram dados: só POST, JSON, cabeçalho X-EC-Req e Origin do próprio site.
   - Limites de tentativas por utilizador (mesmo inexistente, para não permitir enumeração) e por IP. */
const crypto = require('node:crypto');
const kv = require('./kv');

const SEGREDO = () => process.env.SESSION_SECRET || '';
const pronto = () => kv.configurado() && SEGREDO().length >= 32;

const b64u = (b) => Buffer.from(b).toString('base64url');
const hmac = (chave, txt) => crypto.createHmac('sha256', chave).update(txt).digest();
const igual = (a, b) => { a = Buffer.from(a); b = Buffer.from(b); return a.length === b.length && crypto.timingSafeEqual(a, b); };

function scrypt(pw, sal) {
  return new Promise((ok, no) => crypto.scrypt(pw, sal, 32, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }, (e, k) => (e ? no(e) : ok(k))));
}
/* contas novas têm 6 dígitos (contas antigas, 4): a «pimenta» (segredo no servidor) impede que uma fuga da base de dados permita adivinhá-lo offline */
async function hashCodigo(utilizador, codigo, salHex) {
  const pre = hmac(SEGREDO(), 'codigo:' + utilizador + ':' + codigo);
  return (await scrypt(pre, Buffer.from(salHex, 'hex'))).toString('hex');
}
const DUMMY_SAL = crypto.randomBytes(16).toString('hex');

/* ---------- sessão ---------- */
const DIAS = 14;
async function criarSessao(uid) {
  const ver = String((await kv.get('sv:' + uid)) || '0');
  const exp = Math.floor(Date.now() / 1000) + DIAS * 86400;
  const corpo = `v1.${uid}.${exp}.${ver}`;
  return corpo + '.' + b64u(hmac(SEGREDO(), corpo));
}
async function lerSessao(req) {
  const m = /(?:^|;\s*)ec_sess=([^;]+)/.exec(req.headers.cookie || '');
  if (!m) return null;
  const p = decodeURIComponent(m[1]).split('.');
  if (p.length !== 5 || p[0] !== 'v1') return null;
  const corpo = p.slice(0, 4).join('.');
  if (!igual(b64u(hmac(SEGREDO(), corpo)), p[4])) return null;
  if (Number(p[2]) < Date.now() / 1000) return null;
  const ver = String((await kv.get('sv:' + p[1])) || '0');
  if (ver !== p[3]) return null;
  return { uid: p[1] };
}
const cookie = (valor, maxAge) => `ec_sess=${valor}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`;

/* ---------- pedidos e respostas ---------- */
function enviar(res, estado, obj, extra) {
  res.statusCode = estado;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (extra) for (const k of Object.keys(extra)) res.setHeader(k, extra[k]);
  res.end(JSON.stringify(obj));
}
function lerCorpo(req, max = 20000) {
  return new Promise((ok, no) => {
    let n = 0; const partes = [];
    req.on('data', (c) => { n += c.length; if (n > max) { no(new Error('grande')); req.destroy(); } else partes.push(c); });
    req.on('end', () => { try { ok(JSON.parse(Buffer.concat(partes).toString('utf8') || '{}')); } catch (e) { no(new Error('json')); } });
    req.on('error', no);
  });
}
/* devolve true se o pedido POST é legítimo (mesmo site, JSON, cabeçalho personalizado) */
function pedidoSeguro(req) {
  if ((req.headers['x-ec-req'] || '') !== '1') return false;
  if (!/^application\/json/i.test(req.headers['content-type'] || '')) return false;
  const o = req.headers.origin;
  if (o) { try { if (new URL(o).host !== (req.headers['x-forwarded-host'] || req.headers.host)) return false; } catch (e) { return false; } }
  return true;
}
const ipDe = (req) => String((req.headers['x-forwarded-for'] || req.socket.remoteAddress || '?').split(',')[0]).trim().slice(0, 64);

/* limite simples: devolve false se excedeu */
async function limite(chave, max, janelaSeg) {
  const n = await kv.incrExp(chave, janelaSeg);
  return n <= max;
}

const CODIGO_RE = /^\d{4,6}$/;   // 4 dígitos (contas antigas) a 6 (contas novas)
module.exports = { CODIGO_RE, pronto, hashCodigo, DUMMY_SAL, criarSessao, lerSessao, cookie, enviar, lerCorpo, pedidoSeguro, ipDe, limite, igual, DIAS };
