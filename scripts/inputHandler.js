import { changePause } from "./game.js";
import { resetZoom } from "./zoomHandle.js";
export let KeysPressed = {};

export async function KeysHandler(event) { 
    const key = event.key.toLowerCase();
    KeysPressed[key] = event.type === 'keydown';
    if (KeysPressed[key] && key == 'escape'){
        changePause();
    }
}

export async function mouseHandler(event) {
    if (event.button === 1) {
        resetZoom();
    }
}