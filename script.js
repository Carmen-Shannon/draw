// GLOBAL VARIABLES
const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const colorPicker = document.getElementById("color");
const preview = document.getElementById("preview");
const eraser = document.getElementById("eraser");
const clear = document.getElementById("clear");
const bigger = document.getElementById("bigger");
const smaller = document.getElementById("smaller");
const modal = document.getElementById("colormodal");

// modifiable variables
let painting = false;
let erasing = false;
let lineSize = 10;
let color = "black";

// functions
function colorModalOnClick() {
  for (let c of modal.children) {
    c.addEventListener("click", () => {
      color = c.id;
      colorChange();
      recolor();
    });
  }
}

function colorChange() {
  for (let c of modal.children) {
    if (c.id === color) {
      c.style.width = "40px";
      c.style.height = "40px";
    } else {
      c.style.width = "60px";
      c.style.height = "60px";
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

function toggleModal() {
  if (modal.style.display === "none") {
    modal.style.display = "flex";
    modal.style.flexWrap = "wrap";
    modal.style.width = "240px";
    modal.style.height = "150px";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.margin = "10px";
    modal.style.padding = "20px";
    modal.style.backgroundColor = "#faeddd";
    modal.style.border = "2px solid black";
    colorChange();
  } else {
    modal.style.display = "none";
  }
}

function toggleEraser() {
  erasing = !erasing;
  if (erasing) {
    colorPicker.style.backgroundColor = "#faeddd";
  } else {
    recolor();
  }
}

function clearBoard() {
  canvas.width = canvas.width;
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
}

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

modal.addEventListener("mouseleave", toggleModal);

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
