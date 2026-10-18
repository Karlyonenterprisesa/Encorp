/* Carrossel «Dicas e Actualidades de Saúde».
   - Move-se continuamente para a DIREITA, em ciclo infinito (o conjunto de cartões é repetido o suficiente
     para nunca haver espaço vazio; o salto de reinício é de exactamente uma «volta» e por isso invisível).
   - Pára com o rato por cima, com o foco no carrossel, ao arrastar/tocar, com o separador oculto,
     fora do ecrã e quando o utilizador carrega em «Pausar».
   - Navegação manual: setas anterior/seguinte, arrastar com o rato/dedo e teclado (←/→).
   - prefers-reduced-motion: sem movimento automático; a faixa passa a ser deslizável com scroll-snap. */
(function () {
  'use strict';
  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false, addEventListener: function () {} };
  var SPEED = 38; // píxeis por segundo

  function init(root) {
    if (root.__ecCar) return;
    var vp = root.querySelector('.ec-car-vp'), tr = root.querySelector('.ec-car-tr');
    if (!vp || !tr) return;
    root.__ecCar = true;

    var originais = [].slice.call(tr.children);
    if (!originais.length) return;
    var x = 0, setW = 0, last = 0, raf = 0;
    var pausaUser = false, pausaTemp = false, visivel = true, arrasto = null, anim = null;
    var btnPausa = root.querySelector('[data-car-pausa]');

    function reduzido() { return mq.matches; }

    function limpaClones() { [].slice.call(tr.querySelectorAll('[data-clone]')).forEach(function (n) { n.remove(); }); }

    function montar() {
      limpaClones();
      root.classList.toggle('ec-car-reduz', reduzido());
      if (reduzido()) { tr.style.transform = ''; return; }
      var vw = vp.clientWidth;
      if (!vw) return; // oculto (vista da app ainda não aberta): refaz-se quando ficar visível
      var primeiro = originais[0], ultimo = originais[originais.length - 1];
      var cs = getComputedStyle(ultimo);
      setW = ultimo.offsetLeft + ultimo.offsetWidth + (parseFloat(cs.marginRight) || 0) - primeiro.offsetLeft;
      if (setW <= 0) return;
      var copias = Math.max(1, Math.ceil(vw / setW)) + 1; // cópias extra, além do conjunto original
      for (var c = 0; c < copias; c++) {
        originais.forEach(function (n) {
          var k = n.cloneNode(true);
          k.setAttribute('data-clone', '1');
          k.setAttribute('aria-hidden', 'true');
          [].slice.call(k.querySelectorAll('a,button')).concat(k.matches('a,button') ? [k] : []).forEach(function (el) { el.setAttribute('tabindex', '-1'); });
          tr.appendChild(k);
        });
      }
      if (x < -setW || x >= 0) x = -setW;
      aplicar();
    }

    function aplicar() {
      if (setW > 0) { while (x >= 0) x -= setW; while (x < -setW) x += setW; }
      tr.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
    }

    function activo() { return !reduzido() && !pausaUser && !pausaTemp && visivel && !document.hidden && !arrasto && !anim && setW > 0; }

    function passo(t) {
      raf = requestAnimationFrame(passo);
      var dt = Math.min(0.05, (t - last) / 1000 || 0);
      last = t;
      if (anim) {
        var p = Math.min(1, (t - anim.t0) / anim.dur), e = 1 - Math.pow(1 - p, 3);
        x = anim.de + (anim.para - anim.de) * e; aplicar();
        if (p >= 1) anim = null;
        return;
      }
      if (!activo()) return;
      x += SPEED * dt; // positivo = os cartões deslocam-se para a direita
      aplicar();
    }

    function nudge(sentido) { // sentido +1: cartões para a direita; -1: para a esquerda
      if (reduzido()) { vp.scrollBy({ left: -sentido * (cardW() + 16), behavior: 'smooth' }); return; }
      if (!setW) return;
      anim = { t0: performance.now(), dur: 420, de: x, para: x + sentido * (cardW() + 16) };
    }
    function cardW() { return originais[0].offsetWidth || 280; }

    // pausas temporárias
    var tmr = 0;
    function pausar() { pausaTemp = true; clearTimeout(tmr); }
    function retomar(ms) { clearTimeout(tmr); tmr = setTimeout(function () { pausaTemp = false; }, ms || 600); }
    root.addEventListener('mouseenter', pausar);
    root.addEventListener('mouseleave', function () { retomar(300); });
    root.addEventListener('focusin', pausar);
    root.addEventListener('focusout', function () { retomar(300); });

    // arrastar (rato/dedo)
    vp.addEventListener('pointerdown', function (ev) {
      if (reduzido() || ev.button > 0) return;
      arrasto = { x0: ev.clientX, xi: x, moveu: false, id: ev.pointerId };
    });
    window.addEventListener('pointermove', function (ev) {
      if (!arrasto) return;
      var dx = ev.clientX - arrasto.x0;
      if (Math.abs(dx) > 4) { arrasto.moveu = true; try { vp.setPointerCapture(arrasto.id); } catch (e) {} }
      if (arrasto.moveu) { x = arrasto.xi + dx; aplicar(); }
    });
    function fimArrasto() {
      if (!arrasto) return;
      var moveu = arrasto.moveu; arrasto = null;
      if (moveu) { vp.__bloqueiaClique = true; setTimeout(function () { vp.__bloqueiaClique = false; }, 0); }
      retomar(1800);
    }
    window.addEventListener('pointerup', fimArrasto);
    window.addEventListener('pointercancel', fimArrasto);
    vp.addEventListener('click', function (ev) { if (vp.__bloqueiaClique) { ev.preventDefault(); ev.stopPropagation(); } }, true);

    // botões
    var ant = root.querySelector('[data-car-ant]'), seg = root.querySelector('[data-car-seg]');
    if (ant) ant.addEventListener('click', function () { nudge(+1); retomar(1500); });
    if (seg) seg.addEventListener('click', function () { nudge(-1); retomar(1500); });
    root.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowLeft') { nudge(+1); retomar(1500); ev.preventDefault(); }
      else if (ev.key === 'ArrowRight') { nudge(-1); retomar(1500); ev.preventDefault(); }
    });
    if (btnPausa) btnPausa.addEventListener('click', function () {
      pausaUser = !pausaUser;
      btnPausa.setAttribute('aria-pressed', pausaUser ? 'true' : 'false');
      btnPausa.textContent = pausaUser ? '▶ Retomar' : '❚❚ Pausar';
    });

    // visibilidade e tamanho
    if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visivel = en[0].isIntersecting; }).observe(root);
    if ('ResizeObserver' in window) { var ult = 0; new ResizeObserver(function () { var w = vp.clientWidth; if (w !== ult) { ult = w; montar(); } }).observe(vp); }
    else window.addEventListener('resize', montar);
    if (mq.addEventListener) mq.addEventListener('change', montar);

    montar();
    raf = requestAnimationFrame(passo);
  }

  function start() { [].slice.call(document.querySelectorAll('[data-ec-car]')).forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
  // a app (SPA) pode inserir o bloco depois de carregar
  if ('MutationObserver' in window) new MutationObserver(function () { start(); }).observe(document.documentElement, { childList: true, subtree: true });
})();
