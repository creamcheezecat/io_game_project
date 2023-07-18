const Constants = require('../shared/constants');

class Player {
  constructor(username, x, y) {
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.x = x;
    this.y = y;
    this.direction = Math.random() * 2 * Math.PI; // 0 is north
  }

  update(dt) {
    // 움직임 관련
    this.x += dt * Constants.PLAYER_SPEED * Math.sin(this.direction);
    this.y -= dt * Constants.PLAYER_SPEED * Math.cos(this.direction);
  }

  distanceTo(object) {
    // 주변 플레이어 확인 용
    const dx = this.x - object.x;
    const dy = this.y - object.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // 업데이트 하기전에 데이터 변경
  serializeForUpdate() {
    return {
      x: this.x,
      y: this.y,
      direction: this.direction,
    };
  }
}
  
  module.exports = Player;