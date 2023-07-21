const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');

class Player extends ObjectClass {
  constructor(id, username, x, y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.PLAYER_SPEED);
    this.username = username;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = 0;
    this.score = 0;
    this.keycodes = {};
    this.shields = 5;
  }

  
  // Returns a newly created bullet, or null.
  update(dt) {
    // 앞으로 나가는거
    // super.update(dt);

    // // Update score
    // this.score += dt * Constants.SCORE_PER_SECOND;

    // Make sure the player stays in bounds
    this.x = Math.max(-1, Math.min(Constants.MAP_SIZE, this.x));
    this.y = Math.max(-1, Math.min(Constants.MAP_SIZE, this.y));

    // Fire a bullet, if needed
    // this.fireCooldown -= dt;
    // if (this.fireCooldown <= 0) {
    //   this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
    //   return new Bullet(this.id, this.x, this.y, this.direction);
    // }
    let q = 0;
    let r = 0;
    if (this.keycodes['87']) {
      r += 1;
      this.y -= Constants.PLAYER_SPEED / 40;
    }// S
    if (this.keycodes['83']) {
      r -= 1;
      this.y += Constants.PLAYER_SPEED / 40;
    }// A
    if (this.keycodes['68']) {
      q += 1
      //this.tempdir += Math.atan2(1, 0);
      this.x += Constants.PLAYER_SPEED / 40;
    }// D
    if (this.keycodes['65']) {
      q -= 1
      //this.tempdir += Math.atan2(-1, 0);
      this.x -= Constants.PLAYER_SPEED / 40;
    }// W
    //this.tempdir = this.tempdir === 0 ? super.getDirection() : this.tempdir ;
    super.setDirection(Math.atan2(q, r));
    return null;
  }

  takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE;
  }

  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      username : this.username,
      direction: this.direction,
      shields : this.shields,
      hp: this.hp,
    };
  }

  setKeys(key, updown) {
    this.keycodes[key] = updown;
  }

}


module.exports = Player;
