import { updateInputMouse } from './networking';
import { updateInputKeyBoard } from './networking';

function onMouseInput(e) {
    handleInput(e.clientX, e.clientY);
}

function onTouchInput(e) {
  const touch = e.touches[0];
  handleInput(touch.clientX, touch.clientY);
}

function handleInput(x, y) {
  const dir = Math.atan2(x - window.innerWidth / 2, window.innerHeight / 2 - y);
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
    // 터치
    window.addEventListener('touchstart', onTouchInput);
    window.addEventListener('touchmove', onTouchInput);
    // keyboard event handlers
    window.addEventListener('keydown', onkeyDown);
    window.addEventListener('keyup', onkeyUp);
}

export function stopCapturingInput() {
    window.removeEventListener('mousemove', onMouseInput);
    window.removeEventListener('click', onMouseInput);
    // 터치
    window.addEventListener('touchstart', onTouchInput);
    window.addEventListener('touchmove', onTouchInput);
    // keyboard event handlers
    window.removeEventListener('keydown', onkeyDown);
    window.removeEventListener('keyup', onkeyUp);
}