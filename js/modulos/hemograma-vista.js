/* Vista «hemograma» da app (Ferramentas → Interpretação do hemograma). Usa js/ferramentas/hemograma.js */
(function () {
  function build() {
    if (document.getElementById('view-hemograma') || !window.ECHemograma) return;
    var d = document.createElement('div'); d.className = 'view'; d.id = 'view-hemograma';
    d.innerHTML = '<div style="padding:10px 12px 0;"><button class="back-btn" style="background:rgba(11,26,51,.08);color:var(--azul-escuro);" onclick="showView(\'ferramentas\')">‹ Ferramentas</button></div>' +
      '<div class="section-title" style="margin-top:14px;">Interpretação do Hemograma</div><div id="hemogramaApp" style="margin:0 12px 16px;"></div>';
    document.getElementById('app').insertBefore(d, document.querySelector('.bottom-fixed'));
    window.ECHemograma.mount(document.getElementById('hemogramaApp'));
  }
  build();
})();
