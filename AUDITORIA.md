# Auditoria ENCORP — correcções aplicadas (19/10/2026)

Resultado: `node build.mjs` ok · `node tests/api.mjs` 36/36 · 463 páginas, 0 links partidos · `index.html` testado no Chromium (antes/depois iguais, 0 erros).

## Alterado
| Área | Alteração |
|---|---|
| Testes | `tests/api.mjs` já não fixa 4 slides (usa o nº real do curso); mock de Redis com `EVAL`; novos testes: código antigo de 4 dígitos, validade do contador de falhas, teste reprovado sem certa/errada. |
| Limite de tentativas | `kv.incrExp` (INCR+EXPIRE atómico em Lua, recupera chaves sem validade) em `limite()` e no login. Acaba o bloqueio permanente. |
| Códigos | Contas novas: 6 dígitos. Contas antigas (4) continuam a entrar (login aceita 4–6). Formulário e textos actualizados. |
| Testes dos cursos | Teste reprovado devolve só a nota; correcção por pergunta só depois de aprovar (`api/aprendizagem.js`, `js/site/curso-player.js`). |
| CMS | `admin/index.html` com versão fixa `decap-cms@3.10.0`; `tools/sri-decap.mjs` gera o `integrity`. Scope GitHub por defeito: `public_repo` (antes `repo,user`). |
| Respostas no repositório | `.gitignore` com `api/_dados/` (gerado no build). |
| Cabeçalhos (`vercel.json`) | `Content-Security-Policy` (frame-ancestors/base-uri/object-src/form-action), `X-Frame-Options`, HSTS, `Permissions-Policy`. |
| CI | `deno.yml` substituído por `node.yml` (`npm install` + `npm test`). |
| Duplicados | Calculadoras unificadas em `js/modulos/calculadoras.js` (13 páginas actualizadas; `calculadoras-paginas.js` removido). Entrada duplicada da biblioteca removida, com redirect 301 do URL antigo. Listas do `sw.js` sem repetições. |
| `index.html` | `<h1>` (oculto visualmente) e `defer` em 44 scripts. |

## Falta fazer (precisa de si / de internet)
1. `git rm -r --cached api/_dados && git commit` — o `.gitignore` não remove o que já está no repositório. Se o repositório é público, as respostas certas ficam no histórico: reescreva as perguntas dos testes.
2. `node tools/sri-decap.mjs` (com internet) e colar o `integrity` em `admin/index.html`.
3. `npm install` e fazer commit do `package-lock.json`; depois trocar `npm install` por `npm ci` em `.github/workflows/node.yml`.
4. Se o repositório for privado: variável `GITHUB_SCOPE=repo` na Vercel.
5. Depois do deploy: `curl -I https://encorp.vercel.app/` (cabeçalhos) e `curl -I .../api/_dados/cursos.json` (tem de redireccionar para a página 404).

## Não aplicado (e porquê)
- CSP completa com `script-src`: o site usa scripts inline e AdSense; exige teste em produção (comece por `Content-Security-Policy-Report-Only`).
- 404 verdadeiro nas rotas privadas: mantido o redirect 307 (não verificável sem a Vercel).
- Revisão clínica dos 290 diagnósticos, PDFs e doses: deve ser feita por um profissional de enfermagem.

## Actualização: PowerPoint e conteúdos das aulas
- `tools/gerar-pptx.mjs` reescrito: 8 tipos de slide, tabelas, cartões de sequência, notas do orador, barra de progresso, ligações, e correcção do XML do pptxgenjs (`<a:pPr>` solto dentro de parágrafos, que o PowerPoint pode pedir para «reparar»).
- CMS (`admin/config.yml`): novos campos «Tipo de slide» e «Notas do orador». `build.mjs`: tabelas em markdown e aviso de texto longo. Leitor do curso: etiqueta, tabelas e caixas de destaque.
- Conteúdo: 11 aulas enriquecidas (objectivos, tabelas, casos clínicos com resolução, erros frequentes, pontos-chave, reflexão, leituras). Testes das aulas (10 perguntas) não foram alterados.
- Verificado: `node build.mjs` ok, `node tests/api.mjs` 36/36, PowerPoint abertos e convertidos no LibreOffice sem erros.
- Pendente: revisão clínica por enfermeiro/a; testar a abertura dos `.pptx` no PowerPoint.

## Actualização: leitor ao estilo Alison e contraste
- API: tempo mínimo **por slide** (calculado no build ou definido no CMS); vídeo só depois dos slides; o vídeo conta por **tempo de reprodução** (batidas do leitor, nunca mais do que o tempo real) até 90% da duração; teste só depois disso. Resposta do teste traz `marcas` (certa/errada por pergunta) sem revelar a opção certa antes de aprovar.
- Leitor: contagem decrescente no botão «Seguinte», barra de progresso, vídeo com «tempo visto», botão **Corrigir** com ✔/✘ por pergunta.
- Contraste (WCAG AA, medido em Chromium em 83 páginas e em todas as vistas da app): corrigidos os botões **Calcular/Limpar** das calculadoras da app (letra azul-escura sobre fundo azul-escuro), laranja com letra branca (`--bl`, `--azul`, botões, cabeçalhos), botões de partilha, banner de cookies, selos, etiquetas e cartão do fundador. Auditoria repetível: `tests/contraste.py`.
- Testes: `node tests/api.mjs` 43/43 (inclui slides cronometrados, vídeo e marcas). Teste de ponta a ponta no navegador feito com `tests/servidor-dev.mjs`.
