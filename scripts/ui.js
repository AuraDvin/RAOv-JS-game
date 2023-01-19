import { isRunning } from "./game.js";
import { isMusicMuted } from './sound.js';
import { player } from "./game.js";

let fps;
let health = 100;
let documentFPSp;
let documentHEALTHp;
let documentSCOREp;
let fpsUpdate = 0;
let pauseText;
let mutedText;

export function init_ui() {
    documentFPSp = document.getElementById('fps');
    documentHEALTHp = document.getElementById('health');
    pauseText = document.getElementById('paused');
    mutedText = document.getElementById('muted');
    documentSCOREp = document.getElementById('score');
    return !(!documentFPSp || !documentHEALTHp || !pauseText || !mutedText || !documentSCOREp);
}

export function update_ui(progress) {

    fpsUpdate += progress
    if (fpsUpdate > 500) {
        fps = ~~(1000 / progress);
        fpsUpdate = 0;
    }
    // health = player.getHealth();
    documentFPSp.innerHTML = `fps: ${fps}`;
    documentHEALTHp.innerHTML = `health: ${health}`;
    documentSCOREp.innerHTML = `Kills: ${player.getScore()}`;
    pauseText.hidden = isRunning;
    mutedText.hidden = !isMusicMuted();
}

export function update_ui_health(newHealth) {
    health = newHealth;
}