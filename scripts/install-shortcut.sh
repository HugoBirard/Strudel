#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DESKTOP_FILE="$SCRIPT_DIR/strudel-studio.desktop"

echo "Installation du raccourci Strudel Studio..."

# 1. Applications menu (~/.local/share/applications)
mkdir -p "$HOME/.local/share/applications"
cp "$DESKTOP_FILE" "$HOME/.local/share/applications/strudel-studio.desktop"
chmod +x "$HOME/.local/share/applications/strudel-studio.desktop"
echo "✓ Raccourci ajouté dans le menu d'applications (~/.local/share/applications)"

# 2. Bureau / Desktop si présent
if [ -d "$HOME/Bureau" ]; then
  cp "$DESKTOP_FILE" "$HOME/Bureau/strudel-studio.desktop"
  chmod +x "$HOME/Bureau/strudel-studio.desktop"
  echo "✓ Raccourci créé sur le Bureau ($HOME/Bureau)"
fi

if [ -d "$HOME/Desktop" ]; then
  cp "$DESKTOP_FILE" "$HOME/Desktop/strudel-studio.desktop"
  chmod +x "$HOME/Desktop/strudel-studio.desktop"
  echo "✓ Raccourci créé sur le Bureau ($HOME/Desktop)"
fi

# 3. Met à jour la base de données des applications de bureau si disponible
if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database "$HOME/.local/share/applications" || true
fi

echo "Installation terminée avec succès !"
