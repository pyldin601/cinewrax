import express from "express";
import bodyParser from "body-parser";
import { Server } from "socket.io";

const app = express();

app.use(bodyParser.json());

const server = app.listen(3000, () => {});

const io = new Server({
  path: "/socket/",
  transports: ["websocket"],
});

io.attach(server);
