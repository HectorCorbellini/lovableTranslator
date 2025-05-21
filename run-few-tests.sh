#!/usr/bin/env bash
# Script: run-few-tests.sh
# Description: Run only key strategic tests
# Usage: ./run-few-tests.sh

set -e

echo "Running strategic tests..."

npx vitest run \
  src/__tests__/SourceTextArea.test.tsx \
  src/__tests__/TranslationHeader.test.tsx \
  src/__tests__/TranslatedTextArea.test.tsx
RESULT=$?
if [[ $RESULT -eq 0 ]]; then
  echo "✔ Strategic tests passed."
else
  echo "✖ Some strategic tests failed."
fi
exit $RESULT
