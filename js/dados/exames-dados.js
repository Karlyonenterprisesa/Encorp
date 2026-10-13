// === data-exames.js ===
// ===== dados/construção — exames.html =====

buildAccordionView('exames', 'Exames Laboratoriais', 'Valores de referência e apoio à interpretação de exames laboratoriais em adultos. Os intervalos podem variar consoante o laboratório e o método utilizado.', [
{
  icon: ICON_EXAM, bg:'#fbe4e8', fg:'#c8202f',
  title:'Hemograma Completo',
  sub:'Série vermelha, branca e plaquetas',
  body:`
  <table class="ref-table">
    <tr><th>Parâmetro</th><th>Valor de referência (adulto)</th></tr>
    <tr><td>Hemoglobina</td><td>H: 13,5–17,5 g/dL · M: 12–15,5 g/dL</td></tr>
    <tr><td>Hematócrito</td><td>H: 41–53% · M: 36–46%</td></tr>
    <tr><td>Eritrócitos</td><td>4,5–5,9 milhões/µL (H) · 4,1–5,1 milhões/µL (M)</td></tr>
    <tr><td>Leucócitos</td><td>4.000–11.000 /µL</td></tr>
    <tr><td>Neutrófilos</td><td>40–75%</td></tr>
    <tr><td>Linfócitos</td><td>20–45%</td></tr>
    <tr><td>Plaquetas</td><td>150.000–450.000 /µL</td></tr>
  </table>
  <div class="info-box"><b>Leucocitose</b> sugere infecção/inflamação; <b>leucopenia</b> pode indicar imunossupressão. <b>Trombocitopenia</b> aumenta o risco hemorrágico.</div>
  <button type="button" onclick="showView('hemograma')" style="margin-top:10px;background:#f28c1c;color:#fff;border:none;border-radius:10px;padding:10px 16px;font-weight:700;cursor:pointer;">Abrir interpretação do hemograma</button>`
},
{
  icon: ICON_EXAM, bg:'#e7ecf4', fg:'#000000',
  title:'Bioquímica Sérica',
  sub:'Glicose, função renal e electrólitos',
  body:`
  <table class="ref-table">
    <tr><th>Parâmetro</th><th>Valor de referência</th></tr>
    <tr><td>Glicemia em jejum</td><td>70–99 mg/dL</td></tr>
    <tr><td>Ureia</td><td>15–45 mg/dL</td></tr>
    <tr><td>Creatinina</td><td>H: 0,7–1,3 mg/dL · M: 0,6–1,1 mg/dL</td></tr>
    <tr><td>Sódio (Na⁺)</td><td>135–145 mEq/L</td></tr>
    <tr><td>Potássio (K⁺)</td><td>3,5–5,0 mEq/L</td></tr>
    <tr><td>Cloro (Cl⁻)</td><td>98–107 mEq/L</td></tr>
    <tr><td>Cálcio total</td><td>8,5–10,5 mg/dL</td></tr>
  </table>
  <div class="alert-box">Potássio &lt;3,0 ou &gt;6,0 mEq/L é considerado crítico — risco de arritmia grave. Notificar de imediato.</div>`
},
{
  icon: ICON_EXAM, bg:'#e7ecf4', fg:'var(--azul)',
  title:'Perfil Lipídico',
  sub:'Colesterol e triglicerídeos',
  body:`
  <table class="ref-table">
    <tr><th>Parâmetro</th><th>Valor desejável</th></tr>
    <tr><td>Colesterol total</td><td>&lt; 200 mg/dL</td></tr>
    <tr><td>LDL ("mau" colesterol)</td><td>&lt; 100 mg/dL</td></tr>
    <tr><td>HDL ("bom" colesterol)</td><td>&gt; 40 mg/dL (H) · &gt; 50 mg/dL (M)</td></tr>
    <tr><td>Triglicerídeos</td><td>&lt; 150 mg/dL</td></tr>
  </table>
  <p>Colheita geralmente realizada em jejum de 9–12 horas, conforme protocolo laboratorial.</p>`
},
{
  icon: ICON_EXAM, bg:'#e7ecf4', fg:'var(--azul-escuro)',
  title:'Estudo da Coagulação',
  sub:'TP, INR, TTPa e fibrinogénio',
  body:`
  <table class="ref-table">
    <tr><th>Parâmetro</th><th>Valor de referência</th></tr>
    <tr><td>Tempo de protrombina (TP)</td><td>11–13,5 segundos</td></tr>
    <tr><td>INR</td><td>0,8–1,2 (2–3 em anticoagulação terapêutica)</td></tr>
    <tr><td>TTPa</td><td>25–35 segundos</td></tr>
    <tr><td>Fibrinogénio</td><td>200–400 mg/dL</td></tr>
    <tr><td>D-dímero</td><td>&lt; 0,5 µg/mL (varia por método)</td></tr>
  </table>
  <div class="info-box">Doentes anticoagulados (varfarina) são monitorizados pelo INR; a heparina não fraccionada é monitorizada pelo TTPa.</div>`
},
{
  icon: ICON_EXAM, bg:'#e7ecf4', fg:'#000000',
  title:'Gasometria Arterial',
  sub:'Equilíbrio ácido-base e oxigenação',
  body:`
  <table class="ref-table">
    <tr><th>Parâmetro</th><th>Valor de referência</th></tr>
    <tr><td>pH</td><td>7,35–7,45</td></tr>
    <tr><td>PaCO₂</td><td>35–45 mmHg</td></tr>
    <tr><td>PaO₂</td><td>80–100 mmHg</td></tr>
    <tr><td>HCO₃⁻</td><td>22–26 mEq/L</td></tr>
    <tr><td>SatO₂</td><td>95–100%</td></tr>
    <tr><td>Excesso de bases (BE)</td><td>-2 a +2 mEq/L</td></tr>
  </table>
  <h4>Interpretação rápida</h4>
  <ul>
    <li>pH &lt; 7,35 = acidose · pH &gt; 7,45 = alcalose</li>
    <li>PaCO₂ alterado no mesmo sentido do pH = origem respiratória</li>
    <li>HCO₃⁻ alterado em sentido inverso ao pH = origem metabólica</li>
  </ul>`
},
{
  icon: ICON_EXAM, bg:'#e7ecf4', fg:'#000000',
  title:'Função Hepática',
  sub:'Transaminases, bilirrubinas e fosfatase alcalina',
  body:`
  <table class="ref-table">
    <tr><th>Parâmetro</th><th>Valor de referência</th></tr>
    <tr><td>AST / TGO</td><td>10–40 U/L</td></tr>
    <tr><td>ALT / TGP</td><td>7–56 U/L</td></tr>
    <tr><td>Bilirrubina total</td><td>0,3–1,2 mg/dL</td></tr>
    <tr><td>Bilirrubina directa</td><td>0–0,3 mg/dL</td></tr>
    <tr><td>Fosfatase alcalina</td><td>44–147 U/L</td></tr>
    <tr><td>Albumina</td><td>3,5–5,0 g/dL</td></tr>
  </table>`
},
{
  icon: ICON_EXAM, bg:'#e7ecf4', fg:'var(--azul)',
  title:'Exame de Urina Tipo II (EAS)',
  sub:'Características físicas, químicas e sedimento urinário',
  body:`
  <table class="ref-table">
    <tr><th>Parâmetro</th><th>Valor esperado</th></tr>
    <tr><td>Densidade</td><td>1,005–1,030</td></tr>
    <tr><td>pH</td><td>4,6–8,0</td></tr>
    <tr><td>Proteínas</td><td>Negativo/vestigial</td></tr>
    <tr><td>Glicose</td><td>Negativo</td></tr>
    <tr><td>Corpos cetónicos</td><td>Negativo</td></tr>
    <tr><td>Leucócitos no sedimento</td><td>0–5 por campo</td></tr>
    <tr><td>Eritrócitos no sedimento</td><td>0–2 por campo</td></tr>
  </table>
  <p>Colher de preferência a primeira urina da manhã, com técnica de jacto médio e recipiente estéril.</p>`
}
]);

// ================= URGÊNCIA E EMERGÊNCIA =================


