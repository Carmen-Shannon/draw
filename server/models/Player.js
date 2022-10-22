class Player {
  constructor(name, id, pos) {
    this.name = name;
    this.id = id;
    this.points = 0;
    this.isDrawing = false;
    this.position = pos;
  }

  toJson() {
    return {
      name: this.name,
      id: this.id,
      points: this.points,
      isDrawing: this.isDrawing,
      position: this.position,
    };
  }
}

module.exports = { Player };
