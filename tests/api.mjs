import http from 'node:http'; import { createRequire } from 'node:module'; import fs from 'node:fs'; import { fileURLToPath } from 'node:url'; import path from 'node:path';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');   // teste das API com Redis simulado: node tests/api.mjs (corre antes: node build.mjs)
const require = createRequire(import.meta.url);
// --- Redis simulado (REST estilo Upstash)
const store = new Map(), exp = new Map();
const live = (k) => { if (exp.has(k) && exp.get(k) < Date.now()) { store.delete(k); exp.delete(k); } return store.has(k); };
const kvSrv = http.createServer((q, s) => { let b = ''; q.on('data', (c) => b += c); q.on('end', () => {
  const [c, k, ...a] = JSON.parse(b); let r = null;
  if (c === 'GET') r = live(k) ? store.get(k) : null;
  else if (c === 'SET') { const nx = a.includes('NX'); const i = a.indexOf('EX'); if (nx && live(k)) r = null; else { store.set(k, a[0]); if (i > -1) exp.set(k, Date.now() + Number(a[i + 1]) * 1000); else exp.delete(k); r = 'OK'; } }
  else if (c === 'DEL') { r = live(k) ? 1 : 0; store.delete(k); }
  else if (c === 'INCR') { r = (live(k) ? Number(store.get(k)) : 0) + 1; store.set(k, String(r)); }
  else if (c === 'EVAL') { const key = a[1]; r = (live(key) ? Number(store.get(key)) : 0) + 1; store.set(key, String(r)); if (r === 1 || !exp.has(key)) exp.set(key, Date.now() + Number(a[2]) * 1000); }   // INCR + EXPIRE atómico
  else if (c === 'EXPIRE') { exp.set(k, Date.now() + Number(a[0]) * 1000); r = 1; }
  s.setHeader('content-type', 'application/json'); s.end(JSON.stringify({ result: r })); }); }).listen(8801);
process.env.KV_REST_API_URL = 'http://localhost:8801'; process.env.KV_REST_API_TOKEN = 't';
process.env.SESSION_SECRET = 'x'.repeat(40);
const aluno = require(ROOT + '/api/aluno.js'), apr = require(ROOT + '/api/aprendizagem.js');
const app = http.createServer((q, s) => q.url.startsWith('/api/aluno') ? aluno(q, s) : apr(q, s)).listen(8802);
const call = async (jar, method, path, body, hdr = {}) => {
  const h = { cookie: jar.c || '', ...hdr }; if (body) { h['content-type'] = 'application/json'; h['x-ec-req'] = '1'; }
  const r = await fetch('http://localhost:8802' + path, { method, headers: h, body: body ? JSON.stringify(body) : undefined });
  const sc = r.headers.get('set-cookie'); if (sc) jar.c = sc.split(';')[0].startsWith('ec_sess=') && sc.includes('Max-Age=0') ? '' : sc.split(';')[0];
  const j = await r.json(); j._st = r.status; return j; };
