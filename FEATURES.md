# Features

## Real-Time Streaming Chat

The application implements a modern AI chat interface with true Server-Sent Events (SSE) streaming from the backend.

### Frontend Streaming Implementation

The frontend uses the Fetch API with `ReadableStream` to handle text/event-stream responses:

```typescript
// Stream handling with proper buffering
const reader = response.body?.getReader()
const decoder = new TextDecoder()
let buffer = ''

while (true) {
  const { done, value } = await reader.read()
  if (done) break

  const chunk = decoder.decode(value, { stream: true })
  buffer += chunk

  const lines = buffer.split('\n')
  buffer = lines.pop() || ''

  // Process each complete SSE line
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const data = line.slice(6).trim()
      // Update UI incrementally
    }
  }
}
```

### Key Features

#### 1. **Live Text Streaming**
- Messages appear character-by-character as they're generated
- Real-time text/event-stream protocol
- Proper buffering to handle incomplete chunks

#### 2. **Visual Feedback**
- **Typing Indicator**: Shows "Thinking..." when AI starts processing
- **Streaming Cursor**: Animated cursor pulse while text is being streamed
- **Avatar Icons**: User and Bot icons for clear message attribution
- **Loading States**: Spinner in send button during active streaming

#### 3. **Modern Chat UI**
- Message bubbles with tail indicators
- Different styling for user vs assistant messages
- Auto-scroll to latest message
- Empty state with helpful prompt
- Responsive design

#### 4. **Enhanced UX**
- Auto-focus on input field
- Disabled input during streaming
- Error handling with user-friendly messages
- Request abortion support (via AbortController)

#### 5. **Smooth Scrolling**
- Automatic scroll to bottom on new messages
- Smooth scroll behavior for better UX

### Backend SSE Implementation

The backend uses Flask's `stream_with_context` to implement Server-Sent Events:

```python
def generate_stream(message: str):
    response = g4f.ChatCompletion.create(
        model=g4f.models.gpt_4o,
        messages=[{"role": "user", "content": message}],
        stream=True,
    )

    for chunk in response:
        if chunk:
            data = json.dumps({"content": chunk})
            yield f"data: {data}\n\n"

    yield "data: [DONE]\n\n"
```

### SSE Protocol

The application follows the Server-Sent Events specification:

- Content-Type: `text/event-stream`
- Each event: `data: {JSON}\n\n`
- Completion signal: `data: [DONE]\n\n`
- Proper caching headers

### Message Format

**Request:**
```json
{
  "message": "User's question"
}
```

**Response Stream:**
```
data: {"content": "Hello"}

data: {"content": " World"}

data: [DONE]
```

## Technical Stack

- **Frontend**: React 19, TypeScript, Fetch API with ReadableStream
- **Backend**: Flask, g4f library, Server-Sent Events
- **UI**: shadcn/ui, Tailwind CSS, Lucide Icons
- **Build**: Vite 7

## Browser Compatibility

Works in all modern browsers that support:
- Fetch API with ReadableStream
- Server-Sent Events
- CSS Grid and Flexbox
