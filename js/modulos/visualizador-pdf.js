// === pdf-viewer.js ===
// ===== pdf-viewer.js v2.5 — Visualizador PDF/Word =====

// ─── 1. CSS GLOBAL ────────────────────────────────────────────────────────────
(function injectStyles(){
  if(document.getElementById('ec-pv-styles')) return;
  var s = document.createElement('style');
  s.id = 'ec-pv-styles';
  s.textContent = `
.acc-in h4 {
  text-align: center;
  font-weight: 800;
  font-size: 12.5px;
  color: var(--azul-escuro);
  text-transform: uppercase;
  letter-spacing: .4px;
  margin: 14px 0 6px;
}
.section-title {
  text-align: center;
  font-weight: 800;
}
/* Contorno + relevo nos títulos das secções (mesmo contorno dos cards, ex.: Manual do Sistema) */
.section-title {
  background: #fff;
  border: 1px solid var(--borda);
  border-radius: 12px;
  padding: 10px 14px;
  box-shadow: 0 3px 8px rgba(11,26,51,.14), 0 1px 2px rgba(11,26,51,.10), inset 0 1px 0 #fff;
}
.a-title { font-weight: 800; }
.word-viewer-area {
  background: #fff;
  border: 1px solid var(--borda);
  border-radius: 12px;
  padding: 16px;
  margin-top: 14px;
  font-size: 13px;
  line-height: 1.7;
  color: #1a1a1a;
  max-height: 520px;
  overflow-y: auto;
  display: none;
}
.word-viewer-area h1,
.word-viewer-area h2,
.word-viewer-area h3 {
  text-align: center;
  font-weight: 800;
  color: var(--azul-escuro);
  margin: 14px 0 8px;
}
.word-viewer-area table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  margin: 10px 0;
}
.word-viewer-area td,
.word-viewer-area th {
  border: 1px solid #ddd;
  padding: 6px 8px;
}
.word-viewer-area th {
  background: #e7ecf4;
  font-weight: 700;
  text-align: center;
}
.viewer-close-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fbe4e8;
  color: #c8202f;
  border: 1px solid #f6c9ce;
  border-radius: 8px;
  padding: 5px 12px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
}
.word-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  font-size: 12.5px;
  color: var(--texto-suave);
}
`;
  document.head.appendChild(s);
})();

// ─── 2. BIBLIOTECA DE PDFs ────────────────────────────────────────────────────
window.PDF_LIBRARY = window.PDF_LIBRARY || {};

function registerLibraryPdf(id, base64Data, filename){
  window.PDF_LIBRARY[id] = { url: base64Data, data: null, filename: filename };
}

function _pdfB64toBlob(b64Data, contentType){
  var sliceSize = 512;
  var byteCharacters = atob(b64Data);
  var byteArrays = [];
  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);
    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) byteNumbers[i] = slice.charCodeAt(i);
    byteArrays.push(new Uint8Array(byteNumbers));
  }
  return new Blob(byteArrays, { type: contentType || 'application/pdf' });
}

