/* ENCORP — service worker. A versão do cache muda sozinha em cada publicação (build.mjs). */
const CACHE = "ec-hdr-20261020";
const EXTRA = ["img/00fc363149.webp", "img/2b27b664f1.webp", "img/2eb6e7a8a2.webp", "img/c6e9e7a901.webp", "img/3719be319a.webp", "img/4b4a48e446.webp", "img/4c09dfcc0a.webp", "img/68851d1b0d.webp", "img/7523381ad5.webp", "img/77ef8791bd.webp", "img/81008a93a3.png", "img/81d386df91.webp", "img/90ee950391.webp", "img/96e46fc03f.png", "img/9e5db6eeac.webp", "img/a1ca6a50f1.png", "img/a3d5c70dfe.webp", "img/b6b71a99b3.webp", "img/bdd4d0d045.webp", "img/be302a3d86.webp", "img/bf98e0744d.webp", "img/c4b569e547.webp", "img/c959e86f85.png", "img/d1e94dd69f.png", "img/de28f2d422.webp", "img/e6b2c5758c.webp", "img/f27a4af9ad.webp", "img/f61b4aae02.webp", "pdf/Enfermeiro_Competente_Manual.pdf", "pdf/Lista_Nacional_Medicamentos_Essenciais_Mocambique_2017.pdf", "pdf/Manual_Gastrite_Ulcerativa_Karlyon_2026.pdf", "vendor/pdfjs/LICENSE", "vendor/pdfjs/pdf.min.mjs", "vendor/pdfjs/pdf.worker.min.mjs", "js/cms/biblioteca-cursos.js", "js/dados/avaliacao-dados.js", "js/dados/biblioteca-dados.js", "js/dados/casos-clinicos-dados.js", "js/dados/casos-estudo-dados.js", "js/dados/diagnosticos-dados.js", "js/dados/escalas-dados.js", "js/dados/exames-dados.js", "js/dados/gastrite-pdf-dados.js", "js/dados/glossario-dados.js", "js/dados/lnme-pdf-dados.js", "js/dados/manual-pdf-dados.js", "js/dados/nic-dados.js", "js/dados/noc-dados.js", "js/dados/procedimentos-dados.js", "js/dados/urgencia-dados.js", "js/ferramentas/hemograma.js", "js/interface/acessibilidade-teclado.js", "js/interface/altura-cabecalho.js", "js/interface/carrossel-processo.js", "js/interface/cartoes-animados.js", "js/interface/cartao-fundador.js", "js/interface/contorno-imagens.js", "js/interface/divisores-estrelas.js", "js/interface/home-cartoes-processo.js", "js/interface/texto-justificado.js", "js/modulos/aprendizagem.js", "js/modulos/caso-perguntas.js", "js/modulos/calculadoras.js", "js/modulos/catalogo-nic-noc.js", "js/modulos/diagnosticos.js", "js/modulos/hemograma-vista.js", "js/modulos/inicializacao.js", "js/modulos/leitor-pdf.js", "js/modulos/medicamentos.js", "js/modulos/processo-enfermagem-formulario.js", "js/modulos/visualizador-pdf.js", "js/nucleo/configuracao-app.js", "js/nucleo/internacionalizacao.js", "js/nucleo/ligacoes-profundas.js", "js/nucleo/modal-youtube.js", "js/nucleo/notificacoes.js", "js/nucleo/nucleo.js", "js/nucleo/titulos-das-seccoes.js", "js/nucleo/vista-inicial.js", "js/pwa/convite-instalacao.js", "js/site/pesquisa.js", "js/site/quiz.js", "js/site/site.js", "js/site/video-aulas.js"];
const CORE = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'conteudo.json', 'search-index.json', 'pesquisa.html', 'favicon.ico', 'apple-touch-icon.png', 'android-chrome-192x192.png', 'android-chrome-512x512.png', 'og-image.jpg', 'css/guias.css', 'css/sbb.css', 'img/c6e9e7a901.webp'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all([...new Set(CORE.concat(EXTRA))].map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const netFirst = req => fetch(req).then(res => {
  if (res.status === 200) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); }
  return res;
}).catch(() => caches.match(req).then(r => r || (req.mode === 'navigate' ? caches.match('index.html') : Response.error())));

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/') || url.pathname.startsWith('/conta/')) return;   // dados privados do estudante: nunca em cache
  // Páginas, conteúdo e script da biblioteca: rede primeiro (sempre actualizado), cache como reserva offline
  if (req.mode === 'navigate' || /\/(conteudo\.json|sw\.js)$/.test(url.pathname) || /\/(js|css)\/.+\.(js|css)$/.test(url.pathname)) { e.respondWith(netFirst(req)); return; }
  // Imagens, PDFs e restantes: cache primeiro
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.status === 200) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); }
    return res;
  })));
});
