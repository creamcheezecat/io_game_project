const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const Constants = require('../shared/constants');

// Setuo an game
const Game = require('./game');

// Setup an Express server
const app = express();

//app.use(express.static('dist'));
app.use(express.static('public'));

// Setup Webpack for development
const config = require('../../webpack.config.js');
const compiler = webpack(config);
app.use(webpackDevMiddleware(compiler));

// Check server listening port
const port = process.env.PORT || 3000;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);

// Setup socket.io
const io = require('socket.io')(server);

// Listen for socket.io connections
io.on('connection', socket => {
  console.log('Player connected!', socket.id);
  
  socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
  socket.on('disconnect', onDisconnect);
});

// Setup the Game
const game = new Game();


function joinGame(username) {
  game.addPlayer(this, username);
}

function onDisconnect() {
  game.removePlayer(this);
}