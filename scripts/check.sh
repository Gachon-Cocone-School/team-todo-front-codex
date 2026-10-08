#!/usr/bin/env bash
set -euo pipefail

printf '\n%s\n' '== Lint =='
npm run lint

printf '\n%s\n' '== Format =='
npm run format:check

printf '\n%s\n' '== Type check =='
npm run typecheck

printf '\n%s\n' '== Tests =='
npm test

if [[ -d app || -d src/app ]]; then
  printf '\n%s\n' '== Production build =='
  npm run build
else
  printf '\n%s\n' '== Production build skipped: App Router source directory does not exist yet =='
fi
