import type { CollectionCreateSchema } from "typesense/lib/Typesense/Collections";

const schema: CollectionCreateSchema = {
  name: "jh_content",
  fields: [
    { name: "id", type: "string" },
    { name: "content_type", type: "string" },
    { name: "name", type: "string" },
    { name: "description", type: "string" },
    { name: "tags", type: "string[]" },
    { name: "primary_category_slug", type: "string" },
    { name: "author_type", type: "string" },
    { name: "created_at", type: "int64" },
    { name: "website", type: "string" },
    { name: "moderation_status", type: "string" },
    { name: "risk_score", type: "int32" }
  ],
  default_sorting_field: "created_at"
};

export default schema;
