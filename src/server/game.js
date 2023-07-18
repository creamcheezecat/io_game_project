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

    
        // Update each player
        Object.keys(this.sockets).forEach(playerID => {
            const player = this.players[playerID];
            // 계속 플레이어 업데이트 
            const newLazer = player.update(dt);
            if (newLazer) {
                this.lazers.push(newLazer);
            }
        });

        // Apply collisions, give players score for hitting
        const destroyedLazers = applyCollisions(Object.values(this.players), this.lazers);
        destroyedBullets.forEach(b => {
            if (this.players[b.parentID]) {
                his.players[b.parentID].getScore();
            }
        });
        this.lazers = this.lazers.filter(lazer => !destroyedLazers.includes(lazer));

        // Check if any players are dead
        Object.keys(this.sockets).forEach(playerID => {
            const socket = this.sockets[playerID];
            const player = this.players[playerID];
            if (player.hp <= 0) {
            socket.emit(Constants.MSG_TYPES.GAME_OVER);
            this.removePlayer(socket);
            }
        });

        // Send a game update to each player every other time 
        // ???
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

    // 점수판 갱신
    getLeaderboard() {
        const sortedPlayers = Object.values(this.players).sort((p1, p2) => p2.score - p1.score);
        return sortedPlayers
            .slice(0, 5)
            .map(p => ({ username: p.username, score: Math.round(p.score) }));
    }

    // ??
    createUpdate(player, leaderboard) {
        const nearbyPlayers = Object.values(this.players).filter(
        p => p !== player && p.distanceTo(player) <= Constants.MAP_SIZE / 2,
        );

        const nearbyLazers = this.lazers.filter(l => l.distanceTo(player) <= Constants.MAP_SIZE / 2);

        return {
            t: Date.now(),
            me: player.serializeForUpdate(),
            others: nearbyPlayers.map(p => p.serializeForUpdate()),
            lazers: nearbyLazers.map(l => l.serializeForUpdate()),
            leaderboard,
        };
    }

}

module.exports = Game;