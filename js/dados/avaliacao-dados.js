// === data-avaliacao.js ===
// ===== dados/construção — avaliacao.html =====

buildAccordionView('avaliacao', 'Avaliação e Exame Físico', '1ª etapa do Processo de Enfermagem: colheita de dados, avaliação primária (ABCDE) e exame físico.', [
{
  icon: ICON_ALERT, bg:'#fbe4e8', fg:'#c8202f',
  title:'Avaliação Primária — ABCDE',
  sub:'Abordagem sistemática ao doente crítico ou instável',
  body:`
  <div class="abcde-step"><div class="abcde-letter">A</div><div class="abcde-body"><b>Airway — Via aérea</b><p>Verificar permeabilidade da via aérea. Procurar obstrução (corpo estranho, secreções, edema, queda da língua). Considerar posicionamento, aspiração ou via aérea adjuvante se necessário.</p></div></div>
  <div class="abcde-step"><div class="abcde-letter">B</div><div class="abcde-body"><b>Breathing — Respiração</b><p>Avaliar frequência, ritmo e esforço respiratório, simetria torácica, ausculta pulmonar e SpO₂. Administrar oxigénio suplementar conforme necessidade.</p></div></div>
  <div class="abcde-step"><div class="abcde-letter">C</div><div class="abcde-body"><b>Circulation — Circulação</b><p>Avaliar pulso, frequência cardíaca, tensão arterial, perfusão periférica, tempo de preenchimento capilar e sinais de hemorragia. Garantir acesso venoso se indicado.</p></div></div>
  <div class="abcde-step"><div class="abcde-letter">D</div><div class="abcde-body"><b>Disability — Estado neurológico</b><p>Avaliar nível de consciência (AVPU ou Glasgow), pupilas (tamanho, simetria, reactividade) e glicemia capilar.</p></div></div>
  <div class="abcde-step"><div class="abcde-letter">E</div><div class="abcde-body"><b>Exposure — Exposição</b><p>Expor o doente para inspecção completa (lesões, hemorragias, exantemas), respeitando a privacidade e prevenindo a hipotermia.</p></div></div>
  <div class="alert-box">Reavaliar a sequência ABCDE sempre que houver alteração do estado do doente — é uma abordagem cíclica, não apenas linear.</div>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'var(--azul)',
  title:'Colheita de Dados / Anamnese',
  sub:'Entrevista e história de saúde',
  body:`
  <h4>Componentes da história de saúde</h4>
  <ul>
    <li><b>Identificação:</b> nome, idade, sexo, profissão, estado civil</li>
    <li><b>Queixa principal:</b> motivo da procura de cuidados, nas palavras do doente</li>
    <li><b>História da doença actual (HDA):</b> início, duração, localização, intensidade, factores de alívio/agravamento</li>
    <li><b>Antecedentes pessoais:</b> doenças prévias, cirurgias, internamentos, gravidez/parto</li>
    <li><b>Antecedentes familiares:</b> doenças hereditárias/crónicas na família</li>
    <li><b>Hábitos:</b> alimentação, sono, actividade física, tabaco, álcool, outras substâncias</li>
    <li><b>Alergias:</b> medicamentosas, alimentares, ambientais — e tipo de reacção</li>
    <li><b>Medicação habitual:</b> fármacos, doses e adesão terapêutica</li>
  </ul>
  <h4>Boas práticas de entrevista</h4>
  <ul><li>Utilizar escuta activa e perguntas abertas</li><li>Garantir privacidade e ambiente sem interrupções</li><li>Validar a informação obtida junto de familiares/registos quando possível</li></ul>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'#000000',
  title:'Exame Físico Geral',
  sub:'Técnicas de exame: inspecção, palpação, percussão, ausculta',
  body:`
  <table class="ref-table">
    <tr><th>Técnica</th><th>Descrição</th></tr>
    <tr><td>Inspecção</td><td>Observação visual sistemática de aspecto geral, pele, simetria, marcha, postura</td></tr>
    <tr><td>Palpação</td><td>Uso do tacto para avaliar temperatura, textura, massas, sensibilidade, pulsos</td></tr>
    <tr><td>Percussão</td><td>Toque sobre a superfície corporal para avaliar som (maciço, timpânico, claro pulmonar)</td></tr>
    <tr><td>Ausculta</td><td>Uso do estetoscópio para avaliar sons cardíacos, pulmonares e intestinais</td></tr>
  </table>
  <div class="info-box">Ordem geral: inspecção → palpação → percussão → ausculta. Excepção: no abdómen, a ausculta é feita antes da palpação/percussão para não alterar os ruídos intestinais.</div>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'#000000',
  title:'Exame Físico por Sistemas',
  sub:'Guia rápido de avaliação',
  body:`
  <h4>Respiratório</h4><p>Frequência e padrão respiratório, simetria torácica, ausculta pulmonar (murmúrio vesicular, ruídos adventícios), SpO₂.</p>
  <h4>Cardiovascular</h4><p>Frequência e ritmo cardíaco, tensão arterial, pulsos periféricos, tempo de preenchimento capilar, edemas.</p>
  <h4>Neurológico</h4><p>Nível de consciência, orientação, pupilas, força e sensibilidade dos membros, linguagem.</p>
  <h4>Abdominal / Gastrointestinal</h4><p>Inspecção, ausculta de ruídos hidroaéreos, palpação de dor/massas, hábitos intestinais.</p>
  <h4>Tegumentar</h4><p>Cor, turgor, integridade da pele, presença de lesões, feridas ou sinais de pressão.</p>
  <h4>Musculoesquelético</h4><p>Amplitude de movimento, força muscular, deformidades, dor articular.</p>
  <h4>Génito-urinário</h4><p>Padrão miccional, características da urina, dor à micção, higiene íntima.</p>`
},
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'var(--azul-escuro)',
  title:'Sinais Vitais — Valores de Referência (Adulto)',
  sub:'Incluindo a dor como 5º sinal vital',
  body:`
  <img class="zoomable-img" src="img/bf98e0744d.webp" alt="Locais de palpação de pulsos periféricos" style="width:100%;max-width:220px;margin:4px auto 10px;" onclick="openLightbox('img-pulsos.jpg','Locais de palpação de pulsos periféricos','pulsos.jpg')">
  <div class="img-caption">Locais de palpação de pulsos periféricos</div>
  <table class="ref-table">
    <tr><th>Parâmetro</th><th>Valor de referência</th></tr>
    <tr><td>Frequência cardíaca</td><td>60–100 bpm</td></tr>
    <tr><td>Frequência respiratória</td><td>12–20 rpm</td></tr>
    <tr><td>Tensão arterial</td><td>90/60 – 120/80 mmHg</td></tr>
    <tr><td>Temperatura corporal (axilar)</td><td>36,0–37,2 °C</td></tr>
    <tr><td>SpO₂</td><td>95–100%</td></tr>
    <tr><td>Dor (EVA)</td><td>0/10 (idealmente)</td></tr>
  </table>
  <div class="info-box">A dor é considerada o "5º sinal vital" e deve ser avaliada e registada com a mesma regularidade que os restantes parâmetros.</div>`
},
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'#000000',
  title:'Dados Subjectivos vs. Objectivos',
  sub:'Base do raciocínio diagnóstico',
  body:`
  <table class="ref-table">
    <tr><th>Tipo</th><th>Definição</th><th>Exemplo</th></tr>
    <tr><td>Subjectivos</td><td>Referidos pelo próprio doente; não mensuráveis directamente</td><td>"Sinto muitas dores no peito"</td></tr>
    <tr><td>Objectivos</td><td>Observados/medidos pelo profissional</td><td>TA 150/95 mmHg, FC 110 bpm, diaforese visível</td></tr>
  </table>
  <p>A combinação de dados subjectivos e objectivos sustenta a formulação dos diagnósticos de enfermagem (características definidoras) e a definição do plano de cuidados.</p>`
}
]);

// ================= MEDICAMENTOS =================


