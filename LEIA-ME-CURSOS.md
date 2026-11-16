# Cursos ENCORP — o que mudou

**Tudo gratuito e livre**: sem conta, sem palavra-passe, sem aulas bloqueadas. O estudante abre o curso, carrega em **Iniciar curso** → escolhe a aula → **Iniciar aula** → lê os slides → (vídeo, se existir) → **teste de 10 perguntas** → aula seguinte. O progresso fica guardado no próprio telemóvel/computador (localStorage).

## Ficheiros desta entrega (só o que tem a ver com cursos)
| Ficheiro | O que é |
|---|---|
| `conteudo/cursos/*.json` | Os 4 cursos reescritos (descrição completa, aulas, slides, testes, preço vazio = gratuito) |
| `js/site/curso-player.js` | Novo leitor, sem login (substitui o antigo) |
| `templates/player.css` | Desenho do leitor (acrescentado no fim do ficheiro) |
| `build.mjs` | Alterado apenas na parte dos cursos (ver abaixo) |
| `img/cursos/*.svg`, `uploads/cursos/capa-*.svg` | Capas e diagramas dos slides |
| `cursos/*.html`, `cursos/dados/*.json` | Gerados pelo build (a Vercel refaz-os a cada publicação) |

## Alterações no `build.mjs`
1. Os slides passam a manter o **tipo** (objectivos, passo a passo, caso clínico, pontos-chave…): antes era descartado.
2. A página do curso tem o botão **Iniciar curso** no topo e já não pede conta.
3. Gera `cursos/dados/<curso>.json` (dados públicos que o leitor lê).
4. «Pedir informações» só aparece em cursos pagos.
O resto do site (API de contas, PowerPoint, página `/conta/`) ficou intacto e inactivo para estes cursos.

## Vídeos (para acrescentar depois)
No CMS, em cada aula do curso, cole o **link do YouTube** (ou carregue um MP4). O vídeo aparece sozinho entre os slides e o teste. Não bloqueia nada.

## Conteúdo
| Curso | Aulas | Slides |
|---|---|---|
| Primeiros socorros | 7 (eram 5) | 107 (eram 15) |
| Sinais vitais e interpretação | 5 (eram 4) | 76 (eram 16) |
| Estabilização de pacientes | 6 (era 5) | 87 |
| Elaboração de monografias | 7 (era 6) | 108 |
Cada aula tem exactamente 10 perguntas (o build valida). As respostas certas estão agora repartidas por A, B, C e D e o leitor baralha perguntas e opções em cada tentativa.

## Ficha institucional e slides (actualização)
- **Dados comuns a todos os cursos** (Karlyon Enterprise S.A., entidade formadora ENCORP, tipo CPD, coordenador, logótipos) estão em `tools/ficha-curso.mjs`. Alterar aí muda a ficha da página do curso e a capa de todos os PowerPoint.
- **Logótipos** em `img/logos/karlyon.png` e `img/logos/encorp.png`.
- **Slides (.pptx)** seguem o modelo «Aula EC4»: capa verde-azulada com logótipos, faixa de título, rodapé cinzento, Arial. Um slide pode ter o campo opcional `fonte` (citação no rodapé, ex.: «(Brunner & Suddarth, 2010)»).
- **Capas**: `uploads/cursos/capa-primeiros-socorros.jpg` e `capa-sinais-vitais.jpg`.

## Leitor de slides e de PDF (novo)
- **Um só leitor** para tudo: `js/site/leitor.js` + `templates/leitor.css`, com as cores e a letra do site. Modo «slides» (uma página de cada vez: setas, teclado, deslizar) nos cursos e modo «documento» (rolagem contínua com zoom) na biblioteca. Tem ecrã inteiro, partilhar, descarregar PDF e botão «PowerPoint».
- **Cursos:** cada aula abre o PowerPoint no leitor (`slides/<curso>/aula-N.pdf`). Se o PDF não existir ou não tiver as páginas esperadas (capa + sumário + slides + teste), o site mostra automaticamente a versão em texto.
- **Depois de mudar slides no CMS:** `node build.mjs && sh tools/gerar-pdf-slides.sh` (precisa do LibreOffice) e fazer commit da pasta `slides/`. Os `.pptx` públicos são recriados em cada build; os `.pdf` não.
