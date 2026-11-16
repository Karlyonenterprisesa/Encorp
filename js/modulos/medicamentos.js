// === medicamentos.js ===
// ===== medicamentos.html =====
// Conteúdo extraído da Lista Nacional de Medicamentos Essenciais de Moçambique 2017

(function(){
  const div = document.createElement('div');
  div.className = 'view';
  div.id = 'view-medicamentos';
  div.innerHTML = `
    <div style="padding:10px 12px 0;">
      <button class="back-btn" style="background:rgba(11,26,51,.08);color:var(--azul-escuro);" onclick="showView('ferramentas')">‹ Ferramentas</button>
    </div>
    <div class="section-title" style="margin-top:14px;">Medicamentos Essenciais</div>
    <div style="margin:0 12px 4px;font-size:12px;color:var(--texto-suave);">Base de dados de medicamentos essenciais com classes terapêuticas, apresentações, dosagens e níveis de prescrição, extraído da Lista Nacional de Medicamentos Essenciais de Moçambique 2017 (LNME).</div>
    <div class="alert-box" style="margin:10px 12px;"><b>⚠️ Informação crítica:</b> Esta ficha é material de estudo e apoio à prática — <b>não substitui</b> o Formulário Nacional de Medicamentos, o protocolo institucional vigente nem o âmbito legal de prática de enfermagem do seu país/serviço. Confirme sempre doses, vias e âmbito de actuação antes de administrar.</div>
    <div class="ec-actions" id="medActions">
      <button onclick="ecOpenPdf('lnme')">📖 Ver lista completa</button>
      <button class="alt" onclick="ecPdfPrint('lnme')">🖨 Imprimir</button>
      <button class="alt" onclick="ecPdfDownload('lnme')">⬇ Baixar PDF</button>
      <button class="alt" onclick="ecAccAll('view-medicamentos',this)">▾ Abrir todas as classes</button>
    </div>
    <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin:4px 12px 12px;">
      <div style="text-align:center;"><img class="zoomable-img" src="img/4c09dfcc0a.webp" alt="Cálculo de gotejamento" style="width:150px;height:180px;object-fit:cover;" onclick="openLightbox('img-gotejamento.jpg','Cálculo de gotejamento','calculo-gotejamento.jpg')"><div class="img-caption">Cálculo de gotejamento</div></div>
      <div style="text-align:center;"><img class="zoomable-img" src="img/de28f2d422.webp" alt="Guia rápido de cálculo de medicamentos" style="width:150px;height:180px;object-fit:cover;" onclick="openLightbox('img-guia-calculo.jpg','Guia rápido de cálculo de medicamentos','guia-calculo-medicamentos.jpg')"><div class="img-caption">Guia rápido de cálculo</div></div>
    </div>
    <div class="search-mini"><input type="text" placeholder="Pesquisar medicamento ou classe..." oninput="filterAcc('medicamentos', this.value)"></div>

    <!-- ANALGÉSICOS E ANTIPIRÉTICOS -->
    <div class="acc" id="medicamentos-acc-0">
      <div class="acc-head" onclick="this.parentElement.classList.toggle('open')">
        <div class="a-icon" style="background:#fbe4e8;color:#c8202f;">${ICON_PROC}</div>
        <div class="a-txt"><div class="a-title">Analgésicos e Antipiréticos</div><div class="a-sub">Alívio da dor e redução da febre</div></div>
        <div class="a-chev">▾</div>
      </div>
      <div class="acc-body"><div class="acc-in">
        <div class="med-card"><h5>Paracetamol</h5><div class="med-classe">Analgésico / Antipirético</div>
          <div class="med-row"><b>Indicações:</b> dor ligeira a moderada, febre</div>
          <div class="med-row"><b>Apresentações:</b> Solução oral 120 mg/5 ml; Comprimido 250 mg dispersível; Comprimido 500 mg; Injectável 1 g/100 ml; Supositório 125 mg, 250 mg, 500 mg</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> VO 500–1000 mg de 6/6 a 8/8h (máx. 4 g/dia); IV 1 g/100 ml conforme protocolo</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 0-2 (conforme apresentação)</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> monitorizar temperatura/dor antes e após administração; atenção à dose máxima diária; risco hepatotóxico em sobredosagem; evitar em insuficiência hepática grave</div></div>
        
        <div class="med-card"><h5>Ibuprofeno</h5><div class="med-classe">Anti-inflamatório não esteróide (AINE)</div>
          <div class="med-row"><b>Indicações:</b> dor ligeira a moderada, febre, processos inflamatórios</div>
          <div class="med-row"><b>Apresentações:</b> Comprimido 200 mg, 400 mg; Suspensão oral 200 mg/5 ml</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> VO 200–400 mg de 6/6 a 8/8h com alimentos</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 1</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> administrar com alimentos; evitar em úlcera péptica activa, insuficiência renal grave e no 3º trimestre da gravidez; risco de hemorragia gastrointestinal</div></div>
        
        <div class="med-card"><h5>Ácido Acetilsalicílico</h5><div class="med-classe">Anti-inflamatório / Antiagregante</div>
          <div class="med-row"><b>Indicações:</b> dor ligeira a moderada, febre, profilaxia de eventos trombóticos</div>
          <div class="med-row"><b>Apresentações:</b> Comprimido 100 mg, 500 mg; Supositório 50 mg, 150 mg</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> VO 500 mg de 6/6 a 8/8h; doses baixas 100 mg/dia para profilaxia cardiovascular</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 3</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> evitar em úlcera péptica, hemorragias activas e alergia ao AAS; risco de síndrome de Reye em crianças</div></div>
        
        <div class="med-card"><h5>Diclofenac</h5><div class="med-classe">Anti-inflamatório não esteróide (AINE)</div>
          <div class="med-row"><b>Indicações:</b> dor moderada a severa, inflamação, cólicas</div>
          <div class="med-row"><b>Apresentações:</b> Injectável 75 mg/3 ml</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> IM/IV 75 mg em dose única ou dividida (máx. 150 mg/dia)</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 3</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> injectar lentamente; monitorizar sinais de hemorragia GI; evitar em insuficiência renal/hepática grave; não usar mais de 2-3 dias em injecção</div></div>
      </div></div>
    </div>

    <!-- ANTI-INFECCIOSOS -->
    <div class="acc" id="medicamentos-acc-1">
      <div class="acc-head" onclick="this.parentElement.classList.toggle('open')">
        <div class="a-icon" style="background:#e8f4f8;color:var(--azul);">${ICON_PROC}</div>
        <div class="a-txt"><div class="a-title">Anti-infecciosos</div><div class="a-sub">Antibióticos, antivirais, antifúngicos e antiparasitários</div></div>
        <div class="a-chev">▾</div>
      </div>
      <div class="acc-body"><div class="acc-in">
        
        <!-- CLASSE: ANTIBIÓTICOS BETALACTÂMICOS -->
        <div style="margin:8px 0 4px; font-weight:600; color:var(--azul-escuro); border-bottom:1px solid var(--borda); padding-bottom:6px;">Β-Lactâmicos (Penicilinas e Cefalosporinas)</div>
        
        <div class="med-card"><h5>Amoxicilina</h5><div class="med-classe">Antibiótico Β-Lactâmico (Penicilina)</div>
          <div class="med-row"><b>Indicações:</b> infecções bacterianas sensíveis: otites, sinusites, infecções respiratórias, urinárias, pele e tecidos moles</div>
          <div class="med-row"><b>Apresentações:</b> Cápsula 250 mg, 500 mg; Pó para suspensão 125 mg/5 ml, 250 mg/5 ml</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> VO 250–500 mg de 8/8h (3 x dia); dose máx. 3 g/dia</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 1</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> avaliar alergia a penicilinas; reacções cruzadas com cefalosporinas (10%); tomar com ou sem alimentos; monitor para diarreia (efeito adverso frequente)</div></div>
        
        <div class="med-card"><h5>Amoxicilina + Ácido Clavulânico</h5><div class="med-classe">Antibiótico combinado (Β-Lactâmico + Inibidor de β-Lactamase)</div>
          <div class="med-row"><b>Indicações:</b> infecções por bactérias produtoras de β-lactamase (otites, sinusites, infecções respiratórias complicadas)</div>
          <div class="med-row"><b>Apresentações:</b> Comprimido 500/125 mg; Pó para suspensão 250/62,5 mg/5 ml</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> VO 500/125 mg de 8/8h ou 875/125 mg de 12/12h</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 1</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> mesmas precauções que amoxicilina; risco aumentado de hepatotoxicidade; tomar com alimentos para melhor tolerância GI</div></div>
        
        <div class="med-card"><h5>Benzilpenicilina Procaína</h5><div class="med-classe">Antibiótico Β-Lactâmico (Penicilina Intramuscular)</div>
          <div class="med-row"><b>Indicações:</b> infecções sistémicas graves, sífilis, meningite bacteriana, erisipela</div>
          <div class="med-row"><b>Apresentações:</b> Pó para Injectável 1.200.000 UI; 2.400.000 UI</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> IM 1.200.000–2.400.000 UI/dia, dividido em 1-2 injecções</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 2</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> sempre IM (nunca IV directo); teste de sensibilidade recomendado; monitor para reacções de Jarisch-Herxheimer em sífilis; armazenar correctamente</div></div>
        
        <div class="med-card"><h5>Ceftriaxona</h5><div class="med-classe">Antibiótico Β-Lactâmico (Cefalosporina 3ª geração)</div>
          <div class="med-row"><b>Indicações:</b> infecções graves: meningite bacteriana, septicemia, pneumonia nosocomial, gonorreia</div>
          <div class="med-row"><b>Apresentações:</b> Pó para Injectável 500 mg, 1 g, 2 g</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> IM/IV 1–2 g de 12/12h (até 4 g/dia em casos graves como meningite)</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 2</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> verificar alergia a cefalosporinas e penicilinas (10% reacção cruzada); reconstituir correctamente; administrar IV lentamente (3-5 min); monitor para colite pseudomembranosa</div></div>

        <div class="med-card"><h5>Cefixima</h5><div class="med-classe">Antibiótico Β-Lactâmico (Cefalosporina 3ª geração, oral)</div>
          <div class="med-row"><b>Indicações:</b> infecções respiratórias, urinárias, gonorreia não complicada</div>
          <div class="med-row"><b>Apresentações:</b> Cápsula 200 mg, 400 mg; Pó para suspensão 100 mg/5 ml</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> VO 200–400 mg de 12/12h</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 2</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> pode tomar com ou sem alimentos; risco de diarreia; monitor em insuficiência renal</div></div>

        <!-- CLASSE: MACROLÍDEOS -->
        <div style="margin:12px 0 4px; font-weight:600; color:var(--azul-escuro); border-bottom:1px solid var(--borda); padding-bottom:6px;">Macrolídeos</div>

        <div class="med-card"><h5>Azitromicina</h5><div class="med-classe">Antibiótico Macrolídeo</div>
          <div class="med-row"><b>Indicações:</b> infecções respiratórias (bronquite, pneumonia), STI (ITS), doenças causadas por Mycobacterium avium em VIH/SIDA</div>
          <div class="med-row"><b>Apresentações:</b> Comprimido 250 mg, 500 mg; Pó para suspensão 200 mg/5 ml</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> VO 500 mg no dia 1, depois 250 mg/dia durante 4 dias (ou 500 mg/dia 3 dias para bronquite aguda)</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 1</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> tomar 2 horas antes ou 2 horas após alimentos; risco de prolongamento de QT; evitar em miopia; gastrointestinal como efeito adverso frequente</div></div>

        <div class="med-card"><h5>Eritromicina</h5><div class="med-classe">Antibiótico Macrolídeo</div>
          <div class="med-row"><b>Indicações:</b> infecções respiratórias, STI/ITS (em alergia a penicilinas), acne</div>
          <div class="med-row"><b>Apresentações:</b> Comprimido revestido 250 mg, 500 mg; Oftalmológico pomada 0,5%</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> VO 250–500 mg de 6/6h (4 x dia) ou 500 mg–1 g de 12/12h (libertação prolongada)</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 1</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> tomar com água; alimentos reduzem absorção (comprimidos revestidos podem tomar com alimentos); gastrointestinal como efeito adverso muito frequente; aromatase GI comum</div></div>

        <!-- CLASSE: FLUOROQUINOLONAS -->
        <div style="margin:12px 0 4px; font-weight:600; color:var(--azul-escuro); border-bottom:1px solid var(--borda); padding-bottom:6px;">Fluoroquinolonas</div>

        <div class="med-card"><h5>Ciprofloxacina</h5><div class="med-classe">Antibiótico Fluoroquinolona</div>
          <div class="med-row"><b>Indicações:</b> infecções urinárias, respiratórias (Gram-negativos), gastroenterite, STI/ITS (gonorreia)</div>
          <div class="med-row"><b>Apresentações:</b> Comprimido 250 mg, 500 mg, 750 mg; Solução IV 2 mg/ml</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> VO 250–750 mg de 12/12h; IV 400 mg de 12/12h</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 2</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> tomar com água (2 horas distante de antiácidos); fotossensibilidade; tendinite (especialmente em >60 anos); risco de prolongamento QT; evitar em crianças/adolescentes se possível</div></div>

        <!-- CLASSE: SULFONAMIDAS -->
        <div style="margin:12px 0 4px; font-weight:600; color:var(--azul-escuro); border-bottom:1px solid var(--borda); padding-bottom:6px;">Sulfonamidas</div>

        <div class="med-card"><h5>Trimetoprim-Sulfametoxazol (TMP-SMX)</h5><div class="med-classe">Antibiótico Sulfonamida combinada</div>
          <div class="med-row"><b>Indicações:</b> infecções urinárias, PCP profilaxia/tratamento em VIH/SIDA, infecções respiratórias, diarreias bacterianas</div>
          <div class="med-row"><b>Apresentações:</b> Comprimido 400/80 mg (pediátrico), 800/160 mg; Suspensão oral 40/8 mg/ml</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> VO 800/160 mg de 12/12h; profilaxia PCP: 800/160 mg/dia ou 3x/semana</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 1-2</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> tomar com água; erupção cutânea frequente (não é alergia); monitor para citopenias; evitar em deficiência de G6PD; risco de hiperkalemia</div></div>

        <!-- CLASSE: ANTIVIRAIS -->
        <div style="margin:12px 0 4px; font-weight:600; color:var(--azul-escuro); border-bottom:1px solid var(--borda); padding-bottom:6px;">Antivirais</div>

        <div class="med-card"><h5>Zidovudina (AZT)</h5><div class="med-classe">Antiviral - Inibidor de transcriptase reversa (ITRN)</div>
          <div class="med-row"><b>Indicações:</b> VIH/SIDA, profilaxia pós-exposição, prevenção transmissão vertical (gestação)</div>
          <div class="med-row"><b>Apresentações:</b> Cápsula 100 mg, 250 mg; Xarope 50 mg/5 ml; Injectável 10 mg/ml</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> VO 300 mg/dia dividido (200 mg manhã + 100 mg à noite, ou 3x100 mg); IV conforme protocolo VIH</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 3</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> tomar com alimentos; monitor CBC (anemia, neutropenia); neuropatia; lipodistrofia com uso prolongado; não tomar com d4T (potencial toxicidade)</div></div>

        <div class="med-card"><h5>Lamivudina (3TC)</h5><div class="med-classe">Antiviral - Inibidor de transcriptase reversa (ITRN)</div>
          <div class="med-row"><b>Indicações:</b> VIH/SIDA, hepatite B crónica</div>
          <div class="med-row"><b>Apresentações:</b> Comprimido 150 mg; Xarope 10 mg/ml</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> VO 150 mg de 12/12h ou 300 mg/dia</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 3</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> ajustar em insuficiência renal; pancreatite em crianças; neuropatia periférica; monitor função renal</div></div>

      </div></div>
    </div>

    <!-- CARDIOVASCULARES -->
    <div class="acc" id="medicamentos-acc-2">
      <div class="acc-head" onclick="this.parentElement.classList.toggle('open')">
        <div class="a-icon" style="background:#ffe8e8;color:#c8202f;">${ICON_PROC}</div>
        <div class="a-txt"><div class="a-title">Medicamentos Cardiovasculares</div><div class="a-sub">Anti-hipertensivos, inotrópicos, antiarrítmicos</div></div>
        <div class="a-chev">▾</div>
      </div>
      <div class="acc-body"><div class="acc-in">
        
        <div class="med-card"><h5>Lisinopril</h5><div class="med-classe">Antihipertensivo - Inibidor ACE</div>
          <div class="med-row"><b>Indicações:</b> hipertensão, insuficiência cardíaca, pós-enfarte do miocárdio</div>
          <div class="med-row"><b>Apresentações:</b> Comprimido 5 mg, 10 mg, 20 mg</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> VO 10 mg/dia (intervalo 5-40 mg/dia)</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 3</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> monitorizar tensão arterial; hipercaliemia; tosse seca frequente; risco de angioedema (raro); evitar em gravidez</div></div>

        <div class="med-card"><h5>Enalapril</h5><div class="med-classe">Antihipertensivo - Inibidor ACE</div>
          <div class="med-row"><b>Indicações:</b> hipertensão, insuficiência cardíaca sistólica</div>
          <div class="med-row"><b>Apresentações:</b> Comprimido 2,5 mg, 5 mg, 10 mg</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> VO 5 mg/dia (intervalo 2,5-20 mg/dia), dividido em 1-2 doses</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 3</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> tomar sem alimentos; monitor tensão, rins (creatinina, potássio); tosse seca; risco de angioedema; evitar em gravidez</div></div>

        <div class="med-card"><h5>Nifedipina</h5><div class="med-classe">Antihipertensivo - Bloqueador de canal de cálcio</div>
          <div class="med-row"><b>Indicações:</b> hipertensão, angina pectoris</div>
          <div class="med-row"><b>Apresentações:</b> Comprimido libertação imediata 10 mg, 20 mg; Comprimido libertação prolongada 30 mg, 60 mg</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> Libertação imediata: 10-20 mg de 8/8h; Libertação prolongada: 30-60 mg/dia</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 3</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> monitorizr tensão; não partir comprimidos LP; edema periférico; taquicardia reflexa; evitar em IAM agudo; cuidado com sumo de toranja</div></div>

        <div class="med-card"><h5>Atenolol</h5><div class="med-classe">Antihipertensivo / Antianginoso - Bloqueador beta</div>
          <div class="med-row"><b>Indicações:</b> hipertensão, angina pectoris, arritmias, pós-enfarte do miocárdio</div>
          <div class="med-row"><b>Apresentações:</b> Comprimido 25 mg, 50 mg, 100 mg</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> VO 25–100 mg/dia em dose única</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 3</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> não interromper bruscamente (risco de rebound); monitorizr FC e PA; fadiga, impotência; evitar em asma/DPOC grave; cuidado em diabetes</div></div>

        <div class="med-card"><h5>Furosemida</h5><div class="med-classe">Diurético - Ansa</div>
          <div class="med-row"><b>Indicações:</b> edema, hipertensão, insuficiência cardíaca, edema pulmonar agudo</div>
          <div class="med-row"><b>Apresentações:</b> Comprimido 40 mg; Injectável 10 mg/ml (ampola 4 ml)</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> VO 40 mg/dia (intervalo 20-600 mg/dia); IM/IV 20-40 mg, até 600 mg/dia em casos graves</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 2-3</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> monitor eletrólitos (K+, Na+, Cl-); desidratação; hipotensão; hiperuricemia; ototoxicidade (altas doses IV); dar manhã para evitar noctúria</div></div>

        <div class="med-card"><h5>Digoxina</h5><div class="med-classe">Inotrópico / Antiarríumico</div>
          <div class="med-row"><b>Indicações:</b> insuficiência cardíaca, fibrilhação auricular, flutter auricular</div>
          <div class="med-row"><b>Apresentações:</b> Comprimido 250 mcg; Solução oral 50 mcg/ml; Injectável 500 mcg/2 ml</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> VO dose digitalização: 500 mcg-1 mg, depois 250 mcg de 6/6h até atingir efeito; manutenção 250 mcg/dia</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 3</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> monitorizar FC (bradicardia <60 bpm é sinal de toxicidade); monitor K+ (hipocaliemia aumenta risco de toxicidade); estreita margem terapêutica; ECG; náusea, arritmias são sinais de toxicidade</div></div>

      </div></div>
    </div>

    <!-- DESINFECTANTES E ANTISÉPTICOS -->
    <div class="acc" id="medicamentos-acc-3">
      <div class="acc-head" onclick="this.parentElement.classList.toggle('open')">
        <div class="a-icon" style="background:#e7ecf4;color:var(--azul-escuro);">${ICON_PROC}</div>
        <div class="a-txt"><div class="a-title">Desinfectantes e Antisépticos</div><div class="a-sub">Limpeza, desinfecção e cuidados de feridas</div></div>
        <div class="a-chev">▾</div>
      </div>
      <div class="acc-body"><div class="acc-in">
        
        <div class="med-card"><h5>Álcool Etílico 70%</h5><div class="med-classe">Desinfectante / Antisséptico</div>
          <div class="med-row"><b>Indicações:</b> desinfecção de pele antes de injecções/punções, limpeza de equipamento</div>
          <div class="med-row"><b>Apresentações:</b> Solução 70% v/v</div>
          <div class="med-row"><b>Via/Aplicação:</b> Tópico - aplicar com algodão/gaze sobre área a desinfectar</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 1</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> deixar secar antes de punção/injecção; evitar em pele lesada; inflamável - armazenar adequadamente; odor característico</div></div>

        <div class="med-card"><h5>Clorexidina 0,5%</h5><div class="med-classe">Desinfectante / Antisséptico</div>
          <div class="med-row"><b>Indicações:</b> desinfecção da pele, feridas, cavidade oral</div>
          <div class="med-row"><b>Apresentações:</b> Solução 0,5%; Colchete para higiene oral</div>
          <div class="med-row"><b>Via/Aplicação:</b> Tópico - aplicar com algodão; enxaguatório oral</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 1</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> melhor acção que álcool em peles sujas/gordurosas; evitar contacto com olhos (irritação); descoloração de dentes com uso prolongado de enxaguante; alergia rara mas possível</div></div>

        <div class="med-card"><h5>Água Destilada/Soro Fisiológico 0,9%</h5><div class="med-classe">Solução de Limpeza / Irrigação</div>
          <div class="med-row"><b>Indicações:</b> limpeza de feridas, irrigação, preparação de medicações</div>
          <div class="med-row"><b>Apresentações:</b> Frasco 500 ml, 1L; Ampola 5 ml, 10 ml</div>
          <div class="med-row"><b>Via/Aplicação:</b> Tópico - verter sobre ferida/usar em irrigação</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 0-1</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> estéril para feridas abertas; à temperatura ambiente ou morna (não quente); manter recipiente tapado após abertura; válido até 24h após abertura se não esterilizado</div></div>

      </div></div>
    </div>

    <!-- VITAMINAS E MINERAIS -->
    <div class="acc" id="medicamentos-acc-4">
      <div class="acc-head" onclick="this.parentElement.classList.toggle('open')">
        <div class="a-icon" style="background:#e7ecf4;color:#000000;">${ICON_PROC}</div>
        <div class="a-txt"><div class="a-title">Vitaminas e Minerais</div><div class="a-sub">Suplementação nutricional e deficiências</div></div>
        <div class="a-chev">▾</div>
      </div>
      <div class="acc-body"><div class="acc-in">
        
        <div class="med-card"><h5>Vitamina A</h5><div class="med-classe">Vitamina lipossolúvel</div>
          <div class="med-row"><b>Indicações:</b> deficiência de vitamina A, sarampo, infecções recorrentes, oftalmia</div>
          <div class="med-row"><b>Apresentações:</b> Cápsula 200.000 UI; Solução oral 200.000 UI/ml</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> VO 200.000 UI em 2 doses, com 24h intervalo; crianças 100.000-200.000 UI segundo idade</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 1-2</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> evitar megadoses em gravidez (teratogénico); com alimentos para melhor absorção; toxicidade crónica em doses elevadas; fundamental em crianças com sarampo</div></div>

        <div class="med-card"><h5>Ácido Fólico</h5><div class="med-classe">Vitamina B9</div>
          <div class="med-row"><b>Indicações:</b> profilaxia/tratamento de deficiência de ácido fólico, anemia megaloblástica, uso de AZT/TMP-SMX</div>
          <div class="med-row"><b>Apresentações:</b> Comprimido 1 mg, 5 mg</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> VO 1–5 mg/dia (profilaxia em VIH geralmente 1 mg/dia)</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 1-2</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> deve ser dado antes ou simultaneamente com medicações que antagonizam folato (TMP-SMX, AZT); protege contra toxicidade; sempre com B12 se deficiência combinada</div></div>

        <div class="med-card"><h5>Sulfato de Ferro</h5><div class="med-classe">Mineral - Suplemento de Ferro</div>
          <div class="med-row"><b>Indicações:</b> deficiência de ferro, anemia ferropénica, gestação/lactação</div>
          <div class="med-row"><b>Apresentações:</b> Comprimido 300 mg (60 mg Fe); Xarope 14 mg Fe/ml; Injectável 50 mg Fe/ml</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> VO 300 mg/dia com vitamina C (aumenta absorção); IM/IV conforme protocolo</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 1</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> tomar com sumo de laranja (não chá/café que reduzem absorção); fezes escuras (esperado); constipação/diarreia frequentes; feridas das gengivas com comprimidos de libertação prolongada</div></div>

        <div class="med-card"><h5>Cloreto de Potássio (KCl)</h5><div class="med-classe">Mineral - Electrólito</div>
          <div class="med-row"><b>Indicações:</b> hipocaliemia, uso de diuréticos de ansa, queimaduras, diarreia crónica</div>
          <div class="med-row"><b>Apresentações:</b> Solução oral 20% (40 mEq/20 ml); Comprimido 750 mg (10 mEq) - libertação prolongada</div>
          <div class="med-row"><b>Via/Dose habitual (adulto):</b> VO 20-40 mEq/dia dividido em 2-4 doses conforme nível sérico</div>
          <div class="med-row"><b>Nível de Prescrição:</b> 2</div>
          <div class="med-row"><b>Cuidados de enfermagem:</b> monitor nível K+ sérico; dissolva solução em água (irritante ao esófago); queimação no esófago se tomado seco; risco de hiperkalemia em insuficiência renal; ECG se K+ muito elevado</div></div>

      </div></div>
    </div>

    <!-- LINK PARA PDF COMPLETO -->
    <div style="margin:12px;padding:12px;background:#e7ecf4;border-radius:8px;border-left:4px solid var(--azul-escuro);">
      <div style="font-weight:600;margin-bottom:8px;color:var(--azul-escuro);">📄 Documento Completo</div>
      <div style="font-size:12px;color:var(--texto);margin-bottom:10px;">Consulte o PDF completo da Lista Nacional de Medicamentos Essenciais de Moçambique 2017 com todas as 31 categorias terapêuticas.</div>
      <div class="ec-actions" style="margin:0;">
        <button onclick="ecOpenPdf('lnme')">🔍 Ver lista completa (PDF)</button>
        <button class="alt" onclick="ecPdfPrint('lnme')">🖨 Imprimir</button>
        <button class="alt" onclick="ecPdfDownload('lnme')">⬇ Baixar PDF</button>
      </div>
    </div>

    <div style="margin:16px 8px 60px;">
      <footer style="font-size:11px;color:var(--texto-suave);text-align:center;line-height:1.6;border-top:1px solid var(--borda);padding-top:12px;">
        <b>Conteúdo de apoio ao estudo e prática de enfermagem.</b><br>
        <b>⚠️ Responsabilidade profissional:</b> Confirme sempre no Formulário Nacional de Medicamentos, no protocolo institucional actualizado e em referências clínicas reconhecidas antes de qualquer administração. O âmbito de prática varia conforme qualificação, contexto e legislação do seu país/instituição.
      </footer>
    </div>
  `;
  document.getElementById('app').insertBefore(div, document.querySelector('.bottom-fixed'));
})();

// ================= MODO ESTUDANTE =================


