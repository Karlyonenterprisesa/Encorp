// === diagnosticos.js ===
// ===== diagnosticos.js — lista NANDA-I, ficha de diagnóstico (diagnosticos.html) =====

const EDITION_LABELS = {
  '2024': 'NANDA 2024-2026',
  '2021': 'NANDA 2021-2023'
};
function totalDiagCount(data){
  let t=0;
  data.forEach(d=>d.classes.forEach(c=>t+=c.diagnosticos.length));
  return t;
}
function totalClassCount(data){
  let t=0;
  data.forEach(d=>t+=d.classes.length);
  return t;
}
function createBrowser(suffix){
  const mainEl = document.getElementById('main' + suffix);
  const statsEl = document.getElementById('stats' + suffix);
  const searchInput = document.getElementById('searchInput' + suffix);
  const clearBtn = document.getElementById('clearBtn' + suffix);
  const footerEl = document.getElementById('editionFooter' + suffix);
  const tabsEl = document.getElementById('editionTabs' + suffix);

  let activeEdition = '2024';

  function getData(){
    return activeEdition === '2021' ? DATA_2021 : DATA_2024;
  }

  function setEdition(edition){
    if(edition === activeEdition) return;
    activeEdition = edition;
    if(tabsEl){
      tabsEl.querySelectorAll('.edition-tab').forEach(btn=>{
        btn.classList.toggle('active', btn.dataset.edition === edition);
      });
    }
    searchInput.value = '';
    clearBtn.classList.remove('show');
    render('');
  }

  function render(term){
    const t = (term||'').trim();
    const nt = normalize(t);
    const data = getData();
    mainEl.innerHTML = '';
    let totalMatches = 0;
    let anyOpenDomain = !!nt;

    data.forEach((dom, di) => {
      const domainMatchesTitle = normalize(dom.dominio).includes(nt);
      let domainHasMatch = false;
      const domainDiv = document.createElement('div');
      domainDiv.className = 'domain' + (anyOpenDomain ? '' : '');

      let classesHtml = '';
      let domainDiagCount = 0;
      let domainVisibleCount = 0;

      dom.classes.forEach((cls, ci) => {
        domainDiagCount += cls.diagnosticos.length;
        const classMatchesTitle = normalize(cls.classe).includes(nt);
        const matchedDiags = cls.diagnosticos.filter(dg => !nt || normalize(dg).includes(nt) || classMatchesTitle || domainMatchesTitle);

        if(nt && matchedDiags.length===0) return;

        domainVisibleCount += matchedDiags.length;
        domainHasMatch = domainHasMatch || matchedDiags.length>0;

        let itemsHtml = '';
        if(matchedDiags.length===0){
          itemsHtml = '<li class="empty-classe">Esta classe não contém diagnósticos atualmente</li>';
        } else {
          matchedDiags.forEach(dg=>{
            const kind = classify(dg);
            const code = (activeEdition === '2021' && CODES_2021[dg]) ? CODES_2021[dg]
                       : (activeEdition === '2024' && CODES_2024[dg]) ? CODES_2024[dg] : '';
            const codeHtml = code ? '<span class="diag-code">' + code + '</span>' : '';
            itemsHtml += '<li class="diag-item ' + kind + '" data-dom="' + escapeAttr(dom.dominio) + '" data-cls="' + escapeAttr(cls.classe) + '" data-diag="' + escapeAttr(dg) + '">' + codeHtml + highlight(dg, t) + '</li>';
          });
        }

        classesHtml += '<div class="classe' + (nt ? ' open':'') + '">' +
          '<div class="classe-head" onclick="this.parentElement.classList.toggle(\'open\')">' +
            '<span class="ctitle">' + highlight(cls.classe, t) + '</span>' +
            '<span style="display:flex;align-items:center;gap:8px;">' +
              '<span class="ccount">' + matchedDiags.length + '</span>' +
              '<span class="cchev">▾</span>' +
            '</span>' +
          '</div>' +
          '<div class="classe-body"><ul class="diag-list">' + itemsHtml + '</ul></div>' +
        '</div>';
      });

      if(nt && !domainHasMatch && !domainMatchesTitle) return;

      totalMatches += domainVisibleCount;

      domainDiv.className = 'domain' + (nt ? ' open' : '');
      domainDiv.innerHTML =
        '<div class="domain-head" onclick="this.parentElement.classList.toggle(\'open\')">' +
          '<span class="title">' + highlight(dom.dominio, t) + '</span>' +
          '<span style="display:flex;align-items:center;gap:8px;">' +
            '<span class="count">' + domainDiagCount + ' diag.</span>' +
            '<span class="chev">▾</span>' +
          '</span>' +
        '</div>' +
        '<div class="domain-body">' + classesHtml + '</div>';

      mainEl.appendChild(domainDiv);
    });

    if(nt && mainEl.children.length===0){
      mainEl.innerHTML = '<div class="no-results"><div>🔍</div>Nenhum diagnóstico encontrado para<br><b>"' + t + '"</b></div>';
      statsEl.textContent = '';
    } else if(nt){
      statsEl.innerHTML = '<b>' + totalMatches + '</b> diagnóstico(s) encontrado(s)';
    } else {
      statsEl.innerHTML = '<b>' + data.length + '</b> Domínios · <b>' + totalClassCount(data) + '</b> Classes · <b>' + totalDiagCount(data) + '</b> Diagnósticos de Enfermagem';
    }

    if(footerEl){
      footerEl.innerHTML = 'Conteúdo extraído da Taxonomia II ' + EDITION_LABELS[activeEdition] +
        ' (Domínios, Classes e Diagnósticos) · <b>' + data.length + ' Domínios · ' +
        totalClassCount(data) + ' Classes · ' + totalDiagCount(data) + ' Diagnósticos</b>';
    }
  }

  searchInput.addEventListener('input', (e)=>{
    const v = e.target.value;
    clearBtn.classList.toggle('show', v.length>0);
    render(v);
  });
  clearBtn.addEventListener('click', ()=>{
    searchInput.value='';
    clearBtn.classList.remove('show');
    render('');
    searchInput.focus();
  });

  render('');

  return { setEdition };
}

// Instância única para "Diagnósticos de Enfermagem" (ids sem sufixo).
const browsers = {
  '': createBrowser('')
};

// ===== Catálogo genérico (sem edições) para NIC (Intervenções) e NOC (Resultados) =====
// Reutiliza a mesma estrutura visual (domínio > classe > itens), sem o cartão de
// diagnóstico nem a classificação real/risco/disposição, que só se aplicam à NANDA-I.

