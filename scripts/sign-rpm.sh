#!/usr/bin/bash
set -euo pipefail

PROJECT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
SIGNING_HOME=${FEDORA_TV_SIGNING_HOME:-}
RPM_SIGN_COMMAND=${FEDORA_TV_RPMSIGN:-}
if [[ -z "$SIGNING_HOME" || ! -d "$SIGNING_HOME" ]]; then
  printf 'Задайте FEDORA_TV_SIGNING_HOME с каталогом GnuPG ключа релиза.\n' >&2
  exit 2
fi
if [[ -z "$RPM_SIGN_COMMAND" ]]; then RPM_SIGN_COMMAND=$(command -v rpmsign || true); fi
if [[ -z "$RPM_SIGN_COMMAND" || ! -x "$RPM_SIGN_COMMAND" ]]; then
  printf 'Установите пакет rpm-sign или задайте FEDORA_TV_RPMSIGN.\n' >&2
  exit 2
fi

VERSION="$(node -p 'require(process.argv[1]).version' "$PROJECT_DIR/package.json")"
RPM_FILE="$PROJECT_DIR/dist/fedora-tv-os-${VERSION}-x86_64.rpm"
if [[ ! -f "$RPM_FILE" ]]; then
  printf 'RPM не найден: %s\n' "$RPM_FILE" >&2
  exit 1
fi

KEY_FINGERPRINT="$(gpg --homedir "$SIGNING_HOME" --batch --with-colons --list-secret-keys | awk -F: '$1 == "fpr" { print $10; exit }')"
if [[ -z "$KEY_FINGERPRINT" ]]; then
  printf 'В %s нет секретного ключа подписи.\n' "$SIGNING_HOME" >&2
  exit 1
fi

"$RPM_SIGN_COMMAND" --define "_gpg_name $KEY_FINGERPRINT" --define "_gpg_path $SIGNING_HOME" --addsign "$RPM_FILE"
VERIFY_DB=$(mktemp -d /tmp/fedora-tv-rpmdb.XXXXXX)
trap 'rm -rf "$VERIFY_DB"' EXIT
rpmkeys --dbpath "$VERIFY_DB" --import "$PROJECT_DIR/packaging/fedora-tv-os-release.asc"
SIGNATURE="$(rpmkeys --dbpath "$VERIFY_DB" --checksig --verbose "$RPM_FILE")"
printf '%s\n' "$SIGNATURE"
if ! grep -qi 'Signature.*: OK' <<< "$SIGNATURE"; then
  printf 'Проверка подписи RPM не пройдена.\n' >&2
  exit 1
fi
node "$PROJECT_DIR/scripts/update-release-metadata.js"
