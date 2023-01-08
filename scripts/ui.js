import { isRunning } from "./game.js";

const center = { x: 1920 * 0.5, y: 1080 * 0.5 };
// console.log(center);
let ui_canvas;
/** @type {CanvasRenderingContext2D} */
let ui_ctx;
let updates = 0;
let fps = 1;
let timeElapsed = 0;
let health = 100;
let pauseWidth;
let pauseHeight;

let colors = {
  'fps': '#2f2f2f',
  'health': '#ff0000',
  'paused': '#F0F0F0'
};

export function ui_setup() {
  ui_canvas = document.getElementById('ui');
  ui_canvas.width = 1920;
  ui_canvas.height = 1080;

  ui_ctx = ui_canvas.getContext('2d');
  ui_ctx.font = '42px Sans-serif';
  pauseWidth = ui_ctx.measureText('| |').width * 0.5;
  pauseHeight = 21;


}

export function update_health(newHealth) {
  health = newHealth;
}

export function ui_update(progress) {
  timeElapsed += progress;
  updates++;
  if (timeElapsed >= 1000) {
    fps = Math.floor(updates * 1000 / timeElapsed).toString() + ' ups ' + Math.floor(1000 / progress) + ' fps'; // updates per second and frames per second
    updates = 0;
    timeElapsed = 0;
  }
}

export function ui_draw() {
  ui_ctx.clearRect(0, 0, center.x + pauseWidth + 200, center.y + pauseHeight + 200); // no need to clear outside of where I write text
  if (!isRunning) { // if paused
   
    ui_ctx.fillStyle = colors['paused'];
    ui_ctx.strokeStyle = colors['paused'];
    ui_ctx.lineWidth = 6;
    ui_ctx.font = '64px Sans-serif';
    ui_ctx.fillText('| |', center.x - pauseWidth, center.y);
    ui_ctx.beginPath();
    ui_ctx.arc(center.x + pauseWidth *0.5, center.y - pauseHeight * 0.5, 64, 0, 2 * Math.PI);
    ui_ctx.stroke();
    ui_ctx.font = '42px Sans-serif';
  }


  ui_ctx.fillStyle = colors['fps'];
  ui_ctx.fillText(fps, 0, 42);

  ui_ctx.fillStyle = colors['health'];
  ui_ctx.fillText(health.toString() + ' health', 0, 84);

}