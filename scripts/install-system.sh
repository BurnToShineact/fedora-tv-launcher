#!/usr/bin/bash
set -euo pipefail

if [[ ${EUID} -ne 0 ]]; then
  printf 'Запустите через sudo: sudo ./scripts/install-system.sh tv\n' >&2
  exit 1
fi

TV_USER="${1:-tv}"
if [[ ! "$TV_USER" =~ ^[a-z_][a-z0-9_-]{0,30}$ ]]; then
  printf 'Недопустимое имя пользователя: %s\n' "$TV_USER" >&2
  exit 1
fi

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
VERSION="$(node -p 'require(process.argv[1]).version' "$PROJECT_DIR/package.json")"
RPM_FILE="$PROJECT_DIR/dist/fedora-tv-os-${VERSION}-x86_64.rpm"

if [[ ! -f "$RPM_FILE" ]]; then
  printf 'Сначала соберите RPM командой: ./scripts/build.sh\n' >&2
  exit 1
fi

/usr/bin/dnf install -y labwc wlrctl flatpak polkit lxqt-policykit "$RPM_FILE"

if [[ ! -x /usr/libexec/fedora-tv-os-session || ! -f /usr/share/wayland-sessions/fedora-tv-os.desktop ]]; then
  printf 'RPM установлен, но Wayland-сессия не зарегистрирована. Проверьте журнал установки пакета.\n' >&2
  exit 1
fi

if ! /usr/bin/id "$TV_USER" >/dev/null 2>&1; then
  /usr/sbin/useradd --create-home --shell /bin/bash --comment 'Fedora TV' "$TV_USER"
  printf '\nСоздан пользователь %s. Пароль можно задать командой: sudo passwd %s\n' "$TV_USER" "$TV_USER"
else
  printf 'Пользователь %s уже существует — его данные не изменены.\n' "$TV_USER"
fi

# GDM remembers the last desktop per user. Without this, a user who has once
# entered GNOME will keep getting GNOME even though Fedora TV OS is installed.
TV_UID="$(/usr/bin/id -u "$TV_USER")"
ACCOUNTS_PATH="/org/freedesktop/Accounts/User${TV_UID}"
if ! /usr/bin/busctl --system call org.freedesktop.Accounts "$ACCOUNTS_PATH" \
  org.freedesktop.Accounts.User SetSession s fedora-tv-os >/dev/null; then
  printf 'Не удалось назначить Fedora TV OS сессией пользователя %s.\n' "$TV_USER" >&2
  exit 1
fi
/usr/bin/busctl --system call org.freedesktop.Accounts "$ACCOUNTS_PATH" \
  org.freedesktop.Accounts.User SetSessionType s wayland >/dev/null

printf '\nFedora TV OS установлена и назначена основной оболочкой пользователя %s.\n' "$TV_USER"
printf 'Полностью завершите уже открытый сеанс %s, затем войдите снова.\n' "$TV_USER"
printf 'GNOME пользователя vadim не изменён. Автоматический вход намеренно не включён.\n'
