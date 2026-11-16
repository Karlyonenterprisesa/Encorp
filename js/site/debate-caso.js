/* ENCORP — debate de casos clínicos no WhatsApp.
   Monta o texto a partir da própria página: (1) caso + perguntas, SEM respostas; (2) respostas, para depois do debate.
   O WhatsApp abre e a pessoa escolhe o grupo ou a comunidade. Nada é enviado sozinho. */
(function () {
  var main = document.querySelector('main'), caixa = document.querySelector('.ec-debate');
  if (!main || !caixa) return;
  var limpa = function (n) { return ((n && n.textContent) || '').replace(/\s+/g, ' ').trim(); };
  function url() { var c = document.querySelector('link[rel="canonical"]'); return (c && c.href) || (location.origin + location.pathname); }
  function dados() {
    var apres = '';
    [].forEach.call(main.querySelectorAll('h2'), function (h) { if (/Apresenta/i.test(h.textContent) && h.nextElementSibling) apres = limpa(h.nextElementSibling); });
    var qs = [].map.call(main.querySelectorAll('.quiz'), function (q) {
      return { q: limpa(q.querySelector('b')).replace(/^\d+\.\s*/, ''), op: [].map.call(q.querySelectorAll('ol li'), limpa), r: limpa(q.querySelector('details p')) };
    });
    return { titulo: limpa(main.querySelector('h1')), sub: limpa(main.querySelector('.lead')), apres: apres, qs: qs, url: url() };
  }
  function textoCaso(d) {
    var t = '🩺 *CASO CLÍNICO PARA DEBATE*\n*' + d.titulo + '*\n_' + d.sub + '_\n\n' + d.apres + '\n\n❓ *Perguntas*\n';
    d.qs.forEach(function (q, i) {
      t += '\n*' + (i + 1) + '.* ' + q.q + '\n';
      q.op.forEach(function (o, k) { t += String.fromCharCode(65 + k) + ') ' + o + '\n'; });
    });
    return t + '\n💬 Responda aqui no grupo com o número e a letra (ex.: 1B) e justifique o raciocínio. Não abra as respostas antes de debater!\n📖 Caso completo: ' + d.url + '\n_ENCORP · Enfermeiro Corporativo_';
  }
  function textoRespostas(d) {
    var t = '✅ *RESPOSTAS — ' + d.titulo + '*\n';
    d.qs.forEach(function (q, i) { t += '\n*' + (i + 1) + '.* ' + q.r; });
    return t + '\n\n🔎 Raciocínio clínico, diagnósticos (NANDA-I), intervenções (NIC) e resultados (NOC):\n' + d.url + '#respostas\n_ENCORP · Enfermeiro Corporativo_';
  }
  function copiar(t, b) {
    var ok = function () { var o = b.textContent; b.textContent = 'Copiado ✓'; setTimeout(function () { b.textContent = o; }, 1800); };
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(t).then(ok, function () { antigo(t); ok(); }); } else { antigo(t); ok(); }
  }
  function antigo(t) { var a = document.createElement('textarea'); a.value = t; a.style.position = 'fixed'; a.style.opacity = '0'; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); } catch (e) {} document.body.removeChild(a); }
  caixa.addEventListener('click', function (e) {
    var b = e.target.closest('[data-debate]'); if (!b) return;
    var d = dados(), k = b.getAttribute('data-debate');
    if (k === 'copiar') { copiar(textoCaso(d), b); return; }
    var t = k === 'respostas' ? textoRespostas(d) : textoCaso(d);
    window.open('https://wa.me/?text=' + encodeURIComponent(t), '_blank', 'noopener');
  });
  /* link com #respostas abre logo a resposta comentada */
  function abrir() { if (location.hash === '#respostas') { var r = document.getElementById('respostas'); if (r) { r.open = true; r.scrollIntoView(); } } }
  abrir(); window.addEventListener('hashchange', abrir);
})();
