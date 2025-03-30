from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Get your Gemini API key from .env
API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("❌ Missing GEMINI_API_KEY in your .env file!")

# Gemini endpoint 
#API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent"

API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

# Initialize chat history
chat_history = []

# Flask app setup
app = Flask(__name__)
CORS(app)  # Allow all origins for local dev

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message')
    
    if not user_message:
        return jsonify({"error": "Message is required."}), 400
    
    # Add user message to chat history
    chat_history.append({
        "role": "user",
        "parts": [{"text": user_message}]
    })
    
    # Gemini API payload with history for context
    payload = {
        "contents": chat_history,
        "generationConfig": {
            "temperature": 0.7,
            "topK": 40,
            "topP": 0.95,
            "maxOutputTokens": 1024,
        }
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        # Add API key to URL instead of headers
        url = f"{API_URL}?key={API_KEY}"
        response = requests.post(url, headers=headers, json=payload)
        print("Status code:", response.status_code)
        
        # For debugging
        print("Response body:", response.text)
        response.raise_for_status()
        
        response_data = response.json()
        
        # Add assistant response to history
        if "candidates" in response_data and len(response_data["candidates"]) > 0:
            assistant_message = response_data["candidates"][0]["content"]
            chat_history.append(assistant_message)
        
        return jsonify(response_data)
    
    except requests.exceptions.RequestException as e:
        print("❌ Gemini API error:", e)
        return jsonify({"error": f"Gemini API request failed: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)