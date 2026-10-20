// === aprendizagem.js ===
// ===== aprendizagem.html (Modo Estudante) =====
// Usa os dados de CASOS_ESTUDO, QUIZ_FUNDAMENTOS e FLASHCARDS definidos em data-casos-estudo.js

(function(){
  const div = document.createElement('div');
  div.className = 'view';
  div.id = 'view-aprendizagem';
  div.innerHTML = `
    <div style="padding:10px 12px 0;">
      <button class="back-btn" style="background:rgba(11,26,51,.08);color:var(--azul-escuro);" onclick="showView('home')">‹ Início</button>
    </div>
    <div class="section-title" style="margin-top:14px;">Aprender</div>
    <div style="margin:0 12px 4px;font-size:12px;color:var(--texto-suave);">20 casos clínicos completos, 22 testes (20 temáticos + Fundamentos + Completo), flashcards e simulação clínica passo-a-passo, para consolidar os conteúdos de enfermagem.</div>

    <div class="study-tabs">
      <button class="study-tab active" data-tab="casos" onclick="switchStudyTab('casos')">Casos Clínicos</button>
      <button class="study-tab" data-tab="testes" onclick="switchStudyTab('testes')">Testes</button>
      <button class="study-tab" data-tab="flash" onclick="switchStudyTab('flash')">Flashcards</button>
      <button class="study-tab" data-tab="sim" onclick="switchStudyTab('sim')">Simulação</button>
    </div>

    <!-- Casos Clínicos -->
    <div class="study-pane active" id="pane-casos">
      <div style="margin:0 4px 8px;font-size:11.5px;color:var(--texto-suave);">Leia a apresentação, pense no diagnóstico prioritário e depois toque em "Ver raciocínio e análise completa" para conferir.</div>
      <div class="search-mini">
        <input type="text" placeholder="Pesquisar casos clínicos..." oninput="filterCasosEstudo(this.value)">
      </div>
      <div id="casosEstudoList"></div>
    </div>

    <!-- Testes -->
    <div class="study-pane" id="pane-testes">
      <div style="margin:0 4px 8px;font-size:11.5px;color:var(--texto-suave);">Escolha um teste temático (ligado a um dos 20 casos), o teste de fundamentos, ou o teste completo com todas as perguntas.</div>
      <div class="study-tabs" id="testeSelector" style="margin:0 0 10px;"></div>
      <div id="testeTitulo" style="margin:0 4px 8px;font-size:13px;font-weight:800;color:var(--azul-escuro);"></div>
      <div id="quizContainer"></div>
      <div class="calc-actions" style="margin:0 4px 10px;">
        <button class="calc-btn" onclick="corrigirQuiz()">Corrigir teste</button>
        <button class="calc-btn ghost" onclick="reiniciarQuiz()">Repetir</button>
      </div>
      <div class="quiz-score" id="quizScore"></div>
    </div>

    <!-- Flashcards -->
    <div class="study-pane" id="pane-flash">
      <div style="margin:0 4px 10px;font-size:11.5px;color:var(--texto-suave);">Toque no cartão para ver a resposta.</div>
      <div class="flash-grid" id="flashGrid"></div>
    </div>

    <!-- Simulação -->
    <div class="study-pane" id="pane-sim">
      <div id="simIntro">
        <div class="acc open">
          <div class="acc-head" style="cursor:default;"><div class="a-icon" style="background:#e7ecf4;color:var(--azul-escuro);">${ICON_PROC}</div><div class="a-txt"><div class="a-title">Simulação clínica</div><div class="a-sub">Escolha um caso para simular o processo de enfermagem completo</div></div></div>
          <div class="acc-body" style="max-height:2000px;"><div class="acc-in">
            <p>Percorra a <b>Avaliação → Diagnóstico → Intervenções (NIC) → Resultados (NOC)</b> de um caso clínico real, com feedback imediato em cada etapa.</p>
            <div class="search-mini" style="margin:10px 0;">
              <select id="simCasoSelect" style="width:100%;padding:11px 12px;border-radius:10px;border:1px solid var(--borda);font-size:13px;background:#fff;color:var(--texto);"></select>
            </div>
            <div class="calc-actions">
              <button class="calc-btn" onclick="simIniciar()">Iniciar simulação</button>
            </div>
          </div></div>
        </div>
      </div>
      <div id="simRunner"></div>
    </div>
  `;
  document.getElementById('app').insertBefore(div, document.querySelector('.bottom-fixed'));
})();

