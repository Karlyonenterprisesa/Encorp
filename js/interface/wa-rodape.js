/* ENCORP — no telemóvel, o botão flutuante do WhatsApp esconde-se enquanto as ligações do rodapé estão visíveis,
   para nunca ficar por cima de texto. Volta a aparecer assim que o rodapé sai do ecrã. */
(function () {
  var wa = document.querySelector('.wa-float');
  if (!wa || !('IntersectionObserver' in window)) return;
  var mq = window.matchMedia('(max-width:899px)'), vis = new Set();
  function upd() { wa.classList.toggle('wa-hide', mq.matches && vis.size > 0); }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) vis.add(e.target); else vis.delete(e.target); });
    upd();
  });
  document.querySelectorAll('.sbb-cols, .sbb-footer-note, .sbb-ft-note').forEach(function (t) { io.observe(t); });
  if (mq.addEventListener) mq.addEventListener('change', upd);
})();
