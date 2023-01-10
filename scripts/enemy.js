import { player } from "./game.js";

const enemyTypes = ['fast', 'strong'/*, 'ranged'*/];


class Enemy {
  #health = 100;
  #sprite;
  #speed = Number;
  #diagSpeed = Number;
  damage = Number;
  goToPosition = { x: Number, y: Number };
  direction = { x: Number, y: Number };
  #position = { x: Number, y: Number };

  constructor(type, spawnPosition) {
    this.#sprite = new Image(256, 256);
    switch (type) {
      case 0:
        this.#speed = 2.1;

        break;
      case 1:
        this.#speed = 1.5;
        break;
      case 2:
        // scrapped idea
        break;
    }
    this.#diagSpeed = this.#speed * Math.sqrt(2);
    this.#sprite.src = './assets/enemy' + type.toString() + '.png';
    this.#position = spawnPosition;
    this.damage = 10;
    // this.lookForPlayer = setInterval(function () {
    //   this.goToPosition = { x: player.getPosition().x, y: player.getPosition().y };
    //   // console.log(this.goToPosition);  
    // }, 2000);
  }

  // test = setTimeout(() => { this.die(); }, 10000);

  pathfind() {
    const deltaX = player.getPosition().x - this.#position.x;
    const deltaY = player.getPosition().y - this.#position.y;
    const hipot = Math.hypot(deltaX, deltaY);
    const delta = 10 * this.#speed / hipot;

    // if (this.goToPosition) {
    // if (this.goToPosition.x.isNaN) {
    //   debugger;
    //   this.goToPosition.y;
    //   this.#position.x;
    //   this.#position.y;
    // }
    // const deltaX = this.goToPosition.x - this.#position.x;
    // const deltaY = this.goToPosition.y - this.#position.y;
    // const hipot = Math.hypot(deltaX, deltaY);
    // const delta = 10 * this.#speed / hipot;


    // console.log({ deltaX, deltaY, hipot, delta });
    this.direction.x = Math.floor(deltaX * delta);
    this.direction.y = Math.floor(deltaY * delta);
    // } else {
    // console.log('sus');
    // }
    // console.log('direction', this.direction);
  }
  die() {
    console.log("enemy defeated");
    removeFromList(this);
  }

  getSprite() {
    return this.#sprite;
  }


  getPosition() {
    return { x: this.#position.x, y: this.#position.y };
  }
  #checkInBounds() {
    this.#position.x = Math.min(Math.max(0, this.#position.x), 7680 - this.#sprite.width * 0.5);
    this.#position.y = Math.min(Math.max(0, this.#position.y), 4320 - this.#sprite.height * 0.5);
  }
  move(vector2) {
    this.#position.x += vector2.x;
    this.#position.y += vector2.y;
    this.#checkInBounds();
  }

  dealDamage(source) {
    this.#health -= source.damage;
    if (this.#health <= 0) {
      this.die();
    }
  }
}

let mobs = [];

export function spawnMobs() {
  const type = Math.floor(Math.random() * (enemyTypes.length - 1));
  // debugger;
  const spawnPosition = {
    x: Math.floor(Math.random() * 7680),
    y: Math.floor(Math.random() * 4320)
  };

  let newMob = new Enemy(type, spawnPosition);

  mobs.push(newMob);
}

export function updateMobs(progress) {
  progress /= 100;
  for (let i in mobs) {
    mobs[i].pathfind();
    mobs[i].move({ x: mobs[i].direction.x * progress, y: mobs[i].direction.y * progress });
    // console.log(mobs[i].getPosition());
  }
  if (mobs.length > 50) {                   // make sure to only have 20 at once 
    while (mobs.length > 50) {
      mobs.pop();
    }
  }

}

export function drawMobs(ctx) {
  // mobs.forEach((e, i) => {
  //   ctx.drawImage(mobs[i].getSprite(), mobs[i].getPosition().x, mobs[i].getPosition().y);
  // });
  for (let i in mobs) {
    ctx.drawImage(mobs[i].getSprite(), mobs[i].getPosition().x, mobs[i].getPosition().y);
    // console.log('drew', mobs[mob], 'at', mobs[mob].getPosition());
  }
}


function removeFromList(defeatedEnemy) {
  mobs.forEach((e, i) => {
    if (e === defeatedEnemy) { // does this even work? wait what in this project does work.
      // clearInterval(mobs[i].lookForPlayer); // stop calling funciton after it no exists
      delete (mobs[i]); // removes enemy from list entirely
      console.log('sus');
    }
  })
}