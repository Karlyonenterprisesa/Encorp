// === data-escalas.js ===
// ===== dados/construção — escalas.html =====

buildAccordionView('escalas', 'Escalas Clínicas', 'Escalas de avaliação de enfermagem mais usadas na prática clínica e protocolos de triagem.', [
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'#000000',
  title:'Escala de Coma de Glasgow (ECG)',
  sub:'Avaliação do nível de consciência',
  body:`
  <img class="zoomable-img" src="img/bdd4d0d045.webp" alt="Tipos de coma e níveis de consciência" style="width:100%;max-width:260px;margin:4px auto 10px;" onclick="openLightbox('img-glasgow-coma.jpg','Tipos de coma e níveis de consciência','tipos-de-coma.jpg')">
  <div class="img-caption">Tipos de coma e níveis de consciência</div>
  <p>Avalia 3 componentes: abertura ocular (1–4), resposta verbal (1–5) e resposta motora (1–6). Pontuação total de 3 a 15.</p>
  <table class="ref-table">
    <tr><th>Pontuação</th><th>Classificação</th></tr>
    <tr><td>15–13</td><td>TCE ligeiro</td></tr>
    <tr><td>12–9</td><td>TCE moderado</td></tr>
    <tr><td>≤8</td><td>TCE grave — considerar via aérea avançada</td></tr>
  </table>
  <div class="info-box">Pode calcular a pontuação automaticamente em <b>Ferramentas → Cálculos de Enfermagem → Índices e Escalas</b>.</div>`
},
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'var(--azul-escuro)',
  title:'Escala de Braden',
  sub:'Risco de lesão por pressão',
  body:`
  <p>Avalia 6 subescalas, cada uma pontuada de 1 a 4 (excepto fricção/cisalhamento, de 1 a 3): percepção sensorial, humidade, actividade, mobilidade, nutrição, fricção e cisalhamento.</p>
  <table class="ref-table">
    <tr><th>Pontuação total</th><th>Risco</th></tr>
    <tr><td>≤9</td><td><span class="badge badge-red">Risco muito elevado</span></td></tr>
    <tr><td>10–12</td><td><span class="badge badge-orange">Risco elevado</span></td></tr>
    <tr><td>13–14</td><td><span class="badge badge-gold">Risco moderado</span></td></tr>
    <tr><td>15–18</td><td><span class="badge badge-blue">Risco baixo</span></td></tr>
    <tr><td>19–23</td><td><span class="badge badge-green">Sem risco significativo</span></td></tr>
  </table>
  <h4>Intervenções gerais</h4>
  <ul>
    <li>Reposicionamento a cada 2 horas em doentes acamados</li>
    <li>Superfícies de redistribuição de pressão</li>
    <li>Manter pele limpa e seca; hidratação cutânea</li>
    <li>Optimizar aporte nutricional e proteico</li>
  </ul>`
},
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'#000000',
  title:'Escala de Morse',
  sub:'Risco de queda',
  body:`
  <p>Soma de 6 itens: história de quedas (0/25), diagnóstico secundário (0/15), apoio para deambular (0/15/30), terapia endovenosa/heparina (0/20), marcha (0/10/20), estado mental (0/15).</p>
  <table class="ref-table">
    <tr><th>Pontuação</th><th>Risco</th></tr>
    <tr><td>0–24</td><td><span class="badge badge-green">Baixo risco</span></td></tr>
    <tr><td>25–44</td><td><span class="badge badge-gold">Risco moderado</span></td></tr>
    <tr><td>≥45</td><td><span class="badge badge-red">Alto risco</span></td></tr>
  </table>
  <h4>Medidas de prevenção</h4>
  <ul>
    <li>Identificação visual do risco (pulseira/sinalética)</li>
    <li>Cama em posição baixa, grades levantadas se indicado</li>
    <li>Campainha de chamada ao alcance</li>
    <li>Calçado antiderrapante e corredores livres de obstáculos</li>
  </ul>`
},
{
  icon: ICON_SCALE, bg:'#fbe4e8', fg:'#c8202f',
  title:'Escala Visual Analógica da Dor (EVA)',
  sub:'Auto-avaliação da intensidade da dor',
  body:`
  <p>Linha de 0 a 10 em que o doente indica a intensidade da dor sentida.</p>
  <table class="ref-table">
    <tr><th>Valor</th><th>Intensidade</th></tr>
    <tr><td>0</td><td>Sem dor</td></tr>
    <tr><td>1–3</td><td><span class="badge badge-green">Dor ligeira</span></td></tr>
    <tr><td>4–6</td><td><span class="badge badge-gold">Dor moderada</span></td></tr>
    <tr><td>7–9</td><td><span class="badge badge-orange">Dor intensa</span></td></tr>
    <tr><td>10</td><td><span class="badge badge-red">Dor máxima imaginável</span></td></tr>
  </table>
  <div class="info-box">Em crianças pequenas ou doentes não comunicantes, preferir escalas observacionais (ex.: Escala de Faces de Wong-Baker, FLACC).</div>`
},
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'var(--azul)',
  title:'Índice de Barthel',
  sub:'Independência funcional nas AVD',
  body:`
  <p>Avalia 10 actividades de vida diária (alimentação, banho, higiene pessoal, vestir, controlo intestinal e vesical, uso do sanitário, transferências, mobilidade, subir escadas). Pontuação de 0 a 100.</p>
  <table class="ref-table">
    <tr><th>Pontuação</th><th>Grau de dependência</th></tr>
    <tr><td>0–20</td><td>Dependência total</td></tr>
    <tr><td>21–60</td><td>Dependência grave</td></tr>
    <tr><td>61–90</td><td>Dependência moderada</td></tr>
    <tr><td>91–99</td><td>Dependência ligeira</td></tr>
    <tr><td>100</td><td>Independência total</td></tr>
  </table>`
},
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'var(--azul)',
  title:'NEWS2 — National Early Warning Score',
  sub:'Deterioração clínica precoce',
  body:`
  <p>Pontua 7 parâmetros fisiológicos: frequência respiratória, saturação de O₂, uso de oxigénio suplementar, temperatura, pressão arterial sistólica, frequência cardíaca e nível de consciência (AVPU).</p>
  <table class="ref-table">
    <tr><th>Pontuação total</th><th>Risco / conduta</th></tr>
    <tr><td>0</td><td><span class="badge badge-green">Baixo</span> — vigilância de rotina</td></tr>
    <tr><td>1–4</td><td><span class="badge badge-blue">Baixo-moderado</span> — reavaliar</td></tr>
    <tr><td>5–6 (ou 3 num parâmetro)</td><td><span class="badge badge-gold">Moderado</span> — avaliação urgente</td></tr>
    <tr><td>≥7</td><td><span class="badge badge-red">Alto</span> — resposta de emergência</td></tr>
  </table>`
},
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'#000000',
  title:'Índice de Apgar',
  sub:'Avaliação neonatal ao 1º e 5º minuto',
  body:`
  <p>Avalia 5 sinais, cada um pontuado de 0 a 2: frequência cardíaca, esforço respiratório, tónus muscular, irritabilidade reflexa e cor da pele.</p>
  <table class="ref-table">
    <tr><th>Pontuação</th><th>Estado do RN</th></tr>
    <tr><td>7–10</td><td><span class="badge badge-green">Boa adaptação</span></td></tr>
    <tr><td>4–6</td><td><span class="badge badge-gold">Dificuldade moderada</span> — estimulação/O₂</td></tr>
    <tr><td>0–3</td><td><span class="badge badge-red">Depressão grave</span> — reanimação neonatal imediata</td></tr>
  </table>`
},
{
  icon: ICON_ALERT, bg:'#fbe4e8', fg:'#c8202f',
  title:'Protocolo de Triagem de Manchester',
  sub:'Prioridade clínica no serviço de urgência',
  body:`
  <p>Sistema de triagem por cores que define a prioridade de atendimento e o tempo-alvo até à observação médica, com base em fluxogramas de sintomas discriminadores.</p>
  <table class="ref-table">
    <tr><th>Cor</th><th>Prioridade</th><th>Tempo-alvo</th></tr>
    <tr><td><span class="badge badge-red">Vermelho</span></td><td>Emergente</td><td>Imediato</td></tr>
    <tr><td><span class="badge badge-orange">Laranja</span></td><td>Muito urgente</td><td>10 min</td></tr>
    <tr><td><span class="badge badge-gold">Amarelo</span></td><td>Urgente</td><td>60 min</td></tr>
    <tr><td><span class="badge badge-green">Verde</span></td><td>Pouco urgente</td><td>120 min</td></tr>
    <tr><td><span class="badge badge-blue">Azul</span></td><td>Não urgente</td><td>240 min</td></tr>
  </table>
  <div class="alert-box">A triagem não substitui a reavaliação contínua — qualquer alteração do estado do doente exige nova avaliação de prioridade.</div>`
}
]);

// ================= PROCEDIMENTOS DE ENFERMAGEM =================
// ================= CASOS CLÍNICOS (extraído de JASSAA Premium v3.0) =================


