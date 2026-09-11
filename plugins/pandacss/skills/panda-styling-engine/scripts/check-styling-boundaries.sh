#!/usr/bin/env bash
set -euo pipefail

if [[ $# -eq 0 ]]; then
  printf 'usage: %s <source-file-or-directory> [...]\n' "$0" >&2
  exit 2
fi

patterns=(
  '(^|[^[:alnum:]_])css[[:space:]]*[(]'
  'style[[:space:]]*=[[:space:]]*[{][[:space:]]*[{]'
  'tailwind(css|-merge|-variants)?'
  '(class-variance-authority|clsx)'
  '(^|[^[:alnum:]_])(twMerge|cn)[[:space:]]*[(]'
)

status=0
for pattern in "${patterns[@]}"; do
  if rg --line-number --color never \
    --glob '!node_modules/**' \
    --glob '!dist/**' \
    --glob '!build/**' \
    --glob '!styled-system/**' \
    --glob '!*.min.*' \
    --regexp "$pattern" "$@"; then
    status=1
  fi
done

if [[ $status -ne 0 ]]; then
  printf '\nStyling boundary check failed. Route each finding through generated JSX, patterns, recipes, slot recipes, tokens, or named styles.\n' >&2
  exit 1
fi

printf 'Styling boundary check passed.\n'
