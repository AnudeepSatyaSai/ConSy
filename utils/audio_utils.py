import soundfile as sf
import numpy as np

def combine_audio_files(male_audio_path, female_audio_path, output_path="conversation.wav", pause_duration=0.5):
    male_audio, male_sr = sf.read(male_audio_path)
    female_audio, female_sr = sf.read(female_audio_path)
    
    assert male_sr == female_sr, "Sample rates of the audio files do not match!"
    
    pause = np.zeros(int(pause_duration * male_sr))
    conversation = []
    
    conversation.append(male_audio)
    conversation.append(pause)
    conversation.append(female_audio)
    conversation.append(pause)
    
    conversation = np.concatenate(conversation)
    
    sf.write(output_path, conversation, male_sr)
    return output_path
