/* Página /conta/: entrar, criar conta, ver o número de estudante e sair. */
(function () {
  var box = document.getElementById('ec-conta-pag'); if (!box || !window.ECConta) return;
  var el = ECConta.el;
  function mostra() {
    ECConta.eu().then(function (j) {
      box.innerHTML = '';
      if (j.utilizador) {
        var f = el('div', 'ec-user'); f.appendChild(el('span', '', 'Estudante ' + j.numero + ' · ' + j.utilizador + ' · ' + j.nome));
        var s = el('button', 'btn alt', 'Sair'); s.type = 'button'; s.onclick = function () { ECConta.sair().then(mostra); }; f.appendChild(s); box.appendChild(f);
        var p = el('p', '', 'A sua sessão está activa. Abra um curso para continuar a estudar: o progresso e os resultados dos testes ficam guardados na sua conta.');
        var a = el('a', 'btn', 'Ver cursos'); a.href = '/cursos/'; box.appendChild(p); box.appendChild(a);
      } else if (j.configurado === false) {
        box.appendChild(el('p', 'ec-msg', 'As contas de estudante ainda não estão activas neste site.'));
      } else ECConta.render(box, mostra);
    });
  }
  mostra();
})();
