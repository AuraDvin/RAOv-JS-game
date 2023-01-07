let ui_canvas;
/** @type {CanvasRenderingContext2D} */
let ui_ctx;
let updates = 0;
let fps = 1;
let timeElapsed = 0;
let health = 100;
let colors = {
  'fps' : '#2f2f2f',
  'health' : '#ff0000'
};

export function ui_setup() {
  ui_canvas = document.getElementById('ui');
  ui_canvas.width = 1920;
  ui_canvas.height = 1080;

  ui_ctx = ui_canvas.getContext('2d');
  ui_ctx.font = '42px Sans-serif';
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
  ui_ctx.clearRect(0, 0, ui_canvas.width, ui_canvas.height);
  ui_ctx.fillStyle = colors['fps'];
  ui_ctx.fillText(fps, 0, 42);
  ui_ctx.fillStyle = colors['health'];
  ui_ctx.fillText(health.toString() + ' health', 0, 84);
}