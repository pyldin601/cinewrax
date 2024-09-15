import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { Redis } from "ioredis";

export function createWebSocket(pubRedisClient: Redis, subRedisClient: Redis): Server {
  const io = new Server({
    path: "/api/ws/",
    transports: ["websocket"],
    adapter: createAdapter(pubRedisClient, subRedisClient),
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

  return io;
}
