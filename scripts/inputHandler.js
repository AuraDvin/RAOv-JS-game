import { changePause, g_timestamp } from "./game.js";
import { resetZoom } from "./zoomHandle.js";
import { muteMusic, lowerMusic, higherMusic } from './sound.js';
export let KeysPressed = {};

export function areSettingsSet() {
    for (let i in defaults) {
        for (let j in defaults[i]) {
            if (i === 'move') {
                if (!localStorage[j])
                    setDefaults();
            } else if (i === 'music') {
                if (!localStorage['v' + j])
                    setDefaults();
            }
        }
    }
    if (!localStorage.color) localStorage.color = 'salmon';
    if (!localStorage.volume) localStorage.volume = 40;
    if (!localStorage.musicTime) localStorage.musicTime = 0;
    if (!localStorage.shoot) localStorage.shoot = ' ';
}

export function setDefaults() {
    for (let i in defaults) {
        console.log(`Now is ${i}`);
        for (let j in defaults[i]) {
            console.log(`And also ${j}`);
            if (i === 'move') {
                localStorage[j] = defaults[i][j];
            } else if (i === 'music') {
                localStorage['v' + j] = defaults[i][j];
            } else if (i === 'shoot'){
                localStorage[i] = defaults[i][j];
            }
        }
    }
}


export async function KeysHandler(event) {
    const key = event.key.toLowerCase();
    KeysPressed[key] = event.type === 'keydown';
    if ((!localStorage.vup || !localStorage.vdown || !localStorage.vmute) && key !== 'escape') {
        console.error('keys undefinded')
        return;
    }
    if (KeysPressed[key]) {
        if (key == 'escape') {
            changePause();
        }
    }

}

export async function mouseHandler(event) {
    if (event.button === 1) {
        resetZoom();
    }
}

export const defaults = {
    "user":"null",
    "color":'salmon',
    "actions": {
        "shoot": " "
    },
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