import { resetZoom } from "./zoomHandle.js";
export let KeysPressed = {};

export async function KeysHandler(event) { 
    KeysPressed[event.key.toLowerCase()] = event.type === 'keydown';
}

export async function mouseHandler(event) {
    if (event.button === 1) {
        resetZoom();
        console.log("middle mouse button");
    }
}