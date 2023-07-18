import { connect , play } from './networking';
import  startRendering from './render';
import { startCapturingInput } from './input';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/main.css';

const playMenu = document.getElementById('play-menu');
const playButton = document.getElementById('play-button');
const usernameInput = document.getElementById('username-input');

// Promise.all => README
Promise.all([
  connect(),
  startRendering(),
]).then(() => {
  playMenu.classList.remove('hidden');
  playButton.onclick = () => {
    // 게임 시작 !
    play(usernameInput.value);
    playMenu.classList.add('hidden');
    startCapturingInput();
  };
}).catch(console.error);