#!/usr/bin/bash
set -euo pipefail

usage() {
  cat <<'EOF'
Использование: sudo ./scripts/install-codecs.sh

Устанавливает полный FFmpeg, плагины GStreamer, OpenH264, aptX и средства
VA-API. Для Intel и AMD автоматически добавляет подходящие полные VA-API-драйверы.
Сначала должен быть выполнен install-repositories.sh.
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
if ! /usr/bin/rpm -q rpmfusion-free-release rpmfusion-nonfree-release >/dev/null 2>&1; then
  printf 'Сначала подключите репозитории: sudo ./scripts/install-repositories.sh\n' >&2
  exit 1
fi

printf 'Устанавливаем мультимедийную группу Fedora/RPM Fusion…\n'
/usr/bin/dnf group install -y --allowerasing multimedia

# ffmpeg из RPM Fusion заменяет ограниченный ffmpeg-free Fedora. Остальные
# пакеты закрывают нативные приложения на GStreamer, Bluetooth aptX и диагностику
# аппаратного декодирования. Chromium/Electron поставляет собственный FFmpeg.
/usr/bin/dnf install -y --allowerasing \
  ffmpeg \
  gstreamer1-plugin-libav \
  gstreamer1-plugin-openh264 \
  gstreamer1-plugins-bad-freeworld \
  gstreamer1-plugins-ugly \
  libva-utils \
  mozilla-openh264 \
  pipewire-codec-aptx

has_gpu_vendor() {
  local expected="$1"
  local vendor_file
  local detected

  for vendor_file in /sys/class/drm/card*/device/vendor; do
    [[ -r "$vendor_file" ]] || continue
    IFS= read -r detected <"$vendor_file"
    if [[ "${detected,,}" == "$expected" ]]; then
      return 0
    fi
  done
  return 1
}

if has_gpu_vendor '0x8086'; then
  printf 'Обнаружена графика Intel: устанавливаем полный VA-API-драйвер…\n'
  /usr/bin/dnf install -y --allowerasing intel-media-driver libva-intel-driver
fi

if has_gpu_vendor '0x1002'; then
  printf 'Обнаружена графика AMD: устанавливаем Mesa VA-API Freeworld…\n'
  /usr/bin/dnf install -y --allowerasing mesa-va-drivers-freeworld
fi

if has_gpu_vendor '0x10de'; then
  printf 'Обнаружена графика NVIDIA. Проприетарный драйвер автоматически не устанавливается: его версия зависит от модели GPU.\n'
fi

printf 'Кодеки и компоненты аппаратного декодирования установлены.\n'
