import { player } from "./game.js";
import { bulletCollision } from './bullet.js';

const enemyTypes = ['fast', 'strong'/*, 'ranged'*/];
let lastId = 0;
let lastSpawn = 0;
let mobSpawnDelay = 3000;

class Enemy {
  id;
  #health = 100;
  #sprite;
  #speed = Number;
  #diagSpeed = Number;
  damage = Number;
  isMoving = Boolean;
  goToPosition = { x: Number, y: Number };
  direction = { x: Number, y: Number };
  #position = { x: Number, y: Number };
  collisionRect;


  constructor(type, spawnPosition, id) {
    this.isMoving = true;
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
    this.collisionRect = {
      x1: this.#position.x + 10,
      y1: this.#position.y + 10,
      x2: this.#position.x + this.#sprite.width - 20,
      y2: this.#position.y + this.#sprite.height - 20
    };

  }



  pathfind() {
    const deltaX = player.getPosition().x - this.#position.x;
    const deltaY = player.getPosition().y - this.#position.y;
    const hipot = Math.hypot(deltaX, deltaY);
    const delta = 10 * this.#speed / hipot;

    this.direction.x = Math.floor(deltaX * delta);
    this.direction.y = Math.floor(deltaY * delta);
  }
  die() {
    player.increaseScore();
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
    if (!this.isMoving) return;
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

  const moment = timestamp / 6000;
  if (timestamp - lastSpawn < 3000) return;
  mobSpawnDelay = ~~(mobSpawnDelay - moment);
  console.log(mobSpawnDelay);
  if (mobSpawnDelay <= 350) mobSpawnDelay = 350;

  lastSpawn = timestamp;
  const type = Math.floor(Math.random() * (enemyTypes.length - 1));

  const spawnPosition = {
    x: Math.floor(Math.random() * 7680),
    y: Math.floor(Math.random() * 4320)
  };

  let newMob = new Enemy(type, spawnPosition, lastId);
  lastId++;

  mobs.push(newMob);
  console.log('amount of spawned mobs: ', mobs.length);
  return;
}

export function updateMobs(progress) {
  for (let i in mobs) {
    i = Number(i);
    // for (let j in mobs) {
    //   if (j != i) {
    //     if (mobs[i].AABB(mobs[j])) {
    //       const positionDifference = {
    //         x: -1 * (mobs[i].getPosition().x - mobs[j].getPosition().x),
    //         y: -1 * (mobs[i].getPosition().y - mobs[j].getPosition().y),
    //       };
    //       console.log(positionDifference);
    //       mobs[j].move(positionDifference);
    //     }
    //   }
    // }
    mobs[i].pathfind();
    mobs[i].move({ x: mobs[i].direction.x * progress / 100, y: mobs[i].direction.y * progress / 100 });
  }
  if (mobs.length > 50) {                   // make sure to only have 50 at once 
    while (mobs.length > 50) {
      mobs.pop();
    }
  }


  checkCollision(player, progress);
}

export function drawMobs(ctx) {
  for (let i in mobs) {
    ctx.drawImage(mobs[i].getSprite(), mobs[i].getPosition().x, mobs[i].getPosition().y);
  }
}


function removeFromList(defeatedEnemyId) {
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