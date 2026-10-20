# Publicar conteúdos (Decap CMS + GitHub + Vercel)

Fluxo: escreve em `/admin` → o CMS grava no GitHub → a Vercel corre `node build.mjs` → o conteúdo aparece automaticamente no site e na app (ao fim de ~1 minuto), no feed e no sitemap.

## Configuração (uma vez)
1. **Repositório:** em `admin/config.yml`, confirme `backend.repo` (`karlyonenterprisesa/encorp`) e o ramo (`main`).
2. **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
   - Homepage URL: `https://encorp.vercel.app`
   - Authorization callback URL: `https://encorp.vercel.app/api/callback`
3. **Vercel → Project → Settings → Environment Variables:** `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (`GITHUB_SCOPE` por defeito é `public_repo`, suficiente para um repositório público; se o repositório for privado, defina `GITHUB_SCOPE=repo`).
4. **Redeploy** e abra `/admin/`.

## O que cada colecção faz
| Colecção | Onde aparece |
|---|---|
| **Dicas e Actualidades de Saúde** (Tipo: Dica, Artigo ou Notícia) | Página inicial (4 mais recentes, secção entre `<!--EC:DICAS-->` e `<!--/EC:DICAS-->` — não apague os marcadores), `/dicas/`, feed RSS |
| **Biblioteca (PDF)** (categorias: Manual, Lista de medicamentos, Processo de enfermagem, Ficha, Protocolo, Outro) | Vista **Biblioteca** da app e `/biblioteca/`. Só aceita PDF: outros formatos são ignorados |
| **Cursos** | `/cursos/` e vista **Cursos** da app |
| **Video-aulas** (YouTube ou ficheiro MP4) | Dentro do curso escolhido e em `/cursos/aulas/` |
| **Testes** (quizzes com correcção imediata) | Dentro do curso escolhido e em `/cursos/testes/` |
| **Definições** | AdSense, Analytics, interruptor de indexação dos diagnósticos |

- Ficheiros enviados ficam em `uploads/<colecção>/`.
- «Publicado» desligado esconde o item sem o apagar.
- Os 3 PDFs base (`/pdf/…`) estão na Biblioteca e embutidos na vista da app (não se repetem).

## Indexação dos diagnósticos
Os diagnósticos sem sugestões NIC/NOC específicas (139) saem com `noindex` e fora do sitemap, para o Google não os tratar como conteúdo repetido. O interruptor **Indexar todos os diagnósticos** (Definições) inverte isto — não é recomendado.

## Testar no computador
`node build.mjs` (Node 18+) e `python3 -m http.server` na raiz.

## Nota sobre `index_offline.html`
É a versão da app com tudo embutido (6,7 MB), para uso sem internet. Não a publique como página inicial. Ela ainda tem a antiga galeria e não é actualizada por este build.

## O que o build faz em cada publicação (`node build.mjs`)
- Gera as páginas dos itens do CMS (artigos, vídeos, notícias, curiosidades, documentos) como `/slug.html` na raiz, as listagens e os 4 cards da home.
- **Cabeçalho e rodapé únicos:** edite `templates/header.html` e `templates/footer.html` e a alteração aparece em todas as páginas do site.
- **Pesquisa do site:** cria `search-index.json` com todas as páginas; `/pesquisa.html` pesquisa nele em tempo real.
- Actualiza `conteudo.json`, `feed.xml` e `sitemap.xml` (o sitemap só lista páginas sem `noindex`).
- O `sw.js` vai sempre buscar a versão mais recente à rede; a cópia guardada só serve se a ligação falhar.

## Cursos, video-aulas e testes (secção «Cursos»)
No `/admin` há 3 coleções novas. O botão **Cursos** aparece na barra da app e no cabeçalho do site.

- **Cursos:** título, resumo, nível, duração, formador, preço (vazio = gratuito), link de inscrição (ex.: WhatsApp `https://wa.me/258…`), descrição e a lista de **aulas em vídeo** (título + link do YouTube).
- **Video-aulas:** uma aula com página própria. Escolha o **Curso** e a **Ordem**, e ela entra na lista de aulas desse curso, com «Aula anterior / seguinte».
- **Testes:** perguntas com 2 a 6 opções, a opção correta e uma explicação. O site corrige no momento, mostra a nota e diz se passou (nota mínima à sua escolha). Escolha o **Curso** para o teste aparecer na página dele.

