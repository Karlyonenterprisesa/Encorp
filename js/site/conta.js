/* Conta do estudante: registo (identificador, utilizador e código atribuídos pelo servidor), entrada e saída.
   Nada de credenciais fica no navegador: a sessão é um cookie HttpOnly gerido pelo servidor. */
(function () {
  'use strict';
  function api(metodo, corpo) {
    var o = { method: metodo, credentials: 'same-origin', headers: {} };
    if (corpo) { o.headers['Content-Type'] = 'application/json'; o.headers['X-EC-Req'] = '1'; o.body = JSON.stringify(corpo); }
    return fetch('/api/aluno', o).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { j._st = r.status; return j; }); })
      .catch(function () { return { erro: 'Sem ligação. Verifique a internet e tente novamente.', _st: 0 }; });
  }
  function el(t, c, txt) { var e = document.createElement(t); if (c) e.className = c; if (txt != null) e.textContent = txt; return e; }
  function campo(rotulo, id, tipo, extra) {
    var w = el('div', 'ec-f'), l = el('label', '', rotulo); l.setAttribute('for', id);
    var i = el('input'); i.id = id; i.type = tipo; i.required = true; if (extra) Object.keys(extra).forEach(function (k) { i.setAttribute(k, extra[k]); });
    w.appendChild(l); w.appendChild(i); return { w: w, i: i };
  }

  function render(box, aoEntrar) {
    box.innerHTML = '';
    var cx = el('div', 'ec-conta'), msg = el('p', 'ec-msg'); msg.setAttribute('role', 'alert');
    var tabs = el('div', 'ec-tabs'), bE = el('button', 'on', 'Já tenho conta'), bR = el('button', '', 'Criar conta');
    bE.type = bR.type = 'button'; tabs.appendChild(bE); tabs.appendChild(bR);
    var fE = el('form'), fR = el('form'); fR.hidden = true; fE.noValidate = fR.noValidate = false;

    var u = campo('Nome de utilizador', 'ec-u', 'text', { autocomplete: 'username', autocapitalize: 'none', maxlength: '40' });
    var c = campo('Código de acesso (4 dígitos)', 'ec-c', 'password', { inputmode: 'numeric', pattern: '\\d{4}', maxlength: '4', autocomplete: 'current-password' });
    var sE = el('button', 'btn', 'Entrar'); sE.type = 'submit'; fE.appendChild(u.w); fE.appendChild(c.w); fE.appendChild(sE);

    var n = campo('O seu nome', 'ec-n', 'text', { autocomplete: 'name', minlength: '2', maxlength: '60' });
    var aviso = el('p', 'meta', 'Ao criar a conta recebe um número de estudante, um nome de utilizador e um código de 4 dígitos. O código só aparece uma vez.');
    var sR = el('button', 'btn', 'Criar conta'); sR.type = 'submit'; fR.appendChild(n.w); fR.appendChild(aviso); fR.appendChild(sR);

    function mostra(r) { bE.className = r ? 'on' : ''; bR.className = r ? '' : 'on'; fE.hidden = r; fR.hidden = !r; msg.textContent = ''; }
    bE.onclick = function () { mostra(false); }; bR.onclick = function () { mostra(true); };

    fE.onsubmit = function (ev) {
      ev.preventDefault(); sE.disabled = true; msg.textContent = '';
      api('POST', { acao: 'entrar', utilizador: u.i.value, codigo: c.i.value }).then(function (j) {
        sE.disabled = false;
        if (j._st === 200) { c.i.value = ''; aoEntrar(j); } else msg.textContent = j.erro || 'Não foi possível entrar.';
      });
    };
    fR.onsubmit = function (ev) {
      ev.preventDefault(); sR.disabled = true; msg.textContent = '';
      api('POST', { acao: 'registar', nome: n.i.value }).then(function (j) {
        sR.disabled = false;
        if (j._st !== 201) { msg.textContent = j.erro || 'Não foi possível criar a conta.'; return; }
        cx.innerHTML = '';
        var h = el('h3', '', 'Conta criada. Guarde estes dados agora'), dl = el('dl', 'ec-cred');
        [['Número de estudante', j.numero], ['Nome de utilizador', j.utilizador], ['Código de acesso', j.codigo]].forEach(function (p) { dl.appendChild(el('dt', '', p[0])); dl.appendChild(el('dd', '', p[1])); });
        var w = el('p', 'ec-msg', j.aviso), cp = el('button', 'btn alt', 'Copiar dados'), ok = el('label', 'ec-ok'), ck = el('input'), go = el('button', 'btn', 'Continuar');
        cp.type = 'button'; go.type = 'button'; go.disabled = true; ck.type = 'checkbox'; ok.appendChild(ck); ok.appendChild(document.createTextNode(' Já guardei o número, o utilizador e o código.'));
        ck.onchange = function () { go.disabled = !ck.checked; };
        cp.onclick = function () { var t = 'ENCORP — Estudante ' + j.numero + '\nUtilizador: ' + j.utilizador + '\nCódigo: ' + j.codigo; (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { cp.textContent = 'Copiado'; }, function () { cp.textContent = 'Copie manualmente'; }); };
        go.onclick = function () { aoEntrar(j); };
        [h, dl, w, cp, ok, go].forEach(function (x) { cx.appendChild(x); });
      });
    };
    cx.appendChild(tabs); cx.appendChild(fE); cx.appendChild(fR); cx.appendChild(msg); box.appendChild(cx);
  }
  window.ECConta = { api: api, render: render, eu: function () { return api('GET'); }, sair: function () { return api('POST', { acao: 'sair' }); }, el: el };
})();