const NICNOC_DIAGNOSTICO = {
  "Dor aguda": { nic:["Avaliar a dor com escala validada (numérica/visual/comportamental) a cada turno e após intervenção","Administrar analgesia conforme prescrição e reavaliar eficácia 30–60 min depois","Aplicar medidas não farmacológicas (posicionamento, calor/frio, relaxamento, distração)","Monitorizar sinais vitais e sinais não-verbais de dor","Registar localização, intensidade, tipo e factores de alívio/agravamento"],
    noc:["Nível de dor reduzido para o valor aceite pelo doente (ex.: ≤3/10)","Doente verbaliza alívio após a intervenção","Sinais vitais dentro dos parâmetros habituais","Doente demonstra e aplica técnicas de controlo da dor"] },
  "Dor crônica": { nic:["Avaliação sistemática e regular da dor com escala validada","Elaborar em conjunto um plano multimodal de controlo da dor (farmacológico e não farmacológico)","Ensinar técnicas de relaxamento, distração e conservação de energia","Encaminhar para consulta de dor crónica/fisioterapia se necessário","Monitorizar impacto na funcionalidade, sono e humor"],
    noc:["Nível de dor controlado dentro de limites toleráveis para o doente","Doente mantém actividades de vida diária apesar da dor crónica","Doente utiliza estratégias de auto-gestão da dor","Melhoria do sono e do humor relatados"] },
  "Síndrome da dor crônica": { nic:["Avaliação multidimensional (dor, sono, humor, funcionalidade)","Plano de tratamento multimodal com equipa multidisciplinar","Ensino de estratégias de coping e conservação de energia","Monitorizar sinais de depressão/ansiedade associados"],
    noc:["Redução do impacto funcional e emocional da dor crónica","Doente participa em actividades sociais/laborais compatíveis","Melhoria do padrão de sono"] },
  "Dor no trabalho de parto": { nic:["Avaliar intensidade e características da dor a cada contração","Incentivar técnicas de respiração e posicionamento activo","Administrar analgesia (ex.: epidural) conforme prescrição e desejo da parturiente","Proporcionar apoio contínuo e informação sobre a evolução do trabalho de parto"],
    noc:["Parturiente refere controlo satisfatório da dor","Sinais vitais maternos e fetais estáveis","Parturiente participa activamente nas decisões sobre analgesia"] },
  "Náusea": { nic:["Avaliar frequência, intensidade e factores desencadeantes da náusea","Administrar antieméticos conforme prescrição","Promover ambiente calmo, arejado, sem odores fortes","Oferecer refeições pequenas e frequentes, evitar alimentos gordurosos"],
    noc:["Redução/ausência de episódios de náusea e vómito","Doente mantém ingestão nutricional adequada","Doente identifica e evita factores desencadeantes"] },
  "Ansiedade excessiva": { nic:["Avaliar nível de ansiedade e factores desencadeantes","Utilizar escuta activa e comunicação calma e clara","Ensinar técnicas de respiração e relaxamento","Reduzir estímulos ambientais excessivos","Envolver a família/rede de apoio quando apropriado"],
    noc:["Doente verbaliza redução do nível de ansiedade","Doente utiliza estratégias eficazes de autocontrolo da ansiedade","Sinais vitais e comportamento compatíveis com nível reduzido de ansiedade"] },
  "Medo excessivo": { nic:["Identificar o objecto/causa do medo e validar a experiência do doente","Fornecer informação clara e honesta sobre procedimentos e prognóstico","Permanecer junto do doente em momentos de maior medo","Ensinar técnicas de relaxamento e distração"],
    noc:["Doente verbaliza diminuição do medo","Doente demonstra comportamentos de enfrentamento adequados"] },
  "Enfrentamento desadaptativo": { nic:["Avaliar estratégias de coping habituais e recursos disponíveis","Ajudar o doente a identificar pontos fortes e recursos de apoio","Ensinar estratégias adaptativas de resolução de problemas","Encaminhar para apoio psicológico/social se necessário"],
    noc:["Doente identifica e utiliza estratégias de enfrentamento eficazes","Doente verbaliza sensação de controlo sobre a situação"] },
  "Luto desadaptativo": { nic:["Facilitar a expressão de sentimentos relacionados com a perda","Validar o processo de luto sem julgamento","Identificar sinais de luto complicado e encaminhar se necessário","Envolver rede de apoio familiar/espiritual"],
    noc:["Doente expressa sentimentos relacionados com a perda","Doente demonstra progressão saudável no processo de luto"] },
  "Risco de infecção": { nic:["Lavagem das mãos e técnica assética em todos os procedimentos invasivos","Monitorizar sinais e sintomas de infecção (febre, rubor, exsudado, dor)","Cuidados com pele, mucosas e dispositivos invasivos (cateteres, drenos)","Educar o doente/família sobre sinais de alerta e higiene"],
    noc:["Ausência de sinais e sintomas de infecção","Doente/família demonstra medidas de prevenção de infecção","Parâmetros analíticos/inflamatórios dentro da normalidade"] },
  "Risco de infecção de ferida cirúrgica": { nic:["Vigiar sinais inflamatórios/infecciosos na ferida operatória a cada turno","Técnica assética na realização de pensos","Educar sobre cuidados com a ferida no domicílio","Monitorizar temperatura corporal e parâmetros inflamatórios"],
    noc:["Ferida cirúrgica cicatriza sem sinais de infecção","Doente/família demonstra cuidados adequados com a ferida"] },
  "Integridade da pele prejudicada": { nic:["Avaliar a pele e a lesão a cada turno (localização, dimensão, exsudado)","Realizar penso conforme protocolo e prescrição","Aliviar a pressão com mudança de decúbito regular e superfícies de alívio","Optimizar hidratação e estado nutricional"],
    noc:["Progressão da cicatrização da lesão","Ausência de sinais de infecção na lesão","Pele circundante íntegra e hidratada"] },
  "Risco de integridade da pele prejudicada": { nic:["Avaliação sistemática do risco (ex.: escala de Braden)","Mudança de decúbito programada e uso de superfícies de alívio de pressão","Manter a pele limpa, seca e hidratada","Optimizar estado nutricional e hídrico"],
    noc:["Pele mantém-se íntegra, sem sinais de lesão","Doente/cuidador reconhece factores de risco e medidas preventivas"] },
  "Lesão por pressão no adulto": { nic:["Classificar e monitorizar a evolução da lesão por pressão","Aliviar totalmente a pressão na zona afectada","Realizar tratamento tópico conforme prescrição/protocolo","Optimizar estado nutricional e hídrico"],
    noc:["Progressão visível da cicatrização por estadio","Ausência de novas lesões por pressão","Ausência de sinais de infecção na lesão"] },
  "Risco de lesão por pressão no adulto": { nic:["Avaliação do risco com escala validada (ex.: Braden) na admissão e regularmente","Plano de mudança de decúbito e uso de superfícies de alívio de pressão","Inspecção diária da pele, sobretudo em proeminências ósseas","Optimizar nutrição, hidratação e mobilidade"],
    noc:["Pele sem sinais de lesão por pressão durante o internamento","Doente/cuidador demonstra medidas de prevenção"] },
  "Mobilidade física prejudicada": { nic:["Avaliar o grau de mobilidade e capacidade funcional","Assistir/incentivar a mobilização progressiva (levante, marcha)","Realizar/ensinar exercícios de amplitude articular","Prevenir complicações de imobilidade (trombose, úlceras, atelectasia)"],
    noc:["Doente melhora o grau de mobilidade e amplitude de movimento","Ausência de complicações associadas à imobilidade","Doente participa activamente no plano de mobilização"] },
  "Risco de mobilidade física prejudicada": { nic:["Avaliar factores de risco para redução da mobilidade","Promover mobilização precoce e regular","Ensinar exercícios preventivos de manutenção articular/muscular"],
    noc:["Doente mantém o nível de mobilidade prévio","Ausência de complicações de imobilidade"] },
  "Risco de quedas no adulto": { nic:["Avaliar risco de queda com escala validada (ex.: Morse)","Manter ambiente seguro (iluminação, calçado adequado, campainha ao alcance)","Vigilância acrescida e auxílio na deambulação quando indicado","Educar doente/família sobre prevenção de quedas"],
    noc:["Ausência de quedas durante o internamento/cuidados","Doente/família identifica factores de risco e medidas preventivas"] },
  "Risco de criança cair": { nic:["Avaliar risco de queda específico da criança (idade, desenvolvimento, mobilidade)","Manter grades da cama/berço elevadas e ambiente seguro","Supervisão constante e educação dos pais/cuidadores"],
    noc:["Ausência de quedas durante o internamento","Pais/cuidadores demonstram medidas de segurança adequadas"] },
  "Padrão respiratório ineficaz": { nic:["Monitorizar frequência, ritmo e esforço respiratório","Posicionar em semi-Fowler/Fowler para optimizar a ventilação","Administrar oxigenoterapia conforme prescrição","Ensinar técnicas de respiração diafragmática/tosse eficaz"],
    noc:["Padrão respiratório dentro dos parâmetros normais","Saturação de oxigénio adequada sem sinais de dificuldade respiratória"] },
  "Troca de gases prejudicada": { nic:["Monitorizar saturação de oxigénio e gasometria conforme prescrição","Posicionar para optimizar ventilação/perfusão (ex.: semi-Fowler)","Administrar oxigenoterapia conforme prescrição","Incentivar tosse eficaz e mobilização de secreções"],
    noc:["Saturação de oxigénio e gasometria dentro dos parâmetros esperados","Ausência de sinais de hipoxia/hipercapnia"] },
  "Desobstrução ineficaz das vias aéreas": { nic:["Avaliar permeabilidade das vias aéreas e características das secreções","Aspirar secreções conforme necessário e protocolo","Posicionar para facilitar drenagem de secreções","Incentivar hidratação e técnicas de tosse eficaz/fisioterapia respiratória"],
    noc:["Vias aéreas permeáveis, sem ruídos adventícios","Doente mobiliza secreções eficazmente"] },
  "Ventilação espontânea prejudicada": { nic:["Monitorizar sinais de fadiga respiratória e gasometria","Preparar e assistir suporte ventilatório conforme prescrição","Posicionar para optimizar a mecânica ventilatória","Reduzir factores que aumentem o consumo de oxigénio"],
    noc:["Ventilação espontânea eficaz mantida ou suporte ventilatório adequado","Ausência de sinais de fadiga respiratória"] },
  "Risco de aspiração": { nic:["Avaliar reflexo de deglutição e nível de consciência antes da alimentação","Posicionar em Fowler/semi-Fowler durante e após alimentação","Adaptar consistência de alimentos/líquidos conforme avaliação","Manter aspirador disponível e vigilância durante refeições"],
    noc:["Ausência de episódios de aspiração","Doente/cuidador demonstra técnicas seguras de alimentação"] },
  "Constipação funcional crônica": { nic:["Avaliar padrão intestinal habitual e factores contribuintes","Incentivar ingestão de fibras, líquidos e mobilização","Administrar laxantes conforme prescrição se necessário","Estabelecer rotina de eliminação intestinal"],
    noc:["Padrão de eliminação intestinal regular e sem esforço","Doente identifica medidas para prevenir a constipação"] },
  "Motilidade gastrintestinal prejudicada": { nic:["Monitorizar ruídos intestinais e distensão abdominal","Incentivar mobilização precoce","Ajustar dieta conforme tolerância e prescrição","Monitorizar sinais de complicação (íleo, obstrução)"],
    noc:["Ruídos intestinais e trânsito restabelecidos","Ausência de distensão abdominal ou desconforto"] },
  "Eliminação intestinal prejudicada": { nic:["Avaliar características e frequência das dejecções","Promover dieta rica em fibras e hidratação adequada","Estabelecer rotina/horário de eliminação intestinal","Monitorizar sinais de complicação"],
    noc:["Padrão de eliminação intestinal adequado às características do doente","Ausência de desconforto associado à eliminação"] },
  "Eliminação urinária prejudicada": { nic:["Avaliar padrão miccional (frequência, volume, características)","Incentivar ingestão hídrica adequada","Estabelecer rotina de esvaziamento vesical se indicado","Monitorizar sinais de infecção urinária ou retenção"],
    noc:["Padrão de eliminação urinária dentro do esperado","Ausência de sinais de infecção ou retenção urinária"] },
  "Risco de retenção urinária": { nic:["Monitorizar diurese e sinais de distensão vesical","Incentivar micção regular e posição adequada para urinar","Considerar bladder scan/algaliação conforme protocolo se sinais de retenção"],
    noc:["Esvaziamento vesical eficaz, sem sinais de retenção","Doente reconhece sinais de alerta de retenção urinária"] },
  "Incontinência urinária de esforço": { nic:["Avaliar padrão e gravidade da incontinência","Ensinar exercícios do pavimento pélvico (Kegel)","Orientar sobre gestão de líquidos e hábitos miccionais","Utilizar dispositivos de protecção conforme necessidade"],
    noc:["Redução dos episódios de perda urinária","Doente demonstra técnica correcta de exercícios pélvicos"] },
  "Incontinência urinária de urgência": { nic:["Avaliar padrão miccional e factores desencadeantes","Estabelecer treino vesical com horários programados","Reduzir ingestão de irritantes vesicais (cafeína, álcool)","Ensinar exercícios do pavimento pélvico"],
    noc:["Redução da frequência/urgência miccional","Doente demonstra estratégias eficazes de controlo"] },
  "Volume de líquidos excessivo": { nic:["Monitorizar balanço hídrico rigoroso e peso diário","Restringir líquidos e sódio conforme prescrição","Monitorizar sinais de sobrecarga (edema, dispneia, PVC)","Administrar diuréticos conforme prescrição"],
    noc:["Balanço hídrico equilibrado","Ausência de sinais de sobrecarga de volume (edema, dispneia)"] },
  "Volume de líquidos inadequado": { nic:["Monitorizar balanço hídrico e sinais vitais","Incentivar/administrar reposição hídrica conforme prescrição","Monitorizar sinais de desidratação (mucosas, turgor cutâneo)","Registar débito urinário"],
    noc:["Estado de hidratação adequado (mucosas húmidas, débito urinário normal)","Sinais vitais estáveis"] },
  "Risco de equilíbrio hidreletrolítico prejudicado": { nic:["Monitorizar electrólitos séricos e sinais clínicos de desequilíbrio","Monitorizar balanço hídrico rigoroso","Administrar reposição electrolítica conforme prescrição"],
    noc:["Valores electrolíticos dentro dos parâmetros normais","Ausência de sinais clínicos de desequilíbrio"] },
  "Ingestão nutricional inadequada": { nic:["Avaliar estado nutricional e padrão alimentar","Monitorizar peso e ingestão alimentar diária","Encaminhar para nutricionista se necessário","Oferecer refeições fraccionadas e apetecíveis"],
    noc:["Ingestão nutricional adequada às necessidades","Manutenção/recuperação do peso adequado"] },
  "Risco de ingestão nutricional inadequada": { nic:["Monitorizar ingestão alimentar e peso regularmente","Identificar factores de risco nutricional precocemente","Educar sobre alimentação equilibrada"],
    noc:["Doente mantém ingestão nutricional adequada","Peso estável dentro do valor esperado"] },
  "Deglutição prejudicada": { nic:["Avaliar capacidade de deglutição antes de iniciar alimentação oral","Adaptar consistência de alimentos/líquidos conforme avaliação","Posicionar em Fowler durante e após as refeições","Vigiar sinais de aspiração durante a alimentação"],
    noc:["Deglutição segura, sem sinais de aspiração","Doente mantém ingestão nutricional adequada por via oral"] },
  "Amamentação ineficaz": { nic:["Avaliar técnica de amamentação (pega, posicionamento)","Ensinar e corrigir técnica de amamentação","Monitorizar peso e hidratação do recém-nascido","Apoiar emocionalmente a mãe e envolver o parceiro/família"],
    noc:["Mãe demonstra técnica eficaz de amamentação","Recém-nascido ganha peso adequadamente"] },
  "Padrão de sono ineficaz": { nic:["Avaliar padrão habitual de sono e factores perturbadores","Promover ambiente propício ao sono (luz, ruído, temperatura)","Estabelecer rotina/horário regular de sono","Reduzir estimulantes antes de dormir"],
    noc:["Doente refere sono reparador e em quantidade adequada","Doente identifica e reduz factores que perturbam o sono"] },
  "Confusão aguda": { nic:["Avaliar estado cognitivo regularmente (ex.: escala CAM)","Reorientar o doente frequentemente (tempo, espaço, pessoa)","Manter ambiente calmo, seguro e com estímulos adequados","Identificar e tratar causas subjacentes (infecção, fármacos, hipoxia)"],
    noc:["Doente recupera nível de orientação/cognição habitual","Ausência de complicações associadas à confusão (quedas, agitação)"] },
  "Confusão crônica": { nic:["Avaliar nível cognitivo e funcional regularmente","Manter rotina estável e ambiente seguro e previsível","Utilizar estratégias de orientação e comunicação simples","Envolver a família nos cuidados e na estimulação cognitiva"],
    noc:["Doente mantém o nível funcional/cognitivo possível","Ambiente seguro sem incidentes associados à confusão"] },
  "Memória prejudicada": { nic:["Avaliar o grau de comprometimento da memória","Utilizar auxiliares de memória (calendários, listas, rotinas)","Estimular cognitivamente de forma adequada ao doente","Educar a família sobre estratégias de apoio"],
    noc:["Doente utiliza estratégias compensatórias eficazes","Doente/família demonstra adaptação às limitações de memória"] },
  "Processos de pensamento conturbados": { nic:["Avaliar conteúdo e organização do pensamento","Manter comunicação clara, simples e calma","Reduzir estímulos ambientais excessivos","Reorientar e reforçar a realidade de forma respeitosa"],
    noc:["Doente apresenta pensamento mais organizado e coerente","Ausência de comportamentos de risco associados"] },
  "Comunicação verbal prejudicada": { nic:["Avaliar capacidade de comunicação verbal e não-verbal","Utilizar métodos alternativos de comunicação (imagens, gestos, dispositivos)","Ser paciente, permitir tempo suficiente para resposta","Envolver terapeuta da fala se indicado"],
    noc:["Doente comunica necessidades de forma eficaz (verbal ou alternativa)","Redução da frustração associada à dificuldade de comunicação"] },
  "Interação social prejudicada": { nic:["Avaliar padrão de interação social e factores limitantes","Incentivar participação em actividades sociais graduais","Ensinar habilidades sociais/comunicacionais se necessário","Envolver a família/rede de apoio"],
    noc:["Doente participa em interações sociais de forma mais eficaz","Doente verbaliza maior satisfação nas relações sociais"] },
  "Autoestima inadequada situacional": { nic:["Identificar a situação/evento associado à baixa autoestima","Facilitar expressão de sentimentos sem julgamento","Reforçar pontos fortes e conquistas realistas","Envolver rede de apoio"],
    noc:["Doente verbaliza percepção mais positiva de si próprio","Doente identifica pontos fortes pessoais"] },
  "Autoestima inadequada crônica": { nic:["Avaliar padrão de autoestima ao longo do tempo","Facilitar expressão de sentimentos e crenças sobre si próprio","Encaminhar para apoio psicológico especializado","Reforçar conquistas e recursos pessoais"],
    noc:["Doente demonstra melhoria gradual da autoestima","Doente participa em intervenções de apoio psicológico"] },
  "Imagem corporal conturbada": { nic:["Avaliar percepção do doente sobre a alteração corporal","Facilitar expressão de sentimentos sobre a mudança na imagem corporal","Incentivar contacto com grupos de apoio quando aplicável","Envolver a família no processo de adaptação"],
    noc:["Doente verbaliza aceitação progressiva da alteração corporal","Doente participa em actividades sociais apesar da alteração"] },
  "Identidade pessoal conturbada": { nic:["Avaliar a percepção do doente sobre a sua identidade","Facilitar expressão de sentimentos num ambiente seguro","Encaminhar para apoio psicológico especializado se necessário"],
    noc:["Doente verbaliza maior clareza/segurança quanto à sua identidade","Doente demonstra estratégias de enfrentamento adequadas"] },
  "Solidão excessiva": { nic:["Avaliar padrão social e sentimentos de isolamento","Incentivar contacto com família/amigos e recursos comunitários","Facilitar participação em actividades de grupo","Encaminhar para apoio social/psicológico se indicado"],
    noc:["Doente refere redução do sentimento de solidão","Doente aumenta a participação em actividades sociais"] },
  "Risco de comportamento autolesivo suicida": { nic:["Avaliar risco suicida com instrumento validado e sinais de alerta","Garantir ambiente seguro, remover objectos de risco","Manter vigilância adequada ao nível de risco","Envolver equipa de saúde mental e activar protocolo institucional"],
    noc:["Ausência de comportamento autolesivo durante o período de cuidados","Doente aceita e participa no plano de segurança/tratamento"] },
  "Comportamento autolesivo não suicida": { nic:["Avaliar padrão, frequência e gatilhos do comportamento autolesivo","Garantir ambiente seguro e vigilância adequada","Ensinar estratégias alternativas de regulação emocional","Encaminhar para apoio psicológico/psiquiátrico"],
    noc:["Redução da frequência de comportamentos autolesivos","Doente utiliza estratégias alternativas de regulação emocional"] },
  "Risco de violência direcionada a outros": { nic:["Avaliar sinais de agitação/agressividade e factores desencadeantes","Manter ambiente seguro, reduzir estímulos provocadores","Utilizar comunicação calma e técnicas de desescalada","Garantir segurança da equipa e de terceiros conforme protocolo"],
    noc:["Ausência de episódios de violência/agressão","Doente utiliza estratégias adequadas de gestão da raiva/agitação"] },
  "Hipertermia": { nic:["Monitorizar temperatura corporal regularmente","Aplicar medidas de arrefecimento (roupa leve, compressas, hidratação)","Administrar antipiréticos conforme prescrição","Investigar e tratar a causa subjacente"],
    noc:["Temperatura corporal dentro dos valores normais","Ausência de complicações associadas à hipertermia"] },
  "Hipotermia": { nic:["Monitorizar temperatura corporal regularmente","Aplicar medidas de reaquecimento (cobertores, ambiente aquecido)","Monitorizar sinais vitais e nível de consciência","Investigar e tratar a causa subjacente"],
    noc:["Temperatura corporal dentro dos valores normais","Ausência de complicações associadas à hipotermia"] },
  "Termorregulação ineficaz": { nic:["Monitorizar temperatura corporal e sinais de instabilidade térmica","Ajustar ambiente térmico conforme necessário","Educar doente/família sobre sinais de alerta"],
    noc:["Temperatura corporal estável dentro dos valores normais","Doente/família reconhece sinais de alteração térmica"] },
  "Risco de choque": { nic:["Monitorizar sinais vitais e sinais precoces de choque (perfusão, consciência, diurese)","Garantir acesso venoso permeável","Administrar fluidoterapia/medicação conforme prescrição","Manter vigilância contínua e activar protocolo de emergência se necessário"],
    noc:["Sinais vitais e perfusão dentro dos parâmetros normais","Ausência de progressão para estado de choque"] },
  "Risco de sangramento excessivo": { nic:["Monitorizar sinais de hemorragia (local, drenagem, sinais vitais)","Monitorizar parâmetros de coagulação conforme prescrição","Evitar procedimentos invasivos desnecessários","Educar sobre sinais de alerta de hemorragia"],
    noc:["Ausência de sinais de hemorragia activa","Parâmetros hemodinâmicos e de coagulação estáveis"] },
  "Risco de trombose": { nic:["Avaliar factores de risco tromboembólico","Incentivar mobilização precoce e exercícios activos/passivos","Administrar profilaxia (mecânica/farmacológica) conforme prescrição","Monitorizar sinais de TVP/TEP"],
    noc:["Ausência de sinais de trombose venosa/embolismo","Doente demonstra medidas preventivas (mobilização, meias de compressão)"] },
  "Perfusão tissular periférica ineficaz": { nic:["Avaliar perfusão periférica (cor, temperatura, pulsos, tempo de preenchimento capilar)","Posicionar membros para optimizar perfusão","Evitar factores que comprometam a circulação (roupa apertada, pressão prolongada)","Monitorizar sinais de agravamento"],
    noc:["Perfusão periférica adequada (pulsos presentes, pele corada e quente)","Ausência de sinais de isquemia"] },
  "Risco de débito cardíaco diminuído": { nic:["Monitorizar sinais vitais, ritmo cardíaco e sinais de baixo débito","Monitorizar balanço hídrico e peso diário","Administrar medicação cardiovascular conforme prescrição","Educar sobre sinais de alerta de descompensação"],
    noc:["Débito cardíaco adequado (sinais vitais e perfusão estáveis)","Ausência de sinais de descompensação cardíaca"] },
  "Tolerância à atividade diminuída": { nic:["Avaliar resposta a actividade (sinais vitais, fadiga, dispneia)","Planear actividades com períodos de descanso intercalados","Promover aumento gradual da actividade conforme tolerância","Ensinar técnicas de conservação de energia"],
    noc:["Doente tolera actividades progressivamente maiores sem sintomas significativos","Sinais vitais estáveis durante e após actividade"] },
  "Carga excessiva de fadiga": { nic:["Avaliar padrão e causas da fadiga","Ensinar técnicas de gestão de energia e priorização de actividades","Promover equilíbrio entre actividade e repouso","Optimizar sono e nutrição"],
    noc:["Doente refere redução do nível de fadiga","Doente utiliza estratégias eficazes de gestão de energia"] },
  "Recuperação cirúrgica prejudicada": { nic:["Monitorizar sinais vitais e sinais de complicação pós-operatória","Vigiar ferida cirúrgica e dor","Incentivar mobilização precoce conforme indicação","Educar sobre cuidados pós-operatórios no domicílio"],
    noc:["Recuperação cirúrgica progride conforme esperado","Ausência de complicações pós-operatórias"] },
  "Conhecimento de saúde inadequado": { nic:["Avaliar nível de conhecimento actual e necessidades de aprendizagem","Fornecer educação estruturada, adaptada ao nível de literacia","Utilizar material de apoio (escrito/visual)","Confirmar compreensão através de teach-back"],
    noc:["Doente/família demonstra conhecimento adequado sobre a condição/tratamento","Doente/família aplica correctamente as orientações recebidas"] },
  "Tomada de decisão prejudicada": { nic:["Fornecer informação clara e completa sobre as opções disponíveis","Facilitar a expressão de valores e preferências do doente","Apoiar o processo de decisão sem impor opinião","Envolver família/equipa multidisciplinar conforme apropriado"],
    noc:["Doente participa activamente e com confiança na tomada de decisão","Doente verbaliza satisfação com a decisão tomada"] },
  "Sofrimento moral": { nic:["Facilitar espaço seguro para expressão do sofrimento moral","Envolver equipa multidisciplinar (ética, psicologia, espiritualidade)","Validar sentimentos sem julgamento"],
    noc:["Doente/profissional verbaliza redução do sofrimento moral","Recursos de apoio identificados e utilizados"] },
  "Bem-estar espiritual prejudicado": { nic:["Avaliar necessidades e recursos espirituais do doente","Facilitar acesso a apoio espiritual/religioso conforme desejo do doente","Respeitar crenças e práticas espirituais individuais"],
    noc:["Doente verbaliza maior bem-estar espiritual","Doente utiliza recursos espirituais de apoio disponíveis"] },
  "Autogestão ineficaz da saúde": { nic:["Avaliar barreiras à adesão ao regime terapêutico","Elaborar plano de autogestão adaptado à rotina do doente","Educar sobre a condição e regime terapêutico","Envolver família/cuidador no apoio à autogestão"],
    noc:["Doente demonstra comportamentos de autogestão eficazes","Doente adere ao regime terapêutico prescrito"] },
  "Comportamentos ineficazes de manutenção da saúde": { nic:["Avaliar hábitos de saúde e factores de risco","Educar sobre comportamentos promotores de saúde","Estabelecer metas realistas e progressivas com o doente","Reforçar positivamente mudanças de comportamento"],
    noc:["Doente adopta comportamentos de manutenção da saúde mais eficazes","Doente identifica e reduz factores de risco"] }
};

