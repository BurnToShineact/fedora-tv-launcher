#!/usr/bin/bash
set -eu

# During an RPM upgrade $1 is non-zero; the newly installed session must remain.
if [ "${1:-0}" -ne 0 ]; then
  exit 0
fi

if command -v update-alternatives >/dev/null 2>&1; then
  update-alternatives --remove fedora-tv-os '/opt/Fedora TV OS/fedora-tv-os' || true
else
  rm -f /usr/bin/fedora-tv-os
fi

rm -f /usr/libexec/fedora-tv-os-session \
  /usr/libexec/fedora-tv-os-startup \
  /usr/libexec/fedora-tv-os-home \
  /usr/libexec/fedora-tv-os-logout \
  /usr/share/wayland-sessions/fedora-tv-os.desktop
rm -rf /etc/fedora-tv-os
