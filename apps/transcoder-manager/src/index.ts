import express from "express";
import bodyParser from "body-parser";

import { config } from "./config.js";
import { logger } from "./logger.js";
import { transcodeRequestSchema } from "./schema.js";

const app = express();

app.use(bodyParser.json());

// Start transcoding
app.post("/transcode", async (req, res) => {
  const result = transcodeRequestSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ reason: result.error.format() });
    return;
  }

  await Promise.resolve();

  throw new Error("Not implemented");
});

app.listen(config.port, () => {
  logger.info(`Server is listening on port ${config.port}`);
});
