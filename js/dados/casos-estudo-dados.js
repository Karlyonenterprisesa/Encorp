// === data-casos-estudo.js ===
// ===== data-casos-estudo.js =====
// Base de dados única dos 20 casos clínicos robustos, usada em TODO o Modo Estudante
// (Casos Clínicos interactivos, Testes temáticos e Simulação). Cada caso reutiliza a
// riqueza clínica da secção "Casos Clínicos" do menu principal, mas em formato de
// estudo: apresentação → raciocínio prioritário revelável → diagnósticos/NOC/NIC →
// 5 perguntas próprias (as 3 primeiras alimentam também a Simulação passo-a-passo).

const CASOS_ESTUDO = [
{
  id:'C001', icon:'ICON_SCALE', bg:'#e7ecf4', fg:'#000000',
  titulo:'C001 · Enfarte Agudo do Miocárdio com Supra ST', area:'UTI Cardiológica', idade:'58 anos, M',
  apresentacao:'Homem de 58 anos admitido com dor torácica opressiva irradiada para o braço esquerdo há 2h, sudorese fria e náuseas. ECG com supradesnivelamento de ST em parede anterior; troponina elevada. FC 96bpm, PA 150/95mmHg, SpO₂ 94%. NHB afectadas: Oxigenação, Circulação, Dor, Psicosocial. Evolução estimada: 3–5 dias de internamento.',
  raciocinio:'Prioridade fisiológica (ABC): <b>Débito Cardíaco Diminuído</b> relacionado com alteração da contractilidade por isquemia miocárdica, evidenciado por dor torácica, supra de ST e troponina elevada — o risco de arritmia/instabilidade hemodinâmica precede a gestão da dor e da ansiedade.',
  diagnosticos:['Débito Cardíaco Diminuído','Padrão Respiratório Ineficaz','Dor Aguda','Ansiedade Moderada','Conhecimento Deficiente sobre Autocuidado'],
  noc:['SatO2 ≥95%','FC 60-100bpm','PA sistólica 90-140mmHg','Dor ≤3/10','Verbaliza compreensão de actividades permitidas'],
  nic:['Monitorização contínua ECG/SatO2','Posição semi-Fowler/Fowler','Oxigenoterapia conforme prescrição','Analgesia conforme protocolo agudo coronário','Educação sobre repouso e medicação'],
  perguntas:[
    { q:'Qual o diagnóstico de enfermagem prioritário neste doente?', opts:['Ansiedade Moderada','Débito Cardíaco Diminuído','Défice de Conhecimento','Padrão Respiratório Ineficaz'], correta:1 },
    { q:'Qual resultado (NOC) reflecte estabilização hemodinâmica adequada?', opts:['SatO2 ≥95% apenas','PA sistólica 90-140mmHg e FC 60-100bpm','Dor 0/10 imediata','Ausência total de ansiedade'], correta:1 },
    { q:'Qual a intervenção (NIC) prioritária nas primeiras horas?', opts:['Educação sobre dieta hipossódica','Monitorização contínua ECG/SpO2 e analgesia conforme protocolo','Fisioterapia respiratória intensiva','Restrição hídrica rigorosa'], correta:1 },
    { q:'Qual exame confirma necrose miocárdica neste doente?', opts:['Hemograma completo','Troponina sérica elevada','Glicemia capilar','Ureia e creatinina'], correta:1 },
    { q:'Qual a posição mais adequada para este doente?', opts:['Decúbito dorsal plano','Posição semi-Fowler/Fowler','Trendelenburg','Decúbito ventral'], correta:1 }
  ]
},
{
  id:'C002', icon:'ICON_PROC', bg:'#e7ecf4', fg:'var(--azul)',
  titulo:'C002 · AVC Isquémico — Hemiplegia à Direita', area:'Internamento Neurologia', idade:'72 anos, F',
  apresentacao:'Mulher de 72 anos, antecedentes de HTA e fibrilhação auricular, acordou com défice neurológico: paralisia flácida do membro superior e inferior direitos, afasia de Broca, desvio da comissura labial à esquerda. PA 178/102mmHg, FC irregular 110bpm, Glasgow 13. NHB afectadas: Movimento, Higiene, Comunicação, Pele/Integridade, Nutrição. Evolução estimada: 2–4 semanas com reabilitação.',
  raciocinio:'Antes de qualquer via oral, a prioridade é despistar <b>Risco de Aspiração</b> relacionado com disfagia por défice neurológico — a afasia e a paralisia orofacial tornam a deglutição insegura, e a aspiração pode ser fatal se não for antecipada.',
  diagnosticos:['Risco de Aspiração','Mobilidade Física Limitada','Défice de Autocuidado para Higiene','Comunicação Verbal Prejudicada','Risco de Úlcera de Pressão'],
  noc:['Deglutição segura sem sinais de aspiração','Amplitude de movimento progressiva','Pele íntegra em zonas de pressão','Comunicação eficaz por meios alternativos'],
  nic:['Avaliação da deglutição antes de qualquer via oral','Fisioterapia motora 2x/dia','Posicionamento a cada 2h com colchão antiescaras','Terapia da fala diária','Sonda NG se deglutição insegura'],
  perguntas:[
    { q:'Antes de iniciar dieta oral numa doente com afasia de Broca, que diagnóstico deve ser despistado primeiro?', opts:['Ansiedade Moderada','Risco de Aspiração','Conhecimento Deficiente','Dor Aguda'], correta:1 },
    { q:'Qual o resultado esperado mais relevante nas primeiras 24h?', opts:['Doente caminha sem apoio','Deglutição segura, sem sinais de aspiração','Fala fluente recuperada','Ausência de febre'], correta:1 },
    { q:'Que intervenção deve preceder qualquer alimentação por via oral?', opts:['Fisioterapia motora','Avaliação da deglutição','Terapia da fala','Colocação de colchão antiescaras'], correta:1 },
    { q:'Qual o principal factor de risco identificado nesta doente para o AVC isquémico?', opts:['Asma','Fibrilhação auricular e hipertensão','Diabetes tipo 1','Tabagismo apenas'], correta:1 },
    { q:'Qual a frequência recomendada de mudança de posicionamento para prevenir úlceras de pressão?', opts:['A cada 30 minutos','A cada 2 horas','A cada 12 horas','Apenas 1x/dia'], correta:1 }
  ]
},
{
  id:'C003', icon:'ICON_EXAM', bg:'#e7ecf4', fg:'#000000',
  titulo:'C003 · Asma Aguda Moderada', area:'Urgência/Medicina Interna', idade:'34 anos, F',
  apresentacao:'Mulher de 34 anos, asma alérgica conhecida, dispneia progressiva nas últimas 6h, sibilância difusa bilateral, murmúrio vesicular diminuído nas bases, uso de músculos acessórios. FR 26cpm, PFE 60% do previsto. NHB afectadas: Oxigenação, Circulação, Psicosocial, Aprendizagem. Evolução estimada: 1–3 dias de observação.',
  raciocinio:'<b>Padrão Respiratório Ineficaz</b> relacionado com broncoespasmo, evidenciado por sibilância, uso de músculos acessórios e taquipneia — a via aérea/ventilação precede a gestão da ansiedade associada.',
  diagnosticos:['Padrão Respiratório Ineficaz','Troca Gasosa Prejudicada','Ansiedade Moderada','Intolerância à Actividade'],
  noc:['SatO2 ≥95%','FR 16-20/min','Desaparecimento de sibilância','Sem uso de músculos acessórios','Verbaliza redução de ansiedade'],
  nic:['Posição Fowler elevada','Oxigenoterapia conforme SpO2','Inalações com broncodilatadores prescritos','Corticoides sistémicos conforme protocolo','Educação sobre desencadeantes de asma'],
  perguntas:[
    { q:'Doente com sibilância difusa, FR 26 e uso de músculos acessórios — qual o diagnóstico prioritário?', opts:['Ansiedade Moderada','Padrão Respiratório Ineficaz','Intolerância à Actividade','Conhecimento Deficiente'], correta:1 },
    { q:'Qual o valor de SpO2 definido como resultado esperado?', opts:['≥85%','≥90%','≥95%','100% obrigatório'], correta:2 },
    { q:'Qual a intervenção inicial mais indicada?', opts:['Deitar em decúbito dorsal','Posição de Fowler elevada e oxigenoterapia','Restrição hídrica','Repouso absoluto sem broncodilatador'], correta:1 },
    { q:'Que classe farmacológica é administrada por via inalatória como 1ª linha na crise?', opts:['Antibióticos','Broncodilatadores beta-agonistas de curta acção','Diuréticos','Anticoagulantes'], correta:1 },
    { q:'Que outra classe é frequentemente associada no tratamento da exacerbação?', opts:['Corticoides sistémicos','Insulina','Vasopressores','Anticoagulantes'], correta:0 }
  ]
},
{
  id:'C004', icon:'ICON_ALERT', bg:'#fbe4e8', fg:'#c8202f',
  titulo:'C004 · Insuficiência Renal Aguda KDIGO 3', area:'UTI Cirúrgica', idade:'68 anos, M',
  apresentacao:'Homem de 68 anos, pós cirurgia cardiotorácica dia 2. Creatinina triplicou em 48h (1.2→3.6mg/dL), oligúria (<400ml/24h), edema periférico progressivo, ureia elevada. Na 132, K 5.8, ureia 98. NHB afectadas: Eliminação, Hidratação, Nutrição, Infecção. Evolução estimada: 5–7 dias, possível diálise.',
  raciocinio:'<b>Volume Líquido Excessivo</b> relacionado com diminuição da filtração glomerular, evidenciado por oligúria e edema progressivo — associado a risco imediato de hipercaliemia com potencial arrítmico.',
  diagnosticos:['Volume Líquido Excessivo','Risco de Desequilíbrio Electrolítico','Défice Nutritivo','Risco de Infecção','Padrão de Eliminação Prejudicado'],
  noc:['Débito urinário >0.5ml/kg/h','Peso corporal estável','Creatinina progressivamente <2.0','Equilíbrio electrolítico normalizado'],
  nic:['Restrição hídrica conforme débito urinário','Monitorização rigorosa de ingressos/saídas','Diálise conforme prescrição do nefrologista','Dieta renal restrita em potássio/fósforo','Vigilância cardíaca pela hipercaliemia'],
  perguntas:[
    { q:'Doente oligúrico, edema progressivo e creatinina a triplicar — qual o diagnóstico prioritário?', opts:['Défice Nutritivo','Volume Líquido Excessivo','Risco de Infecção','Padrão de Eliminação Prejudicado'], correta:1 },
    { q:'Qual o valor de débito urinário definido como meta?', opts:['<0.3ml/kg/h','>0.5ml/kg/h','Sem meta definida','>5ml/kg/h'], correta:1 },
    { q:'Perante a hipercaliemia associada, qual a intervenção prioritária?', opts:['Aumentar o potássio na dieta','Monitorização cardíaca e preparação para correcção da hipercaliemia','Suspender toda a monitorização','Mobilizar o doente sem mais cuidados'], correta:1 },
    { q:'Qual electrólito está classicamente elevado e representa risco de arritmia na IRA?', opts:['Sódio','Potássio','Cloro','Magnésio baixo'], correta:1 },
    { q:'Que tipo de dieta é geralmente indicada na insuficiência renal aguda?', opts:['Rica em potássio e fósforo','Restrita em potássio e fósforo','Hiperprotéica sem restrição','Rica em sódio'], correta:1 }
  ]
},
{
  id:'C005', icon:'ICON_SCALE', bg:'#e7ecf4', fg:'#000000',
  titulo:'C005 · Cetoacidose Diabética', area:'Urgência/Medicina Interna', idade:'45 anos, F',
  apresentacao:'Mulher de 45 anos, diabética conhecida, sem adesão medicamentosa. Polidipsia, poliúria, cansaço extremo, hálito cetónico, taquipneia (FR 28/min), confusão. Glicemia 480mg/dL, pH 7.18. NHB afectadas: Nutrição, Hidratação, Circulação, Psicosocial, Aprendizagem. Evolução estimada: 3–5 dias com educação contínua.',
  raciocinio:'<b>Processos de Pensamento Alterados</b> relacionado com desequilíbrio metabólico (acidose/hiperglicemia grave), evidenciado por confusão e respiração de Kussmaul — a correcção metabólica urgente antecede a educação terapêutica.',
  diagnosticos:['Processos de Pensamento Alterados','Défice de Conhecimento sobre Diabetes','Nutrição Desequilibrada','Risco de Desequilíbrio Electrolítico','Débito Cardíaco Diminuído'],
  noc:['Glicemia 120-180mg/dL','pH arterial >7.35','Bicarbonato >18mEq/L','Sem hálito cetónico','Verbaliza compreensão sobre a diabetes'],
  nic:['Insulina IV conforme protocolo de cetoacidose','Expansão volémica com soros','Correcção electrolítica progressiva (K+)','Monitorização contínua da glicemia capilar','Educação estruturada sobre diabetes'],
  perguntas:[
    { q:'Doente com hálito cetónico, taquipneia e confusão — que mecanismo respiratório está presente?', opts:['Respiração de Cheyne-Stokes','Respiração de Kussmaul, compensação da acidose metabólica','Respiração paradoxal','Apneia do sono'], correta:1 },
    { q:'Qual o valor de pH arterial definido como meta de estabilização?', opts:['<7.0','>7.35','Exactamente 7.0','Não é monitorizado'], correta:1 },
    { q:'Qual a intervenção inicial mais crítica na cetoacidose?', opts:['Insulina IV conforme protocolo e correcção hidroelectrolítica','Dieta hiperglicídica imediata','Restrição total de líquidos','Sedação'], correta:0 },
    { q:'Qual sinal clínico é característico da cetoacidose, além da hiperglicemia?', opts:['Hálito cetónico','Bradicardia','Hipotermia','Miose'], correta:0 },
    { q:'Durante a correcção, que electrólito exige vigilância apertada apesar de níveis iniciais normais/altos?', opts:['Sódio','Potássio, que pode cair rapidamente com a insulina','Cálcio','Cloro'], correta:1 }
  ]
},
{
  id:'C006', icon:'ICON_PROC', bg:'#e7ecf4', fg:'var(--azul)',
  titulo:'C006 · Pneumonia Associada à Ventilação (VAP)', area:'UTI Geral', idade:'76 anos, M',
  apresentacao:'Homem de 76 anos, intubado há 8 dias por insuficiência respiratória. Febre 39.2°C, tosse com exsudato purulento, leucocitose 15.000, infiltrado novo bilateral na radiografia, PaO2/FiO2 220. NHB afectadas: Oxigenação, Circulação, Temperatura, Infecção. Evolução estimada: 7–10 dias com possível desmame respiratório.',
  raciocinio:'<b>Troca Gasosa Prejudicada</b> relacionada com infecção pulmonar e infiltrado alveolar, evidenciada por febre, leucocitose e infiltrado bilateral novo — condiciona directamente a oxigenação e o desmame ventilatório.',
  diagnosticos:['Troca Gasosa Prejudicada','Padrão Respiratório Ineficaz','Hipertermia','Risco de Infecção Disseminada'],
  noc:['Temperatura <37.5°C','Ventilação adequada com sincronismo','SatO2 ≥95%','Cultura de secreções negativa em 72h','Leucócitos <12.000'],
  nic:['Aspiração endotraqueal conforme necessidade','Elevação da cabeceira a 30-45°','Mudanças posicionais a cada 2h','Antibioterapia de largo espectro','Higiene oral com clorexidina'],
  perguntas:[
    { q:'Doente intubado há 8 dias com febre, secreções purulentas e infiltrado novo — que diagnóstico é prioritário?', opts:['Hipertermia isolada','Troca Gasosa Prejudicada','Défice de Autocuidado','Ansiedade'], correta:1 },
    { q:'A partir de quantas horas de intubação se define a pneumonia como VAP?', opts:['24h','≥48h','12h','1 semana'], correta:1 },
    { q:'Qual a intervenção com maior evidência na prevenção de VAP?', opts:['Decúbito dorsal permanente','Elevação da cabeceira a 30-45° e higiene oral com clorexidina','Sedação profunda contínua','Aspiração apenas 1x/dia'], correta:1 },
    { q:'Que valor de PaO2/FiO2 é usado para classificar lesão pulmonar aguda associada?', opts:['<300','>500','Exactamente 100','Não é usado nesta situação'], correta:0 },
    { q:'Que prática de higiene reduz o risco de VAP em doentes intubados?', opts:['Higiene oral com clorexidina','Higiene oral apenas 1x/semana','Evitar qualquer higiene oral','Água simples 1x/dia apenas'], correta:0 }
  ]
},
{
  id:'C007', icon:'ICON_EXAM', bg:'#e7ecf4', fg:'#000000',
  titulo:'C007 · Cirrose Hepática — Encefalopatia Hepática', area:'Internamento Gastroenterologia', idade:'62 anos, M',
  apresentacao:'Homem de 62 anos, cirrose por consumo de álcool. Confusão mental, asterixis, halitose com odor fecal, palma eritematosa, esplenomegalia, ascite tensa. Amónia elevada, INR 1.8. NHB afectadas: Processos de Pensamento, Circulação, Hidratação, Nutrição, Psicosocial. Evolução estimada: 1–2 semanas.',
  raciocinio:'<b>Processos de Pensamento Alterados</b> relacionado com acumulação de amónia por falência hepática (encefalopatia), evidenciado por confusão e asterixis — prioritário face ao risco de agravamento neurológico e de hemorragia associada à coagulopatia.',
  diagnosticos:['Processos de Pensamento Alterados','Risco de Hemorragia Digestiva','Volume Líquido Excessivo','Nutrição Desequilibrada'],
  noc:['Orientação temporal e espacial recuperada','Sem asterixis','Sem hematemese/melenas','Ascite controlada','Albumina plasmática >3.0g/dL'],
  nic:['Lactulose oral conforme protocolo','Vigilância de sinais de ingestão alcoólica','Endoscopia preventiva se varizes','Dieta com restrição proteica moderada e pobre em sal','Educação sobre abstinência alcoólica'],
  perguntas:[
    { q:'Doente cirrótico com asterixis, confusão e halitose fétida — qual a causa fisiopatológica mais provável?', opts:['Hipoglicemia isolada','Acumulação de amónia por falência hepática','Infecção urinária','Overdose de sedativos'], correta:1 },
    { q:'Qual o resultado esperado com a administração de lactulose?', opts:['Obstipação induzida','Redução da absorção intestinal de amónia, com 2-3 dejecções/dia','Aumento da amónia sérica','Sedação'], correta:1 },
    { q:'Qual o cuidado nutricional mais adequado nesta fase?', opts:['Dieta rica em proteína animal','Dieta com restrição proteica moderada e pobre em sal','Jejum absoluto prolongado','Dieta hiperprotéica sem restrição'], correta:1 },
    { q:'Que medicamento reduz a absorção intestinal de amónia?', opts:['Lactulose','Furosemida','Insulina','Heparina'], correta:0 },
    { q:'Que complicação da cirrose está associada a risco de hemorragia digestiva alta grave?', opts:['Varizes esofágicas','Apendicite','Úlcera péptica simples','Diverticulite'], correta:0 }
  ]
},
{
  id:'C008', icon:'ICON_ALERT', bg:'#fbe4e8', fg:'#c8202f',
  titulo:'C008 · Fratura do Fémur em Idosa', area:'Ortopedia/Cuidados Agudos', idade:'84 anos, F',
  apresentacao:'Idosa de 84 anos, após queda em casa. Fratura intracapsular do fémur esquerdo. Dor 8/10, edema, equimose, deformidade em rotação externa, incapacidade de suportar peso. PA 138/82mmHg. NHB afectadas: Dor, Movimento, Pele/Integridade, Circulação, Higiene. Evolução estimada: 5–7 dias até internamento ortopédico.',
  raciocinio:'<b>Dor Aguda</b> relacionada com trauma ósseo e espasmo muscular, evidenciada por relato de dor 8/10, deformidade e imobilidade do membro — o alívio da dor e a imobilização segura precedem qualquer outra intervenção.',
  diagnosticos:['Dor Aguda','Mobilidade Física Limitada','Risco de Úlcera de Pressão','Risco de Trombose','Défice de Autohigiene'],
  noc:['Dor ≤3/10','Membro imobilizado corretamente','Pulsos distais palpáveis','Pele íntegra','Realiza actividades de higiene com ajuda'],
  nic:['Analgesia conforme protocolo','Imobilização com tala/tração','Colchão antiescaras desde a admissão','Meias de compressão bilaterais','Exercícios de perna conforme tolerância'],
  perguntas:[
    { q:'Idosa com deformidade em rotação externa e dor 8/10 — qual a prioridade imediata de enfermagem?', opts:['Educação para alta','Alívio da dor e imobilização segura do membro','Mobilização precoce sem apoio','Jejum prolongado'], correta:1 },
    { q:'Qual o resultado NOC relacionado com a prevenção de complicações do imobilismo?', opts:['Pele íntegra e pulsos distais palpáveis','Ausência total de exames','Alta hospitalar em 24h','Marcha independente no 1º dia'], correta:0 },
    { q:'Que medida previne tromboembolismo nesta doente imobilizada?', opts:['Repouso absoluto sem meias de compressão','Meias de compressão e mobilização precoce conforme tolerância','Restrição hídrica','Trendelenburg permanente'], correta:1 },
    { q:'Qual complicação vascular é particularmente temida após fractura do fémur em idosos imobilizados?', opts:['Trombose venosa profunda','Hipertensão arterial','Hipoglicemia','Obstipação'], correta:0 },
    { q:'Qual o alinhamento correcto do membro fracturado antes da cirurgia?', opts:['Livre, sem qualquer suporte','Imobilizado e alinhado, com tala/tração conforme prescrição','Em rotação externa forçada','Elevado sem qualquer suporte'], correta:1 }
  ]
},
{
  id:'C009', icon:'ICON_SCALE', bg:'#e7ecf4', fg:'#000000',
  titulo:'C009 · Tromboembolismo Pulmonar Agudo', area:'Urgência/UTI Respiratória', idade:'55 anos, F',
  apresentacao:'Mulher de 55 anos, imobilizada há 2 semanas por pneumonia. Dispneia súbita, dor pleurítica, síncope, taquicardia (FC 115), taquipneia (FR 32), queda de SatO2. D-dímero elevado, ECG com taquicardia sinusal. NHB afectadas: Oxigenação, Circulação, Dor, Psicosocial. Evolução estimada: 5–7 dias com anticoagulação.',
  raciocinio:'<b>Troca Gasosa Prejudicada</b> relacionada com obstrução da perfusão pulmonar por êmbolo, evidenciada por dispneia súbita, hipoxemia e taquicardia — emergência com risco de colapso hemodinâmico.',
  diagnosticos:['Troca Gasosa Prejudicada','Padrão Respiratório Ineficaz','Débito Cardíaco Diminuído','Medo/Ansiedade Aguda'],
  noc:['SatO2 ≥94%','FR 16-20/min','FC 60-100bpm','Ausência de síncopes recorrentes','Verbaliza redução do medo'],
  nic:['Oxigenoterapia em máscara não reinalante','Monitorização ECG contínua','Anticoagulação (heparina IV) conforme protocolo','Avaliação para trombólise/embolectomia','Repouso absoluto no leito'],
  perguntas:[
    { q:'Doente imobilizada há 2 semanas com dispneia súbita, dor pleurítica e síncope — qual a hipótese prioritária?', opts:['Ansiedade isolada','Troca Gasosa Prejudicada por suspeita de TEP','Défice de conhecimento','Dor crónica'], correta:1 },
    { q:'Qual o valor de SpO2 definido como meta de estabilização?', opts:['≥94%','≥80%','Sem meta','100% sempre'], correta:0 },
    { q:'Qual a intervenção inicial mais urgente perante suspeita de TEP?', opts:['Deambulação imediata','Oxigenoterapia, repouso absoluto e preparação para anticoagulação','Alta para o domicílio','Dieta hiperlipídica'], correta:1 },
    { q:'Que exame laboratorial, de baixa especificidade mas alta sensibilidade, apoia a suspeita de TEP?', opts:['D-dímero','Amilase','Troponina isolada','Glicemia'], correta:0 },
    { q:'Que classe terapêutica é iniciada após forte suspeita/confirmação de TEP, salvo contraindicação?', opts:['Antibióticos','Anticoagulantes','Corticoides','Diuréticos'], correta:1 }
  ]
},
{
  id:'C010', icon:'ICON_PROC', bg:'#e7ecf4', fg:'var(--azul)',
  titulo:'C010 · Sépsis de Origem Urinária', area:'Urgência/Internamento Medicina', idade:'79 anos, F',
  apresentacao:'Idosa de 79 anos, com sonda vesical de demora. Desorientação aguda, hipertermia 39.8°C, taquicardia, taquipneia, urina turva e fétida, PA sistólica 95mmHg. Lactato 3.2, PAM 62mmHg. NHB afectadas: Infecção, Circulação, Temperatura, Eliminação, Processos de Pensamento. Evolução estimada: 7–10 dias com vigilância intensiva.',
  raciocinio:'<b>Risco de Choque Séptico</b> relacionado com resposta inflamatória sistémica de origem urinária, evidenciado por hipotensão, taquicardia e confusão aguda — reconhecimento precoce e tratamento na 1ª hora são determinantes do prognóstico.',
  diagnosticos:['Risco de Choque Séptico','Infecção Sistémica (Sépsis)','Processos de Pensamento Alterados','Débito Cardíaco Diminuído','Hipertermia'],
  noc:['Orientação recuperada','Temperatura <37.5°C','PA >100mmHg','Lactato <2mmol/L','Cultura de urina negativa em 48h'],
  nic:['Antibioterapia IV conforme hemocultura','Hidratação vigorosa com cristaloides','Vasopressores se hipotensão refractária','Remoção/troca de sonda vesical','Vigilância rigorosa 4/4h dos parâmetros de sépsis'],
  perguntas:[
    { q:'Idosa algaliada com confusão súbita, febre e hipotensão — qual a prioridade de enfermagem?', opts:['Higiene oral','Reconhecimento precoce de sépsis e início do pacote da 1ª hora','Educação nutricional','Avaliação de úlceras'], correta:1 },
    { q:'Qual o valor de lactato definido como meta de perfusão adequada?', opts:['<2mmol/L','>4mmol/L','Sem relevância','>10mmol/L'], correta:0 },
    { q:'Qual a intervenção prioritária nas primeiras horas de sépsis?', opts:['Restrição hídrica rigorosa','Hemoculturas, antibioterapia precoce e fluidoterapia','Suspensão da monitorização','Jejum absoluto'], correta:1 },
    { q:'Que dispositivo invasivo é frequentemente a porta de entrada da infecção neste caso?', opts:['Cateter venoso periférico','Sonda vesical de demora','Sonda nasogástrica','Dreno torácico'], correta:1 },
    { q:'Qual o tempo alvo para a 1ª dose de antibiótico após reconhecimento de sépsis?', opts:['Dentro de 1 hora','Dentro de 24 horas','Dentro de 6 horas, sem urgência','Não há tempo alvo definido'], correta:0 }
  ]
},
{
  id:'C011', icon:'ICON_EXAM', bg:'#e7ecf4', fg:'#000000',
  titulo:'C011 · Pancreatite Aguda Severa', area:'UTI Digestiva', idade:'52 anos, M',
  apresentacao:'Homem de 52 anos, dor epigástrica radiante em faixa, lipase >3000, edema pancreático, derrame pleural bilateral. NHB afectadas: Dor, Nutrição, Circulação. Evolução estimada: 7–14 dias.',
  raciocinio:'<b>Dor Aguda Severa</b> relacionada com auto-digestão pancreática e inflamação retroperitoneal, evidenciada por dor epigástrica irradiada e lipase muito elevada.',
  diagnosticos:['Dor Aguda Severa','Nutrição Desequilibrada','Volume Líquido Excessivo'],
  noc:['Dor <4/10','Enzimas pancreáticas normalizadas','Peso estável'],
  nic:['Analgesia potente','Nutrição parentérica/entérica se jejum prolongado','Monitorização de amilase/lipase'],
  perguntas:[
    { q:'Dor epigástrica em faixa, lipase >3000 — qual o diagnóstico prioritário?', opts:['Nutrição Desequilibrada','Dor Aguda Severa','Ansiedade Ligeira','Défice de Conhecimento'], correta:1 },
    { q:'Qual o resultado esperado quanto ao suporte nutricional?', opts:['Peso estável e enzimas pancreáticas em declínio','Alimentação hiperlipídica oral imediata','Perda de peso rápida planeada','Sem necessidade de monitorização'], correta:0 },
    { q:'Qual a conduta nutricional habitual na fase aguda severa?', opts:['Dieta rica em gordura via oral','Jejum inicial com nutrição parentérica/entérica conforme protocolo','Líquidos açucarados à vontade','Sem restrição alimentar'], correta:1 },
    { q:'Que hábito é um factor de risco major para pancreatite aguda?', opts:['Consumo excessivo de álcool e/ou litíase biliar','Exercício físico regular','Dieta pobre em gordura','Hidratação adequada'], correta:0 },
    { q:'Por que se evita geralmente a via oral na fase aguda inicial severa?', opts:['Para estimular mais secreção pancreática','Para reduzir a estimulação pancreática e permitir repouso do órgão','Não há razão clínica','Para provocar perda de peso'], correta:1 }
  ]
},
{
  id:'C012', icon:'ICON_ALERT', bg:'#fbe4e8', fg:'#c8202f',
  titulo:'C012 · Hemorragia Digestiva Alta Varicosa', area:'Urgência Endoscopia', idade:'58 anos, M',
  apresentacao:'Homem de 58 anos, hematemese volumosa, melenas, tensão de choque, PA 80/50mmHg, Hb 7.2g/dL, FC 128bpm. NHB afectadas: Circulação, Eliminação. Evolução estimada: 3–5 dias.',
  raciocinio:'<b>Risco de Choque Hipovolémico</b> relacionado com perda hemática activa por ruptura de varizes esofágicas, evidenciado por hematemese, hipotensão e taquicardia.',
  diagnosticos:['Débito Cardíaco Diminuído','Risco de Choque','Medo Agudo'],
  noc:['PA sistólica >90mmHg','Hemoglobina estável >7g/dL','Hemostase endoscópica'],
  nic:['Acesso venoso de grande calibre','Transfusão conforme prescrição','Endoscopia emergente com ligadura'],
  perguntas:[
    { q:'Hematemese volumosa e PA 80/50mmHg — qual o diagnóstico prioritário?', opts:['Défice de Conhecimento','Risco de Choque Hipovolémico','Dor Crónica','Padrão de Sono Perturbado'], correta:1 },
    { q:'Qual o valor de hemoglobina definido como meta mínima de estabilização?', opts:['>7g/dL','>3g/dL','Sem relevância','>15g/dL'], correta:0 },
    { q:'Qual a intervenção inicial mais urgente?', opts:['Dieta rica em fibra imediata','Acesso venoso de grande calibre e preparação para transfusão','Deambulação','Jejum apenas'], correta:1 },
    { q:'Que procedimento endoscópico controla a hemorragia de varizes esofágicas?', opts:['Colonoscopia de rotina','Laqueação/escleroterapia endoscópica','Radiografia simples','Ecografia abdominal apenas'], correta:1 },
    { q:'Qual sinal vital reflecte melhor a perda hemodinâmica activa?', opts:['Temperatura corporal','Taquicardia e hipotensão','Frequência respiratória isolada','Glicemia capilar'], correta:1 }
  ]
},
{
  id:'C013', icon:'ICON_SCALE', bg:'#e7ecf4', fg:'#000000',
  titulo:'C013 · Queimadura de 2º Grau Extensa (20% SCQ)', area:'UTI de Queimados', idade:'44 anos, F',
  apresentacao:'Mulher de 44 anos, queimadura por líquido quente. Bolhas, eritema intenso, dor 9/10, edema progressivo, FC 118bpm. NHB afectadas: Dor, Pele/Integridade, Circulação. Evolução estimada: 10–30 dias.',
  raciocinio:'<b>Défice de Volume Líquido</b> relacionado com perda de plasma através da superfície queimada, evidenciado por edema progressivo e taquicardia — a fluidoterapia guiada é a prioridade nas primeiras 24h.',
  diagnosticos:['Défice de Volume Líquido/Hipovolémia','Dor Aguda Severa','Risco de Infecção'],
  noc:['Dor ≤4/10','Débito urinário 0.5-1ml/kg/h mantido','Feridas cicatrizadas sem infecção'],
  nic:['Fluidoterapia conforme fórmula de Parkland','Limpeza e desbridamento com analgesia prévia','Antibióticos tópicos'],
  perguntas:[
    { q:'Queimadura de 20% SCQ com edema progressivo — qual o diagnóstico prioritário nas 1ªs 24h?', opts:['Risco de Infecção isolado','Défice de Volume Líquido/Hipovolémia','Ansiedade','Défice de Conhecimento'], correta:1 },
    { q:'Qual o resultado esperado com a fluidoterapia guiada?', opts:['Débito urinário 0.5-1ml/kg/h mantido','Anúria aceitável','Sobrecarga hídrica planeada','Sem meta definida'], correta:0 },
    { q:'Qual a intervenção prioritária além da fluidoterapia?', opts:['Desbridamento sem analgesia','Analgesia eficaz e curativo estéril da ferida','Restrição hídrica','Jejum absoluto'], correta:1 },
    { q:'Que fórmula orienta o volume de fluidoterapia nas 1ªs 24h de uma queimadura extensa?', opts:['Fórmula de Parkland','Fórmula de Framingham','Regra de Ottawa','Escala de Braden'], correta:0 },
    { q:'Qual o principal risco a longo prazo numa queimadura extensa mal tratada?', opts:['Infecção e sépsis','Hipertensão crónica','Diabetes tipo 1','Hipotiroidismo'], correta:0 }
  ]
},
{
  id:'C014', icon:'ICON_PROC', bg:'#e7ecf4', fg:'var(--azul)',
  titulo:'C014 · Status Asmaticus (Asma Refractária)', area:'UTI Respiratória', idade:'28 anos, M',
  apresentacao:'Homem de 28 anos, sem resposta a broncodilatadores após 1h. Cansaço extremo, redução progressiva do murmúrio vesicular, silêncio auscultatório. NHB afectadas: Oxigenação. Evolução estimada: 1–3 dias.',
  raciocinio:'<b>Troca Gasosa Criticamente Prejudicada</b> relacionada com obstrução grave refractária, evidenciada por silêncio auscultatório e exaustão — sinal ominoso de insuficiência respiratória iminente.',
  diagnosticos:['Troca Gasosa Criticamente Prejudicada','Padrão Respiratório Ineficaz'],
  noc:['SatO2 >90%','Intubação evitada, se possível'],
  nic:['Preparação para intubação se necessário','Agonistas beta IV/nebulizados','Corticoides IV'],
  perguntas:[
    { q:'Doente sem resposta a broncodilatadores, com silêncio auscultatório — o que este sinal indica?', opts:['Melhoria clínica','Insuficiência respiratória iminente/pré-paragem','Ansiedade apenas','Infecção respiratória leve'], correta:1 },
    { q:'Qual o resultado imediato prioritário a monitorizar?', opts:['SpO2 >90% e evitar intubação, se possível','FC <60bpm','Ausência de tosse','Peso estável'], correta:0 },
    { q:'Perante exaustão respiratória iminente, que intervenção deve ser preparada?', opts:['Alta para o domicílio','Preparação para intubação e ventilação mecânica','Suspensão da oxigenoterapia','Deambulação assistida'], correta:1 },
    { q:'Que alteração gasométrica é preocupante numa crise refractária?', opts:['pH normalizado e PaCO2 baixo','PaCO2 em ascensão com pH em queda, sinal de fadiga respiratória','PaO2 muito elevado','Sem alterações gasométricas'], correta:1 },
    { q:'Qual a via preferencial para broncodilatadores numa crise refractária grave?', opts:['Via oral apenas','Via inalatória/nebulizada e, se necessário, IV','Via rectal','Via intramuscular'], correta:1 }
  ]
},
{
  id:'C015', icon:'ICON_EXAM', bg:'#e7ecf4', fg:'#000000',
  titulo:'C015 · AVC Hemorrágico com Edema Cerebral', area:'UTI Neurologia', idade:'65 anos, F',
  apresentacao:'Mulher de 65 anos, cefaleia súbita, vómitos em jacto, défice neurológico progressivo, Glasgow 9, anisocória. NHB afectadas: Processos de Pensamento, Movimento. Evolução estimada: 5–10 dias.',
  raciocinio:'<b>Risco de Herniação Encefálica</b> relacionado com hipertensão intracraniana, evidenciado por cefaleia súbita, vómitos e alteração pupilar — emergência neurológica com risco de morte iminente.',
  diagnosticos:['Risco de Herniação Encefálica','Processos de Pensamento Alterados'],
  noc:['Pressão intracraniana <20mmHg','Escala de Glasgow estável'],
  nic:['Elevação da cabeceira a 30°','Osmoterapia com manitol','Vigilância contínua da PIC'],
  perguntas:[
    { q:'Cefaleia súbita, vómitos em jacto e anisocória progressiva — qual o risco prioritário?', opts:['Risco de Infecção','Risco de Herniação Encefálica por hipertensão intracraniana','Défice de Autocuidado','Ansiedade Ligeira'], correta:1 },
    { q:'Qual o valor de PIC definido como meta terapêutica?', opts:['<20mmHg','>40mmHg','Sem relevância','>60mmHg'], correta:0 },
    { q:'Qual a posição da cabeceira recomendada para reduzir a PIC?', opts:['Decúbito dorsal plano','Elevação da cabeceira a 30°','Trendelenburg','Decúbito ventral'], correta:1 },
    { q:'Que sinal pupilar sugere herniação cerebral iminente?', opts:['Miose bilateral simétrica reactiva','Anisocória com pupila não reactiva','Midríase bilateral reactiva simétrica','Nistagmo horizontal isolado'], correta:1 },
    { q:'Que fármaco osmótico é usado para reduzir a pressão intracraniana?', opts:['Manitol','Insulina','Paracetamol','Amoxicilina'], correta:0 }
  ]
},
{
  id:'C016', icon:'ICON_ALERT', bg:'#fbe4e8', fg:'#c8202f',
  titulo:'C016 · Insuficiência Cardíaca Aguda Descompensada', area:'Internamento Cardiologia', idade:'72 anos, M',
  apresentacao:'Homem de 72 anos, dispneia ortopneica, edema pulmonar, galope S3, PVJ elevada, crepitações bibasais, BNP muito elevado. NHB afectadas: Circulação, Oxigenação. Evolução estimada: 3–5 dias.',
  raciocinio:'<b>Débito Cardíaco Diminuído</b> relacionado com disfunção ventricular, evidenciado por dispneia ortopneica, edema pulmonar e PVJ elevada.',
  diagnosticos:['Débito Cardíaco Diminuído','Padrão Respiratório Ineficaz'],
  noc:['SatO2 >95%','BNP normalizado progressivamente'],
  nic:['CPAP se necessário','Diuréticos IV','IECA/Betabloqueadores'],
  perguntas:[
    { q:'Dispneia ortopneica, galope S3 e PVJ elevada — qual o diagnóstico prioritário?', opts:['Ansiedade Ligeira','Débito Cardíaco Diminuído','Défice de Conhecimento','Dor Aguda'], correta:1 },
    { q:'Qual o posicionamento inicial mais adequado neste doente com edema pulmonar?', opts:['Decúbito dorsal plano','Posição Fowler elevada 45-90°','Trendelenburg','Decúbito lateral esquerdo'], correta:1 },
    { q:'Qual a classe terapêutica administrada para reduzir a pré-carga?', opts:['Betabloqueador em bólus','Diurético de ansa IV','Vasoconstritor','Antibiótico'], correta:1 },
    { q:'Que exame laboratorial apoia o diagnóstico e a gravidade da IC descompensada?', opts:['BNP/NT-proBNP','Amilase','TSH isolado','PSA'], correta:0 },
    { q:'Que classes farmacológicas fazem parte do tratamento crónico de base da IC?', opts:['IECA/ARA e betabloqueadores','Apenas antibióticos','Apenas insulina','Apenas laxantes'], correta:0 }
  ]
},
{
  id:'C017', icon:'ICON_SCALE', bg:'#e7ecf4', fg:'#000000',
  titulo:'C017 · Meningite Bacteriana', area:'UTI Infecciologia', idade:'32 anos, F',
  apresentacao:'Mulher de 32 anos, febre 40°C, rigidez de nuca, sinal de Kernig positivo, fotofobia, púrpura petequial, confusão. NHB afectadas: Temperatura, Psicosocial, Infecção. Evolução estimada: 7–14 dias.',
  raciocinio:'<b>Risco de Sépsis</b> associado a hipertermia, relacionados com infecção do SNC, evidenciados por febre elevada, rigidez de nuca e púrpura petequial — sinal de gravidade a tratar sem atraso.',
  diagnosticos:['Risco de Sépsis','Hipertermia','Processos de Pensamento Alterados'],
  noc:['Temperatura <37.5°C','Consciência clara','Cultura negativa'],
  nic:['Antibioterapia emergente IV','Isolamento de gotículas','Antitérmicos'],
  perguntas:[
    { q:'Febre 40°C, rigidez de nuca e púrpura petequial — qual o diagnóstico prioritário?', opts:['Défice de Conhecimento','Risco de Sépsis/Hipertermia por infecção do SNC','Ansiedade Ligeira','Dor Crónica'], correta:1 },
    { q:'Qual a medida de isolamento indicada nas primeiras 24h de antibioterapia?', opts:['Isolamento de contacto apenas','Isolamento de gotículas','Nenhum isolamento necessário','Isolamento reverso'], correta:1 },
    { q:'Qual a intervenção mais urgente perante suspeita de meningite bacteriana?', opts:['Aguardar cultura antes de tratar','Antibioterapia emergente IV sem atraso','Alta com antipirético oral','Observação domiciliária'], correta:1 },
    { q:'Que exame confirma o diagnóstico definitivo de meningite bacteriana?', opts:['Radiografia de tórax','Punção lombar com análise do LCR','Ecografia abdominal','Prova de função hepática'], correta:1 },
    { q:'Que sinal cutâneo é um alerta de gravidade/sépsis meningocócica?', opts:['Púrpura petequial','Eritema solar','Vitiligo','Psoríase'], correta:0 }
  ]
},
{
  id:'C018', icon:'ICON_PROC', bg:'#e7ecf4', fg:'var(--azul)',
  titulo:'C018 · Intoxicação por Benzodiazepinas', area:'Urgência Toxicologia', idade:'48 anos, F',
  apresentacao:'Mulher de 48 anos, sedação progressiva, depressão respiratória FR 10/min, miose, Glasgow 10. NHB afectadas: Oxigenação, Processos de Pensamento. Evolução estimada: 1–2 dias.',
  raciocinio:'<b>Padrão Respiratório Ineficaz</b> relacionado com depressão do SNC por sobredosagem, evidenciado por FR 10/min e sedação progressiva — via aérea e ventilação em primeiro lugar.',
  diagnosticos:['Padrão Respiratório Ineficaz','Processos de Pensamento Alterados'],
  noc:['FR >12/min espontânea','Consciência lúcida'],
  nic:['Ventilação mecânica se necessário','Flumazenil conforme protocolo','Suporte cardiorrespiratório'],
  perguntas:[
    { q:'FR 10/min e sedação progressiva após sobredosagem — qual o diagnóstico prioritário?', opts:['Défice de Conhecimento','Padrão Respiratório Ineficaz por depressão do SNC','Ansiedade Aguda','Dor Crónica'], correta:1 },
    { q:'Qual o resultado esperado após a intervenção antidotal?', opts:['FR >12/min espontânea e consciência recuperada','FR <8/min mantida','Sedação profunda mantida','Sem alteração esperada'], correta:0 },
    { q:'Qual o antídoto específico usado, conforme protocolo, nesta intoxicação?', opts:['Naloxona','Flumazenil','N-acetilcisteína','Protamina'], correta:1 },
    { q:'Que parâmetro respiratório exige vigilância contínua nesta intoxicação?', opts:['Frequência respiratória e nível de consciência','Temperatura corporal apenas','Peso corporal','Acuidade visual'], correta:0 },
    { q:'Após reversão com antídoto, que cuidado é essencial pelo risco de re-sedação?', opts:['Alta imediata sem vigilância','Vigilância contínua, pois o efeito do antídoto pode ser mais curto','Suspensão de toda a monitorização','Sedação adicional imediata'], correta:1 }
  ]
},
{
  id:'C019', icon:'ICON_EXAM', bg:'#e7ecf4', fg:'#000000',
  titulo:'C019 · Carcinoma Pulmonar Avançado — Cuidados Paliativos', area:'Cuidados Paliativos/Oncologia', idade:'68 anos, M',
  apresentacao:'Homem de 68 anos, dispneia progressiva, tosse seca, hemoptises, dor óssea severa (EVA 8/10), astenia. NHB afectadas: Dor, Oxigenação, Nutrição, Espiritualidade. Evolução estimada: cronicidade em cuidados paliativos.',
  raciocinio:'<b>Dor Crónica</b> relacionada com invasão tumoral óssea, evidenciada por dor severa e limitação funcional — o foco central é o conforto e a dignidade, não a cura.',
  diagnosticos:['Dor Aguda/Crónica','Padrão Respiratório Prejudicado','Nutrição Desequilibrada'],
  noc:['Dor <4/10','Conforto melhorado','Dignidade mantida'],
  nic:['Analgesia conforme escada analgésica da OMS','Cuidados psicológicos/espirituais','Educação sobre a doença avançada'],
  perguntas:[
    { q:'Doente oncológico terminal com dor óssea 8/10 — qual a abordagem terapêutica de referência?', opts:['Analgesia apenas se dor >9/10','Escada analgésica da OMS com titulação individualizada','Suspensão de toda a analgesia','Apenas medidas não farmacológicas'], correta:1 },
    { q:'Qual o resultado central em cuidados paliativos, além do controlo da dor?', opts:['Cura da doença de base','Conforto e dignidade mantidos','Alta hospitalar imediata','Ausência de comunicação com a família'], correta:1 },
    { q:'Qual a intervenção de enfermagem central nesta fase?', opts:['Investigação diagnóstica agressiva','Cuidados de conforto, suporte psicológico/espiritual e gestão da dor','Restrição de visitas','Reabilitação motora intensiva'], correta:1 },
    { q:'Qual o princípio orientador da comunicação com o doente e família em cuidados paliativos?', opts:['Ocultar sempre o prognóstico','Comunicação honesta, empática e adaptada às necessidades','Evitar qualquer conversa sobre a doença','Delegar toda a comunicação a terceiros'], correta:1 },
    { q:'Além da dor, que outro sintoma é frequentemente alvo de controlo em doença oncológica pulmonar avançada?', opts:['Dispneia','Poliúria','Hipertensão maligna','Obstipação isolada'], correta:0 }
  ]
},
{
  id:'C020', icon:'ICON_ALERT', bg:'#fbe4e8', fg:'#c8202f',
  titulo:'C020 · Transtorno Bipolar Tipo I — Episódio Maníaco Severo', area:'Psiquiatria', idade:'36 anos, F',
  apresentacao:'Mulher de 36 anos, elevação anormal do humor, fuga de ideias, comportamento desinibido, agressividade, insónia total há 4 dias, discurso acelerado. NHB afectadas: Processos de Pensamento, Psicosocial, Sono/Repouso. Evolução estimada: 2–4 semanas de internamento.',
  raciocinio:'<b>Risco de Comportamento Autolesivo/Heterolesivo</b> relacionado com impulsividade e julgamento comprometido, evidenciado por desinibição e agressividade — a segurança da doente e de terceiros é a prioridade absoluta.',
  diagnosticos:['Risco de Comportamento Autolesivo/Heterolesivo','Processos de Pensamento Alterados','Comunicação Alterada'],
  noc:['Pensamento organizado','Comportamento controlado','Adesão medicamentosa'],
  nic:['Estabilizadores de humor (lítio)','Estrutura ambiental clara com limites','Terapia psicossocial estruturada'],
  perguntas:[
    { q:'Doente em mania severa, desinibida e agressiva, sem dormir há dias — qual a prioridade de segurança?', opts:['Educação sobre a doença','Garantir segurança da doente e de terceiros, em ambiente estruturado','Estimulação sensorial intensa','Isolamento social sem supervisão'], correta:1 },
    { q:'Qual o resultado esperado com a estabilização farmacológica (ex. lítio)?', opts:['Pensamento mais organizado e comportamento controlado','Sedação permanente sem interacção','Agitação crescente','Sem alteração esperada'], correta:0 },
    { q:'Qual a intervenção ambiental recomendada nesta fase aguda?', opts:['Ambiente estimulante com múltiplos estímulos','Ambiente calmo, estruturado, com rotina e limites claros','Isolamento total sem contacto humano','Excesso de visitas e ruído'], correta:1 },
    { q:'Que classe de fármacos estabilizadores do humor é referida neste caso?', opts:['Estabilizadores de humor','Antibióticos','Antidiabéticos orais','Anticoagulantes'], correta:0 },
    { q:'Durante a fase aguda, que cuidado relativo ao sono e nutrição é prioritário?', opts:['Ignorar sono e alimentação','Assegurar alimentação/hidratação e favorecer o repouso, mesmo com resistência','Estimular ainda mais a hiperactividade','Jejum prolongado voluntário'], correta:1 }
  ]
}
];

