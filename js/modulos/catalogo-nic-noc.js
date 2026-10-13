// === catalog.js ===
// ===== catalog.js — motor de listagem NIC/NOC (intervencoes.html e resultados.html) =====

function totalItemCountCat(data){
  let t = 0;
  data.forEach(d => d.classes.forEach(c => t += c.itens.length));
  return t;
}
function totalClassCountCat(data){
  let t = 0;
  data.forEach(d => t += d.classes.length);
  return t;
}
function createCatalog(suffix, data, opts){
  const mainEl = document.getElementById('main' + suffix);
  const statsEl = document.getElementById('stats' + suffix);
  const searchInput = document.getElementById('searchInput' + suffix);
  const clearBtn = document.getElementById('clearBtn' + suffix);
  const footerEl = document.getElementById('footer' + suffix);
  const unit = opts.unit;         // ex.: 'intervenção(ões)'
  const unitCap = opts.unitCap;   // ex.: 'Intervenções'
  const sourceLabel = opts.sourceLabel; // ex.: 'NIC — Nursing Interventions Classification'

  function render(term){
    const t = (term || '').trim();
    const nt = normalize(t);
    mainEl.innerHTML = '';
    let totalMatches = 0;

    data.forEach(dom => {
      const domainMatchesTitle = normalize(dom.dominio).includes(nt);
      let domainHasMatch = false;
      let classesHtml = '';
      let domainItemCount = 0;

      dom.classes.forEach(cls => {
        domainItemCount += cls.itens.length;
        const classMatchesTitle = normalize(cls.classe).includes(nt);
        const matched = cls.itens.filter(it => !nt || normalize(it).includes(nt) || classMatchesTitle || domainMatchesTitle);
        if(nt && matched.length === 0) return;

        domainHasMatch = domainHasMatch || matched.length > 0;
        totalMatches += matched.length;

        let itemsHtml = '';
        if(matched.length === 0){
          itemsHtml = '<li class="empty-classe">Esta classe não contém ' + unit + ' atualmente</li>';
        } else {
          matched.forEach(it => {
            itemsHtml += '<li class="diag-item">' + highlight(it, t) + '</li>';
          });
        }

        classesHtml += '<div class="classe' + (nt ? ' open' : '') + '">' +
          '<div class="classe-head" onclick="this.parentElement.classList.toggle(\'open\')">' +
            '<span class="ctitle">' + highlight(cls.classe, t) + '</span>' +
            '<span style="display:flex;align-items:center;gap:8px;">' +
              '<span class="ccount">' + matched.length + '</span>' +
              '<span class="cchev">▾</span>' +
            '</span>' +
          '</div>' +
          '<div class="classe-body"><ul class="diag-list">' + itemsHtml + '</ul></div>' +
        '</div>';
      });

      if(nt && !domainHasMatch && !domainMatchesTitle) return;

      const domainDiv = document.createElement('div');
      domainDiv.className = 'domain' + (nt ? ' open' : '');
      domainDiv.innerHTML =
        '<div class="domain-head" onclick="this.parentElement.classList.toggle(\'open\')">' +
          '<span class="title">' + highlight(dom.dominio, t) + '</span>' +
          '<span style="display:flex;align-items:center;gap:8px;">' +
            '<span class="count">' + domainItemCount + '</span>' +
            '<span class="chev">▾</span>' +
          '</span>' +
        '</div>' +
        '<div class="domain-body">' + classesHtml + '</div>';

      mainEl.appendChild(domainDiv);
    });

    if(nt && mainEl.children.length === 0){
      mainEl.innerHTML = '<div class="no-results"><div>🔍</div>Nenhum(a) ' + unit + ' encontrado(a) para<br><b>"' + t + '"</b></div>';
      statsEl.textContent = '';
    } else if(nt){
      statsEl.innerHTML = '<b>' + totalMatches + '</b> ' + unit + ' encontrado(a)(s)';
    } else {
      statsEl.innerHTML = '<b>' + data.length + '</b> Domínios · <b>' + totalClassCountCat(data) + '</b> Classes · <b>' + totalItemCountCat(data) + '</b> ' + unitCap;
    }

    if(footerEl){
      footerEl.innerHTML = 'Catálogo de referência ' + sourceLabel + ' · <b>' + data.length + ' Domínios · ' +
        totalClassCountCat(data) + ' Classes · ' + totalItemCountCat(data) + ' ' + unitCap + '</b>';
    }
  }

  searchInput.addEventListener('input', (e) => {
    const v = e.target.value;
    clearBtn.classList.toggle('show', v.length > 0);
    render(v);
  });
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.classList.remove('show');
    render('');
    searchInput.focus();
  });

  render('');
}

function setEdition(edition, suffix){
  browsers[suffix === undefined ? '' : suffix].setEdition(edition);
}

/* =====================================================================
   SUGESTÕES NIC/NOC POR DIAGNÓSTICO
   Conteúdo de referência prática (não substitui o julgamento clínico
   nem as normas da instituição). Preenche automaticamente a ficha do
   diagnóstico para que NIC/NOC nunca apareçam em branco:
   1) correspondência exacta ao nome do diagnóstico (mais específico);
   2) por palavra-chave no nome do diagnóstico;
   3) por domínio da Taxonomia (garante que há sempre conteúdo).
   ===================================================================== */


