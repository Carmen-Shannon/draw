const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("color");
const preview = document.getElementById("preview");
const eraser = document.getElementById("eraser");
const clear = document.getElementById("clear");
const bigger = document.getElementById("bigger");
const smaller = document.getElementById("smaller");
const modal = document.getElementById("colormodal");
const closeBtn = document.getElementById("closemodal");
const leftPlayers = document.getElementById('leftcontainer');
const rightPlayers = document.getElementById('rightcontainer');

export {
  canvas,
  ctx,
  colorPicker,
  preview,
  eraser,
  clear,
  bigger,
  smaller,
  modal,
  closeBtn,
  leftPlayers,
  rightPlayers
};
