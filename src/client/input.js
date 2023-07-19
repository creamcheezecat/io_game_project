import { updateInputMouse } from './networking';
import { updateInputKeyBoard } from './networking';

function onMouseInput(e) {
  const dir = Math.atan2(e.clientX - window.innerWidth / 2, window.innerHeight / 2 - e.clientY);
  updateInputMouse(dir);
}

function onkeyDown(e){
    updateInputKeyBoard(e.keyCode, true)
}

function onkeyUp(e){
    updateInputKeyBoard(e.keyCode, false)
}

export function startCapturingInput() {
    window.addEventListener('mousemove ', onMouseInput);
    window.addEventListener('click', onMouseInput);
    // keyboard event handlers
    window.addEventListener('keydown', onkeyDown);
    window.addEventListener('keyup', onkeyUp);
}

export function stopCapturingInput() {
    window.removeEventListener('mousemove', onMouseInput);
    window.removeEventListener('click', onMouseInput);
    // keyboard event handlers
    window.removeEventListener('keydown', onkeyDown);
    window.removeEventListener('keyup', onkeyUp);
}