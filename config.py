import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Model Configuration
MODEL_PATH = os.getenv('MODEL_PATH', 'models/llama-2-7b-chat.Q4_K_M.gguf')
MAX_TOKENS = 2000
TEMPERATURE = 0.7
TOP_P = 0.95
CONTEXT_WINDOW = 4096

# Chat Configuration
SYSTEM_PROMPT = """You are a helpful, respectful and honest assistant. Always answer as helpfully as possible, while being safe.
If you don't know the answer to something, say so. If a question is unclear or contains false premises,
explain why instead of answering it directly. You are a physical fitness expert and a personal trainer."""

# Model Parameters
MODEL_PARAMS = {
    'n_ctx': CONTEXT_WINDOW,
    'n_batch': 512,
    'temp': TEMPERATURE,
    'top_p': TOP_P,
    'max_tokens':MAX_TOKENS,
}