import { changePause, g_timestamp } from "./game.js";
import { resetZoom } from "./zoomHandle.js";
import { muteMusic, lowerMusic, higherMusic } from './sound.js';
export let KeysPressed = {};



export function setDefaults() {
    for (let i in defaults) {
        console.log(`Now is ${i}`);
        for (let j in defaults[i]) {
            console.log(`And also ${j}`);
            if (i === 'move') {
                localStorage[j] = defaults[i][j];
            } else if (i === 'music') {
                localStorage['v' + j] = defaults[i][j];
            }
        }
    }
}



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

export const defaults = {
    "move": {
        "up": "w",
        "down": "s",
        "left": "a",
        "right": "d"
    },
    "music": {
        "mute": "m",
        "up": "+",
        "down": "-",
    },
    "volume": 40,
    "musicTime": 0
};