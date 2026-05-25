import express, { Request, Response } from "express";
import axios from "axios";
const router = express.Router();

import config from "../../config";
import searchDocuments from "../services/search";
import analyzeQuery from "../services/grokQueryAnalysis";
import AI_OVERVIEW_PROMPT from "../prompt/aiOverviewPrompt";

router.post("/", async (req: Request, res: Response) => {

  try {

    const { query } = req.body;

    // STEP 1 — GROK QUERY ANALYSIS
    const analysis = await analyzeQuery(query);

    // STEP 2 — SEARCH TYPESENSE
    const { hits: results, suppressedCount } = await searchDocuments(query);

    // STEP 3 — GENERATE AI OVERVIEW
    let aiOverview = "";
    try {
      const context = (results as any[])
        .map((r) => `[${r.document?.content_type}] ${r.document?.title}: ${r.document?.body}`)
        .join("\n");

      const overviewResponse = await axios.post(
        "https://api.x.ai/v1/chat/completions",
        {
          model: "grok-3",
          messages: [
            { role: "system", content: AI_OVERVIEW_PROMPT },
            { role: "user", content: `User query: "${query}"\n\nRetrieved content:\n${context}` }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${config.grok.apiKey}`,
            "Content-Type": "application/json"
          }
        }
      );

      aiOverview = overviewResponse.data.choices[0].message.content;
    } catch {
      aiOverview = "";
    }

    // STEP 4 — RETURN EVERYTHING
    res.json({
      query,
      analysis,
      results,
      aiOverview,
      suppressedCount
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Search failed"
    });

  }
});

export default router;
