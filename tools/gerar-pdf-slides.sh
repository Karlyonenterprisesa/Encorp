#!/bin/sh
# Converte os PowerPoint das aulas (slides/<curso>/aula-N.pptx, criados por «node build.mjs») em PDF para o leitor do site.
# Precisa do LibreOffice (soffice). Correr no computador sempre que mudar slides no CMS, depois fazer commit da pasta slides/.
# Uso:  node build.mjs && sh tools/gerar-pdf-slides.sh
set -e
cd "$(dirname "$0")/.."
for f in slides/*/aula-*.pptx; do
  d=$(dirname "$f")
  soffice --headless --convert-to pdf --outdir "$d" "$f" >/dev/null 2>&1
  echo "PDF: ${f%.pptx}.pdf"
done
