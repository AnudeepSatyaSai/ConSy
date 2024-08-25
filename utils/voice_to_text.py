import whisper
import numpy as np
import webrtcvad

def voice_to_text(audio_file_path, vad_threshold=0.5):
    model = whisper.load_model("base")
    audio = whisper.load_audio(audio_file_path, sr=16000)
    audio = whisper.pad_or_trim(audio)
    
    vad = webrtcvad.Vad(int(vad_threshold * 3))
    segments = []
    
    for i in range(0, len(audio), 160):
        segment = audio[i:i+160]
        if vad.is_speech(segment.tobytes(), sample_rate=16000):
            segments.append(segment)
    
    if not segments:
        return ""
    
    audio = np.concatenate(segments)
    result = model.transcribe(audio)
    
    return result['text']
