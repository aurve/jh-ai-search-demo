import Typesense from "typesense";
import config from "../../config";

const client = new Typesense.Client({
  nodes: [
    {
      host: config.typesense.host,
      port: config.typesense.port,
      protocol: config.typesense.protocol
    }
  ],
  apiKey: config.typesense.apiKey,
  connectionTimeoutSeconds: 10
});

export default client;