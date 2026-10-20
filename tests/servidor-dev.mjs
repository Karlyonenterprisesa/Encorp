/* Servidor local para experimentar o site com contas e cursos: node tests/servidor-dev.mjs  (corre antes: node build.mjs)
   Usa um Redis simulado em memória. ENCORP_MIN_SLIDE_MS=4000 encurta o tempo mínimo dos slides (só para testes). Abre http://localhost:8810 */
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import { createRequire } from 'node:module'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), require = createRequire(import.meta.url);
const store = new Map(), exp = new Map(), live = (k) => { if (exp.has(k) && exp.get(k) < Date.now()) { store.delete(k); exp.delete(k); } return store.has(k); };
http.createServer((q, s) => { let b = ''; q.on('data', (c) => b += c); q.on('end', () => {
  const [c, k, ...a] = JSON.parse(b); let r = null;
  if (c === 'GET') r = live(k) ? store.get(k) : null;
  else if (c === 'SET') { const nx = a.includes('NX'), i = a.indexOf('EX'); if (nx && live(k)) r = null; else { store.set(k, a[0]); if (i > -1) exp.set(k, Date.now() + Number(a[i + 1]) * 1000); r = 'OK'; } }
  else if (c === 'DEL') { r = live(k) ? 1 : 0; store.delete(k); }
  else if (c === 'INCR') { r = (live(k) ? Number(store.get(k)) : 0) + 1; store.set(k, String(r)); }
  else if (c === 'EVAL') { const key = a[1]; r = (live(key) ? Number(store.get(key)) : 0) + 1; store.set(key, String(r)); if (r === 1 || !exp.has(key)) exp.set(key, Date.now() + Number(a[2]) * 1000); }
  else if (c === 'EXPIRE') { exp.set(k, Date.now() + Number(a[0]) * 1000); r = 1; }
  s.setHeader('content-type', 'application/json'); s.end(JSON.stringify({ result: r })); }); }).listen(8811);
process.env.KV_REST_API_URL = 'http://localhost:8811'; process.env.KV_REST_API_TOKEN = 't'; process.env.SESSION_SECRET = process.env.SESSION_SECRET || 'x'.repeat(40);
const aluno = require(ROOT + '/api/aluno.js'), apr = require(ROOT + '/api/aprendizagem.js');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.mp4': 'video/mp4' };
http.createServer((q, s) => {
  const u = new URL(q.url, 'http://x'); if (u.pathname.startsWith('/api/aluno')) return aluno(q, s); if (u.pathname.startsWith('/api/aprendizagem')) return apr(q, s);
  let f = path.join(ROOT, decodeURIComponent(u.pathname)); if (!f.startsWith(ROOT) || f.includes('_dados')) { s.statusCode = 403; return s.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { s.statusCode = 404; return s.end('404'); }
  s.setHeader('content-type', MIME[path.extname(f)] || 'application/octet-stream'); s.end(fs.readFileSync(f));
}).listen(Number(process.env.PORT) || 8810, () => console.log('ENCORP local: http://localhost:' + (process.env.PORT || 8810)));
