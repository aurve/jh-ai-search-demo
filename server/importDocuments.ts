import client from "./services/typesense";
import documents from "./data/documents.json";
import config from "../config";

async function importDocuments() {

  try {

    const response = await client
      .collections(config.typesense.collectionName)
      .documents()
      .import(documents);

    console.log("Documents imported successfully:");
    console.log(response);

  } catch (error: any) {

    console.error("Import failed:");

    if (error?.httpStatus) {
      console.error("HTTP Status:", error.httpStatus);
    }

    if (error?.message) {
      console.error("Message:", error.message);
    }

    console.error(error);
  }
}

importDocuments();