function openLibraryPdf(id){
  var entry = window.PDF_LIBRARY[id];
  var area  = document.getElementById('pdf-area-' + id);
  if (!entry || !area) return;
  if (area.style.display === 'block') { area.style.display = 'none'; return; }
  var iframe = document.getElementById('pdf-iframe-' + id);
  if (iframe && (!iframe.src || iframe.src === 'about:blank')) {
    iframe.src = entry.url;
  }
  area.style.display = 'block';
  area.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function openLibraryPdfAtPage(id, page){
  var entry  = window.PDF_LIBRARY[id];
  var area   = document.getElementById('pdf-area-' + id);
  var iframe = document.getElementById('pdf-iframe-' + id);
  if (!entry || !area || !iframe) return;
  iframe.src = entry.url + '#page=' + page;
  area.style.display = 'block';
  area.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function downloadLibraryPdf(id){
  var entry = window.PDF_LIBRARY[id];
  if (!entry) return;
  var a = document.createElement('a');
  a.href = entry.url; a.download = entry.filename || (id + '.pdf');
  document.body.appendChild(a); a.click(); a.remove();
}

function openLibraryPdfNewTab(id){
  var entry = window.PDF_LIBRARY[id];
  if (entry) window.open(entry.url, '_blank', 'noopener');
}

function libraryPdfButtons(id){
  return '<div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">' +
    '<button onclick="openLibraryPdf(\'' + id + '\')" style="background:#f28c1c;color:#fff;border:none;border-radius:10px;padding:10px 18px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="16" height="16"><path d="M14 3v4a1 1 0 001 1h4"/><path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"/></svg>' +
      'Visualizar PDF' +
    '</button>' +
    '<button onclick="downloadLibraryPdf(\'' + id + '\')" style="background:#e7ecf4;color:#000000;border:1px solid #000000;border-radius:10px;padding:10px 18px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="16" height="16"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' +
      'Baixar PDF' +
    '</button>' +
  '</div>';
}

function libraryPdfViewerBlock(id, title){
  return '<div id="pdf-area-' + id + '" style="display:none;margin-top:14px;border-radius:12px;overflow:hidden;border:1px solid var(--borda);">' +
    '<div style="display:flex;justify-content:space-between;gap:8px;padding:6px 10px;background:#F5F6FA;border-bottom:1px solid var(--borda);">' +
      '<button class="viewer-close-btn" onclick="openLibraryPdfNewTab(\'' + id + '\')">↗ Abrir noutra janela</button>' +
      '<button class="viewer-close-btn" onclick="document.getElementById(\'pdf-area-' + id + '\').style.display=\'none\'">✕ Fechar Visualizador</button>' +
    '</div>' +
    '<iframe id="pdf-iframe-' + id + '" style="width:100%;height:520px;border:none;" title="' + (title || 'Documento PDF') + '"></iframe>' +
  '</div>';
}

// ─── 3. BIBLIOTECA DE WORD (.docx) ───────────────────────────────────────────
window.WORD_LIBRARY = window.WORD_LIBRARY || {};

function registerLibraryWord(id, base64Data, filename){
  window.WORD_LIBRARY[id] = { data: base64Data, filename: filename };
}

function _loadMammoth(callback){
  if(window.mammoth){ callback(); return; }
  var s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.8.0/mammoth.browser.min.js';
  s.onload = callback;
  s.onerror = function(){
    showToast('Não foi possível carregar o visualizador de Word. Verifique a ligação à internet e tente novamente.');
  };
  document.head.appendChild(s);
}

function openLibraryWord(id){
  var entry = window.WORD_LIBRARY[id];
  var area  = document.getElementById('word-area-' + id);
  if (!entry || !area) return;
  if (area.style.display === 'block') { area.style.display = 'none'; return; }
  if (area.dataset.loaded === '1') {
    area.style.display = 'block';
    area.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  area.style.display = 'block';
  area.innerHTML = '<div class="word-loading"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="20" height="20"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> A carregar documento…</div>';
  area.scrollIntoView({ behavior: 'smooth', block: 'start' });
  _loadMammoth(function(){
    try {
      var binary = atob(entry.data);
      var bytes  = new Uint8Array(binary.length);
      for(var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      mammoth.convertToHtml({ arrayBuffer: bytes.buffer }).then(function(result){
        var closeBtn = '<div style="display:flex;justify-content:flex-end;padding:6px 0 10px;">' +
          '<button class="viewer-close-btn" onclick="document.getElementById(\'word-area-' + id + '\').style.display=\'none\'">✕ Fechar Visualizador</button>' +
          '</div>';
        area.innerHTML = closeBtn + result.value;
        area.dataset.loaded = '1';
        area.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }).catch(function(err){
        area.innerHTML = '<div style="padding:16px;color:#c8202f;font-size:12.5px;">Erro ao converter documento: ' + err.message + '</div>';
      });
    } catch(e) {
      area.innerHTML = '<div style="padding:16px;color:#c8202f;font-size:12.5px;">Erro: ' + e.message + '</div>';
    }
  });
}

function downloadLibraryWord(id){
  var entry = window.WORD_LIBRARY[id];
  if (!entry) return;
  var binary = atob(entry.data);
  var bytes  = new Uint8Array(binary.length);
  for(var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  var blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a');
  a.href = url;
  a.download = entry.filename || (id + '.docx');
  a.click();
  setTimeout(function(){ URL.revokeObjectURL(url); }, 5000);
}

function libraryWordButtons(id){
  return '<div style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;justify-content:center;">' +
    '<button onclick="openLibraryWord(\'' + id + '\')" style="background:#246E29;color:#fff;border:none;border-radius:10px;padding:10px 18px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="16" height="16"><path d="M14 3v4a1 1 0 001 1h4"/><path d="M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"/><path d="M9 13h6M9 17h4"/></svg>' +
      'Visualizar Word' +
    '</button>' +
    '<button onclick="downloadLibraryWord(\'' + id + '\')" style="background:#e7ecf4;color:#000000;border:1px solid #000000;border-radius:10px;padding:10px 18px;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="16" height="16"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' +
      'Baixar Word (.docx)' +
    '</button>' +
  '</div>';
}

function libraryWordViewerBlock(id, title){
  return '<div id="word-area-' + id + '" class="word-viewer-area" title="' + (title || 'Documento Word') + '"></div>';
}

// ─── 4. REGISTOS AUTOMÁTICOS ──────────────────────────────────────────────────
(function registerExistingGastrite(){
  function tryRegister(){
    if (typeof window.GASTRITE_PDF_B64 !== 'undefined')
      registerLibraryPdf('gastrite', window.GASTRITE_PDF_B64, 'Manual_Gastrite_Ulcerativa_Karlyon_2026.pdf');
  }
  tryRegister();
  window.addEventListener('load', tryRegister);
})();

(function registerSystemManual(){
  function tryRegister(){
    if (typeof window.MANUAL_PDF_B64 !== 'undefined')
      registerLibraryPdf('manual', window.MANUAL_PDF_B64, 'Enfermeiro_Competente_Manual.pdf');
  }
  tryRegister();
  window.addEventListener('load', tryRegister);
})();


