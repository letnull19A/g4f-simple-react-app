# Troubleshooting Guide

## Double Character Issue

If you're seeing double characters like "HHeelllloo" instead of "Hello", follow these debugging steps:

### Step 1: Check Backend Output

1. Start the backend:
```bash
cd backend
python app.py
```

2. Send a test message from the frontend

3. Look at the backend console output:
```
[DEBUG] Chunk 1: 'H'
[DEBUG] Chunk 2: 'e'
[DEBUG] Chunk 3: 'l'
...
```

**What to look for:**
- Are chunks already doubled in the backend? → g4f issue
- Are chunks single characters? → Frontend parsing issue

### Step 2: Check Frontend Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Send a message
4. Look for debug logs:

```
[DEBUG] Received chunk: H
[DEBUG] Total content now: H
[DEBUG] Received chunk: e
[DEBUG] Total content now: He
```

**What to look for:**
- Is "Received chunk" showing single or double characters?
- Is "Total content" accumulating correctly?

### Common Issues

#### Issue 1: Backend sends non-string objects

**Symptom:** Backend console shows:
```
[DEBUG] Chunk 0: Type=ProviderInfo, Value=<object>
[DEBUG] Chunk 1: Type=RequestLogin, Value=<object>
```

**Solution:** g4f sends metadata objects that should be filtered:
1. Code already filters with `isinstance(chunk, str)`
2. These objects are normal and will be skipped
3. If no text chunks appear, the provider may need authentication
4. Try using `g4f.models.default` to auto-select working providers

#### Issue 2: Backend sends doubled chunks

**Symptom:** Backend console shows:
```
[DEBUG] Text chunk 1: 'HH'
[DEBUG] Text chunk 2: 'ee'
```

**Solution:** This is a g4f library issue. Try:
1. Update g4f: `pip install -U g4f`
2. Try a different model
3. Check g4f documentation for changes

#### Issue 2: Frontend processes chunks twice

**Symptom:** Backend sends single, frontend receives double:
```
Backend: Chunk 1: 'H'
Frontend: Received chunk: H
Frontend: Received chunk: H  ← Duplicate!
```

**Solution:** Check the streaming loop logic in `App.tsx`:
- Ensure buffer accumulation is correct (`buffer += chunk`)
- Verify lines are split and processed only once
- Check that partial lines aren't reprocessed

#### Issue 3: SSE parsing error

**Symptom:** Console shows parsing errors or malformed data

**Solution:**
1. Check that backend sends proper SSE format:
   ```
   data: {"content": "text"}\n\n
   ```
2. Verify Content-Type is `text/event-stream`
3. Check for extra newlines or spaces

### Debug Mode

The application now includes debug logging. To use it:

1. **Backend:** Debug logs print to console automatically
2. **Frontend:** Open browser console (F12) to see logs

To remove debug logging later:
1. Remove `console.log` lines from `App.tsx`
2. Remove `print` statements from `app.py`
3. Rebuild: `pnpm build`

### Testing the Stream

Create a simple test to verify streaming works:

```python
# backend/test_stream.py
import g4f

response = g4f.ChatCompletion.create(
    model=g4f.models.gpt_4o,
    messages=[{"role": "user", "content": "Count to 5"}],
    stream=True,
)

for i, chunk in enumerate(response):
    print(f"Chunk {i}: {repr(chunk)}")
```

Run with:
```bash
cd backend
python test_stream.py
```

### Expected Behavior

With streaming enabled, you should see:
- Chunks arriving in small pieces (words or sentences, not characters)
- Each chunk appearing once in both backend and frontend logs
- Text accumulating smoothly without duplication

### Still Having Issues?

1. Clear browser cache
2. Restart both backend and frontend
3. Check network tab in DevTools to see raw SSE data
4. Try a different browser
5. Check g4f library version: `pip show g4f`
