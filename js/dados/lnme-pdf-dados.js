// === data-lnme-pdf.js ===
// ===== data-lnme-pdf.js =====
// Lista Nacional de Medicamentos Essenciais — Moçambique, 2017
// Ministério da Saúde / Departamento Farmacêutico. Documento oficial,
// incorporado na Biblioteca e na página Medicamentos com o visualizador
// interno (pdf-viewer.js) e opção de download.
window.LNME_PDF_B64 = "pdf/Lista_Nacional_Medicamentos_Essenciais_Mocambique_2017.pdf";
if (typeof registerLibraryPdf === 'function') {
  registerLibraryPdf('lnme', window.LNME_PDF_B64, 'Lista_Nacional_Medicamentos_Essenciais_Mocambique_2017.pdf');
} else {
  window.addEventListener('load', function(){
    if (typeof registerLibraryPdf === 'function') {
      registerLibraryPdf('lnme', window.LNME_PDF_B64, 'Lista_Nacional_Medicamentos_Essenciais_Mocambique_2017.pdf');
    }
  });
}


