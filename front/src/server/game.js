const Constants = require('../shared/constants');
const Player = require('./player');
const Meteor = require('./meteor');
const bulletCollisions = require('./bulletcollisions');
const meteorCollisions = require('./meteorcollisions');

class Game {
  constructor() {
    this.sockets = {};
    this.players = {};
    this.bullets = [];
    this.meteors = [];
    this.meteorscount = 0;
    this.lastUpdateTime = Date.now();
    this.shouldSendUpdate = false;
    setInterval(this.update.bind(this), 1000 / 60);
  }

  addPlayer(socket, username) {
    this.sockets[socket.id] = socket;

    // Generate a position to start this player at.
    const x = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    const y = Constants.MAP_SIZE * (0.25 + Math.random() * 0.5);
    this.players[socket.id] = new Player(socket.id, username, x, y);
  }

  removePlayer(socket) {
    delete this.sockets[socket.id];
    delete this.players[socket.id];
  }

  handleInput(socket, dir) {
    if (this.players[socket.id]) {
      this.players[socket.id].setDirection(dir);
    }
  }

  handleInputKeyBoard(socket, key, updown) {
    if (this.players[socket.id]) {
      this.players[socket.id].setKeys(key, updown);
    }
  }

  update() {
    while(this.meteorscount < 10){
      console.log(`단어${this.meteorscount} 운석 소환`);
      this.meteors.push(new Meteor(this.meteorscount,`단어${this.meteorscount}`,Constants.MAP_SIZE * (0.25 + Math.random() * 0.5),Constants.MAP_SIZE * (0.25 + Math.random() * 0.5)))
      this.meteorscount = this.meteors.length;
    }
    // Calculate time elapsed
    const now = Date.now();
    const dt = (now - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    // Update each bullet
    const bulletsToRemove = [];
    this.bullets.forEach(bullet => {
      if (bullet.update(dt)) {
        // Destroy this bullet
        bulletsToRemove.push(bullet);
      }
    });
    this.bullets = this.bullets.filter(bullet => !bulletsToRemove.includes(bullet));

    // Update each player
    Object.keys(this.sockets).forEach(playerID => {
      const player = this.players[playerID];
      
      const newBullet = player.update(dt);
      if (newBullet) {
        this.bullets.push(newBullet);
      }
    });

    // Apply collisions, give players score for hitting bullets
    const destroyedBullets = bulletCollisions(Object.values(this.players), this.bullets);
    destroyedBullets.forEach(b => {
      if (this.players[b.parentID]) {
        this.players[b.parentID].onDealtDamage();
      }
    });
    this.bullets = this.bullets.filter(bullet => !destroyedBullets.includes(bullet));

    // Check if any players are dead
    Object.keys(this.sockets).forEach(playerID => {
      const socket = this.sockets[playerID];
      const player = this.players[playerID];
      if (player.hp <= 0) {
        socket.emit(Constants.MSG_TYPES.GAME_OVER);
        this.removePlayer(socket);
      }
    });

    // 맵 끝에 도착하면 삭제
    const meteorsToRemove = [];
    this.meteors.forEach(meteor => {
      if (meteor.update(dt)) {
        // 맵끝에 도착했으니까 삭제
        meteorsToRemove.push(meteor);
      }
    });
    this.meteors = this.meteors.filter(meteor => !meteorsToRemove.includes(meteor));

    // 플레이어랑 부딪히면 삭제
    const destroyedMeteors = meteorCollisions(Object.values(this.players), this.meteors);
    this.meteors = this.meteors.filter(meteor => !destroyedMeteors.includes(meteor));

    // Send a game update to each player every other time
    if (this.shouldSendUpdate) {
      const leaderboard = this.getLeaderboard();
      Object.keys(this.sockets).forEach(playerID => {
        const socket = this.sockets[playerID];
        const player = this.players[playerID];
        socket.emit(Constants.MSG_TYPES.GAME_UPDATE, this.createUpdate(player, leaderboard));
      });
      this.shouldSendUpdate = false;
    } else {
      this.shouldSendUpdate = true;
    }
  }

  getLeaderboard() {
    return Object.values(this.players)
      .sort((p1, p2) => p2.score - p1.score)
      .slice(0, 5)
      .map(p => ({ username: p.username, score: Math.round(p.score) }));
  }

  createUpdate(player, leaderboard) {
    const nearbyPlayers = Object.values(this.players).filter(
      p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );
    const nearbyBullets = this.bullets.filter(
      b => b.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    const nearbyMeteors = this.meteors.filter(
      m => m.distanceTo(player) <= Constants.MAP_SIZE / 2,
    );

    return {
      t: Date.now(),
      me: player.serializeForUpdate(),
      others: nearbyPlayers.map(p => p.serializeForUpdate()),
      bullets: nearbyBullets.map(b => b.serializeForUpdate()),
      meteors:nearbyMeteors.map(m => m.serializeForUpdate()),
      leaderboard,
    };
  }
}

/* -------------------------------------------------- */


/* -------------------------------------------------- */

module.exports = Game;