/* Regras por palavra-chave (aplicadas quando não há correspondência exacta acima) */
const NICNOC_PALAVRAS_CHAVE = [
  { chave:"queda", nic:["Avaliar risco de queda com escala validada","Manter ambiente seguro (iluminação, calçado, campainha ao alcance)","Vigilância acrescida e auxílio na deambulação"], noc:["Ausência de quedas durante os cuidados","Doente/família reconhece medidas preventivas"] },
  { chave:"infec", nic:["Técnica assética e lavagem das mãos em todos os cuidados","Monitorizar sinais e sintomas de infecção","Educar sobre medidas de prevenção e sinais de alerta"], noc:["Ausência de sinais/sintomas de infecção","Doente/família demonstra medidas de prevenção"] },
  { chave:"pele", nic:["Avaliar integridade cutânea regularmente","Aliviar pressão com mudança de decúbito e superfícies adequadas","Manter pele limpa, seca e hidratada"], noc:["Pele íntegra ou em progressão de cicatrização","Ausência de novas lesões cutâneas"] },
  { chave:"press", nic:["Avaliação do risco com escala validada (ex.: Braden)","Plano de mudança de decúbito e alívio de pressão","Optimizar nutrição, hidratação e mobilidade"], noc:["Ausência de lesões por pressão","Doente/cuidador demonstra medidas preventivas"] },
  { chave:"mobilidade", nic:["Avaliar grau de mobilidade e capacidade funcional","Promover mobilização progressiva e exercícios de amplitude articular","Prevenir complicações de imobilidade"], noc:["Melhoria/manutenção do grau de mobilidade","Ausência de complicações de imobilidade"] },
  { chave:"respirat", nic:["Monitorizar frequência, ritmo e esforço respiratório","Posicionar em semi-Fowler/Fowler","Administrar oxigenoterapia conforme prescrição"], noc:["Padrão respiratório e saturação dentro dos parâmetros normais","Ausência de sinais de dificuldade respiratória"] },
  { chave:"vias aéreas", nic:["Avaliar permeabilidade das vias aéreas","Aspirar secreções conforme necessário","Incentivar tosse eficaz e hidratação"], noc:["Vias aéreas permeáveis, sem ruídos adventícios"] },
  { chave:"troca", nic:["Monitorizar saturação de oxigénio/gasometria","Posicionar para optimizar ventilação-perfusão","Administrar oxigenoterapia conforme prescrição"], noc:["Trocas gasosas adequadas (saturação e gasometria normais)"] },
  { chave:"nutri", nic:["Avaliar estado nutricional e padrão alimentar","Monitorizar peso e ingestão alimentar","Encaminhar para nutricionista se necessário"], noc:["Ingestão nutricional adequada às necessidades","Peso mantido/recuperado dentro do esperado"] },
  { chave:"deglut", nic:["Avaliar capacidade de deglutição antes da alimentação oral","Adaptar consistência de alimentos/líquidos","Vigiar sinais de aspiração durante a alimentação"], noc:["Deglutição segura, sem sinais de aspiração"] },
  { chave:"líquido", nic:["Monitorizar balanço hídrico rigoroso","Monitorizar sinais de desidratação/sobrecarga hídrica","Ajustar aporte hídrico conforme prescrição"], noc:["Balanço hídrico equilibrado","Ausência de sinais de desidratação/sobrecarga"] },
  { chave:"eletrol", nic:["Monitorizar electrólitos séricos e sinais clínicos de desequilíbrio","Administrar reposição conforme prescrição"], noc:["Valores electrolíticos dentro dos parâmetros normais"] },
  { chave:"urinári", nic:["Avaliar padrão miccional (frequência, volume, características)","Incentivar ingestão hídrica adequada","Monitorizar sinais de infecção/retenção urinária"], noc:["Padrão de eliminação urinária adequado"] },
  { chave:"intestinal", nic:["Avaliar padrão intestinal habitual","Incentivar fibras, líquidos e mobilização","Estabelecer rotina de eliminação intestinal"], noc:["Padrão de eliminação intestinal regular"] },
  { chave:"constipa", nic:["Incentivar ingestão de fibras, líquidos e mobilização","Administrar laxantes conforme prescrição se necessário","Estabelecer rotina de eliminação intestinal"], noc:["Eliminação intestinal regular e sem esforço"] },
  { chave:"sono", nic:["Avaliar padrão habitual de sono e factores perturbadores","Promover ambiente propício ao sono","Estabelecer rotina/horário regular de sono"], noc:["Doente refere sono reparador e adequado"] },
  { chave:"ansied", nic:["Avaliar nível de ansiedade e factores desencadeantes","Ensinar técnicas de respiração e relaxamento","Reduzir estímulos ambientais excessivos"], noc:["Redução verbalizada do nível de ansiedade"] },
  { chave:"medo", nic:["Identificar a causa do medo e validar a experiência do doente","Fornecer informação clara sobre procedimentos/prognóstico","Permanecer junto do doente em momentos críticos"], noc:["Doente verbaliza diminuição do medo"] },
  { chave:"confus", nic:["Avaliar estado cognitivo regularmente","Reorientar o doente frequentemente","Manter ambiente calmo e seguro"], noc:["Recuperação/manutenção do nível de orientação possível"] },
  { chave:"memória", nic:["Avaliar grau de comprometimento da memória","Utilizar auxiliares de memória (calendários, listas, rotinas)","Estimular cognitivamente de forma adequada"], noc:["Doente utiliza estratégias compensatórias eficazes"] },
  { chave:"comunica", nic:["Avaliar capacidade de comunicação verbal/não-verbal","Utilizar métodos alternativos de comunicação","Permitir tempo suficiente para resposta"], noc:["Doente comunica necessidades de forma eficaz"] },
  { chave:"social", nic:["Avaliar padrão de interação social","Incentivar participação gradual em actividades sociais","Envolver família/rede de apoio"], noc:["Melhoria da participação e satisfação nas interações sociais"] },
  { chave:"autoestima", nic:["Facilitar expressão de sentimentos sem julgamento","Reforçar pontos fortes e conquistas realistas","Envolver rede de apoio"], noc:["Percepção mais positiva de si próprio"] },
  { chave:"imagem corporal", nic:["Avaliar percepção sobre a alteração corporal","Facilitar expressão de sentimentos sobre a mudança","Envolver a família no processo de adaptação"], noc:["Aceitação progressiva da alteração corporal"] },
  { chave:"luto", nic:["Facilitar expressão de sentimentos relacionados com a perda","Validar o processo de luto sem julgamento","Envolver rede de apoio familiar/espiritual"], noc:["Progressão saudável no processo de luto"] },
  { chave:"suic", nic:["Avaliar risco suicida com instrumento validado","Garantir ambiente seguro e vigilância adequada","Activar protocolo institucional e equipa de saúde mental"], noc:["Ausência de comportamento autolesivo durante os cuidados"] },
  { chave:"violênc", nic:["Avaliar sinais de agitação/agressividade e gatilhos","Manter ambiente seguro e comunicação calma","Utilizar técnicas de desescalada"], noc:["Ausência de episódios de violência/agressão"] },
  { chave:"termorregula", nic:["Monitorizar temperatura corporal regularmente","Ajustar medidas de arrefecimento/aquecimento conforme necessário"], noc:["Temperatura corporal dentro dos valores normais"] },
  { chave:"hipertermia", nic:["Monitorizar temperatura corporal regularmente","Aplicar medidas de arrefecimento","Administrar antipiréticos conforme prescrição"], noc:["Temperatura corporal dentro dos valores normais"] },
  { chave:"hipotermia", nic:["Monitorizar temperatura corporal regularmente","Aplicar medidas de reaquecimento","Monitorizar sinais vitais e nível de consciência"], noc:["Temperatura corporal dentro dos valores normais"] },
  { chave:"choque", nic:["Monitorizar sinais vitais e sinais precoces de choque","Garantir acesso venoso permeável","Activar protocolo de emergência se necessário"], noc:["Sinais vitais e perfusão dentro dos parâmetros normais"] },
  { chave:"sangr", nic:["Monitorizar sinais de hemorragia e parâmetros de coagulação","Evitar procedimentos invasivos desnecessários","Educar sobre sinais de alerta"], noc:["Ausência de sinais de hemorragia activa"] },
  { chave:"trombose", nic:["Incentivar mobilização precoce e exercícios activos/passivos","Administrar profilaxia conforme prescrição","Monitorizar sinais de TVP/TEP"], noc:["Ausência de sinais de trombose venosa/embolismo"] },
  { chave:"perfusão", nic:["Avaliar perfusão (cor, temperatura, pulsos, preenchimento capilar)","Posicionar para optimizar perfusão","Monitorizar sinais de agravamento"], noc:["Perfusão adequada, sem sinais de isquemia"] },
  { chave:"cardíac", nic:["Monitorizar sinais vitais e ritmo cardíaco","Monitorizar balanço hídrico e peso diário","Administrar medicação cardiovascular conforme prescrição"], noc:["Sinais vitais e perfusão estáveis, sem sinais de descompensação"] },
  { chave:"atividade", nic:["Avaliar resposta a actividade (sinais vitais, fadiga)","Planear actividades com períodos de descanso intercalados","Promover aumento gradual da actividade"], noc:["Doente tolera actividade progressivamente maior"] },
  { chave:"fadiga", nic:["Avaliar padrão e causas da fadiga","Ensinar técnicas de gestão de energia","Promover equilíbrio actividade/repouso"], noc:["Redução do nível de fadiga referido"] },
  { chave:"cirúrgic", nic:["Monitorizar sinais vitais e sinais de complicação pós-operatória","Vigiar ferida cirúrgica e dor","Incentivar mobilização precoce conforme indicação"], noc:["Recuperação cirúrgica progride conforme esperado"] },
  { chave:"conhecimento", nic:["Avaliar nível de conhecimento e necessidades de aprendizagem","Fornecer educação estruturada e adaptada","Confirmar compreensão através de teach-back"], noc:["Doente/família demonstra conhecimento adequado"] },
  { chave:"decisão", nic:["Fornecer informação clara sobre as opções disponíveis","Facilitar a expressão de valores e preferências","Apoiar o processo de decisão sem impor opinião"], noc:["Participação activa e confiante na tomada de decisão"] },
  { chave:"espiritual", nic:["Avaliar necessidades e recursos espirituais","Facilitar acesso a apoio espiritual/religioso conforme desejo do doente"], noc:["Melhoria do bem-estar espiritual referido"] },
  { chave:"parental|papel|família|apego|cuidador", nic:["Avaliar dinâmica familiar e necessidades de apoio","Facilitar comunicação e envolvimento familiar nos cuidados","Encaminhar para apoio social se necessário"], noc:["Melhoria da dinâmica/funcionamento familiar"] },
  { chave:"sexual", nic:["Avaliar preocupações relacionadas com a sexualidade de forma sensível","Fornecer informação e educação adequada","Encaminhar para aconselhamento especializado se necessário"], noc:["Doente verbaliza maior conforto com a função sexual"] }
];

