#!/usr/bin/env bash
set -euo pipefail
if [[ $# -ne 1 ]]; then
  echo "Использование: ./scripts/bump-version.sh 0.2.1"
  exit 1
fi
VERSION="$1"
npm version "$VERSION" --no-git-tag-version
echo "Версия изменена на $VERSION. Сделайте commit и отправьте тег v$VERSION."
