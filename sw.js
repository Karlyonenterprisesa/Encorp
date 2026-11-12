/* ENCORP — service worker.
   Regra do site: tudo funciona ONLINE; só as FERRAMENTAS (calculadoras, exames) funcionam SEM internet.
   A lista TOOLS e a versão do cache são geradas sozinhas em cada publicação (build.mjs). */
const CACHE = "ec-mwdfsxc0";
/*EC:TOOLS*/const TOOLS = ["/apple-touch-icon.png","/css/extras.css","/css/guias.css","/css/sbb.css","/favicon-16x16.png","/favicon-32x32.png","/favicon.ico","/ferramentas/","/ferramentas/calculadoras/","/ferramentas/calculadoras/conversoes/","/ferramentas/calculadoras/conversoes/conversao-massa.html","/ferramentas/calculadoras/conversoes/conversao-peso-kg-lb.html","/ferramentas/calculadoras/conversoes/conversao-temperatura.html","/ferramentas/calculadoras/conversoes/conversao-volume-gotas.html","/ferramentas/calculadoras/doses/","/ferramentas/calculadoras/doses/calculo-de-medicamentos.html","/ferramentas/calculadoras/doses/dose-por-peso.html","/ferramentas/calculadoras/infusoes/","/ferramentas/calculadoras/infusoes/balanco-hidrico.html","/ferramentas/calculadoras/infusoes/calculo-de-gotejamento.html","/ferramentas/calculadoras/medicamentos/","/ferramentas/calculadoras/medicamentos/diluicao-de-medicamento.html","/ferramentas/calculadoras/medicamentos/equivalencia-de-solucoes.html","/ferramentas/calculadoras/outras/","/ferramentas/calculadoras/outras/imc.html","/ferramentas/calculadoras/outras/superficie-corporal.html","/ferramentas/exames/","/ferramentas/exames/bioquimica-serica.html","/ferramentas/exames/estudo-da-coagulacao.html","/ferramentas/exames/exame-de-urina-tipo-ii-eas.html","/ferramentas/exames/funcao-hepatica.html","/ferramentas/exames/gasometria-arterial.html","/ferramentas/exames/hemograma-completo.html","/ferramentas/exames/perfil-lipidico.html","/icon-192.png","/icon-512.png","/img/c6e9e7a901.webp","/js/ferramentas/hemograma.js","/js/interface/wa-rodape.js","/js/modulos/calculadoras.js","/js/pwa/botao-instalar.js","/js/site/extras.js","/js/site/site.js","/manifest.json"];/*/EC:TOOLS*/
const OFFLINE = "/offline.html";
const PRE = new Set(TOOLS);

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(TOOLS.concat([OFFLINE]).map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {})))).then(() => self.skipWaiting()));
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

  // Páginas: rede primeiro (o site é online). Sem internet, só as ferramentas abrem; o resto mostra o aviso.
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(res => { if (PRE.has(p)) guardar(req, res); return res; })
      .catch(() => (PRE.has(p) ? doCache(req) : Promise.resolve(null)).then(h => h || caches.match(OFFLINE))));
    return;
  }
  // Ficheiros das ferramentas: cache primeiro e actualização em segundo plano
  if (PRE.has(p)) {
    e.respondWith(doCache(req).then(hit => {
      const rede = fetch(req).then(res => guardar(req, res)).catch(() => hit);
      return hit || rede;
    }));
    return;
  }
  // Tudo o resto: apenas online
  e.respondWith(fetch(req));
});
