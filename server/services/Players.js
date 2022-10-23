class Players {
  constructor() {
    this.list = [];
  }

  findPlayer(id) {
    for (let p of this.list) {
      if (p.id === id) {
        return p;
      }
    }
    return null;
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
