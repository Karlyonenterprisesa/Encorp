// === data-procedimentos.js ===
// ===== dados/construção — procedimentos.html =====

buildAccordionView('procedimentos', 'Procedimentos de Enfermagem', 'Passo a passo dos principais procedimentos técnicos de enfermagem.', [
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'var(--azul)',
  title:'Administração de Medicamentos',
  sub:'Vias oral, intramuscular, subcutânea, intradérmica e endovenosa',
  body:`
  <svg class="proc-illus" viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg"><rect width="240" height="130" rx="14" fill="#e7ecf4"/><ellipse cx="70" cy="95" rx="38" ry="14" fill="#c9daf5"/><rect x="52" y="35" width="36" height="62" rx="18" fill="#f6c9ce"/><rect x="150" y="50" width="70" height="14" rx="7" fill="var(--azul)"/><rect x="205" y="40" width="10" height="34" rx="3" fill="var(--azul-escuro)"/><circle cx="210" cy="38" r="4" fill="var(--azul-escuro)"/><line x1="88" y1="65" x2="150" y2="57" stroke="var(--azul)" stroke-width="3" stroke-linecap="round"/></svg>
  <h4>Os 5+5 certos</h4>
  <ul><li>Doente certo · Medicamento certo · Dose certa · Via certa · Hora certa</li><li>Registo certo · Razão certa · Resposta certa · Direito de recusar · Educação certa</li></ul>
  <img class="zoomable-img" src="img/f27a4af9ad.webp" alt="Os 13 certos da administração de medicamentos" style="width:100%;max-width:280px;margin:8px auto;" onclick="openLightbox('img-13-certos.jpg','Os 13 certos da administração de medicamentos','13-certos-medicamentos.jpg')">
  <div class="img-caption">Infográfico — os 13 certos da administração de medicamentos</div>
  <h4>Via intramuscular (IM)</h4>
  <ul>
    <li><b>Locais:</b> deltóide, vasto lateral da coxa, ventroglúteo, dorsoglúteo</li>
    <li><b>Agulha:</b> calibre 21–23G, 25–38 mm de comprimento (adulto); 25G/16 mm em crianças pequenas</li>
    <li>Agulha em ângulo de 90°; aspirar antes de injectar (exceto vacinas, salvo indicação contrária)</li>
    <li>Volume máximo recomendado: 2–3 mL no deltóide; até 5 mL no glúteo/vasto lateral (adulto)</li>
  </ul>
  <h4>Via subcutânea (SC)</h4>
  <ul><li>Locais: abdómen, face externa do braço, face anterior da coxa</li><li><b>Agulha:</b> calibre 25–27G, 10–16 mm (caneta de insulina: 4–8 mm)</li><li>Ângulo de 45°–90° consoante a prega cutânea; sem aspirar (ex.: insulina, heparina)</li></ul>
  <h4>Via intradérmica (ID)</h4>
  <ul><li><b>Agulha:</b> calibre 26–27G, 10 mm, bisel curto</li><li>Ângulo de 10°–15°; formação de pápula (0,1–0,5 mL); usada em testes de sensibilidade e BCG</li></ul>
  <h4>Via endovenosa (EV)</h4>
  <ul><li><b>Cateter:</b> escolher o calibre mais pequeno adequado à terapêutica (ver tabela de calibres em Cateterização Venosa Periférica)</li><li>Confirmar refluxo de sangue e permeabilidade do cateter antes de administrar</li><li>Respeitar velocidade de administração e compatibilidade de diluentes</li></ul>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'#000000',
  title:'Algaliação / Sondagem Vesical',
  sub:'Cateterismo vesical de demora ou intermitente',
  body:`
  <svg class="proc-illus" viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg"><rect width="240" height="130" rx="14" fill="#e7ecf4"/><rect x="40" y="30" width="70" height="60" rx="10" fill="#fff" stroke="#000000" stroke-width="2"/><circle cx="75" cy="55" r="14" fill="#d9d9d9"/><path d="M75 69 v14" stroke="#000000" stroke-width="3" stroke-linecap="round"/><path d="M75 83 q40 6 60 22" stroke="#000000" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="180" cy="108" rx="26" ry="14" fill="#d9d9d9" stroke="#000000" stroke-width="2"/></svg>
  <h4>Indicações</h4>
  <ul><li>Retenção urinária, monitorização rigorosa de diurese, pré/pós-operatório, doentes acamados com incontinência complicada</li></ul>
  <img class="zoomable-img" src="img/7523381ad5.webp" alt="Sondas vesicais — tipos e calibres" style="width:100%;max-width:260px;margin:8px auto;" onclick="openLightbox('img-sondas-vesicais.jpg','Sondas vesicais — tipos e calibres','sondas-vesicais.jpg')">
  <div class="img-caption">Sondas vesicais — tipos e calibres</div>
  <h4>Calibres da sonda (Foley)</h4>
  <ul>
    <li><b>Mulher (adulto):</b> 12–14 Fr</li>
    <li><b>Homem (adulto):</b> 14–18 Fr (16 Fr o mais frequente)</li>
    <li><b>Criança:</b> 6–10 Fr, consoante idade/peso</li>
    <li><b>Balão:</b> insuflar com 10 mL de água destilada (adulto); 3–5 mL em pediatria — nunca usar soro fisiológico (cristaliza)</li>
  </ul>
  <h4>Material</h4>
  <ul><li>Sonda vesical estéril (calibre adequado ao doente), kit de algaliação, luvas estéreis e de procedimento, anti-séptico (clorohexidina ou povidona-iodada), lubrificante hidrossolúvel/gel anestésico (lidocaína gel 2%), seringa de 10 mL com água destilada, saco colector de urina com válvula anti-refluxo, campo estéril fenestrado, compressas estéreis</li></ul>
  <ol class="step-list">
    <li>Explicar o procedimento e garantir privacidade</li>
    <li>Posicionar o doente e realizar higiene perineal</li>
    <li>Técnica assética: colocar campo estéril e luvas estéreis</li>
    <li>Lubrificar a sonda e introduzir suavemente até refluxo de urina</li>
    <li>Insuflar o balão com o volume indicado no cateter (geralmente 10 mL)</li>
    <li>Tracionar suavemente até resistência e conectar ao saco colector</li>
    <li>Fixar a sonda e registar procedimento, características da urina e volume drenado</li>
  </ol>
  <div class="alert-box">Nunca insuflar o balão sem confirmar refluxo de urina — risco de lesão uretral.</div>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'#000000',
  title:'Sondagem Nasogástrica (SNG)',
  sub:'Colocação e verificação de posicionamento',
  body:`
  <svg class="proc-illus" viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg"><rect width="240" height="130" rx="14" fill="#e7ecf4"/><circle cx="90" cy="60" r="38" fill="#f6c9ce"/><path d="M60 55 q10 -8 20 0" stroke="#000000" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M120 62 q40 -10 70 30" stroke="#000000" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="182" y="82" width="30" height="18" rx="4" fill="#000000"/></svg>
  <h4>Indicações</h4>
  <ul><li>Alimentação entérica, descompressão gástrica, administração de medicamentos, lavagem gástrica</li></ul>
  <h4>Calibre da sonda (Levine)</h4>
  <ul><li><b>Adulto:</b> 14–18 Fr (16 Fr o mais comum)</li><li><b>Criança:</b> 8–10 Fr</li><li><b>Lactente:</b> 5–8 Fr</li></ul>
  <h4>Material</h4>
  <ul><li>Sonda nasogástrica de calibre adequado, lubrificante hidrossolúvel, seringa de 20–50 mL (cone), estetoscópio, adesivo hipoalergénico de fixação, luvas de procedimento, saco colector/sistema de drenagem se aplicável, copo com água (se doente colaborante e sem contraindicação)</li></ul>
  <ol class="step-list">
    <li>Medir a distância nariz–lóbulo da orelha–apêndice xifóide</li>
    <li>Lubrificar a sonda e introduzir pela narina, pedindo ao doente para deglutir</li>
    <li>Progredir até à marca medida, sem forçar</li>
    <li>Confirmar posicionamento: aspirar conteúdo gástrico e/ou auscultar insuflação de ar no epigastro</li>
    <li>Fixar a sonda ao nariz e verificar radiografia se for para alimentação (padrão institucional)</li>
    <li>Registar procedimento e tolerância do doente</li>
  </ol>
  <div class="alert-box">Suspender e reavaliar de imediato se surgir tosse, cianose ou dificuldade respiratória durante a introdução — sinal de posicionamento na via aérea.</div>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'var(--azul-escuro)',
  title:'Cateterização Venosa Periférica',
  sub:'Punção venosa para acesso endovenoso',
  body:`
  <svg class="proc-illus" viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg"><rect width="240" height="130" rx="14" fill="#e7ecf4"/><rect x="30" y="55" width="110" height="26" rx="13" fill="#f6c9ce"/><line x1="55" y1="68" x2="120" y2="68" stroke="var(--azul-escuro)" stroke-width="2" stroke-dasharray="3 3"/><path d="M140 68 h30" stroke="var(--azul-escuro)" stroke-width="4" stroke-linecap="round"/><rect x="170" y="60" width="16" height="16" rx="3" fill="var(--azul-escuro)"/><path d="M186 68 h20" stroke="var(--azul-escuro)" stroke-width="4"/><circle cx="212" cy="40" r="14" fill="#fff" stroke="var(--azul-escuro)" stroke-width="2"/><line x1="212" y1="54" x2="212" y2="68" stroke="var(--azul-escuro)" stroke-width="3"/></svg>
  <h4>Locais preferenciais</h4>
  <ul><li>Veias do antebraço e dorso da mão; evitar membros com fístula arteriovenosa, linfedema ou paresia</li></ul>
  <h4>Calibres do cateter (código de cores ISO)</h4>
  <table class="ref-table">
    <tr><th>Calibre</th><th>Cor (padrão)</th><th>Fluxo aprox.</th><th>Uso típico</th></tr>
    <tr><td>14G</td><td>Laranja</td><td>~270 mL/min</td><td>Trauma major, cirurgia com grande perda hemática</td></tr>
    <tr><td>16G</td><td>Cinzento</td><td>~180 mL/min</td><td>Transfusões rápidas, cirurgia major</td></tr>
    <tr><td>18G</td><td>Verde</td><td>~90 mL/min</td><td>Transfusão de sangue, fluidos rápidos</td></tr>
    <tr><td>20G</td><td>Rosa</td><td>~60 mL/min</td><td>Uso geral em adultos</td></tr>
    <tr><td>22G</td><td>Azul</td><td>~35 mL/min</td><td>Adultos com veias frágeis, pediatria</td></tr>
    <tr><td>24G</td><td>Amarelo</td><td>~20 mL/min</td><td>Pediatria, neonatologia, idosos com veias muito finas</td></tr>
  </table>
  <ol class="step-list">
    <li>Seleccionar o cateter de menor calibre adequado à terapêutica</li>
    <li>Aplicar garrote 10–15 cm acima do local de punção</li>
    <li>Desinfectar a pele com anti-séptico, respeitando o tempo de acção</li>
    <li>Puncionar com bisel para cima, ângulo de 15°–30°</li>
    <li>Confirmar refluxo de sangue e progredir o cateter; retirar o mandril</li>
    <li>Remover o garrote, conectar sistema e fixar com penso transparente</li>
    <li>Registar data, calibre, local e nome do executante</li>
  </ol>
  <h4>Complicações a vigiar</h4>
  <ul><li>Flebite, infiltração, extravasamento, infecção local</li></ul>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'#000000',
  title:'Curativo de Feridas',
  sub:'Técnica assética de tratamento de feridas',
  body:`
  <svg class="proc-illus" viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg"><rect width="240" height="130" rx="14" fill="#e7ecf4"/><rect x="60" y="35" width="120" height="60" rx="10" fill="#f6c9ce"/><rect x="90" y="50" width="60" height="30" rx="6" fill="#fff" stroke="#000000" stroke-width="2"/><line x1="98" y1="65" x2="142" y2="65" stroke="#c8202f" stroke-width="3" stroke-linecap="round"/><line x1="105" y1="56" x2="105" y2="74" stroke="#000000" stroke-width="2"/><line x1="135" y1="56" x2="135" y2="74" stroke="#000000" stroke-width="2"/></svg>
  <h4>Material</h4>
  <ul><li>Luvas de procedimento e luvas estéreis, campo/kit de penso estéril, pinças (Kocher/dissecção), tesoura, compressas estéreis, soro fisiológico 0,9% morno, anti-séptico se indicado, penso adequado ao tipo de ferida (gaze simples, hidrocolóide, alginato de cálcio, espuma de poliuretano, filme transparente), adesivo hipoalergénico ou ligadura, saco para resíduos</li></ul>
  <ol class="step-list">
    <li>Higienizar as mãos e reunir material estéril</li>
    <li>Remover o penso anterior com luvas de procedimento</li>
    <li>Avaliar a ferida: tamanho, exsudado, tecido de granulação/necrose, sinais de infecção</li>
    <li>Calçar luvas estéreis; limpar do centro para a periferia com soro fisiológico</li>
    <li>Aplicar o produto/curativo indicado conforme o tipo de ferida</li>
    <li>Fixar o penso, datar e registar características da ferida</li>
  </ol>
  <div class="info-box">Feridas limpas: limpar do centro para fora. Feridas contaminadas/infectadas: limpar de fora para dentro, isolando a zona menos contaminada.</div>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'var(--azul)',
  title:'Aspiração de Secreções',
  sub:'Vias aéreas superiores e tubo endotraqueal',
  body:`
  <svg class="proc-illus" viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg"><rect width="240" height="130" rx="14" fill="#e7ecf4"/><circle cx="80" cy="60" r="36" fill="#f6c9ce"/><path d="M110 55 q40 -14 70 10" stroke="var(--azul)" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="182" y="55" width="34" height="20" rx="5" fill="var(--azul)"/><circle cx="216" cy="65" r="6" fill="var(--azul)"/></svg>
  <h4>Calibre da sonda de aspiração</h4>
  <ul><li><b>Adulto:</b> 12–16 Fr (via aérea artificial: não exceder metade do diâmetro interno do tubo)</li><li><b>Criança:</b> 8–10 Fr</li><li><b>Lactente/RN:</b> 6–8 Fr</li></ul>
  <ul>
    <li>Pré-oxigenar o doente antes do procedimento quando indicado</li>
    <li>Escolher sonda de calibre adequado (não ocluir mais de metade do lúmen da via aérea artificial)</li>
    <li>Aplicar aspiração apenas na retirada da sonda, em movimento rotativo</li>
    <li>Limitar cada aspiração a <b>10–15 segundos</b> para evitar hipoxemia</li>
    <li>Monitorizar SpO₂, frequência cardíaca e sinais de desconforto durante o procedimento</li>
    <li>Pressão de aspiração recomendada: 80–120 mmHg (adulto)</li>
  </ul>`
},
{
  icon: ICON_PROC, bg:'#fbe4e8', fg:'#c8202f',
  title:'Oxigenoterapia',
  sub:'Dispositivos e concentração de oxigénio',
  body:`
  <svg class="proc-illus" viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg"><rect width="240" height="130" rx="14" fill="#fbe4e8"/><circle cx="90" cy="60" r="36" fill="#f6c9ce"/><path d="M60 70 q30 24 60 0" stroke="#c8202f" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="165" y="30" width="24" height="60" rx="6" fill="#fff" stroke="#c8202f" stroke-width="2"/><rect x="171" y="20" width="12" height="14" rx="2" fill="#c8202f"/><line x1="171" y1="45" x2="183" y2="45" stroke="#c8202f" stroke-width="2"/><line x1="171" y1="60" x2="183" y2="60" stroke="#c8202f" stroke-width="2"/></svg>
  <table class="ref-table">
    <tr><th>Dispositivo</th><th>Fluxo</th><th>FiO₂ aproximada</th></tr>
    <tr><td>Cânula nasal</td><td>1–6 L/min</td><td>24–44%</td></tr>
    <tr><td>Máscara facial simples</td><td>5–10 L/min</td><td>40–60%</td></tr>
    <tr><td>Máscara com reservatório (não reinalação)</td><td>10–15 L/min</td><td>60–90%</td></tr>
    <tr><td>Ventimask (Venturi)</td><td>variável</td><td>24–50% (regulável)</td></tr>
  </table>
  <div class="info-box">Vigiar sinais de hipoxemia/hipercápnia, humidificar o oxigénio em fluxos elevados e adequar o dispositivo à condição clínica do doente.</div>`
},
{
  icon: ICON_PROC, bg:'#e7ecf4', fg:'var(--azul)',
  title:'Colheita de Sangue Venoso',
  sub:'Punção venosa para exames laboratoriais',
  body:`
  <svg class="proc-illus" viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg"><rect width="240" height="130" rx="14" fill="#e7ecf4"/><rect x="30" y="55" width="110" height="26" rx="13" fill="#f6c9ce"/><line x1="120" y1="68" x2="150" y2="68" stroke="var(--azul)" stroke-width="4" stroke-linecap="round"/><rect x="150" y="45" width="26" height="46" rx="6" fill="#fff" stroke="var(--azul)" stroke-width="2"/><rect x="154" y="60" width="18" height="28" rx="3" fill="#c8202f"/><rect x="190" y="50" width="26" height="46" rx="6" fill="#fff" stroke="var(--azul)" stroke-width="2"/><rect x="194" y="66" width="18" height="26" rx="3" fill="var(--azul-escuro)"/></svg>
  <h4>Material</h4>
  <ul><li>Sistema de vácuo (holder) com agulha 21–23G (ou butterfly 23–25G em veias finas/pediatria), garrote, anti-séptico, tubos de colheita conforme exame pedido, algodão/compressa, adesivo, luvas de procedimento, contentor de cortantes</li></ul>
  <ol class="step-list">
    <li>Confirmar identidade do doente e requisição de exames</li>
    <li>Aplicar garrote, seleccionar veia e desinfectar a pele</li>
    <li>Puncionar com bisel para cima, ângulo de 15°–30°</li>
    <li>Colher os tubos pela ordem correcta, invertendo suavemente os que contêm aditivo</li>
    <li>Remover o garrote antes de retirar a agulha; comprimir o local</li>
    <li>Identificar os tubos junto ao doente e enviar ao laboratório</li>
  </ol>
  <h4>Ordem recomendada dos tubos</h4>
  <p>Hemocultura → Citrato (coagulação, tampa azul) → Sem aditivo/gel separador (tampa amarela/vermelha) → Heparina (tampa verde) → EDTA (hemograma, tampa roxa) → Fluoreto (glicemia, tampa cinzenta)</p>`
}
]);

// ================= EXAMES LABORATORIAIS =================