/* Sugestão genérica por domínio (garante conteúdo mesmo sem correspondência acima) */
function sugestaoGenericaPorDominio(dominio){
  const d = normalize(dominio || '');
  if(d.includes('promocao da saude')) return { nic:["Avaliar hábitos, crenças e comportamentos de saúde do doente/família","Identificar barreiras e motivadores para a mudança de comportamento","Educar sobre comportamentos promotores de saúde adequados ao contexto","Apoiar a definição de metas realistas e mensuráveis","Reforçar positivamente os progressos alcançados","Reavaliar periodicamente a adesão às mudanças propostas"], noc:["Doente identifica comportamentos de risco para a sua saúde","Comportamento de promoção da saúde melhorado e sustentado","Doente demonstra conhecimento sobre promoção da saúde","Doente participa activamente em actividades de autocuidado"] };
  if(d.includes('nutricao')) return { nic:["Avaliar estado nutricional, peso, IMC e padrão alimentar habitual","Monitorizar ingestão alimentar/hídrica e tolerância digestiva","Registar peso corporal em intervalos regulares","Adequar a dieta às necessidades e preferências do doente","Encaminhar para nutricionista quando indicado","Educar doente/família sobre alimentação equilibrada"], noc:["Estado nutricional adequado às necessidades metabólicas","Peso corporal dentro/a aproximar-se do valor esperado","Doente/família demonstra conhecimento sobre escolhas alimentares saudáveis","Ingestão nutricional e hídrica adequada às necessidades diárias"] };
  if(d.includes('eliminacao')) return { nic:["Monitorizar padrão, frequência e características da eliminação urinária/intestinal","Incentivar hidratação e mobilização adequadas ao quadro clínico","Registar balanço hídrico quando indicado","Identificar precocemente sinais de retenção, incontinência ou obstipação","Implementar medidas de conforto e privacidade durante a eliminação"], noc:["Padrão de eliminação urinária/intestinal dentro do esperado","Ausência de sinais de retenção, infecção ou obstipação","Doente verbaliza satisfação com o padrão de eliminação"] };
  if(d.includes('atividade') || d.includes('repouso')) return { nic:["Avaliar tolerância à actividade, sinais vitais em repouso e ao esforço","Promover mobilização progressiva conforme tolerância","Planear períodos de actividade intercalados com repouso","Optimizar o ambiente e a rotina para um sono/repouso adequado","Prevenir complicações associadas à imobilidade"], noc:["Doente tolera actividade progressivamente maior sem sinais de descompensação","Padrão de sono/repouso reparador referido pelo doente","Ausência de complicações associadas à imobilidade (trombose, úlceras)"] };
  if(d.includes('percepcao') || d.includes('cognicao')) return { nic:["Avaliar estado cognitivo, orientação e capacidade perceptiva","Reorientar o doente regularmente no tempo, espaço e pessoa","Estimular cognitivamente de forma adequada ao défice identificado","Manter ambiente seguro, calmo e com estímulos adaptados","Envolver a família na estimulação e vigilância"], noc:["Função cognitiva/perceptiva mantida ou melhorada face à linha de base","Doente demonstra orientação adequada ao contexto clínico","Ausência de incidentes relacionados com défice cognitivo/perceptivo"] };
  if(d.includes('autopercepcao')) return { nic:["Facilitar expressão de sentimentos sobre si próprio, sem julgamento","Reforçar pontos fortes, conquistas e recursos pessoais realistas","Explorar o impacto da situação de saúde na autoimagem/autoestima","Encaminhar para apoio psicológico se necessário"], noc:["Doente verbaliza percepção mais positiva de si próprio","Melhoria da autoestima/autoconceito referida pelo doente","Doente demonstra adaptação progressiva à alteração vivida"] };
  if(d.includes('relacao de funcao') || d.includes('papeis')) return { nic:["Avaliar desempenho de papéis, dinâmica familiar e rede de apoio","Facilitar comunicação aberta entre doente e família/cuidadores","Identificar sobrecarga do cuidador e necessidades de apoio","Encaminhar para apoio social/comunitário se necessário"], noc:["Melhoria do desempenho de papéis e das relações interpessoais","Família demonstra estratégias eficazes de adaptação","Doente/família identifica e utiliza recursos de apoio disponíveis"] };
  if(d.includes('sexualidade')) return { nic:["Avaliar, de forma sensível e privada, preocupações relacionadas com a sexualidade","Fornecer educação e aconselhamento adequados à situação clínica","Criar ambiente de confiança para esclarecimento de dúvidas","Encaminhar para aconselhamento especializado se necessário"], noc:["Doente verbaliza maior conforto com questões de sexualidade/função reprodutiva","Melhoria do conforto e satisfação relacionados com a sexualidade"] };
  if(d.includes('enfrentamento') || d.includes('estresse')) return { nic:["Avaliar estratégias de enfrentamento habituais e factores de stress actuais","Ensinar estratégias adaptativas de coping (respiração, relaxamento, resolução de problemas)","Facilitar a expressão de emoções num ambiente seguro","Envolver a rede de apoio familiar/social","Encaminhar para apoio psicológico especializado se necessário"], noc:["Doente utiliza estratégias de enfrentamento eficazes perante a situação","Redução do nível de stress/ansiedade referido","Doente verbaliza sensação de maior controlo sobre a situação"] };
  if(d.includes('principios de vida')) return { nic:["Avaliar valores, crenças e necessidades espirituais do doente","Facilitar acesso a apoio espiritual/religioso conforme desejo do doente","Respeitar decisões baseadas em valores pessoais/culturais","Envolver capelania ou líder religioso quando solicitado"], noc:["Melhoria do bem-estar espiritual referido pelo doente","Doente demonstra coerência entre valores, crenças e decisões tomadas"] };
  if(d.includes('seguranca') || d.includes('protecao')) return { nic:["Avaliar factores de risco individuais e implementar medidas preventivas específicas","Manter ambiente seguro (iluminação, calçado, campainha ao alcance)","Aplicar escalas de rastreio validadas (quedas, lesão por pressão, infecção)","Vigilância acrescida em doentes de maior risco","Educar doente/família sobre prevenção de incidentes"], noc:["Ausência de incidentes de segurança durante a prestação de cuidados","Doente/família reconhece e aplica medidas de prevenção de risco","Ambiente de cuidados mantido seguro ao longo do internamento"] };
  if(d.includes('conforto')) return { nic:["Avaliar nível de conforto físico, ambiental, social e psicológico","Implementar medidas farmacológicas e não farmacológicas de conforto","Optimizar o ambiente (ruído, luminosidade, temperatura, privacidade)","Reavaliar regularmente a eficácia das medidas implementadas"], noc:["Nível de conforto melhorado, referido pelo doente","Doente expressa satisfação com o ambiente e cuidados prestados","Redução de sinais/sintomas de desconforto observados"] };
  if(d.includes('crescimento') || d.includes('desenvolvimento')) return { nic:["Monitorizar marcos de crescimento/desenvolvimento com instrumentos padronizados","Orientar pais/cuidadores sobre estimulação adequada à idade","Avaliar factores de risco nutricionais, ambientais e familiares","Encaminhar para avaliação especializada se necessário"], noc:["Crescimento/desenvolvimento adequados à idade da criança","Pais/cuidadores demonstram conhecimento sobre estimulação adequada","Ausência/redução de factores de risco identificados"] };
  return { nic:["Avaliar a situação clínica específica do doente de forma sistemática","Planear e implementar intervenções individualizadas ao diagnóstico identificado","Monitorizar sinais e sintomas relevantes ao problema em causa","Envolver o doente/família no plano de cuidados","Reavaliar regularmente a eficácia das intervenções implementadas"], noc:["Melhoria do estado relacionado com o diagnóstico identificado","Doente/família demonstra compreensão do plano de cuidados","Indicadores clínicos relevantes dentro dos parâmetros esperados"] };
}

