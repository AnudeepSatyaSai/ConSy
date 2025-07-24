#!/bin/bash

# ConSy Web Application Startup Script
echo "🤖 Starting ConSy Web Application..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Please run setup first."
    echo "Run: python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt && pip install flask"
    exit 1
fi

# Activate virtual environment
echo "📦 Activating virtual environment..."
source venv/bin/activate

# Check if Flask is installed
if ! python -c "import flask" 2>/dev/null; then
    echo "📦 Installing Flask..."
    pip install flask
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p uploads outputs

# Check if ConSy dependencies are available
echo "🔍 Checking ConSy dependencies..."
if ! python -c "import whisper, transformers, edge_tts, soundfile, numpy, torch, webrtcvad, nest_asyncio" 2>/dev/null; then
    echo "❌ ConSy dependencies not found. Installing..."
    pip install -r requirements.txt
fi

# Start the web application
echo "🚀 Starting ConSy Web Interface..."
echo "📱 Open your browser and go to: http://localhost:5000"
echo "🛑 Press Ctrl+C to stop the server"
echo ""

python app.py