/* Leitor de curso por aulas: conteúdo escrito → slides → vídeo-resumo → teste de 10 perguntas.
   O servidor decide o que está desbloqueado, regista slides/vídeo, corrige os testes e guarda o progresso.
   Este ficheiro apenas mostra o que o servidor devolve. */
(function () {
  'use strict';
  var raiz = document.getElementById('ec-curso'); if (!raiz || !window.ECConta) return;
  var slug = raiz.getAttribute('data-curso'), el = ECConta.el, topo = raiz.innerHTML, estado = null, user = null;

  function api(metodo, corpo, q) {
    var o = { method: metodo, credentials: 'same-origin', headers: {} };
    if (corpo) { o.headers['Content-Type'] = 'application/json'; o.headers['X-EC-Req'] = '1'; o.body = JSON.stringify(corpo); }
    return fetch('/api/aprendizagem' + (q || ''), o).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { j._st = r.status; return j; }); })
      .catch(function () { return { erro: 'Sem ligação. Tente novamente.', _st: 0 }; });
  }
  function limpa() { raiz.innerHTML = ''; }
  function faixa() {
    var f = el('div', 'ec-user'); f.appendChild(el('span', '', 'Estudante ' + user.numero + ' · ' + user.utilizador));
    var b = el('button', 'btn alt', 'Sair'); b.type = 'button';
    b.onclick = function () { ECConta.sair().then(function () { user = null; inicio(); }); }; f.appendChild(b); return f;
  }
  function aviso(txt, cls) { var p = el('p', cls || 'ec-msg', txt); p.setAttribute('role', 'alert'); return p; }

  function inicio() {
    ECConta.eu().then(function (j) {
      if (j.utilizador) { user = j; carregar(); return; }
      limpa(); raiz.innerHTML = topo;
      if (j.configurado === false) { raiz.appendChild(aviso('As contas de estudante ainda não estão activas neste site. Volte em breve.')); return; }
      var cx = el('div'); cx.appendChild(el('h3', '', 'Entre ou crie a sua conta para estudar este curso')); var f = el('div'); cx.appendChild(f); raiz.insertBefore(cx, raiz.firstChild);
      ECConta.render(f, function (u) { user = u; carregar(); });
    });
  }

  function carregar() {
    api('GET', null, '?curso=' + encodeURIComponent(slug)).then(function (j) {
      if (j._st === 401) { user = null; inicio(); return; }
      if (j._st !== 200) { limpa(); raiz.appendChild(aviso(j.erro || 'Não foi possível abrir o curso.')); return; }
      estado = j; lista();
    });
  }

  function lista() {
    limpa(); raiz.appendChild(faixa());
    var ol = el('ol', 'aulas ec-lista-aulas');
    estado.aulas.forEach(function (a, i) {
      var li = el('li', 'aula ec-a-' + a.estado), t = el('b', '', (i + 1) + '. ' + a.titulo);
      var chip = el('span', 'ec-chip', a.estado === 'concluida' ? '✔ Concluída' : a.estado === 'bloqueada' ? '🔒 Bloqueada' : '▶ Disponível');
      li.appendChild(t); li.appendChild(document.createTextNode(' ')); li.appendChild(chip);
      if (a.resumo) li.appendChild(el('p', '', a.resumo));
      var det = [];
      if (a.nSlides) det.push('Slides ' + a.slidesVistos + '/' + a.nSlides);
      if (a.temVideo) det.push('Vídeo ' + (a.videoVisto ? 'visto' : a.videoObrigatorio ? 'obrigatório' : 'opcional'));
      if (a.temTeste) det.push('Teste: ' + (a.aprovado ? 'aprovado (' + a.melhor + '%)' : a.tentativas ? 'melhor ' + a.melhor + '%' : 'por fazer'));
      if (det.length) li.appendChild(el('p', 'meta', det.join(' · ')));
      if (a.estado !== 'bloqueada') { var b = el('button', 'btn', a.estado === 'concluida' ? 'Rever aula' : 'Abrir aula'); b.type = 'button'; b.onclick = function () { abrir(i); }; li.appendChild(b); }
      ol.appendChild(li);
    });
    raiz.appendChild(ol);
    raiz.appendChild(el('p', 'meta', 'As aulas abrem por ordem. Para avançar tem de ver os slides' + (estado.aulas.some(function (a) { return a.videoObrigatorio; }) ? ', o vídeo-resumo' : '') + ' e ser aprovado no teste de 10 perguntas (nota mínima ' + estado.notaMinima + '%).'));
    if (estado.concluido) raiz.appendChild(aviso('Parabéns! Concluiu todas as aulas deste curso.', 'ec-ok-msg'));
  }

  function abrir(i) {
    api('GET', null, '?curso=' + encodeURIComponent(slug) + '&aula=' + i).then(function (a) {
      if (a._st === 401) { user = null; inicio(); return; }
      if (a._st !== 200) { alert(a.erro || 'Não foi possível abrir a aula.'); carregar(); return; }
      aula(i, a);
    });
  }

  function aula(i, a) {
    limpa(); raiz.appendChild(faixa());
    var voltar = el('button', 'btn alt', '‹ Todas as aulas'); voltar.type = 'button'; voltar.onclick = carregar; raiz.appendChild(voltar);
    raiz.appendChild(el('h3', '', (i + 1) + '. ' + a.titulo));
    var txt = el('div', 'ec-texto'); txt.innerHTML = a.html; raiz.appendChild(txt);
    var req = { slides: a.nSlides === 0 || a.slidesVistos >= a.nSlides, video: !a.videoObrigatorio || a.videoVisto };
    var pronto = el('div', 'ec-teste-box');

    if (a.slides.length) slidesUI(i, a, req, pronto);
    if (a.video) videoUI(i, a, req, pronto);
    raiz.appendChild(pronto); atualizaBox(i, a, req, pronto);
  }

  function slidesUI(i, a, req, pronto) {
    var cx = el('section', 'ec-slides'), k = Math.max(0, Math.min(a.slidesVistos, a.slides.length) - 1), n = a.slides.length;
    cx.appendChild(el('h4', '', 'Slides de aprendizagem'));
    if (a.temPptx) { var dl = el('a', 'btn alt', '⬇ Descarregar slides (PowerPoint)'); dl.href = '/api/aprendizagem?curso=' + encodeURIComponent(slug) + '&aula=' + i + '&pptx=1'; dl.setAttribute('download', ''); cx.appendChild(dl); }
    var corpo = el('div', 'ec-slide'), nav = el('div', 'ec-slide-nav'), ant = el('button', 'btn alt', '‹ Anterior'), seg = el('button', 'btn', 'Seguinte ›'), pos = el('span', 'meta');
    ant.type = seg.type = 'button'; nav.appendChild(ant); nav.appendChild(pos); nav.appendChild(seg); cx.appendChild(corpo); cx.appendChild(nav); raiz.appendChild(cx);
    var timer = 0;
    function mostrar() {
      var s = a.slides[k]; corpo.innerHTML = ''; corpo.appendChild(el('h5', '', s.titulo));
      if (s.imagem) { var im = el('img'); im.src = s.imagem; im.alt = ''; im.loading = 'lazy'; corpo.appendChild(im); }
      var d = el('div'); d.innerHTML = s.html; corpo.appendChild(d);
      pos.textContent = 'Slide ' + (k + 1) + ' de ' + n; ant.disabled = k === 0;
      registar();
    }
    function registar() {
      seg.disabled = true; clearTimeout(timer);
      api('POST', { acao: 'slide', curso: slug, aula: i, i: k }).then(function (r) {
        if (r._st === 200) { a.slidesVistos = r.vistos; req.slides = r.vistos >= n; seg.disabled = k >= n - 1; if (k >= n - 1 && req.slides) timer = setTimeout(function () { atualizaBox(i, a, req, pronto); }, 3200); else atualizaBox(i, a, req, pronto); }
        else if (r._st === 429) { timer = setTimeout(registar, (r.esperaMs || 3000) + 150); }
        else if (r._st === 409) { k = r.proximo || 0; mostrar(); }
      });
    }
    ant.onclick = function () { if (k > 0) { k--; mostrar(); } };
    seg.onclick = function () { if (k < n - 1) { k++; mostrar(); } };
    mostrar();
  }

  function videoUI(i, a, req, pronto) {
    var cx = el('section', 'ec-video'); cx.appendChild(el('h4', '', 'Vídeo-resumo' + (a.videoObrigatorio ? ' (obrigatório)' : '')));
    var mudou = function (ev) { api('POST', { acao: 'video', curso: slug, aula: i, evento: ev }).then(function (r) { if (ev === 'fim' && r._st === 200) { req.video = true; a.videoVisto = true; atualizaBox(i, a, req, pronto); } return r; }); };
    var iniciou = false, ini = function () { if (!iniciou) { iniciou = true; mudou('inicio'); } };
    if (a.video.youtube) {
      var w = el('div', 'vid'), fr = el('iframe'); fr.id = 'ec-yt'; fr.title = 'Vídeo-resumo'; fr.allow = 'encrypted-media;picture-in-picture;fullscreen'; fr.allowFullscreen = true;
      fr.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(a.video.youtube) + '?enablejsapi=1&rel=0&origin=' + encodeURIComponent(location.origin);
      w.appendChild(fr); cx.appendChild(w);
      var tag = el('script'); tag.src = 'https://www.youtube.com/iframe_api'; var prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function () { if (prev) prev(); new YT.Player('ec-yt', { events: { onStateChange: function (e) { if (e.data === 1) ini(); if (e.data === 0) { ini(); mudou('fim'); } } } }); };
      document.head.appendChild(tag);
    } else {
      var v = el('video', 'vf'); v.controls = true; v.preload = 'metadata'; v.src = a.video.ficheiro; v.addEventListener('play', ini); v.addEventListener('ended', function () { ini(); mudou('fim'); }); cx.appendChild(v);
    }
    if (a.videoObrigatorio && !a.videoVisto) cx.appendChild(el('p', 'meta', 'Veja o vídeo até ao fim para desbloquear o teste.'));
    raiz.appendChild(cx);
  }

  function atualizaBox(i, a, req, box) {
    box.innerHTML = '';
    if (!a.teste) {
      var b = el('button', 'btn', 'Concluir aula'); b.type = 'button'; b.disabled = !(req.slides && req.video);
      b.onclick = function () { api('POST', { acao: 'concluir', curso: slug, aula: i }).then(function (r) { if (r._st === 200) { estado = r; lista(); } else box.appendChild(aviso(r.erro || 'Ainda faltam requisitos.')); }); };
      box.appendChild(el('h4', '', 'Concluir')); box.appendChild(b); if (b.disabled) box.appendChild(el('p', 'meta', 'Veja os slides' + (a.videoObrigatorio ? ' e o vídeo' : '') + ' para concluir.')); return;
    }
    box.appendChild(el('h4', '', 'Teste de avaliação'));
    box.appendChild(el('p', '', a.teste.total + ' perguntas · nota mínima ' + a.teste.notaMinima + '%' + (a.teste.tentativasMax ? ' · até ' + a.teste.tentativasMax + ' tentativas seguidas' : ' · tentativas ilimitadas')));
    if (a.aprovado) { box.appendChild(aviso('Teste aprovado (' + a.melhor + '%).', 'ec-ok-msg')); return; }
    var ok = req.slides && req.video, b2 = el('button', 'btn', 'Iniciar teste'); b2.type = 'button'; b2.disabled = !ok;
    if (!ok) box.appendChild(el('p', 'meta', 'O teste fica disponível depois de ver ' + (!req.slides ? 'todos os slides' : '') + (!req.slides && !req.video ? ' e ' : '') + (!req.video ? 'o vídeo-resumo' : '') + '.'));
    b2.onclick = function () { b2.disabled = true; api('POST', { acao: 'teste-iniciar', curso: slug, aula: i }).then(function (r) { if (r._st === 200) teste(i, a, r, box); else { b2.disabled = false; box.appendChild(aviso(r.erro || 'Não foi possível iniciar o teste.')); } }); };
    box.appendChild(b2);
  }

  function teste(i, a, t, box) {
    box.innerHTML = ''; box.appendChild(el('h4', '', 'Teste: responda às 10 perguntas')); box.appendChild(el('p', 'meta', 'Nota mínima ' + t.notaMinima + '%.' + (t.tentativasRestantes != null ? ' Tentativas restantes: ' + t.tentativasRestantes + '.' : '')));
    var f = el('form', 'ec-quiz');
    t.perguntas.forEach(function (q, k) {
      var fs = el('fieldset'), lg = el('legend', '', (k + 1) + '. ' + q.pergunta); fs.appendChild(lg);
      q.opcoes.forEach(function (o, oi) { var l = el('label', 'ec-op'), r = el('input'); r.type = 'radio'; r.name = 'q' + k; r.value = oi; l.appendChild(r); l.appendChild(document.createTextNode(' ' + o)); fs.appendChild(l); });
      f.appendChild(fs);
    });
    var s = el('button', 'btn', 'Submeter teste'); s.type = 'submit'; f.appendChild(s); box.appendChild(f);
    f.onsubmit = function (ev) {
      ev.preventDefault();
      var resp = t.perguntas.map(function (_, k) { var c = f.querySelector('input[name="q' + k + '"]:checked'); return c ? Number(c.value) : -1; });
      if (resp.indexOf(-1) > -1 && !confirm('Há perguntas sem resposta; contam como erradas. Submeter mesmo assim?')) return;
      s.disabled = true;
      api('POST', { acao: 'teste-submeter', curso: slug, aula: i, tid: t.tid, respostas: resp }).then(function (r) { if (r._st === 200) resultado(i, a, t, r, box); else { s.disabled = false; box.appendChild(aviso(r.erro || 'Erro ao submeter.')); } });
    };
  }

  function resultado(i, a, t, r, box) {
    estado = r.curso; box.innerHTML = '';
    box.appendChild(el('h4', '', r.aprovado ? 'Aprovado' : 'Não aprovado'));
    box.appendChild(aviso('Pontuação: ' + r.pontuacao + ' de ' + r.total + ' (' + r.percentagem + '%). Nota mínima: ' + r.notaMinima + '%.', r.aprovado ? 'ec-ok-msg' : 'ec-msg'));
    var ol = el('ol', 'ec-corr');
    r.correcao.forEach(function (c, k) {
      var li = el('li', c.certa ? 'certa' : 'errada'); li.appendChild(el('b', '', t.perguntas[k].pergunta)); li.appendChild(el('span', '', c.certa ? ' ✔ Certa' : ' ✘ Errada'));
      if (c.explicacao || c.correta) li.appendChild(el('p', 'meta', (c.correta ? 'Resposta certa: ' + c.correta + '. ' : '') + (c.explicacao || '')));
      ol.appendChild(li);
    });
    box.appendChild(ol);
    if (r.aprovado) {
      var prox = i + 1 < estado.aulas.length, b = el('button', 'btn', prox ? 'Aula seguinte ›' : 'Ver o curso'); b.type = 'button';
      b.onclick = function () { if (prox) abrir(i + 1); else lista(); }; box.appendChild(b);
    } else {
      box.appendChild(el('p', '', r.tentativasRestantes === 0 ? 'Esgotou as tentativas. Reveja a matéria e tente novamente mais tarde.' : 'Reveja os slides e tente novamente.' + (r.tentativasRestantes != null ? ' Tentativas restantes: ' + r.tentativasRestantes + '.' : '')));
      var b3 = el('button', 'btn alt', 'Rever a aula'); b3.type = 'button'; b3.onclick = function () { abrir(i); }; box.appendChild(b3);
    }
  }
  inicio();
})();
