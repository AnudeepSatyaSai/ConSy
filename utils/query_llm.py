from transformers import pipeline
import torch

def query_llm(input_text, model_name="EleutherAI/gpt-neo-2.7B", max_new_tokens=50):
    device = 0 if torch.cuda.is_available() else -1
    llm_pipeline = pipeline("text-generation", model=model_name, device=device, truncation=True)
    response = llm_pipeline(input_text, max_length=len(input_text.split()) + max_new_tokens, num_return_sequences=1)
    return response[0]['generated_text']
