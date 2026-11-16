// === data-urgencia.js ===
// ===== dados/construção — urgencia.html =====

buildAccordionView('urgencia', 'Urgência e Emergência', 'Protocolos e condutas de enfermagem para situações críticas. Siga sempre o protocolo institucional vigente.<br><img class="zoomable-img" src="img/68851d1b0d.webp" alt="Primeiros socorros" style="width:100%;max-width:220px;margin:10px auto 2px;display:block;" onclick="openLightbox(\'img-primeiros-socorros.jpg\',\'Primeiros socorros\',\'primeiros-socorros.jpg\')"><div class="img-caption">Guia rápido de primeiros socorros</div>', [
{
  icon: ICON_ALERT, bg:'#fbe4e8', fg:'#c8202f',
  title:'Suporte Básico de Vida (SBV) — Adulto',
  sub:'Paragem cardiorrespiratória',
  body:`
  <ol class="step-list">
    <li>Verificar segurança do local e responsividade da vítima</li>
    <li>Pedir ajuda / activar equipa de emergência e solicitar desfibrilhador</li>
    <li>Verificar respiração e pulso (máx. 10 segundos)</li>
    <li>Iniciar compressões torácicas: 30 compressões : 2 ventilações</li>
    <li>Profundidade 5–6 cm, frequência 100–120/min, permitir retorno total do tórax</li>
    <li>Conectar o DAE assim que disponível e seguir instruções do aparelho</li>
    <li>Manter ciclos até chegada de suporte avançado ou recuperação de sinais vitais</li>
  </ol>
  <div class="alert-box">Minimizar interrupções das compressões torácicas — cada pausa reduz a perfusão coronária e cerebral.</div>`
},
{
  icon: ICON_ALERT, bg:'#e7ecf4', fg:'#000000',
  title:'Obstrução da Via Aérea por Corpo Estranho (OVACE)',
  sub:'Manobra de Heimlich',
  body:`
  <h4>Adulto consciente</h4>
  <ul><li>Encorajar a tosse se obstrução parcial e tosse eficaz</li><li>Se obstrução total: 5 pancadas interescapulares alternadas com 5 compressões abdominais (manobra de Heimlich)</li></ul>
  <h4>Grávida ou obesidade acentuada</h4>
  <ul><li>Substituir compressões abdominais por compressões torácicas</li></ul>
  <h4>Lactente (&lt;1 ano)</h4>
  <ul><li>5 pancadas interescapulares seguidas de 5 compressões torácicas (não realizar compressão abdominal)</li></ul>
  <div class="alert-box">Se a vítima ficar inconsciente, iniciar SBV e verificar a cavidade oral antes de cada ventilação.</div>`
},
{
  icon: ICON_ALERT, bg:'#e7ecf4', fg:'var(--azul-escuro)',
  title:'Choque Anafilático',
  sub:'Reacção alérgica grave e generalizada',
  body:`
  <h4>Sinais de alarme</h4>
  <ul><li>Estridor, edema da via aérea, broncospasmo, hipotensão, urticária generalizada, angioedema</li></ul>
  <h4>Conduta imediata</h4>
  <ol class="step-list">
    <li>Remover o agente causal, se identificável</li>
    <li>Adrenalina IM 0,3–0,5 mg (1:1000) na face lateral da coxa — repetir a cada 5–15 min se necessário</li>
    <li>Posicionar em decúbito dorsal com pernas elevadas (ou sentado se dificuldade respiratória predominante)</li>
    <li>Oxigénio de alto fluxo e monitorização contínua</li>
    <li>Acesso venoso e fluidoterapia se hipotensão</li>
    <li>Preparar corticóide e anti-histamínico como terapêutica adjuvante</li>
  </ol>`
},
{
  icon: ICON_ALERT, bg:'#e7ecf4', fg:'var(--azul)',
  title:'Acidente Vascular Cerebral (AVC)',
  sub:'Reconhecimento e conduta inicial',
  body:`
  <h4>Escala FAST</h4>
  <ul>
    <li><b>F</b>ace — assimetria facial / desvio da comissura labial</li>
    <li><b>A</b>rm — perda de força num dos braços</li>
    <li><b>S</b>peech — dificuldade na fala/linguagem</li>
    <li><b>T</b>ime — registar hora exacta do início dos sintomas</li>
  </ul>
  <h4>Conduta de enfermagem</h4>
  <ul>
    <li>Avaliar via aérea, respiração e circulação; glicemia capilar (excluir hipoglicemia)</li>
    <li>Não administrar alimentos/líquidos até avaliação da deglutição</li>
    <li>Monitorizar sinais vitais e nível de consciência (Glasgow)</li>
    <li>Encaminhar com urgência para TAC/RM — janela terapêutica de trombólise é tempo-dependente</li>
  </ul>`
},
{
  icon: ICON_ALERT, bg:'#fbe4e8', fg:'#c8202f',
  title:'Síndrome Coronária Aguda (SCA / EAM)',
  sub:'Dor torácica de origem cardíaca',
  body:`
  <h4>Sinais e sintomas</h4>
  <ul><li>Dor/aperto retroesternal, por vezes irradiando para braço esquerdo, mandíbula ou dorso; dispneia, sudorese, náuseas</li></ul>
  <h4>Conduta inicial (MONA-B)</h4>
  <ul>
    <li><b>M</b>orfina (se dor persistente, conforme prescrição)</li>
    <li><b>O</b>xigénio se SpO₂ &lt; 94%</li>
    <li><b>N</b>itratos sublinguais (se não houver hipotensão ou uso recente de inibidores da PDE5)</li>
    <li><b>A</b>spirina mastigável, conforme protocolo</li>
    <li><b>B</b>etabloqueante conforme avaliação médica</li>
  </ul>
  <ul><li>ECG de 12 derivações nos primeiros 10 minutos; acesso venoso; monitorização cardíaca contínua</li></ul>`
},
{
  icon: ICON_ALERT, bg:'#e7ecf4', fg:'#000000',
  title:'Hipoglicemia e Hiperglicemia',
  sub:'Alterações agudas da glicemia',
  body:`
  <h4>Hipoglicemia (&lt; 70 mg/dL)</h4>
  <ul>
    <li>Doente consciente: 15 g de hidratos de carbono de absorção rápida por via oral; reavaliar em 15 min</li>
    <li>Doente inconsciente: glicose EV (conforme protocolo) ou glucagon IM se sem acesso venoso</li>
  </ul>
  <h4>Hiperglicemia grave / cetoacidose diabética</h4>
  <ul>
    <li>Sinais: poliúria, polidipsia, hálito cetónico, respiração de Kussmaul, desidratação</li>
    <li>Conduta: fluidoterapia EV, insulinoterapia conforme protocolo, monitorização de glicemia, electrólitos (K⁺) e diurese horária</li>
  </ul>`
},
{
  icon: ICON_ALERT, bg:'#e7ecf4', fg:'#000000',
  title:'Convulsões',
  sub:'Conduta de enfermagem durante e após a crise',
  body:`
  <h4>Durante a crise</h4>
  <ul>
    <li>Proteger a cabeça e afastar objectos que possam causar lesão</li>
    <li>Não conter os movimentos nem introduzir objectos na boca</li>
    <li>Registar a hora de início, duração e características da crise</li>
  </ul>
  <h4>Após a crise</h4>
  <ul>
    <li>Posição lateral de segurança para proteger a via aérea</li>
    <li>Verificar glicemia capilar e sinais vitais</li>
    <li>Oxigénio se necessário; manter vigilância até recuperação completa do estado de consciência</li>
  </ul>
  <div class="alert-box">Estado de mal epiléptico: crise &gt; 5 minutos ou crises repetidas sem recuperação da consciência — emergência médica.</div>`
},
{
  icon: ICON_ALERT, bg:'#e7ecf4', fg:'var(--azul)',
  title:'Queimaduras',
  sub:'Classificação e regra dos nove',
  body:`
  <table class="ref-table">
    <tr><th>Grau</th><th>Características</th></tr>
    <tr><td>1º grau</td><td>Epiderme; eritema, dor, sem flictenas</td></tr>
    <tr><td>2º grau</td><td>Derme; flictenas, dor intensa, base rósea/húmida</td></tr>
    <tr><td>3º grau</td><td>Espessura total; pele esbranquiçada/carbonizada, pouca dor (destruição de terminações nervosas)</td></tr>
  </table>
  <h4>Regra dos nove (adulto)</h4>
  <p>Cabeça e pescoço 9% · Cada membro superior 9% · Tronco anterior 18% · Tronco posterior 18% · Cada membro inferior 18% · Períneo 1%</p>
  <h4>Conduta inicial</h4>
  <ul><li>Interromper o processo de queimadura (água corrente fria, nunca gelo)</li><li>Remover roupas e adornos não aderentes; cobrir com penso limpo</li><li>Analgesia, fluidoterapia e monitorização em queimaduras extensas</li></ul>`
},
{
  icon: ICON_ALERT, bg:'#e7ecf4', fg:'var(--azul-escuro)',
  title:'Choque (Hipovolémico e Séptico)',
  sub:'Reconhecimento e primeira abordagem',
  body:`
  <h4>Sinais gerais de choque</h4>
  <ul><li>Hipotensão, taquicardia, pele fria e pálida (hipovolémico) ou quente (fase inicial do séptico), tempo de preenchimento capilar prolongado, alteração do estado de consciência, oligúria</li></ul>
  <h4>Conduta de enfermagem</h4>
  <ol class="step-list">
    <li>Garantir via aérea e oxigénio suplementar</li>
    <li>Dois acessos venosos de grande calibre</li>
    <li>Fluidoterapia EV conforme prescrição e protocolo</li>
    <li>Monitorização contínua de sinais vitais e diurese horária</li>
    <li>Identificar e tratar a causa (hemorragia, foco infeccioso, etc.)</li>
  </ol>`
}
]);


// ================= GLOSSÁRIO DE TERMOS MÉDICOS =================


