/** @type {HTMLCanvasElement} */
let ui_canvas;
/** @type {CanvasRenderingContext2D} */
let ui_ctx;
let fps = 1;
let timeElapsed = 0;


export function ui_setup() {
  ui_canvas = document.getElementById('ui');
  ui_canvas.width = 1920;
  ui_canvas.height = 1080;

  ui_ctx = ui_canvas.getContext('2d');
  ui_ctx.font = '42px Sans-serif';
}

export function ui_update(progress) {
  timeElapsed += progress;
  // FPS only updates every second rather than every frame :D
  if (timeElapsed >= 1000) {
    fps = Math.floor(1000 / progress).toString() + ' fps';
    timeElapsed = 0;
  }

}

export function ui_draw() {
  ui_ctx.clearRect(0, 0, ui_canvas.width, ui_canvas.height);
  ui_ctx.fillText(fps, 0, 42);
}