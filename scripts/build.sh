#!/usr/bin/bash
set -euo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

if ! command -v rpmbuild >/dev/null 2>&1 || ! ldconfig -p 2>/dev/null | grep -q 'libcrypt.so.1'; then
  printf 'Не хватает средств сборки. Один раз выполните:\n  sudo dnf install rpm-build libxcrypt-compat\n' >&2
  exit 1
fi

npm install
npm run check
bash -n packaging/*.sh scripts/*.sh session/fedora-tv-os-*
npm run build:rpm

if [[ -n ${FEDORA_TV_SIGNING_HOME:-} ]]; then
  /usr/bin/bash "$PROJECT_DIR/scripts/sign-rpm.sh"
else
  printf 'Сборка не подписана. Для релизного RPM задайте FEDORA_TV_SIGNING_HOME.\n' >&2
fi

VERSION="$(node -p 'require("./package.json").version')"
printf 'RPM готов: %s/dist/fedora-tv-os-%s-x86_64.rpm\n' "$PROJECT_DIR" "$VERSION"
