# ENCORP — relatório de erros (indexação, desempenho e funcionamento)
Auditoria feita a 12/11/2026 sobre o projecto completo (479 páginas). Estado: ✅ corrigido neste pacote · ⚠️ a corrigir por si.

## A. Erros que impediam ou prejudicavam a indexação
1. ✅ **Ficheiros vazios** publicados como páginas: `diagnosticos/ansiedade-excessiva` (sem extensão, 1 byte, em conflito com `ansiedade-excessiva.html`), `cursos/dados/X.html`, `img/cursos/Ds.png`. Apagados.
2. ✅ **Links de partilha para páginas que não existem** (157 páginas, ex. `/escalas/escala-de-braden/` e `/calculadoras/imc/`): quem partilhava enviava um link 404. Agora todos usam o endereço canónico real da página.
3. ✅ **Botões «Partilhar» e «Copiar link» não faziam nada** (não havia JavaScript para eles). Corrigido em `js/site/extras.js`.
4. ✅ **Repositório desactualizado em relação ao build**: 101 páginas de diagnósticos sem rodapé/script actuais, 51 com `noindex` apesar de «indexar todos» estar ligado, 6 páginas indexáveis fora do sitemap (cursos, testes, biblioteca) e o sitemap incluía 51 páginas `noindex`. O build corrige tudo (a Vercel corre `node build.mjs` em cada publicação); este pacote já traz o resultado do build: sitemap com 478 páginas e nenhuma `noindex` lá dentro.
5. ✅ **Link quebrado na página inicial** para `/dicas/pimenta-…html` (a página só existia depois do build). Resolvido pelo build.
6. ⚠️ **Ficheiros com nome mal codificado e duplicados** (`#U2014`, `#U00e7`, `#U00ed`…): `biblioteca/lista-nacional-de-medicamentos-essenciais-#U2014-mo#U00e7ambique-2017.html`, `conteudo/biblioteca/2026-10-17-lista-…#U2014…json` (idêntico ao de 12/10), `uploads/cursos/banner-de-investiga#U00e7#U00e3o-em-enfermagem.png` e `uploads/cursos/curso-de-abordagem-ao-doente-cr#U00edtico.png` (existem duas cópias de cada). O `#` num endereço é lido como fragmento, por isso o Google nunca vê essa página (canónico inválido) e duas descrições ficam duplicadas. **Faça no GitHub:** apague as cópias com `#U` e renomeie os ficheiros para nomes sem acentos (ex.: `banner-investigacao-enfermagem.png`, `curso-abordagem-doente-critico.png`), actualizando o CMS.
7. ⚠️ **Página inicial é uma «app» de uma só página**: 94 chamadas `showView(...)` e 24 links `href="#"` — o Google não segue esses cliques; só 19 links reais. As outras páginas estão no sitemap e entram por lá, mas a home devia ter links reais (`/ferramentas/`, `/diagnosticos/`…) em vez de `onclick`.
8. ⚠️ **Páginas com pouco texto (<150 palavras)**: contacto, ajuda, pesquisa, 404, conta e alguns hubs de domínio de diagnósticos. Para o Google e para o AdSense isto conta como conteúdo fino: acrescente texto útil ou ponha `noindex`.
9. ⚠️ **Desempenho da home (252 KB)**: 94 KB de CSS dentro do HTML, 19 de 25 imagens sem `loading="lazy"` e 18 sem `width/height`. Mover o CSS para ficheiro e pôr lazy-load melhora a velocidade e o Core Web Vitals.

## B. Como o site aparece no Google
- Cada página já tem título, descrição, imagem (`og:image`), canónico e dados estruturados; a home tem Organization (logo), WebSite e WebApplication.
- O Google decide sozinho o que mostra. Para acelerar: no **Google Search Console**, adicione `https://encorp.vercel.app/`, envie `/sitemap.xml` e peça indexação da home.
- No YouTube não há como controlar a pesquisa por aqui: o que conta é o título/descrição/miniatura de cada vídeo no canal.

## C. O que foi acrescentado neste pacote
- **Partilha uniforme com ícones originais** (Partilhar, WhatsApp, Facebook, Instagram, Telegram, X, LinkedIn, Email, Copiar link) em 394 páginas. O Instagram não tem endereço de partilha: o botão copia o link e abre o Instagram.
- **Contador diário de visitas**, muito discreto e semi-transparente, no rodapé, ao lado de um pequeno botão de partilhar o ENCORP. Conta 1 visita por dia e por navegador (`api/visitas.js`). Precisa da base Redis (KV) já usada pelas contas; sem ela o contador fica escondido.
- **Convite «Instalar app» intermitente**: aparece 4 s depois de a página abrir, fica 12 s e desaparece; volta a cada 5 minutos. Nunca aparece se a app já está instalada.
- **Offline só nas ferramentas** (27 páginas de calculadoras e exames). Tudo o resto exige internet; sem ligação aparece o aviso `offline.html`. Na primeira visita tudo carrega pela rede.
- **AdSense** com o ID `pub-6175631524178863` e `ads.txt` correcto.
