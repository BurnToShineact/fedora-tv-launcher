#!/usr/bin/bash
set -euo pipefail

usage() {
  cat <<'EOF'
Использование: sudo ./scripts/install-repositories.sh

Подключает RPM Fusion Free/Nonfree, Fedora Cisco OpenH264 и системный Flathub.
Повторный запуск безопасен.
EOF
}

if [[ ${1:-} == '-h' || ${1:-} == '--help' ]]; then
  usage
  exit 0
fi
if [[ $# -gt 0 ]]; then
  printf 'Неизвестный параметр: %s\n' "$1" >&2
  usage >&2
  exit 2
fi
if [[ ${EUID} -ne 0 ]]; then
  printf 'Запустите скрипт через sudo.\n' >&2
  exit 1
fi

# shellcheck disable=SC1091
source /etc/os-release
if [[ ${ID:-} != 'fedora' ]]; then
  printf 'Поддерживается только Fedora; обнаружена система: %s\n' "${PRETTY_NAME:-неизвестно}" >&2
  exit 1
fi

FEDORA_RELEASE="$(/usr/bin/rpm -E '%fedora')"
if [[ ! "$FEDORA_RELEASE" =~ ^[0-9]+$ ]]; then
  printf 'Не удалось определить версию Fedora: %s\n' "$FEDORA_RELEASE" >&2
  exit 1
fi

RPM_FUSION_FREE="https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-${FEDORA_RELEASE}.noarch.rpm"
RPM_FUSION_NONFREE="https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-${FEDORA_RELEASE}.noarch.rpm"

printf 'Подключаем RPM Fusion Free и Nonfree для Fedora %s…\n' "$FEDORA_RELEASE"
/usr/bin/dnf install -y "$RPM_FUSION_FREE" "$RPM_FUSION_NONFREE"

if /usr/bin/dnf repolist --all | /usr/bin/grep -q '^fedora-cisco-openh264'; then
  if ! /usr/bin/dnf config-manager enable fedora-cisco-openh264; then
    # Совместимость с DNF4 на поддерживаемых выпусках Fedora.
    /usr/bin/dnf config-manager --set-enabled fedora-cisco-openh264
  fi
else
  printf 'Репозиторий Fedora Cisco OpenH264 не найден. Проверьте пакет fedora-repos.\n' >&2
  exit 1
fi

/usr/bin/dnf install -y flatpak
/usr/bin/flatpak remote-add --system --if-not-exists \
  flathub https://dl.flathub.org/repo/flathub.flatpakrepo

printf 'Репозитории RPM Fusion, Cisco OpenH264 и Flathub готовы.\n'
