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
  /usr/libexec/fedora-tv-os-system-settings \
  /usr/share/wayland-sessions/fedora-tv-os.desktop \
  /usr/share/polkit-1/actions/os.fedoratv.system-settings.policy
rm -f /etc/systemd/logind.conf.d/90-fedora-tv-os.conf
rm -f /etc/pki/rpm-gpg/RPM-GPG-KEY-fedora-tv-os
rm -rf /etc/fedora-tv-os

# Не оставляем GDM с автоматическим входом в уже удалённую TV-сессию.
if [ -s /var/lib/fedora-tv-os/autologin-user ] && [ -f /etc/gdm/custom.conf ]; then
  TV_AUTLOGIN_USER=$(head -n 1 /var/lib/fedora-tv-os/autologin-user)
  CURRENT_AUTOLOGIN_USER=$(awk '
    /^[[:space:]]*\[daemon\][[:space:]]*$/ { in_daemon=1; next }
    /^[[:space:]]*\[/ { in_daemon=0; next }
    in_daemon && /^[[:space:]]*AutomaticLogin[[:space:]]*=/ {
      sub(/^[^=]*=[[:space:]]*/, ""); print; exit
    }
  ' /etc/gdm/custom.conf)
  if [ "$CURRENT_AUTOLOGIN_USER" = "$TV_AUTLOGIN_USER" ]; then
    GDM_TEMP=$(mktemp /tmp/fedora-tv-gdm-remove.XXXXXX)
    awk '
      /^[[:space:]]*\[daemon\][[:space:]]*$/ { in_daemon=1; print; next }
      /^[[:space:]]*\[/ { in_daemon=0; print; next }
      in_daemon && /^[[:space:]]*AutomaticLogin(Enable)?[[:space:]]*=/ { next }
      { print }
    ' /etc/gdm/custom.conf > "$GDM_TEMP"
    install -m 0644 "$GDM_TEMP" /etc/gdm/custom.conf
    rm -f "$GDM_TEMP"
  fi
fi
rm -rf /var/lib/fedora-tv-os

systemctl reload systemd-logind.service >/dev/null 2>&1 \
  || systemctl kill --kill-whom=main --signal=HUP systemd-logind.service >/dev/null 2>&1 \
  || true
