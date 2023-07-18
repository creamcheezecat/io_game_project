import io from 'socket.io-client';
import { throttle } from 'throttle-debounce';
import { processGameUpdate } from './state';

const Constants = require('../shared/constants');

const socket = io(`ws://${window.location.host}`);

// Promise => README
const connectedPromise = new Promise(resolve => {
  socket.on('connect', () => {
    console.log('Connected to server!');
    resolve();
  });
});

export const connect = () => connectedPromise;

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

  socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);