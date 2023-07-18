const Constants = require('../shared/constants');

// Returns an array of lazers to be destroyed.
function applyCollisions(players, lazers) {
  const destroyedLazers = [];
  for (let i = 0; i < lazers.length; i++) {
    // Look for a player (who didn't create the lazer) to collide each lazer with.
    // As soon as we find one, break out of the loop to prevent double counting a lazer.
    for (let j = 0; j < players.length; j++) {
      const lazer = lazers[i];
      const player = players[j];
      if (
        lazer.parentID !== player.id &&
        player.distanceTo(lazer) <= Constants.PLAYER_RADIUS + Constants.LAZER_SIZE
      ) {
        destroyedLazers.push(lazer);
        player.takeLazerDamage();
        break;
      }
    }
  }
  return destroyedLazers;
}

module.exports = applyCollisions;