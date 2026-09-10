#!/usr/bin/env bash
# generate-icons.sh
# Génère des icônes PWA à partir d'une source (ImageMagick required)
# Usage:
#  - Placez votre icône source à la racine du repo sous le nom icon-source.png (512x512 recommandé)
#  - ou laissez la présence du fichier icon.png déjà dans le dépôt
#  - puis lancez: ./generate-icons.sh

SRC="icon-source.png"
FALLBACK="icon.png"

if [ -f "$SRC" ]; then
  SOURCE_FILE="$SRC"
elif [ -f "$FALLBACK" ]; then
  SOURCE_FILE="$FALLBACK"
else
  echo "Aucune source d'icône trouvée. Ajoutez icon-source.png (512x512) ou icon.png à la racine." >&2
  exit 1
fi

SIZES=(72 96 128 144 152 192 384 512)

for s in "${SIZES[@]}"; do
  OUT="icon-${s}x${s}.png"
  echo "Génération $OUT..."
  convert "$SOURCE_FILE" -resize ${s}x${s}^ -gravity center -extent ${s}x${s} "$OUT"
done

# maskable versions can be copied from 192/512
cp -f icon-192x192.png icon-192x192-maskable.png || true
cp -f icon-512x512.png icon-512x512-maskable.png || true

echo "Icônes générées. Remplacez icon-source.png par votre propre logo si nécessaire et relancez le script." 
