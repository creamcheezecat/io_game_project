import io from 'socket.io-client';

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
  
  socket.on(Constants.MSG_TYPES.GAME_UPDATE, () => {
  
  });