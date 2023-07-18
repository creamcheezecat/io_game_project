const Player = require('./player');
const Constants = require('../shared/constants');
const applyCollisions = require('./collisions');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.lazers = {};
    this.lastUpdateTime = Date.now();
    this.applyCollisions = false;
    setInterval(() => this.update, 1000 / 60);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;
    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE / 2;
    const y = Constants.MAP_SIZE / 2;
    this.players[socket.id] = new Player(socket.id, username, x, y);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  //소켓에 맞는 해당 플레이어 이동
  handleInputMouse(socket, dir) {
    if (this.players[socket.id]) {
        this.players[socket.id].setDirection(dir);
    }
  }

  handleInputKeyBoard(socket, key,updown) {
    if (this.players[socket.id]) {
        this.players[socket.id].setKeys(key,updown);
    }
  }


  update() {
    // Calculate time elapsed
    // 실질적으로 계속해서 실행되는 부분
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update each lazer
    const lazersToRemove = [];
    this.lazers.forEach(lazer => {
      if (lazer.update(dt)) {
        // Destroy this lazer
        lazersToRemove.push(lazer);
      }
    });
    this.lazer = this.lazer.filter(lazer => !lazersToRemove.includes(lazer));


    Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        // 계속 플레이어 업데이트 
        const newLazer = player.update(dt);
        if (newLazer) {
            this.lazers.push(newLazer);
        }
    });

    // Apply collisions
    const destroyedLazers = applyCollisions(Object.values(this.players), this.lazers);
    this.lazers = this.lazers.filter(lazer => !destroyedLazers.includes(lazer));

    // Send a game update to each player every other time 
    // ???
    if (this.shouldSendUpdate) {
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  // ??
  createUpdate(player) {
    const nearbyPlayers = Object.values(this.players).filter(p => (
      p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2
    ));

    const nearbyLazers = this.lazers.filter(l => (
        l.distanceTo(player) <= Constants.MAP_SIZE / 2
    ));

    return {
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      lazers: nearbyLazers.map(l => l.serializeForUpdate()),
    };
  }

}

module.exports = Game;