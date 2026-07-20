#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Использование: ./scripts/configure-github.sh ИМЯ_GITHUB [РЕПОЗИТОРИЙ]"
  exit 1
fi

OWNER="$1"
REPO="${2:-fedora-tv-launcher}"
node - "$OWNER" "$REPO" <<'NODE'
const fs = require('fs');
const owner = process.argv[2];
const repo = process.argv[3];
const file = 'package.json';
const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
pkg.build.publish = [{ provider: 'github', owner, repo, releaseType: 'release' }];
fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n');
console.log(`GitHub Releases настроен: ${owner}/${repo}`);
NODE
