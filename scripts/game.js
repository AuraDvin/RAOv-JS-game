import { Player } from './player.js';
import { downPressed, rightPressed, leftPressed, upPressed, handleMovement, handleStopping } from './movementHandler.js';


let player;
let canvas;
let ctx;
let cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let cameraZoom = 1;
let isRunning = true;
const MAX_ZOOM = 2;
const MIN_ZOOM = 0.4;
const SCROLL_SENSITIVITY = 0.0005
let lastRender = 0;
let assets = "../assets/";
let directionalMovement = ['w', 'a', 's', 'd'];


addEventListener('DOMContentLoaded', () => {
  player = new Player(assets + 'player.png', 'Bingus Janez');

  canvas = document.getElementById("gameView");
  canvas.width = 1920;
  canvas.height = 1080;

  ctx = canvas.getContext('2d');
  // ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
  // ctx.scale(cameraZoom, cameraZoom);
  // ctx.translate(-window.innerWidth / 2 + cameraOffset.x, -window.innerHeight / 2 + cameraOffset.y);
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  // console.log({x:window.innerHeight,y:window.innerHeight});

  addEventListener('keydown', keyDownHandler, false);
  addEventListener('keyup', keyUpHandler, false);
  addEventListener('wheel', scaleHandler, false);
  document.body.onmouseover = ()=>{
    canvas.focus();
  }
  window.requestAnimationFrame(loop);
});


//! beta feature (limit zoom not added yet :P)
function scaleHandler(event) {
  cameraZoom = 1;
  cameraZoom += event.deltaY * SCROLL_SENSITIVITY;
  cameraZoom = Math.min(cameraZoom, MAX_ZOOM);
  cameraZoom = Math.max(cameraZoom, MIN_ZOOM);
  ctx.scale(cameraZoom, cameraZoom);
  // ctx.translate(-window.innerWidth / 2 + cameraOffset.x, -window.innerHeight / 2 + cameraOffset.y);
  // console.log(cameraZoom);
}

async function keyDownHandler(event) {
  if (!directionalMovement.includes(event.key)) {
    switch (event.key) {
      case 'Escape': isRunning = !isRunning; break;
    }
  } else {
    if (isRunning) handleMovement(event);
  }

}

async function keyUpHandler(event) {
  if (directionalMovement.includes(event.key)) {
    handleStopping(event);
  }
  
}

//! Game loop
async function loop(timestamp) {
  let progress = timestamp - lastRender;
  // console.log(progress);
  update(progress);
  draw();
  lastRender = timestamp;
  window.requestAnimationFrame(loop);
}


async function draw() {
  let playerx = player.getPosition().x;
  let playery = player.getPosition().y;
  // ctx.clearRect(0,0, window.innerWidth, window.innerHeight);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(player.getSprite(), player.getPosition().x, player.getPosition().y);

}


async function update(progress) {
  // console.log(progress);
  let move = {
    x: 0,
    y: 0
  }
  //. Up is negative, down is positive (origin in topleft)
  if (upPressed) {
    move.y = -player.speed;
  } else if (downPressed) {
    move.y = player.speed;
  }

  if (rightPressed) {
    move.x = player.speed;
  } else if (leftPressed) {
    move.x = -player.speed;
  }


  if ((move.x == move.y || -move.x == move.y) && (move.x != 0 || move.y == 0)) {
    move.x = player.diagSpeed * Math.sign(move.x);
    move.y = player.diagSpeed * Math.sign(move.y);
  }


  move.x *= progress;
  move.y *= progress;
  // console.log(move);
  player.move(move);
}