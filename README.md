# ConvoSynth

ConvoSynth is an AI-powered tool that converts speech input into a dynamic conversation between two virtual speakers (male and female). It uses advanced models for speech recognition, language generation, and speech synthesis to create realistic and emotionally rich dialogues.

## Features
- **Speech Recognition**: Converts audio input to text using OpenAI's Whisper model with integrated Voice Activity Detection (VAD) for accuracy.
- **Language Generation**: Generates contextual and coherent responses using the GPT-Neo language model.
- **Speech Synthesis**: Transforms text responses into speech with customizable voices, pitch, and speed using Edge TTS.
- **Conversation Simulation**: Combines male and female voice outputs into a single audio file simulating a natural conversation.
- **Emotion and Gestures**: Incorporates variations in speech parameters to reflect emotions and human-like gestures.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/AnudeepSatyaSai/ConvoSynth.git
    cd ConvoSynth
    ```

2. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

## Usage

Run the main pipeline to process an input audio file and generate a conversation:

```bash
python main.py --input_audio samples/input_audio.wav --output_audio samples/output_conversation.wav
