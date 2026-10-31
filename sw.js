/* ENCORP — service worker.
   Regra do site: tudo funciona ONLINE; só a página inicial e as calculadoras funcionam SEM internet.
   A versão do cache muda sozinha em cada publicação (build.mjs). */
const CACHE = "ec-restaurado";
const CORE = ["/android-chrome-192x192.png", "/android-chrome-512x512.png", "/apple-touch-icon.png", "/conteudo.json", "/css/guias.css", "/css/sbb.css", "/favicon-16x16.png", "/favicon-32x32.png", "/favicon.ico", "/icon-192.png", "/icon-512.png", "/img/c6e9e7a901.webp", "/index.html", "/js/cms/biblioteca-cursos.js", "/js/dados/avaliacao-dados.js", "/js/dados/biblioteca-dados.js", "/js/dados/casos-clinicos-dados.js", "/js/dados/casos-estudo-dados.js", "/js/dados/diagnosticos-dados.js", "/js/dados/escalas-dados.js", "/js/dados/exames-dados.js", "/js/dados/gastrite-pdf-dados.js", "/js/dados/glossario-dados.js", "/js/dados/lnme-pdf-dados.js", "/js/dados/manual-pdf-dados.js", "/js/dados/nic-dados.js", "/js/dados/noc-dados.js", "/js/dados/procedimentos-dados.js", "/js/dados/urgencia-dados.js", "/js/ferramentas/hemograma.js", "/js/interface/acessibilidade-teclado.js", "/js/interface/altura-cabecalho.js", "/js/interface/carrossel-dicas.js", "/js/interface/carrossel-processo.js", "/js/interface/cartao-fundador.js", "/js/interface/cartao-sobre.js", "/js/interface/cartoes-animados.js", "/js/interface/contorno-imagens.js", "/js/interface/divisores-estrelas.js", "/js/interface/home-cartoes-processo.js", "/js/interface/texto-justificado.js", "/js/interface/wa-rodape.js", "/js/modulos/aprendizagem.js", "/js/modulos/calculadoras.js", "/js/modulos/caso-perguntas.js", "/js/modulos/catalogo-nic-noc.js", "/js/modulos/diagnosticos.js", "/js/modulos/hemograma-vista.js", "/js/modulos/inicializacao.js", "/js/modulos/leitor-pdf.js", "/js/modulos/medicamentos.js", "/js/modulos/processo-enfermagem-formulario.js", "/js/modulos/visualizador-pdf.js", "/js/nucleo/configuracao-app.js", "/js/nucleo/internacionalizacao.js", "/js/nucleo/ligacoes-profundas.js", "/js/nucleo/modal-youtube.js", "/js/nucleo/notificacoes.js", "/js/nucleo/nucleo.js", "/js/nucleo/titulos-das-seccoes.js", "/js/nucleo/vista-inicial.js", "/js/pwa/botao-instalar.js", "/js/pwa/convite-instalacao.js", "/js/site/site.js", "/manifest.json", "/offline.html"];
const CALC = ["/ferramentas/calculadoras/", "/ferramentas/calculadoras/conversoes/", "/ferramentas/calculadoras/conversoes/conversao-massa.html", "/ferramentas/calculadoras/conversoes/conversao-peso-kg-lb.html", "/ferramentas/calculadoras/conversoes/conversao-temperatura.html", "/ferramentas/calculadoras/conversoes/conversao-volume-gotas.html", "/ferramentas/calculadoras/doses/", "/ferramentas/calculadoras/doses/calculo-de-medicamentos.html", "/ferramentas/calculadoras/doses/dose-por-peso.html", "/ferramentas/calculadoras/infusoes/", "/ferramentas/calculadoras/infusoes/balanco-hidrico.html", "/ferramentas/calculadoras/infusoes/calculo-de-gotejamento.html", "/ferramentas/calculadoras/medicamentos/", "/ferramentas/calculadoras/medicamentos/diluicao-de-medicamento.html", "/ferramentas/calculadoras/medicamentos/equivalencia-de-solucoes.html", "/ferramentas/calculadoras/outras/", "/ferramentas/calculadoras/outras/imc.html", "/ferramentas/calculadoras/outras/superficie-corporal.html"];
const OFFLINE = "/offline.html";
const PRE = new Set(CORE.concat(CALC));

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.concat(CALC, [OFFLINE]).map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const guardar = (req, res) => { if (res && res.status === 200) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(req, copia)).catch(() => {}); } return res; };
const doCache = req => caches.match(req, { ignoreSearch: true });

self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  const p = url.pathname;
  if (p.startsWith("/admin") || p.startsWith("/api/") || p.startsWith("/conta/") || p === "/sw.js") return;   // dados privados e administração: nunca em cache

  // Navegação (páginas): rede primeiro; sem internet, só a página inicial e as calculadoras abrem
  if (req.mode === "navigate") {
    const path = p === "/" ? "/index.html" : p;
    e.respondWith(fetch(req).then(res => { if (PRE.has(path) || PRE.has(p)) guardar(req, res); return res; })
      .catch(() => doCache(req).then(h => h || caches.match(path)).then(h => h || caches.match(OFFLINE))));
    return;
  }
  // Ficheiros da página inicial e das calculadoras: cache primeiro e actualização em segundo plano
  if (PRE.has(p)) {
    e.respondWith(doCache(req).then(hit => {
      const rede = fetch(req).then(res => guardar(req, res)).catch(() => hit);
      return hit || rede;
    }));
    return;
  }
  // Tudo o resto: apenas online (o que já esteve em cache serve de reserva)
  e.respondWith(fetch(req).catch(() => doCache(req).then(h => h || Response.error())));
});
