/* Biblioteca e Cursos ligados ao CMS: lê conteudo.json (gerado no build a partir do Decap CMS).
   Cada <div class="ec-lista" data-tipos="a,b,c"> mostra esses tipos de conteúdo, com filtros. */
(function () {
  var T = {
    biblioteca:   { n: 'Documentos',   s: 'Documento',   i: '📄', b: 'Página' },
    cursos:       { n: 'Cursos',       s: 'Curso',       i: '🎓', b: 'Ver curso' },
    videoaulas:   { n: 'Video-aulas',  s: 'Video-aula',  i: '🎬', b: 'Ver aula' },
    testes:       { n: 'Testes',       s: 'Teste',       i: '✅', b: 'Fazer teste' }
  };
  var css = '.ec-lista{margin:6px 12px 14px}.cl-chips{display:flex;gap:6px;overflow-x:auto;padding:4px 0 8px}.cl-chip{flex:none;border:1px solid var(--borda);background:#fff;color:var(--azul-escuro);border-radius:99px;padding:6px 12px;font-size:13px;font-weight:600;cursor:pointer}.cl-chip.on{background:var(--azul-escuro);color:#fff}.cl-card{background:#fff;border:1px solid var(--borda);border-left:4px solid var(--dourado);border-radius:12px;padding:10px;margin:8px 0;text-align:left}.cl-row{display:flex;gap:10px}.cl-row img{width:84px;height:64px;object-fit:cover;border-radius:8px;flex:none}.cl-t{font-weight:700;color:var(--azul-escuro);font-size:14.5px;line-height:1.3}.cl-s{font-size:12.5px;color:var(--texto-suave);margin-top:2px;text-align:left}.cl-m{font-size:11.5px;color:#8a94a6;margin-top:3px}.cl-b{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px}.cl-b a,.cl-b button{border:0;background:var(--azul);color:#fff;border-radius:9px;padding:8px 13px;font-size:13px;font-weight:700;text-decoration:none;cursor:pointer}.cl-b .alt{background:#fff1de;color:var(--azul-escuro)}.cl-v{position:relative;padding-bottom:56.25%;height:0;margin-top:8px;border-radius:10px;overflow:hidden;background:#000}.cl-v iframe{position:absolute;inset:0;width:100%;height:100%;border:0}.cl-vv{padding-bottom:0;height:auto}.cl-vv video{width:100%;display:block}.cl-n{font-size:13px;color:var(--texto-suave);padding:8px 2px}';

  css += '.cl-pro{padding:0!important;overflow:hidden}.cl-pro .cl-cv{position:relative;aspect-ratio:16/9;background:linear-gradient(135deg,#0b1a33,#0148E0);display:flex;align-items:center;justify-content:center;font-size:40px}.cl-pro .cl-cv img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;margin:0;border-radius:0}.cl-pro .cl-bd{padding:12px 14px 4px}.cl-pro .cl-k{font-size:11px;font-weight:800;letter-spacing:.5px;text-transform:uppercase;color:#b5640a}.cl-pro .cl-t{margin:4px 0 4px}.cl-pro .cl-s{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.cl-pro .cl-tags{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0 2px}.cl-pro .cl-tag{font-size:12px;font-weight:600;background:#e7ecf4;color:#0b1a33;border-radius:99px;padding:3px 10px}.cl-pro .cl-tag.free{background:#dff3e6;color:#14532d}.cl-pro .cl-b{padding:8px 14px 14px}';  var data = null, boxes = [], erro = false;

  function e(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function d(s) { var x = new Date(s); return isNaN(x) ? '' : x.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short', year: 'numeric' }); }
  function tp(k) { return T[k] || { n: k, s: k, i: '•', b: 'Abrir' }; }   // um tipo desconhecido nunca deve partir a lista

  function ext(f) { var m = String(f || '').match(/\.([a-z0-9]{2,5})(?:[?#]|$)/i); return m ? m[1].toUpperCase() : ''; }
  function pro(i, t) {
    var tags = [], btns = '', k = '';
    if (i.tipo === 'cursos') {
      k = i.area || '';
      [i.nivel, i.duracao, i.nAulas ? i.nAulas + (i.nAulas === 1 ? ' aula' : ' aulas') : ''].forEach(function (x) { if (x) tags.push('<span class="cl-tag">' + e(x) + '</span>'); });
      tags.push('<span class="cl-tag' + (i.preco ? '' : ' free') + '">' + e(i.preco || 'Gratuito') + '</span>');
      btns = '<a href="' + e(i.url) + '">' + (i.modo === 'progressivo' ? 'Iniciar curso' : 'Consultar curso') + '</a>';
    } else {
      k = i.categoria || '';
      var f = i.formato || ext(i.ficheiro); if (f) tags.push('<span class="cl-tag">Formato ' + e(f) + '</span>');
      if (i.ficheiro) { btns = '<a href="' + e(i.ficheiro) + '" target="_blank" rel="noopener">Consultar</a>' + (i.permitirDownload === false ? '' : '<a class="alt" href="' + e(i.ficheiro) + '" download>Descarregar</a>'); }
      else btns = '<a href="' + e(i.url) + '">Ver ficha</a>';
    }
    return '<div class="cl-card cl-pro"><div class="cl-cv" aria-hidden="true">' + t.i + (i.imagem ? '<img loading="lazy" alt="" referrerpolicy="no-referrer" onerror="this.style.display=\'none\'" src="' + e(i.imagem) + '">' : '') + '</div>' +
      '<div class="cl-bd">' + (k ? '<div class="cl-k">' + e(k) + '</div>' : '') + '<div class="cl-t">' + e(i.titulo) + '</div>' + (i.resumo ? '<div class="cl-s">' + e(i.resumo) + '</div>' : '') +
      (tags.length ? '<div class="cl-tags">' + tags.join('') + '</div>' : '') + '</div><div class="cl-b">' + btns + '</div></div>';
  }

  function card(i) {
    var t = tp(i.tipo), b = '';
    if (i.tipo === 'cursos' || i.tipo === 'biblioteca') return pro(i, t);
    if (i.youtube) b += '<button type="button" data-yt="' + e(i.youtube) + '">▶ Ver aqui</button>';
    else if (i.video) b += '<button type="button" data-vid="' + e(i.video) + '">▶ Ver aqui</button>';
    if (i.ficheiro) b += '<a href="' + e(i.ficheiro) + '" target="_blank" rel="noopener">Abrir PDF</a>';
    b += '<a class="' + (i.youtube || i.video || i.ficheiro ? 'alt' : '') + '" href="' + e(i.url) + '">' + (i.youtube || i.video || i.ficheiro ? 'Página' : t.b) + '</a>';
    var meta = t.i + ' ' + t.s + (i.meta ? ' · ' + e(i.meta) : '') + (i.data ? ' · ' + d(i.data) : '');
    return '<div class="cl-card"><div class="cl-row">' + (i.imagem ? '<img loading="lazy" alt="" referrerpolicy="no-referrer" onerror="this.style.display=\'none\'" src="' + e(i.imagem) + '">' : '') +
      '<div><div class="cl-t">' + e(i.titulo) + '</div>' + (i.resumo ? '<div class="cl-s">' + e(i.resumo) + '</div>' : '') +
      '<div class="cl-m">' + meta + '</div></div></div><div class="cl-b">' + b + '</div></div>';
  }

  function draw(st) {
    if (erro) { st.el.innerHTML = '<div class="cl-n">Conteúdos indisponíveis de momento (sem ligação).</div>'; return; }
    var base = (data || []).filter(function (i) { return st.tipos.indexOf(i.tipo) > -1; });
    if (!base.length) { st.el.innerHTML = '<div class="cl-n">Ainda não há conteúdos publicados nesta secção.</div>'; return; }
    var list = base.filter(function (i) { return st.cur === 'todos' || i.tipo === st.cur; });
    var chips = '<button type="button" class="cl-chip' + (st.cur === 'todos' ? ' on' : '') + '" data-t="todos">Tudo (' + base.length + ')</button>';
    st.tipos.forEach(function (k) {
      var n = base.filter(function (i) { return i.tipo === k; }).length;
      if (n) chips += '<button type="button" class="cl-chip' + (st.cur === k ? ' on' : '') + '" data-t="' + k + '">' + tp(k).n + ' (' + n + ')</button>';
    });
    st.el.innerHTML = '<div class="cl-chips">' + chips + '</div>' + list.slice(0, st.shown).map(card).join('') +
      (list.length > st.shown ? '<div class="cl-b"><button type="button" class="alt" data-more="1">Ver mais</button></div>' : '');
  }

  function bind(st) {
    st.el.addEventListener('click', function (ev) {
      var t = ev.target.closest('[data-t],[data-yt],[data-vid],[data-more]'); if (!t) return;
      if (t.dataset.t) { st.cur = t.dataset.t; st.shown = 10; draw(st); }
      else if (t.dataset.more) { st.shown += 10; draw(st); }
      else {
        var c = t.closest('.cl-card'), v = c.querySelector('.cl-v');
        if (v) { v.remove(); t.textContent = '▶ Ver aqui'; return; }
        v = document.createElement('div'); v.className = 'cl-v';
        if (t.dataset.yt) v.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + e(t.dataset.yt) + '?autoplay=1&rel=0" title="Vídeo" allow="autoplay;encrypted-media;picture-in-picture;fullscreen" allowfullscreen></iframe>';
        else { v.className = 'cl-v cl-vv'; v.innerHTML = '<video controls autoplay playsinline src="' + e(t.dataset.vid) + '"></video>'; }
        c.appendChild(v); t.textContent = '✕ Fechar';
      }
    });
  }

  function init() {
    // Biblioteca: a vista é criada pela app; a lista entra antes da pesquisa (como sempre)
    var vb = document.getElementById('view-biblioteca');
    if (vb && !vb.querySelector('.ec-lista')) {
      var bx = document.createElement('div'); bx.className = 'ec-lista'; bx.dataset.tipos = 'biblioteca';
      var anc = vb.querySelector('.search-mini'); vb.insertBefore(bx, anc || vb.lastElementChild);
    }
    var els = document.querySelectorAll('.ec-lista[data-tipos]'); if (!els.length) return;
    var st0 = document.createElement('style'); st0.textContent = css; document.head.appendChild(st0);
    Array.prototype.forEach.call(els, function (el) {
      var st = { el: el, tipos: el.dataset.tipos.split(','), cur: 'todos', shown: 10 };
      el.innerHTML = '<div class="cl-n">A carregar…</div>'; bind(st); boxes.push(st);
    });
    fetch('/conteudo.json', { cache: 'no-cache' }).then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) { data = (j.itens || []).filter(function (i) { return !(i.tipo === 'biblioteca' && /^\/pdf\//.test(i.ficheiro || '')); }); })  /* os 3 PDFs base já estão embutidos na vista */
      .catch(function () { erro = true; })
      .then(function () { boxes.forEach(draw); });
    // ligações directas: /#biblioteca e /#cursos (também quando o endereço muda com a app já aberta)
    function irPara() { var h = (location.hash || '').replace('#', ''); if ((h === 'biblioteca' || h === 'cursos') && typeof showView === 'function') showView(h); }
    irPara(); window.addEventListener('hashchange', irPara);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
