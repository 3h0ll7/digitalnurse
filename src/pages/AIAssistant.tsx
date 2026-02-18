import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, AlertCircle, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
const MAX_DAILY = 10;

const exampleQuestions = [
  "What are the signs of IV infiltration?",
  "Explain the mechanism of action for metformin",
  "Help me write a progress note for a stable patient",
  "What are normal vital signs for adults?",
];

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState<number | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Streams a response from the ai-chat edge function token by token.
   * Parses SSE line-by-line for real-time rendering.
   */
  const streamFromEdgeFunction = async (allMessages: Message[]) => {
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages: allMessages }),
      signal: controller.signal,
    });

    // Capture rate limit header
    const remaining = resp.headers.get("X-RateLimit-Remaining");
    if (remaining !== null) {
      setRemainingRequests(parseInt(remaining, 10));
    }

    if (!resp.ok) {
      const data = await resp.json().catch(() => ({}));
      if (resp.status === 429) {
        const msg = data?.error || `Daily limit of ${MAX_DAILY} messages reached. Try again tomorrow.`;
        toast.error(msg);
        throw new Error(msg);
      }
      if (resp.status === 402) {
        toast.error("AI service credits exhausted. Please contact support.");
        throw new Error("Payment required");
      }
      throw new Error(data?.error || "AI service error");
    }

    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;
    let assistantText = "";

    // Add empty assistant message to stream into
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;

      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const chunk = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (chunk) {
            assistantText += chunk;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: "assistant", content: assistantText };
              return updated;
            });
          }
        } catch {
          // Incomplete JSON — re-buffer
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw || !raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const chunk = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (chunk) {
            assistantText += chunk;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { role: "assistant", content: assistantText };
              return updated;
            });
          }
        } catch { /* ignore */ }
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setIsStreaming(true);

    try {
      await streamFromEdgeFunction(updatedMessages);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      // Remove the empty assistant placeholder if streaming failed before any content
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.content === "") {
          return prev.slice(0, -1);
        }
        return prev;
      });
      if (!(err instanceof Error && err.message.includes("limit"))) {
        toast.error("Failed to get a response. Please try again.");
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleExampleClick = (question: string) => {
    setInput(question);
  };

  const handleStop = () => {
    abortControllerRef.current?.abort();
  };

  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col">
      <header className="bg-primary text-primary-foreground p-6 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">AI Nursing Assistant</h1>
          {/* Connection status indicator */}
          <div className="flex items-center gap-1.5 text-primary-foreground/80 text-xs">
            <Wifi size={14} />
            <span>Gemini AI</span>
          </div>
        </div>
        {/* Rate limit indicator */}
        {remainingRequests !== null && (
          <div className="mt-2 text-primary-foreground/70 text-xs">
            {remainingRequests} of {MAX_DAILY} daily messages remaining
          </div>
        )}
      </header>

      {/* Disclaimer banner */}
      <div className="bg-medical-yellow/10 border-l-4 border-medical-yellow p-4 m-4 rounded-r-lg">
        <div className="flex gap-2">
          <AlertCircle className="text-medical-yellow flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-foreground">
            For educational purposes only. Always verify with qualified healthcare professionals.
          </p>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-medical-blue-light p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Bot className="text-primary" size={32} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">AI Nursing Assistant</h2>
            <p className="text-muted-foreground mb-6 px-4">
              Powered by Google Gemini. Ask about procedures, medications, clinical scenarios, or documentation help.
            </p>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground mb-3">Example questions:</p>
              {exampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(question)}
                  className="block w-full text-start bg-card p-3 rounded-lg text-sm text-primary hover:bg-accent transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="bg-primary p-2 rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0">
                  <Bot className="text-primary-foreground" size={18} />
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                {/* Streaming cursor */}
                {isStreaming && index === messages.length - 1 && message.role === "assistant" && (
                  <span className="inline-block w-1.5 h-4 bg-muted-foreground ml-0.5 animate-pulse rounded-sm" />
                )}
              </div>
            </div>
          ))
        )}

        <div ref={messagesEndRef} />

        {/* Loading dots (shown before first token arrives) */}
        {isLoading && !isStreaming && (
          <div className="flex gap-3">
            <div className="bg-primary p-2 rounded-full h-8 w-8 flex items-center justify-center">
              <Bot className="text-primary-foreground" size={18} />
            </div>
            <div className="bg-card p-3 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-4 bg-background border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask a nursing question... (10 messages/day)"
            className="resize-none bg-card"
            rows={1}
            disabled={isLoading}
          />
          {isStreaming ? (
            <Button onClick={handleStop} variant="outline" className="px-4">
              <WifiOff size={20} />
            </Button>
          ) : (
            <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="px-4">
              <Send size={20} />
            </Button>
          )}
        </div>
        {remainingRequests !== null && remainingRequests <= 3 && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            ⚠️ {remainingRequests} message{remainingRequests !== 1 ? "s" : ""} remaining today
          </p>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
