// === data-gastrite-pdf.js ===
// Manual Gastrite — PDF embutido como base64
(function(){
  window.GASTRITE_PDF_B64 = "pdf/Manual_Gastrite_Ulcerativa_Karlyon_2026.pdf";
  
  window.openGastriteViewer = function(){
    const area = document.getElementById('gastrite-pdf-area');
    if(!area) return;
    if(area.style.display === 'block'){
      area.style.display = 'none';
      return;
    }
    const iframe = document.getElementById('gastrite-iframe');
    if(!iframe.src || iframe.src === 'about:blank'){
      iframe.src = window.GASTRITE_PDF_B64;
    }
    area.style.display = 'block';
    area.scrollIntoView({behavior:'smooth', block:'start'});
  };
  
  window.downloadGastrite = function(){
    const a = document.createElement('a');
    a.href = window.GASTRITE_PDF_B64;
    a.download = 'Manual_Gastrite_Ulcerativa_Karlyon_2026.pdf';
    document.body.appendChild(a); a.click(); a.remove();
  };
  
  function b64toBlob(b64Data, contentType){
    const sliceSize = 512;
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    for(let offset = 0; offset < byteCharacters.length; offset += sliceSize){
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for(let i = 0; i < slice.length; i++) byteNumbers[i] = slice.charCodeAt(i);
      byteArrays.push(new Uint8Array(byteNumbers));
    }
    return new Blob(byteArrays, {type: contentType});
  }
})();


