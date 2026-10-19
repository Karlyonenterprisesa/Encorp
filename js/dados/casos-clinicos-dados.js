// === data-casos-clinicos.js ===
// ===== dados/construção — casos-clinicos.html =====

buildAccordionView('casos-clinicos', 'Casos Clínicos', '20 casos clínicos detalhados para estudo do processo de enfermagem: dados clínicos, diagnósticos de enfermagem, intervenções (NIC) e resultados esperados (NOC). Material de estudo e apoio à prática — use sempre com julgamento clínico e protocolos institucionais.', [
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'#000000',
  title:'C001 · Enfarte Agudo do Miocárdio (EAM) com Supradesnivelamento ST',
  sub:'UTI Cardiológica · 58 anos',
  body:`  <div class="card-row"><b>Idade/Género:</b> 58 anos, M</div>
  <div class="card-row"><b>Área:</b> UTI Cardiológica</div>
  <p style="font-size:13px;margin:8px 0;">Paciente com dor torácica opressiva irradiada para braço esquerdo há 2h, sudorese fria, náuseas. ECG com supra de ST em parede anterior. Troponina elevada.</p>
  <div class="info-box"><b>NHB afetadas:</b> Oxigenação, Circulação, Dor, Psicosocial · <b>Evolução estimada:</b> 3-5 dias internamento</div>
  <b style="display:block;margin-top:10px;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Padrão Respiratório Ineficaz</li><li>Débito Cardíaco Diminuído</li><li>Dor Aguda</li><li>Ansiedade Moderada</li><li>Conhecimento Deficiente sobre Autocuidado</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Monitorização contínua ECG/SatO2</li><li>Posição semi-Fowler/Fowler</li><li>Oxigenoterapia conforme prescrição</li><li>Analgesia conforme protocolo agudo coronário</li><li>Educação sobre repouso e medicação</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
  <ul style="font-size:12.5px;margin:6px 0 0;"><li>SatO2 ≥95%</li><li>FC 60-100bpm</li><li>PA sistólica 90-140mmHg</li><li>Dor ≤3/10</li><li>Verbaliza compreensão de actividades permitidas</li></ul>
  <div class="caso-quiz" data-caso="C001"></div>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'var(--azul)',
  title:'C002 · Acidente Vascular Cerebral Isquémico - Hemiplegia à Direita',
  sub:'Internamento Neurologia · 72 anos',
  body:`  <div class="card-row"><b>Idade/Género:</b> 72 anos, F</div>
  <div class="card-row"><b>Área:</b> Internamento Neurologia</div>
  <p style="font-size:13px;margin:8px 0;">Paciente de 72 anos com antecedentes de HTA e fibrilhação auricular. Acordou com défice neurológico: paralisia flácida membro superior e inferior direitos, afasia de Broca, desvio da comissura labial à esquerda.</p>
  <div class="info-box"><b>NHB afetadas:</b> Movimento, Higiene, Comunicação, Pele/Integridade, Nutrição · <b>Evolução estimada:</b> 2-4 semanas internamento com reabilitação</div>
  <b style="display:block;margin-top:10px;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Mobilidade Física Limitada</li><li>Déficit de Autohigiene</li><li>Comunicação Verbal Prejudicada</li><li>Risco de Úlcera de Pressão</li><li>Padrão Alimentar Prejudicado</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Fisioterapia motora 2x/dia</li><li>Posicionamento cada 2h com almofadas</li><li>Colchão antiescaras desde admissão</li><li>Avaliação de deglutição conforme protocolo</li><li>Terapia da fala 1x/dia</li><li>Sonda NG com nutrição entérica</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
  <ul style="font-size:12.5px;margin:6px 0 0;"><li>Amplitude de movimento progressiva a grau 2-3</li><li>Sem sinais de hipotrofia</li><li>Sem úlceras de pressão</li><li>Alimentação por sonda NG com progressão conforme tolerado</li><li>Pele íntegra em zonas de pressão</li></ul>
  <div class="caso-quiz" data-caso="C002"></div>`
},
{
  icon: ICON_EXAM, bg:'#e7ecf4', fg:'#000000',
  title:'C003 · Asma Aguda Moderada - Exacerbação com Sibilância',
  sub:'Urgência/Medicina Interna · 34 anos',
  body:`  <div class="card-row"><b>Idade/Género:</b> 34 anos, F</div>
  <div class="card-row"><b>Área:</b> Urgência/Medicina Interna</div>
  <p style="font-size:13px;margin:8px 0;">Paciente com antecedentes de asma alérgica. Apresenta dispneia progressiva nas últimas 6h, sibilância difusa bilateral, redução do murmúrio vesicular nas bases, uso de músculos acessórios.</p>
  <div class="info-box"><b>NHB afetadas:</b> Oxigenação, Circulação, Psicosocial, Aprendizagem · <b>Evolução estimada:</b> 1-3 dias internamento com observação</div>
  <b style="display:block;margin-top:10px;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Padrão Respiratório Ineficaz</li><li>Troca Gasosa Prejudicada</li><li>Ansiedade Moderada</li><li>Intolerância à Actividade</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Posição Fowler elevada</li><li>Oxigenoterapia conforme resultado da SpO2</li><li>Inalações com broncodilatadores prescritos</li><li>Corticoides sistémicos conforme protocolo</li><li>Hidratação venosa</li><li>Educação sobre desencadeantes de asma</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
  <ul style="font-size:12.5px;margin:6px 0 0;"><li>SatO2 ≥95%</li><li>FR 16-20/min</li><li>Desaparecimento de sibilância</li><li>Sem uso de músculos acessórios</li><li>Verbaliza redução de ansiedade</li></ul>
  <div class="caso-quiz" data-caso="C003"></div>`
},
{
  icon: ICON_ALERT, bg:'#fbe4e8', fg:'#c8202f',
  title:'C004 · Insuficiência Renal Aguda KDIGO Estádio 3 - Pós-Cirurgia',
  sub:'UTI Cirúrgica · 68 anos',
  body:`  <div class="card-row"><b>Idade/Género:</b> 68 anos, M</div>
  <div class="card-row"><b>Área:</b> UTI Cirúrgica</div>
  <p style="font-size:13px;margin:8px 0;">Paciente pós cirurgia cardiotorácica dia 2. Creatinina sérica triplicou em 48h (1.2 para 3.6 mg/dL), oligúria (<400ml/24h), edema periférico progressivo, elevação de ureia.</p>
  <div class="info-box"><b>NHB afetadas:</b> Eliminação, Hidratação, Nutrição, Infecção · <b>Evolução estimada:</b> 5-7 dias com possibilidade de diálise</div>
  <b style="display:block;margin-top:10px;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Volume Líquido Excessivo</li><li>Déficit Nutritivo</li><li>Risco de Infecção</li><li>Padrão de Eliminação Prejudicado</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Restrição hídrica conforme débito urinário</li><li>Monitorização rigorosa de ingressos/saídas</li><li>Diálise conforme prescrição do nefrologista</li><li>Dieta renal restrita em potássio/fósforo</li><li>Sonda vesical com medição rigorosa</li><li>Vigilância de sinais de inflamação</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
  <ul style="font-size:12.5px;margin:6px 0 0;"><li>Débito urinário >0.5ml/kg/h</li><li>Peso corporal estável</li><li>Creatinina progressivamente inferior a 2.0</li><li>Sem sinais de infecção urinária</li><li>Equilíbrio electrolítico normalizado</li></ul>
  <div class="caso-quiz" data-caso="C004"></div>`
},
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'#000000',
  title:'C005 · Diabetes Tipo 2 Descompensada - Cetoacidose',
  sub:'Urgência/Medicina Interna · 45 anos',
  body:`  <div class="card-row"><b>Idade/Género:</b> 45 anos, F</div>
  <div class="card-row"><b>Área:</b> Urgência/Medicina Interna</div>
  <p style="font-size:13px;margin:8px 0;">Paciente diabética conhecida, sem adesão medicamentosa. Apresenta polidipsia, poliúria, cansaço extremo, hálito cetónico, taquipneia (FR 28/min), estado confusional.</p>
  <div class="info-box"><b>NHB afetadas:</b> Nutrição, Hidratação, Circulação, Psicosocial, Aprendizagem · <b>Evolução estimada:</b> 3-5 dias internamento com educação contínua</div>
  <b style="display:block;margin-top:10px;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Défice de Conhecimento sobre Diabetes</li><li>Nutrição Desequilibrada</li><li>Débito Cardíaco Diminuído</li><li>Processos de Pensamento Alterados</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Insulina IV conforme protocolo de cetoacidose</li><li>Expansão volémica com soros</li><li>Correção electrolítica progressiva</li><li>Monitorização contínua da glicemia capilar</li><li>Educação estruturada sobre diabetes</li><li>Referenciação a endocrinologia e nutrição</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
  <ul style="font-size:12.5px;margin:6px 0 0;"><li>Glicemia 120-180 mg/dL</li><li>pH arterial >7.35</li><li>Bicarbonato >18 mEq/L</li><li>Sem hálito cetónico</li><li>Verbaliza compreensão sobre a diabetes</li></ul>
  <div class="caso-quiz" data-caso="C005"></div>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'var(--azul)',
  title:'C006 · Pneumonia Nosocomial Adquirida em UTI - VAP',
  sub:'UTI Geral · 76 anos',
  body:`  <div class="card-row"><b>Idade/Género:</b> 76 anos, M</div>
  <div class="card-row"><b>Área:</b> UTI Geral</div>
  <p style="font-size:13px;margin:8px 0;">Paciente intubado há 8 dias por insuficiência respiratória. Febre (39.2°C), tosse com exsudato purulento, leucocitose 15.000, infiltrado novo na radiografia torácica bilateral.</p>
  <div class="info-box"><b>NHB afetadas:</b> Oxigenação, Circulação, Temperatura, Infecção · <b>Evolução estimada:</b> 7-10 dias com possível desmame respiratório</div>
  <b style="display:block;margin-top:10px;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Padrão Respiratório Ineficaz</li><li>Troca Gasosa Prejudicada</li><li>Hipertermia</li><li>Risco de Infecção Disseminada</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Aspiração endotraqueal conforme necessidade</li><li>Elevação da cabeceira a 30°</li><li>Mudanças posicionais a cada 2h</li><li>Antibioterapia de largo espectro</li><li>Antitérmicos</li><li>Higiene oral com clorexidina</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
  <ul style="font-size:12.5px;margin:6px 0 0;"><li>Temperatura <37.5°C</li><li>Ventilação adequada com sincronismo</li><li>SatO2 ≥95%</li><li>Cultura de secreções negativa em 72h</li><li>Leucócitos <12.000</li></ul>
  <div class="caso-quiz" data-caso="C006"></div>`
},
{
  icon: ICON_EXAM, bg:'#e7ecf4', fg:'#000000',
  title:'C007 · Cirrose Hepática Descompensada - Encefalopatia Hepática',
  sub:'Internamento Gastroenterologia · 62 anos',
  body:`  <div class="card-row"><b>Idade/Género:</b> 62 anos, M</div>
  <div class="card-row"><b>Área:</b> Internamento Gastroenterologia</div>
  <p style="font-size:13px;margin:8px 0;">Paciente com cirrose por consumo de álcool. Apresenta confusão mental, asterixis, halitose com odor fecal, palma eritematosa, esplenomegalia palpável, ascite tensa.</p>
  <div class="info-box"><b>NHB afetadas:</b> Processos de Pensamento, Circulação, Hidratação, Nutrição, Psicosocial · <b>Evolução estimada:</b> 1-2 semanas internamento com observação</div>
  <b style="display:block;margin-top:10px;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Processos de Pensamento Alterados</li><li>Risco de Hemorragia Digestiva</li><li>Volume Líquido Excessivo</li><li>Nutrição Desequilibrada</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Lactulose oral conforme protocolo</li><li>Vigilância de sinais de ingestão alcoólica</li><li>Endoscopia preventiva se varizes</li><li>Dieta com restrição proteica (80g) e sal</li><li>Diuréticos conforme prescrição</li><li>Educação sobre abstinência alcoólica</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
  <ul style="font-size:12.5px;margin:6px 0 0;"><li>Orientação temporal e espacial recuperada</li><li>Sem asterixis</li><li>Sem hematemese/melenas</li><li>Ascite controlada</li><li>Albumina plasmática >3.0 g/dL</li></ul>
  <div class="caso-quiz" data-caso="C007"></div>`
},
{
  icon: ICON_ALERT, bg:'#fbe4e8', fg:'#c8202f',
  title:'C008 · Fratura do Fémur - Idosa com Comorbilidades',
  sub:'Ortopedia/Cuidados Agudos · 84 anos',
  body:`  <div class="card-row"><b>Idade/Género:</b> 84 anos, F</div>
  <div class="card-row"><b>Área:</b> Ortopedia/Cuidados Agudos</div>
  <p style="font-size:13px;margin:8px 0;">Idosa após queda em casa. Fratura intracapsular do fémur esquerdo. Apresenta dor intensa, edema, equimose, deformidade em rotação externa, incapacidade de suportar peso.</p>
  <div class="info-box"><b>NHB afetadas:</b> Dor, Movimento, Pele/Integridade, Circulação, Higiene · <b>Evolução estimada:</b> 5-7 dias com posterior internamento em ortopedia</div>
  <b style="display:block;margin-top:10px;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Dor Aguda</li><li>Mobilidade Física Limitada</li><li>Risco de Úlcera de Pressão</li><li>Risco de Trombose</li><li>Défice de Autohigiene</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Analgesia conforme protocolo</li><li>Imobilização com tala/tração</li><li>Colchão antiescaras desde a admissão</li><li>Meias de compressão bilaterais</li><li>Exercícios de perna conforme tolerância</li><li>Preparação para cirurgia/internamento ortopédico</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
  <ul style="font-size:12.5px;margin:6px 0 0;"><li>Dor ≤3/10</li><li>Membro imobilizado corretamente</li><li>Pulsos distais palpáveis</li><li>Pele íntegra</li><li>Realiza atividades de higiene com ajuda</li></ul>
  <div class="caso-quiz" data-caso="C008"></div>`
},
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'#000000',
  title:'C009 · Tromboembolismo Pulmonar - Sintomas de Início Agudo',
  sub:'Urgência/UTI Respiratória · 55 anos',
  body:`  <div class="card-row"><b>Idade/Género:</b> 55 anos, F</div>
  <div class="card-row"><b>Área:</b> Urgência/UTI Respiratória</div>
  <p style="font-size:13px;margin:8px 0;">Paciente imobilizada em cama há 2 semanas por pneumonia. Dispneia súbita, dor pleural, síncope, taquicardia (FC 115), taquipneia (FR 32), queda de SatO2.</p>
  <div class="info-box"><b>NHB afetadas:</b> Oxigenação, Circulação, Dor, Psicosocial · <b>Evolução estimada:</b> 5-7 dias internamento com anticoagulação</div>
  <b style="display:block;margin-top:10px;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Padrão Respiratório Ineficaz</li><li>Troca Gasosa Prejudicada</li><li>Débito Cardíaco Diminuído</li><li>Medo/Ansiedade Aguda</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Oxigenoterapia em máscara não reinalante</li><li>Monitorização ECG contínua</li><li>Anticoagulação (heparina IV) conforme protocolo</li><li>Avaliação para trombólise/embolectomia</li><li>Repouso absoluto no leito</li><li>Suporte emocional com presença reconfortante</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
  <ul style="font-size:12.5px;margin:6px 0 0;"><li>SatO2 ≥94%</li><li>FR 16-20/min</li><li>FC 60-100bpm</li><li>Ausência de síncopes recorrentes</li><li>Verbaliza redução do medo</li></ul>
  <div class="caso-quiz" data-caso="C009"></div>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'var(--azul)',
  title:'C010 · Sépsis por Infecção do Trato Urinário - Idosa',
  sub:'Urgência/Internamento Medicina · 79 anos',
  body:`  <div class="card-row"><b>Idade/Género:</b> 79 anos, F</div>
  <div class="card-row"><b>Área:</b> Urgência/Internamento Medicina</div>
  <p style="font-size:13px;margin:8px 0;">Idosa com sonda vesical de demora. Desorientação aguda, hipertermia (39.8°C), taquicardia, taquipneia, urina turva com odor fétido, PA sistólica 95mmHg.</p>
  <div class="info-box"><b>NHB afetadas:</b> Infecção, Circulação, Temperatura, Eliminação, Processos de Pensamento · <b>Evolução estimada:</b> 7-10 dias internamento com vigilância intensiva</div>
  <b style="display:block;margin-top:10px;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Infecção Sistémica (Sépsis)</li><li>Processos de Pensamento Alterados</li><li>Débito Cardíaco Diminuído</li><li>Hipertermia</li><li>Risco de Choque Séptico</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Antibioterapia IV conforme hemocultura</li><li>Hidratação vigorosa com soros cristaloides</li><li>Vasopressores se hipotensão refratária</li><li>Remoção de sonda vesical/cateterismo intermitente</li><li>Medições 4/4h dos parâmetros de sépsis</li><li>Vigilância rigorosa dos sinais vitais</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
  <ul style="font-size:12.5px;margin:6px 0 0;"><li>Orientação recuperada</li><li>Temperatura <37.5°C</li><li>PA >100mmHg</li><li>Lactato <2mmol/L</li><li>Cultura de urina negativa em 48h</li></ul>
  <div class="caso-quiz" data-caso="C010"></div>`
},
{
  icon: ICON_EXAM, bg:'#e7ecf4', fg:'#000000',
  title:'C011 · Pancreatite Aguda Severa',
  sub:'UTI Digestiva · 52 anos',
  body:`  <div class="card-row"><b>Idade/Género:</b> 52 anos, M</div>
  <div class="card-row"><b>Área:</b> UTI Digestiva</div>
  <p style="font-size:13px;margin:8px 0;">Dor epigástrica radiante, lipase >3000, edema pancreático, derrame pleural bilateral.</p>
  <div class="info-box"><b>NHB afetadas:</b> Dor, Nutrição, Circulação · <b>Evolução estimada:</b> 7-14 dias</div>
  <b style="display:block;margin-top:10px;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Dor Aguda Severa</li><li>Nutrição Desequilibrada</li><li>Volume Líquido Excessivo</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Analgesia potente</li><li>Nutrição parentérica se jejum prolongado</li><li>Monitorização de amilase/lipase</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
  <ul style="font-size:12.5px;margin:6px 0 0;"><li>Dor <4/10</li><li>Enzimas pancreáticas normalizadas</li><li>Peso estável</li></ul>
  <div class="caso-quiz" data-caso="C011"></div>`
},
{
  icon: ICON_ALERT, bg:'#fbe4e8', fg:'#c8202f',
  title:'C012 · Hemorragia Digestiva Alta Varicosa',
  sub:'Urgência Endoscopia · 58 anos',
  body:`  <div class="card-row"><b>Idade/Género:</b> 58 anos, M</div>
  <div class="card-row"><b>Área:</b> Urgência Endoscopia</div>
  <p style="font-size:13px;margin:8px 0;">Hematemese volumosa, melenas, tensão de choque, hipotensão 80/50.</p>
  <div class="info-box"><b>NHB afetadas:</b> Circulação, Eliminação · <b>Evolução estimada:</b> 3-5 dias</div>
  <b style="display:block;margin-top:10px;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Débito Cardíaco Diminuído</li><li>Risco de Choque</li><li>Medo Agudo</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Acesso venoso de grande calibre</li><li>Transfusão conforme prescrição</li><li>Endoscopia emergente com ligadura</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
  <ul style="font-size:12.5px;margin:6px 0 0;"><li>PA sistólica >90mmHg</li><li>Hemoglobina estável >7g/dL</li><li>Hemostase endoscópica</li></ul>
  <div class="caso-quiz" data-caso="C012"></div>`
},
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'#000000',
  title:'C013 · Queimadura de 2º Grau Extensa (20% SCQ)',
  sub:'UTI de Queimados · 44 anos',
  body:`  <div class="card-row"><b>Idade/Género:</b> 44 anos, F</div>
  <div class="card-row"><b>Área:</b> UTI de Queimados</div>
  <p style="font-size:13px;margin:8px 0;">Queimadura por líquido quente. Bolhas, eritema intenso, dor severa, edema progressivo.</p>
  <div class="info-box"><b>NHB afetadas:</b> Dor, Pele/Integridade, Circulação · <b>Evolução estimada:</b> 10-30 dias</div>
  <b style="display:block;margin-top:10px;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Dor Aguda Severa</li><li>Risco de Infecção</li><li>Défice de Volume Líquido/Hipovolemia</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Limpeza e desbridamento</li><li>Antibióticos tópicos</li><li>Hidratação agressiva (fórmula de Parkland)</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
  <ul style="font-size:12.5px;margin:6px 0 0;"><li>Dor ≤4/10</li><li>Feridas cicatrizadas sem infecção</li><li>Cicatrização progressiva</li></ul>
  <div class="caso-quiz" data-caso="C013"></div>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'var(--azul)',
  title:'C014 · Asma Severa Refratária - Status Asmaticus',
  sub:'UTI Respiratória · 28 anos',
  body:`  <div class="card-row"><b>Idade/Género:</b> 28 anos, M</div>
  <div class="card-row"><b>Área:</b> UTI Respiratória</div>
  <p style="font-size:13px;margin:8px 0;">Sem resposta a broncodilatadores após 1h. Cansaço, redução progressiva do murmúrio, silêncio auscultatório.</p>
  <div class="info-box"><b>NHB afetadas:</b> Oxigenação · <b>Evolução estimada:</b> 1-3 dias</div>
  <b style="display:block;margin-top:10px;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Padrão Respiratório Ineficaz</li><li>Troca Gasosa Criticamente Prejudicada</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Intubação se necessário</li><li>Agonistas beta IV</li><li>Corticoides IV</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
  <ul style="font-size:12.5px;margin:6px 0 0;"><li>SatO2 >90%</li><li>Intubação evitada</li></ul>
  <div class="caso-quiz" data-caso="C014"></div>`
},
{
  icon: ICON_EXAM, bg:'#e7ecf4', fg:'#000000',
  title:'C015 · AVC Hemorrágico com Edema Cerebral',
  sub:'UTI Neurologia · 65 anos',
  body:`  <div class="card-row"><b>Idade/Género:</b> 65 anos, F</div>
  <div class="card-row"><b>Área:</b> UTI Neurologia</div>
  <p style="font-size:13px;margin:8px 0;">Cefaleia súbita, vómitos, défice neurológico progressivo, miose bilateral.</p>
  <div class="info-box"><b>NHB afetadas:</b> Processos de Pensamento, Movimento · <b>Evolução estimada:</b> 5-10 dias</div>
  <b style="display:block;margin-top:10px;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Processos de Pensamento Alterados</li><li>Risco de Herniação Encefálica</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Elevação da cabeceira a 30°</li><li>Osmoterapia com manitol</li><li>Vigilância contínua da PIC</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
  <ul style="font-size:12.5px;margin:6px 0 0;"><li>Pressão intracraniana <20mmHg</li><li>Escala de Glasgow estável</li></ul>
  <div class="caso-quiz" data-caso="C015"></div>`
},
{
  icon: ICON_ALERT, bg:'#fbe4e8', fg:'#c8202f',
  title:'C016 · Insuficiência Cardíaca Aguda Descompensada',
  sub:'Internamento Cardiologia · 72 anos',
  body:`  <div class="card-row"><b>Idade/Género:</b> 72 anos, M</div>
  <div class="card-row"><b>Área:</b> Internamento Cardiologia</div>
  <p style="font-size:13px;margin:8px 0;">Dispneia ortopneica, edema pulmonar, galope cardíaco, PVJ elevada.</p>
  <div class="info-box"><b>NHB afetadas:</b> Circulação, Oxigenação · <b>Evolução estimada:</b> 3-5 dias</div>
  <b style="display:block;margin-top:10px;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Débito Cardíaco Diminuído</li><li>Padrão Respiratório Ineficaz</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>CPAP se necessário</li><li>Diuréticos IV</li><li>IECA/Betabloqueadores</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
  <ul style="font-size:12.5px;margin:6px 0 0;"><li>SatO2 >95%</li><li>BNP normalizado progressivamente</li></ul>
  <div class="caso-quiz" data-caso="C016"></div>`
},
{
  icon: ICON_SCALE, bg:'#e7ecf4', fg:'#000000',
  title:'C017 · Meningite Bacteriana - Neisseria meningitidis',
  sub:'UTI Infecciologia · 32 anos',
  body:`  <div class="card-row"><b>Idade/Género:</b> 32 anos, F</div>
  <div class="card-row"><b>Área:</b> UTI Infecciologia</div>
  <p style="font-size:13px;margin:8px 0;">Febre 40°C, rigidez de nuca, fotofobia, púrpura petequial, confusão.</p>
  <div class="info-box"><b>NHB afetadas:</b> Temperatura, Psicosocial, Infecção · <b>Evolução estimada:</b> 7-14 dias</div>
  <b style="display:block;margin-top:10px;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Hipertermia</li><li>Processos de Pensamento Alterados</li><li>Risco de Sépsis</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Antibioterapia emergente IV</li><li>Isolamento de gotículas</li><li>Antitérmicos</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
  <ul style="font-size:12.5px;margin:6px 0 0;"><li>Temperatura <37.5°C</li><li>Consciência clara</li><li>Cultura negativa</li></ul>
  <div class="caso-quiz" data-caso="C017"></div>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'var(--azul)',
  title:'C018 · Intoxicação Medicamentosa - Sobredosagem de Benzodiazepinas',
  sub:'Urgência Toxicologia · 48 anos',
  body:`  <div class="card-row"><b>Idade/Género:</b> 48 anos, F</div>
  <div class="card-row"><b>Área:</b> Urgência Toxicologia</div>
  <p style="font-size:13px;margin:8px 0;">Sedação progressiva, depressão respiratória FR 10/min, miose pupilar reduzida.</p>
  <div class="info-box"><b>NHB afetadas:</b> Oxigenação, Processos de Pensamento · <b>Evolução estimada:</b> 1-2 dias</div>
  <b style="display:block;margin-top:10px;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Padrão Respiratório Ineficaz</li><li>Processos de Pensamento Alterados</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Ventilação mecânica se necessário</li><li>Flumazenil conforme protocolo</li><li>Suporte cardiorrespiratório</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
  <ul style="font-size:12.5px;margin:6px 0 0;"><li>FR >12/min espontânea</li><li>Consciência lúcida</li></ul>
  <div class="caso-quiz" data-caso="C018"></div>`
},
{
  icon: ICON_EXAM, bg:'#e7ecf4', fg:'#000000',
  title:'C019 · Carcinoma Pulmonar Avançado com Metástases Ósseas',
  sub:'Cuidados Paliativos/Oncologia · 68 anos',
  body:`  <div class="card-row"><b>Idade/Género:</b> 68 anos, M</div>
  <div class="card-row"><b>Área:</b> Cuidados Paliativos/Oncologia</div>
  <p style="font-size:13px;margin:8px 0;">Dispneia progressiva, tosse seca, hemoptises, dor óssea severa, astenia.</p>
  <div class="info-box"><b>NHB afetadas:</b> Dor, Oxigenação, Nutrição, Espiritualidade · <b>Evolução estimada:</b> Cronicidade com cuidados paliativos</div>
  <b style="display:block;margin-top:10px;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Dor Aguda/Crónica</li><li>Padrão Respiratório Prejudicado</li><li>Nutrição Desequilibrada</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Analgesia conforme escada analgésica da OMS</li><li>Cuidados psicológicos/espirituais</li><li>Educação sobre a doença avançada</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
  <ul style="font-size:12.5px;margin:6px 0 0;"><li>Dor <4/10</li><li>Conforto melhorado</li><li>Dignidade mantida</li></ul>
  <div class="caso-quiz" data-caso="C019"></div>`
},
{
  icon: ICON_ALERT, bg:'#fbe4e8', fg:'#c8202f',
  title:'C020 · Transtorno Bipolar Tipo I - Episódio Maníaco Severo',
  sub:'Psiquiatria · 36 anos',
  body:`  <div class="card-row"><b>Idade/Género:</b> 36 anos, F</div>
  <div class="card-row"><b>Área:</b> Psiquiatria</div>
  <p style="font-size:13px;margin:8px 0;">Elevação anormal do humor, fuga de ideias, comportamento desinibido, agressividade, sem necessidade aparente de sono.</p>
  <div class="info-box"><b>NHB afetadas:</b> Processos de Pensamento, Psicosocial, Sono/Repouso · <b>Evolução estimada:</b> 2-4 semanas internamento</div>
  <b style="display:block;margin-top:10px;color:var(--azul-escuro);font-size:12.5px;">Diagnósticos de Enfermagem</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Processos de Pensamento Alterados</li><li>Comportamento Agressivo Potencial</li><li>Comunicação Alterada</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Intervenções de Enfermagem (NIC)</b>
  <ul style="font-size:12.5px;margin:6px 0 10px;"><li>Estabilizadores de humor (lítio)</li><li>Estrutura ambiental clara</li><li>Terapia psicossocial estruturada</li></ul>
  <b style="display:block;color:var(--azul-escuro);font-size:12.5px;">Resultados Esperados (NOC)</b>
  <ul style="font-size:12.5px;margin:6px 0 0;"><li>Pensamento organizado</li><li>Comportamento controlado</li><li>Adesão medicamentosa</li></ul>
  <div class="caso-quiz" data-caso="C020"></div>`
}
]);


