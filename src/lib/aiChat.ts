/** Client for the Supabase `ai-chat` edge function (OpenAI-style server-sent events). */
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./supabaseEnv";

export type AIProvider = "groq" | "gemini";

export const AI_PROVIDERS: Record<AIProvider, { model: string; en: string; ar: string }> = {
  groq: { model: "gpt-oss-120b", en: "Open-source · gpt-oss-120b (Groq)", ar: "مفتوح المصدر · gpt-oss-120b (Groq)" },
  gemini: { model: "Gemini", en: "Google Gemini", ar: "Google Gemini" },
};

export const CHAT_URL = `${SUPABASE_URL}/functions/v1/ai-chat`;

/** Text carried by one SSE line, or null for markers, comments, reasoning-only or malformed chunks. */
export const extractSseContent = (line: string): string | null => {
  const trimmed = line.trim();
  if (!trimmed.startsWith("data:")) return null;
  const payload = trimmed.slice(5).trim();
  if (!payload || payload === "[DONE]") return null;
  try {
    const chunk = JSON.parse(payload)?.choices?.[0]?.delta?.content;
    return typeof chunk === "string" && chunk.length > 0 ? chunk : null;
  } catch {
    return null;
  }
};

/** Buffers network chunks into lines and reports each piece of answer text. */
export const createSseParser = (onDelta: (text: string) => void) => {
  let buffer = "";
  const emit = (line: string) => {
    const text = extractSseContent(line);
    if (text) onDelta(text);
  };
  return {
    push(chunk: string) {
      buffer += chunk;
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? "";
      lines.forEach(emit);
    },
    end() {
      if (buffer.trim()) emit(buffer);
      buffer = "";
    },
  };
};

interface StreamChatOptions {
  messages: { role: string; content: string }[];
  language: string;
  provider?: AIProvider;
  mode?: string;
  modePrompt?: string;
  signal?: AbortSignal;
  onDelta: (text: string) => void;
}

export interface StreamChatResult {
  text: string;
  /** Model that actually answered (may differ from the requested one after a fallback). */
  model: string | null;
  /** True when the requested model was unavailable and the other one answered. */
  fellBack: boolean;
  remaining: number | null;
}

export const streamChat = async ({ onDelta, signal, ...body }: StreamChatOptions): Promise<StreamChatResult> => {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      ...(SUPABASE_PUBLISHABLE_KEY ? { apikey: SUPABASE_PUBLISHABLE_KEY } : {}),
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    throw new Error(data?.error || "AI service error");
  }
  if (!resp.body) throw new Error("No response body");

  let text = "";
  const parser = createSseParser((delta) => {
    text += delta;
    onDelta(text);
  });
  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    parser.push(decoder.decode(value, { stream: true }));
  }
  parser.push(decoder.decode());
  parser.end();

  const remaining = resp.headers.get("X-RateLimit-Remaining");
  return {
    text,
    model: resp.headers.get("X-AI-Model"),
    fellBack: resp.headers.get("X-AI-Fallback") === "true",
    remaining: remaining === null ? null : Number(remaining),
  };
};