function switchStudyTab(tab){
  document.querySelectorAll('.study-tab').forEach(t=>{ if(t.parentElement.id!=='testeSelector') t.classList.toggle('active', t.dataset.tab===tab); });
  document.querySelectorAll('.study-pane').forEach(p=>p.classList.toggle('active', p.id==='pane-'+tab));
}

const ICONS_MAP = { ICON_SCALE, ICON_PROC, ICON_EXAM, ICON_ALERT };

// ===================== CASOS CLÍNICOS (20, interactivos) =====================
function renderCasosEstudo(){
  const el = document.getElementById('casosEstudoList');
  if(!el) return;
  el.innerHTML = CASOS_ESTUDO.map((c, i) => `
    <div class="acc" id="casoEstudo-${i}">
      <div class="acc-head" onclick="this.parentElement.classList.toggle('open')">
        <div class="a-icon" style="background:${c.bg};color:${c.fg};">${ICONS_MAP[c.icon]}</div>
        <div class="a-txt"><div class="a-title">${c.titulo}</div><div class="a-sub">${c.area} · ${c.idade}</div></div>
        <div class="a-chev">▾</div>
      </div>
      <div class="acc-body"><div class="acc-in">
        <p>${c.apresentacao}</p>
        <button class="case-toggle" onclick="this.nextElementSibling.classList.toggle('show')">Ver raciocínio e análise completa</button>
        <div class="case-answer">
          <p>${c.raciocinio}</p>
          <b style="display:block;margin-top:8px;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem</b>
          <ul style="font-size:12.5px;margin:6px 0 10px;">${c.diagnosticos.map(d=>`<li>${d}</li>`).join('')}</ul>
          <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
          <ul style="font-size:12.5px;margin:6px 0 10px;">${c.nic.map(k=>`<li>${k}</li>`).join('')}</ul>
          <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
          <ul style="font-size:12.5px;margin:6px 0 0;">${c.noc.map(n=>`<li>${n}</li>`).join('')}</ul>
        </div>
      </div></div>
    </div>`).join('');
}
function filterCasosEstudo(term){
  term = (term||'').trim().toLowerCase();
  document.querySelectorAll('#casosEstudoList .acc').forEach(acc=>{
    const text = _norm(acc.textContent);
    acc.style.display = (!term || text.includes(_norm(term))) ? '' : 'none';
  });
}

// ===================== TESTES (21: Fundamentos + 20 temáticos + Completo) =====================
const TESTES_MENU = [
  { id:'fund', label:'Fundamentos', perguntas: QUIZ_FUNDAMENTOS },
  ...CASOS_ESTUDO.map(c => ({ id:c.id, label:c.id, tituloLongo: c.titulo, perguntas: c.perguntas })),
  { id:'completo', label:'Completo', perguntas: QUIZ_FUNDAMENTOS.concat(...CASOS_ESTUDO.map(c=>c.perguntas)) }
];
let TESTE_ACTIVO = 'fund';
let QUIZ_PERGUNTAS = TESTES_MENU[0].perguntas;

