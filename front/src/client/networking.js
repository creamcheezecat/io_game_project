import io from 'socket.io-client';
import { throttle } from 'throttle-debounce';
import { processGameUpdate } from './state';

const Constants = require('../shared/constants');

// 이 부분을 서버와 연결
const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false });
//

const connectedPromise = new Promise(resolve => {
  socket.on('connect', () => {
    console.log('Connected to server!');
    resolve();
  });
});

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

export const play = username => {
  socket.emit(Constants.MSG_TYPES.JOIN_GAME, username);
};

export const updateDirection = throttle(20, dir => {
  socket.emit(Constants.MSG_TYPES.INPUT, dir);
});

/* -------------------------------------------------- */

export const updateInputKeyBoard = throttle(1 , (key,updown) => {
  socket.emit(Constants.MSG_TYPES.INPUTKEYBOARD, key,updown);
});