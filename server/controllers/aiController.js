import { z } from "zod";
import { sendJson } from "../utils/http.js";
import { forwardPromptToAi } from "../services/aiGateway.js";

const triageSchema = z.object({
  prompt: z.string().min(5),
  transcript: z.array(z.object({ role: z.string(), content: z.string() })).optional(),
});

export const triageAssistant = async (req, res) => {
  try {
    const payload = triageSchema.parse(req.body);
    const response = await forwardPromptToAi({
      prompt: payload.prompt,
      transcript: payload.transcript || [],
      user: req.user,
    });
    return sendJson(res, 200, response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendJson(res, 400, { error: error.flatten() });
    }
    return sendJson(res, 500, { error: "AI gateway unavailable" });
  }
};
