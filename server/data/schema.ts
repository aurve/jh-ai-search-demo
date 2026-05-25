import type { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

const schema: CollectionCreateSchema = {
  name: "jh_content",
  fields: [
    { name: "id", type: "string" },
    { name: "content_type", type: "string" },
    { name: "title", type: "string" },
    { name: "body", type: "string" },
    { name: "tags", type: "string[]" },
    { name: "category", type: "string" },
    { name: "author_type", type: "string" },
    { name: "created_at", type: "int64" },
    { name: "deep_link", type: "string" },
    { name: "moderation_status", type: "string" },
    { name: "risk_score", type: "int32" }
  ],
  default_sorting_field: "created_at"
};

export default schema;
