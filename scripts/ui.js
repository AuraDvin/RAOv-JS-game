import { isRunning } from "./game.js";
import { isMusicMuted } from './sound.js';

let fps;
let health = 100;
let documentFPSp;
let documentHEALTHp;
let fpsUpdate = 0;
let pauseText;
let mutedText;

export function init_ui() {
    documentFPSp = document.getElementById('fps');
    documentHEALTHp = document.getElementById('health');
    pauseText = document.getElementById('paused');
    mutedText = document.getElementById('muted');
    return !(!documentFPSp || !documentHEALTHp || !pauseText || !mutedText);
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
    pauseText.hidden = isRunning;
    mutedText.hidden = !isMusicMuted();
}

export function update_ui_health(newHealth) {
    health = newHealth;
}