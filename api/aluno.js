/* /api/aluno — registo, entrada, saída e dados do próprio estudante.
   GET                      → dados do estudante com sessão válida
   POST {acao:'registar',nome}            → cria conta; devolve UMA vez numero, utilizador e codigo
   POST {acao:'entrar',utilizador,codigo} → inicia sessão
   POST {acao:'sair'}                     → termina e revoga a sessão
   Variáveis na Vercel: SESSION_SECRET (≥32 caracteres aleatórios) e a base de dados Redis (KV_REST_API_URL/TOKEN). */
const crypto = require('node:crypto');
const kv = require('./_lib/kv');
const S = require('./_lib/seguranca');

const GENERICO = 'Utilizador ou código incorrectos.';
const semAcentos = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '');

async function registar(req, res, corpo) {
  const ip = S.ipDe(req);
  if (!(await S.limite('rl:reg:' + ip, 5, 3600))) return S.enviar(res, 429, { erro: 'Demasiados registos a partir desta ligação. Tente mais tarde.' });
  const nome = String(corpo.nome || '').replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim();
  if (nome.length < 2 || nome.length > 60) return S.enviar(res, 400, { erro: 'Indique o seu nome (2 a 60 letras).' });

  const base = (semAcentos(nome).toLowerCase().split(' ')[0].replace(/[^a-z0-9]/g, '').slice(0, 12)) || 'aluno';
  const uid = crypto.randomBytes(16).toString('hex');
  let utilizador = '';
  for (let i = 0; i < 12 && !utilizador; i++) {
    const cand = base + crypto.randomInt(1000, 10000);
    if (await kv.set('usr:' + cand, uid, { nx: true })) utilizador = cand;   // SET NX: nunca há dois iguais
  }
  if (!utilizador) return S.enviar(res, 503, { erro: 'Não foi possível criar o utilizador. Tente novamente.' });

  const numero = 'ENC-' + String(await kv.incr('seq:estudante')).padStart(6, '0');
  const codigo = String(crypto.randomInt(0, 1000000)).padStart(6, '0');   // 6 dígitos (contas antigas continuam a entrar com 4)
  const sal = crypto.randomBytes(16).toString('hex');
  const h = await S.hashCodigo(utilizador, codigo, sal);
  await kv.set('est:' + uid, JSON.stringify({ numero, uid, nome, utilizador, sal, h, criado: new Date().toISOString() }));
  const sessao = await S.criarSessao(uid);
  return S.enviar(res, 201, { numero, utilizador, nome, codigo, aviso: 'Guarde estes dados: o código não volta a ser mostrado e não pode ser recuperado.' },
    { 'Set-Cookie': S.cookie(encodeURIComponent(sessao), S.DIAS * 86400) });
}

async function entrar(req, res, corpo) {
  const ip = S.ipDe(req);
  if (!(await S.limite('lf:ip:' + ip, 40, 900))) return S.enviar(res, 429, { erro: 'Demasiadas tentativas. Tente dentro de 15 minutos.' });
  const u = String(corpo.utilizador || '').trim().toLowerCase().slice(0, 40);
  const c = String(corpo.codigo || '').trim();
  const chaveU = 'lf:u:' + (/^[a-z0-9._-]{1,40}$/.test(u) ? u : '_invalido');
  const falhas = Number((await kv.get(chaveU)) || 0);
  if (falhas >= 5) return S.enviar(res, 429, { erro: 'Demasiadas tentativas. Tente dentro de 15 minutos.' });   // vale também para nomes inexistentes (sem enumeração)

  const falhar = async () => { await kv.incrExp(chaveU, 900); return S.enviar(res, 401, { erro: GENERICO }); };
  if (!/^[a-z0-9._-]{1,40}$/.test(u) || !S.CODIGO_RE.test(c)) { await S.hashCodigo('x', '000000', S.DUMMY_SAL); return falhar(); }
  const uid = await kv.get('usr:' + u);
  const reg = uid ? await kv.get('est:' + uid) : null;
  if (!reg) { await S.hashCodigo(u, c, S.DUMMY_SAL); return falhar(); }   // mesmo tempo de resposta que um utilizador real
  const est = JSON.parse(reg);
  const h = await S.hashCodigo(u, c, est.sal);
  if (!S.igual(h, est.h)) return falhar();
  await kv.del(chaveU);
  const sessao = await S.criarSessao(est.uid);
  return S.enviar(res, 200, { numero: est.numero, utilizador: est.utilizador, nome: est.nome }, { 'Set-Cookie': S.cookie(encodeURIComponent(sessao), S.DIAS * 86400) });
}

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {   // «quem sou eu»: responde sempre 200, para a consola do navegador ficar limpa quando não há sessão
      if (!S.pronto()) return S.enviar(res, 200, { configurado: false });
      const s = await S.lerSessao(req);
      const reg = s ? await kv.get('est:' + s.uid) : null;
      if (!reg) return S.enviar(res, 200, { configurado: true, sessao: false });
      const e = JSON.parse(reg);
      return S.enviar(res, 200, { numero: e.numero, utilizador: e.utilizador, nome: e.nome });
    }
    if (!S.pronto()) return S.enviar(res, 503, { erro: 'As contas de estudante ainda não estão configuradas neste site.', configurado: false });
    if (req.method !== 'POST') return S.enviar(res, 405, { erro: 'Método não permitido.' }, { Allow: 'GET, POST' });
    if (!S.pedidoSeguro(req)) return S.enviar(res, 400, { erro: 'Pedido inválido.' });
    let corpo; try { corpo = await S.lerCorpo(req); } catch (e) { return S.enviar(res, 400, { erro: 'Pedido inválido.' }); }
    if (corpo.acao === 'registar') return registar(req, res, corpo);
    if (corpo.acao === 'entrar') return entrar(req, res, corpo);
    if (corpo.acao === 'sair') {
      const s = await S.lerSessao(req);
      if (s) await kv.incr('sv:' + s.uid);   // revoga todas as sessões deste estudante
      return S.enviar(res, 200, { ok: true }, { 'Set-Cookie': S.cookie('', 0) });
    }
    return S.enviar(res, 400, { erro: 'Acção desconhecida.' });
  } catch (e) {
    console.error('aluno:', e && e.message);
    return S.enviar(res, 500, { erro: 'Erro interno. Tente novamente.' });
  }
};