function renderTesteSelector(){
  const el = document.getElementById('testeSelector');
  if(!el) return;
  el.innerHTML = TESTES_MENU.map(t => `<button class="study-tab${t.id===TESTE_ACTIVO?' active':''}" onclick="escolherTeste('${t.id}')">${t.label}</button>`).join('');
}
function escolherTeste(id){
  TESTE_ACTIVO = id;
  const t = TESTES_MENU.find(x=>x.id===id);
  QUIZ_PERGUNTAS = t.perguntas;
  document.getElementById('testeTitulo').textContent = (t.tituloLongo ? t.tituloLongo : (id==='fund' ? 'Teste de Fundamentos (' + t.perguntas.length + ' perguntas)' : 'Teste Completo — todas as perguntas (' + t.perguntas.length + ' perguntas)'));
  renderTesteSelector();
  renderQuiz();
}
function renderQuiz(){
  const el = document.getElementById('quizContainer');
  if(!el) return;
  el.innerHTML = QUIZ_PERGUNTAS.map((item, i) => `
    <div class="quiz-q" id="quizQ-${i}">
      <div class="qn">${i+1}. ${item.q}</div>
      ${item.opts.map((op, j) => `
        <label class="quiz-opt" id="quizOpt-${i}-${j}">
          <input type="radio" name="quiz-${i}" value="${j}"> ${op}
        </label>`).join('')}
    </div>`).join('');
  document.getElementById('quizScore').classList.remove('show');
}
function corrigirQuiz(){
  let acertos = 0;
  QUIZ_PERGUNTAS.forEach((item, i) => {
    const sel = document.querySelector('input[name="quiz-' + i + '"]:checked');
    const val = sel ? parseInt(sel.value) : -1;
    item.opts.forEach((op, j) => {
      const optEl = document.getElementById('quizOpt-' + i + '-' + j);
      optEl.classList.remove('correct','wrong');
      if(j === item.correta) optEl.classList.add('correct');
      else if(j === val) optEl.classList.add('wrong');
    });
    if(val === item.correta) acertos++;
  });
  const score = document.getElementById('quizScore');
  score.textContent = 'Resultado: ' + acertos + ' / ' + QUIZ_PERGUNTAS.length + ' correctas';
  score.classList.add('show');
}
function reiniciarQuiz(){ renderQuiz(); }

// ===================== FLASHCARDS =====================
function renderFlash(){
  const grid = document.getElementById('flashGrid');
  if(!grid) return;
  grid.innerHTML = FLASHCARDS.map((c,i) => `
    <div class="flash-card" onclick="this.classList.toggle('flip')">
      <div class="flash-inner">
        <div class="flash-face flash-front">${c.f}</div>
        <div class="flash-face flash-back">${c.v}</div>
      </div>
    </div>`).join('');
}

// ===================== SIMULAÇÃO CLÍNICA PASSO-A-PASSO =====================
const SIM = { casoIdx:0, step:0, acertos:0, respondida:false, escolhida:-1 };

