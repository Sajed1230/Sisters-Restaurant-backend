#!/bin/bash
# Script to kill process on port 3001

PORT=3001

echo "🔍 Looking for processes on port $PORT..."

PID=$(lsof -ti:$PORT)

if [ -z "$PID" ]; then
    echo "✅ No process found on port $PORT"
    exit 0
fi

echo "⚠️  Found process(es): $PID"
echo "🛑 Killing process(es)..."
kill -9 $PID 2>/dev/null || pkill -f "node.*server.js"

sleep 1

if lsof -ti:$PORT > /dev/null 2>&1; then
    echo "❌ Failed to kill process on port $PORT"
    exit 1
else
    echo "✅ Port $PORT is now free"
    exit 0
fi


