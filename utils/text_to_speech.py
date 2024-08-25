import edge_tts
import soundfile as sf
import numpy as np

async def text_to_speech(text, output_path="output.wav", pitch=1.0, voice="en-US-GuyNeural", speed=1.0):
    tts = edge_tts.Communicate(text, voice=voice)
    await tts.save(output_path)
    audio, sample_rate = sf.read(output_path)
    audio = np.interp(np.arange(0, len(audio), speed), np.arange(0, len(audio)), audio)
    sf.write(output_path, audio * pitch, sample_rate)
    return output_path
