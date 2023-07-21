const Constants = require('../shared/constants');

// Returns an array of bullets to be destroyed.
function meteorCollisions(players, meteors) {
    const destroyedMeteors = [];
    for (let i = 0; i < meteors.length; i++) {
      // Look for a player (who didn't create the bullet) to collide each bullet with.
      // As soon as we find one, break out of the loop to prevent double counting a bullet.
      for (let j = 0; j < players.length; j++) {
        const meteor = meteors[i];
        const player = players[j];
        if (player.distanceTo(meteor) <= Constants.PLAYER_RADIUS + Constants.PLAYER_RADIUS) 
        {
          destroyedMeteors.push(meteor);
          player.takeBulletDamage();
          break;
        }
      }
    }
    return destroyedMeteors;
  }

  module.exports = meteorCollisions;