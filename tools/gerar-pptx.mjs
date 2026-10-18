/* Gera um PowerPoint (.pptx) por aula a partir dos slides definidos no CMS.
   Chamado pelo build.mjs em cada publicação: editar os slides no Decap actualiza o PPTX sozinho. */
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const AZ = '0B1A33', AZUL = '0148E0', LARANJA = 'F28C1C', CLARO = 'EAF1FF', CINZA = '5B6B85';
const limpa = (t) => String(t || '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1').replace(/`/g, '').replace(/\[(.+?)\]\(.+?\)/g, '$1').replace(/<[^>]+>/g, '').trim();

/* markdown simples do slide → { numerada, itens[] , paragrafos[] } */
function analisa(md) {
  const linhas = String(md || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const itens = [], par = []; let numerada = false;
  for (const l of linhas) {
    let m;
    if ((m = l.match(/^[-*]\s+(.*)/))) itens.push(limpa(m[1]));
    else if ((m = l.match(/^\d+[.)]\s+(.*)/))) { numerada = true; itens.push(limpa(m[1])); }
    else par.push(limpa(l));
  }
  return { numerada, itens, par };
}

export async function gerarPptx(PptxGenJS, o) {
  const { curso, aula, n, total, notaMinima, raiz, destino } = o;
  const pres = new PptxGenJS();
  pres.layout = 'LAYOUT_16x9';
  pres.title = `${aula.titulo} — ${curso}`; pres.author = 'Enfermeiro Corporativo'; pres.company = 'Alcartel Digital Vision'; pres.subject = curso;
  const RODAPE = 'Enfermeiro Corporativo · encorp.vercel.app';
  const slidesN = aula.slides.length;

  /* 1. título */
  let s = pres.addSlide(); s.background = { color: AZ };
  s.addShape(pres.ShapeType.ellipse, { x: 7.3, y: 1.1, w: 3.2, h: 3.2, fill: { color: AZUL, transparency: 55 }, line: { color: AZUL, width: 0 }, objectName: 'Círculo decorativo' });
  s.addText(limpa(curso).toUpperCase(), { x: 0.7, y: 0.9, w: 8, h: 0.4, fontFace: 'Calibri', fontSize: 13, bold: true, color: LARANJA, charSpacing: 2, isTextBox: true, margin: 0 });
  s.addText(aula.titulo, { x: 0.7, y: 1.5, w: 7.2, h: 1.8, fontFace: 'Calibri', fontSize: 38, bold: true, color: 'FFFFFF', valign: 'top', isTextBox: true, margin: 0, fit: 'shrink' });
  s.addText(`Aula ${n} de ${total}${aula.duracao ? ' · ' + aula.duracao : ''}`, { x: 0.7, y: 3.55, w: 7, h: 0.4, fontFace: 'Calibri', fontSize: 16, color: 'CADCFC', isTextBox: true, margin: 0 });
  s.addText(RODAPE, { x: 0.7, y: 5.0, w: 8, h: 0.3, fontFace: 'Calibri', fontSize: 10, color: '8FA3C4', isTextBox: true, margin: 0 });
  if (aula.conteudo) s.addNotes(limpa(aula.conteudo));

  /* 2. nesta aula */
  if (aula.resumo) {
    s = pres.addSlide(); s.background = { color: 'FFFFFF' };
    s.addText('NESTA AULA', { x: 0.6, y: 0.45, w: 5, h: 0.3, fontFace: 'Calibri', fontSize: 12, bold: true, color: LARANJA, charSpacing: 2, isTextBox: true, margin: 0 });
    s.addText(aula.resumo, { x: 0.6, y: 1.0, w: 8.8, h: 1.6, fontFace: 'Calibri', fontSize: 26, color: AZ, bold: true, valign: 'top', isTextBox: true, margin: 0, fit: 'shrink' });
    s.addText(slidesN ? `${slidesN} slides · teste final de 10 perguntas` : 'Teste final de 10 perguntas', { x: 0.6, y: 3.0, w: 8, h: 0.4, fontFace: 'Calibri', fontSize: 16, color: CINZA, isTextBox: true, margin: 0 });
    s.addText(RODAPE, { x: 0.6, y: 5.1, w: 8, h: 0.3, fontFace: 'Calibri', fontSize: 9, color: CINZA, isTextBox: true, margin: 0 });
  }

  /* 3. um slide de conteúdo por slide do CMS */
  aula.slides.forEach((sl, i) => {
    const a = analisa(sl.texto);
    const img = sl.imagem && existsSync(join(raiz, sl.imagem.replace(/^\//, ''))) ? join(raiz, sl.imagem.replace(/^\//, '')) : null;
    s = pres.addSlide(); s.background = { color: 'FFFFFF' };
    s.addText(`AULA ${n} · SLIDE ${i + 1} DE ${slidesN}`, { x: 0.6, y: 0.4, w: 6, h: 0.3, fontFace: 'Calibri', fontSize: 11, bold: true, color: LARANJA, charSpacing: 2, isTextBox: true, margin: 0 });
    s.addText(sl.titulo, { x: 0.6, y: 0.75, w: 8.8, h: 0.9, fontFace: 'Calibri', fontSize: 28, bold: true, color: AZ, valign: 'top', isTextBox: true, margin: 0, fit: 'shrink' });
    const larg = 5.6;
    const corpo = a.itens.length
      ? a.itens.map((t, k) => ({ text: t, options: { bullet: a.numerada ? { type: 'number' } : true, breakLine: k < a.itens.length - 1, paraSpaceAfter: 8 } }))
      : a.par.map((t, k) => ({ text: t, options: { breakLine: k < a.par.length - 1, paraSpaceAfter: 8 } }));
    s.addText(corpo.length ? corpo : [{ text: ' ', options: {} }], { x: 0.6, y: 1.75, w: larg + 0.4, h: 3.2, fontFace: 'Calibri', fontSize: 19, color: '24344F', valign: 'top', isTextBox: true, margin: 0, fit: 'shrink' });
    if (img) s.addImage({ path: img, x: 6.9, y: 1.75, w: 2.6, h: 2.6, sizing: { type: 'contain', w: 2.6, h: 2.6 }, altText: sl.titulo });
    else {
      s.addShape(pres.ShapeType.ellipse, { x: 7.0, y: 1.95, w: 2.3, h: 2.3, fill: { color: CLARO }, line: { color: CLARO, width: 0 }, objectName: 'Círculo do número' });
      s.addText(String(i + 1), { x: 7.0, y: 1.95, w: 2.3, h: 2.3, fontFace: 'Calibri', fontSize: 72, bold: true, color: AZUL, align: 'center', valign: 'middle', isTextBox: true, margin: 0 });
    }
    s.addText(RODAPE, { x: 0.6, y: 5.1, w: 8, h: 0.3, fontFace: 'Calibri', fontSize: 9, color: CINZA, isTextBox: true, margin: 0 });
    s.addNotes(`${sl.titulo}. ${a.itens.concat(a.par).join(' ')}`);
  });

  /* 4. teste */
  if (aula.teste) {
    s = pres.addSlide(); s.background = { color: AZ };
    s.addText('PRÓXIMO PASSO', { x: 0.7, y: 0.9, w: 6, h: 0.3, fontFace: 'Calibri', fontSize: 13, bold: true, color: LARANJA, charSpacing: 2, isTextBox: true, margin: 0 });
    s.addText('Teste de avaliação', { x: 0.7, y: 1.4, w: 8.5, h: 1, fontFace: 'Calibri', fontSize: 40, bold: true, color: 'FFFFFF', isTextBox: true, margin: 0 });
    s.addText([
      { text: '10 perguntas', options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
      { text: `Nota mínima de aprovação: ${aula.teste.notaMinima || notaMinima}%`, options: { bullet: true, breakLine: true, paraSpaceAfter: 8 } },
      { text: 'Só avança para a aula seguinte quem for aprovado', options: { bullet: true } }], { x: 0.7, y: 2.7, w: 8.5, h: 1.8, fontFace: 'Calibri', fontSize: 20, color: 'CADCFC', valign: 'top', isTextBox: true, margin: 0 });
    s.addText(RODAPE, { x: 0.7, y: 5.0, w: 8, h: 0.3, fontFace: 'Calibri', fontSize: 10, color: '8FA3C4', isTextBox: true, margin: 0 });
  }
  await pres.writeFile({ fileName: destino });
}
