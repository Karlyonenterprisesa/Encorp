/* ENCORP · gerador de PowerPoint (.pptx) por aula, a partir dos slides definidos no CMS.
   Chamado pelo build.mjs em cada publicação: editar os slides no Decap actualiza o PPTX sozinho.

   Cada slide do CMS tem um «tipo» (campo opcional) que decide o desenho:
     conteudo (por defeito) · objetivos · fluxo · caso · pontos-chave · resumo · reflexao · leitura
   O texto do slide é markdown simples:
     - listas com «-» ou «1.»      > citação = caixa de destaque (use «> **Atenção:** …» para alerta)
     | tabela | em | markdown |    ### subtítulo        **negrito**        [texto](/ligação)
   O campo «notas» do slide vira as notas do orador. */
import { existsSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { FICHA } from './ficha-curso.mjs';

/* Paleta do site ENCORP (azul-marinho #0b1a33, dourado #e8a317, castanho #a64b00, fundo #fbfaf7): os slides, o leitor e o site têm as mesmas cores.
   Medidas do modelo «Aula EC4» (faixa de título, rodapé cinzento, Arial). */
const AZ = '0B1A33', AZUL = 'A64B00', LARANJA = 'E8A317', CLARO = 'E7ECF4', CINZA = '5B6B85', TEXTO = '0F2547';
const VERDE = 'E8A317', VERDE_CL = 'FFF3D6', ALERTA_CL = 'FDE8E8', CREME = 'FBFAF7', LINHA = 'DFE6F0', SITE = 'https://encorp.vercel.app';
const ESCURO2 = '07122A', CLARO_T = 'C6CFE1', LINHA_T = 'E8A317', CLARO_T2 = 'E7ECF4', MARINHO2 = '14284A', TINTA = 'F3F5FA';
const FONTE = 'Arial';
const W = 10, H = 5.625, MX = 0.5, CW = W - 2 * MX;          // margens e largura útil
const BANDA = 1.01, TOPO = 1.3, FUNDO = 5.05, ALT = FUNDO - TOPO;   // faixa do título e área de conteúdo

const limpa = (t) => String(t || '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, '$1$2').replace(/`/g, '').replace(/\[(.+?)\]\(.+?\)/g, '$1').replace(/<[^>]+>/g, '').trim();

/* «texto **negrito** [ligação](url)» → pedaços de texto formatados */
function pedacos(t, base = {}) {
  const out = []; const re = /\*\*(.+?)\*\*|(?<![\w*])\*([^*\s][^*]*?)\*(?![\w*])|\[(.+?)\]\((.+?)\)/g; let i = 0, m;
  const s = String(t || '').replace(/`/g, '').replace(/<[^>]+>/g, '');
  while ((m = re.exec(s))) {
    if (m.index > i) out.push({ text: s.slice(i, m.index), options: { ...base } });
    if (m[1] !== undefined) out.push({ text: m[1], options: { ...base, bold: true } });
    else if (m[2] !== undefined) out.push({ text: m[2], options: { ...base, italic: true } });
    else out.push({ text: m[3], options: { ...base, color: AZUL, underline: { style: 'sng' }, hyperlink: { url: m[4].startsWith('/') ? SITE + m[4] : m[4] } } });
    i = re.lastIndex;
  }
  if (i < s.length) out.push({ text: s.slice(i), options: { ...base } });
  return out.length ? out : [{ text: '', options: { ...base } }];
}
/* um parágrafo → pedaços, onde só o último quebra a linha (a menos que seja o último parágrafo da caixa) */
function paragrafo(t, base, primeiro = {}, ultimo = false) {
  const p = pedacos(t, base);
  Object.assign(p[0].options, primeiro);
  if (!ultimo) p[p.length - 1].options.breakLine = true;
  return p;
}

/* markdown do slide → blocos */
export function blocos(md) {
  const linhas = String(md || '').replace(/\r/g, '').split('\n').map((l) => l.trim()).filter((l) => l !== '');
  const out = []; let b = null;
  const abre = (tipo) => { if (!b || b.tipo !== tipo) { b = { tipo, itens: [] }; out.push(b); } return b; };
  for (const l of linhas) {
    let m;
    if ((m = l.match(/^#{1,6}\s+(.*)/))) { out.push({ tipo: 'sub', itens: [m[1]] }); b = null; }
    else if ((m = l.match(/^[-*]\s+(.*)/))) abre('lista').itens.push(m[1]);
    else if ((m = l.match(/^\d+[.)]\s+(.*)/))) abre('num').itens.push(m[1]);
    else if ((m = l.match(/^>\s?(.*)/))) abre('citacao').itens.push(m[1]);
    else if (l.startsWith('|')) {
      const cels = l.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      if (cels.every((c) => /^:?-{2,}:?$/.test(c))) continue;
      abre('tabela').itens.push(cels);
    } else { out.push({ tipo: 'par', itens: [l] }); b = null; }
  }
  return out;
}

/* ---------- estimativa de altura (o PowerPoint só encolhe texto ao abrir; aqui calculamos antes) ---------- */
const nLinhas = (txt, larg, fs) => { const cpl = Math.max(8, Math.floor((larg * 72) / (fs * 0.5))); return Math.max(1, Math.ceil(limpa(txt).length / cpl)); };
const altTexto = (txt, larg, fs) => (nLinhas(txt, larg, fs) * fs * 1.2) / 72;
const alturaLinhaTabela = (r, larg, fs) => Math.max(...r.map((c) => altTexto(c, Math.max(0.5, larg / r.length - 0.2), fs))) + 0.1;
function altBloco(b, larg, fs) {
  const esp = (fs * 0.5) / 72;
  if (b.tipo === 'par' || b.tipo === 'sub') return altTexto(b.itens[0], larg, fs) + esp;
  if (b.tipo === 'lista' || b.tipo === 'num') return b.itens.reduce((a, t) => a + altTexto(t, larg - 0.35, fs) + esp * 0.9, 0) + esp * 0.4;
  if (b.tipo === 'citacao') return b.itens.reduce((a, t) => a + altTexto(t, larg - 0.55, fs - 1), 0) + 0.3 + esp;
  if (b.tipo === 'tabela') { const f = Math.min(fs - 2, 14); return b.itens.reduce((a, r) => a + alturaLinhaTabela(r, larg, f), 0) + esp; }
  return 0.3;
}
function pesos(tab) {
  const n = tab[0].length; const p = Array(n).fill(6), pal = Array(n).fill(0);
  tab.forEach((r) => r.forEach((c, k) => {
    p[k] = Math.max(p[k], Math.min(40, limpa(c).length));
    pal[k] = Math.max(pal[k], ...limpa(c).split(/\s+/).map((w) => w.length));   // a coluna nunca fica mais estreita que a maior palavra
  }));
  const q = p.map((x, k) => Math.max(x, pal[k] + 2)), s = q.reduce((a, x) => a + x, 0); return q.map((x) => x / s);
}
/* maior tamanho de letra em que tudo cabe */
function escolheTamanho(bl, larg, alt, maxFs = 17) {
  for (let fs = maxFs; fs >= 12; fs--) { const h = bl.reduce((a, b) => a + altBloco(b, larg, fs), 0); if (h <= alt) return { fs, cabe: true }; }
  return { fs: 12, cabe: false };
}

/* desenha uma sequência de blocos a partir de (x,y) */
function desenha(pres, s, bl, x, y, larg, fs, cor = TEXTO) {
  const esp = (fs * 0.5) / 72;
  for (const b of bl) {
    const h = altBloco(b, larg, fs);
    if (b.tipo === 'sub') {
      s.addText(limpa(b.itens[0]).toUpperCase(), { x, y, w: larg, h, fontFace: FONTE, fontSize: Math.max(11, fs - 4), bold: true, color: AZUL, charSpacing: 1, valign: 'top', margin: 0, isTextBox: true });
    } else if (b.tipo === 'par') {
      s.addText(pedacos(b.itens[0], { fontFace: FONTE, fontSize: fs, color: cor }), { x, y, w: larg, h, valign: 'top', margin: 0, isTextBox: true });
    } else if (b.tipo === 'lista' || b.tipo === 'num') {
      const runs = []; b.itens.forEach((t, k) => runs.push(...paragrafo(t, { fontFace: FONTE, fontSize: fs, color: cor }, { bullet: b.tipo === 'num' ? { type: 'number' } : true, paraSpaceAfter: fs * 0.45 }, k === b.itens.length - 1)));
      s.addText(runs, { x, y, w: larg, h, valign: 'top', margin: 0, isTextBox: true });
    } else if (b.tipo === 'citacao') {
      const alerta = /^\s*\*{0,2}\s*(aten[cç][aã]o|alerta|cuidado|perigo|seguran[cç]a|erro)/i.test(b.itens[0]) || /^[⚠!]/.test(b.itens[0]);
      const hh = h - esp, c1 = alerta ? ALERTA_CL : CLARO, c2 = alerta ? 'C0392B' : AZUL;
      s.addShape(pres.ShapeType.rect, { x, y, w: larg, h: hh, fill: { color: c1 }, line: { color: c1, width: 0 } });
      s.addShape(pres.ShapeType.rect, { x, y, w: 0.08, h: hh, fill: { color: c2 }, line: { color: c2, width: 0 } });
      const runs = []; b.itens.forEach((t, k) => runs.push(...paragrafo(t, { fontFace: FONTE, fontSize: fs - 1, color: AZ }, {}, k === b.itens.length - 1)));
      s.addText(runs, { x: x + 0.25, y: y + 0.05, w: larg - 0.45, h: hh - 0.1, valign: 'middle', margin: 0, isTextBox: true });
    } else if (b.tipo === 'tabela') {
      const f = Math.min(fs - 2, 14), pw = pesos(b.itens), alturas = b.itens.map((r) => alturaLinhaTabela(r, larg, f));
      const linhas = b.itens.map((r, i) => r.map((c) => ({ text: pedacos(c || ' ', { fontFace: FONTE, fontSize: f, color: i === 0 ? 'FFFFFF' : TEXTO, bold: i === 0 }), options: { fill: { color: i === 0 ? AZUL : (i % 2 ? 'FFFFFF' : TINTA) }, valign: 'middle' } })));
      s.addTable(linhas, { x, y, w: larg, colW: pw.map((p) => p * larg), rowH: alturas, border: { type: 'solid', pt: 0.75, color: LINHA }, margin: [0.03, 0.08, 0.03, 0.08], fontFace: FONTE, fontSize: f });
    }
    y += h;
  }
  return y;
}

/* ---------- peças comuns ---------- */
const ROTULO = { conteudo: 'CONTEÚDO', objetivos: 'OBJECTIVOS', fluxo: 'SEQUÊNCIA', caso: 'CASO CLÍNICO', 'pontos-chave': 'PONTOS-CHAVE', resumo: 'RESUMO', reflexao: 'PARA REFLECTIR', leitura: 'PARA APROFUNDAR' };
function cabecalho(pres, s, o, sl) {
  s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: BANDA, fill: { color: AZ }, line: { color: AZ, width: 0 }, objectName: 'Faixa do título' });
  s.addShape(pres.ShapeType.rect, { x: 0, y: BANDA, w: W, h: 0.05, fill: { color: LARANJA }, line: { color: LARANJA, width: 0 }, objectName: 'Filete dourado' });
  s.addText(`${ROTULO[o.tipo]}  ·  AULA ${o.n}`, { x: MX, y: 0.1, w: 8, h: 0.28, fontFace: FONTE, fontSize: 11, color: CLARO_T, margin: 0, isTextBox: true });
  const tit = limpa(sl.titulo); const fs = tit.length > 52 ? 17 : tit.length > 38 ? 19 : 21;
  s.addText(tit, { x: MX, y: 0.38, w: CW, h: 0.6, fontFace: FONTE, fontSize: fs, bold: true, color: 'FFFFFF', valign: 'middle', margin: 0, isTextBox: true });
}
function rodape(pres, s, o, sl) {
  if (sl && sl.fonte) s.addText(limpa(sl.fonte), { x: MX, y: 5.02, w: CW, h: 0.25, fontFace: FONTE, fontSize: 9.5, italic: true, color: CINZA, align: 'right', margin: 0, isTextBox: true });
  s.addText(`${FICHA.instituicao} · ${FICHA.entidadeFormadora} — ${limpa(o.curso)}`, { x: MX - 0.1, y: 5.33, w: 8, h: 0.22, fontFace: FONTE, fontSize: 9, color: CINZA, margin: 0, isTextBox: true });
  s.addText(String(o.i), { x: W - MX - 0.4, y: 5.33, w: 0.5, h: 0.22, fontFace: FONTE, fontSize: 9, color: CINZA, align: 'right', margin: 0, isTextBox: true });
}
const itensDe = (bl) => bl.filter((b) => b.tipo === 'lista' || b.tipo === 'num').flatMap((b) => b.itens);
const circulo = (pres, s, x, y, d, cor, txt, fs) => {
  s.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: cor }, line: { color: cor, width: 0 } });
  s.addText(txt, { x, y, w: d, h: d, fontFace: FONTE, fontSize: fs, bold: true, color: cor === LARANJA ? AZ : 'FFFFFF', align: 'center', valign: 'middle', margin: 0, isTextBox: true });
};
const caixa = (pres, s, x, y, w, h, fill, linha) => s.addShape(pres.ShapeType.roundRect, { x, y, w, h, fill, line: { color: linha, width: 0.75 }, rectRadius: 0.08 });
const intro = (s, bl, y, fs = 15) => { const p = bl.find((b) => b.tipo === 'par'); if (!p) return y; s.addText(limpa(p.itens[0]), { x: MX, y, w: CW, h: 0.35, fontFace: FONTE, fontSize: fs, italic: true, color: CINZA, margin: 0, isTextBox: true }); return y + 0.45; };

/* ---------- desenhos por tipo (devolvem false se o texto não couber) ---------- */
function tipoConteudo(pres, s, bl, img, sl) {
  const larg = img ? 5.7 : CW; const { fs, cabe } = escolheTamanho(bl, larg, ALT);
  desenha(pres, s, bl, MX, TOPO, larg, fs);
  if (img) s.addImage({ path: img, x: 6.7, y: TOPO, w: 2.7, h: 2.9, sizing: { type: 'contain', w: 2.7, h: 2.9 }, altText: sl.titulo });
  return cabe;
}
function tipoObjetivos(pres, s, bl) {
  const itens = itensDe(bl), y0 = intro(s, bl, TOPO - 0.05, 16), n = itens.length, fs = n > 5 ? 14 : 16, h = Math.min(0.62, (FUNDO - y0 - 0.08 * (n - 1)) / n);
  itens.forEach((t, k) => {
    const y = y0 + k * (h + 0.08);
    caixa(pres, s, MX, y, CW, h, { color: VERDE_CL }, VERDE_CL); circulo(pres, s, MX + 0.14, y + (h - 0.34) / 2, 0.34, VERDE, String(k + 1), 12);
    s.addText(pedacos(t, { fontFace: FONTE, fontSize: fs, color: AZ }), { x: MX + 0.62, y, w: CW - 0.78, h, valign: 'middle', margin: 0, isTextBox: true });
  });
  return n <= 6;
}
function tipoFluxo(pres, s, bl) {
  const itens = itensDe(bl), resto = bl.filter((b) => b.tipo !== 'lista' && b.tipo !== 'num');
  const linhasN = itens.length > 5 ? 2 : 1, porLinha = Math.ceil(itens.length / linhasN), gap = 0.14, reservado = resto.length ? 0.85 : 0;
  const altCard = Math.min(2.3, (ALT - reservado - gap * (linhasN - 1)) / linhasN), larg = (CW - gap * (porLinha - 1)) / porLinha;
  itens.forEach((t, k) => {
    const r = Math.floor(k / porLinha), c = k % porLinha, x = MX + c * (larg + gap), y = TOPO + r * (altCard + gap), cor = k % 2 ? LARANJA : AZUL;
    const m = limpa(t).match(/^(.{1,28}?)\s*(?::|—|–)\s+(.*)$/), rot = m ? m[1] : String(k + 1), desc = m ? m[2] : limpa(t), curto = rot.length <= 3;
    caixa(pres, s, x, y, larg, altCard, { color: k % 2 ? CLARO : TINTA }, LINHA);
    s.addShape(pres.ShapeType.rect, { x, y, w: larg, h: 0.07, fill: { color: cor }, line: { color: cor, width: 0 } });
    s.addText(rot, { x: x + 0.1, y: y + 0.12, w: larg - 0.2, h: curto ? 0.62 : 0.5, fontFace: FONTE, fontSize: curto ? 34 : 15, bold: true, color: AZUL, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    s.addText(desc, { x: x + 0.12, y: y + (curto ? 0.8 : 0.66), w: larg - 0.24, h: altCard - (curto ? 0.9 : 0.76), fontFace: FONTE, fontSize: larg > 1.5 ? 14 : 12, color: TEXTO, align: 'center', valign: 'top', margin: 0, isTextBox: true });
  });
  if (resto.length) desenha(pres, s, resto, MX, FUNDO - 0.75, CW, 14);
  return itens.length <= 10;
}
function tipoCaso(pres, s, bl) {
  s.addShape(pres.ShapeType.rect, { x: MX - 0.1, y: TOPO - 0.1, w: CW + 0.2, h: ALT + 0.2, fill: { color: CREME }, line: { color: 'F6DDB8', width: 0.75 } });
  s.addShape(pres.ShapeType.rect, { x: MX - 0.1, y: TOPO - 0.1, w: 0.1, h: ALT + 0.2, fill: { color: LARANJA }, line: { color: LARANJA, width: 0 } });
  const larg = CW - 0.35, { fs, cabe } = escolheTamanho(bl, larg, ALT - 0.1, 18);
  desenha(pres, s, bl, MX + 0.2, TOPO + 0.02, larg, fs);
  return cabe;
}
function tipoCartoes(pres, s, bl, escuro) {
  const itens = itensDe(bl), n = itens.length, col = n > 4 ? 2 : 1, linhasN = Math.ceil(n / col), gap = 0.12;
  const larg = (CW - gap * (col - 1)) / col, h = Math.min(0.9, (ALT - gap * (linhasN - 1)) / linhasN), fs = h < 0.55 ? 13 : (col === 2 ? 14 : 16);
  itens.forEach((t, k) => {
    const c = col === 2 ? Math.floor(k / linhasN) : 0, r = col === 2 ? k % linhasN : k, x = MX + c * (larg + gap), y = TOPO + r * (h + gap);
    caixa(pres, s, x, y, larg, h, escuro ? { color: 'FFFFFF', transparency: 90 } : { color: CLARO }, escuro ? '2B4378' : CLARO);
    circulo(pres, s, x + 0.14, y + (h - 0.36) / 2, 0.36, LARANJA, String(k + 1), 13);
    s.addText(pedacos(t, { fontFace: FONTE, fontSize: fs, color: escuro ? 'FFFFFF' : AZ }), { x: x + 0.64, y, w: larg - 0.78, h, valign: 'middle', margin: 0, isTextBox: true });
  });
  return h >= 0.45;
}
function tipoReflexao(pres, s, bl) {
  const itens = itensDe(bl), y0 = intro(s, bl, TOPO - 0.05), n = itens.length, gap = 0.1, h = Math.min(0.95, (FUNDO - y0 - gap * (n - 1)) / n);
  itens.forEach((t, k) => {
    const y = y0 + k * (h + gap);
    caixa(pres, s, MX, y, CW, h, { color: TINTA }, LINHA); circulo(pres, s, MX + 0.15, y + (h - 0.44) / 2, 0.44, AZUL, '?', 18);
    s.addText(pedacos(t, { fontFace: FONTE, fontSize: h < 0.7 ? 14 : 16, color: AZ }), { x: MX + 0.78, y, w: CW - 0.95, h, valign: 'middle', margin: 0, isTextBox: true });
  });
  return n <= 5;
}
function tipoLeitura(pres, s, bl) {
  const itens = itensDe(bl), y0 = intro(s, bl, TOPO - 0.05), n = itens.length, gap = 0.1, h = Math.min(0.7, (FUNDO - y0 - gap * (n - 1)) / n);
  itens.forEach((t, k) => {
    const y = y0 + k * (h + gap);
    caixa(pres, s, MX, y, CW, h, { color: CLARO }, CLARO);
    s.addText('→', { x: MX + 0.12, y, w: 0.4, h, fontFace: FONTE, fontSize: 20, bold: true, color: AZUL, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    s.addText(pedacos(t, { fontFace: FONTE, fontSize: 15, color: AZ }), { x: MX + 0.62, y, w: CW - 0.8, h, valign: 'middle', margin: 0, isTextBox: true });
  });
  return n <= 6;
}

/* O pptxgenjs escreve um <a:pPr> a seguir a cada trecho de texto depois do primeiro dentro do mesmo parágrafo
   (ex.: «texto **negrito** texto»). É XML inválido: o LibreOffice perde marcadores e o PowerPoint pode pedir «reparar».
   Aqui retiramos esses <a:pPr> soltos (os que vêm logo depois de </a:r>) de todos os slides. */
async function removePPrSoltos(buf, avisos) {
  let JSZip;
  try { const rq = createRequire(import.meta.url); try { JSZip = rq('jszip'); } catch { JSZip = createRequire(rq.resolve('pptxgenjs'))('jszip'); } }
  catch { avisos.push('jszip não encontrado: o PowerPoint foi gravado sem a limpeza do XML (npm install).'); return buf; }
  const zip = await JSZip.loadAsync(buf, { createFolders: false });
  for (const nome of Object.keys(zip.files).filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f))) {
    const xml = await zip.file(nome).async('string');
    zip.file(nome, xml.replace(/(<\/a:r>)<a:pPr\b[^>]*?(?:\/>|>[\s\S]*?<\/a:pPr>)/g, '$1'));
  }
  const pastas = Object.keys(zip.files).filter((f) => f.endsWith('/'));
  const limpo = new JSZip();
  for (const f of Object.keys(zip.files)) if (!pastas.includes(f)) limpo.file(f, await zip.file(f).async('nodebuffer'), { createFolders: false });
  return limpo.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });   // sem entradas de pasta (o PowerPoint na nuvem recusa-as)
}

/* ---------- apresentação ---------- */
export async function gerarPptx(PptxGenJS, o) {
  const { curso, aula, n, total, notaMinima, raiz, destino } = o;
  const avisos = [];
  const pres = new PptxGenJS();
  pres.layout = 'LAYOUT_16x9';
  pres.title = `${aula.titulo} — ${curso}`; pres.author = FICHA.coordenador; pres.company = FICHA.instituicao; pres.subject = curso;
  pres.theme = { headFontFace: FONTE, bodyFontFace: FONTE };
  const slidesN = aula.slides.length;
  const logoK = join(raiz, FICHA.logoInstituicao), logoE = join(raiz, FICHA.logoFormadora);
  const comLogos = (s, y) => {   // logótipos em placas brancas redondas, ao centro (como o logótipo no modelo)
    const d = 0.82, gap = 0.3, x0 = (W - (2 * d + gap)) / 2;
    [[logoK, 'Logótipo Karlyon Enterprise S.A.'], [logoE, 'Logótipo ENCORP']].forEach(([f, alt], k) => {
      const x = x0 + k * (d + gap);
      s.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color: 'FFFFFF' }, line: { color: LINHA_T, width: 1 }, objectName: 'Placa do logótipo' });
      if (existsSync(f)) s.addImage({ path: f, x: x + 0.09, y: y + 0.09, w: d - 0.18, h: d - 0.18, sizing: { type: 'contain', w: d - 0.18, h: d - 0.18 }, altText: alt });
      else avisos.push(`logótipo em falta: ${f}`);
    });
  };
  const fundoCapa = (s) => {
    s.background = { color: AZ };
    s.addShape(pres.ShapeType.ellipse, { x: 7.7, y: -1.1, w: 3.6, h: 3.6, fill: { color: MARINHO2 }, line: { color: MARINHO2, width: 0 }, objectName: 'Círculo decorativo' });
    s.addShape(pres.ShapeType.ellipse, { x: -1.2, y: 3.7, w: 2.6, h: 2.6, fill: { color: MARINHO2 }, line: { color: MARINHO2, width: 0 }, objectName: 'Círculo decorativo 2' });
    s.addShape(pres.ShapeType.rect, { x: 0, y: H - 0.48, w: W, h: 0.48, fill: { color: ESCURO2 }, line: { color: ESCURO2, width: 0 }, objectName: 'Faixa do rodapé' });
    s.addText(`${FICHA.instituicao}  •  ${FICHA.local}  •  ${SITE.replace('https://', '')}`, { x: 0.3, y: H - 0.42, w: W - 0.6, h: 0.36, fontFace: FONTE, fontSize: 9, color: CLARO_T, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
  };

  /* 1. capa (modelo EC4): logótipos · instituição · entidade formadora · curso · aula · coordenador */
  let s = pres.addSlide(); fundoCapa(s);
  comLogos(s, 0.28);
  s.addText(FICHA.instituicao.toUpperCase(), { x: 0.6, y: 1.2, w: W - 1.2, h: 0.32, fontFace: FONTE, fontSize: 15, bold: true, color: 'FFFFFF', align: 'center', margin: 0, isTextBox: true });
  s.addText(`(${FICHA.instituicaoLema})`, { x: 0.6, y: 1.5, w: W - 1.2, h: 0.25, fontFace: FONTE, fontSize: 10.5, color: CLARO_T, align: 'center', margin: 0, isTextBox: true });
  s.addShape(pres.ShapeType.line, { x: 3.6, y: 1.84, w: 2.8, h: 0, line: { color: LINHA_T, width: 1 } });
  s.addText(`Entidade Formadora: ${FICHA.entidadeFormadora}  •  ${FICHA.tipo}`, { x: 0.6, y: 1.92, w: W - 1.2, h: 0.25, fontFace: FONTE, fontSize: 10.5, color: CLARO_T, align: 'center', margin: 0, isTextBox: true });
  s.addText(limpa(curso), { x: 0.6, y: 2.2, w: W - 1.2, h: 0.3, fontFace: FONTE, fontSize: 13, bold: true, color: LARANJA, align: 'center', margin: 0, isTextBox: true });
  const tt = aula.titulo;
  s.addText(tt, { x: 0.7, y: 2.55, w: W - 1.4, h: 1.15, fontFace: FONTE, fontSize: tt.length > 60 ? 19 : tt.length > 38 ? 22 : 26, bold: true, color: 'FFFFFF', align: 'center', valign: 'middle', margin: 0, isTextBox: true });
  s.addText(`Aula ${n} de ${total}${aula.duracao ? '  ·  ' + aula.duracao : ''}`, { x: 0.7, y: 3.75, w: W - 1.4, h: 0.3, fontFace: FONTE, fontSize: 13, color: LARANJA, align: 'center', margin: 0, isTextBox: true });
  s.addText([{ text: `Coordenador: ${FICHA.coordenador}`, options: { breakLine: true, bold: true } }, { text: FICHA.natureza }], { x: 0.7, y: 4.2, w: W - 1.4, h: 0.55, fontFace: FONTE, fontSize: 11, color: CLARO_T2, align: 'center', margin: 0, isTextBox: true });
  s.addNotes(limpa(aula.conteudo) || `Aula ${n}: ${aula.titulo}.`);

  /* 2. sumário da aula: resumo + roteiro dos slides */
  if (aula.resumo || slidesN) {
    s = pres.addSlide(); s.background = { color: 'FFFFFF' };
    s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: BANDA, fill: { color: AZ }, line: { color: AZ, width: 0 }, objectName: 'Faixa do título' });
    s.addShape(pres.ShapeType.rect, { x: 0, y: BANDA, w: W, h: 0.05, fill: { color: LARANJA }, line: { color: LARANJA, width: 0 }, objectName: 'Filete dourado' });
    s.addText('SUMÁRIO DA AULA', { x: MX, y: 0.1, w: 6, h: 0.28, fontFace: FONTE, fontSize: 11, color: CLARO_T, margin: 0, isTextBox: true });
    const t2 = limpa(aula.titulo);
    s.addText(t2, { x: MX, y: 0.38, w: CW, h: 0.6, fontFace: FONTE, fontSize: t2.length > 52 ? 17 : 21, bold: true, color: 'FFFFFF', valign: 'middle', margin: 0, isTextBox: true });
    s.addText('No final desta aula o formando deve ser capaz de:', { x: MX, y: 1.3, w: 4.2, h: 0.3, fontFace: FONTE, fontSize: 12, bold: true, color: TEXTO, margin: 0, isTextBox: true });
    s.addText(limpa(aula.resumo) || aula.titulo, { x: MX, y: 1.65, w: 4.2, h: 1.4, fontFace: FONTE, fontSize: 15, color: AZ, bold: true, valign: 'top', margin: 0, isTextBox: true });
    const lc = limpa(aula.conteudo); if (lc) s.addText(lc.length > 330 ? lc.slice(0, 327).replace(/\s+\S*$/, '') + '…' : lc, { x: MX, y: 3.1, w: 4.2, h: 1.85, fontFace: FONTE, fontSize: 11, color: CINZA, valign: 'top', margin: 0, isTextBox: true });
    const tit = aula.slides.map((x) => limpa(x.titulo));
    caixa(pres, s, 5.0, 1.3, 4.5, 3.65, { color: CLARO }, LINHA);
    s.addText('Roteiro', { x: 5.2, y: 1.38, w: 4, h: 0.3, fontFace: FONTE, fontSize: 13, bold: true, color: AZ, margin: 0, isTextBox: true });
    s.addText(tit.map((t, k) => ({ text: t, options: { bullet: { type: 'number' }, breakLine: k < tit.length - 1, paraSpaceAfter: tit.length > 12 ? 1 : 3 } })), { x: 5.2, y: 1.72, w: 4.15, h: 3.15, fontFace: FONTE, fontSize: tit.length > 18 ? 8 : tit.length > 14 ? 9 : tit.length > 10 ? 10 : 11, color: TEXTO, valign: 'top', margin: 0, isTextBox: true });
    rodape(pres, s, { curso, i: 2 }, null);
    s.addNotes(`Apresente a aula: ${limpa(aula.resumo)} Percorra o roteiro (${slidesN} slides) e diga que no fim há um teste de avaliação.`);
  }

  /* 3. um slide por slide do CMS, desenhado conforme o tipo (campo opcional «fonte» = citação no rodapé, como no modelo) */
  aula.slides.forEach((sl, i) => {
    const tipo = ROTULO[sl.tipo] ? sl.tipo : 'conteudo', bl = blocos(sl.texto);
    const imgCam = sl.imagem && join(raiz, sl.imagem.replace(/^\//, '')), img = imgCam && existsSync(imgCam) ? imgCam : null;
    const ctx = { tipo, n, i: i + 3, total: slidesN, curso };
    s = pres.addSlide(); s.background = { color: 'FFFFFF' };
    cabecalho(pres, s, ctx, sl);
    const desenhos = { objetivos: tipoObjetivos, fluxo: tipoFluxo, caso: tipoCaso, 'pontos-chave': (p, x, b) => tipoCartoes(p, x, b, false), resumo: (p, x, b) => tipoCartoes(p, x, b, false), reflexao: tipoReflexao, leitura: tipoLeitura };
    const cabe = desenhos[tipo] ? desenhos[tipo](pres, s, bl) : tipoConteudo(pres, s, bl, img, sl);
    if (!cabe) avisos.push(`aula ${n}, slide ${i + 1} «${sl.titulo}»: texto demasiado longo para um slide (divida-o em dois).`);
    rodape(pres, s, ctx, sl);
    s.addNotes(limpa(sl.notas) || `${limpa(sl.titulo)}. ${bl.flatMap((b) => (b.tipo === 'tabela' ? b.itens.map((r) => r.join(': ')) : b.itens)).map(limpa).join(' ')}`.trim());
  });

  /* 4. teste */
  if (aula.teste) {
    s = pres.addSlide(); fundoCapa(s);
    s.addText('PRÓXIMO PASSO', { x: 0.7, y: 0.8, w: 6, h: 0.3, fontFace: FONTE, fontSize: 12, bold: true, color: LARANJA, margin: 0, isTextBox: true });
    s.addText('Teste de avaliação', { x: 0.7, y: 1.2, w: 8.5, h: 0.9, fontFace: FONTE, fontSize: 34, bold: true, color: 'FFFFFF', margin: 0, isTextBox: true });
    s.addText([
      { text: '10 perguntas de escolha múltipla', options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
      { text: `Nota mínima de aprovação: ${aula.teste.notaMinima || notaMinima}%`, options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
      { text: 'Reveja os pontos-chave antes de começar', options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
      { text: 'Pode repetir o teste as vezes que quiser', options: { bullet: true } }], { x: 0.7, y: 2.3, w: 8.5, h: 2.2, fontFace: FONTE, fontSize: 17, color: CLARO_T2, valign: 'top', margin: 0, isTextBox: true });
    s.addNotes('Lembre os alunos de que o teste só abre depois de ver todos os slides e que a explicação de cada resposta aparece no fim.');
  }
  const buf = await pres.write({ outputType: 'nodebuffer' });
  writeFileSync(destino, await removePPrSoltos(buf, avisos));
  return avisos;
}
