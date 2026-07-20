#!/usr/bin/bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
  printf 'Запустите через sudo: sudo ./scripts/uninstall-system.sh\n' >&2
  exit 1
fi

/usr/bin/dnf remove -y fedora-tv-os

# Версии до 2.0.0 устанавливали файлы сессии вручную, вне RPM. Очистка
# нужна и для таких установок; для нового RPM эти команды безопасно повторны.
/usr/bin/rm -f /usr/libexec/fedora-tv-os-session \
  /usr/libexec/fedora-tv-os-home \
  /usr/libexec/fedora-tv-os-logout \
  /usr/share/wayland-sessions/fedora-tv-os.desktop
/usr/bin/rm -rf /etc/fedora-tv-os

printf 'TV-сессия удалена. Пользователь tv и его данные оставлены без изменений.\n'