// ----- Teste "Fundamentos" (revisão geral, complementa os 20 mini-testes) -----
const QUIZ_FUNDAMENTOS = [
  { q:'Qual é a 1ª etapa do Processo de Enfermagem?', opts:['Diagnóstico','Avaliação/Colheita de dados','Planeamento','Intervenção'], correta:1 },
  { q:'Na Escala de Coma de Glasgow, qual a pontuação mínima possível?', opts:['0','3','8','15'], correta:1 },
  { q:'Qual a via de administração com ângulo de inserção de aproximadamente 90°?', opts:['Subcutânea','Intradérmica','Intramuscular','Endovenosa periférica'], correta:2 },
  { q:'Na regra dos nove para queimaduras, qual a percentagem de cada membro superior num adulto?', opts:['9%','18%','1%','27%'], correta:0 },
  { q:'O que significa a sigla "NIC" na prática de enfermagem?', opts:['Classificação de Diagnósticos de Enfermagem','Classificação dos Resultados de Enfermagem','Classificação das Intervenções de Enfermagem','Índice Nacional Clínico'], correta:2 },
  { q:'Qual destes é um sinal de alarme no protocolo FAST para AVC?', opts:['Aumento do apetite','Assimetria facial','Febre alta','Tosse persistente'], correta:1 },
  { q:'A adrenalina IM é o tratamento de primeira linha em qual emergência?', opts:['Hipoglicemia','Choque anafilático','Convulsão febril','Obstipação'], correta:1 }
];

