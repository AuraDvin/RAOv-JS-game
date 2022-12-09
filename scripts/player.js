export class Player {
  #sprite
  #health
  #name
  #position
  speed
  diagSpeed

  constructor(img, name) {
    this.#name = name;
    this.#health = 100;
    this.#sprite = new Image(256, 256);
    this.#sprite.src = img;
    this.#position = { x: 0, y: 0 };
    
    this.speed = 2;
    // This just makes it so we move diagonally at this.speed
    this.diagSpeed = Math.floor(this.speed * Math.sqrt(1 / 2));
  }

  // The bounds are going to change depending on the level size (not decided yet)
  #checkInBounds() {
    let limitX = 1920;
    let limitY = 1080;
    this.#position.x = Math.min(Math.max(this.#position.x, 0), limitX - this.#sprite.width);
    this.#position.y = Math.min(Math.max(this.#position.y, 0), limitY - this.#sprite.height);
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

  getSprite() {
    return this.#sprite;
  }

  // getName() {
  //   return this.#name;
  // }

  getPosition() {
    return { x: this.#position.x, y: this.#position.y };
  }

  // Funcion to with moving character to new position
  move(vector2) {
    this.#position.x += vector2.x;
    this.#position.y += vector2.y;
    this.#checkInBounds();
  }

}