/* Função principal: devolve sempre {nic:[...], noc:[...]} não vazio */
function getSugestaoNicNoc(diag, dominio, classe){
  // 1) Mapa directo diagnóstico → NIC/NOC (NIC_NOC_MAP), fonte prioritária
  if(NIC_NOC_MAP[diag] && NIC_NOC_MAP[diag].length){
    const par = NIC_NOC_MAP[diag];
    return { nic: par[0] ? [par[0]] : [], noc: par[1] ? [par[1]] : [] };
  }
  if(NICNOC_DIAGNOSTICO[diag]) return NICNOC_DIAGNOSTICO[diag];
  const nd = normalize(diag);
  let nic = [], noc = [];
  NICNOC_PALAVRAS_CHAVE.forEach(regra=>{
    const partes = regra.chave.split('|');
    if(partes.some(p=>nd.includes(normalize(p)))){
      regra.nic.forEach(i=>{ if(!nic.includes(i)) nic.push(i); });
      regra.noc.forEach(i=>{ if(!noc.includes(i)) noc.push(i); });
    }
  });
  if(nic.length || noc.length) return { nic: nic.slice(0,6), noc: noc.slice(0,5) };
  return sugestaoGenericaPorDominio(dominio);
}

// ===== Ficha de detalhe do diagnóstico =====