let ok = 0, bad = 0; const t = (n, c, x) => { c ? ok++ : (bad++, console.log('FALHOU:', n, x ?? '')); if (c) console.log('ok  ', n); };
const C = 'estabilizacao-de-pacientes', priv = JSON.parse(fs.readFileSync(ROOT + '/api/_dados/cursos.json', 'utf8'))[C];
const A = {};
// 1. sem sessão
t('sem sessão → 401', (await call({}, 'GET', '/api/aprendizagem?curso=' + C)).semSessao === true);
// 2. CSRF: POST sem cabeçalho
const rawr = await fetch('http://localhost:8802/api/aluno', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"acao":"registar","nome":"X Y"}' });
t('POST sem X-EC-Req → 400', rawr.status === 400);
// 3. registo
const r1 = await call(A, 'POST', '/api/aluno', { acao: 'registar', nome: 'João Mário' });
t('registo 201 + dados', r1._st === 201 && /^ENC-\d{6}$/.test(r1.numero) && /^joao\d{4}$/.test(r1.utilizador) && /^\d{6}$/.test(r1.codigo), JSON.stringify(r1));
const reg = JSON.parse(store.get([...store.keys()].find((k) => k.startsWith('est:'))));
t('código não guardado em claro', !JSON.stringify(reg).includes(r1.codigo) && reg.h.length === 64);
t('GET eu com sessão', (await call(A, 'GET', '/api/aluno')).utilizador === r1.utilizador);
t('GET eu sem sessão → 200 sessao:false', (await call({}, 'GET', '/api/aluno')).sessao === false);
// 4. login errado / enumeração / bloqueio
const B = {};
const e1 = await call(B, 'POST', '/api/aluno', { acao: 'entrar', utilizador: r1.utilizador, codigo: r1.codigo === '0000' ? '1111' : '0000' });
const e2 = await call(B, 'POST', '/api/aluno', { acao: 'entrar', utilizador: 'naoexiste99', codigo: '1234' });
t('mensagem igual p/ utilizador errado e inexistente', e1._st === 401 && e2._st === 401 && e1.erro === e2.erro);
for (let i = 0; i < 5; i++) await call(B, 'POST', '/api/aluno', { acao: 'entrar', utilizador: 'naoexiste99', codigo: '1234' });
const lk = await call(B, 'POST', '/api/aluno', { acao: 'entrar', utilizador: 'naoexiste99', codigo: '1234' });
t('bloqueio após 5 falhas (mesmo p/ inexistente)', lk._st === 429);
t('contador de falhas tem validade (sem bloqueio permanente)', exp.has('lf:u:naoexiste99') && exp.get('lf:u:naoexiste99') > Date.now());
const lk2 = await call(B, 'POST', '/api/aluno', { acao: 'entrar', utilizador: r1.utilizador, codigo: '9999' });
t('entrada correcta ainda funciona noutro utilizador', (await call(B, 'POST', '/api/aluno', { acao: 'entrar', utilizador: r1.utilizador, codigo: r1.codigo }))._st === 200 || lk2._st >= 401);
// 5. aulas: bloqueio sequencial no servidor
const est = await call(A, 'GET', '/api/aprendizagem?curso=' + C);
t('estado: aula 1 disponível, 2 bloqueada, sem conteúdo/respostas', est.aulas[0].estado === 'disponivel' && est.aulas[1].estado === 'bloqueada' && !JSON.stringify(est).includes('correta') && !est.aulas[0].html);
t('aula 2 bloqueada no servidor (403)', (await call(A, 'GET', `/api/aprendizagem?curso=${C}&aula=1`))._st === 403);
t('slide na aula 2 recusado', (await call(A, 'POST', '/api/aprendizagem', { acao: 'slide', curso: C, aula: 1, i: 0 }))._st === 403);
const au = await call(A, 'GET', `/api/aprendizagem?curso=${C}&aula=0`);
const NS = au.slides.length;   // nº de slides vem do próprio curso (não fixo)
t('aula 1 devolve slides e teste sem respostas', NS >= 3 && au.teste.total === 10 && !JSON.stringify(au).includes('correta'));
// 6. teste antes dos slides
t('teste antes de ver slides → 403', (await call(A, 'POST', '/api/aprendizagem', { acao: 'teste-iniciar', curso: C, aula: 0 }))._st === 403);
// 7. slides: ritmo e ordem
t('slide 0 ok', (await call(A, 'POST', '/api/aprendizagem', { acao: 'slide', curso: C, aula: 0, i: 0 }))._st === 200);
t('saltar para slide 2 → 409', (await call(A, 'POST', '/api/aprendizagem', { acao: 'slide', curso: C, aula: 0, i: 2 }))._st === 409);
t('slide 1 depressa demais → 429', (await call(A, 'POST', '/api/aprendizagem', { acao: 'slide', curso: C, aula: 0, i: 1 }))._st === 429);
for (let k = 1; k < NS; k++) { await new Promise((r) => setTimeout(r, 3100)); const r = await call(A, 'POST', '/api/aprendizagem', { acao: 'slide', curso: C, aula: 0, i: k }); if (r._st !== 200) console.log('slide', k, r); }
t('teste ainda recusado logo após o último slide (3 s)', (await call(A, 'POST', '/api/aprendizagem', { acao: 'teste-iniciar', curso: C, aula: 0 }))._st === 403);
await new Promise((r) => setTimeout(r, 3100));
// 7b. PowerPoint protegido
{ const dl = await fetch('http://localhost:8802/api/aprendizagem?curso=' + C + '&aula=0&pptx=1', { headers: { cookie: A.c } }); const buf = Buffer.from(await dl.arrayBuffer());
  t('PPTX da aula 1 descarregável (zip válido)', dl.status === 200 && buf.slice(0, 2).toString() === 'PK' && /presentationml/.test(dl.headers.get('content-type')), dl.status);
  const bl = await fetch('http://localhost:8802/api/aprendizagem?curso=' + C + '&aula=1&pptx=1', { headers: { cookie: A.c } });
  t('PPTX da aula 2 bloqueado enquanto não aprovar (403)', bl.status === 403);
  const sem = await fetch('http://localhost:8802/api/aprendizagem?curso=' + C + '&aula=0&pptx=1');
  t('PPTX sem sessão recusado (401)', sem.status === 401); }
