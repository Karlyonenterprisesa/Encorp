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

## Leitor PowerPoint (actualização)
- Os slides (.pptx) usam agora as cores do site (azul-marinho #0b1a33, dourado #e8a317, castanho #a64b00). O leitor de curso, o leitor de PDF e os slides têm o mesmo desenho.
- Em cada aula há **«Ler em PowerPoint»** (abre o PDF do .pptx no leitor integrado, na página do slide actual) e **«Baixar .pptx»**.
- Os .pptx públicos ficam em `cursos/slides/<curso>/aula-N.pptx` (gerados pelo `node build.mjs`).
- Os PDF dos slides são gerados no seu computador (a Vercel não tem LibreOffice):
  1. `node build.mjs`
  2. `node tools/gerar-pdf-slides.mjs` (requer o LibreOffice; converte só as aulas que mudaram)
  3. `node build.mjs` outra vez e enviar para o GitHub `cursos/slides/` e `cursos/dados/`
- Se os slides mudarem no CMS e o PDF não for refeito, o botão «Ler em PowerPoint» desaparece sozinho (o PDF desactualizado nunca é mostrado); a leitura no ecrã e o .pptx continuam a funcionar.
- O `md()` do build passou a suportar tabelas e blocos mistos (frase + lista).
