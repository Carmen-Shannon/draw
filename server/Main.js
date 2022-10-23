const http = require("http").createServer();
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});
const { Player } = require("./models/Player");
let currentPos = 0;
const players = [];

const findPlayer = (id) => {
  for (let p of players) {
    if (p.id === id) {
      return p;
    }
  }
  return null;
};

const Timer = {
  time: 5,
  running: false,
  reset() {
    this.time = 5;
    this.running = false;
  },
  start() {
    this.running = true;
    const t = setInterval(async () => {
      if (this.time === 0) {
        await io.emit("timertick", this.time);
        posChange();
        this.reset();
        clearInterval(t);
        return;
      }
      await io.emit("timertick", this.time);
      this.time--;
    }, 1000);
  },
};

function posChange() {
  if (currentPos + 1 < players.length) {
    currentPos += 1;
    io.emit("poschange", currentPos);
    return;
  }
  currentPos = 0;
  io.emit("poschange", currentPos);
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

  socket.on("starttimer", () => {
    if (Timer.running) return;
    Timer.start(io);
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

  socket.on("disconnect", async () => {
    console.log("player left");
    await players.pop(players.indexOf(socket.id));
    await io.emit("removedplayer", {
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
