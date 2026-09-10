# Icônes PWA — instructions

Ce dépôt contient un script pour générer automatiquement les icônes nécessaires à la PWA à partir d'une image source.

Comment l'utiliser

1) Installer ImageMagick (sur macOS via `brew install imagemagick`, sur Ubuntu `sudo apt install imagemagick`).
2) Déposer votre logo/icone dans la racine du projet avec le nom `icon-source.png` (512x512 conseillé).
3) Rendre le script exécutable: `chmod +x generate-icons.sh`
4) Lancer: `./generate-icons.sh`

Le script produira: icon-72x72.png, icon-96x96.png, icon-128x128.png, icon-144x144.png, icon-152x152.png, icon-192x192.png, icon-384x384.png, icon-512x512.png et deux fichiers maskable copiés.

Remarques
- Tu peux aussi fournir `icon.png` (déjà présent) et le script l'utilisera comme source.
- Après avoir généré les icônes, elles seront référencées automatiquement par `manifest.json`.
- Si tu veux remplacer l'icône par celle de ton école plus tard, dépose simplement ton fichier `icon-source.png` ou `icon.png` et relance le script.
