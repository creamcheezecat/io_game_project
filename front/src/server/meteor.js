const Object = require('./object');
const Constants = require('../shared/constants');

class Meteor extends Object {
  constructor(id , word , x , y) {
    super(id, x, y, Math.random() * 2 * Math.PI, Constants.METEOR_SPEED);
    this.word = word;
  }


  update(dt) {
    
    super.update(dt);
    // 리턴이 들어오면 메테오 삭제
    return this.x < 0 || this.x > Constants.MAP_SIZE || this.y < 0 || this.y > Constants.MAP_SIZE;
  }

  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      word: this.word,
    };
  }
}


module.exports = Meteor;
