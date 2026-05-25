import client from "./typesense";
import config from "../../config";

interface SearchResult {
  hits: object[];
  suppressedCount: number;
}

async function searchDocuments(query: string): Promise<SearchResult> {
  const [approvedResults, suppressedResults] = await Promise.all([
    client.collections(config.typesense.collectionName).documents().search({
      q: query,
      query_by: "title,body,tags",
      filter_by: "moderation_status:approved"
    }),
    client.collections(config.typesense.collectionName).documents().search({
      q: query,
      query_by: "title,body,tags",
      filter_by: "moderation_status:requires_review",
      per_page: 0
    })
  ]);

  return {
    hits: approvedResults.hits ?? [],
    suppressedCount: suppressedResults.found ?? 0
  };
}

export default searchDocuments;
