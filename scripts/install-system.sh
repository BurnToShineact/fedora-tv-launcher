#!/usr/bin/bash
set -euo pipefail

usage() {
  cat <<'EOF'
Использование:
  sudo ./scripts/install-system.sh [пользователь] [параметры]

Параметры:
  --password-stdin    прочитать пароль из первой строки стандартного ввода
  --reset-password   запросить и заменить пароль существующего пользователя
  --no-autologin     оставить экран выбора пользователей GDM
  --allow-unsigned   разрешить только локальную тестовую сборку без RPM-подписи
  --skip-repositories не подключать RPM Fusion, Cisco OpenH264 и Flathub
  --skip-codecs      не устанавливать мультимедийные кодеки и VA-API-драйверы
  -h, --help          показать эту справку

По умолчанию создаётся пользователь tv. Для нового пользователя установщик
безопасно запрашивает пароль и его подтверждение в терминале.
EOF
}

TV_USER='tv'
TV_USER_WAS_SET=0
PASSWORD_OPTION=''
INSTALL_REPOSITORIES=1
INSTALL_CODECS=1
ENABLE_AUTOLOGIN=1
ALLOW_UNSIGNED=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --password-stdin)
      if [[ -n "$PASSWORD_OPTION" ]]; then
        printf 'Параметры способа задания пароля нельзя объединять.\n' >&2
        exit 2
      fi
      PASSWORD_OPTION='--password-stdin'
      ;;
    --reset-password)
      if [[ -n "$PASSWORD_OPTION" ]]; then
        printf 'Параметры способа задания пароля нельзя объединять.\n' >&2
        exit 2
      fi
      PASSWORD_OPTION='--reset-password'
      ;;
    --skip-repositories)
      INSTALL_REPOSITORIES=0
      ;;
    --skip-codecs)
      INSTALL_CODECS=0
      ;;
    --no-autologin)
      ENABLE_AUTOLOGIN=0
      ;;
    --allow-unsigned)
      ALLOW_UNSIGNED=1
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --)
      shift
      if [[ $# -gt 1 || ($# -eq 1 && $TV_USER_WAS_SET -eq 1) ]]; then
        printf 'Можно указать только одного пользователя.\n' >&2
        exit 2
      fi
      if [[ $# -eq 1 ]]; then
        TV_USER="$1"
        TV_USER_WAS_SET=1
        shift
      fi
      break
      ;;
    -*)
      printf 'Неизвестный параметр: %s\n' "$1" >&2
      usage >&2
      exit 2
      ;;
    *)
      if [[ $TV_USER_WAS_SET -eq 1 ]]; then
        printf 'Можно указать только одного пользователя.\n' >&2
        exit 2
      fi
      TV_USER="$1"
      TV_USER_WAS_SET=1
      ;;
  esac
  shift
done

if [[ $# -gt 0 ]]; then
  printf 'Лишние аргументы: %s\n' "$*" >&2
  exit 2
fi

if [[ ${EUID} -ne 0 ]]; then
  printf 'Запустите через sudo: sudo ./scripts/install-system.sh tv\n' >&2
  exit 1
fi

if [[ ! "$TV_USER" =~ ^[a-z_][a-z0-9_-]{0,30}$ ]]; then
  printf 'Недопустимое имя пользователя: %s\n' "$TV_USER" >&2
  exit 1
fi
if /usr/bin/id "$TV_USER" >/dev/null 2>&1; then
  EXISTING_UID="$(/usr/bin/id -u "$TV_USER")"
  UID_MIN="$(/usr/bin/awk '$1 == "UID_MIN" { print $2; exit }' /etc/login.defs)"
  UID_MIN="${UID_MIN:-1000}"
  if [[ ! "$UID_MIN" =~ ^[0-9]+$ || "$EXISTING_UID" -lt "$UID_MIN" ]]; then
    printf 'Существующая учётная запись %s является системной; использовать её для TV-сессии нельзя.\n' "$TV_USER" >&2
    exit 2
  fi
fi

# Считываем пароль до запуска DNF/Flatpak: ни одна дочерняя команда установки
# не должна случайно забрать строку из stdin, предназначенную для chpasswd.
TV_PASSWORD=''
if [[ "$PASSWORD_OPTION" == '--password-stdin' ]]; then
  if ! IFS= read -r TV_PASSWORD; then
    printf 'Не удалось прочитать пароль из стандартного ввода.\n' >&2
    exit 2
  fi
  if [[ -z "$TV_PASSWORD" ]]; then
    printf 'Пароль не может быть пустым.\n' >&2
    exit 2
  fi
  trap 'unset TV_PASSWORD' EXIT
fi

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
SCRIPT_DIR="$PROJECT_DIR/scripts"
VERSION="$(node -p 'require(process.argv[1]).version' "$PROJECT_DIR/package.json")"
RPM_FILE="$PROJECT_DIR/dist/fedora-tv-os-${VERSION}-x86_64.rpm"
RELEASE_KEY="$PROJECT_DIR/packaging/fedora-tv-os-release.asc"

if [[ ! -f "$RPM_FILE" ]]; then
  printf 'Сначала соберите RPM командой: ./scripts/build.sh\n' >&2
  exit 1
fi

if [[ $ALLOW_UNSIGNED -eq 0 && -f "$RELEASE_KEY" ]]; then
  /usr/bin/rpmkeys --import "$RELEASE_KEY"
fi

if [[ $ALLOW_UNSIGNED -eq 1 ]]; then
  printf 'ВНИМАНИЕ: устанавливается неподписанная локальная тестовая сборка.\n' >&2
  /usr/bin/dnf install -y --setopt=localpkg_gpgcheck=False labwc wlrctl wlr-randr flatpak polkit lxqt-policykit libcec "$RPM_FILE"
else
  /usr/bin/dnf install -y --setopt=localpkg_gpgcheck=True labwc wlrctl wlr-randr flatpak polkit lxqt-policykit libcec "$RPM_FILE"
fi

if [[ ! -x /usr/libexec/fedora-tv-os-session || ! -f /usr/share/wayland-sessions/fedora-tv-os.desktop ]]; then
  printf 'RPM установлен, но Wayland-сессия не зарегистрирована. Проверьте журнал установки пакета.\n' >&2
  exit 1
fi

if [[ $INSTALL_REPOSITORIES -eq 1 ]]; then
  /usr/bin/bash "$SCRIPT_DIR/install-repositories.sh"
fi
if [[ $INSTALL_CODECS -eq 1 ]]; then
  if [[ $INSTALL_REPOSITORIES -eq 0 ]] && ! /usr/bin/rpm -q rpmfusion-free-release rpmfusion-nonfree-release >/dev/null 2>&1; then
    printf 'Кодеки требуют RPM Fusion. Уберите --skip-repositories или также добавьте --skip-codecs.\n' >&2
    exit 1
  fi
  /usr/bin/bash "$SCRIPT_DIR/install-codecs.sh"
fi

USER_ARGS=("$TV_USER")
if [[ "$PASSWORD_OPTION" == '--password-stdin' ]]; then
  printf '%s\n' "$TV_PASSWORD" | /usr/bin/bash "$SCRIPT_DIR/create-tv-user.sh" "$TV_USER" --password-stdin
  unset TV_PASSWORD
else
  if [[ -n "$PASSWORD_OPTION" ]]; then
    USER_ARGS+=("$PASSWORD_OPTION")
  fi
  /usr/bin/bash "$SCRIPT_DIR/create-tv-user.sh" "${USER_ARGS[@]}"
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

if [[ $ENABLE_AUTOLOGIN -eq 1 ]]; then
  /usr/libexec/fedora-tv-os-system-settings autologin enable "$TV_USER"
fi

printf '\nFedora TV OS установлена и назначена основной оболочкой пользователя %s.\n' "$TV_USER"
printf 'Полностью завершите уже открытый сеанс %s, затем войдите снова.\n' "$TV_USER"
if [[ $ENABLE_AUTOLOGIN -eq 1 ]]; then
  printf 'При следующем включении TV-сессия запустится автоматически без экрана выбора пользователей.\n'
fi
if [[ $INSTALL_REPOSITORIES -eq 1 && $INSTALL_CODECS -eq 1 ]]; then
  printf 'RPM Fusion, OpenH264, Flathub и мультимедийные кодеки готовы.\n'
fi
printf 'Другие пользователи и их GNOME-сессии не изменены.\n'
