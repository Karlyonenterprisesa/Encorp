/* ENCORP — no telemóvel, o botão flutuante do WhatsApp esconde-se enquanto as ligações do rodapé estão visíveis,
   para nunca ficar por cima de texto. Volta a aparecer assim que o rodapé sai do ecrã. */
(function () {
  var wa = document.querySelector('.wa-float');
  if (!wa) return;
  var mq = window.matchMedia('(max-width:899px)'), vis = new Set();
  /* Barra inferior (Início/Ferramentas/…): sem depender de :has() (WebViews antigos não o suportam),
     o botão sobe sempre acima dela, com a altura real medida. */
  function acima() {
    var nav = document.querySelector('.bottom-nav');
    if (!nav) { wa.style.bottom = ''; return; }
    var h = nav.getBoundingClientRect().height || 64;
    wa.style.bottom = 'calc(' + Math.round(h + 14) + 'px + env(safe-area-inset-bottom,0px))';
  }
  acima();
  window.addEventListener('resize', acima);
  window.addEventListener('orientationchange', acima);
  window.addEventListener('load', acima);
  if (!('IntersectionObserver' in window)) return;
  function upd() { wa.classList.toggle('wa-hide', mq.matches && vis.size > 0); }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) vis.add(e.target); else vis.delete(e.target); });
    upd();
  });
  document.querySelectorAll('.sbb-cols, .sbb-footer-note, .sbb-ft-note').forEach(function (t) { io.observe(t); });
  if (mq.addEventListener) mq.addEventListener('change', upd);
})();
