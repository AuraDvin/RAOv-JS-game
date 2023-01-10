import { changePause, g_timestamp } from "./game.js";
import { resetZoom } from "./zoomHandle.js";
import { muteMusic, lowerMusic, higherMusic } from './sound.js';
export let KeysPressed = {};

export async function KeysHandler(event) {
    const key = event.key.toLowerCase();
    KeysPressed[key] = event.type === 'keydown';
    if (KeysPressed[key]) {
        if (key == 'escape') {
            changePause();
        }
        if (key == 'm') {
            muteMusic(g_timestamp);
            console.log('muted');
        }
        if (key == '+') {
            higherMusic();
            console.log('increased');
        }
        if (key == '-') {
            lowerMusic();
            console.log('decreased');
        }
    }

}

export async function mouseHandler(event) {
    if (event.button === 1) {
        resetZoom();
    }
}