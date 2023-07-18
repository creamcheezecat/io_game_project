const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Lazer extends ObjectClass {
  constructor(parentID, x, y, dir) {
    super(x, y, dir, Constants.LAZER_SPEED);
    // 충돌 확인하기 위해
    this.parentID = parentID;
  }

  // Returns true if the lazer should be destroyed
  update(dt) {
    super.update(dt);
    return (this.x < 0 || this.x > Constants.MAP_SIZE || this.y < 0 || this.y > Constants.MAP_SIZE);
  }

  serializeForUpdate() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}

module.exports = Lazer;