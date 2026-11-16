/* ENCORP — pesquisa em TODO o texto do site (títulos, descrições e corpo de todas as páginas).
   Sem acentos nem maiúsculas; todas as palavras têm de existir (em qualquer parte da página); se não houver resultados, mostra páginas com ALGUMA das palavras. */
(function () {
  var q = document.getElementById('q'), r = document.getElementById('r'), n = document.getElementById('n'), D = null, T = null, t0 = 0, MAX = 40, mostrar = MAX;
  var fold = function (s) { return String(s || '').toLowerCase().replace(/[\u00c0-\u024f]/g, function (c) { return c.normalize('NFD').charAt(0); }); }; /* mantém o comprimento: as posições servem para o excerto */
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var reEsc = function (s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); };
  function marcar(txt, ws) { /* realça as palavras (sem acentos) no texto original */
    var f = fold(txt), spans = [];
    ws.forEach(function (w) { var i = 0; while ((i = f.indexOf(w, i)) >= 0) { spans.push([i, i + w.length]); i += w.length; } });
    spans.sort(function (a, b) { return a[0] - b[0]; });
    var out = '', pos = 0;
    spans.forEach(function (s) { if (s[0] < pos) return; out += esc(txt.slice(pos, s[0])) + '<mark>' + esc(txt.slice(s[0], s[1])) + '</mark>'; pos = s[1]; });
    return out + esc(txt.slice(pos));
  }
  function excerto(e, ws) {
    if (!e._x) return '';
    var p = -1; ws.forEach(function (w) { var i = e._x.indexOf(w); if (i >= 0 && (p < 0 || i < p)) p = i; });
    if (p < 0) return '';
    var a = Math.max(0, p - 60), b = Math.min(e.x.length, p + 150);
    var ini = a > 0 ? e.x.lastIndexOf(' ', a) : 0; if (ini < 0) ini = a;
    var fim = b < e.x.length ? e.x.indexOf(' ', b) : e.x.length; if (fim < 0) fim = e.x.length;
    return (ini > 0 ? '… ' : '') + e.x.slice(ini, fim).trim() + (fim < e.x.length ? ' …' : '');
  }
  function pontos(e, w) { /* 0 = não existe; maior = mais relevante */
    var sc = 0, i = e._t.indexOf(w);
    if (i === 0) sc += 12; else if (i > 0) sc += e._t.charAt(i - 1) === ' ' ? 9 : 5;
    if (e._s.indexOf(w) >= 0) sc += 3;
    if (e._d.indexOf(w) >= 0) sc += 3;
    if (e._x) { var c = 0, k = -1; while ((k = e._x.indexOf(w, k + 1)) >= 0 && c < 6) c++; sc += c; }
    return sc;
  }
  function run() {
    var v = fold(q.value).trim().replace(/\s+/g, ' ');
    try { history.replaceState(null, '', v ? '?q=' + encodeURIComponent(q.value.trim()) : location.pathname); } catch (e) { /* ignorar */ }
    if (!D) return;
    if (v.length < 2) { r.innerHTML = ''; n.textContent = v ? 'Escreva pelo menos 2 letras.' : ''; return; }
    var ws = v.split(' ').filter(function (x) { return x.length > 0; }), out = [], parcial = false;
    function procurar(todas) {
      var res = [];
      D.forEach(function (e) {
        var tot = 0, achou = 0;
        ws.forEach(function (w) { var s = pontos(e, w); if (s > 0) { achou++; tot += s; } });
        if (todas ? achou === ws.length : achou > 0) res.push([tot + achou * 4, e]);
      });
      return res;
    }
    out = procurar(true);
    if (!out.length && ws.length > 1) { out = procurar(false); parcial = out.length > 0; }
    out.sort(function (a, b) { return b[0] - a[0] || a[1].t.localeCompare(b[1].t, 'pt'); });
    var base = out.length ? out.length + (out.length === 1 ? ' resultado' : ' resultados') : 'Sem resultados. Tente outra palavra.';
    n.textContent = base + (parcial ? ' (páginas com alguma das palavras)' : '') + (T ? '' : ' · a carregar o texto completo…');
    var vis = out.slice(0, mostrar);
    r.innerHTML = vis.map(function (o) {
      var e = o[1], ex = excerto(e, ws), desc = ex || e.d;
      return '<a class="card" href="' + esc(e.u) + '"><b>' + marcar(e.t, ws) + '</b>' + (desc ? '<span>' + marcar(desc, ws) + '</span><br>' : '') + (e.s ? '<span>' + esc(e.s) + '</span>' : '') + '</a>';
    }).join('') + (out.length > mostrar ? '<p><button type="button" class="btn alt" id="mais">Mostrar mais resultados</button></p>' : '');
    var m = document.getElementById('mais'); if (m) m.onclick = function () { mostrar += MAX; run(); };
  }
  q.addEventListener('input', function () { mostrar = MAX; clearTimeout(t0); t0 = setTimeout(run, 120); });
  var p = new URLSearchParams(location.search).get('q'); if (p) q.value = p;
  fetch('/search-index.json').then(function (x) { return x.json(); }).then(function (j) {
    D = j.map(function (e) { e._t = fold(e.t); e._d = fold(e.d); e._s = fold(e.s); e._x = ''; e.x = ''; return e; });
    run();
    return fetch('/search-texto.json').then(function (x) { return x.json(); });
  }).then(function (tx) {
    T = tx; D.forEach(function (e, i) { e.x = T[i] || ''; e._x = fold(e.x); }); run();
  }).catch(function () { if (!D) n.textContent = 'Não foi possível carregar a pesquisa. Verifique a ligação e tente de novo.'; else run(); });
})();
