#!/bin/bash
# Script to start the server and keep it running

cd "$(dirname "$0")"

echo "🚀 Starting Sisters Restaurant Backend Server..."
echo "📍 Port: 3003"
echo "📊 Dashboard: http://localhost:3003/dashboard"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the server
npm start


