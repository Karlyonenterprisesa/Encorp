/* Enfermeiro Corporativo — interpretação do hemograma completo (ferramenta educativa).
   Usada na página /ferramentas/exames/hemograma-completo.html e na vista «hemograma» da app.
   Valores de referência indicativos: variam com o laboratório, o método, a idade e a altitude.
   Uso: ECHemograma.mount(document.getElementById('ec-hemograma')) */
(function () {
  'use strict';
  var GRUPOS = [['h', 'Homem adulto'], ['m', 'Mulher adulta'], ['c', 'Criança (2–12 anos)']];
  /* r = [min, max] por grupo; null = não interpretar nesse grupo */
  var P = [
    { id: 'hb', sigla: 'Hb', nome: 'Hemoglobina', un: 'g/dL', r: { h: [13.5, 17.5], m: [12, 15.5], c: [11.5, 15.5] },
      b: 'Anemia: pouca hemoglobina para transportar oxigénio. Pode causar cansaço, palidez e falta de ar.', a: 'Poliglobulia/hemoconcentração (ex.: desidratação, tabagismo, doença pulmonar crónica).',
      d: 'Proteína dos glóbulos vermelhos que transporta o oxigénio.' },
    { id: 'ht', sigla: 'Ht', nome: 'Hematócrito', un: '%', r: { h: [41, 53], m: [36, 46], c: [34, 44] },
      b: 'Acompanha a anemia ou perda de sangue.', a: 'Hemoconcentração (desidratação) ou excesso de glóbulos vermelhos.', d: 'Percentagem do volume do sangue ocupada pelos glóbulos vermelhos.' },
    { id: 'rbc', sigla: 'RBC / GV', nome: 'Eritrócitos (glóbulos vermelhos)', un: '×10¹²/L', r: { h: [4.5, 5.9], m: [4.1, 5.1], c: [4.0, 5.2] },
      b: 'Redução dos glóbulos vermelhos (anemia).', a: 'Aumento dos glóbulos vermelhos (policitemia, desidratação).', d: 'Número de glóbulos vermelhos por litro de sangue.' },
    { id: 'vcm', sigla: 'VCM / MCV', nome: 'Volume corpuscular médio', un: 'fL', r: { h: [80, 100], m: [80, 100], c: [77, 95] },
      b: 'Microcitose: típica da carência de ferro e da talassemia.', a: 'Macrocitose: carência de vitamina B12 ou folato, álcool, doença hepática, alguns fármacos.', d: 'Tamanho médio dos glóbulos vermelhos.' },
    { id: 'hcm', sigla: 'HCM / MCH', nome: 'Hemoglobina corpuscular média', un: 'pg', r: { h: [27, 33], m: [27, 33], c: [24, 30] },
      b: 'Hipocromia: glóbulos pobres em hemoglobina (ex.: falta de ferro).', a: 'Acompanha a macrocitose.', d: 'Quantidade média de hemoglobina em cada glóbulo vermelho.' },
    { id: 'chcm', sigla: 'CHCM / MCHC', nome: 'Concentração de hemoglobina corpuscular média', un: 'g/dL', r: { h: [32, 36], m: [32, 36], c: [32, 36] },
      b: 'Hipocromia (ex.: anemia ferropénica).', a: 'Raro; pode ser artefacto da amostra ou esferocitose.', d: 'Concentração de hemoglobina dentro dos glóbulos vermelhos.' },
    { id: 'rdw', sigla: 'RDW', nome: 'Amplitude de distribuição dos eritrócitos', un: '%', r: { h: [11.5, 14.5], m: [11.5, 14.5], c: [11.5, 14.5] },
      b: 'Sem significado clínico habitual.', a: 'Anisocitose: glóbulos de tamanhos muito diferentes (ex.: carências nutricionais mistas).', d: 'Mede a variação de tamanho dos glóbulos vermelhos.' },
    { id: 'wbc', sigla: 'WBC / GB', nome: 'Leucócitos (glóbulos brancos)', un: '×10⁹/L', r: { h: [4, 11], m: [4, 11], c: [5, 14.5] },
      b: 'Leucopenia: risco de infecção (ex.: vírus, fármacos, doença da medula).', a: 'Leucocitose: infecção, inflamação, stress, corticoides; valores muito altos exigem investigação.', d: 'Células de defesa do organismo.' },
    { id: 'neu', sigla: 'Neut', nome: 'Neutrófilos', un: '%', r: { h: [40, 70], m: [40, 70], c: null },
      b: 'Neutropenia: maior risco de infecção bacteriana grave.', a: 'Neutrofilia: sobretudo infecção bacteriana, inflamação ou stress.', d: 'Primeira linha de defesa contra bactérias.' },
    { id: 'lin', sigla: 'Linf', nome: 'Linfócitos', un: '%', r: { h: [20, 40], m: [20, 40], c: null },
      b: 'Linfopenia: imunossupressão, infecção grave, corticoides (ex.: pode ocorrer no VIH).', a: 'Linfocitose: infecções virais, algumas doenças do sangue.', d: 'Defesa contra vírus e memória imunitária.' },
    { id: 'mon', sigla: 'Mono', nome: 'Monócitos', un: '%', r: { h: [2, 8], m: [2, 8], c: null },
      b: 'Raramente relevante.', a: 'Infecções crónicas (ex.: tuberculose), recuperação de infecção, inflamação.', d: 'Células que “limpam” e apresentam antigénios.' },
    { id: 'eos', sigla: 'Eos', nome: 'Eosinófilos', un: '%', r: { h: [1, 4], m: [1, 4], c: null },
      b: 'Frequentemente sem significado.', a: 'Alergias, asma, parasitoses (ex.: helmintíases) e reacções a fármacos.', d: 'Associados a alergias e parasitas.' },
    { id: 'bas', sigla: 'Baso', nome: 'Basófilos', un: '%', r: { h: [0, 1], m: [0, 1], c: null },
      b: 'Sem significado clínico habitual.', a: 'Reacções alérgicas, algumas doenças mieloproliferativas.', d: 'Libertam histamina nas reacções alérgicas.' },
    { id: 'plt', sigla: 'PLT', nome: 'Plaquetas', un: '×10⁹/L', r: { h: [150, 450], m: [150, 450], c: [150, 450] },
      b: 'Trombocitopenia: risco de hemorragia (mais alto abaixo de 50; atenção a valores muito baixos).', a: 'Trombocitose: inflamação, carência de ferro, pós-esplenectomia, doenças mieloproliferativas.', d: 'Fragmentos celulares responsáveis pela coagulação.' },
    { id: 'vpm', sigla: 'VPM / MPV', nome: 'Volume plaquetário médio', un: 'fL', r: { h: [7.5, 11.5], m: [7.5, 11.5], c: [7.5, 11.5] },
      b: 'Plaquetas pequenas (ex.: menor produção na medula).', a: 'Plaquetas grandes (ex.: destruição periférica com produção aumentada).', d: 'Tamanho médio das plaquetas.' },
    { id: 'ret', sigla: 'Retic', nome: 'Reticulócitos', un: '%', r: { h: [0.5, 2.5], m: [0.5, 2.5], c: [0.5, 2.5] },
      b: 'Medula pouco activa (ex.: anemia por falta de produção).', a: 'Medula a responder a perda ou destruição de sangue (ex.: hemorragia, hemólise).', d: 'Glóbulos vermelhos jovens: mostram a resposta da medula.' }
  ];
  var CRIT = { hb: [7, null, 'Hb < 7 g/dL'], plt: [20, null, 'Plaquetas < 20 ×10⁹/L'], wbc: [2, 30, 'Leucócitos < 2 ou > 30 ×10⁹/L'] };

  var css = '.ech{font:15px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#0f2547;text-align:left}' +
    '.ech *{box-sizing:border-box}.ech h3{margin:18px 0 8px;color:#0b1a33;font-size:17px}' +
    '.ech .bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:8px 0}.ech select{padding:9px 10px;border:1px solid #AEBBD3;border-radius:10px;font-size:15px;background:#fff}' +
    '.ech .g{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}' +
    '.ech .f{background:#fff;border:1px solid #dfe6f0;border-left:4px solid #e8a317;border-radius:12px;padding:9px 10px}' +
    '.ech .f label{display:block;font-weight:700;font-size:13.5px;color:#0b1a33}.ech .f small{display:block;color:#5b6b85;font-size:12px}' +
    '.ech .f input{width:100%;margin-top:5px;padding:9px;font-size:16px;border:1px solid #AEBBD3;border-radius:8px}' +
    '.ech button{font:inherit;cursor:pointer;border:0;border-radius:10px;padding:10px 16px;font-weight:700}.ech .go{background:#f28c1c;color:#fff}.ech .rs{background:#fff1de;color:#0b1a33}' +
    '.ech table{width:100%;border-collapse:collapse;font-size:14px;background:#fff}.ech th,.ech td{border:1px solid #dfe6f0;padding:7px 8px;text-align:left;vertical-align:top}.ech th{background:#e7ecf4}' +
    '.ech .tw{overflow-x:auto}.ech .tag{display:inline-block;border-radius:99px;padding:2px 9px;font-size:12px;font-weight:800;white-space:nowrap}' +
    '.ech .n{background:#DDF3E4;color:#0F5B2A}.ech .l{background:#FFE9C7;color:#7A4A00}.ech .a{background:#FBD5D9;color:#8A0012}' +
    '.ech .box{margin:12px 0;padding:11px 12px;border-radius:12px;background:#e7ecf4;border:1px solid #dfe6f0}.ech .crit{background:#FBE4E8;border-color:#c8202f;color:#6B0010}' +
    '.ech ul{margin:6px 0 6px 18px;padding:0}.ech .msg{color:#8A0012;font-weight:700;min-height:1.2em}';

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function num(v) { v = String(v == null ? '' : v).trim().replace(',', '.'); if (v === '') return null; var n = Number(v); return isFinite(n) ? n : NaN; }
  function fmt(r) { return r ? String(r[0]).replace('.', ',') + '–' + String(r[1]).replace('.', ',') : '—'; }

  /* núcleo (testável): devolve linhas, alertas e padrões a partir dos valores */
  function interpretar(grupo, vals) {
    var rows = [], v = {}, alertas = [], padroes = [];
    P.forEach(function (p) {
      var x = vals[p.id]; v[p.id] = x;
      if (x == null || isNaN(x)) return;
      var r = p.r[grupo], st = 'n';
      if (r) st = x < r[0] ? 'b' : x > r[1] ? 'a' : 'n';
      rows.push({ p: p, x: x, r: r, st: st });
    });
    rows.forEach(function (o) {
      var c = CRIT[o.p.id];
      if (c && ((c[0] != null && o.x < c[0]) || (c[1] != null && o.x > c[1]))) alertas.push(c[2] + ' (valor introduzido: ' + String(o.x).replace('.', ',') + ')');
    });
    var st = function (id) { var o = rows.filter(function (q) { return q.p.id === id; })[0]; return o ? o.st : null; };
    var hb = st('hb'), vcm = v.vcm;
    if (hb === 'b') {
      var t = 'Hemoglobina baixa (anemia). ';
      if (vcm != null && !isNaN(vcm)) {
        var lim = grupo === 'c' ? [77, 95] : [80, 100];
        t += vcm < lim[0] ? 'Com VCM baixo (microcítica): pensar em carência de ferro, talassemia ou doença crónica.' : vcm > lim[1] ? 'Com VCM alto (macrocítica): pensar em carência de B12/folato, álcool, doença hepática ou fármacos.' : 'Com VCM normal (normocítica): pensar em perda aguda de sangue, doença crónica, doença renal ou hemólise.';
      } else t += 'Introduza o VCM para classificar o tipo de anemia.';
      padroes.push(t);
    }
    if (hb === 'a') padroes.push('Hemoglobina alta: confirmar hidratação do doente; considerar hemoconcentração ou policitemia.');
    var w = st('wbc'), neu = st('neu');
    if (w === 'a' && neu === 'a') padroes.push('Leucocitose com neutrofilia: sugere infecção bacteriana, inflamação ou stress; correlacionar com febre e clínica.');
    if (w === 'b' && neu === 'b') padroes.push('Leucopenia com neutropenia: risco aumentado de infecção; vigiar sinais de infecção e cumprir precauções.');
    if (st('eos') === 'a') padroes.push('Eosinofilia: considerar alergia/asma, parasitose ou reacção a fármacos.');
    if (st('lin') === 'a') padroes.push('Linfocitose: frequente em infecções virais.');
    if (hb === 'b' && w === 'b' && st('plt') === 'b') padroes.push('Redução das três séries (pancitopenia): requer avaliação médica urgente.');
    if (st('plt') === 'b') padroes.push('Plaquetas baixas: vigilância de hemorragias (gengivas, nariz, petéquias, fezes escuras); evitar injecções intramusculares e traumatismos.');
    if (st('plt') === 'a') padroes.push('Plaquetas altas: pode ser reactivo (inflamação, carência de ferro) ou primário; correlacionar com a clínica.');
    return { rows: rows, alertas: alertas, padroes: padroes };
  }

  function mount(el) {
    if (!el) return;
    if (!document.getElementById('echCss')) { var s = document.createElement('style'); s.id = 'echCss'; s.textContent = css; document.head.appendChild(s); }
    var g = '<div class="ech"><div class="bar"><label for="ech-g"><b>Doente:</b></label><select id="ech-g">' +
      GRUPOS.map(function (x) { return '<option value="' + x[0] + '">' + x[1] + '</option>'; }).join('') + '</select></div><div class="g" id="ech-in"></div>' +
      '<div class="bar"><button type="button" class="go" id="ech-go">Interpretar</button><button type="button" class="rs" id="ech-rs">Limpar</button></div>' +
      '<p class="msg" id="ech-msg" role="status" aria-live="polite"></p><div id="ech-out"></div>' +
      '<h3>Siglas, parâmetros e significado</h3><div class="tw"><table><tr><th>Sigla</th><th>Parâmetro</th><th>O que é</th><th>Unidade</th></tr>' +
      P.map(function (p) { return '<tr><td><b>' + esc(p.sigla) + '</b></td><td>' + esc(p.nome) + '</td><td>' + esc(p.d) + '</td><td>' + esc(p.un) + '</td></tr>'; }).join('') + '</table></div>' +
      '<p class="box">Valores de referência indicativos para adultos e crianças; podem variar com o laboratório, o método, a idade, a gravidez e a altitude. Use sempre os intervalos impressos no relatório do laboratório. Ferramenta educativa: não substitui a avaliação clínica nem o diagnóstico médico.</p></div>';
    el.innerHTML = g;
    var sel = el.querySelector('#ech-g'), inn = el.querySelector('#ech-in'), out = el.querySelector('#ech-out'), msg = el.querySelector('#ech-msg');
    function campos() {
      var gr = sel.value;
      inn.innerHTML = P.map(function (p) {
        var off = !p.r[gr];
        return '<div class="f"><label for="ech-' + p.id + '">' + esc(p.sigla) + ' — ' + esc(p.nome) + '</label><small>Ref.: ' + fmt(p.r[gr]) + ' ' + esc(p.un) + (off ? ' (varia com a idade)' : '') + '</small>' +
          '<input id="ech-' + p.id + '" inputmode="decimal" autocomplete="off" aria-label="' + esc(p.nome) + ' em ' + esc(p.un) + '"></div>';
      }).join('');
      out.innerHTML = ''; msg.textContent = '';
    }
    function calc() {
      var vals = {}, bad = false, any = false;
      P.forEach(function (p) { var n = num(el.querySelector('#ech-' + p.id).value); if (n != null) { any = true; if (isNaN(n) || n < 0) bad = true; } vals[p.id] = n; });
      if (bad) { msg.textContent = 'Há valores inválidos. Use apenas números positivos (ex.: 13,5).'; out.innerHTML = ''; return; }
      if (!any) { msg.textContent = 'Introduza pelo menos um valor.'; out.innerHTML = ''; return; }
      msg.textContent = '';
      var gr = sel.value, res = interpretar(gr, vals), h = '';
      if (res.alertas.length) h += '<div class="box crit"><b>Valor crítico:</b> comunique de imediato ao médico/enfermeiro responsável, segundo o protocolo do serviço.<ul>' + res.alertas.map(function (a) { return '<li>' + esc(a) + '</li>'; }).join('') + '</ul></div>';
      h += '<div class="tw"><table><tr><th>Parâmetro</th><th>Valor</th><th>Referência</th><th>Estado</th><th>O que pode significar</th></tr>' + res.rows.map(function (o) {
        var tag = !o.r ? '<span class="tag n">sem ref.</span>' : o.st === 'n' ? '<span class="tag n">Normal</span>' : o.st === 'b' ? '<span class="tag l">Baixo</span>' : '<span class="tag a">Alto</span>';
        var ex = !o.r ? 'Interprete segundo a idade.' : o.st === 'n' ? 'Dentro do intervalo de referência.' : o.st === 'b' ? o.p.b : o.p.a;
        return '<tr><td><b>' + esc(o.p.sigla) + '</b><br><small>' + esc(o.p.nome) + '</small></td><td>' + String(o.x).replace('.', ',') + ' ' + esc(o.p.un) + '</td><td>' + fmt(o.r) + '</td><td>' + tag + '</td><td>' + esc(ex) + '</td></tr>';
      }).join('') + '</table></div>';
      if (res.padroes.length) h += '<h3>Padrões a considerar</h3><div class="box"><ul>' + res.padroes.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul></div>';
      out.innerHTML = h;
    }
    sel.addEventListener('change', campos);
    el.querySelector('#ech-go').addEventListener('click', calc);
    el.querySelector('#ech-rs').addEventListener('click', campos);
    inn.addEventListener('keydown', function (e) { if (e.key === 'Enter') calc(); });
    campos();
  }
  window.ECHemograma = { mount: mount, interpretar: interpretar, parametros: P };
})();
