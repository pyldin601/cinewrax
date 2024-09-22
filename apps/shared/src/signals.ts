import { Server } from "node:http";

export function awaitGracefulShutdown(): Promise<NodeJS.Signals> {
  return new Promise((resolve) => {
    const shutdownHandler = (signal: NodeJS.Signals) => {
      resolve(signal);
    };

    process.on("SIGTERM", shutdownHandler);
    process.on("SIGINT", shutdownHandler);
  });
}

type CloseCallback = (err?: Error) => void;
type CloseFn = (cb: CloseCallback) => void;
export function closeServerGracefully(server: { close: CloseFn }): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
