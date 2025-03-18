const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME ?? "localhost";
const port = process.env.PORT ?? 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("a user connected");

    //refreshing frontend players list
    socket.on("fetchPlayers", (gameId) => {
      socket.join(gameId);
      socket.to(gameId).emit("fetchPlayers", null);
    });

    socket.on("privateMessage", (gameId) => {
      console.log("recieved in the backend");
      socket.to(gameId).emit("privateMessage", null);
    });

    //kicking all players from game on owners leave
    socket.on("ownerLeft", (gameId) => {
      socket.to(gameId).emit("ownerLeft", null);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
