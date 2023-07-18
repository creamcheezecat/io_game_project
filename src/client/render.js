const Constants = require('../shared/constants');

// Setup the canvas and get the graphics context
const canvas = document.getElementById('game-canvas');
// 현재 창 크기에 맞춤
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext('2d');

function render() {
  // Clear everything
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the player in the center of our screen
  renderCircle(canvas.width / 2, canvas.height / 2, Constants.PLAYER_RADIUS, 'blue');
}

// Renders an circle with the given attributes
function renderCircle(x, y, r, color) {
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI);
  context.fillStyle = color;
  context.fill();
}
/* 
모듈에서 여러 개의 값들을 내보내고 싶다면 export 문을 사용하여 각각의 값을 명시적으로 내보낼 수 있다.
export default는 한 번의 모듈에서 하나의 값만을 기본적으로 내보내고자 할 때 편리하게 사용
*/
export default function startRendering() {
  // Render at 60 FPS
  setInterval(render, 1000 / 60);
}