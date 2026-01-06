import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, Loader2, MessageSquare, Image as ImageIcon } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || '';

type MessageMode = "text" | "image";

interface Message {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
  imageUrl?: string;
  mode?: MessageMode;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<MessageMode>("text");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input, mode };
    const currentInput = input;
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      if (mode === "image") {
        // Image generation mode
        const response = await fetch(`${API_URL}/api/image`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: currentInput }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to generate image");
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: currentInput,
            imageUrl: data.image_url,
            mode: "image",
          },
        ]);
      } else {
        // Text chat mode
        const response = await fetch(`${API_URL}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: currentInput }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to get response");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
          throw new Error("No reader available");
        }

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "", isStreaming: true, mode: "text" },
        ]);

        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastMessage = newMessages[newMessages.length - 1];
              if (lastMessage.role === "assistant") {
                lastMessage.isStreaming = false;
              }
              return [...newMessages];
            });

            break;
          }

          const chunk = decoder.decode(value, { stream: true });

          buffer += chunk;

          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;

            const data = line.slice(6).trim();

            try {
              const parsed = JSON.parse(data);

              if (parsed.content) {
                console.log("[DEBUG] Received chunk:", parsed.content);
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];

                  if (lastMessage.role === "assistant") {
                    lastMessage.content += parsed.content;
                  }
                  return [...newMessages];
                });
              }

              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (e) {
              if (data && data !== "[DONE]") {
                console.error("Error parsing chunk:", e, "Data:", data);
              }
            }
          }
        }

        setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === "assistant") {
            lastMessage.isStreaming = false;
          }
          return [...newMessages];
        });
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Request aborted");
        return;
      }
      console.error("Error:", error);
      setMessages((prev) => {
        const newMessages = prev.filter((m) => !m.isStreaming || m.content);
        return [
          ...newMessages,
          {
            role: "assistant",
            content: `Sorry, an error occurred: ${error.message}. Please try again.`,
          },
        ];
      });
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[700px] flex flex-col shadow-lg">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              G4F Chat - {mode === "text" ? "GPT-4O" : "FLUX Image"}
            </CardTitle>
            <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
              <Button
                variant={mode === "text" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMode("text")}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Text
              </Button>
              <Button
                variant={mode === "image" ? "default" : "ghost"}
                size="sm"
                onClick={() => setMode("image")}
                className="flex items-center gap-2"
              >
                <ImageIcon className="h-4 w-4" />
                Image
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden p-0">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Bot className="h-16 w-16 mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">
                  Start a conversation
                </h3>
                <p className="text-sm">
                  {mode === "text"
                    ? "Ask me anything! I'll respond in real-time."
                    : "Describe an image you want to generate!"}
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>

                <div
                  className={`flex-1 max-w-[80%] ${
                    message.role === "user" ? "items-end" : "items-start"
                  } flex flex-col gap-1`}
                >
                  <div className="text-xs font-semibold text-muted-foreground px-1">
                    {message.role === "user" ? "You" : "Assistant"}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted rounded-tl-sm"
                    }`}
                  >
                    {message.imageUrl ? (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground italic">
                          {message.content}
                        </p>
                        <img
                          src={message.imageUrl}
                          alt={message.content}
                          className="rounded-lg max-w-md w-full h-auto"
                          loading="lazy"
                        />
                      </div>
                    ) : message.content ? (
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    ) : message.isStreaming ? (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">
                          {message.mode === "image"
                            ? "Generating image..."
                            : "Thinking..."}
                        </span>
                      </div>
                    ) : null}
                    {message.isStreaming && message.content && !message.imageUrl && (
                      <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t px-6 py-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === "text"
                    ? "Type your message..."
                    : "Describe the image you want to generate..."
                }
                disabled={isLoading}
                className="flex-1"
                autoFocus
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
