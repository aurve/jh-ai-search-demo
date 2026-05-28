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
      query_by: "name,description,primary_category_slug"
    }),
    client.collections(config.typesense.collectionName).documents().search({
      q: query,
      query_by: "name,description,primary_category_slug",
      per_page: 0
    })
  ]);

  return {
    hits: approvedResults.hits ?? [],
    suppressedCount: suppressedResults.found ?? 0
  };
}

export default searchDocuments;
