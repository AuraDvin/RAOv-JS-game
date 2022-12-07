import { Player } from './player.js';

let player;
let canvas;
let ctx;
let cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let cameraZoom = 1;
const MAX_ZOOM = 2;
const MIN_ZOOM = 0.4;
const SCROLL_SENSITIVITY = 0.0005
let lastRender = 0;
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let assets = "../assets/";


addEventListener('DOMContentLoaded', () => {
  player = new Player(assets + 'player.png', 'Bingus Janez');

  canvas = document.getElementById("gameView");
  canvas.width = 1920;
  canvas.height = 1080;

  ctx = canvas.getContext('2d');
  ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
  ctx.scale(cameraZoom, cameraZoom);
  ctx.translate(-window.innerWidth / 2 + cameraOffset.x, -window.innerHeight / 2 + cameraOffset.y);
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);


  // console.log("loaded");
  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);
  // document.addEventListener('wheel', scaleHandler, false);
  window.requestAnimationFrame(loop);
});

//! beta feature (limit zoom not added yet :P)
function scaleHandler(event) {
  cameraZoom = 1;
  cameraZoom += event.deltaY * SCROLL_SENSITIVITY;
  cameraZoom = Math.min(cameraZoom, MAX_ZOOM);
  cameraZoom = Math.max(cameraZoom, MIN_ZOOM);
  ctx.scale(cameraZoom,cameraZoom);
  ctx.translate(-window.innerWidth / 2 + cameraOffset.x, -window.innerHeight / 2 + cameraOffset.y);
  console.log(cameraZoom);
}

async function keyDownHandler(event) {
  // console.log(`${event.keyCode} pressed`);
  if (event.key === 'd' || event.key === 'ArrowRight') {
    rightPressed = true;
  } else if (event.key === 'a' || event.key === 'ArrowLeft') {
    leftPressed = true;
  }
  if (event.key === 'w' || event.key === 'ArrowUp') {
    upPressed = true;
  } else if (event.key === 's' || event.key === 'ArrowDown') {
    downPressed = true;
  }
}

async function keyUpHandler(event) {
  if (event.key === 'd' || event.key === 'ArrowRight') {
    rightPressed = false;
  } else if (event.key === 'a' || event.key === 'ArrowLeft') {
    leftPressed = false;
  }
  if (event.key === 'w' || event.key === 'ArrowUp') {
    upPressed = false;
  } else if (event.key === 's' || event.key === 'ArrowDown') {
    downPressed = false;
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
    let move = {
      x: 0,
      y: 0
    }
    //. Up is negative, down is positive (origin in topleft)
    if (upPressed) {
      move.y = -player.speed * 1 / progress;
    } else if (downPressed) {
      move.y = player.speed * 1 / progress;
    }
  
    if (rightPressed) {
      move.x = player.speed * 1 / progress;
    } else if (leftPressed) {
      move.x = -player.speed * 1 / progress;
    }
  
  
    if (move.x == move.y || -move.x == move.y) {
      move.x *= 0.5;
      move.y *= 0.5;
    }
    player.move(move);
  }