const Constants = require('../shared/constants');

let keys = {};

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
    // 키보드 움직임 관련
    // W
    if(keys["87"]){
        this.y -= 5;
    }// S
    if(keys["83"]){
        this.y += 5;
    }// A
    if(keys["68"]){
        this.x += 5;
    }// D
    if(keys["65"]){
        this.x -= 5;
    }

    // Make sure the player stays in bounds
    this.x = Math.max(0, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(0, Math.min(Constants.MAP_SIZE, this.y));
  }

  // 마우스 이벤트 적용 
  setDirection(dir) {
    this.direction = dir;
  }
  // 키보드 이벤트 적용
  setKeys(key,updown){
    keys[key] = updown;
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