Endereços: `/cursos.html` (hub), `/curso-…`, `/aula-…`, `/teste-…`. Os 3 exemplos `(exemplo)` em `conteudo/` podem ser apagados no CMS.

Limite: o site é estático, por isso os cursos são **públicos**. Para cursos pagos com acesso restrito seria preciso um sistema de contas.

## Vídeos: YouTube ou ficheiro carregado
Em **Vídeos**, **Video-aulas** e nas **aulas de um curso** há dois campos. Use um deles:
- **Link do YouTube:** cole o link normal. O vídeo toca dentro do site, sem o visitante sair. Recomendado para vídeos longos (o YouTube paga a largura de banda).
- **Carregar o vídeo (MP4):** envia o ficheiro pelo próprio CMS e toca num leitor do site. Use para clipes curtos.

Limites do ficheiro carregado: fica guardado no GitHub (que bloqueia ficheiros acima de 100 MB) e é servido pela Vercel, cujo plano gratuito tem limite mensal de transferência. Por isso: formato **MP4 (H.264)**, de preferência até **20–25 MB** por vídeo, e **imagem de capa** preenchida (é o que se vê antes de tocar). Para comprimir: HandBrake, 720p.

## Slides enriquecidos e PowerPoint (aulas dos cursos)
Cada slide tem **Tipo** (Conteúdo, Objectivos, Sequência, Caso clínico, Pontos-chave, Resumo, Para reflectir, Para aprofundar) e **Notas do orador**. O tipo muda o desenho no leitor e no `.pptx`.
- Texto do slide: listas (`-` ou `1.`), caixas de destaque (`> texto`; se começar por «Atenção» fica laranja), tabelas (`| a | b |`), `**negrito**` e ligações `[texto](/pagina.html)`.
- O PowerPoint de cada aula (gerado em cada build por `tools/gerar-pptx.mjs`) tem: capa, «Nesta aula» com roteiro, um slide por slide do CMS (com barra de progresso e notas do orador) e o aviso do teste.
- Se um slide tiver texto a mais, o build avisa («divida-o em dois»).
- As 11 aulas de **Estabilização de pacientes** e **Elaboração de monografias** têm agora 13 a 16 slides cada, com casos clínicos e resoluções. **O texto clínico deve ser revisto por um profissional de enfermagem antes de ser usado em formação** (valores de referência, doses de adrenalina, tabela NEWS2, classes de choque).

## Aulas ao estilo plataforma de cursos (slides → vídeo → teste)
Ordem de cada aula, imposta **pelo servidor** (não dá para saltar mexendo no navegador):
1. **Slides cronometrados.** O botão «Seguinte» só abre depois do tempo mínimo do slide (contagem decrescente visível). O tempo é calculado pelas palavras (cerca de 2 palavras por segundo + 8 s, entre 10 e 120 s) ou fixado no campo **Tempo mínimo neste slide** do CMS.
2. **Vídeo-resumo** (YouTube ou ficheiro carregado no CMS). Só abre depois do último slide. O teste só abre depois de o estudante ver **90%** do vídeo a tocar (tempo real: saltar para a frente não conta). Indique a **Duração do vídeo (minutos)** no CMS para o servidor saber o tempo exacto.
3. **Teste de 10 perguntas.** O estudante responde e carrega em **Corrigir**: vê quantas acertou e quais ficaram **certas ✔ ou erradas ✘**. A opção certa e a explicação só aparecem depois de aprovar (assim não se descobrem as respostas por tentativa e erro).
- «Elaboração de monografias» passou a **modo progressivo** (conta de estudante + aulas em sequência), como a Estabilização. Para voltar ao modo livre, mude «Modo» no CMS.
- Testar localmente: `node build.mjs && ENCORP_MIN_SLIDE_MS=4000 node tests/servidor-dev.mjs` (http://localhost:8810, Redis simulado).
