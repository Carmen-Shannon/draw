const http = require("http").createServer();
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});
const { Player } = require("./models/Player");

const players = [];
let currentPos = 1;
let timer = 20;

io.on("connection", (socket) => {
  if (players.length >= 8) {
    socket.disconnect();
    console.log("lobby full");
    return;
  }
  console.log("player joined");
  console.log(players);

  let newPlayer = new Player(socket.id, socket.id, players.length + 1);
  players.push(newPlayer);
  io.emit("newplayer", {
    newPlayer: newPlayer,
    playerList: players,
  });

  socket.on("newpainter", (newPainter) => {
    io.emit("newpainter", newPainter);
  });

  socket.on("draw", (coord) => {
    io.emit("draw", coord);
  });

  socket.on("finishdraw", () => {
    io.emit("finishdraw");
  });

  socket.on("clear", () => {
    io.emit("clear");
  });

  socket.on("disconnect", async () => {
    console.log("player left");
    await players.pop(players.indexOf(socket.id));
    if (newPlayer.isDrawing) {
      // end round
    }
    await io.emit("removedplayer", {
      newPlayer: newPlayer,
      playerList: players,
    });
  });
});

http.listen(8080, () => {
  console.log("listening on http://localhost:8080");
});
