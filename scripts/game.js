import { Player } from './player.js';
import { KeysHandler, KeysPressed } from './movementHandler.js';

let player;
/** @type {HTMLCanvasElement} */
let canvas;
/** @type {HTMLCanvasElement} */
let canvasUI;
/** @type {CanvasRenderingContext2D} */
let ctx;
/** @type {CanvasRenderingContext2D} */
let ctxUI;
// let cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let canvasZoom = 1;
let cameraZoom = 1;
let isRunning = true;
const MAX_ZOOM = 2;
const MIN_ZOOM = 0.4;
const SCROLL_SENSITIVITY = 0.0005
let lastRender = 0;
let assets = "../assets/";
const view = [1, 0, 0, 1, 0, 0];  // Matrix representing the view. (scale, 0, 0, scale, widthNew, HeightNew)
let fps;

addEventListener('DOMContentLoaded', () => {
  player = new Player(assets + 'player.png', 'Bingus Janez');
  canvas = document.getElementById("player");
  canvas.width = 1920;
  canvas.height = 1080;

  canvasUI = document.getElementById('ui');
  canvasUI.width = 1920;
  canvasUI.height = 1080;

  ctx = canvas.getContext('2d');

  ctxUI = canvasUI.getContext('2d');
  ctxUI.font = '42px Sans-serif';
  addEventListener('wheel', scaleHandler, false);
  addEventListener('keydown', KeysHandler, false);
  addEventListener('keyup', KeysHandler, false);
  addEventListener('mouseover', () => { canvas.focus(); });

  window.requestAnimationFrame(loop);
});



//! beta feature (now it just needs to scale from the center not the top left :P)
function scaleHandler(event) {
  cameraZoom = 1;
  cameraZoom -= event.deltaY * SCROLL_SENSITIVITY;
  cameraZoom = Math.max(Math.min(cameraZoom, MAX_ZOOM), MIN_ZOOM);

  canvasZoom *= cameraZoom;

  if (canvasZoom > 5) {
    console.log(`zoom over 5 ${canvasZoom}`);
    canvasZoom = 5;
  } else if (canvasZoom < 0.2) {
    console.log(`zoom under 0.2 ${canvasZoom}`);
    canvasZoom = 0.2;
  } else {
    view[0] *= cameraZoom;
    view[3] *= cameraZoom;
  }

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
  ctx.clearRect(-100, -100, canvas.width, canvas.height);
  ctxUI.clearRect(0,0,1920,1080);
  // ctx.fillText(fps.toString() + ' fps', -player.getPosition().x + canvas.width * 0.5 - player.getSprite().width * 0.5, 42);
  ctxUI.fillText(fps, 0, 42);
  ctx.fillRect(10, 10, 10, 10);
  ctx.drawImage(player.getSprite(), player.getPosition().x, player.getPosition().y);

}


async function update(progress) {
  fps = 1000 / progress;
  fps = fps.toFixed(0).toString() + ' fps';
  player.handleMove(KeysPressed, progress);
  view[4] = -player.getPosition().x + canvas.width * 0.5 - player.getSprite().width * 0.5;
  view[5] = -player.getPosition().y + canvas.height * 0.5 - player.getSprite().height * 0.5;

  ctx.setTransform(view[0], view[1], view[2], view[3], view[4], view[5]);


}
