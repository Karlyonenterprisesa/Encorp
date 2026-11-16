// === init-biblioteca.js ===
// (placeholder antigo da Biblioteca removido: a Biblioteca é construída acima)


// === init-especialidades.js ===
buildPlaceholderView('especialidades', 'Especialidades', 'Conteúdos organizados por especialidade em enfermagem (Pediatria, Obstetrícia, Saúde Mental, entre outras). Secção em desenvolvimento.', null, null);


// === init-intervencoes.js ===
createCatalog('3', DATA_NIC, {
  unit: 'intervenção(ões)',
  unitCap: 'Intervenções',
  sourceLabel: 'NIC — Nursing Interventions Classification'
});


// === init-resultados.js ===
createCatalog('4', DATA_NOC, {
  unit: 'resultado(s)',
  unitCap: 'Resultados',
  sourceLabel: 'NOC — Nursing Outcomes Classification'
});

