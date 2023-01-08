import { Player } from './player.js';
import { KeysHandler, mouseHandler } from './inputHandler.js';
import { ui_setup, ui_update, ui_draw } from './ui.js';
import { scaleHandler } from './zoomHandle.js';
import { bg_draw, bg_setup, bg_update } from './bg.js';

export let view = [1, 0, 0, 1, 0, 0];  // Matrix representing the view. (scale, 0, 0, scale, widthNew, HeightNew)


export let player;
/** @type {HTMLCanvasElement} */
let canvas;
/** @type {CanvasRenderingContext2D} */
let ctx;
export let isRunning = true;
let lastRender = 0;
let assets = "./assets/";
let backgroundImage = new Image(1920, 1080);
let backgroundPatrn;

export function changePause(){
  isRunning = !isRunning;
}

addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('username');
  const color = localStorage.getItem('color');
  // const fpsLock = parseInt(localStorage.getItem('fpsLock'));
  // const fpsLock = 16;
  player = new Player(assets + 'player.png', user,  color);
  canvas = document.getElementById("player");
  canvas.focus();
  canvas.width = 1920;
  canvas.height = 1080;
  
  ctx = canvas.getContext('2d');

  // backgroundImage.src = assets + '/alphaBackground.png';
  // backgroundImage.onload = () =>{ backgroundPatrn = ctx.createPattern(backgroundImage, 'repeat'); }; // fixes the black background

  ui_setup();
  bg_setup();

  // addEventListener('wheel', scaleHandler, false); //removed because i couldn't figure it out 😔
  addEventListener('keydown', KeysHandler, false);
  addEventListener('keyup', KeysHandler, false);
  // addEventListener('auxclick', mouseHandler, false);
  // addEventListener('mouseover', () => { canvas.focus(); });


  window.requestAnimationFrame(loop);
  // const interval = setInterval(window.requestAnimationFrame, 16, loop);
});

async function loop(timestamp) {
  let progress = timestamp - lastRender;
  lastRender = timestamp;
  ui_update(progress);
  if (isRunning) {
    player.update(progress);
    update(progress);
    bg_update(progress);
  }
  bg_draw();
  draw();
  window.requestAnimationFrame(loop);
}

async function draw() {
  ctx.clearRect(-100, -100, canvas.width + player.getPosition().x, canvas.height + player.getPosition().y);
  // ctx.fillStyle = backgroundPatrn;
  // ctx.fillRect(0, 0, 1280, 720);
  player.draw(ctx);
  
  ui_draw();
}

async function update(progress) {
  // what sets the player in the middle of the context
  view[4] = -player.getPosition().x + canvas.width * 0.5 - player.getSprite().width * 0.5;
  view[5] = -player.getPosition().y + canvas.height * 0.5 - player.getSprite().height * 0.5;
  
  ctx.setTransform(view[0], view[1], view[2], view[3], view[4], view[5]);   // applies the change
}
