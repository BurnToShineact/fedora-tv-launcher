#!/usr/bin/bash
set -euo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
VERSION="$(node -p 'require(process.argv[1]).version' "$PROJECT_DIR/package.json")"
RPM_FILE=${1:-"$PROJECT_DIR/dist/fedora-tv-os-${VERSION}-x86_64.rpm"}

if [[ ! -f "$RPM_FILE" ]]; then
  printf 'RPM не найден: %s\n' "$RPM_FILE" >&2
  exit 1
fi

mapfile -t IDENTITY < <(rpm -qp --queryformat '%{NAME}\n%{VERSION}\n%{ARCH}\n' "$RPM_FILE")
if [[ ${IDENTITY[0]:-} != fedora-tv-os || ${IDENTITY[1]:-} != "$VERSION" || ${IDENTITY[2]:-} != x86_64 ]]; then
  printf 'Некорректная идентичность RPM: %s %s %s\n' "${IDENTITY[0]:-?}" "${IDENTITY[1]:-?}" "${IDENTITY[2]:-?}" >&2
  exit 1
fi

PAYLOAD="$(rpm -qpl "$RPM_FILE")"
REQUIRED_PATHS=(
  '/opt/Fedora TV OS/fedora-tv-os'
  '/opt/Fedora TV OS/resources/release-key.asc'
  '/opt/Fedora TV OS/resources/tv-session/fedora-tv-os-session'
  '/opt/Fedora TV OS/resources/tv-session/fedora-tv-os-startup'
  '/opt/Fedora TV OS/resources/tv-session/fedora-tv-os-system-settings'
  '/opt/Fedora TV OS/resources/tv-session/labwc/rc.xml'
)
for required_path in "${REQUIRED_PATHS[@]}"; do
  if ! grep -Fqx "$required_path" <<< "$PAYLOAD"; then
    printf 'В RPM отсутствует обязательный файл: %s\n' "$required_path" >&2
    exit 1
  fi
done

SCRIPTS="$(rpm -qp --scripts "$RPM_FILE")"
if ! grep -Fq 'fedora-tv-os-session' <<< "$SCRIPTS"; then
  printf 'В RPM отсутствует сценарий регистрации TV-сессии.\n' >&2
  exit 1
fi

printf 'RPM проверен: fedora-tv-os %s (%s), обязательные файлы и install hook на месте.\n' "$VERSION" "${IDENTITY[2]}"
