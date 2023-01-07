const enemyTypes = ['fast', 'strong', 'ranged']

export class Enemy {
  #sprite;
  #speed = Number;
  #type = String;
  #position = { x: Number, y: Number };

  constructor(type, spawnPosition) {
    if (type >= 0 && type <= 2) {
      this.#type = enemyTypes[type];
    } else {
      this.#type = 'fast';
    }
    this.#sprite = new Image(256, 256);
    this.#sprite.src = 'bla bla';
    this.#position = spawnPosition;
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
  let type = Math.floor(Math.random() * 2);
  let spawnPosition = {
    x: ~~Math.random() * 1920,
    y: ~~Math.random() * 1080
  };
  const newMob = new Enemy(type, spawnPosition);

  mobs.push(newMob);

}

export function updateMobs(progress){
  mobs.forEach((e, i)=>{
    mobs[i].move(/* to player ig */);
  });
}

export function drawMobs(ctx) {
  mobs.forEach((e, i)=>{
    ctx.drawImage(mobs[i].getSprite(), mobs[i].getPosition().x, mobs[i].getPosition().y);
  });
}



function removeFromList(defeatedEnemy) {
  mobs.forEach((e, i)=>{
    if (e == defeatedEnemy){
      delete(mobs[i]); // removes enemy from list entirely
    }
  })
}