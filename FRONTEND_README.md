# ConSy Frontend - Web Interface

A modern, responsive web interface for the ConSy (Conversational AI Assistant) system.

## Features

### 🎤 Audio Input
- **File Upload**: Drag and drop or browse for audio files
- **Live Recording**: Record audio directly from your microphone
- **Audio Preview**: Preview uploaded/recorded audio before processing

### 🤖 ConSy Integration
- **Real-time Processing**: Process audio through the ConSy backend
- **Progress Tracking**: Visual feedback during processing
- **Response Playback**: Play and download ConSy responses

### 📚 Conversation History
- **Session Management**: Track all conversations with timestamps
- **Audio Storage**: Access previous responses
- **History Management**: Clear conversation history when needed

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Intuitive Interface**: Clean, modern design with smooth animations
- **Error Handling**: User-friendly error messages and modals
- **Accessibility**: Keyboard navigation and screen reader support

## Installation & Setup

### Prerequisites
- Python 3.7+
- ConSy backend system (see main README.md)
- Modern web browser with microphone support

### Installation
1. Install Flask dependencies:
   ```bash
   source venv/bin/activate
   pip install flask
   ```

2. Start the web server:
   ```bash
   python app.py
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Usage

### Upload Audio File
1. Click "Browse Files" or drag and drop an audio file
2. Preview the audio using the built-in player
3. Click "Process with ConSy" to send to the AI

### Record Audio
1. Click "Record Audio" button
2. Allow microphone permissions when prompted
3. Click "Start Recording" and speak your message
4. Click "Stop Recording" when finished
5. Preview and process the recorded audio

### View Results
- ConSy's response will appear as an audio player
- Download the response using the "Download Response" button
- Start a new conversation with "New Conversation" button

### Manage History
- View all previous conversations in the History section
- Each entry shows timestamp and playable response audio
- Clear all history using "Clear History" button

## API Endpoints

### POST /api/process-audio
Process an audio file through ConSy
- **Body**: FormData with 'audio' file
- **Response**: JSON with success status and output URL

### GET /api/download/{filename}
Download a processed audio response
- **Response**: Audio file (WAV format)

### GET /api/history
Get conversation history
- **Response**: JSON array of conversation entries

### POST /api/clear-history
Clear all conversation history
- **Response**: JSON success confirmation

## File Structure

```
/
├── app.py                 # Flask application
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css     # Styles and animations
│   └── js/
│       └── app.js        # Frontend JavaScript logic
├── uploads/              # Temporary audio uploads
└── outputs/              # Processed audio responses
```

## Browser Compatibility

- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

### Required Browser Features
- HTML5 Audio API
- MediaRecorder API (for recording)
- File API (for drag and drop)
- Fetch API (for AJAX requests)

## Security Features

- File type validation (audio files only)
- File size limits (16MB maximum)
- Secure filename handling
- CSRF protection ready
- Input sanitization

## Customization

### Styling
Edit `static/css/style.css` to customize the appearance:
- Color scheme variables at the top
- Responsive breakpoints
- Animation timings

### Functionality
Modify `static/js/app.js` to add features:
- Additional audio formats
- Custom recording settings
- Enhanced error handling

## Troubleshooting

### Common Issues

**Microphone not working:**
- Ensure browser has microphone permissions
- Check browser security settings
- Use HTTPS for production deployments

**Audio upload fails:**
- Check file format (WAV, MP3, etc.)
- Verify file size under 16MB
- Ensure ConSy backend is running

**Processing errors:**
- Check ConSy backend logs
- Verify all dependencies are installed
- Ensure sufficient disk space

### Debug Mode
Set `debug=True` in `app.py` for detailed error messages during development.

## Performance

- **File Processing**: Handled asynchronously
- **Memory Usage**: Files cleaned up after processing
- **Network**: Optimized for minimal bandwidth usage
- **Storage**: Temporary files auto-cleaned

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This frontend is part of the ConSy project and follows the same licensing terms.