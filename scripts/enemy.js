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
  #takingDamage = Boolean;
  #damageInterval;
  goToPosition = { x: Number, y: Number };
  direction = { x: Number, y: Number };
  #position = { x: Number, y: Number };
  collisionRect;


  constructor(type, spawnPosition, id) {
    this.#takingDamage = false;
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

  notTakingDamageNow() {
    this.#takingDamage = false;
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
    this.#takingDamage = true;
    if (!this.#damageInterval)
      this.#damageInterval = setInterval((mob) => { mob.notTakingDamageNow(); }, 200, this);

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

  draw(ctx) {
    ctx.drawImage(this.getSprite(), this.#position.x, this.#position.y);
    if (this.#takingDamage) { // is taking damage
      ctx.fillStyle = `rgba(255,0,0,0.4)`;
      ctx.beginPath();
      ctx.arc(this.#position.x + this.#sprite.width * 0.5, this.#position.y + this.#sprite.height * 0.5, this.#sprite.width * 0.5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

let mobs = [];

/**
 * TODO: set spawn position to anywhere **OUTSIDE** the viewport 
 * ? collision bug?
 */

export function spawnMobs(timestamp) {

  const moment = timestamp / 6000;
  if (timestamp - lastSpawn < 3000) return;
  mobSpawnDelay = ~~(mobSpawnDelay - moment);
  // console.log(mobSpawnDelay);
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
  // console.log(`Current number of mobs: ${mobs.length}`);
  return;
}

export function updateMobs(progress) {
  for (let i in mobs) {
    i = Number(i);
    mobs[i].pathfind();
    mobs[i].move({ x: mobs[i].direction.x * progress * 0.01, y: mobs[i].direction.y * progress * 0.01 });
    for (let j = i + 1; j < mobs.length; j++) {
      if (mobs[j]) {
        const mobDiameter = mobs[i].getSprite().width + 5;

        const positionOne = {
          x: mobs[i].getPosition().x + mobs[i].getSprite().width * 0.5,
          y: mobs[i].getPosition().y + mobs[i].getSprite().height * 0.5
        };

        const positionTwo = {
          x: mobs[j].getPosition().x + mobs[j].getSprite().width * 0.5,
          y: mobs[j].getPosition().y + mobs[j].getSprite().height * 0.5
        };


        const positionDifference = {
          x: positionOne.x - positionTwo.x,
          y: positionOne.y - positionTwo.y,
        };

        const distance = Math.hypot(positionDifference.x, positionDifference.y);

        
        if (distance < mobDiameter) {
          // console.log(`Mob ${mobs[i].id} and ${mobs[j].id}\nat distance: ${distance}`);

          const forceOne = {
            x: Math.sign(positionDifference.x) * (mobDiameter - Math.abs(positionDifference.x)) * progress * 0.001,
            y: Math.sign(positionDifference.y) * (mobDiameter - Math.abs(positionDifference.y)) * progress * 0.001
          };

          const forceTwo = {
            x: -Math.sign(positionDifference.x) * (mobDiameter - Math.abs(positionDifference.x)) * progress * 0.001,
            y: -Math.sign(positionDifference.y) * (mobDiameter - Math.abs(positionDifference.y)) * progress * 0.001
          };

          mobs[i].move(forceOne);
          mobs[j].move(forceTwo);
        }
      }
    }
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
    mobs[i].draw(ctx);
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
    if (mobs[i].AABB(player)) { player.checkDamage(progress, mobs[i]); }
    bulletCollision(progress, mobs[i]);
  }
}