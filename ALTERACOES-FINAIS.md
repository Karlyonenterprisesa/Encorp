# ENCORP — resumo de todas as alterações (versão final)

## Pesquisa
- `pesquisa.html` pesquisa em **todo o texto** de cada página (`search-texto.json`, gerado no build), sem acentos nem maiúsculas, com várias palavras (todas têm de existir; se não houver, mostra páginas com alguma), excerto realçado e «Mostrar mais».
- A pesquisa da página inicial ganhou o botão «Pesquisar … em todo o texto do site».

## Cursos, slides e leitor
- Capas dos cursos *Primeiros socorros* e *Sinais vitais*.
- Ficha institucional em todos os cursos (Karlyon Enterprise S.A., entidade formadora ENCORP, CPD, coordenador Sacaita Manuel Inácio): editar em `tools/ficha-curso.mjs`.
- 25 PowerPoint no layout do modelo EC4 com as cores do site; PDF + leitor único (`js/site/leitor.js`) nos cursos e na biblioteca. Depois de mudar slides: `node build.mjs && sh tools/gerar-pdf-slides.sh`.
- Video-aulas pelo CMS (YouTube ou MP4) com campo «Anatomia» que as mostra na página do sistema.

## AdSense e páginas legais
- ID `ca-pub-5846610296337932` em todas as páginas, metatag e `ads.txt`.
- Privacidade (AdSense/cookies/DART), Aviso médico, Termos, Contacto (formulário), Ajuda (FAQ) e link «Contacto» no rodapé de todas as páginas. Botão EN oculto.

## Indexação / SEO
- Diagnósticos sem sugestões NIC/NOC: `noindex` e fora do sitemap (`indexarTodosDiagnosticos: false`).
- Ficheiros duplicados `#U…` e `sbb.css` da raiz removidos; lazy-load na página inicial.

## Ainda por fazer (não depende do código)
Domínio próprio; email profissional; enriquecer medicamentos/processo de enfermagem; substituir imagens de terceiros (hotlink) por imagens próprias.