const cardOverlay = document.getElementById('cardOverlay');
let currentCardKey = null;
let currentTipo = 'real'; // 'real' | 'risco' | 'promocao'

/* CSS extra para botões de tipo */
(function(){
  const s = document.createElement('style');
  s.textContent = `.tipo-btn{flex:1;min-width:80px;border:1.5px solid var(--borda);border-radius:10px;padding:8px 6px;font-size:12px;font-weight:700;background:#fff;color:var(--texto-suave);cursor:pointer;transition:background .12s,color .12s,border-color .12s;}
.tipo-btn.active[data-tipo="real"]{background:#e3eefa;color:var(--azul);border-color:var(--azul);}
.tipo-btn.active[data-tipo="risco"]{background:#fbe4e8;color:#000000;border-color:#000000;}
.tipo-btn.active[data-tipo="promocao"]{background:#e7ecf4;color:#000000;border-color:#000000;}`;
  document.head.appendChild(s);
})();
function diagStorageKey(diag){ return 'diagFicha::' + diag; }
function textToLines(text){ return (text||'').split('\n').map(l=>l.trim()).filter(Boolean); }
function linesToText(arr){ return Array.isArray(arr) ? arr.join('\n') : ''; }

/* ---- Pré-visualização do enunciado (atualiza ao vivo) ---- */
function atualizarEnunciado(){
  const tipo = currentTipo;
  const box = document.getElementById('enunciadoBox');
  box.innerHTML = '';

  if(tipo === 'real'){
    const nome = (document.getElementById('cardDiagReal').value.trim()) || '—';
    const rel  = textToLines(document.getElementById('cardRelacionado').value);
    const ev   = textToLines(document.getElementById('cardEvidenciado').value);
    box.innerHTML = `
      <div class="enunciado-tipo real"><span class="badge">DIAGNÓSTICO REAL</span></div>
      <div class="enunciado-linha" style="font-weight:700;font-size:13.5px;">${nome}</div>
      <div class="enunciado-sep"></div>
      <div class="enunciado-linha"><span class="rotulo">RELACIONADO A:</span><br>
        ${rel.length ? rel.map(l=>`<span class="valor">• ${l}</span>`).join('<br>') : '<span class="valor vazio">—</span>'}
      </div>
      <div class="enunciado-sep"></div>
      <div class="enunciado-linha"><span class="rotulo">CONFORME EVIDENCIADO POR:</span><br>
        ${ev.length ? ev.map(l=>`<span class="valor">• ${l}</span>`).join('<br>') : '<span class="valor vazio">—</span>'}
      </div>`;
  } else if(tipo === 'risco'){
    const nome = (document.getElementById('cardDiagRisco').value.trim()) || '—';
    const fr   = textToLines(document.getElementById('cardFatoresRisco').value);
    box.innerHTML = `
      <div class="enunciado-tipo risco"><span class="badge">DIAGNÓSTICO DE RISCO</span></div>
      <div class="enunciado-linha" style="font-weight:700;font-size:13.5px;">Risco de ${nome}</div>
      <div class="enunciado-sep"></div>
      <div class="enunciado-linha"><span class="rotulo">RELACIONADO A:</span><br>
        ${fr.length ? fr.map(l=>`<span class="valor">• ${l}</span>`).join('<br>') : '<span class="valor vazio">—</span>'}
      </div>`;
  } else {
    const nome = (document.getElementById('cardDiagPromocao').value.trim()) || '—';
    const ev   = textToLines(document.getElementById('cardEvidenciadoProm').value);
    box.innerHTML = `
      <div class="enunciado-tipo promocao"><span class="badge">DIAGNÓSTICO DE PROMOÇÃO DA SAÚDE</span></div>
      <div class="enunciado-linha" style="font-weight:700;font-size:13.5px;">${nome}</div>
      <div class="enunciado-sep"></div>
      <div class="enunciado-linha"><span class="rotulo">CONFORME EVIDENCIADO POR:</span><br>
        ${ev.length ? ev.map(l=>`<span class="valor">• ${l}</span>`).join('<br>') : '<span class="valor vazio">—</span>'}
      </div>`;
  }
}

