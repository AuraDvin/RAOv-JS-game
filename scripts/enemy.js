const enemyTypes = ['fast', 'strong', 'ranged']

class Enemy {
  #sprite;
  #speed = Number;
  #diagSpeed = Number;
  goToPosition = { x: Number, y: Number };
  #position = { x: Number, y: Number };

  constructor(type, spawnPosition) {
    this.#sprite = new Image(256, 256);
    switch (type) {
      case 0:
        this.#speed = 2.1;

        break;
      case 1:

        break;
      case 2:

        break;
    }
    this.#diagSpeed = this.#speed * Math.sqrt(2);
    this.#sprite.src = './assets/enemy-' + type.toString() + 'png';
    this.#position = spawnPosition;
  }

  #findIntervalId = setInterval(this.findPlayer, 20, { x: 10, y: 10 });

  findPlayer({ x: Number, y: Number }) {
    const deltaX = x - this.#position.x;
    const deltaY = y - this.#position.y;
    goToPosition = { x: deltaX, y: deltaY };
  }

  die() {
    console.log("enemy defeated");
    removeFromList(this);
  }

  getSprite() {
    return this.#sprite;
  }


  getPosition() {
    return { x: this.#sprite.x, y: this.#sprite.y };
  }

  move(vector2) {
    this.#sprite.x = vector2.x;
    this.#sprite.y = vector2.y;
  }


}

let mobs = [];

export function spawnMobs(ctx) {
  const type = Math.floor(Math.random() * 2);

  const spawnPosition = {
    x: Math.floor(Math.random() * 1920),
    y: Math.floor(Math.random() * 1080)
  };

  let newMob = new Enemy(type, spawnPosition);

  mobs.push(newMob);
}

export function updateMobs(progress) {
  mobs.forEach((e, i) => {
    // mobs[i].findPlayer();
    const x = mobs[i].goToPosition.x;
    const y = mobs[i].goToPosition.y;
    mobs[i].move({ x: x * progress, y: y * progress });
  });
}

export function drawMobs(ctx) {
  mobs.forEach((e, i) => {
    ctx.drawImage(mobs[i].getSprite(), mobs[i].getPosition().x, mobs[i].getPosition().y);
  });
}


function removeFromList(defeatedEnemy) {
  mobs.forEach((e, i) => {
    if (e == defeatedEnemy) {
      delete (mobs[i]); // removes enemy from list entirely
    }
  })
}