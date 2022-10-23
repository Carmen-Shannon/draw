// const Timer = {
//   time: 5,
//   running: false,
//   reset() {
//     this.time = 5;
//     this.running = false;
//   },
//   start() {
//     this.running = true;
//     const t = setInterval(async () => {
//       if (this.time === 0) {
//         await io.emit("timertick", this.time);
//         posChange();
//         this.reset();
//         clearInterval(t);
//         return;
//       }
//       await io.emit("timertick", this.time);
//       this.time--;
//     }, 1000);
//   },
// };

class Timer {
  constructor(server, limit) {
    this.time = limit;
    this.limit = limit;
    this.running = false;
    this.server = server;
    this.instance = undefined;
  }

  reset() {
    this.time = this.limit;
    this.running = false;
  }

  stop() {
    clearInterval(this.instance);
  }

  start(
    event,
    data = undefined,
    func = function () {
      return;
    }
  ) {
    this.running = true;
    const t = setInterval(() => {
      if (this.time === 0) {
        this.server.emit(event, data);
        func();
        this.reset();
        clearInterval(t);
        return;
      }
      this.tick();
    }, 1000);
    this.instance = t;
  }

  tick() {
    this.time--;
  }
}

module.exports = Timer;
