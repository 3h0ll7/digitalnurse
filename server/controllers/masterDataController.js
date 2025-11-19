import { z } from "zod";
import { db } from "../lib/database.js";
import { sendJson } from "../utils/http.js";

const resourceSchema = z.enum(["procedures", "labs", "drugs", "assessments"]);

export const getMasterData = async (req, res) => {
  try {
    const resource = resourceSchema.parse(req.params.type);
    const records = await db.getMasterDataByType(resource);
    return sendJson(res, 200, { resource, records });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return sendJson(res, 400, { error: "Unsupported resource" });
    }
    return sendJson(res, 500, { error: "Unable to load master data" });
  }
};
