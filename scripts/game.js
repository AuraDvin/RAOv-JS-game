import { Player } from './player.js';
import { KeysHandler, KeysPressed } from './movementHandler.js';

let player;
/** @type {HTMLCanvasElement} */
let canvas;
/** @type {CanvasRenderingContext2D} */
let ctx;
let cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let cameraZoom = 1;
let isRunning = true;
const MAX_ZOOM = 2;
const MIN_ZOOM = 0.4;
const SCROLL_SENSITIVITY = 0.0005
let lastRender = 0;
let assets = "../assets/";


addEventListener('DOMContentLoaded', () => {
  player = new Player(assets + 'player.png', 'Bingus Janez');
  canvas = document.getElementById("player");
  canvas.width = 1920;
  canvas.height = 1080;

  ctx = canvas.getContext('2d');
  // ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
  // ctx.scale(cameraZoom, cameraZoom);
  // ctx.translate(-window.innerWidth / 2 + cameraOffset.x, -window.innerHeight / 2 + cameraOffset.y);
  // drawBG();
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  addEventListener('wheel', scaleHandler, false);
  addEventListener('keydown', KeysHandler, false);
  addEventListener('keyup', KeysHandler, false);
  addEventListener('mouseover', () => { canvas.focus(); });
  window.requestAnimationFrame(loop);
});


//! beta feature (limit zoom not added yet :P)
function scaleHandler(event) {
  cameraZoom = 1;
  cameraZoom += event.deltaY * SCROLL_SENSITIVITY;
  cameraZoom = Math.min(cameraZoom, MAX_ZOOM);
  cameraZoom = Math.max(cameraZoom, MIN_ZOOM);
  ctx.scale(cameraZoom, cameraZoom);
  // ctx.translate(-window.innerWidth / 2 + cameraOffset.x, -window.innerHeight / 2 + cameraOffset.y);
  // console.log(cameraZoom);
}


//! Game loop
async function loop(timestamp) {
  let progress = timestamp - lastRender;
  lastRender = timestamp;

  update(progress);
  draw();

  window.requestAnimationFrame(loop);
}


async function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(player.getSprite(), player.getPosition().x, player.getPosition().y);

}


async function update(progress) {
  let move = {
    x: 0,
    y: 0
  }
  //. Up is negative, down is positive (origin in topleft)
  if (KeysPressed['w']) {
    move.y = -player.speed;
  } else if (KeysPressed['s']) {
    move.y = player.speed;
  }

  if (KeysPressed['d']) {
    move.x = player.speed;
  } else if (KeysPressed['a']) {
    move.x = -player.speed;
  }

  if ((move.x) && (move.x == move.y || -move.x == move.y)) {
    move.x = player.diagSpeed * Math.sign(move.x);
    move.y = player.diagSpeed * Math.sign(move.y);
  }
  move.x *= progress;
  move.y *= progress;

  player.move(move);



}