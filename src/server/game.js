const Player = require('./player');
const Constants = require('../shared/constants');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.lastUpdateTime = Date.now();
    setInterval(() => this.update, 1000 / 60);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;
    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE / 2;
    const y = Constants.MAP_SIZE / 2;
    this.players[socket.id] = new Player(username, x, y);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  update() {
     // Calculate time elapsed
     // 실질적으로 계속해서 실행되는 부분
     const now = Date.now();
     const dt = (now - this.lastUpdateTime) / 1000;
     this.lastUpdateTime = now;
 

    Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        // 계속 플레이어 업데이트 
        player.update(dt);
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player));
      });
  }

  // ??
  createUpdate(player) {
    const nearbyPlayers = Object.values(this.players).filter(p => (
      p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2
    ));
    return {
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
    };
  }

}

module.exports = Game;