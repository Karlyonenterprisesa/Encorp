// === data-biblioteca.js ===
// ===== dados/construção — biblioteca.html =====
// Conteúdo de referência extraído de JASSAA Premium v3.0 (Diagnósticos de Enfermagem,
// NOC/NIC por domínio, tabela comparativa e resumo de ferramentas de cálculo).

buildAccordionView('biblioteca', 'Biblioteca Especializada', 'Documentos de referência: Manual do Sistema, Manual Guia (Gastrite Ulcerativa), Lista Nacional de Medicamentos Essenciais (Moçambique, 2017) e Processo de Enfermagem do Adulto.', [
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'#000000',
  title:'📘 Manual do Sistema',
  sub:'Guia de utilização · Alcartel Digital Vision · Karlyon Enterprise, S.A.',
  body:`
  <div class="info-box"><b>Tipo:</b> Manual — Guia de utilização da plataforma</div>
  <p>Manual completo da plataforma ENCORP: quem criou o sistema, objectivos e um guia passo a passo de todas as ferramentas e conteúdos disponíveis.</p>
  ${libraryPdfButtons('manual')}
  ${libraryPdfViewerBlock('manual','Manual do Sistema ENCORP')}`
},
{
  icon: ICON_PROC, bg:'#fbe4e8', fg:'#c8202f',
  title:'📄 Manual Guia — Gastrite Ulcerativa',
  sub:'Sacaíta MONTGOMERY · Enfermeiro Generalista · Karlyon Enterprise, S.A. — 2026',
  body:`
  <div class="info-box"><b>Tipo:</b> Manual técnico de apoio ao doente — Saúde Digestiva</div>
  <h4>Sobre o manual</h4>
  <p>Manual técnico e prático sobre gastrite ulcerativa, em linguagem acessível, cobrindo fisiopatologia, tratamento farmacológico, suporte nutricional e prevenção de recidiva.</p>
  <h4>Índice de capítulos</h4>
  <ul>
    <li>1. Introdução — O que é a gastrite ulcerativa</li>
    <li>2. Anatomia e funcionamento do estômago</li>
    <li>3. Fisiopatologia — como a gastrite evolui para úlcera</li>
    <li>4. Causas mais comuns (H. pylori, AINEs, álcool, tabaco)</li>
    <li>5. Sintomas e sinais de alerta</li>
    <li>6. Diagnóstico (endoscopia, teste respiratório, fezes, sangue)</li>
    <li>7. Sinais de alarme e primeiros cuidados em hemorragia digestiva</li>
    <li>8. Fase 1 — Tratamento farmacológico (IBP + antibióticos)</li>
    <li>9. Fase 2 — Sumo de aloe vera, papaia e banana + moringa</li>
    <li>10. Fase 3 — Plano alimentar diário</li>
    <li>11. Fase 4 — Actividade física na recuperação</li>
    <li>12. Prevenção de recidiva</li>
    <li>13. Perguntas frequentes</li>
  </ul>
  <div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;">
    <button onclick="openGastriteViewer()" style="background:#f28c1c;color:#fff;border:none;border-radius:10px;padding:10px 18px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:7px;">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="16" height="16"><path d="M14 3v4a1 1 0 001 1h4"/><path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"/></svg>
      Visualizar PDF
    </button>
    <button onclick="downloadGastrite()" style="background:#e7ecf4;color:#000000;border:1px solid #000000;border-radius:10px;padding:10px 18px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:7px;">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="16" height="16"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Baixar PDF
    </button>
  </div>
  <div id="gastrite-pdf-area" style="display:none;margin-top:14px;border-radius:12px;overflow:hidden;border:1px solid var(--borda);">
    <iframe id="gastrite-iframe" style="width:100%;height:520px;border:none;" title="Manual Gastrite Ulcerativa"></iframe>
  </div>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'var(--azul)',
  title:'📄 Lista Nacional de Medicamentos Essenciais — Moçambique',
  sub:'Ministério da Saúde · Departamento Farmacêutico — 2017',
  body:`
  <div class="info-box"><b>Tipo:</b> Documento oficial — Formulário Nacional de Medicamentos</div>
  <p>1ª edição da Lista Nacional de Medicamentos Essenciais (LNME) de Moçambique, publicada pelo Ministério da Saúde — Departamento Farmacêutico (2017), com financiamento da USAID/SIAPS. Organiza os medicamentos essenciais por classe terapêutica (Capítulo II) e por nível de prescrição, incluindo a lista de medicamentos de especialidade (Capítulo III).</p>
  ${libraryPdfButtons('lnme')}
  ${libraryPdfViewerBlock('lnme','Lista Nacional de Medicamentos Essenciais 2017')}`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'var(--azul)',
  title:'📋 Processo de Enfermagem do Adulto',
  sub:'NANDA-I · NIC · NOC (retificado e expandido)',
  body:`
  <div class="info-box"><b>Fonte:</b> Formulário Processo de Enfermagem do Adulto, revisto com base em NANDA-I 2024, NIC e NOC</div>
  <h4>Estrutura do processo</h4>
  <ul>
    <li><b>1. Histórico</b> — Identificação, dados gerais e contexto social</li>
    <li><b>2. Apresentação do problema</b> — Motivo de internamento, queixas e história da doença</li>
    <li><b>3. Antecedentes</b> — Pessoais, familiares e alergias</li>
    <li><b>4. Exame físico</b> — Sinais vitais, avaliação por sistemas e dispositivos</li>
    <li><b>5. Tratamento medicamentoso</b> — Classe, dose, via, objectivo e efeitos secundários</li>
    <li><b>6. Diagnósticos NANDA-I</b> — Com formulação PES, NHB, intervenções NIC, cuidados de enfermagem e resultados esperados NOC</li>
    <li><b>7. Resumo e árvore de problemas</b> — Síntese clínica, causas/efeitos e bibliografia</li>
  </ul>
  <h4>Melhorias aplicadas (retificação NIC/NOC)</h4>
  <ul>
    <li>Nome actualizado: <b>Processo de Enfermagem do Adulto</b></li>
    <li>Campos de <b>Cuidados de Enfermagem</b> (NIC) explícitos e separados</li>
    <li>Campos de <b>Resultados Esperados</b> (NOC) com indicadores mensuráveis</li>
    <li>Formulação PES estruturada (Problema · Etiologia · Sinais/Sintomas)</li>
    <li>Justificativa científica por diagnóstico</li>
    <li>Fotos e logos removidos — formulário limpo e funcional</li>
  </ul>
  <button onclick="showView('proc-form')" style="margin-top:12px;background:#f28c1c;color:#fff;border:none;border-radius:10px;padding:10px 18px;font-size:13px;font-weight:700;cursor:pointer;width:100%;">
    Abrir Formulário de Processo de Enfermagem
  </button>`
}
]);
buildAccordionView('bib-diag', 'Diagnósticos de Enfermagem — Referência', 'Diagnósticos, NOC, NIC e tabela comparativa.', [
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'var(--azul)',
  title:'D001 · Padrão Respiratório Ineficaz',
  sub:'Diagnóstico real · NHB: Oxigenação',
  body:`
  <div class="info-box"><b>NHB:</b> Oxigenação</div>
  <h4>Relacionado com</h4>
  <p>Fraqueza muscular respiratória</p>
  <h4>Evidenciado por</h4>
  <ul><li>Frequência respiratória >24/min</li><li>Uso de músculos acessórios</li><li>Dispneia ao esforço</li></ul>
  <h4>NOC — Resultados esperados</h4>
  <ul><li>Manutenção de via aérea patente</li><li>Simetria do movimento torácico</li><li>Saturação O2 ≥95%</li></ul>
  <h4>NIC — Intervenções</h4>
  <ul><li>Posicionamento Fowler</li><li>Monitorização contínua de SO2</li><li>Oxigenoterapia conforme prescrição</li></ul>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'#000000',
  title:'D002 · Débito Cardíaco Diminuído',
  sub:'Diagnóstico real · NHB: Circulação',
  body:`
  <div class="info-box"><b>NHB:</b> Circulação</div>
  <h4>Relacionado com</h4>
  <p>Alteração da contractilidade miocárdica</p>
  <h4>Evidenciado por</h4>
  <ul><li>PA sistólica <90mmHg</li><li>FC >100bpm</li><li>Pele fria e pálida</li></ul>
  <h4>NOC — Resultados esperados</h4>
  <ul><li>Perfusão tisular adequada</li><li>Pele morna e rosada</li><li>Débito urinário >0.5ml/kg/h</li></ul>
  <h4>NIC — Intervenções</h4>
  <ul><li>Monitorização hemodinâmica</li><li>Acesso venoso periférico</li><li>Infusão de soros conforme prescrição</li></ul>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'#000000',
  title:'D003 · Nutrição Desequilibrada (Menos do que Necessário)',
  sub:'Diagnóstico real · NHB: Nutrição',
  body:`
  <div class="info-box"><b>NHB:</b> Nutrição</div>
  <h4>Relacionado com</h4>
  <p>Dificuldade de deglutição pós-AVC</p>
  <h4>Evidenciado por</h4>
  <ul><li>Ingestão proteica inadequada</li><li>Peso <95% do ideal</li><li>Albumina sérica <3.5g/dL</li></ul>
  <h4>NOC — Resultados esperados</h4>
  <ul><li>Peso estável</li><li>Ingestão nutricional adequada</li><li>Mucosa oral íntegra</li></ul>
  <h4>NIC — Intervenções</h4>
  <ul><li>Avaliação nutricional completa</li><li>Nutrição enteral por sonda NG</li><li>Suplementação calórica</li></ul>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'var(--azul-escuro)',
  title:'D004 · Constipação',
  sub:'Diagnóstico real · NHB: Eliminação',
  body:`
  <div class="info-box"><b>NHB:</b> Eliminação</div>
  <h4>Relacionado com</h4>
  <p>Imobilidade prolongada em UTI</p>
  <h4>Evidenciado por</h4>
  <ul><li>Ausência de evacuações há 48h</li><li>Abdómen distendido</li><li>Resíduos gástricos aumentados</li></ul>
  <h4>NOC — Resultados esperados</h4>
  <ul><li>Padrão evacuatório normal</li><li>Abdómen suave à palpação</li><li>Evacuações diárias</li></ul>
  <h4>NIC — Intervenções</h4>
  <ul><li>Massagem abdominal</li><li>Laxantes osmóticos</li><li>Hidratação adequada</li></ul>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'#000000',
  title:'D005 · Déficit de Volume Líquido',
  sub:'Diagnóstico real · NHB: Hidratação',
  body:`
  <div class="info-box"><b>NHB:</b> Hidratação</div>
  <h4>Relacionado com</h4>
  <p>Perdas aumentadas por diarreia e vómitos</p>
  <h4>Evidenciado por</h4>
  <ul><li>Turgor cutâneo diminuído</li><li>Mucosas secas</li><li>Débito urinário <400ml/24h</li></ul>
  <h4>NOC — Resultados esperados</h4>
  <ul><li>Hidratação adequada</li><li>Turgor cutâneo normal</li><li>Mucosas húmidas</li></ul>
  <h4>NIC — Intervenções</h4>
  <ul><li>Reposição hidroeletrolítica</li><li>Monitorização de sinais vitais</li><li>Controlo rigoroso de ingressos/saídas</li></ul>`
},
{
  icon: ICON_PROC, bg:'#fbe4e8', fg:'#c8202f',
  title:'D006 · Hipertermia',
  sub:'Diagnóstico real · NHB: Temperatura',
  body:`
  <div class="info-box"><b>NHB:</b> Temperatura</div>
  <h4>Relacionado com</h4>
  <p>Processo infeccioso (pneumonia nosocomial)</p>
  <h4>Evidenciado por</h4>
  <ul><li>Temperatura >38.5°C</li><li>Sudoração profusa</li><li>Taquicardia e taquipneia</li></ul>
  <h4>NOC — Resultados esperados</h4>
  <ul><li>Temperatura normotérmica</li><li>Pele seca</li><li>Frequência respiratória normal</li></ul>
  <h4>NIC — Intervenções</h4>
  <ul><li>Antitermia com fármacos</li><li>Compressas frias</li><li>Controlo de temperatura 4/4h</li></ul>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'var(--azul)',
  title:'D007 · Insónia',
  sub:'Diagnóstico real · NHB: Sono/Repouso',
  body:`
  <div class="info-box"><b>NHB:</b> Sono/Repouso</div>
  <h4>Relacionado com</h4>
  <p>Stress ambiental da UTI (barulho, luz)</p>
  <h4>Evidenciado por</h4>
  <ul><li>Relato de insónia</li><li>Olheiras acentuadas</li><li>Sonolência diurna</li></ul>
  <h4>NOC — Resultados esperados</h4>
  <ul><li>Repouso adequado 6-8h/dia</li><li>Vigília alerta durante o dia</li><li>Expressão facial descansada</li></ul>
  <h4>NIC — Intervenções</h4>
  <ul><li>Ambiente silencioso e escuro</li><li>Horário de repouso estruturado</li><li>Higiene do sono estruturada</li></ul>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'#000000',
  title:'D008 · Mobilidade Física Limitada',
  sub:'Diagnóstico real · NHB: Movimento',
  body:`
  <div class="info-box"><b>NHB:</b> Movimento</div>
  <h4>Relacionado com</h4>
  <p>Paralisia flácida após AVC</p>
  <h4>Evidenciado por</h4>
  <ul><li>Amplitude movimento <25%</li><li>Força muscular grau 0-1</li><li>Rigidez articular</li></ul>
  <h4>NOC — Resultados esperados</h4>
  <ul><li>Amplitude movimento progressiva</li><li>Força muscular grau 4-5</li><li>Realiza AVD independentemente</li></ul>
  <h4>NIC — Intervenções</h4>
  <ul><li>Fisioterapia motora 2x/dia</li><li>Posicionamento cada 2h</li><li>Mobilização articular passiva</li></ul>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'#000000',
  title:'D009 · Risco de Queda',
  sub:'Diagnóstico real · NHB: Segurança',
  body:`
  <div class="info-box"><b>NHB:</b> Segurança</div>
  <h4>Relacionado com</h4>
  <p>Fraqueza, desequilíbrio neurológico</p>
  <h4>Evidenciado por</h4>
  <ul><li>Marcha instável</li><li>Orientação prejudicada</li><li>Ambiente com obstáculos</li></ul>
  <h4>NOC — Resultados esperados</h4>
  <ul><li>Comportamento de segurança</li><li>Ambiente livre de riscos</li><li>Mantém equilíbrio em pé</li></ul>
  <h4>NIC — Intervenções</h4>
  <ul><li>Cama baixa com grades</li><li>Acompanhamento em deambulações</li><li>Educação sobre riscos</li></ul>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'var(--azul-escuro)',
  title:'D010 · Déficit de Autohigiene',
  sub:'Diagnóstico real · NHB: Higiene',
  body:`
  <div class="info-box"><b>NHB:</b> Higiene</div>
  <h4>Relacionado com</h4>
  <p>Limitação de mobilidade por fratura</p>
  <h4>Evidenciado por</h4>
  <ul><li>Incapacidade de lavar cabelos</li><li>Pele ressecada</li><li>Cabelo despenteado</li></ul>
  <h4>NOC — Resultados esperados</h4>
  <ul><li>Higiene pessoal adequada</li><li>Pele limpa e cuidada</li><li>Aparência pessoal melhorada</li></ul>
  <h4>NIC — Intervenções</h4>
  <ul><li>Banho assistido diário</li><li>Higiene oral com escova de dentes</li><li>Cuidado com unhas</li></ul>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'#000000',
  title:'D011 · Disfunção Sexual',
  sub:'Diagnóstico real · NHB: Sexualidade',
  body:`
  <div class="info-box"><b>NHB:</b> Sexualidade</div>
  <h4>Relacionado com</h4>
  <p>Efeitos secundários de antidepressivos</p>
  <h4>Evidenciado por</h4>
  <ul><li>Diminuição do desejo sexual</li><li>Dificuldade de ereção</li><li>Insatisfação conjugal</li></ul>
  <h4>NOC — Resultados esperados</h4>
  <ul><li>Função sexual satisfatória</li><li>Conforto relatado</li><li>Relacionamento conjugal harmónico</li></ul>
  <h4>NIC — Intervenções</h4>
  <ul><li>Aconselhamento sexual</li><li>Educação sobre efeitos medicamentosos</li><li>Referência a sexólogo</li></ul>`
},
{
  icon: ICON_PROC, bg:'#fbe4e8', fg:'#c8202f',
  title:'D012 · Déficit de Conhecimento sobre Autocuidado',
  sub:'Diagnóstico real · NHB: Aprendizagem',
  body:`
  <div class="info-box"><b>NHB:</b> Aprendizagem</div>
  <h4>Relacionado com</h4>
  <p>Falta de experiência prévia com insulina</p>
  <h4>Evidenciado por</h4>
  <ul><li>Verbalizações imprecisas</li><li>Execução incorreta da injecção</li><li>Dúvidas frequentes</li></ul>
  <h4>NOC — Resultados esperados</h4>
  <ul><li>Conhecimento sobre insulina aumentado</li><li>Administração correcta técnica</li><li>Confiança melhorada</li></ul>
  <h4>NIC — Intervenções</h4>
  <ul><li>Educação individual estruturada</li><li>Demonstração prática de injecção</li><li>Retorno de demonstração</li></ul>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'var(--azul)',
  title:'D013 · Ansiedade Moderada',
  sub:'Diagnóstico real · NHB: Psicosocial',
  body:`
  <div class="info-box"><b>NHB:</b> Psicosocial</div>
  <h4>Relacionado com</h4>
  <p>Ameaça à integridade biológica (cirurgia)</p>
  <h4>Evidenciado por</h4>
  <ul><li>Agitação psicomotora</li><li>Verbalização de preocupações</li><li>Insónia noturna</li></ul>
  <h4>NOC — Resultados esperados</h4>
  <ul><li>Controle emocional melhorado</li><li>Técnicas de relaxamento aplicadas</li><li>Expressão de preocupações reduzida</li></ul>
  <h4>NIC — Intervenções</h4>
  <ul><li>Escuta activa atenta</li><li>Técnicas de relaxamento ensinadas</li><li>Presença reconfortante</li></ul>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'#000000',
  title:'D014 · Capacidade Adaptativa Prejudicada',
  sub:'Diagnóstico real · NHB: Coping/Adaptação',
  body:`
  <div class="info-box"><b>NHB:</b> Coping/Adaptação</div>
  <h4>Relacionado com</h4>
  <p>Luto pela perda de autonomia</p>
  <h4>Evidenciado por</h4>
  <ul><li>Isolamento social</li><li>Diminuição de interesse nas actividades</li><li>Choro frequente</li></ul>
  <h4>NOC — Resultados esperados</h4>
  <ul><li>Uso de estratégias de coping</li><li>Participação social retomada</li><li>Expressão emocional apropriada</li></ul>
  <h4>NIC — Intervenções</h4>
  <ul><li>Encorajamento de verbalização</li><li>Envolvimento de psicólogo</li><li>Actividades recreativas adaptadas</li></ul>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'#000000',
  title:'D015 · Sofrimento Espiritual',
  sub:'Diagnóstico real · NHB: Espiritualidade',
  body:`
  <div class="info-box"><b>NHB:</b> Espiritualidade</div>
  <h4>Relacionado com</h4>
  <p>Conflito entre valores religiosos e plano terapêutico</p>
  <h4>Evidenciado por</h4>
  <ul><li>Questionamento do sentido da vida</li><li>Recusa de tratamentos</li><li>Expressão de raiva com Deus</li></ul>
  <h4>NOC — Resultados esperados</h4>
  <ul><li>Paz interior melhorada</li><li>Sentido de propósito retomado</li><li>Aceitação do plano terapêutico</li></ul>
  <h4>NIC — Intervenções</h4>
  <ul><li>Escuta activa a valores</li><li>Envolvimento de capelão</li><li>Respeito a preferências religiosas</li></ul>`
},
{
  icon: ICON_ALERT, bg:'#e7ecf4', fg:'var(--azul-escuro)',
  title:'DR01 · Risco de Úlcera de Pressão',
  sub:'Diagnóstico de risco · NHB: Pele/Integridade',
  body:`
  <div class="info-box"><b>NHB:</b> Pele/Integridade</div>
  <h4>Fatores de risco</h4>
  <ul><li>Imobilidade prolongada</li><li>Desnutrição</li><li>Incontinência fecal/urinária</li><li>Pele frágil (idade >75 anos)</li></ul>
  <h4>Prevenção</h4>
  <ul><li>Mudanças posicionais cada 2h</li><li>Colchão antiescaras</li><li>Avaliação diária com Escala Braden</li><li>Higiene e hidratação adequadas</li></ul>`
},
{
  icon: ICON_ALERT, bg:'#e7ecf4', fg:'#000000',
  title:'DR02 · Risco de Infecção do Sítio Cirúrgico',
  sub:'Diagnóstico de risco · NHB: Infecção',
  body:`
  <div class="info-box"><b>NHB:</b> Infecção</div>
  <h4>Fatores de risco</h4>
  <ul><li>Cirurgia contaminada</li><li>Paciente imunodeprimido</li><li>Obesidade</li><li>Diabetes descontrolada</li></ul>
  <h4>Prevenção</h4>
  <ul><li>Técnica asséptica rigorosa</li><li>Profilaxia antibiótica</li><li>Monitorização de sinais inflamatórios</li><li>Educação sobre cuidados com ferida</li></ul>`
},
{
  icon: ICON_ALERT, bg:'#fbe4e8', fg:'#c8202f',
  title:'DR03 · Risco de Trombo-embolismo Venoso',
  sub:'Diagnóstico de risco · NHB: Circulação',
  body:`
  <div class="info-box"><b>NHB:</b> Circulação</div>
  <h4>Fatores de risco</h4>
  <ul><li>Imobilidade prolongada</li><li>Cirurgia de grande vulto</li><li>Obesidade</li><li>Idade >60 anos</li></ul>
  <h4>Prevenção</h4>
  <ul><li>Meias de compressão</li><li>Exercícios de perna</li><li>Anticoagulação profiláctica</li><li>Hidratação adequada</li></ul>`
},
{
  icon: ICON_ALERT, bg:'#e7ecf4', fg:'var(--azul)',
  title:'DR04 · Risco de Retenção Urinária',
  sub:'Diagnóstico de risco · NHB: Eliminação',
  body:`
  <div class="info-box"><b>NHB:</b> Eliminação</div>
  <h4>Fatores de risco</h4>
  <ul><li>Anestesia recente</li><li>Opioides</li><li>Imobilidade</li><li>Infecção urinária</li></ul>
  <h4>Prevenção</h4>
  <ul><li>Monitorização de diurese</li><li>Sonda vesical se necessário</li><li>Privacidade na micção</li><li>Medicação conforme prescrição</li></ul>`
},
{
  icon: ICON_ALERT, bg:'#e7ecf4', fg:'#000000',
  title:'DR05 · Risco de Aspiração',
  sub:'Diagnóstico de risco · NHB: Aspiração',
  body:`
  <div class="info-box"><b>NHB:</b> Aspiração</div>
  <h4>Fatores de risco</h4>
  <ul><li>Diminuição do nível consciência</li><li>Disfagia</li><li>Posição supina</li><li>Sonda NG</li></ul>
  <h4>Prevenção</h4>
  <ul><li>Posição semi-Fowler permanente</li><li>Teste de deglutição</li><li>Aspiração oral antes de alimentar</li><li>Monitorização contínua</li></ul>`
},
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'#000000',
  title:'DP01 · Disposição para Saúde Melhorada',
  sub:'Promoção da saúde · NHB: Saúde',
  body:`
  <div class="info-box"><b>NHB:</b> Saúde</div>
  <h4>Comportamentos desejados</h4>
  <ul><li>Adopção de estilo vida saudável</li><li>Exercício físico regular</li><li>Alimentação equilibrada</li><li>Compliance medicamentosa</li></ul>
  <h4>Intervenções</h4>
  <ul><li>Educação sobre factores de risco</li><li>Plano de exercício estruturado</li><li>Aconselhamento nutricional</li><li>Acompanhamento regular</li></ul>`
},
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'var(--azul-escuro)',
  title:'DP02 · Disposição para Cuidado Pessoal Melhorado',
  sub:'Promoção da saúde · NHB: Cuidado Pessoal',
  body:`
  <div class="info-box"><b>NHB:</b> Cuidado Pessoal</div>
  <h4>Comportamentos desejados</h4>
  <ul><li>Higiene pessoal autónoma</li><li>Aparência pessoal cuidada</li><li>Vestuário apropriado</li><li>Saúde oral optimizada</li></ul>
  <h4>Intervenções</h4>
  <ul><li>Educação sobre higiene</li><li>Ambientes facilitadores</li><li>Reforço positivo de comportamentos</li><li>Envolvimento da família</li></ul>`
},
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'#000000',
  title:'DP03 · Disposição para Comunicação Melhorada',
  sub:'Promoção da saúde · NHB: Comunicação',
  body:`
  <div class="info-box"><b>NHB:</b> Comunicação</div>
  <h4>Comportamentos desejados</h4>
  <ul><li>Expressão clara e coerente</li><li>Escuta activa</li><li>Relacionamento harmonioso</li><li>Resolução de conflitos</li></ul>
  <h4>Intervenções</h4>
  <ul><li>Treino de comunicação assertiva</li><li>Facilitação de diálogos família-paciente</li><li>Grupos de apoio</li><li>Mediação de conflitos</li></ul>`
},
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'var(--azul)',
  title:'NOC · Exemplos de Resultados por Domínio',
  sub:'Nursing Outcomes Classification — referência rápida',
  body:`
  <p>Descrições mensuráveis de estados, comportamentos ou percepções do cliente em relação aos diagnósticos de enfermagem e às intervenções.</p>
  <h4>Oxigenação</h4>
  <ul><li>Manutenção via aérea patente</li><li>Movimento torácico simétrico</li><li>Ausculta sem sons anormais</li><li>SatO2 ≥95% em ar ambiente</li><li>Sem uso músculos acessórios</li></ul>
  <h4>Circulação</h4>
  <ul><li>Pressão arterial dentro limites normais</li><li>Frequência cardíaca 60-100 bpm</li><li>Pulsos periféricos palpáveis bilaterais</li><li>Pele morna e com boa perfusão</li><li>Sem edema periférico</li></ul>
  <h4>Nutrição</h4>
  <ul><li>Peso corporal dentro 5% ideal</li><li>Ingestão proteica adequada</li><li>Albumina sérica 3.5-5.0 g/dL</li><li>Pré-albumina >20 mg/dL</li><li>Cicatrização de feridas apropriada</li></ul>
  <h4>Eliminação</h4>
  <ul><li>Padrão evacuatório normal</li><li>Consistência de fezes adequada</li><li>Micção sem incontinência</li><li>Débito urinário >0.5ml/kg/h</li><li>Urina clara e amarelada</li></ul>
`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'#000000',
  title:'NIC · Exemplos de Intervenções por Domínio Fisiológico',
  sub:'Nursing Interventions Classification — referência rápida',
  body:`
  <p>Ações e cuidados específicos realizados pelos enfermeiros para tratar diagnósticos de enfermagem e promover saúde.</p>
  <h4>Suporte Respiratório</h4>
  <ul><li>Monitorização contínua SatO2</li><li>Posicionamento Fowler elevada</li><li>Oxigenoterapia conforme prescrição</li><li>Aspiração endotraqueal conforme necessidade</li><li>Educação sobre respiração profunda</li></ul>
  <h4>Suporte Cardiovascular</h4>
  <ul><li>Monitorização contínua ECG</li><li>Medição pressão arterial 4/4h</li><li>Reposição volêmica conforme prescrição</li><li>Infusão medicações vasoativas</li><li>Repouso em cama com elevação membros</li></ul>
  <h4>Suporte Nutricional</h4>
  <ul><li>Avaliação estado nutricional semanal</li><li>Administração nutrição enteral/parenteral</li><li>Monitorização ingestão alimentos</li><li>Orientação dieta personalizada</li><li>Apoio psicossocial durante refeições</li></ul>
  <h4>Controle de Infecção</h4>
  <ul><li>Técnica asséptica rigorosa</li><li>Higiene das mãos 5 momentos</li><li>Isolamento de gotículas/contacto se indicado</li><li>Vigilância sinais inflamação</li><li>Colheita culturas conforme protocolo</li></ul>
`
},
{
  icon: ICON_EXAM, bg:'#e7ecf4', fg:'#000000',
  title:'Tabela Comparativa NOC vs NIC',
  sub:'Diferenças essenciais entre as duas classificações',
  body:`
  <table class="ref-table">
    <tr><th>Aspecto</th><th>NOC</th><th>NIC</th></tr>
    <tr><td>O quê?</td><td>Resultados esperados para o cliente</td><td>Ações do enfermeiro</td></tr>
    <tr><td>Quando?</td><td>Avaliação inicial e seguimento</td><td>Implementação contínua</td></tr>
    <tr><td>Foco</td><td>Cliente (estado de saúde)</td><td>Enfermeiro (ação)</td></tr>
    <tr><td>Mensuração</td><td>Escala de Likert (1-5)</td><td>Realização / Não realização</td></tr>
  </table>`
}
]);
buildAccordionView('bib-calc', 'Ferramentas Clínicas de Cálculo', 'Resumo das calculadoras disponíveis.', [
{
  icon: ICON_SCALE, bg:'#fbe4e8', fg:'#c8202f',
  title:'Ferramentas Clínicas de Cálculo · Referência',
  sub:'Resumo das calculadoras disponíveis em Ferramentas',
  body:`
  <p>As calculadoras interativas estão disponíveis em <b>Ferramentas → Calculadoras de Enfermagem</b>. Resumo das variáveis de entrada:</p>
  <table class="ref-table">
    <tr><th>Calculadora</th><th>Variáveis de entrada</th></tr>
    <tr><td>IMC Clínica</td><td>Peso (kg), Altura (m)</td></tr>
    <tr><td>Balanço Hídrico</td><td>Ingressos (mL), Saídas (mL)</td></tr>
    <tr><td>Dose por Peso</td><td>Peso (kg), Dose (mg/kg)</td></tr>
    <tr><td>Escala de Glasgow (GCS)</td><td>Abertura Ocular (1-4), Resposta Verbal (1-5), Resposta Motora (1-6)</td></tr>
  </table>`
}
]);

// Mover para as secções certas: diagnósticos/NOC/NIC -> Diagnósticos de Enfermagem; cálculo -> Cálculos de Enfermagem
(function(){
  function mover(tmpId, destViewId, titulo){
    var tmp=document.getElementById('view-'+tmpId), dest=document.getElementById('view-'+destViewId);
    if(!tmp||!dest) return;
    var wrap=document.createElement('div');
    wrap.id=destViewId+'-ref';
    var t=document.createElement('div');
    t.className='section-title'; t.style.marginTop='18px'; t.textContent=titulo;
    wrap.appendChild(t);
    tmp.querySelectorAll('.acc').forEach(function(a){ wrap.appendChild(a); });
    dest.appendChild(wrap);
    tmp.parentNode.removeChild(tmp);
  }
  mover('bib-diag','diagnosticos','Referência: Diagnósticos · NOC · NIC');
  mover('bib-calc','calculadora','Ferramentas Clínicas de Cálculo · Referência');
})();


