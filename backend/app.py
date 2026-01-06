from flask import Flask, request, Response, stream_with_context
from flask_cors import CORS
from g4f.client import Client
import g4f
import json
import asyncio
import requests
import base64

app = Flask(__name__)
CORS(app)

def generate_stream(message: str):
    """Generator function for streaming responses from g4f"""
    try:
        
        response = g4f.ChatCompletion.create(
            model=g4f.models.gpt_oss_120b,
            messages=[{"role": "user", "content": message}],
            stream=True,
        )

        chunk_count = 0
        text_chunks = 0
        for chunk in response:
            chunk_count += 1

            # Skip non-string chunks (like ProviderInfo, RequestLogin objects)
            if chunk and isinstance(chunk, str) and chunk.strip():
                text_chunks += 1
                data = json.dumps({"content": chunk})
                yield f"data: {data}\n\n"

        print(f"Stream complete. Total chunks: {chunk_count}, Text chunks: {text_chunks}")
        yield "data: [DONE]\n\n"
    except Exception as e:
        print(f"[ERROR] {str(e)}")
        import traceback
        traceback.print_exc()
        error_data = json.dumps({"error": str(e)})
        yield f"data: {error_data}\n\n"

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat requests with streaming responses"""
    data = request.json
    message = data.get('message', '')

    if not message:
        return {"error": "No message provided"}, 400

    return Response(
        stream_with_context(generate_stream(message)),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no'
        }
    )

@app.route('/api/image', methods=['POST'])
def generate_image():
    """Handle image generation requests"""
    data = request.json
    prompt = data.get('prompt', '')

    if not prompt:
        return {"error": "No prompt provided"}, 400

    try:
        # Request to DeepInfra API
        api_url = "https://api.deepinfra.com/v1/openai/images/generations"
        payload = {
            "model": "black-forest-labs/FLUX-2-dev",
            "prompt": prompt,
            "response_format": "b64_json",
            "height": 480,
            "width": 832
        }

        headers = {
            "Content-Type": "application/json"
        }

        print(f"[DEBUG] Sending request to DeepInfra with prompt: {prompt}")

        response = requests.post(api_url, json=payload, headers=headers)
        response.raise_for_status()

        result = response.json()
        print(f"[DEBUG] Received response from DeepInfra")

        # Convert base64 to data URL
        if result.get('data') and len(result['data']) > 0:
            b64_image = result['data'][0].get('b64_json')
            if b64_image:
                image_url = f"data:image/png;base64,{b64_image}"
                print(f"[DEBUG] Generated image (base64 length: {len(b64_image)})")
                return {"image_url": image_url}

        return {"error": "No image data in response"}, 500

    except requests.exceptions.RequestException as e:
        print(f"[ERROR] DeepInfra API request failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"error": f"API request failed: {str(e)}"}, 500
    except Exception as e:
        print(f"[ERROR] Image generation failed: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"error": str(e)}, 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
