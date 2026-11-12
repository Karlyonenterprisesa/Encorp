/* ENCORP · PDF dos slides (para o leitor)
   O leitor de cada aula abre o PowerPoint como PDF (igual ao leitor da Biblioteca): páginas fiéis ao .pptx, com zoom, imprimir e partilhar.
   A Vercel não tem LibreOffice, por isso os PDF são gerados AQUI, no seu computador, e enviados para o repositório junto com o resto.

   Como usar (depois de mudar slides no CMS ou no gerador):
     1) node build.mjs                    → gera os .pptx e cursos/slides/hashes.json
     2) node tools/gerar-pdf-slides.mjs   → converte só as aulas que mudaram e actualiza cursos/slides/pdf.json
     3) envie para o GitHub as pastas cursos/slides/ e cursos/dados/ (node build.mjs outra vez actualiza cursos/dados/)
   Requer o LibreOffice (comando «soffice»). Para usar outro comando: SOFFICE="caminho/para/soffice" node tools/gerar-pdf-slides.mjs

   Se um PDF ficar desactualizado, o leitor não o mostra (continua a ler os slides no ecrã e a oferecer o .pptx). */
import { readFileSync, writeFileSync, existsSync, mkdirSync, renameSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const R = (...p) => join(RAIZ, ...p);
const lerJson = (f) => { try { return JSON.parse(readFileSync(R(f), 'utf8')); } catch { return {}; } };
const SOFFICE = process.env.SOFFICE || 'soffice';

const hashes = lerJson('cursos/slides/hashes.json');
const feitos = lerJson('cursos/slides/pdf.json');
const chaves = Object.keys(hashes);
if (!chaves.length) { console.error('Sem cursos/slides/hashes.json — corra primeiro: node build.mjs'); process.exit(1); }

let n = 0, ok = 0;
for (const k of chaves) {
  const [slug, aula] = k.split('/');
  const pptx = R(`cursos/slides/${slug}/aula-${aula}.pptx`), pdf = R(`cursos/slides/${slug}/aula-${aula}.pdf`);
  if (feitos[k] === hashes[k] && existsSync(pdf)) continue;          // já está actualizado
  if (!existsSync(pptx)) { console.warn('Falta', pptx); continue; }
  n++;
  const tmp = R('.pdf-tmp'); mkdirSync(tmp, { recursive: true });
  try {
    execSync(`${SOFFICE} --headless --convert-to pdf --outdir "${tmp}" "${pptx}"`, { stdio: 'ignore', timeout: 180000 });
    const saida = join(tmp, `aula-${aula}.pdf`);
    if (!existsSync(saida)) throw new Error('o LibreOffice não gerou o PDF');
    mkdirSync(dirname(pdf), { recursive: true });
    renameSync(saida, pdf); feitos[k] = hashes[k]; ok++;
    console.log('✔', k);
  } catch (e) { console.warn('✘', k, '—', e.message); }
}
rmSync(R('.pdf-tmp'), { recursive: true, force: true });
for (const k of Object.keys(feitos)) if (!hashes[k]) delete feitos[k];   // aulas que já não existem
writeFileSync(R('cursos/slides/pdf.json'), JSON.stringify(feitos, null, 1));
console.log(n ? `PDF: ${ok} de ${n} convertidos.` : 'PDF: tudo actualizado.');
console.log('Agora corra «node build.mjs» para o leitor passar a mostrar os PDF, e envie cursos/slides/ e cursos/dados/.');
