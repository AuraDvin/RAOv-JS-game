export class Player {
  #sprite
  #health
  #speed
  #name
  #position
  constructor(img,name) {
    this.#name = name;
    this.#health = 100;
    this.#speed = 200;
    
    this.#sprite = new Image(256,256); 
    this.#sprite.src = img;
    this.#position = {x:0,y:0};
  }


  die() {
    console.log("You died");
  }

  takeDamage (source) {
    this.#health -= source.damage;
    if (this.#health < 0) 
      this.die();  
  }

  getSprite(){
    return this.#sprite;
  }

 getName(){
  return this.#name;
 }

 getPosition() {
  return {x:this.#sprite.width, y: this.#sprite.height};
 }

 move (vector2) {
    this.#position.x = vector2.x;
    this.#position.y = vector2.y;
 }



}