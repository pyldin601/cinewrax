import express from "express";
import bodyParser from "body-parser";
import { StatusCodes } from "http-status-codes";

import { Server } from "socket.io";
import { Redis } from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter";

import { config } from "./config.js";
import { logger } from "./logger.js";

const pubClient = Redis.createClient();
const subClient = pubClient.duplicate();

pubClient.on("error", (err) => logger.error(err));
subClient.on("error", (err) => logger.error(err));

const io = new Server({
  path: "/api/ws/",
  transports: ["websocket"],
  adapter: createAdapter(pubClient, subClient),
});

io.use((socket, next) => {
  const sessionId = socket.handshake.query.sessionId;

  if (sessionId) {
    socket.join(sessionId);
    next();
  } else {
    next(new Error("Query parameter sessionId is required"));
  }
});

const app = express();

app.use(bodyParser.json());

app.post("/api/sessions/:sessionId/events", async (req, res) => {
  const { sessionId } = req.params;
  const body = req.body;

  io.in(sessionId).emit("event", body);

  res.status(StatusCodes.ACCEPTED).end();
});

const server = app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});

io.attach(server);
