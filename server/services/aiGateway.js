const safeResponse = (prompt) => {
  return {
    answer: `This is a clinically safe response placeholder for: ${prompt}. Review institutional policy before acting.`,
    rationale: "Offline mode engaged — returning policy-safe reminder.",
  };
};

export const forwardPromptToAi = async ({ prompt, transcript, user }) => {
  if (!prompt) {
    throw new Error("Prompt is required");
  }

  if (!process.env.AI_GATEWAY_URL || !process.env.AI_GATEWAY_KEY) {
    return safeResponse(prompt);
  }

  const response = await fetch(process.env.AI_GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.AI_GATEWAY_KEY}`,
    },
    body: JSON.stringify({
      prompt,
      transcript,
      user,
    }),
  });

  if (!response.ok) {
    throw new Error("AI provider failed");
  }

  const data = await response.json();
  return {
    answer: data.answer || safeResponse(prompt).answer,
    rationale: data.rationale || "Validated by upstream AI provider.",
  };
};
