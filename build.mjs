/* ENCORP — build (corre na Vercel em cada publicação:  node build.mjs).
   Lê conteudo/<tipo>/*.json (gravado pelo Decap CMS) e gera: páginas de dicas, biblioteca, cursos, aulas e testes,
   hubs de navegação, a zona «Dicas e Actualidades» da página inicial, pesquisa, conteudo.json, feed.xml e sitemap.xml.
   Sem dependências. Node 18+. */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, unlinkSync, copyFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { FICHA } from './tools/ficha-curso.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const R = (...p) => join(ROOT, ...p);
const read = (p) => readFileSync(R(p), 'utf8');
const write = (p, s) => { mkdirSync(dirname(R(p)), { recursive: true }); writeFileSync(R(p), s); };
const TIPOS = {
  dicas:      { nome: 'Dicas e Actualidades de Saúde', sing: 'Publicação', base: 'dicas/', lead: 'Dicas, artigos e notícias de saúde, para o público e para quem cuida.' },
  biblioteca: { nome: 'Biblioteca', sing: 'Documento', base: 'biblioteca/', lead: 'Manuais, listas de medicamentos, processo de enfermagem e fichas em PDF, para consultar e descarregar.' },
  cursos:     { nome: 'Cursos', sing: 'Curso', base: 'cursos/', lead: 'Cursos, video-aulas e testes para estudar e praticar enfermagem.' },
  videoaulas: { nome: 'Video-aulas', sing: 'Video-aula', base: 'cursos/aulas/', lead: 'Video-aulas de enfermagem, para ver ao seu ritmo.' },
  testes:     { nome: 'Testes', sing: 'Teste', base: 'cursos/testes/', lead: 'Testes com correção imediata para praticar e avaliar o que aprendeu.' },
};
/* cada tipo tem a sua pasta: /dicas/x.html, /biblioteca/x.html, /cursos/x.html, /cursos/aulas/x.html, /cursos/testes/x.html */
const walk = (dir, out = []) => {
  for (const e of readdirSync(R(dir), { withFileTypes: true })) {
    if (['node_modules', '.git', 'admin', 'api', 'vendor', 'img', 'pdf', 'uploads', 'js', 'css', 'conteudo', 'templates'].includes(e.name) && dir === '') continue;
    const rel = dir ? dir + '/' + e.name : e.name;
    if (e.isDirectory()) walk(rel, out); else if (e.name.endsWith('.html')) out.push(rel);
  }
  return out;
};
const urlDe = (f) => '/' + (f === 'index.html' ? '' : f.endsWith('/index.html') ? f.slice(0, -10) : f);

