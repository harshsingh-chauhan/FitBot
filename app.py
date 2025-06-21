from flask import Flask, request, jsonify, render_template
from chatbot import SK
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from your frontend

chatbot = SK()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        message = data.get('message', '')
        if not message:
            return jsonify({'response': 'No message provided.'}), 400
        
        # Use Llama model for all queries
        response = chatbot.get_response(message)
        return jsonify({'response': response})
    
    except Exception as e:
        return jsonify({'response': f'An error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)