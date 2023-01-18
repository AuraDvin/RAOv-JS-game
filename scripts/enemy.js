import { player } from "./game.js";
import { bulletCollision } from './bullet.js';

const enemyTypes = ['fast', 'strong'/*, 'ranged'*/];
let lastId = 0;
let lastSpawn = 0;
let mobSpawnDelay = 350;

class Enemy {
  id;
  #health = 100;
  #sprite;
  #speed = Number;
  #diagSpeed = Number;
  damage = Number;
  goToPosition = { x: Number, y: Number };
  direction = { x: Number, y: Number };
  #position = { x: Number, y: Number };
  collisionRect;


  constructor(type, spawnPosition, id) {
    this.id = id;
    this.#sprite = new Image(256, 256);
    switch (type) {
      case 0:
        this.#speed = 2.1;
        this.damage = 10;
        break;
      case 1:
        this.#speed = 1.5;
        this.damage = 17;
        break;
      case 2:
        // scrapped idea
        break;
    }
    this.#diagSpeed = this.#speed * Math.sqrt(2);
    this.#sprite.src = './assets/enemy' + type.toString() + '.png';
    this.#position = spawnPosition;
    // this.damage = 10;
    this.collisionRect = {
      x1: this.#position.x + 10,
      y1: this.#position.y + 10,
      x2: this.#position.x + this.#sprite.width - 20,
      y2: this.#position.y + this.#sprite.height - 20
    };
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
    removeFromList(this.id);
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
    this.collisionRect = {
      x1: this.#position.x + 10,
      y1: this.#position.y + 10,
      x2: this.#position.x + this.#sprite.width - 20,
      y2: this.#position.y + this.#sprite.height - 20
    };
  }

  dealDamage(source) {
    this.#health -= source.damage;
    if (this.#health <= 0) {
      this.die();
    }
  }

  AABB(other) {
    const otherRect = {
      x1: other.getPosition().x + 10,
      y1: other.getPosition().y + 10,
      x2: other.getPosition().x + other.getSprite().width - 20,
      y2: other.getPosition().y + other.getSprite().height - 20
    };
    // console.log('other rect: ', otherRect);
    // console.log('this rect:', this.collisionRect);
    if (
      this.collisionRect.x2 >= otherRect.x1 &&
      otherRect.x2 >= this.collisionRect.x1 &&
      this.collisionRect.y2 >= otherRect.y1 &&
      otherRect.y2 >= this.collisionRect.y1
    ) {
      return true;
    }
    return false;
  }

}

let mobs = [];

/**TODO 
 * TODO: set spawn position to anywhere **OUTSIDE** the viewport 
 * TODO: add score after killing enemies :D
 */

export function spawnMobs(timestamp) {

  if (timestamp - lastSpawn < mobSpawnDelay) return;

  lastSpawn = timestamp;
  const type = Math.floor(Math.random() * (enemyTypes.length - 1));

  const spawnPosition = {
    x: Math.floor(Math.random() * 7680),
    y: Math.floor(Math.random() * 4320)
  };

  let newMob = new Enemy(type, spawnPosition, lastId);
  lastId++;

  mobs.push(newMob);
}

export function updateMobs(progress) {
  // progress /= 100;
  for (let i in mobs) {
    mobs[i].pathfind();
    mobs[i].move({ x: mobs[i].direction.x * progress / 100, y: mobs[i].direction.y * progress / 100 });
    // console.log(mobs[i].getPosition());
  }
  if (mobs.length > 50) {                   // make sure to only have 50 at once 
    while (mobs.length > 50) {
      mobs.pop();
    }
  }

  checkCollision(player, progress);
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


function removeFromList(defeatedEnemyId) {
  // mobs.forEach((e, i) => {
  //   if (e === defeatedEnemy) { // does this even work? wait what in this project does work.
  //     // clearInterval(mobs[i].lookForPlayer); // stop calling funciton after it no exists
  //     delete (mobs[i]); // removes enemy from list entirely
  //     console.log('sus');
  //   }
  // })
  for (let i in mobs) {
    if (mobs[i].id == defeatedEnemyId) {
      delete (mobs[i]);
      break;
    }
  }
}

function checkCollision(player, progress) {
  for (let i in mobs) {
    // console.log(mobs[i].collisionRect, player.getPosition(), player.getSprite().width, player.getSprite().height);
    if (mobs[i].AABB(player)) {
      // console.log('collided');
      player.checkDamage(progress, mobs[i]);
    }
    try {
      bulletCollision(progress, mobs[i]);
    } catch (err) {
      console.log(mobs[i]);
      console.error('moment of moments');
    }
  }
}