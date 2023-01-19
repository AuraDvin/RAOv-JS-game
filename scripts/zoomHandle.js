import { view } from './game.js';

const MAX_ZOOM = 2;
const MIN_ZOOM = 0.4;
const SCROLL_SENSITIVITY = 0.0005;

let canvasZoom = 1;


//! beta feature (now it just needs to scale from the center not the top left :P)
export function scaleHandler(event) {
  let cameraZoom = 1;
  // cameraZoom -= event.deltaY * SCROLL_SENSITIVITY;
  cameraZoom = Math.max(Math.min(cameraZoom - event.deltaY * SCROLL_SENSITIVITY, MAX_ZOOM), MIN_ZOOM);
  canvasZoom *= cameraZoom;

  if (canvasZoom > 5) {
    console.log(`zoom over 5 ${canvasZoom}`);
    canvasZoom = 5;
  } else if (canvasZoom < 0.2) {
    console.log(`zoom under 0.2 ${canvasZoom}`);
    canvasZoom = 0.2;
  } else {
    view[0] *= cameraZoom;
    view[3] *= cameraZoom;
  }
}

export async function resetZoom() {
  view[0] = 1;
  view[3] = 1;
  canvasZoom = 1;
}