const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("user connected");
    socket
      .on("joinGame", (gameId) => {
        socket.join(gameId);
        console.log("joined game: ", gameId);
        socket.to(gameId).emit("refreshData");
        console.log("refreshing data");
      })
      .on("refreshData", (gameId) => {
        console.log("refreshing data");
        socket.to(gameId).emit("refreshData");
      })
      .on("ownerLeft", (gameId) => {
        socket.to(gameId).emit("ownerLeft");
      })
      .on("startGame", async ({ gameId, players }) => {
        console.log("starting game", players);
        socket.to(gameId).emit("startGame");
      })
      .on("kickPlayer", ({ gameId, playerId }) => {
        socket.to(gameId).emit("kickPlayer", playerId);
      })
      .on("disconnect", () => {
        console.log("a user disconnected");
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
