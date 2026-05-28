import express, { Request, Response } from "express";
import axios from "axios";
import config from "../../config";
import MODERATION_ASSIST_PROMPT from "../prompt/moderationPrompt";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { content } = req.body;

  if (!content || typeof content !== "string") {
    res.status(400).json({ error: "content is required" });
    return;
  }

  try {
    const response = await axios.post(
      "https://api.x.ai/v1/chat/completions",
      {
        model: "grok-4.20-reasoning",
        messages: [
          { role: "system", content: MODERATION_ASSIST_PROMPT },
          { role: "user", content }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${config.grok.apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const raw = response.data.choices[0].message.content;
    res.json(JSON.parse(raw));
  } catch {
    res.status(500).json({ error: "Moderation classification failed" });
  }
});

export default router;
