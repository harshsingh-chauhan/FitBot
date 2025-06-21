from llama_cpp import Llama
import config
import os

class SK:
    def __init__(self):
        """Initialize the chatbot with the Llama model."""
        if not os.path.exists(config.MODEL_PATH):
            raise FileNotFoundError(
                f"Model file not found at {config.MODEL_PATH}. "
                "Please download a Llama model in GGUF format and update the MODEL_PATH in config.py"
            )
        
        print("Loading Llama model... This might take a few moments.")
        self.llm = Llama(
            model_path=config.MODEL_PATH,
            **config.MODEL_PARAMS
        )
        self.conversation_history = []
        print("Model loaded successfully!")

    def format_prompt(self, user_input):
        """Format the prompt with conversation history."""
        # Add system prompt at the start
        if not self.conversation_history:
            formatted_prompt = f"<s>[INST] <<SYS>>\n{config.SYSTEM_PROMPT}\n<</SYS>>\n\n"
        else:
            formatted_prompt = ""

        # Add conversation history
        for message in self.conversation_history:
            formatted_prompt += f"{message['content']} [/INST] {message['response']} </s><s>[INST] "

        # Add current user input
        formatted_prompt += f"{user_input} [/INST]"
        return formatted_prompt

    def get_response(self, user_input):
        """Get a response from the model for the given user input."""
        prompt = self.format_prompt(user_input)
        
        # Generate response
        response = self.llm(
            prompt,
            max_tokens=config.MAX_TOKENS,
            temperature=config.TEMPERATURE,
            top_p=config.TOP_P,
            echo=False
        )

        # Extract the generated text
        response_text = response['choices'][0]['text'].strip()
        
        # Store the conversation
        self.conversation_history.append({
            'content': user_input,
            'response': response_text
        })
        
        return response_text

    def chat(self):
        """Run an interactive chat session."""
        print("\nWelcome to Llama Chatbot! Type 'quit' to exit.")
        print("-" * 50)

        while True:
            user_input = input("\nYou: ").strip()
            
            if user_input.lower() in ['quit', 'exit']:
                print("\nGoodbye!")
                break
            
            if not user_input:
                continue

            try:
                response = self.get_response(user_input)
                print("\nChatbot:", response)
            except Exception as e:
                print(f"\nError: {str(e)}")
                print("Please try again.")

def main():
    try:
        chatbot = SK()
        chatbot.chat()
    except Exception as e:
        print(f"Error initializing chatbot: {str(e)}")


if __name__ == "__main__":
    main()


