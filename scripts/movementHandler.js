export let KeysPressed = {};

export async function KeysHandler(event) { 
    KeysPressed[event.key.toLowerCase()] = event.type === 'keydown';
}
