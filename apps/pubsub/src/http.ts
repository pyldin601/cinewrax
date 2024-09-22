import express, { Application } from "express";
import bodyParser from "body-parser";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { Server } from "socket.io";
import { Redis } from "ioredis";
import { serializeError } from "serialize-error";

import { logger } from "./logger.js";

export function createApp(ioServer: Server, pubClient: Redis, subClient: Redis): Application {
  const app = express();

  app.use(bodyParser.json());

  app.get("/health/ready", async (_req, res) => {
    try {
      await subClient.ping();
      await subClient.ping();
      res.status(StatusCodes.OK).json({});
    } catch (err) {
      const serializedError = serializeError(err);
      logger.warn({ reason: serializedError }, "Readiness check failed");
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end(getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    }
  });

  app.post("/api/sessions/:sessionId/events", async (req, res) => {
    const { sessionId } = req.params;
    const body = req.body;

    ioServer.in(sessionId).emit("event", body);

    res.status(StatusCodes.ACCEPTED).end();
  });

  return app;
}
