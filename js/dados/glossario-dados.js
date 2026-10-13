// === data-glossario.js ===
// ===== dados/construção — glossario.html =====

buildAccordionView('glossario', 'Termos Médicos', 'Glossário de siglas, abreviaturas e termos usados na prática e no registo de enfermagem.', [
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'var(--azul)',
  title:'Siglas e Abreviaturas de Sinais Vitais',
  sub:'Parâmetros e monitorização',
  body:`
  <table class="ref-table">
    <tr><th>Sigla</th><th>Significado</th></tr>
    <tr><td>TA / PA</td><td>Tensão arterial / Pressão arterial</td></tr>
    <tr><td>FC</td><td>Frequência cardíaca</td></tr>
    <tr><td>FR</td><td>Frequência respiratória</td></tr>
    <tr><td>T° / Tax</td><td>Temperatura (axilar)</td></tr>
    <tr><td>SpO₂</td><td>Saturação periférica de oxigénio</td></tr>
    <tr><td>Hgt / HGT</td><td>Hemoglicoteste (glicemia capilar)</td></tr>
    <tr><td>PVC</td><td>Pressão venosa central</td></tr>
    <tr><td>ECG</td><td>Electrocardiograma / Escala de Coma de Glasgow (conforme contexto)</td></tr>
  </table>`
},
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'#000000',
  title:'Vias de Administração e Prescrição',
  sub:'Abreviaturas usadas em prescrições',
  body:`
  <table class="ref-table">
    <tr><th>Sigla</th><th>Significado</th></tr>
    <tr><td>VO</td><td>Via oral</td></tr>
    <tr><td>EV / IV</td><td>Endovenoso / Intravenoso</td></tr>
    <tr><td>IM</td><td>Intramuscular</td></tr>
    <tr><td>SC</td><td>Subcutâneo</td></tr>
    <tr><td>ID</td><td>Intradérmico</td></tr>
    <tr><td>SL</td><td>Sublingual</td></tr>
    <tr><td>Ret</td><td>Via rectal</td></tr>
    <tr><td>Top</td><td>Via tópica</td></tr>
    <tr><td>SOS</td><td>Se necessário (do latim "si opus sit")</td></tr>
    <tr><td>8/8h, 12/12h</td><td>De 8 em 8 horas, de 12 em 12 horas</td></tr>
    <tr><td>QD / BID / TID</td><td>Uma vez ao dia / duas vezes ao dia / três vezes ao dia</td></tr>
    <tr><td>gtt</td><td>Gota(s)</td></tr>
  </table>`
},
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'#000000',
  title:'Termos Clínicos Frequentes',
  sub:'Sinais, sintomas e condições',
  body:`
  <table class="ref-table">
    <tr><th>Termo</th><th>Significado</th></tr>
    <tr><td>Dispneia</td><td>Dificuldade respiratória</td></tr>
    <tr><td>Taquicardia / Bradicardia</td><td>Frequência cardíaca elevada / diminuída</td></tr>
    <tr><td>Taquipneia / Bradipneia</td><td>Frequência respiratória elevada / diminuída</td></tr>
    <tr><td>Cianose</td><td>Coloração azulada da pele/mucosas por falta de oxigénio</td></tr>
    <tr><td>Edema</td><td>Acumulação de líquido nos tecidos</td></tr>
    <tr><td>Anasarca</td><td>Edema generalizado grave</td></tr>
    <tr><td>Diaforese</td><td>Sudorese excessiva</td></tr>
    <tr><td>Anúria / Oligúria / Poliúria</td><td>Ausência / diminuição / aumento da produção de urina</td></tr>
    <tr><td>Hematúria</td><td>Presença de sangue na urina</td></tr>
    <tr><td>Melena</td><td>Fezes escuras por sangue digerido</td></tr>
    <tr><td>Icterícia</td><td>Coloração amarelada da pele/mucosas</td></tr>
    <tr><td>Emese / Êmese</td><td>Vómito</td></tr>
    <tr><td>Astenia</td><td>Fraqueza/cansaço generalizado</td></tr>
    <tr><td>Anorexia</td><td>Perda de apetite</td></tr>
    <tr><td>Prostração</td><td>Estado de grande abatimento físico</td></tr>
  </table>`
},
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'var(--azul-escuro)',
  title:'Prefixos e Sufixos Médicos',
  sub:'Bases para interpretar termos técnicos',
  body:`
  <table class="ref-table">
    <tr><th>Elemento</th><th>Significado</th><th>Exemplo</th></tr>
    <tr><td>-ite</td><td>Inflamação</td><td>Gastrite, meningite</td></tr>
    <tr><td>-oma</td><td>Tumor</td><td>Carcinoma, hematoma</td></tr>
    <tr><td>-ectomia</td><td>Remoção cirúrgica</td><td>Apendicectomia</td></tr>
    <tr><td>-otomia</td><td>Incisão cirúrgica</td><td>Traqueotomia</td></tr>
    <tr><td>-ostomia</td><td>Criação de abertura</td><td>Colostomia, traqueostomia</td></tr>
    <tr><td>-algia</td><td>Dor</td><td>Cefalalgia, mialgia</td></tr>
    <tr><td>-penia</td><td>Diminuição</td><td>Leucopenia, trombocitopenia</td></tr>
    <tr><td>-emia</td><td>Relativo ao sangue</td><td>Anemia, hiperglicemia</td></tr>
    <tr><td>Hiper- / Hipo-</td><td>Acima / abaixo do normal</td><td>Hipertensão, hipoglicemia</td></tr>
    <tr><td>Brady- / Taqui-</td><td>Lento / rápido</td><td>Bradicardia, taquipneia</td></tr>
    <tr><td>Dis-</td><td>Dificuldade/alteração</td><td>Dispneia, disúria</td></tr>
    <tr><td>A- / An-</td><td>Ausência</td><td>Apneia, anúria</td></tr>
  </table>`
},
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'#000000',
  title:'Termos do Processo de Enfermagem',
  sub:'NANDA-I, NIC e NOC',
  body:`
  <table class="ref-table">
    <tr><th>Termo</th><th>Significado</th></tr>
    <tr><td>NANDA-I</td><td>Classificação internacional de diagnósticos de enfermagem</td></tr>
    <tr><td>Domínio</td><td>Área ampla de comportamento/resposta humana (ex.: Nutrição)</td></tr>
    <tr><td>Classe</td><td>Subdivisão do domínio que agrupa diagnósticos afins</td></tr>
    <tr><td>Diagnóstico de enfermagem</td><td>Julgamento clínico sobre a resposta humana a um problema de saúde real ou potencial</td></tr>
    <tr><td>NIC</td><td>Classificação das Intervenções de Enfermagem (Nursing Interventions Classification)</td></tr>
    <tr><td>NOC</td><td>Classificação dos Resultados de Enfermagem (Nursing Outcomes Classification)</td></tr>
    <tr><td>Factores relacionados</td><td>Causas/condições associadas a um diagnóstico real</td></tr>
    <tr><td>Características definidoras</td><td>Sinais e sintomas que evidenciam o diagnóstico</td></tr>
    <tr><td>Factores de risco</td><td>Condições que aumentam a vulnerabilidade a um diagnóstico de risco</td></tr>
  </table>`
}
]);

// ================= AVALIAÇÃO E EXAME FÍSICO =================


