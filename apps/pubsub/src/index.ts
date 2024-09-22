import { Redis } from "ioredis";

import { config } from "./config.js";
import { logger } from "./logger.js";
import { createApp } from "./http.js";
import { createWebSocket } from "./ws.js";

const pubClient = new Redis(config.redisUrl);
const subClient = pubClient.duplicate();

pubClient.on("error", (err) => logger.error(err));
subClient.on("error", (err) => logger.error(err));

await pubClient.ping();
await subClient.ping();

const ws = createWebSocket(pubClient, subClient);
const app = createApp(ws, pubClient, subClient);

const server = app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});

ws.attach(server);

// TODO Await shutdown signal
// TODO Disconnect
// TODO Shutdown
