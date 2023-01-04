import { Player } from './player.js';
import { KeysHandler, mouseHandler } from './inputHandler.js';
import { ui_setup, ui_update, ui_draw } from './ui.js';
import { scaleHandler } from './zoomHandle.js';
import { bg_draw, bg_setup, bg_update } from './bg.js';

export let view = [1, 0, 0, 1, 0, 0];  // Matrix representing the view. (scale, 0, 0, scale, widthNew, HeightNew)

// let cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
/**@type {Player} */
let player;
/** @type {HTMLCanvasElement} */
let canvas;
/** @type {CanvasRenderingContext2D} */
let ctx;
let isRunning = true;
let lastRender = 0;
let assets = "../assets/";


addEventListener('DOMContentLoaded', () => {
  player = new Player(assets + 'player.png', 'Bingus Janez');
  canvas = document.getElementById("player");
  canvas.focus();
  canvas.width = 1920;
  canvas.height = 1080;

  ctx = canvas.getContext('2d');

  ui_setup();
  bg_setup();
  bg_draw();

  addEventListener('wheel', scaleHandler, false);
  addEventListener('keydown', KeysHandler, false);
  addEventListener('keyup', KeysHandler, false);
  addEventListener('auxclick', mouseHandler, false);

  addEventListener('mouseover', () => { canvas.focus(); });

  window.requestAnimationFrame(loop);
});

async function loop(timestamp) {
  let progress = timestamp - lastRender;
  lastRender = timestamp;
  update(progress);
  ui_update(progress);
  draw();
  window.requestAnimationFrame(loop);
}

async function draw() {
  bg_draw();
  ctx.clearRect(-100, -100, canvas.width, canvas.height);
  ui_draw();
  ctx.fillRect(10, 10, 10, 10);
  ctx.drawImage(player.getSprite(), player.getPosition().x, player.getPosition().y);
}

async function update(progress) {
  player.update(progress);
  bg_update(progress, player.getPosition());
  view[4] = -player.getPosition().x + canvas.width * 0.5 - player.getSprite().width * 0.5;
  view[5] = -player.getPosition().y + canvas.height * 0.5 - player.getSprite().height * 0.5;

  ctx.setTransform(view[0], view[1], view[2], view[3], view[4], view[5]);
}
