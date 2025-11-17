import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

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
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
      
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response from AI');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let textBuffer = "";

      // Add empty assistant message that we'll update
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
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
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantMessage
                };
                return newMessages;
              });
            }
          } catch (e) {
            console.error('Error parsing JSON:', e);
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Error calling AI:', error);
      toast({
        title: "خطأ",
        description: "فشل الاتصال بمساعد الذكاء الاصطناعي. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleExampleClick = (question: string) => {
    setInput(question);
  };

  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col">
      <header className="bg-primary text-primary-foreground p-6 shadow-md">
        <h1 className="text-2xl font-bold">AI Nursing Assistant</h1>
      </header>

      <div className="bg-medical-yellow/10 border-l-4 border-medical-yellow p-4 m-4 rounded-r-lg">
        <div className="flex gap-2">
          <AlertCircle className="text-medical-yellow flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-foreground">
            For educational purposes only. Always verify with qualified healthcare professionals.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-medical-blue-light p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Bot className="text-primary" size={32} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              AI Nursing Assistant
            </h2>
            <p className="text-muted-foreground mb-6 px-4">
              Ask me about nursing procedures, medications, clinical scenarios, or help with professional documentation.
            </p>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground mb-3">
                Example questions:
              </p>
              {exampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(question)}
                  className="block w-full text-left bg-card p-3 rounded-lg text-sm text-primary hover:bg-accent transition-colors"
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
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
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
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
        {isLoading && (
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
            placeholder="Ask a nursing question..."
            className="resize-none bg-card"
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-4"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
