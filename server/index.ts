import express from "express";
import cors from "cors";
import config from "../config";

import searchRoute from "./routes/search";
import moderationRoute from "./routes/moderation";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("JH AI Search Demo Running");
});

app.use("/search", searchRoute);
app.use("/moderate", moderationRoute);

app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
});
