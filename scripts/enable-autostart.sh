#!/usr/bin/env bash
set -euo pipefail
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
AUTOSTART_DIR="$HOME/.config/autostart"
mkdir -p "$AUTOSTART_DIR"
cat > "$AUTOSTART_DIR/fedora-tv-launcher.desktop" <<DESKTOP
[Desktop Entry]
Type=Application
Name=Fedora TV Launcher
Comment=Полноэкранный TV-лаунчер
Exec=/usr/bin/env bash -lc 'cd "$PROJECT_DIR" && npm start'
Terminal=false
X-GNOME-Autostart-enabled=true
DESKTOP

echo "Автозапуск включён: $AUTOSTART_DIR/fedora-tv-launcher.desktop"
