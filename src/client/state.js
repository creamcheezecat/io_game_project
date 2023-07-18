const Constants = require('../shared/constants');

let me = {
  x: Constants.MAP_SIZE / 2,
  y: Constants.MAP_SIZE / 2,
  direction: 0,
};
let others = [];
let lazers = [];
//let keys = {};

export function processGameUpdate(data) {
  ({ me, others ,/* keys, */ lazers } = data);
}

export const getMe = () => me;
export const getOtherPlayers = () => others;
export const getLazers = () => lazers;
//export const getKeys = () => keys;