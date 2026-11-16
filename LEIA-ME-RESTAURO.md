# ENCORP — restauro (31/10/2026)

## O que estava errado e foi corrigido
- `sw.js` continha uma página HTML ("Sobre"); `sobre.html` continha uma nota de texto; `js/pwa/convite-instalacao.js` continha o código do service worker. Os três estavam trocados.
  - `sw.js` → service worker novo: **só a página inicial e as calculadoras funcionam sem internet**; o resto do site é online (sem ligação aparece `offline.html`). Nunca guarda `/admin`, `/api/` nem `/conta/`.
  - `sobre.html` → página "Sobre" restaurada (com os links Especialidades e Anatomia).
  - `js/pwa/convite-instalacao.js` → cartão "Instalar o ENCORP" (uma vez a cada 7 dias).
  - `offline.html` → página mostrada sem internet.
- Menu "Especialidades" e secção "Anatomia Humana" (`/anatomia/`, 13 sistemas) no cabeçalho, menu lateral e rodapé.
- `og-image.jpg` nova (1200×630); `ads.txt` na raiz.
- `admin/config.yml`: retirado `default: []` das listas (tentativa para o erro `toJS is not a function`).
- Apagado o ficheiro vazio `cursos/dados/X.html`.

## Verificação
`node build.mjs` ok · `node tests/api.mjs` 43/43 · `node --check` em todos os .js/.mjs sem erros.

## Fazer depois do deploy
1. Se o repositório do CMS for privado: variável `GITHUB_SCOPE=repo` na Vercel (o padrão é `public_repo`).
2. `git rm -r --cached api/_dados && git commit` (ver AUDITORIA.md, ponto 1).
3. No telemóvel, abrir o site online uma vez para o service worker guardar a página inicial e as calculadoras.
