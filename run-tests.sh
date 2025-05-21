#!/usr/bin/env bash
# Script: run-tests.sh
# Description: Run Vitest in single-run mode (no watch)
# Usage: ./run-tests.sh [additional vitest args]
# If you invoke `npm test`, Vitest enters watch mode.
# Press 'q' to quit watch mode.

set -e

echo "Running Vitest in single-run mode..."
npx vitest run "$@"
RESULT=$?
if [[ $RESULT -eq 0 ]]; then
  echo "✔ All tests passed."
else
  echo "✖ Some tests failed."
fi
exit $RESULT
