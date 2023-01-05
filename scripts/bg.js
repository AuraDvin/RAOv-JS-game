/** @type {HTMLCanvasElement} */
let bg_canvas;
/** @type {CanvasRenderingContext2D} */
let bg_ctx;
let bg_Image = new Image(1920 * 4, 1080 * 4);

export async function bg_setup() {
  bg_canvas = document.getElementById('background');
  bg_canvas.width = 1920;
  bg_canvas.height = 1080;

  bg_ctx = bg_canvas.getContext('2d');
  bg_Image.src = "../assets/alphaBackground.png";

}

export function bg_update(progress, playerLoc) {
  bg_ctx.restore();
  
  bg_ctx.translate(-playerLoc.x, -playerLoc.y);
  
  bg_ctx.save();
}

export function bg_draw() {
  bg_ctx.drawImage(bg_Image, 0, 0);
}