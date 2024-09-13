import express from "express";
import bodyParser from "body-parser";
import { Server } from "socket.io";
import { StatusCodes } from "http-status-codes";

import { config } from "./config.js";
import { logger } from "./logger.js";

const io = new Server({
  path: "/api/ws/",
  transports: ["websocket"],
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
