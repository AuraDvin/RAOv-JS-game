import { KeysPressed } from './inputHandler.js';
import { fireBullet, updateBullets, drawBullets } from './bullet.js';
import { update_ui_health } from './ui.js';

let limit = {
  x: 7680,
  y: 4320
};

export class Player {
  #sprite = new Image();
  #health = Number();
  #name = String();
  #position = { x: Number(), y: Number() };
  #immunityFrames = 300;
  #color = String();
  #shootCoolDown = Number();
  #shootTimer = Number();
  #score = Number();
  speed = Number();
  diagSpeed = Number();


  constructor(img = String, name = String) {
    this.#name = name;
    this.#health = 100;
    this.#score = 0;
    this.#sprite = new Image(256, 256);
    this.#sprite.src = img;
    this.#position = { x: Math.floor(1920 / 2 - (this.#sprite.width / 2)), y: Math.floor(1080 / 2 - (this.#sprite.height / 2)) };
    this.speed = 2;
    this.diagSpeed = Math.floor(this.speed * Math.sqrt(0.5));
    this.#shootCoolDown = 100;
    this.#color = localStorage.color ? localStorage.color : 'salmon';
    this.#shootTimer = 0;
    // console.log(this);
  }

  // The bounds are going to change depending on the level size (not decided yet)
  #checkInBounds() {
    this.#position.x = Math.min(Math.max(this.#position.x, 0), limit.x - this.#sprite.width);
    this.#position.y = Math.min(Math.max(this.#position.y, 0), limit.y - this.#sprite.height);
  }

  checkDamage(progress, source) {
    // console.log('test');
    this.#immunityFrames -= progress;
    if (this.#immunityFrames <= 0) {
      this.#immunityFrames = 300;
      this.#takeDamage(source);
      return true;
    }
    return false;
  }

  update(progress = Number) {
    let move = {
      x: 0,
      y: 0
    }
    //. Up is negative, down is positive (origin in topleft)
    if (KeysPressed[localStorage.up]) {
      move.y = -this.speed;
    } else if (KeysPressed[localStorage.down]) {
      move.y = this.speed;
    }

    if (KeysPressed[localStorage.right]) {
      move.x = this.speed;
    } else if (KeysPressed[localStorage.left]) {
      move.x = -this.speed;
    }

    if ((move.x) && (move.x == move.y || -move.x == move.y)) {
      move.x = this.diagSpeed * Math.sign(move.x);
      move.y = this.diagSpeed * Math.sign(move.y);
    }
    move.x *= progress;
    move.y *= progress;

    this.move(move);

    this.#shootTimer += progress;
    if (KeysPressed[localStorage.shoot]) {
      if (this.#shootTimer >= this.#shootCoolDown) {
        console.log('user shot');
        this.#shootTimer = 0;
        fireBullet();
      }
    }
    updateBullets(progress);

  }

  getSprite() {
    return this.#sprite;
  }

  getPosition() {
    return { x: this.#position.x, y: this.#position.y };
  }

  // Funcion to with moving character to new position
  move(vector2 = { x: Number, y: Number }) {
    this.#position.x += vector2.x;
    this.#position.y += vector2.y;
    this.#checkInBounds();
  }

  // Just takes you to the first site
  die() {
    alert('You have died');
    window.location.replace('/index.html');
  }

  #takeDamage(source) {
    // console.log(this.#health);
    this.#health -= source.damage;
    if (this.#health < 0) this.die();
    update_ui_health(this.#health);
  }


  increaseScore() { this.#score++; }
  getScore() { return this.#score; }

  draw(ctx) {
    ctx.fillStyle = this.#color;
    ctx.beginPath();
    ctx.arc(this.#position.x + this.#sprite.width * 0.5, this.#position.y + this.#sprite.height * 0.5, this.#sprite.width * 0.5, 0, 2 * Math.PI);
    ctx.fill();

    ctx.drawImage(this.#sprite, this.#position.x, this.#position.y);

    ctx.fillStyle = 'Black';
    ctx.fillText(this.#name, this.#position.x + this.#sprite.width * 0.5 - ctx.measureText(this.#name).width * 0.5, this.#position.y + 100);
    ctx.font = '30px Tahoma';

    drawBullets(ctx);
  }
}