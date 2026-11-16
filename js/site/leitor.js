/* ENCORP — leitor único de PDF e de aulas em PowerPoint (convertidas em PDF).
   Uso:  <div class="ecr" data-src="/pdf/x.pdf" data-titulo="Título" data-modo="doc|slides" data-baixar="/pdf/x.pdf" data-pptx="/slides/x.pptx"></div>
   ou    ECLeitor.montar(elemento, { src, titulo, modo, baixar, pptx, inicio, onPagina(p,total), onCarregado(total), onErro(e) })
   Modo «slides»: uma página de cada vez (setas, teclado, deslizar). Modo «doc»: rolagem contínua com zoom.
   Cores e letra vêm do próprio site (css/sbb.css + templates/leitor.css). pdf.js em /vendor/pdfjs. */
(function () {
  'use strict';
  var W = window, D = document, PDFJS = null, carregar = null;
  var ICO = {
    ant: '<path d="m15 18-6-6 6-6"/>', seg: '<path d="m9 18 6-6-6-6"/>', mais: '<path d="M12 5v14M5 12h14"/>', menos: '<path d="M5 12h14"/>',
    ecra: '<path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3"/>',
    baixar: '<path d="M12 3v12m-5-5 5 5 5-5M5 21h14"/>', partilhar: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/>',
    ppt: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>'
  };
  function svg(n) { return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ICO[n] + '</svg>'; }
  function el(t, c, h) { var e = D.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
  function bt(c, ico, rot, fn) { var b = el('button', 'ecr-b ' + c, svg(ico)); b.type = 'button'; b.setAttribute('aria-label', rot); b.title = rot; b.addEventListener('click', fn); return b; }
  function lib() {
    if (PDFJS) return Promise.resolve(PDFJS);
    if (!carregar) carregar = import('/vendor/pdfjs/pdf.min.mjs').then(function (m) { m.GlobalWorkerOptions.workerSrc = '/vendor/pdfjs/pdf.worker.min.mjs'; PDFJS = m; return m; });
    return carregar;
  }
  function guardar(k, v) { try { localStorage.setItem(k, String(v)); } catch (e) { /* ignorar */ } }
  function ler(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  function montar(raiz, o) {
    o = o || {};
    var src = o.src || raiz.getAttribute('data-src'), titulo = o.titulo || raiz.getAttribute('data-titulo') || 'Documento';
    var modo = o.modo || raiz.getAttribute('data-modo') || 'doc', baixar = o.baixar || raiz.getAttribute('data-baixar') || src, pptx = o.pptx || raiz.getAttribute('data-pptx') || '';
    var chave = 'ecr:' + src, doc = null, total = 0, atual = 1, zoom = 1, tarefa = null, mortos = false, fsAtivo = false;
    raiz.className = 'ecr ecr-' + modo; raiz.innerHTML = '';
    raiz.setAttribute('role', 'region'); raiz.setAttribute('aria-label', 'Leitor: ' + titulo); raiz.tabIndex = 0;

    var barra = el('div', 'ecr-barra'), tit = el('div', 'ecr-tit'); tit.textContent = titulo;
    var pag = el('div', 'ecr-pag', '<span>–</span>'); pag.setAttribute('aria-live', 'polite');
    var fer = el('div', 'ecr-fer');
    var bMenos = bt('ecr-z', 'menos', 'Reduzir', function () { zoomar(-0.15); }), bMais = bt('ecr-z', 'mais', 'Ampliar', function () { zoomar(0.15); });
    var bFs = bt('', 'ecra', 'Ecrã inteiro', alternarFs);
    var bPart = bt('', 'partilhar', 'Partilhar', partilhar);
    if (modo === 'doc') { fer.appendChild(bMenos); fer.appendChild(bMais); }
    fer.appendChild(bFs); fer.appendChild(bPart);
    var aB = el('a', 'ecr-b', svg('baixar')); aB.href = baixar; aB.setAttribute('download', ''); aB.setAttribute('aria-label', 'Descarregar PDF'); aB.title = 'Descarregar PDF'; fer.appendChild(aB);
    if (pptx) { var aP = el('a', 'ecr-b ecr-ppt', svg('ppt') + '<span>PowerPoint</span>'); aP.href = pptx; aP.setAttribute('download', ''); aP.title = 'Descarregar o PowerPoint (.pptx)'; fer.appendChild(aP); }
    barra.appendChild(tit); barra.appendChild(pag); barra.appendChild(fer);

    var palco = el('div', 'ecr-palco'), estado = el('div', 'ecr-estado', '<div class="ecr-roda" aria-hidden="true"></div><p>A abrir…</p>');
    var prog = el('div', 'ecr-prog'); prog.innerHTML = '<i></i>'; prog.setAttribute('role', 'progressbar'); prog.setAttribute('aria-valuemin', '0'); prog.setAttribute('aria-valuemax', '100');
    var setaA = null, setaS = null;
    if (modo === 'slides') { setaA = bt('ecr-seta ecr-seta-a', 'ant', 'Slide anterior', function () { ir(atual - 1); }); setaS = bt('ecr-seta ecr-seta-s', 'seg', 'Slide seguinte', function () { ir(atual + 1); }); }
    raiz.appendChild(barra); raiz.appendChild(palco); if (setaA) { raiz.appendChild(setaA); raiz.appendChild(setaS); } raiz.appendChild(prog);
    palco.appendChild(estado);

    var canvas = null, caixas = [], io = null;
    function erro(e) {
      palco.innerHTML = '';
      var m = el('div', 'ecr-estado'); m.innerHTML = '<p><b>Não foi possível abrir aqui.</b><br>Abra ou descarregue o ficheiro.</p>';
      var a = el('a', 'btn', 'Abrir PDF'); a.href = baixar; a.target = '_blank'; a.rel = 'noopener'; m.appendChild(a); palco.appendChild(m);
      if (o.onErro) o.onErro(e);
    }
    function larguraPalco() { return Math.max(240, palco.clientWidth - (modo === 'doc' ? 24 : 0)); }

    function desenhar(pagina, cv, larg) {
      return doc.getPage(pagina).then(function (p) {
        var v1 = p.getViewport({ scale: 1 }), dpr = Math.min(2, W.devicePixelRatio || 1), esc = larg / v1.width, v = p.getViewport({ scale: esc * dpr });
        cv.width = Math.floor(v.width); cv.height = Math.floor(v.height); cv.style.width = Math.floor(v.width / dpr) + 'px'; cv.style.height = Math.floor(v.height / dpr) + 'px';
        var t = p.render({ canvasContext: cv.getContext('2d'), viewport: v });
        return { t: t, p: t.promise };
      });
    }
    /* ---- modo slides ---- */
    function mostrarSlide() {
      if (!canvas) { palco.innerHTML = ''; canvas = el('canvas', 'ecr-cv'); canvas.setAttribute('role', 'img'); palco.appendChild(canvas); }
      canvas.setAttribute('aria-label', titulo + ', página ' + atual + ' de ' + total);
      if (tarefa) { try { tarefa.cancel(); } catch (e) { /* ignorar */ } }
      doc.getPage(atual).then(function (p) {
        var v1 = p.getViewport({ scale: 1 }), maxH = Math.max(220, palco.clientHeight - 8), larg = Math.min(palco.clientWidth - 8, maxH * v1.width / v1.height);
        return desenhar(atual, canvas, Math.max(200, larg)).then(function (r) { tarefa = r.t; return r.p; });
      }).catch(function () { /* cancelado */ });
    }
    /* ---- modo documento ---- */
    function montarDoc() {
      palco.innerHTML = ''; caixas = [];
      var larg = larguraPalco() * zoom;
      doc.getPage(1).then(function (p1) {
        var v1 = p1.getViewport({ scale: 1 }), alt = larg * v1.height / v1.width;
        for (var i = 1; i <= total; i++) { var c = el('div', 'ecr-pg'); c.style.width = larg + 'px'; c.style.height = alt + 'px'; c.setAttribute('data-p', i); palco.appendChild(c); caixas.push(c); }
        if (io) io.disconnect();
        io = new IntersectionObserver(function (es) {
          es.forEach(function (e) {
            var c = e.target, n = +c.getAttribute('data-p');
            if (e.isIntersecting) {
              if (!c.__ok) { c.__ok = true; var cv = el('canvas', 'ecr-cv'); c.appendChild(cv); desenhar(n, cv, larg).then(function (r) { c.style.height = cv.style.height; return r.p; }).catch(function () { c.__ok = false; }); }
              c.__vis = true;
            } else c.__vis = false;
          });
          for (var k = 0; k < caixas.length; k++) if (caixas[k].__vis) { mudou(+caixas[k].getAttribute('data-p')); break; }
        }, { root: palco, rootMargin: '300px 0px', threshold: 0.01 });
        caixas.forEach(function (c) { io.observe(c); });
        if (atual > 1) ir(atual, true);
      });
    }
    function mudou(p) {
      atual = p; pag.firstChild.textContent = atual + ' / ' + total;
      var pc = Math.round(atual / total * 100); prog.firstChild.style.width = pc + '%'; prog.setAttribute('aria-valuenow', String(pc));
      if (setaA) { setaA.disabled = atual <= 1; setaS.disabled = atual >= total; }
      guardar(chave, atual); if (o.onPagina) o.onPagina(atual, total);
    }
    function ir(p, forcar) {
      p = Math.max(1, Math.min(total, p)); if (p === atual && !forcar) return;
      if (modo === 'slides') { mudou(p); mostrarSlide(); } else { var c = caixas[p - 1]; if (c) palco.scrollTo({ top: c.offsetTop - 8, behavior: forcar ? 'auto' : 'smooth' }); }
    }
    function zoomar(d) { var z = Math.max(0.6, Math.min(2.4, zoom + d)); if (z === zoom) return; zoom = z; var p = atual; montarDoc(); atual = p; }
    function alternarFs() {
      var r = raiz;
      if (!fsAtivo) { var f = r.requestFullscreen || r.webkitRequestFullscreen; if (f) { try { var q = f.call(r); if (q && q.catch) q.catch(function () { r.classList.add('ecr-fs'); }); } catch (e) { r.classList.add('ecr-fs'); } } else r.classList.add('ecr-fs'); }
      else { var s = D.exitFullscreen || D.webkitExitFullscreen; if (D.fullscreenElement || D.webkitFullscreenElement) s.call(D); r.classList.remove('ecr-fs'); }
      fsAtivo = !fsAtivo; if (modo === 'slides') setTimeout(mostrarSlide, 250);
    }
    function fsMudou() { var d = !!(D.fullscreenElement || D.webkitFullscreenElement); if (!d && !raiz.classList.contains('ecr-fs')) fsAtivo = false; if (modo === 'slides' && doc) setTimeout(mostrarSlide, 150); }
    function partilhar() {
      var u = W.location.href.split('#')[0];
      if (navigator.share) navigator.share({ title: titulo, url: u }).catch(function () { /* ignorar */ });
      else if (navigator.clipboard) navigator.clipboard.writeText(u).then(function () { if (typeof W.showToast === 'function') W.showToast('Link copiado'); });
    }
    function tecla(ev) {
      if (mortos) { D.removeEventListener('keydown', tecla); return; }
      var t = ev.target && ev.target.tagName; if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT') return;
      var dentro = raiz.contains(D.activeElement) || raiz.classList.contains('ecr-fs') || modo === 'slides' && D.body.contains(raiz);
      if (!dentro) return;
      if (ev.key === 'ArrowRight' || ev.key === 'PageDown' && modo === 'slides') { if (modo === 'slides') { ev.preventDefault(); ir(atual + 1); } }
      else if (ev.key === 'ArrowLeft' || ev.key === 'PageUp' && modo === 'slides') { if (modo === 'slides') { ev.preventDefault(); ir(atual - 1); } }
      else if (ev.key === 'Home' && modo === 'slides') { ev.preventDefault(); ir(1); }
      else if (ev.key === 'End' && modo === 'slides') { ev.preventDefault(); ir(total); }
      else if (ev.key === 'f' || ev.key === 'F') { alternarFs(); }
      else if ((ev.key === '+' || ev.key === '=') && modo === 'doc') zoomar(0.15);
      else if (ev.key === '-' && modo === 'doc') zoomar(-0.15);
    }
    D.addEventListener('keydown', tecla); D.addEventListener('fullscreenchange', fsMudou); D.addEventListener('webkitfullscreenchange', fsMudou);
    if (modo === 'slides') {
      var x0 = null, y0 = null;
      palco.addEventListener('touchstart', function (e) { if (e.touches.length === 1) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; } }, { passive: true });
      palco.addEventListener('touchend', function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) ir(atual + (dx < 0 ? 1 : -1)); }, { passive: true });
      palco.addEventListener('click', function (e) { var r = palco.getBoundingClientRect(); ir(atual + (e.clientX - r.left > r.width / 2 ? 1 : -1)); });
    }
    var tRed = null;
    if (W.ResizeObserver) new ResizeObserver(function () { if (!doc) return; clearTimeout(tRed); tRed = setTimeout(function () { if (modo === 'slides') mostrarSlide(); }, 120); }).observe(palco);

    lib().then(function (m) { return m.getDocument({ url: src }).promise; }).then(function (d) {
      if (mortos) return; doc = d; total = d.numPages;
      var ini = o.inicio || parseInt(ler(chave), 10) || 1; atual = Math.max(1, Math.min(total, ini));
      if (o.onCarregado) o.onCarregado(total);
      if (modo === 'slides') { mudou(atual); mostrarSlide(); } else { pag.firstChild.textContent = '1 / ' + total; montarDoc(); }
    }).catch(erro);

    return {
      ir: ir, total: function () { return total; }, pagina: function () { return atual; },
      destruir: function () { mortos = true; if (io) io.disconnect(); D.removeEventListener('keydown', tecla); D.removeEventListener('fullscreenchange', fsMudou); D.removeEventListener('webkitfullscreenchange', fsMudou); if (doc) try { doc.destroy(); } catch (e) { /* ignorar */ } }
    };
  }
  W.ECLeitor = { montar: montar };
  function auto() { var l = D.querySelectorAll('.ecr[data-src]'); for (var i = 0; i < l.length; i++) montar(l[i]); }
  if (D.readyState === 'loading') D.addEventListener('DOMContentLoaded', auto); else auto();
})();
