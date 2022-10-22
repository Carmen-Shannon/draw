// Global Variables
import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
import {
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
  rightPlayers,
} from "./js/Globals.js";

const socket = io("ws://localhost:8080");

// modifiable variables
let painting = false;
let erasing = false;
let lineSize = 10;
let color = "black";

// functions
function updatePlayers(playerList) {
  for (let p of document.getElementsByClassName("playerbox")) {
    p.remove();
  }
  for (let p of playerList) {
    if (document.getElementById(p.id)) {
      document.getElementById(p.id).remove();
    }
    createPlayer(p);
  }
}

function createPlayer(newPlayer) {
  let el = document.createElement("div");
  el.className = "playerbox";
  el.id = newPlayer.id;
  el.innerHTML = newPlayer.id;
  if (leftPlayers.childElementCount >= 4) {
    rightPlayers.appendChild(el);
  } else {
    leftPlayers.appendChild(el);
  }
}

function removePlayer(id) {
  if (document.getElementById(id)) {
    document.getElementById(id).remove();
  }
}

function colorModalOnClick() {
  for (let c of modal.children) {
    if (c.id === "closemodal") continue;
    c.addEventListener("click", () => {
      color = c.id;
      erasing = false;
      colorChange();
      recolor();
    });
  }
}

function colorChange() {
  for (let c of modal.children) {
    if (c.id === "closemodal") continue;
    if (c.id === color) {
      c.style.width = "30px";
      c.style.height = "30px";
      c.style.margin = "15px";
    } else {
      c.style.width = "60px";
      c.style.height = "60px";
      c.style.margin = "0px";
    }
  }
}

function setColors() {
  const colors = modal.children;
  for (let c of colors) {
    c.style.backgroundColor = c.id;
    c.style.margin = "0px";
    c.style.border = "none";
  }
}

function showModal() {
  modal.style.display = "flex";
  modal.style.flexWrap = "wrap";
  modal.style.width = "240px";
  modal.style.height = "150px";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.margin = "10px";
  modal.style.padding = "20px";
  modal.style.paddingTop = "40px";
  modal.style.backgroundColor = "#faeddd";
  modal.style.border = "2px solid black";
  modal.style.position = "absolute";
  modal.style.top = `${colorPicker.offsetTop + colorPicker.offsetWidth}px`;
  modal.style.left = `${colorPicker.offsetLeft - 120}px`;
  closeBtn.style.position = "fixed";
  closeBtn.style.display = "block";
  closeBtn.style.top =
    modal.offsetTop + Math.round(modal.offsetHeight * 0.05) + "px";
  closeBtn.style.left =
    modal.offsetLeft + Math.round(modal.offsetWidth * 0.9) + "px";
}

function hideModal() {
  modal.style.display = "none";
}

function toggleModal() {
  if (modal.style.display === "none") {
    showModal();
    colorChange();
  } else {
    hideModal();
  }
}

function toggleEraser() {
  erasing = !erasing;
  if (erasing) {
    colorPicker.style.backgroundColor = "#faeddd";
    preview.style.backgroundColor = "#faeddd";
  } else {
    recolor();
  }
}

function clearBoard() {
  canvas.width = canvas.width;
  socket.emit("clear");
}

function increaseBrush() {
  lineSize = Math.min(lineSize + 5, 40);
  resizeBrush();
}

function decreaseBrush() {
  lineSize = Math.max(lineSize - 5, 10);
  resizeBrush();
}

function recolor() {
  colorPicker.style.backgroundColor = color;
  preview.style.backgroundColor = color;
}

function resizeBrush() {
  preview.style.width = `${lineSize}px`;
  preview.style.height = `${lineSize}px`;
}

function startPaint(e) {
  painting = true;
  draw(e);
}

function finishPaint() {
  painting = false;
  ctx.beginPath();
  socket.emit("finishdraw");
}

function startErase(e) {
  erasing = true;
  draw(e);
}

function finishErase() {
  erasing = false;
  ctx.beginPath();
}

function draw(e) {
  if (!painting) return;
  if (erasing) {
    ctx.strokeStyle = "#faeddd";
  } else {
    ctx.strokeStyle = color;
  }
  ctx.lineWidth = lineSize;
  ctx.lineCap = "round";
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
  const drawCoord = {
    x: e.offsetX,
    y: e.offsetY,
    ls: lineSize,
    clr: color,
  };
  socket.emit("draw", drawCoord);
}

socket.on("draw", (coord) => {
  ctx.strokeStyle = coord.clr;
  ctx.lineWidth = coord.ls;
  ctx.lineCap = "round";
  ctx.lineTo(coord.x, coord.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(coord.x, coord.y);
});

socket.on("finishdraw", () => {
  ctx.beginPath();
});

socket.on("clear", () => {
  canvas.width = canvas.width;
});

socket.on("newplayer", ({ newPlayer, playerList }) => {
  updatePlayers(playerList);
  console.log(`new player joined - ${newPlayer.id}`);
  console.log(`your player id - ${socket.id}`);
  console.log(`current players - ${playerList.length}`);
});

socket.on("removedplayer", ({ newPlayer, playerList }) => {
  removePlayer(newPlayer.id);
  updatePlayers(playerList);
  console.log(`player disconnected - ${newPlayer.id}`);
  console.log(`your player id - ${socket.id}`);
  console.log(`current players - ${playerList.length}`);
});

// button events
eraser.addEventListener("click", toggleEraser);
clear.addEventListener("click", clearBoard);
bigger.addEventListener("click", increaseBrush);
smaller.addEventListener("click", decreaseBrush);
colorPicker.addEventListener("click", () => {
  toggleModal();
});

// set default color to black and size to 10 on load
window.addEventListener("load", () => {
  recolor();
  resizeBrush();
  setColors();
  colorModalOnClick();
});

window.addEventListener("beforeunload", () => {
  socket.emit("disconnect");
});

closeBtn.addEventListener("click", toggleModal);

// erasing vs painting event
if (erasing) {
  canvas.addEventListener("mousedown", startErase);
  canvas.addEventListener("mouseup", finishErase);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseout", finishErase);
} else {
  canvas.addEventListener("mousedown", startPaint);
  canvas.addEventListener("mouseup", finishPaint);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener("mouseout", finishPaint);
}

window.addEventListener("keypress", (e) => {
  if (e.key === "e") {
    console.log(closeBtn.parentElement.offsetTop);
  }
});
