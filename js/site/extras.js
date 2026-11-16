/* ENCORP — botões de partilha (Partilhar / Copiar / Instagram), contador diário discreto e botão discreto de partilhar o site. */
(function () {
  'use strict';
  var d = document, tt;
  function toast(t) {
    var e = d.querySelector('.ec-toast');
    if (!e) { e = d.createElement('div'); e.className = 'ec-toast'; e.setAttribute('role', 'status'); d.body.appendChild(e); }
    e.textContent = t; void e.offsetWidth; e.classList.add('on'); clearTimeout(tt);
    tt = setTimeout(function () { e.classList.remove('on'); }, 2400);
  }
  function copiarAntigo(txt) {
    return new Promise(function (ok, no) {
      var a = d.createElement('textarea'); a.value = txt; a.setAttribute('readonly', ''); a.style.cssText = 'position:fixed;opacity:0;top:0';
      d.body.appendChild(a); a.select();
      try { d.execCommand('copy') ? ok() : no(); } catch (e) { no(e); }
      d.body.removeChild(a);
    });
  }
  function copiar(txt) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(txt).catch(function () { return copiarAntigo(txt); });
    return copiarAntigo(txt);
  }
  d.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-share],[data-copy],[data-ig]');
    if (!b) return;
    var url = b.getAttribute('data-url') || location.href.split('#')[0], ti = b.getAttribute('data-title') || d.title;
    if (b.hasAttribute('data-share')) {
      e.preventDefault();
      if (navigator.share) navigator.share({ title: ti, text: ti, url: url }).catch(function () {});
      else copiar(url).then(function () { toast('Link copiado'); }, function () { toast('Não foi possível partilhar'); });
    } else if (b.hasAttribute('data-copy')) {
      e.preventDefault();
      copiar(url).then(function () { toast('Link copiado'); }, function () { toast('Não foi possível copiar'); });
    } else {
      e.preventDefault();   /* o Instagram não tem endereço de partilha: copia o link e abre o Instagram */
      copiar(url).then(function () { toast('Link copiado — cole no Instagram'); }, function () {});
      setTimeout(function () { window.open('https://www.instagram.com/', '_blank', 'noopener'); }, 700);
    }
  });

  var ICO_EYE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>';
  var ICO_SH = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4"/></svg>';
  var fmt = function (n) { try { return n.toLocaleString('pt-PT'); } catch (e) { return String(n); } };

  function rodape() {
    var ft = d.querySelector('footer');
    if (!ft || d.getElementById('ec-mini')) return;
    var box = d.createElement('div'); box.id = 'ec-mini'; box.className = 'ec-mini';
    box.innerHTML = '<span class="ec-vis" hidden>' + ICO_EYE + '<b></b></span>' +
      '<button type="button" class="ec-mini-sh" data-share data-title="ENCORP — Enciclopédia de Enfermagem" data-url="' + location.origin + '/" aria-label="Partilhar o ENCORP" title="Partilhar o ENCORP">' + ICO_SH + '</button>';
    (ft.querySelector('.sbb-ft-note,.sbb-footer-in') || ft).appendChild(box);
    if (navigator.webdriver) return;
    var hoje = new Date(Date.now() + 2 * 36e5).toISOString().slice(0, 10), visto = '';
    try { visto = localStorage.getItem('ec_vis') || ''; } catch (x) {}
    var post = visto !== hoje;   /* conta 1 vez por dia e por navegador */
    var o = { cache: 'no-store' };
    if (post) { o.method = 'POST'; o.headers = { 'content-type': 'application/json', 'x-ec-req': '1' }; o.body = '{}'; }
    fetch('/api/visitas', o).then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) {
      if (post) { try { localStorage.setItem('ec_vis', hoje); } catch (x) {} }
      if (j && j.ok && typeof j.hoje === 'number') {
        var s = box.querySelector('.ec-vis'); s.querySelector('b').textContent = fmt(j.hoje) + ' hoje'; s.title = fmt(j.total) + ' visitas no total'; s.hidden = false;
      }
    }).catch(function () {});
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', rodape); else rodape();
})();
