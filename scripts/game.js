import {Player} from './player.js';
let player;
let canvas;
let ctx;
let lastRender = 0;

addEventListener('DOMContentLoaded', (event) => {
  __init();
});

function draw() {
  let img = new Image(256,256);
  img.src = '../assets/player.png';
  console.log("aha");
  ctx.drawImage(img,256,256);
}

function drawTitleScreen(canvas,ctx) {
  // draws all the things for the title screen like buttons and stuff
}

function loop(timestamp) {
  const progress  = timestamp - lastRender;
  update(progress);
  draw();
}



function update(progress) {
  let vector = {
    x:0,
    y:0,
  }
  vector.x = 4;
  vector.y = 0;
  player.move(vector /** progress*/);
}

function __init(){
  player = new Player('../assets/player.png','Bingus Janez');
  console.log(player.getName());
  canvas = document.getElementById("gameView");
  canvas.width = 1920;
  canvas.height = 1080;
  ctx = canvas.getContext('2d');
}

window.requestAnimationFrame(loop)