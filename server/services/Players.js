class Players {
  constructor() {
    this.list = [];
  }

  length() {
    return this.list.length;
  }

  addPlayer(player) {
    this.list.push(player);
  }

  async removePlayer(player) {
    await this.list.pop(this.list.indexOf(player));
  }
}

module.exports = { Players };