/* ---------- utilitários ---------- */
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const enc = encodeURIComponent;
const jsonSafe = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
const fmtData = (d) => {
  const x = new Date(String(d).slice(0, 10) + 'T12:00:00Z');
  return isNaN(x) ? '' : x.toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
};
const ytId = (v) => {
  const m = String(v || '').trim().match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/) || String(v || '').trim().match(/^([\w-]{11})$/);
  return m ? m[1] : '';
};
const safeUrl = (u) => (/^(https?:\/\/|\/|#|mailto:)/i.test(u) ? u : '#');

/* ---------- markdown mínimo (o que o Decap produz) ---------- */
function inline(t) {
  t = esc(t);
  t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_, a, u) => `<img src="${esc(safeUrl(u.replace(/&amp;/g, '&')))}" alt="${a}" loading="lazy">`);
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, a, u) => `<a href="${esc(safeUrl(u.replace(/&amp;/g, '&')))}"${/^https?:/i.test(u) ? ' target="_blank" rel="noopener"' : ''}>${a}</a>`);
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>').replace(/`([^`]+)`/g, '<code>$1</code>');
  return t;
}
function md(src) {
  /* markdown simples: títulos, listas, citações, TABELAS e parágrafos; um bloco pode misturar vários (ex.: frase + lista) */
  const blocks = String(src || '').replace(/\r/g, '').trim().split(/\n{2,}/).filter(Boolean);
  const tipo = (l) => (/^\s*#{1,6}\s+/.test(l) ? 'h' : /^\s*[-*]\s+/.test(l) ? 'ul' : /^\s*\d+[.)]\s+/.test(l) ? 'ol' : /^>\s?/.test(l) ? 'q' : /^\s*\|/.test(l) ? 'tb' : 'p');
  const cels = (l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
  return blocks.map((b) => {
    if (/^\s*</.test(b)) return b;                                   // HTML escrito no editor passa tal e qual
    const L = b.split('\n'), out = [];
    for (let i = 0; i < L.length;) {
      const t = tipo(L[i]); let j = i + 1;
      if (t !== 'h') while (j < L.length && tipo(L[j]) === t) j++;
      const g = L.slice(i, j); i = j;
      if (t === 'h') { const h = g[0].match(/^\s*(#{1,6})\s+(.*)$/), n = Math.min(h[1].length + 1, 6); out.push(`<h${n}>${inline(h[2])}</h${n}>`); }
      else if (t === 'ul') out.push(`<ul>${g.map((l) => `<li>${inline(l.replace(/^\s*[-*]\s+/, ''))}</li>`).join('')}</ul>`);
      else if (t === 'ol') out.push(`<ol>${g.map((l) => `<li>${inline(l.replace(/^\s*\d+[.)]\s+/, ''))}</li>`).join('')}</ol>`);
      else if (t === 'q') out.push(`<blockquote>${g.map((l) => inline(l.replace(/^>\s?/, ''))).join('<br>')}</blockquote>`);
      else if (t === 'tb') {
        const linhas = g.map(cels).filter((r) => !r.every((c) => /^:?-{2,}:?$/.test(c)));
        const [cab, ...resto] = linhas;
        out.push(`<table><thead><tr>${cab.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead><tbody>${resto.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
      } else out.push(`<p>${g.map(inline).join('<br>')}</p>`);
    }
    return out.join('\n');
  }).join('\n');
}
const site = existsSync(R('conteudo/site.json')) ? JSON.parse(read('conteudo/site.json')) : {};
const SITE = (site.siteUrl || 'https://encorp.vercel.app').replace(/\/+$/, '');
const abs = (u) => (!u ? '' : /^https?:/i.test(u) ? u : SITE + (u.startsWith('/') ? '' : '/') + u);
const usados = new Set();
const urlItem = (tipo, slug) => {
  let u = `/${TIPOS[tipo].base}${slug}.html`, n = 2;
  while (usados.has(u)) u = `/${TIPOS[tipo].base}${slug}-${n++}.html`;
  usados.add(u); return u;
};

const itens = [];
for (const tipo of Object.keys(TIPOS)) {
  const dir = R('conteudo', tipo);
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    let d;
    try { d = JSON.parse(readFileSync(join(dir, f), 'utf8')); } catch (e) { console.warn('JSON inválido, ignorado:', tipo + '/' + f); continue; }
    if (d.publicado === false || !d.titulo) continue;
    const slug = f.replace(/\.json$/, '').replace(/^\d{4}-\d{2}-\d{2}-/, '');
    const yt = ytId(d.youtube);
    itens.push({
      tipo, slug, url: urlItem(tipo, slug), categoria: d.categoria || '', titulo: d.titulo, resumo: d.resumo || '', data: String(d.data || '').slice(0, 10),
      imagem: d.imagem || (yt ? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` : ''), etiquetas: d.etiquetas || [],
      youtube: yt, video: String(d.video || ''), ficheiro: d.ficheiro || '', fonte: d.fonte || '', fonte_url: d.fonte_url || '', autor: d.autor || '',
      og: abs(d.imagem) || (yt ? `https://i.ytimg.com/vi/${yt}/hqdefault.jpg` : ''), corpo: d.corpo || '',
      chave: f.replace(/\.json$/, ''), curso: String(d.curso || ''), nivel: d.nivel || '', area: d.area || '', duracao: d.duracao || '', instrutor: d.instrutor || '',
      preco: d.preco || '', link_inscricao: d.link_inscricao || '', modo: d.modo === 'progressivo' ? 'progressivo' : 'livre', permitirDownload: d.permitir_download !== false, ordem: Number(d.ordem) || 0, aprovacao: Math.min(100, Math.max(1, Number(d.aprovacao) || 50)),
      notaMinima: Math.min(100, Math.max(1, Number(d.nota_minima) || 70)), tentativas: Number.isInteger(Number(d.tentativas)) && d.tentativas !== '' && d.tentativas !== null && d.tentativas !== undefined ? Math.max(0, Number(d.tentativas)) : 3, esperaMinutos: Number.isFinite(Number(d.espera_minutos)) && d.espera_minutos !== '' && d.espera_minutos != null ? Math.max(0, Number(d.espera_minutos)) : 30, sequencial: d.sequencial !== false,
      aulas: (Array.isArray(d.aulas) ? d.aulas : []).filter((a) => a && a.titulo).map((a, n) => ({ titulo: a.titulo, youtube: ytId(a.youtube), video: String(a.video || ''), duracao: a.duracao || '', resumo: a.resumo || '', ordem: n + 1,
        conteudo: String(a.conteudo || ''), videoObrig: a.video_obrigatorio === true, permitirPptx: a.permitir_pptx !== false,
        slides: (Array.isArray(a.slides) ? a.slides : []).filter((s) => s && (s.titulo || s.texto)).map((s) => ({ titulo: String(s.titulo || ''), texto: String(s.texto || ''), imagem: String(s.imagem || ''), tipo: String(s.tipo || 'conteudo'), notas: String(s.notas || '') })),
        teste: a.teste && Array.isArray(a.teste.perguntas) && a.teste.perguntas.length ? { notaMinima: Math.min(100, Math.max(0, Number(a.teste.nota_minima) || 0)), tentativas: a.teste.tentativas === '' || a.teste.tentativas == null ? undefined : Math.max(0, Number(a.teste.tentativas)), perguntas: a.teste.perguntas.map((q) => ({ pergunta: String(q.pergunta || ''), opcoes: (Array.isArray(q.opcoes) ? q.opcoes : []).map(String).filter(Boolean), correta: Number(q.correta) || 0, explicacao: String(q.explicacao || '') })) } : null })),
      perguntas: (Array.isArray(d.perguntas) ? d.perguntas : []).map((q) => ({ pergunta: String(q.pergunta || ''), opcoes: (Array.isArray(q.opcoes) ? q.opcoes : []).map(String).filter(Boolean), correta: Number(q.correta) || 1, explicacao: String(q.explicacao || '') }))
        .filter((q) => q.pergunta && q.opcoes.length >= 2 && q.correta >= 1 && q.correta <= q.opcoes.length),
    });
  }
}
itens.sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : a.titulo.localeCompare(b.titulo, 'pt')));   /* mais recentes primeiro */
/* ---------- regra dos 10: todo o teste (de aula ou autónomo) tem exactamente 10 perguntas válidas ---------- */
{
  const erros = [];
  const valida = (nome, ps) => {
    if (ps.length !== 10) erros.push(`${nome}: tem ${ps.length} perguntas; precisa de exactamente 10.`);
    ps.forEach((q, n) => { if (!q.pergunta || q.opcoes.length < 2 || q.opcoes.length > 6 || !(q.correta >= 1 && q.correta <= q.opcoes.length)) erros.push(`${nome}, pergunta ${n + 1}: enunciado, 2 a 6 opções e resposta certa válida são obrigatórios.`); });
  };
  for (const it of itens) {
    if (it.tipo === 'testes') valida(`Teste «${it.titulo}»`, it.perguntas);
    if (it.tipo === 'cursos') it.aulas.forEach((a, n) => { if (a.teste) valida(`Curso «${it.titulo}», aula ${n + 1} «${a.titulo}»`, a.teste.perguntas); });
  }
  if (erros.length) { console.error('ERRO nos testes:\n - ' + erros.join('\n - ')); process.exit(1); }
}
{ /* biblioteca: entradas repetidas (mesmo título e mesmo PDF) mostram-se uma só vez; fica a mais antiga, que já tem endereço publicado */
  const vistos = new Map();
  for (const it of [...itens].sort((x, y) => (x.chave < y.chave ? -1 : 1))) {   /* pelo nome do ficheiro: o mais antigo fica */
    if (it.tipo !== 'biblioteca') continue;
    const k = it.titulo.trim().toLowerCase() + '|' + it.ficheiro;
    if (vistos.has(k)) { itens.splice(itens.indexOf(it), 1); console.warn('Biblioteca: entrada repetida ignorada (apague-a no CMS):', it.chave); } else vistos.set(k, it);
  }
}
/* biblioteca: só PDF */
for (let i = itens.length - 1; i >= 0; i--) {
  const it = itens[i];
  if (it.tipo === 'biblioteca' && !/\.pdf(\?|#|$)/i.test(it.ficheiro)) { console.warn('Biblioteca: ignorado (não é PDF):', it.titulo); itens.splice(i, 1); }
}
/* itens apagados no CMS: remove a página antiga (só as que este build gerou, listadas no conteudo.json anterior) */
{
  const prev = []; try { for (const i of JSON.parse(read('conteudo.json')).itens) prev.push(i.url); } catch (e) { /* primeira vez */ }
  const novos = new Set(itens.map((i) => i.url));
  for (const u of prev) if (!novos.has(u) && u.endsWith('.html') && !u.endsWith('/index.html') && Object.values(TIPOS).some((T) => u.startsWith('/' + T.base)) && existsSync(R(u.slice(1)))) unlinkSync(R(u.slice(1)));
}

/* ligações curso <-> video-aulas <-> testes (o campo «curso» pode ser o nome do ficheiro, o endereço ou o título) */
const norm = (v) => String(v || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const listaCursos = itens.filter((i) => i.tipo === 'cursos');
const achaCurso = (v) => { const k = norm(v); return k ? listaCursos.find((c) => [c.chave, c.chave.replace(/^\d{4}-\d{2}-\d{2}-/, ''), c.slug, c.titulo].some((x) => norm(x) === k)) || null : null; };
const cursoDe = new Map();
for (const it of itens) if (it.tipo === 'videoaulas' || it.tipo === 'testes') { const c = achaCurso(it.curso); if (c) cursoDe.set(it, c); }
/* aulas de um curso: as escritas dentro do curso (ordem 1, 2, 3…) + as video-aulas que apontam para ele (campo «ordem») */
const aulasDe = (c) => [
  ...c.aulas.map((a) => ({ ...a, item: null })),
  ...itens.filter((v) => v.tipo === 'videoaulas' && cursoDe.get(v) === c).map((v) => ({ titulo: v.titulo, youtube: v.youtube, video: v.video, duracao: v.duracao, resumo: v.resumo, ordem: v.ordem || 999, item: v })),
].sort((a, b) => a.ordem - b.ordem);
const testesDe = (c) => itens.filter((t) => t.tipo === 'testes' && cursoDe.get(t) === c);
for (const it of itens) {
  const c = cursoDe.get(it);
  if (it.tipo === 'cursos') it.meta = [it.nivel, it.duracao, `${aulasDe(it).length} aula${aulasDe(it).length === 1 ? '' : 's'}`, it.preco || 'Gratuito'].filter(Boolean).join(' · ');
  if (it.tipo === 'videoaulas') it.meta = [c ? c.titulo : '', it.duracao].filter(Boolean).join(' · ');
  if (it.tipo === 'testes') it.meta = [`${it.perguntas.length} pergunta${it.perguntas.length === 1 ? '' : 's'}`, it.nivel].filter(Boolean).join(' · ');
}
/* uma secção «tem conteúdo» se houver itens do tipo; o hub /cursos.html conta também video-aulas e testes */
const temConteudo = (t) => itens.some((i) => (t === 'cursos' ? ['cursos', 'videoaulas', 'testes'] : [t]).includes(i.tipo));
/* ---------- modelo de página ---------- */
const CSS = read('templates/style.css') + '.vf{display:block;width:100%;max-height:80vh;background:#000;border-radius:12px;margin:14px 0}';
const vtype = (u) => (/\.webm(\?|$)/i.test(u) ? 'video/webm' : /\.og[gv](\?|$)/i.test(u) ? 'video/ogg' : 'video/mp4');
/* leitor: YouTube (embutido, o visitante não sai do site) ou ficheiro de vídeo carregado no CMS */
const player = (o, titulo) => o.youtube ? `<div class="vid"><iframe src="https://www.youtube-nocookie.com/embed/${esc(o.youtube)}" title="${esc(titulo)}" loading="lazy" allow="encrypted-media;picture-in-picture;fullscreen" allowfullscreen></iframe></div>`
  : o.video ? `<video class="vf" controls preload="metadata" playsinline${o.imagem ? ` poster="${esc(o.imagem)}"` : ''}><source src="${esc(o.video)}" type="${vtype(o.video)}">O seu navegador não suporta vídeo. <a href="${esc(o.video)}">Descarregar o vídeo</a>.</video>` : '';
const HEADER = read('templates/header.html');
const FOOTER = read('templates/footer.html');

function head({ titulo, desc, path, img, tipoOg = 'website', ld, extraCss = '', robots = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1' }) {
  /* títulos até ~65 caracteres (o Google corta o resto): a marca só entra se couber; descrições até 160 caracteres, cortadas numa palavra inteira */
  desc = String(desc || '').replace(/\s+/g, ' ').trim();
  if (desc.length > 160) { const c = desc.slice(0, 158).replace(/\s+\S*$/, '').replace(/[\s,;:.\-–—(]+$/, ''); desc = c + '…'; }
  const url = SITE + path, t = (`${titulo} | ENCORP`.length <= 68 ? `${titulo} | ENCORP` : titulo), im = img || SITE + '/og-image.jpg';
  return `<!DOCTYPE html><html lang="pt-MZ"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${esc(t)}</title><meta name="description" content="${esc(desc)}"><meta name="robots" content="${robots}"><link rel="canonical" href="${esc(url)}"><meta property="og:site_name" content="ENCORP"><meta property="og:locale" content="pt_MZ"><meta property="og:type" content="${tipoOg}"><meta property="og:title" content="${esc(t)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${esc(url)}"><meta property="og:image" content="${esc(im)}"><meta property="og:image:alt" content="${esc(titulo)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(t)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${esc(im)}"><meta name="theme-color" content="#0b1a33"><meta name="color-scheme" content="light"><link rel="icon" href="/favicon.ico?v=2" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2"><link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=2"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2"><link rel="manifest" href="/manifest.json"><link rel="alternate" type="application/rss+xml" title="ENCORP" href="/feed.xml">${ld ? `<script type="application/ld+json">${jsonSafe(ld)}</script>` : ''}<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap"><style>${CSS}${extraCss}</style><link rel="stylesheet" href="/css/sbb.css"></head>`;
}
const page = (h, main) => `${h}<body>${HEADER}<main>${main}</main>${FOOTER}<script src="/js/site/site.js" defer></script></body></html>`;
/* ---------- botões de partilha: ícones originais das redes (WhatsApp, Facebook, Telegram, X, LinkedIn, Instagram), email, copiar e partilha nativa ---------- */
const BRAND = {
  wa: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z',
  fb: 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z',
  tg: 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z',
  x: 'M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z',
  li: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  ig: 'M7.03.084c-1.277.06-2.149.264-2.91.563a5.9 5.9 0 0 0-2.124 1.388 5.9 5.9 0 0 0-1.38 2.127C.321 4.926.12 5.8.064 7.076s-.069 1.688-.063 4.947.021 3.667.083 4.947c.061 1.277.264 2.149.563 2.911.308.789.72 1.457 1.388 2.123a5.9 5.9 0 0 0 2.129 1.38c.763.295 1.636.496 2.913.552 1.278.056 1.689.069 4.947.063s3.668-.021 4.947-.082c1.28-.06 2.147-.265 2.91-.563a5.9 5.9 0 0 0 2.123-1.388 5.9 5.9 0 0 0 1.38-2.129c.295-.763.496-1.636.551-2.912.056-1.28.07-1.69.063-4.948-.006-3.258-.02-3.667-.081-4.947-.06-1.28-.264-2.148-.564-2.911a5.9 5.9 0 0 0-1.387-2.123 5.86 5.86 0 0 0-2.128-1.38C19.074.322 18.202.12 16.924.066 15.647.009 15.236-.006 11.977 0S8.31.021 7.03.084m.14 21.693c-1.17-.05-1.805-.245-2.228-.408a3.7 3.7 0 0 1-1.382-.895 3.7 3.7 0 0 1-.9-1.378c-.165-.423-.363-1.058-.417-2.228-.06-1.264-.072-1.644-.08-4.848-.006-3.204.006-3.583.061-4.848.05-1.169.246-1.805.408-2.228.216-.561.477-.96.895-1.382a3.7 3.7 0 0 1 1.379-.9c.423-.165 1.057-.361 2.227-.417 1.265-.06 1.644-.072 4.848-.08 3.203-.006 3.583.006 4.85.062 1.168.05 1.804.244 2.227.408.56.216.96.475 1.382.895s.681.817.9 1.378c.165.422.362 1.056.417 2.227.06 1.265.074 1.645.08 4.848.005 3.203-.006 3.583-.061 4.848-.051 1.17-.245 1.805-.408 2.23-.216.56-.477.96-.896 1.38a3.7 3.7 0 0 1-1.378.9c-.422.165-1.058.362-2.226.418-1.266.06-1.645.072-4.85.079s-3.582-.006-4.848-.06m9.783-16.192a1.44 1.44 0 1 0 1.437-1.442 1.44 1.44 0 0 0-1.437 1.442M5.839 12.012a6.161 6.161 0 1 0 12.323-.024 6.162 6.162 0 0 0-12.323.024M8 12.008A4 4 0 1 1 12.008 16 4 4 0 0 1 8 12.008',
};
const brandSvg = (k) => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${BRAND[k]}"/></svg>`;
const ST = (inner) => `<svg class="st" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${inner}</svg>`;
const ICO_SHARE = ST('<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>');
const ICO_MAIL = ST('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>');
const ICO_LINK = ST('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>');
const share = (url, titulo) => {
  const a = (cls, nome, href, ico) => `<a class="${cls}" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${nome}" title="${nome}">${ico}</a>`;
  const dd = `data-title="${esc(titulo)}" data-url="${esc(url)}"`;
  return `<div class="ec-share" data-v="2" role="group" aria-label="Partilhar"><button type="button" class="nat" data-share ${dd} aria-label="Partilhar" title="Partilhar">${ICO_SHARE}</button>`
    + a('wa', 'WhatsApp', `https://wa.me/?text=${enc(titulo + ' ' + url)}`, brandSvg('wa'))
    + a('fb', 'Facebook', `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, brandSvg('fb'))
    + `<button type="button" class="ig" data-ig ${dd} aria-label="Instagram (copia o link)" title="Instagram (copia o link)">${brandSvg('ig')}</button>`
    + a('tg', 'Telegram', `https://t.me/share/url?url=${enc(url)}&text=${enc(titulo)}`, brandSvg('tg'))
    + a('x', 'X', `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(titulo)}`, brandSvg('x'))
    + a('li', 'LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, brandSvg('li'))
    + `<a class="em" href="mailto:?subject=${enc(titulo)}&body=${enc(url)}" aria-label="Email" title="Email">${ICO_MAIL}</a>`
    + `<button type="button" class="cp" data-copy ${dd} aria-label="Copiar link" title="Copiar link">${ICO_LINK}</button></div>`;
};

const hero = `<div class="hero"><img src="/og-image.jpg" alt="ENCORP — Mais conhecimento, melhor cuidado" width="1200" height="630" decoding="async"></div>`;
const EDU_CSS = read('templates/educacao.css');
const PLAYER_CSS = read('templates/player.css');
function paginaEducacao(it, url) {
  const T = TIPOS[it.tipo], c = cursoDe.get(it);
  const cursoLink = c ? ` · <a href="${esc(c.url)}">${esc(c.titulo)}</a>` : '';
  const tags = it.etiquetas.length ? `<p>${it.etiquetas.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</p>` : '';
  const capa = it.imagem && !it.youtube && !it.video ? `<p><img src="${esc(it.imagem)}" alt="${esc(it.titulo)}" loading="lazy" decoding="async"></p>` : '';
  const cta = `<div class="cta"><b>Quer continuar a aprender?</b><br><a class="btn" href="/cursos/">Ver cursos, aulas e testes</a><a class="btn alt" href="/">Abrir a app</a></div>`;
  const ldBase = { '@context': 'https://schema.org', inLanguage: 'pt-MZ', url, ...(it.og ? { image: it.og } : {}), provider: { '@type': 'Organization', name: 'ENCORP', url: SITE + '/' } };
  if (it.tipo === 'cursos') ldBase.provider = [ldBase.provider, { '@type': 'Organization', name: FICHA.instituicao, alternateName: FICHA.instituicaoLema }];
  let main = '', ld, extraCss = EDU_CSS, extraJs = '';
  if (it.tipo === 'cursos') {
    const aulas = aulasDe(it), testes = testesDe(it);
    const gratis = !it.preco;
    const insc = it.link_inscricao ? `<p><a class="btn" href="${esc(safeUrl(it.link_inscricao))}" target="_blank" rel="noopener">Inscrever-se / pedir informações</a></p>`
      : (!gratis && site.contactEmail) ? `<p><a class="btn" href="mailto:${esc(site.contactEmail)}?subject=${enc('Curso: ' + it.titulo)}">Pedir informações</a></p>` : '';
    const pills = [it.nivel, it.area, it.duracao, 'CPD'].filter(Boolean).map((x) => `<span class="pill">${esc(x)}</span>`).join('') + `<span class="pill${it.preco ? '' : ' free'}">${esc(it.preco || 'Gratuito')}</span>`;
    const lista = aulas.length ? `<h2>Aulas (${aulas.length})</h2><ol class="aulas">${aulas.map((a, n) => `<li class="aula"><b>${n + 1}. ${esc(a.titulo)}</b>${a.duracao ? ` <span class="meta">· ${esc(a.duracao)}</span>` : ''}${a.resumo ? `<p>${esc(a.resumo)}</p>` : ''}${a.item ? `<a class="btn" href="${esc(a.item.url)}">Abrir aula</a>` : a.youtube ? `<button type="button" class="btn" data-yt="${esc(a.youtube)}">▶ Ver aula</button>` : a.video ? `<button type="button" class="btn" data-vid="${esc(a.video)}">▶ Ver aula</button>` : ''}</li>`).join('')}</ol>` : '';
    const lt = testes.length ? `<h2>Testes deste curso</h2>${testes.map(cardLista).join('')}` : '';
    const prog = it.modo === 'progressivo' && it.aulas.length > 0;
    const playerHtml = `<h2 id="aulas">Aulas (${it.aulas.length})</h2><div id="ec-curso" data-curso="${esc(it.slug)}" data-src="/cursos/dados/${esc(it.slug)}.json"><ol class="aulas">${it.aulas.map((a, n) => `<li class="aula"><b>${n + 1}. ${esc(a.titulo)}</b>${a.duracao ? ` <span class="meta">· ${esc(a.duracao)}</span>` : ''}${a.resumo ? `<p>${esc(a.resumo)}</p>` : ''}</li>`).join('')}</ol><p class="meta">Curso gratuito e livre: sem conta e sem palavra-passe. Cada aula tem slides${it.aulas.some((a) => a.youtube || a.video) ? ', vídeo' : ''} e um teste de 10 perguntas (nota mínima ${it.notaMinima}%).</p><noscript><p>O estudo do curso precisa de JavaScript.</p></noscript></div>`;
const ficha = `<aside class="ec-ficha" aria-label="Ficha do curso"><div class="ec-ficha-logos"><img src="/${FICHA.logoInstituicao}" alt="Logótipo da ${esc(FICHA.instituicao)}" width="72" height="72" loading="lazy"><img src="/${FICHA.logoFormadora}" alt="Logótipo do ${esc(FICHA.entidadeFormadora)}" width="64" height="72" loading="lazy"></div><dl><div><dt>Instituição</dt><dd><b>${esc(FICHA.instituicao)}</b> (${esc(FICHA.instituicaoLema)})</dd></div><div><dt>Entidade formadora</dt><dd><b>${esc(FICHA.entidadeFormadora)}</b></dd></div><div><dt>Tipo de formação</dt><dd>${esc(FICHA.tipo)}: ${esc(FICHA.natureza.toLowerCase())}</dd></div><div><dt>Coordenador</dt><dd>${esc(FICHA.coordenador)}</dd></div></dl></aside>`;
    const iniciar = prog ? `<p class="ec-iniciar-p"><a class="btn ec-iniciar" href="#aulas" data-iniciar>▶ Iniciar curso</a></p>` : '';
    main = `<p class="meta"><a href="/cursos/">Cursos</a> · ${fmtData(it.data)}</p><h1>${esc(it.titulo)}</h1><p class="lead">${esc(it.resumo)}</p><p>${pills}</p>${ficha}${iniciar}${insc}${capa}<article>${md(it.corpo)}</article>${prog ? playerHtml : lista}${lt}${insc}${share(url, it.titulo)}${tags}${cta}`;
    ld = { ...ldBase, '@type': 'Course', name: it.titulo, description: it.resumo };
    extraJs = '<script src="/js/site/video-aulas.js" defer></script>';
    if (prog) { extraCss += PLAYER_CSS; extraJs += '<script src="/js/modulos/leitor-pdf.js" defer></script><script src="/js/site/curso-player.js" defer></script>'; }
  } else if (it.tipo === 'videoaulas') {
    const pdf = it.ficheiro ? `<p><a class="btn" href="${esc(it.ficheiro)}" target="_blank" rel="noopener">Material de apoio (PDF)</a></p>` : '';
    const video = player(it, it.titulo) || '<p>Vídeo indisponível.</p>';
    let seq = '';
    if (c) {
      const pg = aulasDe(c).filter((a) => a.item), i = pg.findIndex((a) => a.item === it);
      const ant = i > 0 ? pg[i - 1].item : null, prox = i > -1 && i < pg.length - 1 ? pg[i + 1].item : null;
      seq = `<div class="seq">${ant ? `<a class="btn alt" href="${esc(ant.url)}">‹ Aula anterior</a>` : ''}<a class="btn alt" href="${esc(c.url)}">Ver o curso</a>${prox ? `<a class="btn" href="${esc(prox.url)}">Aula seguinte ›</a>` : ''}</div>`;
    }
    main = `<p class="meta"><a href="/cursos/aulas/">Video-aulas</a>${cursoLink}${it.duracao ? ` · ${esc(it.duracao)}` : ''} · ${fmtData(it.data)}</p><h1>${esc(it.titulo)}</h1><p class="lead">${esc(it.resumo)}</p>${share(url, it.titulo)}${video}${pdf}<article>${md(it.corpo)}</article>${seq}${tags}${cta}`;
    ld = { ...ldBase, '@type': 'VideoObject', name: it.titulo, description: it.resumo || it.titulo, uploadDate: it.data, ...(it.video ? { contentUrl: abs(it.video) } : {}), ...(it.youtube ? { embedUrl: `https://www.youtube-nocookie.com/embed/${it.youtube}`, thumbnailUrl: `https://i.ytimg.com/vi/${it.youtube}/hqdefault.jpg` } : {}) };
  } else { // testes
    const quiz = it.perguntas.length ? `<div id="quiz"></div><script type="application/json" id="qd">${jsonSafe({ aprovacao: it.aprovacao, perguntas: it.perguntas })}</script><script src="/js/site/quiz.js" defer></script><noscript><p>O teste precisa de JavaScript.</p></noscript>` : '<p>Este teste ainda não tem perguntas.</p>';
    main = `<p class="meta"><a href="/cursos/testes/">Testes</a>${cursoLink} · ${it.perguntas.length} pergunta${it.perguntas.length === 1 ? '' : 's'} · nota mínima ${it.aprovacao}% · ${fmtData(it.data)}</p><h1>${esc(it.titulo)}</h1><p class="lead">${esc(it.resumo)}</p>${share(url, it.titulo)}${capa}<article>${md(it.corpo)}</article>${quiz}${tags}${cta}`;
    ld = { ...ldBase, '@type': 'Quiz', name: it.titulo, description: it.resumo, educationalLevel: it.nivel || undefined };
  }
  return page(head({ titulo: it.titulo, desc: it.resumo || T.lead, path: it.url, img: it.og, tipoOg: 'article', ld, extraCss }), main).replace('</body>', extraJs + '</body>');
}
/* ---------- páginas de cada item ---------- */
const cardLista = (it) => `<a class="card" href="${esc(it.url)}"><b>${esc(it.titulo)}</b>${it.resumo ? `<span>${esc(it.resumo)}</span><br>` : ''}<span>${esc(it.categoria || TIPOS[it.tipo].sing)}${it.meta ? ' · ' + esc(it.meta) : ''} · ${fmtData(it.data)}</span></a>`;
const ICONES = { cursos: '🎓', biblioteca: '📄', videoaulas: '🎬', testes: '✅', dicas: '📰' };
const capaCartao = (it, href) => `<a class="ec-cc-im" href="${esc(href)}" tabindex="-1" aria-hidden="true" data-ic="${ICONES[it.tipo] || ''}">${it.imagem ? `<img src="${esc(it.imagem)}" alt="" width="640" height="400" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.style.display='none'">` : ''}</a>`;
const cardCurso = (it) => {
  const n = aulasDe(it).length, prog = it.modo === 'progressivo';
  const meta = [it.nivel, it.duracao, n ? `${n} aula${n === 1 ? '' : 's'}` : ''].filter(Boolean).map((x) => `<li>${esc(x)}</li>`).join('') + `<li${it.preco ? '' : ' class="free"'}>${esc(it.preco || 'Gratuito')}</li>`;
  return `<article class="ec-cc">${capaCartao(it, it.url)}<div class="ec-cc-b">${it.area ? `<span class="ec-cc-k">${esc(it.area)}</span>` : ''}<h3><a href="${esc(it.url)}">${esc(it.titulo)}</a></h3>${it.resumo ? `<p>${esc(it.resumo)}</p>` : ''}<ul class="ec-cc-m">${meta}</ul><div class="ec-cc-a"><a class="btn" href="${esc(it.url)}">${prog ? 'Iniciar curso' : 'Consultar curso'}</a></div></div></article>`;
};
const formatoDe = (f) => { const m = String(f || '').match(/\.([a-z0-9]{2,5})(?:[?#]|$)/i); return m ? m[1].toUpperCase() : ''; };
const cardDoc = (it) => {
  const fmt = formatoDe(it.ficheiro), meta = [fmt && `Formato ${fmt}`, it.categoria].filter(Boolean).map((x) => `<li>${esc(x)}</li>`).join('');
  return `<article class="ec-cc">${capaCartao(it, it.url)}<div class="ec-cc-b">${it.categoria ? `<span class="ec-cc-k">${esc(it.categoria)}</span>` : ''}<h3><a href="${esc(it.url)}">${esc(it.titulo)}</a></h3>${it.resumo ? `<p>${esc(it.resumo)}</p>` : ''}${meta ? `<ul class="ec-cc-m">${meta}</ul>` : ''}<div class="ec-cc-a">${it.ficheiro ? `<a class="btn" href="${esc(it.ficheiro)}" target="_blank" rel="noopener">Consultar</a>${it.permitirDownload ? `<a class="btn alt" href="${esc(it.ficheiro)}" download>Descarregar</a>` : ''}` : `<a class="btn" href="${esc(it.url)}">Ver ficha</a>`}</div></div></article>`;
};
const grelha = (l, f, extra = '') => `<div class="ec-grid${extra}">${l.map(f).join('')}</div>`;
const CARTOES_CSS = read('templates/cartoes.css');
const AVISO = '<div class="notice"><b>Conteúdo educativo.</b> Não substitui o julgamento clínico, os protocolos da sua instituição nem as fontes oficiais actualizadas. <a href="/aviso-medico.html">Aviso médico</a></div>';
const tagsDe = (it) => it.etiquetas.length ? `<p>${it.etiquetas.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</p>` : '';
for (const it of itens) {
  const T = TIPOS[it.tipo], url = SITE + it.url;
  if (['cursos', 'videoaulas', 'testes'].includes(it.tipo)) { write(it.url.slice(1), paginaEducacao(it, url)); continue; }
  const capa = it.imagem ? `<p><img src="${esc(it.imagem)}" alt="${esc(it.titulo)}" loading="lazy" decoding="async"></p>` : '';
  const fonte = it.fonte || it.fonte_url ? `<p class="meta">Fonte: ${it.fonte_url ? `<a href="${esc(safeUrl(it.fonte_url))}" target="_blank" rel="noopener nofollow">${esc(it.fonte || it.fonte_url)}</a>` : esc(it.fonte)}</p>` : '';
  let main, ld;
  if (it.tipo === 'biblioteca') {
    main = `<p class="meta"><a href="/biblioteca/">Biblioteca</a>${it.categoria ? ' · ' + esc(it.categoria) : ''} · ${fmtData(it.data)}</p><h1>${esc(it.titulo)}</h1><p class="lead">${esc(it.resumo)}</p>${share(url, it.titulo)}<p><a class="btn" href="${esc(it.ficheiro)}" target="_blank" rel="noopener">Abrir PDF</a> <a class="btn alt" href="${esc(it.ficheiro)}" download>Descarregar</a></p>${capa}<article>${md(it.corpo)}</article>${tagsDe(it)}`;
    ld = { '@context': 'https://schema.org', '@type': 'DigitalDocument', name: it.titulo, description: it.resumo, datePublished: it.data, inLanguage: 'pt-MZ', url, encodingFormat: 'application/pdf', ...(it.ficheiro ? { contentUrl: abs(it.ficheiro) } : {}), publisher: { '@type': 'Organization', name: 'ENCORP', url: SITE + '/' } };
  } else {
    main = `<p class="meta"><a href="/dicas/">Dicas e Actualidades</a> · ${esc(it.categoria || 'Dica')} · ${fmtData(it.data)} · ${esc(it.autor || 'ENCORP')}</p><h1>${esc(it.titulo)}</h1><p class="lead">${esc(it.resumo)}</p>${share(url, it.titulo)}${capa}<article>${md(it.corpo)}</article>${fonte}${tagsDe(it)}${AVISO}`;
    ld = { '@context': 'https://schema.org', '@type': it.categoria === 'Notícia' ? 'NewsArticle' : 'Article', headline: it.titulo, description: it.resumo, datePublished: it.data, dateModified: it.data, inLanguage: 'pt-MZ', mainEntityOfPage: url, ...(it.og ? { image: it.og } : {}), author: { '@type': 'Organization', name: it.autor || 'ENCORP' }, publisher: { '@type': 'Organization', name: 'ENCORP', url: SITE + '/' } };
  }
  write(it.url.slice(1), page(head({ titulo: it.titulo, desc: it.resumo || T.lead, path: it.url, img: it.og, tipoOg: 'article', ld }), main));
}

/* ---------- hubs e listagens ---------- */
const C = (href, t, d) => `<a class="card" href="${href}"><b>${esc(t)}</b>${d ? `<span>${esc(d)}</span>` : ''}</a>`;
const unescH = (s) => String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&amp;/g, '&');
function cardsDir(dir, { skip = ['index.html'] } = {}) {
  if (!existsSync(R(dir))) return '';
  return readdirSync(R(dir)).filter((f) => f.endsWith('.html') && !skip.includes(f)).map((f) => {
    const s = read(dir + '/' + f), h = s.match(/<h1>([\s\S]*?)<\/h1>/), l = s.match(/<p class="lead">([\s\S]*?)<\/p>/);
    return { t: unescH(h ? h[1].replace(/<[^>]+>/g, '') : f), d: unescH(l ? l[1].replace(/<[^>]+>/g, '') : ''), u: '/' + dir + '/' + f };
  }).sort((a, b) => a.t.localeCompare(b.t, 'pt')).map((x) => C(x.u, x.t, x.d)).join('');
}
function hub({ path, titulo, h1, desc, lead, crumbs = [], body, robots, extraCss = '', extraJs = '' }) {
  const url = SITE + path, chain = [['Início', '/'], ...crumbs], nome = h1 || titulo;
  const bc = { '@type': 'BreadcrumbList', itemListElement: [...chain.map(([n, u], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: SITE + u })), { '@type': 'ListItem', position: chain.length + 1, name: nome, item: url }] };
  const ld = { '@context': 'https://schema.org', '@graph': [{ '@type': 'CollectionPage', name: nome, description: desc, url, inLanguage: 'pt-MZ' }, bc] };
  const nav = `<p class="meta crumbs" aria-label="Navegação">${chain.map(([n, u]) => `<a href="${u}">${esc(n)}</a>`).join(' › ')} › ${esc(nome)}</p>`;
  write(path.slice(1) + (path.endsWith('/') ? 'index.html' : ''), page(head({ titulo, desc, path, ld, extraCss, ...(robots ? { robots } : {}) }), `${nav}<h1>${esc(nome)}</h1><p class="lead">${esc(lead || desc)}</p>${body}`).replace('</body>', extraJs + '</body>'));
}
const FER = ['Ferramentas', '/ferramentas/'], APR = ['Aprender', '/aprender/'], PRO = ['Processo de enfermagem', '/processo-enfermagem/'], CAL = ['Calculadoras', '/ferramentas/calculadoras/'];

hub({ path: '/ferramentas/', titulo: 'Ferramentas de enfermagem', desc: 'Calculadoras, escalas clínicas, exames laboratoriais (com interpretação do hemograma), medicamentos essenciais e urgência, num só lugar.',
  body: AVISO + [
    C('/ferramentas/calculadoras/', 'Calculadoras', 'Medicamentos, doses, infusões, conversões e outras calculadoras.'),
    C('/escalas/', 'Escalas clínicas', 'Glasgow, Braden, Morse, EVA, Barthel, NEWS2, Apgar e triagem de Manchester.'),
    C('/ferramentas/exames/hemograma-completo.html', 'Interpretação do hemograma completo', 'Introduza os valores e veja o que cada sigla significa e o que pode indicar.'),
    C('/ferramentas/exames/', 'Exames laboratoriais', 'Valores de referência e apoio à interpretação.'),
    C('/medicamentos/', 'Medicamentos essenciais', 'Doses habituais e cuidados de enfermagem (LNME Moçambique, 2017).'),
    C('/urgencias/', 'Urgência e emergência', 'Protocolos e condutas para situações críticas.'),
    C('/aprender/glossario/', 'Termos médicos', 'Siglas, abreviaturas, prefixos e sufixos.')].join('') });

const CATS = [['medicamentos', 'Medicamentos e diluições', 'Diluição, concentração e equivalência de soluções.'], ['doses', 'Doses', 'Dose em mL a administrar e dose por peso (mg/kg).'], ['infusoes', 'Infusões e balanço hídrico', 'Gotejamento e balanço hídrico das 24 horas.'], ['conversoes', 'Conversões', 'Peso, temperatura, massa e volume em gotas.'], ['outras', 'Outras calculadoras', 'IMC e superfície corporal.']];
hub({ path: '/ferramentas/calculadoras/', titulo: 'Calculadoras de enfermagem', crumbs: [FER], desc: 'Calculadoras de medicamentos, doses, infusões, conversões e outras, organizadas por categoria. Funcionam no telemóvel e no computador.',
  body: '<div class="notice"><b>Apoio ao cálculo.</b> Confirme sempre com o protocolo da instituição e com dupla verificação. <a href="/aviso-medico.html">Aviso médico</a></div>' + CATS.map(([d, t]) => `<h2><a href="/ferramentas/calculadoras/${d}/">${esc(t)}</a></h2>${cardsDir('ferramentas/calculadoras/' + d)}`).join('') });
const CATS_DESC = { medicamentos: 'Diluição de medicamentos e equivalência de soluções: calcule a concentração final e converta entre soluções no telemóvel, mesmo sem internet.', outras: 'Calculadora de IMC (classificação da OMS) e de superfície corporal (fórmula de Mosteller) para enfermagem; funcionam no telemóvel, mesmo sem internet.' };
const CATS_TXT = { medicamentos: '<p>Estas calculadoras ajudam a preparar soluções: a de diluição calcula a concentração obtida ao diluir um medicamento e a de equivalência de soluções converte entre concentrações e volumes. Introduza os valores indicados na prescrição, confira o resultado e valide sempre com o protocolo da instituição e com dupla verificação antes de administrar.</p><p>Depois de abertas uma vez com internet, as calculadoras ficam disponíveis no telemóvel mesmo sem ligação.</p>', outras: '<p>O índice de massa corporal (IMC) relaciona o peso com a altura e é classificado segundo a OMS; a superfície corporal, calculada pela fórmula de Mosteller, é usada em cálculos de dose e de balanço em que o tamanho do doente conta. Introduza o peso em quilogramas e a altura em metros ou centímetros.</p><p>Depois de abertas uma vez com internet, as calculadoras ficam disponíveis no telemóvel mesmo sem ligação.</p>' };
for (const [d, t, ds] of CATS) hub({ path: `/ferramentas/calculadoras/${d}/`, titulo: t, crumbs: [FER, CAL], desc: CATS_DESC[d] || ds, body: (CATS_TXT[d] || '') + cardsDir('ferramentas/calculadoras/' + d) });

hub({ path: '/processo-enfermagem/', titulo: 'Processo de enfermagem', crumbs: [APR], desc: 'O processo de enfermagem em cinco etapas, por ordem: avaliação, diagnóstico, planeamento, implementação e avaliação final.',
  body: AVISO + '<ol class="etapas">' + [
    ['/processo-enfermagem/avaliacao-inicial/', '1. Avaliação', 'Colher dados: anamnese, exame físico e sinais vitais.'],
    ['/processo-enfermagem/diagnostico/', '2. Diagnóstico', 'Interpretar os dados e formular diagnósticos NANDA-I.'],
    ['/processo-enfermagem/planeamento/', '3. Planeamento', 'Escolher intervenções (NIC) e definir resultados esperados (NOC).'],
    ['/processo-enfermagem/implementacao/', '4. Implementação', 'Executar os cuidados e registar: procedimentos e medicação.'],
    ['/processo-enfermagem/avaliacao-final/', '5. Avaliação final', 'Comparar o resultado com o esperado e reajustar o plano.']].map(([u, t, d]) => `<li>${C(u, t, d)}</li>`).join('') + '</ol>' });
const ETAPA = (slug, titulo, desc, intro, passos, extra) => hub({ path: `/processo-enfermagem/${slug}/`, titulo, crumbs: [APR, PRO], desc, body: `<p>${intro}</p><ul>${passos.map((p) => `<li>${p}</li>`).join('')}</ul>${extra}` });
ETAPA('avaliacao-inicial', '1. Avaliação de enfermagem', 'Primeira etapa do processo de enfermagem: colheita de dados, anamnese, exame físico e sinais vitais.',
  'Reúna dados subjectivos (o que o doente refere) e objectivos (o que observa e mede) de forma sistemática.',
  ['Faça a anamnese e registe a queixa principal.', 'Meça os sinais vitais e compare com os valores de referência.', 'Faça o exame físico geral e por sistemas.', 'Confirme e complete os dados com a família ou o processo clínico.'],
  '<h2>Recursos</h2>' + cardsDir('avaliacao') + C('/avaliacao/', 'Todas as páginas de avaliação', ''));
ETAPA('diagnostico', '2. Diagnóstico de enfermagem', 'Segunda etapa: interpretar os dados e formular diagnósticos de enfermagem NANDA-I.',
  'Agrupe os dados, identifique o problema e escreva o diagnóstico, de preferência no formato PES (problema, etiologia e sinais e sintomas).',
  ['Agrupe os dados que se relacionam.', 'Escolha o diagnóstico NANDA-I que melhor os explica.', 'Escreva o enunciado: problema, relacionado a (etiologia), conforme evidenciado por (sinais e sintomas).', 'Priorize: primeiro o que ameaça a vida.'],
  C('/diagnosticos/', 'Diagnósticos NANDA-I 2024–2026', 'Pesquise por domínio, classe ou nome.'));
ETAPA('planeamento', '3. Planeamento de enfermagem', 'Terceira etapa: escolher as intervenções (NIC) e definir os resultados esperados (NOC).',
  'Para cada diagnóstico prioritário, defina o que quer alcançar e como.',
  ['Escolha intervenções NIC adequadas ao doente e aos recursos do serviço.', 'Defina resultados esperados (NOC) mensuráveis e com prazo.', 'Registe o plano e partilhe-o com a equipa.'],
  '<h2>Intervenções (NIC)</h2>' + cardsDir('processo-enfermagem/planeamento/intervencoes-nic') + C('/processo-enfermagem/planeamento/intervencoes-nic/', 'Todas as intervenções NIC', ''));
ETAPA('implementacao', '4. Implementação', 'Quarta etapa: executar as intervenções planeadas e registar os cuidados prestados.',
  'Execute o plano, verifique a prescrição e registe o que foi feito e a resposta do doente.',
  ['Confirme a identificação do doente e a prescrição.', 'Siga o procedimento e as normas de segurança.', 'Registe hora, cuidado prestado e reacções.'],
  '<h2>Procedimentos</h2>' + cardsDir('processo-enfermagem/implementacao/procedimentos') + C('/medicamentos/', 'Medicamentos essenciais', '') + C('/ferramentas/calculadoras/', 'Calculadoras', ''));
ETAPA('avaliacao-final', '5. Avaliação final', 'Quinta etapa: comparar o estado do doente com os resultados esperados e reajustar o plano.',
  'Reavalie com os mesmos critérios usados no planeamento e decida se mantém, altera ou encerra o plano.',
  ['Compare os resultados obtidos com os esperados (NOC).', 'Repita escalas e sinais vitais quando indicado.', 'Reveja diagnósticos e intervenções que não resultaram.'],
  '<h2>Resultados (NOC)</h2>' + cardsDir('processo-enfermagem/avaliacao-final/resultados-noc') + C('/escalas/', 'Escalas clínicas', 'Para reavaliar de forma padronizada.'));

hub({ path: '/aprender/', titulo: 'Aprender enfermagem', crumbs: [], desc: 'Processo de enfermagem, avaliação, casos clínicos, termos médicos, biblioteca de PDFs, dicas de saúde e cursos.',
  body: AVISO + [C('/processo-enfermagem/', 'Processo de enfermagem', 'As cinco etapas, por ordem.'), C('/avaliacao/', 'Avaliação e exame físico', 'Anamnese, exame físico e sinais vitais.'), C('/aprender/casos-clinicos/', 'Casos clínicos', '20 casos para estudar.'), C('/aprender/glossario/', 'Termos médicos', 'Siglas, abreviaturas, prefixos e sufixos.'), C('/biblioteca/', 'Biblioteca', 'Manuais, listas de medicamentos e fichas em PDF.'), C('/dicas/', 'Dicas e Actualidades de Saúde', 'Dicas, artigos e notícias.'), C('/cursos/', 'Cursos', 'Cursos, video-aulas e testes.')].join('') });

hub({ path: '/ajuda.html', titulo: 'Ajuda', desc: 'Como usar o ENCORP e como falar connosco.',
  body: '<p>Use a pesquisa para localizar conteúdos. Abra cada domínio e classe para consultar diagnósticos. Ao seleccionar um diagnóstico verá domínio, classe, código NANDA-I e sugestões de NIC e NOC. Este sistema não substitui protocolos institucionais nem julgamento clínico.</p><h2>Contactos</h2><p>E-mail: <a href="mailto:digitalcartel@gmail.com">digitalcartel@gmail.com</a><br>Telefone: 82 130 0088</p><p><a href="/contacto.html">Página de contactos</a> · <a href="/pesquisa.html">Pesquisar no site</a></p>' });

const destaques = itens.filter((i) => i.tipo === 'dicas').slice(0, 8);
const nCard = (it) => `<a class="ec-nc" href="${esc(it.url)}" draggable="false"><span class="ec-nc-im">${it.imagem ? `<img class="f" src="${esc(it.imagem)}" alt="" width="400" height="250" loading="lazy" decoding="async" draggable="false" referrerpolicy="no-referrer" onerror="this.style.display='none'">` : '<img class="l" src="/android-chrome-192x192.png" alt="" width="56" height="56" loading="lazy" draggable="false">'}</span><span class="ec-nc-b"><span class="ec-nc-k">${esc(it.categoria || 'Dica')}</span><span class="ec-nc-t">${esc(it.titulo)}</span>${it.resumo ? `<span class="ec-nc-s">${esc(it.resumo)}</span>` : ''}<span class="ec-nc-m">${fmtData(it.data)}</span><span class="ec-nc-go">Ler mais ›</span></span></a>`;
const carrossel = (lista) => `<div class="ec-car" data-ec-car role="region" aria-roledescription="carrossel" aria-label="Dicas e actualidades de saúde"><div class="ec-car-vp"><div class="ec-car-tr">${lista.map(nCard).join('')}</div></div></div>`;
/* listagens: dicas, biblioteca, aulas, testes */
for (const tipo of ['dicas', 'biblioteca', 'videoaulas', 'testes']) {
  const T = TIPOS[tipo], lista = itens.filter((i) => i.tipo === tipo);
  let corpo;
  if (!lista.length) corpo = '<p>Ainda não há conteúdos publicados.</p>';
  else if (tipo === 'biblioteca') { const g = {}; for (const i of lista) (g[i.categoria || 'Outros'] ||= []).push(i); corpo = Object.entries(g).map(([k, l]) => `<h2>${esc(k)}</h2>${grelha(l, cardDoc)}`).join(''); }
  else if (tipo === 'dicas') corpo = carrossel(lista.slice(0, 8)) + `<h2>Todas as publicações</h2>` + lista.map(cardLista).join('');
  else corpo = lista.map(cardLista).join('');
  hub({ path: '/' + T.base, titulo: T.nome, crumbs: tipo === 'biblioteca' ? [APR] : (tipo === 'dicas' ? [] : [['Cursos', '/cursos/']]), desc: T.lead, body: corpo, ...(tipo === 'biblioteca' && lista.length ? { extraCss: CARTOES_CSS } : {}), ...(tipo === 'dicas' && lista.length ? { extraCss: read('templates/dicas-home.css'), extraJs: '<script src="/js/interface/carrossel-dicas.js" defer></script>' } : {}), ...(lista.length ? {} : { robots: 'noindex,follow' }) });
}
/* hub /cursos/ */
{
  const sec = (tipo, titulo, ate, ver) => { const l = itens.filter((i) => i.tipo === tipo); return l.length ? `<h2>${titulo}</h2>${tipo === 'cursos' ? grelha(l.slice(0, ate), cardCurso, ' ec-grid2') : l.slice(0, ate).map(cardLista).join('')}${l.length > ate ? `<p><a class="btn alt" href="${ver}">Ver todos (${l.length})</a></p>` : ''}` : ''; };
  const vazio = !temConteudo('cursos');
  hub({ path: '/cursos/', titulo: 'Cursos', desc: TIPOS.cursos.lead, body: vazio ? '<p>Em breve: cursos, video-aulas e testes.</p>' : sec('cursos', 'Cursos', 50, '/cursos/') + sec('videoaulas', 'Video-aulas', 6, '/cursos/aulas/') + sec('testes', 'Testes', 6, '/cursos/testes/'), extraCss: CARTOES_CSS, ...(vazio ? { robots: 'noindex,follow' } : {}) });
}

/* ---------- página inicial: Dicas e Actualidades de Saúde (zona entre <!--EC:DICAS--> e <!--/EC:DICAS-->) ---------- */
const blocoHome = `<style>${read('templates/dicas-home.css')}</style><div class="section-title" id="ec-dicas">Dicas e Actualidades de Saúde</div>${destaques.length ? `${carrossel(destaques)}<div class="ec-news-more"><a href="/dicas/">Ver todas as dicas e notícias</a></div>` : '<p class="ec-news-vazio">Em breve: dicas, artigos e notícias de saúde.</p>'}`;
/* ---------- página inicial: cartões de cursos (zona entre <!--EC:CURSOS--> e <!--/EC:CURSOS-->) ---------- */
{
  const cCard = (it) => `<a class="sbb-course" href="${esc(it.url)}"><small>${esc(it.area || 'Curso')}</small><b>${esc(it.titulo)}</b><span>${esc(it.meta || '')}</span></a>`;
  const blocoCursos = listaCursos.length ? `<div class="sbb-courses">${listaCursos.slice(0, 3).map(cCard).join('')}</div>` : '<p class="ec-news-vazio">Em breve: cursos, aulas e testes.</p>';
  const html = read('index.html'), re = /(<!--EC:CURSOS-->)[\s\S]*?(<!--\/EC:CURSOS-->)/;
  if (re.test(html)) write('index.html', html.replace(re, (_, a, c) => a + blocoCursos + c));
}

{
  const html = read('index.html'), re = /(<!--EC:DICAS-->)[\s\S]*?(<!--\/EC:DICAS-->)/;
  if (!re.test(html)) console.warn('AVISO: index.html não tem os marcadores <!--EC:DICAS--> … <!--/EC:DICAS-->.');
  else write('index.html', html.replace(re, (_, a, b) => a + blocoHome + b));
}


/* ---------- rss.html: lista das últimas publicações (zona entre <!--EC:RSS--> e <!--/EC:RSS-->) ---------- */
{
  const f = 'rss.html';
  if (existsSync(R(f))) {
    const s = read(f), re = /(<!--EC:RSS-->)[\s\S]*?(<!--\/EC:RSS-->)/;
    const lista = itens.filter((i) => i.tipo === 'dicas').slice(0, 5).map(cardLista).join('') || '<p>Ainda não há publicações.</p>';
    if (re.test(s)) write(f, s.replace(re, (_, a, c) => a + lista + c));
  }
}

/* ---------- cabeçalho e rodapé únicos (templates/) em todas as páginas ---------- */
/* ---------- PowerPoint por aula, gerado dos slides do CMS (api/_dados/slides/<curso>/aula-N.pptx; privado, servido pela API só a quem tem a aula desbloqueada) ---------- */
const PPTX = new Set();
const SLIDES_HASH = {};   /* «curso/aula» → impressão digital do conteúdo e do gerador: diz se o PDF pré-gerado ainda corresponde ao PowerPoint */
const lerJson = (f) => { try { return JSON.parse(readFileSync(R(f), 'utf8')); } catch { return {}; } };
{
  const GERADOR = createHash('sha1').update(read('tools/gerar-pptx.mjs')).update(read('tools/ficha-curso.mjs')).digest('hex').slice(0, 12);
  let PptxGenJS = null;
  try { PptxGenJS = createRequire(import.meta.url)('pptxgenjs'); } catch (e) { console.warn('pptxgenjs não está instalado: os PPTX não foram gerados (npm install).'); }
  if (PptxGenJS) {
    const { gerarPptx } = await import('./tools/gerar-pptx.mjs');
    let n = 0;
    for (const it of itens) {
      if (it.tipo !== 'cursos') continue;
      const dir = `api/_dados/slides/${it.slug}`;
      for (const f of (existsSync(R(dir)) ? readdirSync(R(dir)) : [])) unlinkSync(R(`${dir}/${f}`));   /* aulas apagadas no CMS deixam de ter ficheiro */
      const pub = `cursos/slides/${it.slug}`;   /* cópia pública (cursos gratuitos): o leitor abre o PDF e oferece o .pptx para baixar */
      for (const f of (existsSync(R(pub)) ? readdirSync(R(pub)) : [])) { const m = f.match(/^aula-(\d+)\.(pptx|pdf)$/); if (!m || +m[1] > it.aulas.length) unlinkSync(R(`${pub}/${f}`)); }
      for (let k = 0; k < it.aulas.length; k++) {
        const a = it.aulas[k]; if (!a.slides.length) continue;
        mkdirSync(R(dir), { recursive: true });
        try {   /* um PPTX com problema não deve impedir a publicação do site: avisa e segue (a aula fica sem o botão de PowerPoint) */
          await gerarPptx(PptxGenJS, { curso: it.titulo, aula: a, n: k + 1, total: it.aulas.length, notaMinima: it.notaMinima, raiz: R('.'), destino: R(`${dir}/aula-${k + 1}.pptx`) });
          PPTX.add(`${it.slug}/${k + 1}`); n++;
          if (a.permitirPptx !== false) {
            mkdirSync(R(pub), { recursive: true });
            copyFileSync(R(`${dir}/aula-${k + 1}.pptx`), R(`${pub}/aula-${k + 1}.pptx`));
            SLIDES_HASH[`${it.slug}/${k + 1}`] = createHash('sha1').update(GERADOR).update(JSON.stringify([it.titulo, k + 1, it.aulas.length, a.titulo, a.resumo, a.duracao, a.conteudo, a.slides, a.teste && a.teste.notaMinima, it.notaMinima])).digest('hex').slice(0, 12);
          }
        } catch (e) { console.warn(`AVISO: PPTX não gerado (${it.slug}, aula ${k + 1}): ${e && e.message ? e.message : e}`); }
      }
    }
    write('cursos/slides/hashes.json', JSON.stringify(SLIDES_HASH, null, 1));
    console.log(`PowerPoint: ${n} ficheiros gerados em api/_dados/slides/ e cópia pública em cursos/slides/.`);
  }
}

/* ---------- dados privados dos cursos com conta (respostas certas incluídas): só a API os lê; nunca são servidos como ficheiro ---------- */
{
  const priv = {};
  for (const it of itens) {
    if (it.tipo !== 'cursos' || it.modo !== 'progressivo' || !it.aulas.length) continue;
    priv[it.slug] = { titulo: it.titulo, notaMinima: it.notaMinima, tentativas: it.tentativas, esperaMinutos: it.esperaMinutos, sequencial: it.sequencial,
      aulas: it.aulas.map((a) => ({ titulo: a.titulo, resumo: a.resumo, duracao: a.duracao, html: md(a.conteudo),
        slides: a.slides.map((s) => ({ titulo: s.titulo, html: md(s.texto), imagem: s.imagem })),
        video: { youtube: a.youtube, ficheiro: a.video, obrigatorio: a.videoObrig }, pptx: a.permitirPptx && PPTX.has(`${it.slug}/${a.ordem}`),
        teste: a.teste ? { notaMinima: a.teste.notaMinima, tentativas: a.teste.tentativas, perguntas: a.teste.perguntas } : null })) };
  }
  mkdirSync(R('api/_dados'), { recursive: true });
  writeFileSync(R('api/_dados/cursos.json'), JSON.stringify(priv));
  console.log(`Cursos com conta: ${Object.keys(priv).length} (dados privados em api/_dados/cursos.json).`);
}
/* ---------- dados públicos dos cursos livres: lidos pelo leitor (js/site/curso-player.js); o progresso fica no navegador do estudante ---------- */
{
  const dir = R('cursos/dados');
  mkdirSync(dir, { recursive: true });
  for (const f of readdirSync(dir)) if (f.endsWith('.json')) unlinkSync(R('cursos/dados/' + f));   /* cursos apagados no CMS deixam de ter dados */
  let n = 0;
  for (const it of itens) {
    if (it.tipo !== 'cursos' || it.modo !== 'progressivo' || !it.aulas.length) continue;
    const pdfOk = lerJson('cursos/slides/pdf.json');   /* PDFs pré-gerados (tools/gerar-pdf-slides.mjs); só aparecem se ainda corresponderem aos slides */
    const pub = { slug: it.slug, titulo: it.titulo, notaMinima: it.notaMinima, aulas: it.aulas.map((a, k) => ({
      pptx: SLIDES_HASH[`${it.slug}/${k + 1}`] ? `/cursos/slides/${it.slug}/aula-${k + 1}.pptx` : null,
      pdf: SLIDES_HASH[`${it.slug}/${k + 1}`] && pdfOk[`${it.slug}/${k + 1}`] === SLIDES_HASH[`${it.slug}/${k + 1}`] && existsSync(R(`cursos/slides/${it.slug}/aula-${k + 1}.pdf`)) ? `/cursos/slides/${it.slug}/aula-${k + 1}.pdf` : null,
      titulo: a.titulo, resumo: a.resumo, duracao: a.duracao, html: md(a.conteudo),
      slides: a.slides.map((s) => ({ titulo: s.titulo, html: md(s.texto), imagem: s.imagem, tipo: s.tipo })),
      video: a.youtube || a.video ? { youtube: a.youtube, ficheiro: a.video } : null,
      teste: a.teste ? { notaMinima: a.teste.notaMinima || it.notaMinima, perguntas: a.teste.perguntas } : null })) };
    writeFileSync(R(`cursos/dados/${it.slug}.json`), JSON.stringify(pub)); n++;
  }
  console.log(`Cursos livres: ${n} ficheiros públicos em cursos/dados/.`);
}
hub({ path: '/conta/', titulo: 'A minha conta', desc: 'Entrar ou criar a conta de estudante para guardar o progresso nos cursos.', crumbs: [], body: '<div id="ec-conta-pag"><noscript><p>A conta precisa de JavaScript.</p></noscript></div>', robots: 'noindex,nofollow', extraCss: PLAYER_CSS, extraJs: '<script src="/js/site/conta.js" defer></script><script src="/js/site/conta-pagina.js" defer></script>' });

const PAGINAS = walk('').filter((x) => !['index.html', '404.html'].includes(x) && !x.startsWith('google')).sort();
{
  const H = HEADER.trim(), F = FOOTER.trim();
  let n = 0;
  for (const f of [...PAGINAS, '404.html']) {
    const s = read(f);
    const mh = s.match(/<body>(<header>[\s\S]*?<\/header>)/), mf = s.match(/(<footer>[\s\S]*<\/footer>)(?=<script src="\/js\/site\/site\.js")/);
    if (!mh || !mf) continue;
    const t = s.replace(mh[1], () => H).replace(mf[1], () => F);
    if (t !== s) { write(f, t); n++; }
  }
  console.log(`Cabeçalho/rodapé sincronizados em ${n} páginas.`);
}

/* ---------- diagnósticos: indexação (interruptor no CMS: indexarTodosDiagnosticos) ---------- */
{
  const ROB_IDX = 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1';
  let ni = 0, ix = 0;
  for (const f of PAGINAS.filter((x) => x.startsWith('diagnosticos/') && x !== 'diagnosticos/index.html')) {
    const s = read(f), fina = s.includes('Não há ainda sugestões específicas');
    const rob = fina && site.indexarTodosDiagnosticos !== true ? 'noindex,follow' : ROB_IDX;
    const t = s.replace(/<meta name="robots" content="[^"]*">/, `<meta name="robots" content="${rob}">`);
    if (t !== s) write(f, t);
    rob.startsWith('noindex') ? ni++ : ix++;
  }
  console.log(`Diagnósticos: ${ix} indexáveis, ${ni} com noindex (páginas sem sugestões NIC/NOC específicas).`);
}

/* ---------- pesquisa do site ---------- */
const unesc = unescH;
{
  const vazias = ['dicas', 'biblioteca', 'videoaulas', 'testes'].filter((t) => !itens.some((i) => i.tipo === t)).map((t) => TIPOS[t].base + 'index.html');
  const idx = [];
  const add = (f, url) => {
    if (vazias.includes(f)) return;
    const s = read(f), ti = s.match(/<title>([\s\S]*?)<\/title>/);
    if (!ti) return;
    const de = s.match(/<meta name="description" content="([^"]*)"/);
    const cr = s.match(/<p class="meta crumbs"[^>]*>([\s\S]*?)<\/p>/) || s.match(/<p class="meta">([\s\S]*?)<\/p>/);
    const as = cr ? [...cr[1].matchAll(/<a [^>]*>([^<]*)<\/a>/g)].map((m) => unesc(m[1])).filter((x) => x !== 'Início') : [];
    idx.push({ t: unesc(ti[1]).replace(/\s*[|—-]\s*ENCORP\s*$/, '').trim() || 'ENCORP', d: unesc(de ? de[1] : '').slice(0, 220), u: url, s: as.length ? as[as.length - 1] : '' });
  };
  add('index.html', '/');
  for (const f of PAGINAS) if (f !== 'pesquisa.html' && !f.startsWith('conta/')) add(f, urlDe(f));
  write('search-index.json', JSON.stringify(idx));
  const mainP = `<h1>Pesquisar no site</h1><p class="lead">Diagnósticos NANDA-I, intervenções NIC, resultados NOC, calculadoras, escalas, medicamentos, procedimentos, casos clínicos, cursos e dicas de saúde.</p><form id="ec-q" role="search" onsubmit="return false"><input id="q" type="search" name="q" placeholder="O que procura? (ex.: dor aguda, gotejamento, paracetamol)" autocomplete="off" autocapitalize="off" aria-label="Pesquisar no site" autofocus></form><p id="n" class="meta" aria-live="polite"></p><div id="r"></div><noscript><p>A pesquisa precisa de JavaScript. Pode navegar em <a href="/aprender/">Aprender</a> e <a href="/ferramentas/">Ferramentas</a>.</p></noscript><script src="/js/site/pesquisa.js" defer></script>`;
  const cssP = '#q{width:100%;box-sizing:border-box;padding:13px 14px;font-size:16px;border:1px solid #dfe6f0;border-radius:12px;background:#fff;color:inherit;margin:4px 0 6px}#q:focus{outline:2px solid #0b1a33;outline-offset:1px}';
  write('pesquisa.html', page(head({ titulo: 'Pesquisar', desc: 'Pesquise diagnósticos NANDA-I, calculadoras, escalas, medicamentos e procedimentos de enfermagem.', path: '/pesquisa.html', robots: 'noindex,follow', extraCss: cssP }), mainP));
  console.log(`Índice de pesquisa: ${idx.length} páginas.`);
}

/* ---------- conteudo.json (lido pela app: Biblioteca, Cursos) ---------- */
write('conteudo.json', JSON.stringify({ atualizado: new Date().toISOString(), itens: itens.map(({ corpo, aulas, perguntas, chave, link_inscricao, aprovacao, instrutor, ...r }) => ({ ...r, formato: r.tipo === 'biblioteca' ? formatoDe(r.ficheiro) : undefined, curso: cursoDe.get(itens.find((x) => x.url === r.url))?.slug || '', nAulas: aulas.length, nPerguntas: perguntas.length })) }));

/* ---------- feed.xml (dicas e actualidades) ---------- */
const x = (s) => esc(s).replace(/'/g, '&apos;');
write('feed.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>ENCORP — Dicas e Actualidades de Saúde</title><link>${SITE}/</link><description>Dicas, artigos e notícias de saúde.</description><language>pt-MZ</language><atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>\n${itens.filter((i) => i.tipo === 'dicas').slice(0, 30).map((i) => `<item><title>${x(i.titulo)}</title><link>${SITE}${i.url}</link><guid isPermaLink="true">${SITE}${i.url}</guid><pubDate>${new Date(i.data + 'T12:00:00Z').toUTCString()}</pubDate><description>${x(i.resumo)}</description></item>`).join('\n')}\n</channel></rss>\n`);

/* ---------- sitemap.xml: regenerado de raiz; só páginas indexáveis, com o endereço canónico de cada uma ---------- */
{
  const urls = [];
  for (const f of ['index.html', ...PAGINAS]) {
    const s = read(f);
    if (/<meta name="robots" content="noindex/.test(s)) continue;
    const c = s.match(/<link rel="canonical" href="([^"]+)"/), loc = c ? c[1] : SITE + urlDe(f);
    const lm = s.match(/"dateModified":"(\d{4}-\d{2}-\d{2})"/);
    urls.push(`<url><loc>${loc}</loc>${lm ? `<lastmod>${lm[1]}</lastmod>` : ''}</url>`);
  }
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(urls)].join('\n')}\n</urlset>\n`);
  console.log(`Sitemap: ${new Set(urls).size} páginas indexáveis.`);
}

/* ---------- AdSense / Analytics: config no site.js, ads.txt e meta de verificação em todas as páginas ---------- */
/* ---------- SEO: títulos e descrições com comprimento adequado em TODAS as páginas (também nas escritas à mão) ---------- */
{
  const MARCA = ' | ENCORP';
  const corta = (d) => { d = d.replace(/\s+/g, ' ').trim(); if (d.length <= 160) return d; return d.slice(0, 158).replace(/\s+\S*$/, '').replace(/[\s,;:.\-–—(]+$/, '') + '…'; };
  let n = 0;
  for (const f of PAGINAS) {
    if (f.startsWith('templates/') || f.startsWith('google') || !existsSync(R(f))) continue;
    const h = read(f); let t = h;
    t = t.replace(/(<title>)([^<]*)(<\/title>)/, (m, a, x, z) => (x.length > 70 && x.endsWith(MARCA) ? a + x.slice(0, -MARCA.length) + z : m));
    t = t.replace(/(<meta property="og:title" content=")([^"]*)(")/, (m, a, x, z) => (x.length > 70 && x.endsWith(MARCA) ? a + x.slice(0, -MARCA.length) + z : m));
    for (const re of [/(<meta name="description" content=")([^"]*)(")/, /(<meta property="og:description" content=")([^"]*)(")/, /(<meta name="twitter:description" content=")([^"]*)(")/]) {
      t = t.replace(re, (m, a, x, z) => { const u = x.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>'); return u.length > 170 ? a + esc(corta(u)) + z : m; });
    }
    if (t !== h) { write(f, t); n++; }
  }
  console.log(`SEO: ${n} páginas com título/descrição ajustados.`);
}
{
  const ads = String(site.adsenseClient || '').trim(), ga = String(site.gaId || '').trim();
  const cfg = { adsenseClient: /^ca-pub-\d+$/.test(ads) ? ads : '', gaId: /^G-[A-Z0-9]+$/.test(ga) ? ga : '' };
  if (existsSync(R('js/site/site.js'))) write('js/site/site.js', read('js/site/site.js').replace(/\/\*EC:CFG\*\/[\s\S]*?\/\*\/EC:CFG\*\//, () => `/*EC:CFG*/window.EC_CFG=${JSON.stringify(cfg)};/*/EC:CFG*/`));
  if (cfg.adsenseClient) {
    write('ads.txt', `google.com, ${cfg.adsenseClient.replace('ca-', '')}, DIRECT, f08c47fec0942fa0\n`);
    const meta = `<meta name="google-adsense-account" content="${cfg.adsenseClient}">`;
    let m = 0;
    for (const f of ['index.html', '404.html', ...PAGINAS]) {
      if (!existsSync(R(f)) || f.startsWith('conta/')) continue;   /* sem anúncios na área do estudante */
      const h = read(f);
      let t = /<meta name="google-adsense-account"[^>]*>/.test(h) ? h.replace(/<meta name="google-adsense-account"[^>]*>/, meta) : h.replace(/(<meta charset="utf-8">)/i, '$1' + meta);
      const adsSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${cfg.adsenseClient}`;
      if (!t.includes(adsSrc)) {
        // consentimento negado por omissão antes do script; site.js trata do consentimento do utilizador
        const consent = `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});</script>`;
        t = t.replace(/(<meta name="google-adsense-account"[^>]*>)/, `$1${consent}<script async src="${adsSrc}" crossorigin="anonymous"></script>`);
      }
      if (t !== h) { write(f, t); m++; }
    }
    console.log(`AdSense ${cfg.adsenseClient}: meta de verificação em ${m} páginas.`);
  }
}
/* ---------- partilha uniforme (ícones) em TODAS as páginas: o endereço partilhado é sempre o canónico da própria página ---------- */
{
  let n = 0;
  for (const f of ['index.html', '404.html', ...PAGINAS]) {
    if (!existsSync(R(f))) continue;
    const s = read(f);
    if (!s.includes('class="ec-share"')) continue;
    const canon = unesc((s.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '');
    const t = s.replace(/<div class="ec-share"[^>]*>[\s\S]*?<\/div>/g, (m) => {
      const ti = (m.match(/data-title="([^"]*)"/) || [])[1], u = canon || unesc((m.match(/data-url="([^"]*)"/) || [])[1] || '');
      return ti && u ? share(u, unesc(ti)) : m;
    });
    if (t !== s) { write(f, t); n++; }
  }
  console.log(`Partilha: ícones uniformes em ${n} páginas.`);
}
/* ---------- extras em todas as páginas públicas: estilos + partilha/contador + convite de instalação intermitente ---------- */
{
  const LINK = '<link rel="stylesheet" href="/css/extras.css">';
  const SC = '<script src="/js/site/extras.js" defer></script><script src="/js/pwa/botao-instalar.js" defer></script>';
  let n = 0;
  for (const f of ['index.html', '404.html', ...PAGINAS]) {
    if (!existsSync(R(f)) || f.startsWith('conta/') || f === 'offline.html') continue;
    const s = read(f); let t = s;
    if (!t.includes('/css/extras.css')) t = t.replace('</head>', LINK + '</head>');
    if (!t.includes('/js/site/extras.js')) t = t.replace('</body>', SC + '</body>');
    if (t !== s) { write(f, t); n++; }
  }
  console.log(`Extras (partilha, contador, convite de instalação): ${n} páginas.`);
}
/* ---------- sw.js: só as FERRAMENTAS funcionam offline; lista e versão do cache geradas aqui ---------- */
if (existsSync(R('sw.js'))) {
  const pagTools = PAGINAS.filter((f) => f.startsWith('ferramentas/')).map(urlDe);
  const ativos = new Set(['/manifest.json', '/favicon.ico', '/favicon-32x32.png', '/favicon-16x16.png', '/apple-touch-icon.png', '/icon-192.png', '/icon-512.png']);
  for (const f of PAGINAS.filter((x) => x.startsWith('ferramentas/'))) {
    for (const m of read(f).matchAll(/(?:src|href)="(\/[^"#?]*\.(?:js|css|webp|png|svg|jpg|ico))(?:\?[^"]*)?"/g)) ativos.add(m[1]);
  }
  const tools = [...new Set([...pagTools, ...ativos])].sort();
  let sw = read('sw.js');
  sw = sw.replace(/const CACHE = "[^"]*";/, `const CACHE = "ec-${Date.now().toString(36)}";`);
  sw = sw.replace(/\/\*EC:TOOLS\*\/[\s\S]*?\/\*\/EC:TOOLS\*\//, () => `/*EC:TOOLS*/const TOOLS = ${JSON.stringify(tools)};/*/EC:TOOLS*/`);
  write('sw.js', sw);
  console.log(`Offline: ${pagTools.length} páginas de ferramentas + ${tools.length - pagTools.length} ficheiros em cache.`);
}
console.log(`Build ok: ${itens.length} itens (${destaques.length} dicas na home).`);
