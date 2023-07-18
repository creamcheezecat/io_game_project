const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const Constants = require('../shared/constants');

// Setup an Express server
const app = express();

//app.use(express.static('dist'));
app.use(express.static('public'));

// Setup Webpack for development
const webpackConfig = require('../../webpack.config.js');
const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler));

// Check server listening port
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

// Setup socket.io
const socketIo = require('socket.io');
const io = socketIo(server);

// Listen for socket.io connections
io.on('connection', socket => {
  console.log('Player connected!', socket.id);

  socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
  // 마우스 이벤트
  socket.on(Constants.MSG_TYPES.INPUTMOUSE, handleInputMouse);
  // 키보드 이벤트
  socket.on(Constants.MSG_TYPES.INPUTKEYBOARD, handleInputKeyBoard);
  socket.on('disconnect', onDisconnect);
});

// Setup the Game
const Game = require('./game');
const game = new Game();


function joinGame(username) {
  game.addPlayer(this, username);
}

function handleInputMouse(dir) {
  game.handleInputMouse(this, dir);
}

function handleInputKeyBoard(key,updown) {
  game.handleInputKeyBoard(this, key,updown);
}

function onDisconnect() {
  game.removePlayer(this);
}