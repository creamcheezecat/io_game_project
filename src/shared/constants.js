module.exports = Object.freeze({
    PLAYER_RADIUS: 20,
    PLAYER_MAX_HP: 100,
    PLAYER_SPEED: 350,
    PLAYER_FIRE_COOLDOWN: 0.25,

    LAZER_SIZE: 3,
    LAZER_SPEED: 1000,
    LAZER_DAMAGE: 100,
    MAP_SIZE: 5000,
    // 통신하기 위한 프로토콜
    MSG_TYPES: {
        JOIN_GAME: 'join_game',
        GAME_UPDATE: 'update',
        INPUTMOUSE: 'inputmouse',
        INPUTKEYBOARD: 'inputkeyboard',
        GAME_OVER: 'dead',
    },
});