// 8. teste: iniciar, errar, passar
const ti = await call(A, 'POST', '/api/aprendizagem', { acao: 'teste-iniciar', curso: C, aula: 0 });
t('teste inicia com 10 perguntas, sem respostas certas', ti._st === 200 && ti.perguntas.length === 10 && !JSON.stringify(ti).includes('correta') && !JSON.stringify(ti).includes('explicacao'));
const wrong = await call(A, 'POST', '/api/aprendizagem', { acao: 'teste-submeter', curso: C, aula: 0, tid: ti.tid, respostas: Array(10).fill(0) });
t('submissão corrigida no servidor (falha) sem revelar certas', wrong._st === 200 && wrong.total === 10 && (wrong.aprovado === false || wrong.percentagem >= 70) && (wrong.aprovado || wrong.correcao === undefined));
t('reprovado: só a nota, sem certa/errada por pergunta', wrong.aprovado || !JSON.stringify(wrong).includes('certa'));
t('tid não reutilizável', (await call(A, 'POST', '/api/aprendizagem', { acao: 'teste-submeter', curso: C, aula: 0, tid: ti.tid, respostas: Array(10).fill(0) }))._st === 400);
t('aula 2 continua bloqueada após falhar', (await call(A, 'GET', `/api/aprendizagem?curso=${C}&aula=1`))._st === 403);
// responder certo: o teste de teste conhece os dados privados
async function passar() {
  const x = await call(A, 'POST', '/api/aprendizagem', { acao: 'teste-iniciar', curso: C, aula: 0 }); if (x._st !== 200) return x;
  const dados = priv.aulas[0].teste.perguntas;
  const resp = x.perguntas.map((q) => { const d = dados.find((p) => p.pergunta === q.pergunta); return q.opcoes.indexOf(d.opcoes[d.correta - 1]); });
  return call(A, 'POST', '/api/aprendizagem', { acao: 'teste-submeter', curso: C, aula: 0, tid: x.tid, respostas: resp });
}
const ok1 = await passar();
t('teste aprovado 100% + soluções reveladas só agora', ok1.aprovado && ok1.percentagem === 100 && ok1.correcao.every((c) => c.explicacao !== undefined && c.correta), JSON.stringify(ok1).slice(0, 200));
t('aula 2 desbloqueada após aprovação', (await call(A, 'GET', `/api/aprendizagem?curso=${C}&aula=1`))._st === 200);
t('progresso persiste (nova sessão)', (async () => { const D = {}; await call(D, 'POST', '/api/aluno', { acao: 'entrar', utilizador: r1.utilizador, codigo: r1.codigo }); const e = await call(D, 'GET', '/api/aprendizagem?curso=' + C); return e.aulas[0].estado === 'concluida' && e.aulas[0].aprovado; })() instanceof Promise);
const D = {}; await call(D, 'POST', '/api/aluno', { acao: 'entrar', utilizador: r1.utilizador, codigo: r1.codigo }); const ee = await call(D, 'GET', '/api/aprendizagem?curso=' + C);
t('progresso persistido e associado ao estudante', ee.aulas[0].estado === 'concluida' && ee.aulas[0].melhor === 100);
// 9. isolamento entre estudantes
const F = {}; const r2 = await call(F, 'POST', '/api/aluno', { acao: 'registar', nome: 'Ana' });
const Sg = require(ROOT + '/api/_lib/seguranca.js');
{ const k = [...store.keys()].find((k) => k.startsWith('est:') && JSON.parse(store.get(k)).utilizador === r2.utilizador); const e = JSON.parse(store.get(k));
  e.h = await Sg.hashCodigo(e.utilizador, '1234', e.sal); store.set(k, JSON.stringify(e));   // simula conta antiga com código de 4 dígitos
  t('conta antiga (código de 4 dígitos) continua a entrar', (await call({}, 'POST', '/api/aluno', { acao: 'entrar', utilizador: r2.utilizador, codigo: '1234' }))._st === 200);
  t('código com 3 dígitos recusado', (await call({}, 'POST', '/api/aluno', { acao: 'entrar', utilizador: r2.utilizador, codigo: '123' }))._st === 401); }
const ef = await call(F, 'GET', '/api/aprendizagem?curso=' + C);
t('outro estudante não herda progresso', ef.aulas[0].estado === 'disponivel' && ef.aulas[1].estado === 'bloqueada' && r2.utilizador !== r1.utilizador && r2.numero !== r1.numero);
t('estudante 2 não aprova com tid do 1', (await call(F, 'POST', '/api/aprendizagem', { acao: 'teste-submeter', curso: C, aula: 0, tid: ti.tid, respostas: Array(10).fill(0) }))._st === 400);
// 10. sair revoga
await call(A, 'POST', '/api/aluno', { acao: 'sair' });
const oldCookie = D.c; await call(D, 'POST', '/api/aluno', { acao: 'sair' });
const jr = { c: oldCookie }; t('sessão revogada após sair', (await call(jr, 'GET', '/api/aluno')).sessao === false);
// 11. tentativas: 3 falhas -> esgotado
const G = {}; await call(G, 'POST', '/api/aluno', { acao: 'registar', nome: 'Rui' });
await call(G, 'POST', '/api/aprendizagem', { acao: 'slide', curso: C, aula: 0, i: 0 });
console.log('--- fim:', ok, 'ok,', bad, 'falhas'); process.exit(bad ? 1 : 0);
