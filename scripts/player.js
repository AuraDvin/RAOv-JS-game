import { KeysPressed } from './inputHandler.js';

export class Player {
  #sprite = new Image();
  #health = Number();
  #name = String();
  #position = { x: Number(), y: Number() };
  speed = Number();
  diagSpeed = Number();

  constructor(img = String, name = String) {
    this.#name = name;
    this.#health = 100;
    this.#sprite = new Image(256, 256);
    this.#sprite.src = img;
    this.#position = { x: Math.floor(1920 / 2 - (this.#sprite.width / 2)), y: Math.floor(1080 / 2 - (this.#sprite.height / 2)) };
    this.speed = 2;
    this.diagSpeed = Math.floor(this.speed * Math.sqrt(0.5)); // This just makes it so we move diagonally at this.speed
  }

  // The bounds are going to change depending on the level size (not decided yet)
  #checkInBounds() {
    let limitX = 1920;
    let limitY = 1080;
    this.#position.x = Math.min(Math.max(this.#position.x, 0), limitX - this.#sprite.width);
    this.#position.y = Math.min(Math.max(this.#position.y, 0), limitY - this.#sprite.height);
  }

  update(progress = Number) {
    let move = {
      x: 0,
      y: 0
    }
    //. Up is negative, down is positive (origin in topleft)
    if (KeysPressed['w']) {
      move.y = -this.speed;
    } else if (KeysPressed['s']) {
      move.y = this.speed;
    }

    if (KeysPressed['d']) {
      move.x = this.speed;
    } else if (KeysPressed['a']) {
      move.x = -this.speed;
    }

    if ((move.x) && (move.x == move.y || -move.x == move.y)) {
      move.x = this.diagSpeed * Math.sign(move.x);
      move.y = this.diagSpeed * Math.sign(move.y);
    }
    move.x *= progress;
    move.y *= progress;

    this.move(move);

    // check collision

    // check health

    // other stuff...
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

  // comment the not needed code for now
  // die() {
  //   console.log("You died");
  // }

  // takeDamage(source) {
  //   this.#health -= source.damage;
  //   if (this.#health < 0)
  //     this.die();
  // }

  // getName() {
  //   return this.#name;
  // }
}