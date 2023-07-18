module.exports = Object.freeze({
    PLAYER_RADIUS: 20,
    PLAYER_MAX_HP: 100,
    PLAYER_SPEED: 250,
    MAP_SIZE: 5000,
    // 통신하기 위한 프로토콜
    MSG_TYPES: {
        JOIN_GAME: 'join_game',
        GAME_UPDATE: 'update',
      },
  });