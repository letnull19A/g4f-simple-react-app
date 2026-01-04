from flask import Flask, request, Response, stream_with_context
from flask_cors import CORS
from g4f.client import Client
# from g4f.Provider.v1 import 
import g4f
import json
import asyncio

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
            # Debug all chunks
            print(f"[DEBUG] Chunk {chunk_count}: Type={type(chunk).__name__}, Value={repr(chunk)}")
            chunk_count += 1

            # Skip non-string chunks (like ProviderInfo, RequestLogin objects)
            if chunk and isinstance(chunk, str) and chunk.strip():
                text_chunks += 1
                print(f"[DEBUG] Text chunk {text_chunks}: {repr(chunk)}")
                data = json.dumps({"content": chunk})
                yield f"data: {data}\n\n"

        print(f"[DEBUG] Stream complete. Total chunks: {chunk_count}, Text chunks: {text_chunks}")
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

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return {"status": "healthy"}

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
