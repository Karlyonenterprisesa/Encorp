/* Calcula o atributo integrity (SRI) do Decap CMS indicado em admin/index.html e imprime a etiqueta <script> pronta a colar.
   Uso (com internet):  node tools/sri-decap.mjs
   Depois de colar, o navegador recusa o script se o ficheiro no unpkg for alterado. Repita ao mudar de versão. */
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const html = readFileSync(new URL('../admin/index.html', import.meta.url), 'utf8');
const m = html.match(/https:\/\/unpkg\.com\/decap-cms@(\d+\.\d+\.\d+)\/dist\/decap-cms\.js/);
if (!m) { console.error('admin/index.html tem de usar uma versão exacta (ex.: decap-cms@3.10.0).'); process.exit(1); }
const buf = Buffer.from(await (await fetch(m[0])).arrayBuffer());
const sri = 'sha384-' + createHash('sha384').update(buf).digest('base64');
console.log(`<script src="${m[0]}" integrity="${sri}" crossorigin="anonymous"></script>`);
