/** @type {HTMLCanvasElement} */
let bg_canvas;
/** @type {CanvasRenderingContext2D} */
let bg_ctx;
let bg_Image = new Image(1920, 1080);
export async function bg_setup() {
  bg_canvas = document.getElementById('bg');
  bg_ctx = bg_canvas.getContext('2d');
  bg_Image.src = "../assets/alphaBackground.png";
}

export function bg_update(progress) {

}

export function bg_draw() {
  bg_ctx.drawImage(bg_Image, 0, 0);
}