# Enfermeiro Corporativo

Aplicação/site estático (PWA) de apoio à enfermagem. Site: https://encorp.vercel.app · Repositório: https://github.com/karlyonenterprisesa/encorp. Alojado na Vercel; o `build.mjs` corre em cada publicação.

## Estrutura

```
index.html                 app (SPA) — página inicial
sobre · contacto · privacidade · termos · aviso-medico · cookies · ajuda · rss · pesquisa · 404 (.html)
ferramentas/               hub «Ferramentas»
  calculadoras/            medicamentos/ · doses/ · infusoes/ · conversoes/ · outras/
  exames/                  exames laboratoriais + interpretação do hemograma
escalas/                   escalas clínicas (Glasgow, Braden, Morse, EVA, Barthel, NEWS2, Apgar, Manchester)
diagnosticos/              diagnósticos NANDA-I (290 páginas) — URLs mantidos (já indexados no Google)
avaliacao/                 avaliação e exame físico
medicamentos/              medicamentos essenciais
urgencias/                 urgência e emergência
aprender/                  hub «Aprender»: glossario/ · casos-clinicos/
processo-enfermagem/       avaliacao-inicial · diagnostico · planeamento (NIC) · implementacao (procedimentos) · avaliacao-final (NOC)
biblioteca/                PDFs (gerado a partir do CMS)
dicas/                     Dicas e Actualidades de Saúde (gerado a partir do CMS)
cursos/                    cursos, aulas/ e testes/ (gerado a partir do CMS)
js/   nucleo · dados · modulos · interface · ferramentas · cms · site · pwa      (todos os JavaScript)
css/  templates/  conteudo/  admin/  api/  pdf/  img/  uploads/  vendor/
build.mjs  vercel.json  sw.js  manifest.json
```

Páginas antigas (ex.: `/paracetamol.html`) têm redireccionamento 301 para o novo caminho (ver `vercel.json`).

## Conteúdo (Decap CMS em /admin)
Colecções: **Dicas e Actualidades de Saúde**, **Biblioteca (PDF)**, **Cursos**, **Video-aulas**, **Testes**, **Definições**.
Ver `LEIA-ME-CMS.md`.

## Alterar cabeçalho/rodapé
Edite `templates/header.html` / `templates/footer.html`: o build aplica a todas as páginas.

## Testar localmente
`node build.mjs` e depois `python3 -m http.server` na raiz.
