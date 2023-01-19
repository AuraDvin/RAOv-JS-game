import { view, player } from "./game.js";
// import { player.getPosition } from './game.js';

// const center = { x: 1920 * 0.5, y: 1080 * 0.5 };
const rez = { x: 1920 * 6, y: 1080 * 6 };
const plane = { x: 1920 * 4, y: 1080 * 4 };

/** @type {HTMLCanvasElement} */
let bg_canvas;
/** @type {CanvasRenderingContext2D} */
let bg_ctx;
let bg_Image = new Image();
let backgroundPatrn;

export async function bg_setup() {
  bg_canvas = document.getElementById('background');
  bg_canvas.width = 1920;
  bg_canvas.height = 1080;

  bg_ctx = bg_canvas.getContext('2d'/*, { alpha: false }*/);
  bg_Image.src = "../assets/alphaBackground.png";
  bg_Image.onload = () => {
    // console.log('ready');
    backgroundPatrn = bg_ctx.createPattern(bg_Image, 'repeat');
    // console.log(backgroundPatrn);
    bg_ctx.fillStyle = backgroundPatrn;
  };
  // console.log(bg_Image);
  // bg_ctx.fillStyle = 'green';
}

export function bg_update(progress) {
  bg_ctx.setTransform(view[0], view[1], view[2], view[3], view[4], view[5]);
}

export function bg_draw() {
  // hours wasted: too many
  // giving up 
  // console.log(view[4] + 1920, view[5] + 1080);
  // bg_ctx.clearRect(-view[4], -view[5], 1920, 1080);
  // bg_ctx.clearRect(0, 0, 1920, 1080);
  // bg_ctx.fillRect(0, 0, 1920, 1080);
  // const playerPos = player.getPosition();
  // const startX = playerPos.x - 2* center.x;
  // const startY = playerPos.y - center.y;
  // const endX = playerPos.x + 2 * center.x;
  // const endY = playerPos.y + 2 * center.y;

  // console.log({startX, startY, endX, endY});
  // console.log({ endX, endY });

  // bg_ctx.clearRect(startX, startY, 7640, 4320);

  // bg_ctx.save();

  // bg_ctx.beginPath();

  // bg_ctx.moveTo(startX, startY);

  // bg_ctx.lineTo(endX, startY);

  // bg_ctx.lineTo(endX, endY);

  // bg_ctx.lineTo(startX, endY);

  // bg_ctx.lineTo(startX, startY);

  // bg_ctx.clip();


  // bg_ctx.fillRect(0, 0, endX, endY);

  // bg_ctx.restore();
  bg_ctx.clearRect(-1920, -1080, rez.x, rez.y)
  bg_ctx.fillRect(0, 0, plane.x, plane.y);
}