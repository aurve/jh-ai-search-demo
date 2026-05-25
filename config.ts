import "dotenv/config";

const config = {
  server: {
    port: Number(process.env.PORT) || 5000
  },
  typesense: {
    host: process.env.TYPESENSE_HOST || "localhost",
    port: Number(process.env.TYPESENSE_PORT) || 8108,
    protocol: process.env.TYPESENSE_PROTOCOL || "http",
    apiKey: process.env.TYPESENSE_API_KEY || "xyz",
    collectionName: process.env.COLLECTION_NAME || "jh_content"
  },
  grok: {
    apiKey: process.env.GROK_API_KEY || ""
  }
};

export default config;
