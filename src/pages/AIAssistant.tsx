import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, AlertCircle } from "lucide-react";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const generateLocalAnswer = (question: string) => {
    const normalized = question.toLowerCase();
    if (normalized.includes("iv") && normalized.includes("infiltration")) {
      return "Assess for swelling, blanching, pain, and slowed infusion. Stop the IV, elevate the limb, apply a warm or cool compress per protocol, and restart the line proximal to the site. Document assessments and notify the provider if vesicants were involved.";
    }
    if (normalized.includes("metformin")) {
      return "Metformin decreases hepatic glucose production, increases peripheral uptake, and improves insulin sensitivity. Remind patients to take it with meals, hold the dose around IV contrast, and monitor renal function and lactic acidosis symptoms.";
    }
    if (normalized.includes("progress note")) {
      return "Use a SOAP format: document subjective status, objective vitals/labs, your assessment of trends, and an actionable plan (consults, education, safety checks). Keep the tone concise and clinically focused.";
    }
    if (normalized.includes("vital")) {
      return "Adult vital sign targets: Temp 36.4–37.6°C, HR 60–100 bpm, RR 12–20/min, BP roughly 100–120/60–80 mmHg, SpO2 ≥94% unless otherwise ordered. Trend changes, not just absolutes.";
    }
    return `Here is a rapid bedside approach: clarify the indication, capture baseline vitals, outline first-line interventions, and highlight red flags for escalation related to "${question}". Pair the response with education, documentation, and follow-up reminders.`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    setTimeout(() => {
      const answer = generateLocalAnswer(userMessage.content);
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
      setIsLoading(false);
    }, 600);
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
