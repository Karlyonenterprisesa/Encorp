// === core.js ===
// ===== core.js — utilitários e comportamento partilhados por todas as páginas =====

function showView(name){
  const target = document.getElementById('view-' + name);
  if(target){
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    target.classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active', b.dataset.nav === name));
    window.scrollTo({top:0, behavior:'instant' in window ? 'instant' : 'auto'});
  } else {
    showToast('Secção indisponível de momento.'); if(name !== 'home') showView('home');
  }
}

// O cabeçalho (topo) permanece fixo; só o banner se oculta/mostra (ver script do banner).

// ===== Lightbox de imagens: zoom + download (injectado uma vez em cada página) =====
(function(){
  function ensureLightbox(){
    if(document.getElementById('imgLightbox')) return;
    var el = document.createElement('div');
    el.id = 'imgLightbox';
    el.className = 'lightbox-overlay';
    el.innerHTML =
      '<div class="lightbox-box">' +
        '<button class="lightbox-close" aria-label="Fechar" onclick="closeLightbox()">✕</button>' +
        '<div class="lightbox-imgwrap" id="lightboxImgWrap">' +
          '<img id="lightboxImg" src="" alt="">' +
        '</div>' +
        '<div class="lightbox-actions">' +
          '<span class="lightbox-hint">Toque na imagem para ampliar</span>' +
          '<a id="lightboxDownload" class="lightbox-download" download>⬇ Descarregar</a>' +
        '</div>' +
      '</div>';
    el.addEventListener('click', function(e){ if(e.target === el) closeLightbox(); });
    document.body.appendChild(el);
    document.getElementById('lightboxImg').addEventListener('click', function(){
      this.classList.toggle('zoomed');
    });
  }
  window.openLightbox = function(src, alt, filename){
    ensureLightbox();
    try{ var _ev=window.event, _t=_ev&&_ev.target; if(_t&&_t.tagName==='IMG'&&/^data:/.test(_t.src)) src=_t.src; }catch(e){}
    var img = document.getElementById('lightboxImg');
    img.src = src; img.alt = alt || '';
    img.classList.remove('zoomed');
    document.getElementById('lightboxImgWrap').scrollTop = 0;
    document.getElementById('lightboxImgWrap').scrollLeft = 0;
    var dl = document.getElementById('lightboxDownload');
    dl.href = src; dl.setAttribute('download', filename || (alt || 'imagem').replace(/\s+/g,'-') + (/^data:image\/webp/.test(src)?'.webp':'.jpg'));
    document.getElementById('imgLightbox').classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeLightbox = function(){
    var lb = document.getElementById('imgLightbox');
    if(lb) lb.classList.remove('open');
    document.body.style.overflow = '';
  };
})();

// Códigos NANDA-I: ver CODES_2024 (todos os 277 diagnósticos têm código).


// ===== Ocultar imagens de ferramentas/procedimentos até o utilizador pedir =====
// Todas as imagens marcadas com a classe "zoomable-img" (pulsos, sinais vitais,
// procedimentos, escalas, etc.) começam ocultas; só aparecem depois de o
// utilizador clicar no botão "Visualizar imagem".
function initImageReveal(){
  document.querySelectorAll('img.zoomable-img:not(.img-hide-processed)').forEach(function(img){
    img.classList.add('img-hide-processed');
    // Na página Início (Galeria de Apoio, etc.) as imagens permanecem sempre
    // visíveis — o botão "Visualizar imagem" só se aplica às restantes secções.
    if (img.closest('#view-home')) return;
    img.style.display = 'none';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'img-reveal-btn';
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/></svg> Visualizar imagem';
    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'img-close-btn';
    closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="13" height="13"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Fechar imagem';
    closeBtn.style.display = 'none';
    btn.addEventListener('click', function(){
      img.style.display = 'block';
      btn.style.display = 'none';
      closeBtn.style.display = 'flex';
    });
    closeBtn.addEventListener('click', function(){
      img.style.display = 'none';
      closeBtn.style.display = 'none';
      btn.style.display = 'flex';
    });
    img.parentNode.insertBefore(btn, img);
    img.parentNode.insertBefore(closeBtn, img.nextSibling);
  });
}
window.addEventListener('load', initImageReveal);

// ===== Menu lateral =====
function openMenu(){ document.getElementById('drawerOverlay').classList.add('open'); }
function closeMenu(){ document.getElementById('drawerOverlay').classList.remove('open'); }

// ===== Pesquisa global (Início) =====
function _norm(t){return (t||'').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');}
var GS_VIEWS=[['diagnosticos','Diagnósticos de Enfermagem'],['avaliacao','Avaliação e Exame Físico'],['procedimentos','Procedimentos'],['urgencia','Urgência e Emergência'],['escalas','Escalas Clínicas'],['exames','Exames Laboratoriais'],['medicamentos','Medicamentos'],['casos-clinicos','Casos Clínicos'],['glossario','Termos Médicos'],['biblioteca','Biblioteca']];
function runGlobalSearch(){
  var inp=document.getElementById('searchInputGlobal');
  var term=inp.value.trim(); if(!term) return;
  var q=_norm(term);
  var box=document.getElementById('globalSearchResults');
  if(!box){
    box=document.createElement('div'); box.id='globalSearchResults'; box.className='gs-results';
    var sb=inp.closest('.searchbar'); sb.parentNode.insertBefore(box, sb.nextSibling);
  }
  box.dataset.q=term; box.innerHTML='';
  var total=0;
  GS_VIEWS.forEach(function(v){
    var n=0;
    if(v[0]==='diagnosticos'){
      if(typeof DATA_2024!=='undefined'){
        DATA_2024.forEach(function(d){ d.classes.forEach(function(c){ c.diagnosticos.forEach(function(x){ if(_norm(x).indexOf(q)>-1) n++; }); }); });
      }
    } else {
      var el=document.getElementById('view-'+v[0]); if(!el) return;
      el.querySelectorAll('.acc').forEach(function(a){ if(_norm(a.textContent).indexOf(q)>-1) n++; });
    }
    if(!n) return;
    total+=n;
    var b=document.createElement('button'); b.type='button'; b.className='gs-hit';
    b.innerHTML='<span></span><b></b>'; b.firstChild.textContent=v[1]; b.lastChild.textContent=n;
    b.addEventListener('click',function(){ openSearchHit(v[0]); });
    box.appendChild(b);
  });
  if(!total){
    var e=document.createElement('div'); e.className='gs-empty'; e.textContent='Sem resultados para «'+term+'». Tente outra palavra.';
    box.appendChild(e);
  }
}
function openSearchHit(id){
  var box=document.getElementById('globalSearchResults'); var term=box?box.dataset.q:'';
  showView(id);
  if(id==='diagnosticos'){
    var si=document.getElementById('searchInput');
    if(si){ si.value=term; si.dispatchEvent(new Event('input')); }
  } else {
    var mi=document.querySelector('#view-'+id+' .search-mini input');
    if(mi) mi.value=term;
    filterAcc(id, term);
    var first=document.querySelector('#view-'+id+' .acc:not([style*="display: none"])');
    if(first) first.classList.add('open');
  }
}
(function(){
  document.addEventListener('DOMContentLoaded',function(){
    var inp=document.getElementById('searchInputGlobal'), clr=document.getElementById('clearBtnGlobal'); if(!inp) return;
    inp.addEventListener('input',function(){
      if(clr) clr.classList.toggle('show', !!inp.value);
      if(!inp.value){ var b=document.getElementById('globalSearchResults'); if(b) b.remove(); }
    });
    if(clr) clr.addEventListener('click',function(){ var b=document.getElementById('globalSearchResults'); if(b) b.remove(); });
  });
})();

// ===== Placeholder / Acordeão genérico =====
function buildPlaceholderView(id, title, desc, chips, img){
  if(document.getElementById('view-' + id)) return; // evita views duplicadas (ex.: biblioteca, especialidades)
  const div = document.createElement('div');
  div.className = 'view';
  div.id = 'view-' + id;
  div.innerHTML =
    '<div style="padding:10px 12px 0;">' +
      '<button class="back-btn" style="background:rgba(11,26,51,.08);color:var(--azul-escuro);" onclick="showView(\'home\')">‹ Início</button>' +
    '</div>' +
    '<div class="placeholder">' +
      (img ? '<img src="' + img + '" style="width:100%;max-width:240px;border-radius:12px;margin-bottom:16px;" alt="' + title + '">' : '<div class="pico">🚧</div>') +
      '<h3>' + title + '</h3>' +
      '<p>' + desc + '</p>' +
      (chips ? '<div class="chip-row">' + chips.map(c => '<span class="chip">' + c + '</span>').join('') + '</div>' : '') +
    '</div>';
  document.getElementById('app').insertBefore(div, document.querySelector('.bottom-fixed'));
}
function buildAccordionView(id, title, intro, items){
  const div = document.createElement('div');
  div.className = 'view';
  div.id = 'view-' + id;
  const itemsHtml = items.map((it, idx) => `
    <div class="acc" id="${id}-acc-${idx}">
      <div class="acc-head" onclick="this.parentElement.classList.toggle('open')">
        <div class="a-icon" style="background:${it.bg};color:${it.fg};">${it.icon}</div>
        <div class="a-txt"><div class="a-title">${it.title}</div><div class="a-sub">${it.sub}</div></div>
        <div class="a-chev">▾</div>
      </div>
      <div class="acc-body"><div class="acc-in">${it.body}</div></div>
    </div>`).join('');
  div.innerHTML = `
    <div style="padding:10px 12px 0;">
      <button class="back-btn" style="background:rgba(11,26,51,.08);color:var(--azul-escuro);" onclick="showView('ferramentas')">‹ Ferramentas</button>
    </div>
    <div class="section-title" style="margin-top:14px;">${title}</div>
    <div style="margin:0 12px 4px;font-size:12px;color:var(--texto-suave);">${intro}</div>
    <div class="search-mini">
      <input type="text" placeholder="Pesquisar em ${title.toLowerCase()}..." oninput="filterAcc('${id}', this.value)">
    </div>
    ${itemsHtml}
    <footer style="margin:16px 8px 6px;">Conteúdo de apoio à prática clínica. Utilize sempre em conjunto com protocolos institucionais e julgamento profissional.</footer>
  `;
  document.getElementById('app').insertBefore(div, document.querySelector('.bottom-fixed'));
}
function filterAcc(id, term){
  term = (term||'').trim().toLowerCase();
  document.querySelectorAll('#view-' + id + ' .acc').forEach(acc=>{
    const text = _norm(acc.textContent);
    acc.style.display = (!term || text.includes(_norm(term))) ? '' : 'none';
  });
}

const ICON_SCALE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M4 19h16"/><rect x="6" y="10" width="3" height="9"/><rect x="11" y="6" width="3" height="13"/><rect x="16" y="13" width="3" height="6"/></svg>';
const ICON_PROC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M12 2v6M12 16v6M4.9 4.9l4.2 4.2M14.9 14.9l4.2 4.2M2 12h6M16 12h6M4.9 19.1l4.2-4.2M14.9 9.1l4.2-4.2"/></svg>';
const ICON_EXAM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M9 2v6L4 20a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3L15 8V2"/><line x1="9" y1="2" x2="15" y2="2"/></svg>';
const ICON_ALERT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M4 15l5-10 3 6 2-3 6 7"/><circle cx="12" cy="12" r="10"/></svg>';

// ================= ESCALAS CLÍNICAS =================

// ===== Utilitários de texto/pesquisa =====
function escapeAttr(s){
  return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function classify(nome){
  if(/^Risco de/i.test(nome)) return 'risco';
  if(/^Disposição para/i.test(nome)) return 'disposicao';
  return 'atual';
}
function highlight(text, term){
  if(!term) return text;
  const idx = text.toLowerCase().indexOf(term.toLowerCase());
  if(idx===-1) return text;
  return text.slice(0,idx) + '<mark>' + text.slice(idx, idx+term.length) + '</mark>' + text.slice(idx+term.length);
}
function normalize(s){
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
}

// Fábrica: cria uma instância independente do navegador de domínios/classes/diagnósticos
// (usada na secção "Diagnósticos de Enfermagem" — os domínios da Taxonomia NANDA-I
// correspondem às Necessidades Humanas Básicas, explicado directamente nessa secção)


