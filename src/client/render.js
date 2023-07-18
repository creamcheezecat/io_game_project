import { downloadAssets, getAsset } from './assets';
import { getMe, getOtherPlayers } from './state';

const Constants = require('../shared/constants');

const { PLAYER_RADIUS, MAP_SIZE } = Constants;

// Setup the canvas and get the graphics context
const canvas = document.getElementById('game-canvas');
// 현재 창 크기에 맞춤
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext('2d');

function render() {
    const me = getMe();

  // Draw background
  const backgroundX = MAP_SIZE / 2 - me.x + canvas.width / 2;
  const backgroundY = MAP_SIZE / 2 - me.y + canvas.height / 2;
  // ??
  const backgroundGradient = context.createRadialGradient(
    backgroundX,
    backgroundY,
    MAP_SIZE/10,
    backgroundX,
    backgroundY,
    MAP_SIZE / 2,
  );
  backgroundGradient.addColorStop(0, 'black');
  backgroundGradient.addColorStop(1, 'gray');
  context.fillStyle = backgroundGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw boundaries
  context.strokeStyle = 'black';
  context.lineWidth = 1;
  context.strokeRect(backgroundX - MAP_SIZE / 2, backgroundY - MAP_SIZE / 2, MAP_SIZE, MAP_SIZE);
  
  // Draw all players
  renderPlayer(me, me);
  getOtherPlayers().forEach(renderPlayer.bind(null, me));
}

function renderPlayer(me, player) {
    const { x, y, direction } = player;
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate(direction);
    context.drawImage(
      getAsset('player.svg'),
      x - PLAYER_RADIUS - me.x,
      y - PLAYER_RADIUS - me.y,
      PLAYER_RADIUS * 2,
      PLAYER_RADIUS * 2,
    );
    context.restore();
  }
/* 
모듈에서 여러 개의 값들을 내보내고 싶다면 export 문을 사용하여 각각의 값을 명시적으로 내보낼 수 있다.
export default는 한 번의 모듈에서 하나의 값만을 기본적으로 내보내고자 할 때 편리하게 사용
*/
export default function startRendering() {
    return downloadAssets().then(() => {
      // Render at 60 FPS
      console.log('Downloaded all assets.');
      setInterval(render, 1000 / 60);
    });
}