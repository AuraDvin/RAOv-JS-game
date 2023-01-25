import { KeysHandler, areSettingsSet, KeysPressed } from './inputHandler.js';
import { setMusic, muteMusic, lowerMusic, higherMusic, isMusicMuted } from './sound.js';

import { init_ui, update_ui } from './ui.js';
import { bg_draw, bg_setup, bg_update } from './bg.js';

import { Player } from './player.js';
import { spawnMobs, updateMobs, drawMobs } from './enemy.js';
import { getMousePosition } from './bullet.js';

export let view = [1, 0, 0, 1, 0, 0];  // Matrix representing the view. (scale, 0, 0, scale, widthNew, HeightNew)
export let player;
export let isRunning = true;



/** @type {CanvasRenderingContext2D} */
let ctx;
let canvas;
let lastRender = 0;
let assets = "./assets/";
let uiIsWorking = false;
let g_timestamp = 0;



if (document.title === 'Zombsio Recreation') {
  addEventListener('DOMContentLoaded', () => {

    areSettingsSet();
    setMusic();

    const user = localStorage.getItem('username');
    player = new Player(assets + 'player.png', user);
    canvas = document.getElementById("player");
    canvas.focus();
    canvas.width = 1920;
    canvas.height = 1080;
    ctx = canvas.getContext('2d');

    // ui_setup();
    bg_setup();
    uiIsWorking = init_ui();

    // addEventListener('wheel', scaleHandler, false); //removed because i couldn't figure it out 😔
    addEventListener('keydown', KeysHandler, false);
    addEventListener('keyup', KeysHandler, false);
    addEventListener('blur', () => { isRunning = false; }, false);
    addEventListener('mousemove', getMousePosition, false);

    window.requestAnimationFrame(loop);
  });
}

async function loop(timestamp) {
  let progress = timestamp - lastRender;
  lastRender = timestamp;

  update_ui(progress);
  if (isRunning) {
    g_timestamp += progress;

    if (KeysPressed[localStorage.vdown]) {
      lowerMusic();
    }
    if (KeysPressed[localStorage.vup]) {
      higherMusic();
    }

    update(progress);

    if (KeysPressed[localStorage.vmute]) {
      muteMusic(timestamp);
    }
    draw();
  }
  else {
    if (!isMusicMuted()) {
      muteMusic(timestamp);
    }

    if (KeysPressed['backspace']) {
      window.location.href = './settingsAlpha.html';
    }
  }

  window.requestAnimationFrame(loop);
}

async function draw() {
  bg_draw();
  ctx.clearRect(-100, -100, canvas.width + player.getPosition().x, canvas.height + player.getPosition().y);
  player.draw(ctx);
  drawMobs(ctx);
}

export function changePause() {
  isRunning = !isRunning;
}

async function update(progress) {
  player.update(progress);
  spawnMobs(g_timestamp);
  bg_update(progress);
  updateMobs(progress);
  view[4] = -player.getPosition().x
    + canvas.width * 0.5
    - player.getSprite().width * 0.5;


  view[5] = -player.getPosition().y
    + canvas.height * 0.5
    - player.getSprite().height * 0.5;


  ctx.setTransform(view[0], view[1], view[2], view[3], view[4], view[5]);

  // Transform context to allow the player character to stay in the middle of the viewport
  // While actually being able to move around the map (without the map moving instead :D)
}

