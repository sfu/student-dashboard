#!/bin/bash
IFS=$'\n'
changed=($(git --no-pager diff --cached --name-only --diff-filter=ACMR | grep \\.js$))

if [ ${#changed[@]} -gt 0 ]; then
  node_modules/.bin/eslint -c .eslintrc $changed
fi
