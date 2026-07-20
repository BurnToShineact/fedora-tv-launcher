#!/usr/bin/env bash
set -euo pipefail

if ! command -v node >/dev/null 2>&1; then
  echo "Устанавливаю Node.js и npm..."
  sudo dnf install -y nodejs npm
fi

cd "$(dirname "$0")/.."
npm install

echo
echo "Готово. Запуск: npm start"
echo "Тест в оконном режиме: npm run dev"
