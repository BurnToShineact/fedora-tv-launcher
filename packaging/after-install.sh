#!/usr/bin/bash
set -eu

APP_DIR='/opt/Fedora TV OS'
SESSION_SOURCE="$APP_DIR/resources/tv-session"

# electron-builder normally creates this launcher link in its default hook.
if command -v update-alternatives >/dev/null 2>&1; then
  if [ -L /usr/bin/fedora-tv-os ] && [ -e /usr/bin/fedora-tv-os ] && [ "$(readlink /usr/bin/fedora-tv-os)" != /etc/alternatives/fedora-tv-os ]; then
    rm -f /usr/bin/fedora-tv-os
  fi
  update-alternatives --install /usr/bin/fedora-tv-os fedora-tv-os "$APP_DIR/fedora-tv-os" 100 \
    || ln -sfn "$APP_DIR/fedora-tv-os" /usr/bin/fedora-tv-os
else
  ln -sfn "$APP_DIR/fedora-tv-os" /usr/bin/fedora-tv-os
fi

# Chromium needs either user namespaces or a setuid sandbox.
if ! { [ -L /proc/self/ns/user ] && unshare --user true; }; then
  chmod 4755 "$APP_DIR/chrome-sandbox" || true
else
  chmod 0755 "$APP_DIR/chrome-sandbox" || true
fi

# Register Fedora TV OS as a login session, not as a user application.
install -Dm755 "$SESSION_SOURCE/fedora-tv-os-session" /usr/libexec/fedora-tv-os-session
install -Dm755 "$SESSION_SOURCE/fedora-tv-os-home" /usr/libexec/fedora-tv-os-home
install -Dm755 "$SESSION_SOURCE/fedora-tv-os-logout" /usr/libexec/fedora-tv-os-logout
install -Dm644 "$SESSION_SOURCE/fedora-tv-os.desktop" /usr/share/wayland-sessions/fedora-tv-os.desktop
install -Dm644 "$SESSION_SOURCE/labwc/rc.xml" /etc/fedora-tv-os/labwc/rc.xml
install -Dm644 "$SESSION_SOURCE/labwc/environment" /etc/fedora-tv-os/labwc/environment
install -Dm644 "$SESSION_SOURCE/labwc/menu.xml" /etc/fedora-tv-os/labwc/menu.xml
install -Dm644 "$SESSION_SOURCE/labwc/themerc-override" /etc/fedora-tv-os/labwc/themerc-override

if command -v restorecon >/dev/null 2>&1; then
  restorecon -RF /usr/libexec/fedora-tv-os-session /usr/libexec/fedora-tv-os-home \
    /usr/libexec/fedora-tv-os-logout /usr/share/wayland-sessions/fedora-tv-os.desktop \
    /etc/fedora-tv-os || true
fi

if command -v update-desktop-database >/dev/null 2>&1; then
  update-desktop-database /usr/share/applications || true
fi

