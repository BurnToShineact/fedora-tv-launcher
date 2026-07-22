#!/usr/bin/bash
set -euo pipefail

usage() {
  cat <<'EOF'
Использование:
  sudo ./scripts/create-tv-user.sh [пользователь] [параметры]

Параметры:
  --password-stdin  прочитать пароль из первой строки стандартного ввода
  --reset-password запросить и заменить пароль существующего пользователя
  -h, --help        показать эту справку

Для нового пользователя пароль запрашивается интерактивно. Пароль существующего
пользователя без --reset-password или --password-stdin не изменяется.
EOF
}

TV_USER='tv'
TV_USER_WAS_SET=0
PASSWORD_MODE='auto'

while [[ $# -gt 0 ]]; do
  case "$1" in
    --password-stdin)
      if [[ "$PASSWORD_MODE" != 'auto' ]]; then
        printf 'Параметры способа задания пароля нельзя объединять.\n' >&2
        exit 2
      fi
      PASSWORD_MODE='stdin'
      ;;
    --reset-password)
      if [[ "$PASSWORD_MODE" != 'auto' ]]; then
        printf 'Параметры способа задания пароля нельзя объединять.\n' >&2
        exit 2
      fi
      PASSWORD_MODE='prompt'
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
  printf 'Запустите скрипт через sudo.\n' >&2
  exit 1
fi

if [[ ! "$TV_USER" =~ ^[a-z_][a-z0-9_-]{0,30}$ ]]; then
  printf 'Недопустимое имя пользователя: %s\n' "$TV_USER" >&2
  exit 2
fi

USER_EXISTS=0
if /usr/bin/id "$TV_USER" >/dev/null 2>&1; then
  USER_EXISTS=1
  USER_UID="$(/usr/bin/id -u "$TV_USER")"
  UID_MIN="$(/usr/bin/awk '$1 == "UID_MIN" { print $2; exit }' /etc/login.defs)"
  UID_MIN="${UID_MIN:-1000}"
  if [[ ! "$UID_MIN" =~ ^[0-9]+$ || "$USER_UID" -lt "$UID_MIN" ]]; then
    printf 'Существующая учётная запись %s является системной; использовать её для TV-сессии нельзя.\n' "$TV_USER" >&2
    exit 2
  fi
fi

if [[ "$PASSWORD_MODE" == 'auto' ]]; then
  if [[ $USER_EXISTS -eq 1 ]]; then
    PASSWORD_MODE='keep'
  else
    PASSWORD_MODE='prompt'
  fi
fi

TV_PASSWORD=''
TV_PASSWORD_CONFIRM=''
trap 'unset TV_PASSWORD TV_PASSWORD_CONFIRM' EXIT

if [[ "$PASSWORD_MODE" == 'stdin' ]]; then
  if ! IFS= read -r TV_PASSWORD; then
    printf 'Не удалось прочитать пароль из стандартного ввода.\n' >&2
    exit 2
  fi
  if [[ -z "$TV_PASSWORD" ]]; then
    printf 'Пароль не может быть пустым.\n' >&2
    exit 2
  fi
elif [[ "$PASSWORD_MODE" == 'prompt' ]]; then
  if [[ ! -r /dev/tty || ! -w /dev/tty ]]; then
    printf 'Нет интерактивного терминала. Передайте пароль через --password-stdin.\n' >&2
    exit 2
  fi

  while true; do
    printf 'Пароль пользователя %s: ' "$TV_USER" >/dev/tty
    IFS= read -r -s TV_PASSWORD </dev/tty
    printf '\nПовторите пароль: ' >/dev/tty
    IFS= read -r -s TV_PASSWORD_CONFIRM </dev/tty
    printf '\n' >/dev/tty

    if [[ -z "$TV_PASSWORD" ]]; then
      printf 'Пароль не может быть пустым. Повторите ввод.\n' >/dev/tty
    elif [[ "$TV_PASSWORD" != "$TV_PASSWORD_CONFIRM" ]]; then
      printf 'Пароли не совпадают. Повторите ввод.\n' >/dev/tty
    else
      break
    fi
  done
fi

if [[ $USER_EXISTS -eq 0 ]]; then
  /usr/sbin/useradd --create-home --shell /bin/bash --comment 'Fedora TV' "$TV_USER"
  printf 'Создан отдельный непривилегированный пользователь %s.\n' "$TV_USER"
else
  printf 'Пользователь %s уже существует.\n' "$TV_USER"
fi

if [[ "$PASSWORD_MODE" == 'stdin' || "$PASSWORD_MODE" == 'prompt' ]]; then
  printf '%s:%s\n' "$TV_USER" "$TV_PASSWORD" | /usr/sbin/chpasswd
  printf 'Пароль пользователя %s установлен.\n' "$TV_USER"
elif [[ "$PASSWORD_MODE" == 'keep' ]]; then
  printf 'Его пароль не изменён; для замены используйте --reset-password.\n'
fi
