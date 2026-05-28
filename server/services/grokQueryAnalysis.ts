import axios from "axios";
import config from "../../config";
import QUERY_INTELLIGENCE_PROMPT from "../prompt/queryAnalysisPrompt";

interface ContentMix {
  practitioners: number;
  protocols: number;
  community: number;
}

interface QueryAnalysis {
  intent: string;
  entities: string[];
  risk_level: string;
  query_expansions: string[];
  recommended_content_mix: ContentMix;
}

function localFallback(query: string): QueryAnalysis {
  const lower = query.toLowerCase();

  const highRiskTerms = ["cancer", "tumor", "chemotherapy", "medication", "surgery", "off-label"];
  const mediumRiskTerms = ["anxiety", "depression", "fatigue", "pain", "stress", "insomnia"];

  let risk_level = "low";
  if (highRiskTerms.some(term => lower.includes(term))) risk_level = "high";
  else if (mediumRiskTerms.some(term => lower.includes(term))) risk_level = "medium";

  return {
    intent:
      lower.includes("doctor") || lower.includes("specialist") ? "practitioner_search"
      : lower.includes("protocol") ? "protocol_research"
      : lower.includes("community") ? "community_exploration"
      : "informational",
    entities: [query],
    risk_level,
    query_expansions: [
      `${query} wellness`,
      `${query} protocol`,
      `${query} practitioner`
    ],
    recommended_content_mix: {
      practitioners: risk_level === "high" ? 50 : 30,
      protocols: 40,
      community: risk_level === "high" ? 10 : 30
    }
  };
}

async function analyzeQuery(query: string): Promise<QueryAnalysis> {
  if (!config.grok.apiKey) return localFallback(query);

  try {
    const response = await axios.post(
      "https://api.x.ai/v1/chat/completions",
      {
        model: "grok-4.20-reasoning",
        messages: [
          { role: "system", content: QUERY_INTELLIGENCE_PROMPT },
          { role: "user", content: query }
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
    return JSON.parse(raw) as QueryAnalysis;
  } catch {
    return localFallback(query);
  }
}

export default analyzeQuery;
