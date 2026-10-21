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
