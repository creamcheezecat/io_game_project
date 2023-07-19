import io from 'socket.io-client';
import { throttle } from 'throttle-debounce';
import { processGameUpdate } from './state';

const Constants = require('../shared/constants');

const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`,{ reconnection: false });

// Promise => README
const connectedPromise = new Promise(resolve => {
  socket.on('connect', () => {
    console.log('Connected to server!');
    resolve();
  });
});

// 플레이어가 죽으면
export const connect = onGameOver => (
    connectedPromise.then(() => {
      // Register callbacks
      socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);
      socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
      socket.on('disconnect', () => {
        console.log('Disconnected from server.');
        document.getElementById('disconnect-modal').classList.remove('hidden');
        document.getElementById('reconnect-button').onclick = () => {
            window.location.reload();
        };
      });
    })
);

export function play(username) {
    socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
}
  
// 마우스 이벤트 가는곳
export const updateInputMouse = throttle(20, dir => {
    socket.emit(Constants.MSG_TYPES.INPUTMOUSE, dir);
});

export const updateInputKeyBoard = throttle(20 , (keys,updown) => {
    socket.emit(Constants.MSG_TYPES.INPUTKEYBOARD, keys ,updown);
});