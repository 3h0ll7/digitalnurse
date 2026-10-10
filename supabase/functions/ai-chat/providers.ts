/**
 * Model providers for the ai-chat function. Pure (no Deno APIs) so it can be unit-tested.
 *
 * - groq:   openai/gpt-oss-120b (open-weight, Apache-2.0) served by Groq. Secret: GROQ_API_KEY.
 * - gemini: Google Gemini through the Lovable AI gateway. Secret: LOVABLE_API_KEY.
 */
export type ProviderId = "groq" | "gemini";

export interface ChatMessage {
  role: string;
  content: string;
}

type EnvGetter = (name: string) => string | undefined;

interface ProviderConfig {
  url: string;
  keyEnv: string;
  model: string;
  label: string;
  extraBody?: Record<string, unknown>;
}

export const PROVIDERS: Record<ProviderId, ProviderConfig> = {
  groq: {
    url: "https://api.groq.com/openai/v1/chat/completions",
    keyEnv: "GROQ_API_KEY",
    model: "openai/gpt-oss-120b",
    label: "gpt-oss-120b",
    // Answer text only; the model's chain of thought is not streamed to the app.
    extraBody: { include_reasoning: false, reasoning_effort: "medium" },
  },
  gemini: {
    url: "https://ai.gateway.lovable.dev/v1/chat/completions",
    keyEnv: "LOVABLE_API_KEY",
    model: "google/gemini-3.1-flash-lite",
    label: "Gemini",
  },
};

const DEFAULT_ORDER: ProviderId[] = ["groq", "gemini"];

/** Requested provider first, the other one as fallback; providers without a key are skipped. */
export const providerOrder = (requested: unknown, getEnv: EnvGetter): ProviderId[] => {
  const first = requested === "gemini" || requested === "groq" ? requested : DEFAULT_ORDER[0];
  const order = [first, ...DEFAULT_ORDER.filter((p) => p !== first)];
  return order.filter((p) => Boolean(getEnv(PROVIDERS[p].keyEnv)));
};

export const buildUpstreamRequest = (provider: ProviderId, messages: ChatMessage[], getEnv: EnvGetter) => {
  const config = PROVIDERS[provider];
  return {
    url: config.url,
    headers: {
      Authorization: `Bearer ${getEnv(config.keyEnv)}`,
      "Content-Type": "application/json",
    },
    body: {
      model: config.model,
      messages,
      stream: true,
      ...config.extraBody,
    } as Record<string, unknown>,
  };
};

const MAX_MESSAGES = 50;
const MAX_MESSAGE_CHARS = 10_000;
const MAX_MODE_PROMPT_CHARS = 4_000;

/** Returns an error message for an invalid request body, or null when it is valid. */
export const validateChatInput = ({ messages, modePrompt }: { messages: unknown; modePrompt: unknown }): string | null => {
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return "Invalid messages array";
  }
  for (const msg of messages) {
    const role = (msg as ChatMessage)?.role;
    const content = (msg as ChatMessage)?.content;
    if (role !== "user" && role !== "assistant") return "Invalid message role";
    if (typeof content !== "string" || content.length === 0 || content.length > MAX_MESSAGE_CHARS) {
      return "Invalid message format";
    }
  }
  if (typeof modePrompt !== "string" || modePrompt.length > MAX_MODE_PROMPT_CHARS) return "Invalid mode prompt";
  return null;
};
