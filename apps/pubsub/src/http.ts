import express, { Application } from "express";
import bodyParser from "body-parser";
import { StatusCodes } from "http-status-codes";
import { Server } from "socket.io";

export function createApp(ioServer: Server): Application {
  const app = express();

  app.use(bodyParser.json());

  app.post("/api/sessions/:sessionId/events", async (req, res) => {
    const { sessionId } = req.params;
    const body = req.body;

    ioServer.in(sessionId).emit("event", body);

    res.status(StatusCodes.ACCEPTED).end();
  });

  return app;
}
