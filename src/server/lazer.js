const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Lazer extends ObjectClass {
  constructor(x, y, dir) {
    super(x, y, dir, Constants.LAZER_SPEED);
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