const http = require("http").createServer();
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});
const { Player } = require("./models/Player");
const Timer = require("./services/Timer.js");
let currentPos = 0;
const players = [];
const timers = new Map();

const findPlayer = (id) => {
  for (let p of players) {
    if (p.id === id) {
      return p;
    }
  }
  return null;
};

function posChange() {
  if (currentPos + 1 < players.length) {
    currentPos += 1;
    return;
  }
  currentPos = 0;
}

io.on("connection", (socket) => {
  if (players.length >= 8) {
    socket.disconnect();
    console.log("lobby full");
    return;
  }

  let newPlayer = new Player(socket.id, socket.id, players.length + 1);
  players.push(newPlayer);
  console.log("player joined");
  console.log(newPlayer);
  io.emit("newplayer", {
    newPlayer: newPlayer,
    playerList: players,
  });

  socket.on("newmessage", (message) => {
    if (message.id === players[currentPos].id) {
      return;
    }
    if (timers.has(message.id)) {
      io.emit("messagedelete", message.id);
      timers.get(message.id).stop();
      timers.delete(message.id);
    }
    const msgTimer = new Timer(io, 3);
    msgTimer.start("messagedelete", message.id);
    timers.set(message.id, msgTimer);
    io.emit("showmessage", message);
  });

  socket.on("starttimer", () => {
    const t = new Timer(io, 20);
    t.start("poschange", currentPos, posChange);
  });

  socket.on("newpainter", (id) => {
    let newPainter = findPlayer(id);
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

  socket.on("disconnect", () => {
    console.log("player left");
    players.pop(players.indexOf(socket.id));
    io.emit("removedplayer", {
      newPlayer: newPlayer,
      playerList: players,
    });
    posChange();
  });

  io.emit("currentpos", currentPos);
});

http.listen(8080, () => {
  console.log("listening on http://localhost:8080");
});
