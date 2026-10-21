/* Leitor de curso livre — sem conta e sem palavra-passe.
   Fluxo de cada aula: Iniciar aula → slides (um a um) → vídeo (se existir) → teste de 10 perguntas → próxima aula.
   Os dados vêm de /cursos/dados/<curso>.json (gerado pelo build). O progresso fica só no navegador do estudante (localStorage).
   Código em ES5 para funcionar em telemóveis Android antigos. */
(function () {
  'use strict';
  var raiz = document.getElementById('ec-curso');
  if (!raiz) return;
  var slug = raiz.getAttribute('data-curso');
  var fonte = raiz.getAttribute('data-src');
  var fallback = raiz.innerHTML;          // lista estática (também serve a motores de pesquisa e a quem não tem JS)
  var curso = null, estado = { a: {}, ultima: -1 };
  var CHAVE = 'ec:curso:' + slug;
  var reduzir = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- utilitários ---------- */
  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }
  function botao(txt, cls, fn) {
    var b = el('button', 'ecp-btn ' + (cls || ''), txt);
    b.type = 'button';
    if (fn) b.addEventListener('click', fn);
    return b;
  }
  function limpa() { while (raiz.firstChild) raiz.removeChild(raiz.firstChild); }
  function plural(n, s, p) { return n + ' ' + (n === 1 ? s : p); }
  function lerEstado() {
    try {
      var j = JSON.parse(localStorage.getItem(CHAVE) || 'null');
      if (j && typeof j === 'object' && j.a) estado = j;
    } catch (e) { /* sem armazenamento: o curso funciona na mesma, sem guardar */ }
  }
  function gravar() { try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) { /* ignorar */ } }
  function reg(i) { if (!estado.a[i]) estado.a[i] = { s: 0, v: 0, p: 0, ok: false, t: 0 }; return estado.a[i]; }
  function aulaOk(i) { return !!(estado.a[i] && estado.a[i].ok); }
  function concluidas() { var n = 0; for (var i = 0; i < curso.aulas.length; i++) if (aulaOk(i)) n++; return n; }
  function proxima() {                    // primeira aula por concluir, a começar pela última aberta
    var n = curso.aulas.length, ini = estado.ultima >= 0 && !aulaOk(estado.ultima) ? estado.ultima : 0;
    for (var k = 0; k < n; k++) { var i = (ini + k) % n; if (!aulaOk(i)) return i; }
    return -1;
  }
  function topo() {
    var r = raiz.getBoundingClientRect();
    if (r.top < 0 || r.top > 120) window.scrollTo({ top: Math.max(0, window.pageYOffset + r.top - 70), behavior: reduzir ? 'auto' : 'smooth' });
  }
  function foco(e) { if (e) { e.setAttribute('tabindex', '-1'); try { e.focus({ preventScroll: true }); } catch (x) { e.focus(); } } }
  function barra(pct, rotulo) {
    var b = el('div', 'ecp-barra'); b.setAttribute('role', 'progressbar'); b.setAttribute('aria-valuemin', '0'); b.setAttribute('aria-valuemax', '100'); b.setAttribute('aria-valuenow', String(Math.round(pct))); if (rotulo) b.setAttribute('aria-label', rotulo);
    var s = el('span'); s.style.width = Math.max(0, Math.min(100, pct)) + '%'; b.appendChild(s); return b;
  }
  function crumbs(i, ultimo) {
    var n = el('nav', 'ecp-crumbs'); n.setAttribute('aria-label', 'Navegação do curso');
    n.appendChild(botao('‹ Todas as aulas', 'ecp-link', irLista));
    if (i != null) n.appendChild(el('span', 'ecp-crumb-t', 'Aula ' + (i + 1) + ' de ' + curso.aulas.length + (ultimo ? ' · ' + ultimo : '')));
    return n;
  }
  function setHash(h) { try { history.replaceState(null, '', '#' + h); } catch (e) { /* ignorar */ } }

  /* ---------- vista 1: lista de aulas ---------- */
  function irLista() { setHash('aulas'); lista(true); }
  function lista(rolar) {
    limpa();
    var n = curso.aulas.length, feitas = concluidas(), prox = proxima();
    var cab = el('div', 'ecp-cab'), info = el('div', 'ecp-cab-i');
    info.appendChild(el('p', 'ecp-cab-k', feitas === n ? 'Curso concluído' : feitas ? 'O seu progresso' : 'Pronto para começar?'));
    info.appendChild(el('p', 'ecp-cab-t', feitas + ' de ' + plural(n, 'aula concluída', 'aulas concluídas')));
    info.appendChild(barra((feitas / n) * 100, 'Progresso do curso'));
    cab.appendChild(info);
    if (prox >= 0) cab.appendChild(botao(feitas || estado.ultima >= 0 ? '▶ Continuar: aula ' + (prox + 1) : '▶ Iniciar curso', 'ecp-primario ecp-grande', function () { intro(prox); }));
    else cab.appendChild(botao('↺ Rever a aula 1', 'ecp-sec ecp-grande', function () { intro(0); }));
    raiz.appendChild(cab);

    if (feitas === n) {
      var par = el('p', 'ecp-ok', '🎉 Parabéns! Concluiu todas as aulas deste curso. Pode rever qualquer aula quando quiser.');
      par.setAttribute('role', 'status'); raiz.appendChild(par);
    }
    var ol = el('ol', 'ecp-aulas');
    for (var i = 0; i < n; i++) ol.appendChild(cartaoAula(i));
    raiz.appendChild(ol);
    raiz.appendChild(el('p', 'ecp-nota', 'Curso gratuito e livre: não precisa de conta nem de palavra-passe. O progresso fica guardado neste dispositivo.'));
    if (feitas || estado.ultima >= 0) {
      raiz.appendChild(botao('Apagar o meu progresso', 'ecp-link ecp-perigo', function () {
        if (window.confirm('Apagar o progresso deste curso neste dispositivo?')) { estado = { a: {}, ultima: -1 }; gravar(); lista(false); }
      }));
    }
    if (rolar) topo();
  }
  function cartaoAula(i) {
    var a = curso.aulas[i], r = estado.a[i] || {}, li = el('li', 'ecp-aula' + (aulaOk(i) ? ' feita' : ''));
    var num = el('span', 'ecp-num', aulaOk(i) ? '✓' : String(i + 1)); num.setAttribute('aria-hidden', 'true'); li.appendChild(num);
    var corpo = el('div', 'ecp-aula-c');
    corpo.appendChild(el('h3', 'ecp-aula-t', a.titulo));
    var meta = [];
    if (a.duracao) meta.push(a.duracao);
    meta.push(plural(a.slides.length, 'slide', 'slides'));
    if (a.video) meta.push('vídeo');
    if (a.teste) meta.push('teste de ' + a.teste.perguntas.length + ' perguntas');
    corpo.appendChild(el('p', 'ecp-aula-m', meta.join(' · ')));
    if (a.resumo) corpo.appendChild(el('p', 'ecp-aula-r', a.resumo));
    var chip = aulaOk(i) ? '✔ Concluída · ' + r.p + '%' : (r.v > 0 ? 'Em curso · slide ' + Math.min(r.v, a.slides.length) + ' de ' + a.slides.length : 'Por iniciar');
    corpo.appendChild(el('span', 'ecp-chip' + (aulaOk(i) ? ' ok' : r.v > 0 ? ' em' : ''), chip));
    var acoes = el('div', 'ecp-acoes');
    acoes.appendChild(botao(aulaOk(i) ? 'Rever aula' : (r.v > 0 ? 'Continuar aula' : 'Iniciar aula'), aulaOk(i) ? 'ecp-sec' : 'ecp-primario', function () { intro(i); }));
    corpo.appendChild(acoes);
    li.appendChild(corpo);
    return li;
  }

  /* ---------- vista 2: apresentação da aula (botão «Iniciar aula») ---------- */
  function intro(i) {
    var a = curso.aulas[i], r = reg(i);
    estado.ultima = i; gravar(); setHash('aula-' + (i + 1));
    limpa(); raiz.appendChild(crumbs(i));
    var card = el('section', 'ecp-card'), h = el('h3', 'ecp-titulo', a.titulo); card.appendChild(h);
    if (a.duracao) card.appendChild(el('p', 'ecp-aula-m', 'Duração estimada: ' + a.duracao));
    var txt = el('div', 'ecp-texto'); txt.innerHTML = a.html; card.appendChild(txt);   // HTML gerado pelo build a partir do CMS
    var passos = el('ol', 'ecp-passos');
    passos.appendChild(el('li', '', 'Leia os ' + a.slides.length + ' slides, ao seu ritmo.'));
    if (a.video) passos.appendChild(el('li', '', 'Veja o vídeo da aula.'));
    if (a.teste) passos.appendChild(el('li', '', 'Faça o teste de ' + a.teste.perguntas.length + ' perguntas (nota mínima ' + a.teste.notaMinima + '%).'));
    card.appendChild(el('h4', 'ecp-sub', 'O que vai fazer')); card.appendChild(passos);
    var ac = el('div', 'ecp-acoes ecp-acoes-grande'), tem = r.v > 0 && r.s > 0 && !r.ok;
    ac.appendChild(botao(tem ? '▶ Continuar aula' : '▶ Iniciar aula', 'ecp-primario ecp-grande', function () { slides(i, tem ? r.s : 0); }));
    if (tem) ac.appendChild(botao('Recomeçar do início', 'ecp-sec', function () { slides(i, 0); }));
    if (r.v >= a.slides.length && a.teste) ac.appendChild(botao('Ir directo ao teste', 'ecp-sec', function () { if (a.video) video(i); else teste(i); }));
    card.appendChild(ac);
    raiz.appendChild(card); topo(); foco(h);
  }

  /* ---------- vista 3: slides ---------- */
  var ROTULO = { objetivos: 'Objectivos', fluxo: 'Passo a passo', caso: 'Caso clínico', 'pontos-chave': 'Pontos-chave', reflexao: 'Para reflectir', leitura: 'Para aprofundar', resumo: 'Resumo' };
  function slides(i, k) {
    var a = curso.aulas[i], r = reg(i), n = a.slides.length;
    if (!n) { if (a.video) video(i); else teste(i); return; }
    k = Math.max(0, Math.min(k || 0, n - 1));
    estado.ultima = i;
    limpa(); raiz.appendChild(crumbs(i, 'slides'));
    var caixa = el('section', 'ecp-card ecp-slides'), pos = el('p', 'ecp-pos'); pos.setAttribute('aria-live', 'polite');
    var bar = barra(0, 'Progresso dos slides'), corpo = el('article', 'ecp-slide'), nav = el('div', 'ecp-nav');
    var ant = botao('‹ Anterior', 'ecp-sec'), seg = botao('Seguinte ›', 'ecp-primario'), meio = el('span', 'ecp-nav-m');
    nav.appendChild(ant); nav.appendChild(meio); nav.appendChild(seg);
    caixa.appendChild(pos); caixa.appendChild(bar); caixa.appendChild(corpo); caixa.appendChild(nav);
    caixa.appendChild(el('p', 'ecp-dica', 'Dica: use as setas do teclado ou deslize o dedo para mudar de slide.'));
    raiz.appendChild(caixa);

    function mostrar() {
      var s = a.slides[k], tipo = s.tipo || 'conteudo';
      corpo.className = 'ecp-slide ecp-s-' + tipo;
      while (corpo.firstChild) corpo.removeChild(corpo.firstChild);
      if (ROTULO[tipo]) corpo.appendChild(el('p', 'ecp-s-tipo', ROTULO[tipo]));
      var h = el('h3', 'ecp-s-t', s.titulo); corpo.appendChild(h);
      if (s.imagem) { var im = el('img', 'ecp-s-img'); im.src = s.imagem; im.alt = s.titulo; im.loading = 'lazy'; im.decoding = 'async'; corpo.appendChild(im); }
      var d = el('div', 'ecp-s-txt'); d.innerHTML = s.html; corpo.appendChild(d);          // HTML gerado pelo build
      var tabs = d.querySelectorAll('table');
      for (var t = 0; t < tabs.length; t++) { var w = el('div', 'ecp-tabela'); tabs[t].parentNode.insertBefore(w, tabs[t]); w.appendChild(tabs[t]); }
      var as = d.querySelectorAll('a[href^="http"]'); for (var q = 0; q < as.length; q++) { as[q].target = '_blank'; as[q].rel = 'noopener'; }
      pos.textContent = 'Slide ' + (k + 1) + ' de ' + n;
      bar.firstChild.style.width = ((k + 1) / n * 100) + '%'; bar.setAttribute('aria-valuenow', String(Math.round((k + 1) / n * 100)));
      ant.disabled = k === 0;
      var ultimo = k === n - 1;
      seg.textContent = ultimo ? (a.video ? 'Ver o vídeo ›' : a.teste ? 'Ir para o teste ›' : 'Concluir aula ✓') : 'Seguinte ›';
      seg.className = 'ecp-btn ' + (ultimo ? 'ecp-destaque' : 'ecp-primario');
      meio.textContent = ultimo ? '' : (k + 1) + '/' + n;
      if (k + 1 > r.v) r.v = k + 1;
      r.s = k; gravar(); setHash('aula-' + (i + 1) + '-slide-' + (k + 1));
      topo(); foco(h);
    }
    function avancar() {
      if (k < n - 1) { k++; mostrar(); return; }
      if (a.video) video(i); else if (a.teste) teste(i); else concluirSemTeste(i);
    }
    function recuar() { if (k > 0) { k--; mostrar(); } }
    ant.addEventListener('click', recuar); seg.addEventListener('click', avancar);

    function tecla(ev) {
      if (!document.body.contains(caixa)) { document.removeEventListener('keydown', tecla); return; }
      var alvo = ev.target && ev.target.tagName;
      if (alvo === 'INPUT' || alvo === 'TEXTAREA' || alvo === 'SELECT') return;
      if (ev.key === 'ArrowRight') { ev.preventDefault(); avancar(); } else if (ev.key === 'ArrowLeft') { ev.preventDefault(); recuar(); }
    }
    document.addEventListener('keydown', tecla);
    var x0 = null, y0 = null;
    corpo.addEventListener('touchstart', function (e) { if (e.touches.length === 1) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; } }, { passive: true });
    corpo.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.6) { if (dx < 0) avancar(); else recuar(); }
    }, { passive: true });
    mostrar();
  }
  function concluirSemTeste(i) { var r = reg(i); r.ok = true; r.p = 100; gravar(); resultadoFinal(i); }

  /* ---------- vista 4: vídeo (opcional; os vídeos são acrescentados depois pelo CMS) ---------- */
  function video(i) {
    var a = curso.aulas[i], v = a.video || {};
    limpa(); raiz.appendChild(crumbs(i, 'vídeo')); setHash('aula-' + (i + 1) + '-video');
    var card = el('section', 'ecp-card'), h = el('h3', 'ecp-titulo', 'Vídeo da aula'); card.appendChild(h);
    if (v.youtube) {
      var w = el('div', 'ecp-vid'), fr = el('iframe');
      fr.title = 'Vídeo: ' + a.titulo; fr.loading = 'lazy'; fr.setAttribute('allow', 'encrypted-media; picture-in-picture; fullscreen'); fr.setAttribute('allowfullscreen', '');
      fr.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.youtube) + '?rel=0';
      w.appendChild(fr); card.appendChild(w);
    } else if (v.ficheiro) {
      var vd = el('video', 'ecp-vf'); vd.controls = true; vd.preload = 'metadata'; vd.setAttribute('playsinline', '');
      var so = document.createElement('source'); so.src = v.ficheiro; vd.appendChild(so); card.appendChild(vd);
    }
    var ac = el('div', 'ecp-acoes ecp-acoes-grande');
    ac.appendChild(botao('‹ Rever slides', 'ecp-sec', function () { slides(i, a.slides.length - 1); }));
    ac.appendChild(botao(a.teste ? 'Ir para o teste ›' : 'Concluir aula ✓', 'ecp-destaque ecp-grande', function () { if (a.teste) teste(i); else concluirSemTeste(i); }));
    card.appendChild(ac); raiz.appendChild(card); topo(); foco(h);
  }

  /* ---------- vista 5: teste da aula ---------- */
  function baralhar(arr) { var b = arr.slice(), j, t; for (var k = b.length - 1; k > 0; k--) { j = Math.floor(Math.random() * (k + 1)); t = b[k]; b[k] = b[j]; b[j] = t; } return b; }
  function teste(i) {
    var a = curso.aulas[i], T = a.teste;
    if (!T) { concluirSemTeste(i); return; }
    limpa(); raiz.appendChild(crumbs(i, 'teste')); setHash('aula-' + (i + 1) + '-teste');
    var card = el('section', 'ecp-card'), h = el('h3', 'ecp-titulo', 'Teste: ' + a.titulo); card.appendChild(h);
    card.appendChild(el('p', 'ecp-aula-m', T.perguntas.length + ' perguntas · nota mínima ' + T.notaMinima + '% · tentativas ilimitadas'));
    card.appendChild(el('p', 'ecp-nota', 'Escolha uma resposta em cada pergunta e carregue em «Ver resultado». Verá a correcção e a explicação de cada uma.'));

    // cada tentativa baralha as perguntas e as opções
    var ordem = baralhar(T.perguntas.map(function (q, qi) { return qi; })), form = el('form', 'ecp-quiz');
    form.setAttribute('novalidate', ''); form.addEventListener('submit', function (e) { e.preventDefault(); });
    var itens = [];
    ordem.forEach(function (qi, pos) {
      var q = T.perguntas[qi], fs = el('fieldset', 'ecp-q'); fs.appendChild(el('legend', '', (pos + 1) + '. ' + q.pergunta));
      var ops = baralhar(q.opcoes.map(function (o, oi) { return oi; })), lista = [];
      ops.forEach(function (oi, k) {
        var lab = el('label', 'ecp-op'), inp = document.createElement('input');
        inp.type = 'radio'; inp.name = 'q' + pos; inp.value = String(oi);
        var letra = el('span', 'ecp-op-l', String.fromCharCode(65 + k)); letra.setAttribute('aria-hidden', 'true');
        lab.appendChild(inp); lab.appendChild(letra); lab.appendChild(el('span', 'ecp-op-t', q.opcoes[oi]));
        fs.appendChild(lab); lista.push({ el: lab, inp: inp, oi: oi });
      });
      var ex = el('p', 'ecp-ex'); ex.hidden = true; fs.appendChild(ex);
      form.appendChild(fs); itens.push({ q: q, fs: fs, ops: lista, ex: ex });
    });
    card.appendChild(form);

    var aviso = el('p', 'ecp-aviso'); aviso.setAttribute('role', 'alert'); aviso.hidden = true; card.appendChild(aviso);
    var ac = el('div', 'ecp-acoes ecp-acoes-grande');
    ac.appendChild(botao('Ver resultado', 'ecp-primario ecp-grande', function () {
      var faltam = 0, k, m, primeira = null;
      for (k = 0; k < itens.length; k++) {
        var marcado = false;
        for (m = 0; m < itens[k].ops.length; m++) if (itens[k].ops[m].inp.checked) marcado = true;
        itens[k].fs.className = marcado ? 'ecp-q' : 'ecp-q falta';
        if (!marcado) { faltam++; if (!primeira) primeira = itens[k].fs; }
      }
      if (faltam) {
        aviso.hidden = false; aviso.textContent = faltam === 1 ? 'Falta responder a 1 pergunta (assinalada a laranja).' : 'Faltam ' + faltam + ' perguntas (assinaladas a laranja).';
        primeira.scrollIntoView({ behavior: reduzir ? 'auto' : 'smooth', block: 'center' });
        return;
      }
      aviso.hidden = true; corrigir(i, itens, form, ac, card, T);
    }));
    ac.appendChild(botao('‹ Rever slides', 'ecp-sec', function () { slides(i, 0); }));
    card.appendChild(ac);
    raiz.appendChild(card); topo(); foco(h);
  }
  function corrigir(i, itens, form, ac, card, T) {
    var certas = 0, k, m;
    for (k = 0; k < itens.length; k++) {
      var it = itens[k], certa = it.q.correta - 1, escolhida = -1;
      for (m = 0; m < it.ops.length; m++) { it.ops[m].inp.disabled = true; if (it.ops[m].inp.checked) escolhida = it.ops[m].oi; }
      var acertou = escolhida === certa; if (acertou) certas++;
      it.fs.className = 'ecp-q ' + (acertou ? 'certa' : 'errada');
      for (m = 0; m < it.ops.length; m++) {
        if (it.ops[m].oi === certa) it.ops[m].el.className = 'ecp-op c';
        else if (it.ops[m].oi === escolhida) it.ops[m].el.className = 'ecp-op e';
      }
      it.ex.hidden = false;
      it.ex.textContent = (acertou ? 'Certo. ' : 'Errado. A resposta certa é: ' + it.q.opcoes[certa] + '. ') + (it.q.explicacao || '');
    }
    var pct = Math.round(certas / itens.length * 100), r = reg(i), passou = pct >= T.notaMinima;
    r.t = (r.t || 0) + 1; if (pct > r.p) r.p = pct; if (passou) r.ok = true; gravar();

    var res = el('div', 'ecp-res ' + (passou ? 'aprovado' : 'reprovado')); res.setAttribute('role', 'status');
    res.appendChild(el('p', 'ecp-res-n', pct + '%'));
    res.appendChild(el('p', 'ecp-res-t', passou ? 'Aprovado! Acertou ' + certas + ' de ' + itens.length + '.' : 'Ainda não chegou à nota mínima (' + T.notaMinima + '%). Acertou ' + certas + ' de ' + itens.length + '.'));
    res.appendChild(el('p', 'ecp-res-d', passou ? 'Reveja abaixo as explicações e avance quando quiser.' : 'Não faz mal: reveja os slides e as explicações abaixo e tente de novo, quantas vezes quiser.'));
    card.insertBefore(res, form);
    while (ac.firstChild) ac.removeChild(ac.firstChild);
    var n = curso.aulas.length;
    if (passou) {
      if (i < n - 1) ac.appendChild(botao('Aula seguinte ›', 'ecp-destaque ecp-grande', function () { intro(i + 1); }));
      else ac.appendChild(botao('Concluir o curso ✓', 'ecp-destaque ecp-grande', function () { resultadoFinal(i); }));
      ac.appendChild(botao('Repetir o teste', 'ecp-sec', function () { teste(i); }));
    } else {
      ac.appendChild(botao('Tentar outra vez', 'ecp-primario ecp-grande', function () { teste(i); }));
      ac.appendChild(botao('Rever os slides', 'ecp-sec', function () { slides(i, 0); }));
    }
    ac.appendChild(botao('Todas as aulas', 'ecp-link', irLista));
    res.scrollIntoView({ behavior: reduzir ? 'auto' : 'smooth', block: 'start' }); foco(res);
  }

  /* ---------- fim de aula / fim do curso ---------- */
  function resultadoFinal(i) {
    var n = curso.aulas.length, feitas = concluidas();
    limpa(); raiz.appendChild(crumbs(i, 'concluída')); setHash('aulas');
    var card = el('section', 'ecp-card ecp-fim'), h = el('h3', 'ecp-titulo', feitas === n ? '🎉 Curso concluído!' : '✔ Aula concluída');
    card.appendChild(h);
    card.appendChild(el('p', 'ecp-texto', feitas === n ? 'Parabéns! Concluiu as ' + n + ' aulas de «' + curso.titulo + '». Pode rever qualquer aula ou explorar outros cursos.' : 'Concluiu ' + feitas + ' de ' + plural(n, 'aula', 'aulas') + '. Continue ao seu ritmo.'));
    card.appendChild(barra(feitas / n * 100, 'Progresso do curso'));
    var ac = el('div', 'ecp-acoes ecp-acoes-grande'), prox = proxima();
    if (prox >= 0) ac.appendChild(botao('Aula ' + (prox + 1) + ' ›', 'ecp-destaque ecp-grande', function () { intro(prox); }));
    ac.appendChild(botao('Todas as aulas', 'ecp-sec', irLista));
    if (feitas === n) { var l = el('a', 'ecp-btn ecp-primario', 'Ver outros cursos'); l.href = '/cursos/'; ac.appendChild(l); }
    card.appendChild(ac); raiz.appendChild(card); topo(); foco(h);
  }

  /* ---------- arranque ---------- */
  function abrirDoHash() {
    var m = /^#aula-(\d+)(?:-(slide|video|teste)(?:-(\d+))?)?$/.exec(location.hash || '');
    if (!m) { lista(false); return; }
    var i = parseInt(m[1], 10) - 1;
    if (i < 0 || i >= curso.aulas.length) { lista(false); return; }
    if (m[2] === 'slide') slides(i, (parseInt(m[3], 10) || 1) - 1);
    else if (m[2] === 'video' && curso.aulas[i].video) video(i);
    else if (m[2] === 'teste') teste(i);
    else intro(i);
  }
  function iniciar() {
    lerEstado();
    var botoes = document.querySelectorAll('[data-iniciar]');
    for (var b = 0; b < botoes.length; b++) botoes[b].addEventListener('click', function (ev) {
      ev.preventDefault(); var p = proxima(); raiz.scrollIntoView({ behavior: reduzir ? 'auto' : 'smooth' }); if (p >= 0) intro(p); else lista(true);
    });
    abrirDoHash();
  }
  var msg = el('p', 'ecp-nota', 'A carregar o curso…'); msg.setAttribute('role', 'status'); raiz.insertBefore(msg, raiz.firstChild);
  fetch(fonte, { credentials: 'same-origin' })
    .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
    .then(function (j) { curso = j; raiz.className = 'ecp-raiz'; iniciar(); })
    .catch(function () {
      raiz.innerHTML = fallback;
      var e = el('p', 'ecp-aviso', 'Não foi possível carregar o curso. Verifique a ligação e tente de novo.'); e.setAttribute('role', 'alert');
      var b = botao('Tentar de novo', 'ecp-primario', function () { location.reload(); });
      raiz.insertBefore(b, raiz.firstChild); raiz.insertBefore(e, raiz.firstChild);
    });
})();
