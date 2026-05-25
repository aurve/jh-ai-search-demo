import client from "./services/typesense";
import schema from "./data/schema";

async function createCollection() {

  try {

    const response = await client
      .collections()
      .create(schema);

    console.log("Collection created successfully:");
    console.log(response);

  } catch (error: any) {

    console.error("Collection creation failed:");

    if (error?.httpStatus) {
      console.error("HTTP Status:", error.httpStatus);
    }

    if (error?.message) {
      console.error("Message:", error.message);
    }

    console.error(error);
  }
}

createCollection();