/* Ouvintes para atualização ao vivo */
['cardDiagReal','cardRelacionado','cardEvidenciado',
 'cardDiagRisco','cardFatoresRisco',
 'cardDiagPromocao','cardEvidenciadoProm'].forEach(id=>{
  const el = document.getElementById(id);
  if(el) el.addEventListener('input', atualizarEnunciado);
});

/* ---- Mudar tipo de diagnóstico ---- */
function setTipoDiag(tipo, btn){
  currentTipo = tipo;
  document.querySelectorAll('.tipo-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('secReal').style.display    = tipo==='real'     ? '' : 'none';
  document.getElementById('secRisco').style.display   = tipo==='risco'    ? '' : 'none';
  document.getElementById('secPromocao').style.display= tipo==='promocao' ? '' : 'none';
  atualizarEnunciado();
}

/* ---- Abrir ficha ---- */
let currentCardDom = '';
let currentCardCls = '';
function openDiagCard(dom, cls, diag){
  currentCardKey = diagStorageKey(diag);
  currentCardDom = dom;
  currentCardCls = cls;

  // Identificação
  document.getElementById('cardDominio').textContent = dom;
  document.getElementById('cardClasse').textContent  = cls;
  document.getElementById('cardNome').textContent    = diag;
  document.getElementById('cardCodigoLabel').textContent = (CODES_2024[diag] || '') + (CODES_2024[diag] ? ' · NANDA-I 2024–2026' : ' (sem código atribuído na base actual)');

  // Carregar dados guardados
  let saved = {};
  try{
    const raw = localStorage.getItem(currentCardKey);
    if(raw) saved = JSON.parse(raw);
  }catch(e){ saved = {}; }

  // Preencher campos
  const tipo = saved.tipo || 'real';
  currentTipo = tipo;
  document.querySelectorAll('.tipo-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.tipo === tipo);
  });
  document.getElementById('secReal').style.display    = tipo==='real'     ? '' : 'none';
  document.getElementById('secRisco').style.display   = tipo==='risco'    ? '' : 'none';
  document.getElementById('secPromocao').style.display= tipo==='promocao' ? '' : 'none';

  // Nome sugerido com base no título da taxonomia
  const nomeBase = diag.replace(/^Risco (de|para|do|da)\s+/i,'').replace(/^Prontidão para\s+/i,'').replace(/^Disposição para\s+/i,'');
  const isRisco   = /^risco (de|para|do|da)\s/i.test(diag);
  const isProm    = /^prontidão para|^disposição para/i.test(diag);
  const tipoAuto  = saved.tipo ? saved.tipo : (isRisco ? 'risco' : isProm ? 'promocao' : 'real');

  document.getElementById('cardDefinicao').value      = saved.definicao   || '';
  document.getElementById('cardDiagReal').value       = saved.diagReal    || (!isRisco && !isProm ? diag : '');
  document.getElementById('cardRelacionado').value    = linesToText(saved.relacionado);
  document.getElementById('cardEvidenciado').value    = linesToText(saved.evidenciado);
  document.getElementById('cardDiagRisco').value      = saved.diagRisco   || (isRisco ? nomeBase : '');
  document.getElementById('cardFatoresRisco').value   = linesToText(saved.fatoresRisco);
  document.getElementById('cardDiagPromocao').value   = saved.diagProm    || (isProm ? diag : '');
  document.getElementById('cardEvidenciadoProm').value= linesToText(saved.evidenciadoProm);
  if(saved.nic && saved.nic.length){
    document.getElementById('cardNIC').value = linesToText(saved.nic);
  } else {
    const sug = getSugestaoNicNoc(diag, dom, cls);
    document.getElementById('cardNIC').value = sug.nic.map(l=>'• '+l).join('\n');
  }
  if(saved.noc && saved.noc.length){
    document.getElementById('cardNOC').value = linesToText(saved.noc);
  } else {
    const sug = getSugestaoNicNoc(diag, dom, cls);
    document.getElementById('cardNOC').value = sug.noc.map(l=>'• '+l).join('\n');
  }
  document.getElementById('cardSavedMsg').textContent = '';

  // Aplicar tipo automático se novo
  if(!saved.tipo){
    currentTipo = tipoAuto;
    document.querySelectorAll('.tipo-btn').forEach(b=>{
      b.classList.toggle('active', b.dataset.tipo === tipoAuto);
    });
    document.getElementById('secReal').style.display    = tipoAuto==='real'     ? '' : 'none';
    document.getElementById('secRisco').style.display   = tipoAuto==='risco'    ? '' : 'none';
    document.getElementById('secPromocao').style.display= tipoAuto==='promocao' ? '' : 'none';
  }

  atualizarEnunciado();
  cardOverlay.classList.add('open');
}

