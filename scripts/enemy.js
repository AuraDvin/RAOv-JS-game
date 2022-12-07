const enemyTypes = ['fast','strong','ranged']

export class Enemy{
    #sprite
    #speed
    #type
    constructor(img,type) {
      this.#type = type;
      this.#sprite = new Image(256,256); 
    }
  
  
    die() {
      console.log("enemy defeated");
    }
    
    getSprite(){
      return this.#sprite;
    }
  
    
   getPosition() {
    return {x:this.#sprite.x, y: this.#sprite.y};
   }
  
   move (vector2) {
      this.#sprite.x = vector2.x;
      this.#sprite.y = vector2.y;
   }
    
  
}