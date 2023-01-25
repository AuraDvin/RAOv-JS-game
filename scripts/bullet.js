import { player } from "./game.js";

let mouse = {
    x: Number,
    y: Number
};

class Bullet {
    id;
    #position = { x: Number, y: Number };
    #size = { width: 10, height: 10 };
    #speed
    #style = 'Salmon'
    #livingTime = Number;
    startDirection
    direction = {
        x: Number,
        y: Number
    }
    damage = 10;

    collisionRect = {
        x1: Number,
        y1: Number,
        x2: Number,
        y2: Number
    };

    constructor(id, speed, direction = { x: Number, y: Number }) {
        this.#position.x = player.getPosition().x + player.getSprite().width * 0.5;
        this.#position.y = player.getPosition().y + player.getSprite().height * 0.5;
        this.id = id;
        this.#speed = speed;
        this.startDirection = { x: direction.x, y: direction.y };

        this.#livingTime = 0;
    }

    #checkInBounds() {
        this.#position.x = Math.min(Math.max(0, this.#position.x), 7680);
        this.#position.y = Math.min(Math.max(0, this.#position.y), 4320);
    }

    #checkLivingTime() {
        if (this.#livingTime < 400) return;
        removeFromList(this.id);
    }

    #setCollisionRect() {
        this.collisionRect.x1 = this.#position.x;
        this.collisionRect.y1 = this.#position.y;
        this.collisionRect.x2 = this.#position.x + this.#size.width;
        this.collisionRect.y2 = this.#position.y + this.#size.height;
    }

    getDamage() { return this.damage; }

    AABB(otherRect) {
        this.#setCollisionRect();
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

    update(progress) {
        this.#livingTime += progress;
        this.#checkLivingTime();
        this.pathfind();
        this.move();
    }

    pathfind() {
        // console.table(this);
        const deltaX = this.startDirection.x - this.#position.x;
        const deltaY = this.startDirection.y - this.#position.y;
        const hipot = Math.hypot(deltaX, deltaY);
        const delta = 10 * this.#speed / hipot;
        // console.table({delta, deltaX, deltaY, hipot});
        // debugger;
        this.direction.x = Math.floor(deltaX * delta);
        this.direction.y = Math.floor(deltaY * delta);

    }

    move() {
        this.#position.x += this.direction.x;
        this.#position.y += this.direction.y;
        this.#checkInBounds();
    }


    draw(ctx) {
        ctx.fillStyle = this.#style;

        ctx.beginPath();
        ctx.lineTo(this.#position.x, this.#position.y);
        ctx.lineTo(this.#position.x + this.#size.width, this.#position.y);
        ctx.lineTo(this.#position.x + this.#size.width, this.#position.y + this.#size.height);
        ctx.lineTo(this.#position.x, this.#position.y + this.#size.height);
        ctx.fill();
    }

}


let bulletArray = [];
let lastId = 0;

export function getMousePosition(e) {
    const halfCanvasWidth = document.getElementById('player').clientWidth * 0.5;
    const halfCanvasHeight = document.getElementById('player').clientHeight * 0.5;
    const halfPlayerWidth = player.getSprite().width * 0.5;
    const halfPlayerHeight = player.getSprite().height * 0.5;
    const playerX = player.getPosition().x;
    const playerY = player.getPosition().y;

    mouse.x = (e.pageX - halfCanvasWidth) + playerX + halfPlayerWidth;
    mouse.y = (e.pageY - halfCanvasHeight) + playerY + halfPlayerHeight;
}

export function fireBullet() {
    const newBullet = new Bullet(lastId, 10, mouse);
    lastId++;
    bulletArray.push(newBullet);
}

function removeFromList(id) {
    for (let i in bulletArray) {
        if (bulletArray[i].id === id) delete (bulletArray[i]);
    }
}

export function updateBullets(progress) {
    for (let i in bulletArray) {
        bulletArray[i].update(progress);
    }
}

export function bulletCollision(progress, mob) {
    if (!bulletArray.length) return;

    for (let i in bulletArray) {
        if (bulletArray[i].AABB(mob.collisionRect)) {
            mob.dealDamage(bulletArray[i]);
            removeFromList(bulletArray[i].id);
        }
    }
}

export function drawBullets(ctx) {
    if (!bulletArray.length) return;
    for (let i in bulletArray) {
        bulletArray[i].draw(ctx);
    }
}