// ----- Flashcards (ampliadas com conceitos-chave dos 20 casos) -----
const FLASHCARDS = [
  { f:'Domínio', v:'Área ampla de comportamento/resposta humana na Taxonomia NANDA-I (ex.: Nutrição, Actividade/Repouso)' },
  { f:'NIC', v:'Classificação das Intervenções de Enfermagem — as acções realizadas pelo enfermeiro' },
  { f:'NOC', v:'Classificação dos Resultados de Enfermagem — os resultados esperados do doente' },
  { f:'Dor aguda', v:'Diagnóstico de enfermagem: experiência sensorial/emocional desagradável, associada a lesão real ou potencial, com duração inferior a 3 meses' },
  { f:'Características definidoras', v:'Sinais e sintomas observáveis que sustentam um diagnóstico de enfermagem real' },
  { f:'Escala de Braden', v:'Instrumento que avalia o risco de lesão por pressão em 6 subescalas (pontuação 6–23)' },
  { f:'Fórmula de Parkland', v:'Estima o volume de reposição hídrica em queimados: 4ml × peso(kg) × %SCQ, metade nas primeiras 8h' },
  { f:'Status Asmaticus', v:'Crise de asma grave refractária a broncodilatadores, com risco de paragem respiratória' },
  { f:'Encefalopatia Hepática', v:'Alteração do estado mental por acumulação de amónia na falência hepática' },
  { f:'Escala de Glasgow', v:'Avalia abertura ocular, resposta verbal e motora; pontuação total de 3 a 15' },
  { f:'VAP', v:'Pneumonia associada à ventilação, definida a partir de ≥48h de intubação' },
  { f:'Regra dos Nove', v:'Estima a percentagem de superfície corporal queimada em adultos' },
  { f:'Sépsis', v:'Resposta inflamatória sistémica disfuncional a uma infecção, com risco de choque' },
  { f:'Respiração de Kussmaul', v:'Respiração profunda e rápida, compensatória da acidose metabólica (ex. cetoacidose)' },
  { f:'Escada Analgésica da OMS', v:'Abordagem escalonada da dor: não-opioides → opioides fracos → opioides fortes' },
  { f:'Pressão Intracraniana (PIC)', v:'Valor normal <20mmHg; a sua elevação está associada a risco de herniação encefálica' },
  { f:'BNP', v:'Péptido natriurético cerebral, elevado na sobrecarga/stress ventricular da insuficiência cardíaca' },
  { f:'Débito urinário mínimo', v:'0.5ml/kg/h define uma perfusão renal considerada adequada' },
  { f:'Flumazenil', v:'Antídoto usado na intoxicação por benzodiazepinas' },
  { f:'Sinal de Kernig / rigidez de nuca', v:'Sinais de irritação meníngea, sugestivos de meningite' }
];



// Ordem do raciocínio: Diagnóstico → Intervenções (NIC) → Resultados (NOC). As perguntas 2 e 3 trocam de lugar (excepto C016/C017, onde ambas são de intervenção).
/* ORDEM_NIC_NOC */ CASOS_ESTUDO.forEach(function(c){ if(c.id==='C016'||c.id==='C017') return; var p=c.perguntas; var x=p[1]; p[1]=p[2]; p[2]=x; });
