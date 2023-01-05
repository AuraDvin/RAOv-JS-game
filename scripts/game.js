import { Player } from './player.js';
import { KeysHandler, mouseHandler } from './inputHandler.js';
import { ui_setup, ui_update, ui_draw } from './ui.js';
import { scaleHandler } from './zoomHandle.js';
import { bg_draw, bg_setup, bg_update } from './bg.js';

export let view = [1, 0, 0, 1, 0, 0];  // Matrix representing the view. (scale, 0, 0, scale, widthNew, HeightNew)

/**@type {Player} */
let player;
/** @type {HTMLCanvasElement} */
let canvas;
/** @type {CanvasRenderingContext2D} */
let ctx;
let isRunning = true;
let lastRender = 0;
let assets = "/assets/";
export let backgroundImage = new Image(1920, 1080);
let backgroundPatrn;


addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('username');
  if (!user)  player = new Player(assets + 'player.png', 'I decided not to input my name');
  else player = new Player(assets + 'player.png', user);
  canvas = document.getElementById("player");
  canvas.focus();
  canvas.width = 1920;
  canvas.height = 1080;
  
  ctx = canvas.getContext('2d');

  backgroundImage.src = '/assets/alphaBackground.png';
  backgroundImage.onload = () =>{ backgroundPatrn = ctx.createPattern(backgroundImage, 'repeat'); }; // fixes the black background

  ui_setup();

  // addEventListener('wheel', scaleHandler, false); //removed because i couldn't figure it out 😔
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
  ctx.clearRect(-100, -100, canvas.width + player.getPosition().x, canvas.height + player.getPosition().y);
  ctx.fillStyle = backgroundPatrn;
  ctx.fillRect(0, 0, 7680, 4320);
  player.draw(ctx);
  
  ui_draw();
}

async function update(progress) {
  player.update(progress);
  view[4] = -player.getPosition().x + canvas.width * 0.5 - player.getSprite().width * 0.5;
  view[5] = -player.getPosition().y + canvas.height * 0.5 - player.getSprite().height * 0.5;

  ctx.setTransform(view[0], view[1], view[2], view[3], view[4], view[5]);
}