function renderSimSelect(){
  const sel = document.getElementById('simCasoSelect');
  if(!sel) return;
  sel.innerHTML = CASOS_ESTUDO.map((c,i)=>`<option value="${i}">${c.titulo}</option>`).join('');
}
function simIniciar(){
  SIM.casoIdx = parseInt(document.getElementById('simCasoSelect').value);
  SIM.step = 0;
  SIM.acertos = 0;
  document.getElementById('simIntro').style.display = 'none';
  simRenderStep();
}
const SIM_ROTULOS = ['Diagnóstico de Enfermagem','Intervenção de Enfermagem (NIC)','Resultado Esperado (NOC)'];
function simRenderStep(){
  const caso = CASOS_ESTUDO[SIM.casoIdx];
  const runner = document.getElementById('simRunner');
  SIM.respondida = false;
  SIM.escolhida = -1;

  if(SIM.step >= 3){
    runner.innerHTML = `
      <div class="acc open">
        <div class="acc-head" style="cursor:default;"><div class="a-icon" style="background:${caso.bg};color:${caso.fg};">${ICONS_MAP[caso.icon]}</div><div class="a-txt"><div class="a-title">${caso.titulo}</div><div class="a-sub">Simulação concluída</div></div></div>
        <div class="acc-body" style="max-height:3000px;"><div class="acc-in">
          <div class="quiz-score show" style="margin:0 0 12px;">Resultado da simulação: ${SIM.acertos} / 3 etapas correctas</div>
          <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem (caso completo)</b>
          <ul style="font-size:12.5px;margin:6px 0 10px;">${caso.diagnosticos.map(d=>`<li>${d}</li>`).join('')}</ul>
          <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
          <ul style="font-size:12.5px;margin:6px 0 10px;">${caso.nic.map(k=>`<li>${k}</li>`).join('')}</ul>
          <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
          <ul style="font-size:12.5px;margin:6px 0 0;">${caso.noc.map(n=>`<li>${n}</li>`).join('')}</ul>
          <div class="calc-actions" style="margin-top:14px;">
            <button class="calc-btn" onclick="simVoltarSelecao()">Simular outro caso</button>
            <button class="calc-btn ghost" onclick="simIniciar()">Repetir este caso</button>
          </div>
        </div></div>
      </div>`;
    return;
  }

  const pergunta = caso.perguntas[SIM.step];
  runner.innerHTML = `
    <div class="acc open">
      <div class="acc-head" style="cursor:default;"><div class="a-icon" style="background:${caso.bg};color:${caso.fg};">${ICONS_MAP[caso.icon]}</div><div class="a-txt"><div class="a-title">${caso.titulo}</div><div class="a-sub">Etapa ${SIM.step+1}/3 · ${SIM_ROTULOS[SIM.step]}</div></div></div>
      <div class="acc-body" style="max-height:3000px;"><div class="acc-in">
        <div class="info-box"><b>Avaliação (dados do doente):</b><br>${caso.apresentacao}</div>
        <div class="quiz-q" style="margin-top:10px;">
          <div class="qn">${pergunta.q}</div>
          ${pergunta.opts.map((op,j)=>`<label class="quiz-opt" id="simOpt-${j}" onclick="simResponder(${j})"><input type="radio" name="sim-op" value="${j}"> ${op}</label>`).join('')}
        </div>
        <div id="simFeedback"></div>
        <div class="calc-actions" style="margin-top:10px;">
          <button class="calc-btn" id="simSeguinteBtn" onclick="simSeguinte()" disabled>Seguinte</button>
        </div>
      </div></div>
    </div>`;
}
function simResponder(j){
  if(SIM.respondida) return;
  SIM.respondida = true;
  SIM.escolhida = j;
  const caso = CASOS_ESTUDO[SIM.casoIdx];
  const pergunta = caso.perguntas[SIM.step];
  pergunta.opts.forEach((op,k)=>{
    const el = document.getElementById('simOpt-'+k);
    if(k===pergunta.correta) el.classList.add('correct');
    else if(k===j) el.classList.add('wrong');
  });
  const acertou = (j === pergunta.correta);
  if(acertou) SIM.acertos++;
  const fb = document.getElementById('simFeedback');
  fb.innerHTML = `<div class="case-answer show" style="margin-top:10px;">${acertou ? '<b>Correcto.</b> ' : '<b>Não é a melhor opção.</b> '}${SIM.step===0 ? caso.raciocinio : 'Reveja o caso completo no final da simulação para consolidar NOC e NIC.'}</div>`;
  document.getElementById('simSeguinteBtn').disabled = false;
}
function simSeguinte(){
  SIM.step++;
  simRenderStep();
}
function simVoltarSelecao(){
  document.getElementById('simRunner').innerHTML = '';
  document.getElementById('simIntro').style.display = '';
}

renderCasosEstudo();
renderTesteSelector();
document.getElementById('testeTitulo').textContent = 'Teste de Fundamentos (' + QUIZ_PERGUNTAS.length + ' perguntas)';
renderQuiz();
renderFlash();
renderSimSelect();


