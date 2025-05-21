#!/usr/bin/env bash
# Script: run-app.sh
# Description: Kill any process on dev server port and start the app without running tests
set -eo pipefail

# Default port from Vite config
PORT=8080

# Find and kill existing processes on PORT
PIDS=$(lsof -ti tcp:$PORT || true)
if [ -n "$PIDS" ]; then
  echo "Killing process(es) on port $PORT: $PIDS"
  kill -9 $PIDS
fi

echo "Starting development server on port $PORT..."
# Start dev server in background
npm run dev &
DEV_PID=$!

# Give server time to start and open in default browser
echo "Opening browser at http://localhost:$PORT..."
sleep 2
xdg-open "http://localhost:$PORT"

# Wait for dev server process to exit
wait $DEV_PID
