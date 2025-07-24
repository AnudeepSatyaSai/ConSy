class ConSyApp {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.currentAudioBlob = null;
        this.downloadUrl = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadHistory();
    }

    initializeElements() {
        // File input elements
        this.audioFile = document.getElementById('audioFile');
        this.uploadArea = document.getElementById('uploadArea');
        this.browseBtn = document.getElementById('browseBtn');
        
        // Recording elements
        this.recordBtn = document.getElementById('recordBtn');
        this.recordingInterface = document.getElementById('recordingInterface');
        this.startRecord = document.getElementById('startRecord');
        this.stopRecord = document.getElementById('stopRecord');
        this.cancelRecord = document.getElementById('cancelRecord');
        this.recordingStatus = document.getElementById('recordingStatus');
        
        // Preview elements
        this.audioPreview = document.getElementById('audioPreview');
        this.previewAudio = document.getElementById('previewAudio');
        this.processBtn = document.getElementById('processBtn');
        this.clearBtn = document.getElementById('clearBtn');
        
        // Status elements
        this.statusSection = document.getElementById('statusSection');
        this.statusTitle = document.getElementById('statusTitle');
        this.statusMessage = document.getElementById('statusMessage');
        this.progressFill = document.getElementById('progressFill');
        
        // Results elements
        this.resultsSection = document.getElementById('resultsSection');
        this.resultAudio = document.getElementById('resultAudio');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.newConversationBtn = document.getElementById('newConversationBtn');
        
        // History elements
        this.historyContent = document.getElementById('historyContent');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        
        // Error modal
        this.errorModal = document.getElementById('errorModal');
        this.errorMessage = document.getElementById('errorMessage');
        this.closeError = document.getElementById('closeError');
    }

    bindEvents() {
        // File upload events
        this.browseBtn.addEventListener('click', () => this.audioFile.click());
        this.audioFile.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Drag and drop events
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        this.uploadArea.addEventListener('click', () => this.audioFile.click());
        
        // Recording events
        this.recordBtn.addEventListener('click', () => this.showRecordingInterface());
        this.startRecord.addEventListener('click', () => this.startRecording());
        this.stopRecord.addEventListener('click', () => this.stopRecording());
        this.cancelRecord.addEventListener('click', () => this.cancelRecording());
        
        // Preview events
        this.processBtn.addEventListener('click', () => this.processAudio());
        this.clearBtn.addEventListener('click', () => this.clearAudio());
        
        // Results events
        this.downloadBtn.addEventListener('click', () => this.downloadResult());
        this.newConversationBtn.addEventListener('click', () => this.startNewConversation());
        
        // History events
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        
        // Error modal events
        this.closeError.addEventListener('click', () => this.closeErrorModal());
        this.errorModal.addEventListener('click', (e) => {
            if (e.target === this.errorModal) this.closeErrorModal();
        });
    }

    // File handling methods
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.loadAudioFile(file);
        }
    }

    handleDragOver(event) {
        event.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(event) {
        event.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(event) {
        event.preventDefault();
        this.uploadArea.classList.remove('dragover');
        
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('audio/')) {
                this.loadAudioFile(file);
            } else {
                this.showError('Please select an audio file.');
            }
        }
    }

    loadAudioFile(file) {
        const url = URL.createObjectURL(file);
        this.previewAudio.src = url;
        this.currentAudioBlob = file;
        this.showAudioPreview();
    }

    // Recording methods
    showRecordingInterface() {
        this.uploadArea.style.display = 'none';
        this.recordingInterface.style.display = 'block';
    }

    async startRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                const url = URL.createObjectURL(audioBlob);
                this.previewAudio.src = url;
                this.currentAudioBlob = audioBlob;
                this.showAudioPreview();
                this.hideRecordingInterface();
            };

            this.mediaRecorder.start();
            this.startRecord.style.display = 'none';
            this.stopRecord.style.display = 'inline-flex';
            this.recordingStatus.textContent = 'Recording... Click stop when finished.';
            
        } catch (error) {
            this.showError('Could not access microphone. Please ensure microphone permissions are granted.');
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
    }

    cancelRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
        this.hideRecordingInterface();
    }

    hideRecordingInterface() {
        this.recordingInterface.style.display = 'none';
        this.uploadArea.style.display = 'block';
        this.startRecord.style.display = 'inline-flex';
        this.stopRecord.style.display = 'none';
        this.recordingStatus.textContent = '';
    }

    // Preview methods
    showAudioPreview() {
        this.audioPreview.style.display = 'block';
        this.uploadArea.style.display = 'none';
        this.recordingInterface.style.display = 'none';
    }

    clearAudio() {
        this.audioPreview.style.display = 'none';
        this.uploadArea.style.display = 'block';
        this.previewAudio.src = '';
        this.currentAudioBlob = null;
        this.audioFile.value = '';
        this.hideResults();
    }

    // Processing methods
    async processAudio() {
        if (!this.currentAudioBlob) {
            this.showError('No audio file selected.');
            return;
        }

        this.showProcessingStatus();

        const formData = new FormData();
        formData.append('audio', this.currentAudioBlob, 'audio.wav');

        try {
            const response = await fetch('/api/process-audio', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.success) {
                this.showResults(result);
                this.loadHistory(); // Refresh history
            } else {
                this.showError(result.error || 'Failed to process audio.');
            }
        } catch (error) {
            this.showError('Network error. Please try again.');
        } finally {
            this.hideProcessingStatus();
        }
    }

    showProcessingStatus() {
        this.statusSection.style.display = 'block';
        this.audioPreview.style.display = 'none';
    }

    hideProcessingStatus() {
        this.statusSection.style.display = 'none';
    }

    showResults(result) {
        this.resultAudio.src = result.output_url;
        this.downloadUrl = result.output_url;
        this.resultsSection.style.display = 'block';
        this.statusSection.style.display = 'none';
    }

    hideResults() {
        this.resultsSection.style.display = 'none';
        this.downloadUrl = null;
    }

    downloadResult() {
        if (this.downloadUrl) {
            const a = document.createElement('a');
            a.href = this.downloadUrl;
            a.download = 'consy_response.wav';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    startNewConversation() {
        this.clearAudio();
        this.hideResults();
    }

    // History methods
    async loadHistory() {
        try {
            const response = await fetch('/api/history');
            const data = await response.json();
            
            if (data.history && data.history.length > 0) {
                this.renderHistory(data.history);
            } else {
                this.historyContent.innerHTML = '<p class="no-history">No conversations yet. Start by uploading an audio file!</p>';
            }
        } catch (error) {
            console.error('Failed to load history:', error);
        }
    }

    renderHistory(history) {
        const historyHtml = history
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map(item => {
                const date = new Date(item.timestamp).toLocaleString();
                return `
                    <div class="history-item">
                        <h4>Conversation ${item.id.substring(0, 8)}</h4>
                        <p>${date}</p>
                        <audio controls>
                            <source src="/api/download/${item.output_file}" type="audio/wav">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                `;
            })
            .join('');
        
        this.historyContent.innerHTML = historyHtml;
    }

    async clearHistory() {
        if (confirm('Are you sure you want to clear all conversation history?')) {
            try {
                const response = await fetch('/api/clear-history', {
                    method: 'POST'
                });
                
                if (response.ok) {
                    this.loadHistory();
                } else {
                    this.showError('Failed to clear history.');
                }
            } catch (error) {
                this.showError('Network error. Please try again.');
            }
        }
    }

    // Error handling
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorModal.style.display = 'block';
    }

    closeErrorModal() {
        this.errorModal.style.display = 'none';
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ConSyApp();
});