/* ---- Fechar ---- */
function closeDiagCard(){
  cardOverlay.classList.remove('open');
  currentCardKey = null;
}

/* ---- Guardar ---- */
function saveDiagCard(){
  if(!currentCardKey) return;
  const data = {
    tipo:            currentTipo,
    definicao:       document.getElementById('cardDefinicao').value.trim(),
    diagReal:        document.getElementById('cardDiagReal').value.trim(),
    relacionado:     textToLines(document.getElementById('cardRelacionado').value),
    evidenciado:     textToLines(document.getElementById('cardEvidenciado').value),
    diagRisco:       document.getElementById('cardDiagRisco').value.trim(),
    fatoresRisco:    textToLines(document.getElementById('cardFatoresRisco').value),
    diagProm:        document.getElementById('cardDiagPromocao').value.trim(),
    evidenciadoProm: textToLines(document.getElementById('cardEvidenciadoProm').value),
    nic:             textToLines(document.getElementById('cardNIC').value),
    noc:             textToLines(document.getElementById('cardNOC').value)
  };
  try{
    localStorage.setItem(currentCardKey, JSON.stringify(data));
    const msg = document.getElementById('cardSavedMsg');
    msg.textContent = 'Guardado ✓';
    setTimeout(()=>{ if(msg.textContent==='Guardado ✓') msg.textContent=''; }, 2000);
  }catch(e){
    document.getElementById('cardSavedMsg').textContent = 'Não foi possível guardar neste dispositivo.';
  }
}

/* ---- Limpar sessão do diagnóstico actual ---- */
function limparSessaoDiag(){
  if(!currentCardKey) return;
  if(!confirm('Limpar todos os dados desta sessão de diagnóstico?')) return;
  try{ localStorage.removeItem(currentCardKey); }catch(e){}

  // Resetar campos
  ['cardDefinicao','cardDiagReal','cardRelacionado','cardEvidenciado',
   'cardDiagRisco','cardFatoresRisco',
   'cardDiagPromocao','cardEvidenciadoProm'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.value = '';
  });
  const diagAtual = currentCardKey.replace('diagFicha::','');
  const sug = getSugestaoNicNoc(diagAtual, currentCardDom, currentCardCls);
  document.getElementById('cardNIC').value = sug.nic.map(l=>'• '+l).join('\n');
  document.getElementById('cardNOC').value = sug.noc.map(l=>'• '+l).join('\n');
  document.getElementById('cardSavedMsg').textContent = 'Sessão limpa ✓';
  setTimeout(()=>{ document.getElementById('cardSavedMsg').textContent=''; }, 2000);
  atualizarEnunciado();
}

// Delegação de clique: qualquer item de diagnóstico (nas duas secções) abre a ficha

document.addEventListener('click', (e)=>{
  const li = e.target.closest('.diag-item');
  if(!li) return;
  openDiagCard(li.dataset.dom, li.dataset.cls, li.dataset.diag);
});

// Suporte a pesquisa vinda da Início (?q=termo)
(function(){
  const params = new URLSearchParams(location.search);
  const q = params.get('q');
  if(q){
    const target = document.getElementById('searchInput');
    if(target){
      target.value = q;
      target.dispatchEvent(new Event('input'));
    }
  }
})();


