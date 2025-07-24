from flask import Flask, request, jsonify, render_template, send_file
from werkzeug.utils import secure_filename
import os
import subprocess
import tempfile
import uuid
from datetime import datetime
import json

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['OUTPUT_FOLDER'] = 'outputs'

# Create necessary directories
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)

# Store conversation history
conversation_history = []

@app.route('/')
def index():
    """Serve the main page"""
    return render_template('index.html')

@app.route('/api/process-audio', methods=['POST'])
def process_audio():
    """Process audio file through ConSy"""
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        audio_file = request.files['audio']
        if audio_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Generate unique filenames
        session_id = str(uuid.uuid4())
        input_filename = f"input_{session_id}.wav"
        output_filename = f"output_{session_id}.wav"
        
        input_path = os.path.join(app.config['UPLOAD_FOLDER'], input_filename)
        output_path = os.path.join(app.config['OUTPUT_FOLDER'], output_filename)
        
        # Save uploaded file
        audio_file.save(input_path)
        
        # Process with ConSy
        cmd = [
            'python', 'main.py',
            '--input_audio', input_path,
            '--output_audio', output_path
        ]
        
        # Activate virtual environment and run ConSy
        env = os.environ.copy()
        env['PATH'] = f"/workspace/venv/bin:{env['PATH']}"
        
        result = subprocess.run(cmd, capture_output=True, text=True, env=env, cwd='/workspace')
        
        if result.returncode != 0:
            return jsonify({'error': f'ConSy processing failed: {result.stderr}'}), 500
        
        # Check if output file was created
        if not os.path.exists(output_path):
            return jsonify({'error': 'No output audio generated'}), 500
        
        # Add to conversation history
        conversation_entry = {
            'id': session_id,
            'timestamp': datetime.now().isoformat(),
            'input_file': input_filename,
            'output_file': output_filename,
            'status': 'completed'
        }
        conversation_history.append(conversation_entry)
        
        return jsonify({
            'success': True,
            'session_id': session_id,
            'output_url': f'/api/download/{output_filename}',
            'message': 'Audio processed successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/<filename>')
def download_file(filename):
    """Download processed audio file"""
    try:
        file_path = os.path.join(app.config['OUTPUT_FOLDER'], filename)
        if os.path.exists(file_path):
            return send_file(file_path, as_attachment=True)
        else:
            return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/history')
def get_history():
    """Get conversation history"""
    return jsonify({'history': conversation_history})

@app.route('/api/clear-history', methods=['POST'])
def clear_history():
    """Clear conversation history"""
    global conversation_history
    conversation_history = []
    
    # Clean up files
    for folder in [app.config['UPLOAD_FOLDER'], app.config['OUTPUT_FOLDER']]:
        for filename in os.listdir(folder):
            file_path = os.path.join(folder, filename)
            if os.path.isfile(file_path):
                os.remove(file_path)
    
    return jsonify({'success': True, 'message': 'History cleared'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)