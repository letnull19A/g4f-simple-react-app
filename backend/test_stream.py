import g4f

print("Testing g4f streaming...")
print("-" * 50)

response = g4f.ChatCompletion.create(
    model=g4f.models.gpt_4o,
    messages=[{"role": "user", "content": "Say hello"}],
    stream=True,
)

print("Chunks received:")
for i, chunk in enumerate(response):
    print(f"Chunk {i}: {repr(chunk)}")

print("-" * 50)
print("Test complete!")
