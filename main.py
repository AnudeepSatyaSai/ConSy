import asyncio
from utils.voice_to_text import voice_to_text
from utils.query_llm import query_llm
from utils.text_to_speech import text_to_speech
from utils.audio_utils import combine_audio_files

async def main_pipeline(audio_file_path, output_audio_path):
    text = voice_to_text(audio_file_path)
    
    if not text:
        print("No voice detected in the audio.")
        return None
    
    response = query_llm(text, max_new_tokens=100)
    response = '. '.join(response.split('.')[:4]) + '.'
    
    sentences = response.split('.')
    half = len(sentences) // 2
    male_part = '. '.join(sentences[:half]) + '.'
    female_part = '. '.join(sentences[half:]) + '.'
    
    male_audio_path = await text_to_speech(male_part, output_path="male_voice.wav", pitch=1.0, voice="en-US-GuyNeural", speed=1.0)
    female_audio_path = await text_to_speech(female_part, output_path="female_voice.wav", pitch=1.1, voice="en-US-JennyNeural", speed=1.1)
    
    conversation_path = combine_audio_files(male_audio_path, female_audio_path, output_audio_path)
    
    return conversation_path

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="ConvoSynth: Generate conversations from audio input.")
    parser.add_argument("--input_audio", type=str, required=True, help="Path to the input audio file.")
    parser.add_argument("--output_audio", type=str, default="conversation.wav", help="Path to save the output conversation audio.")
    args = parser.parse_args()

    output_audio = asyncio.run(main_pipeline(args.input_audio, args.output_audio))
    if output_audio:
        print(f"Output conversation audio saved at: {output_audio}")
