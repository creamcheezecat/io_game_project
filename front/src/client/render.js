// Learn more about this file at:
// https://victorzhou.com/blog/build-an-io-game-part-1/#5-client-rendering
import { debounce } from 'throttle-debounce';
import { getAsset } from './assets';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');

const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE } = Constants;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
setCanvasDimensions();

// 캔버스의 크기를 설정하는 함수
function setCanvasDimensions() {
  // 작은 화면 (예: 핸드폰)에서는 "확대/축소"를 해서 플레이어가 최소한
  // 800개의 게임 유닛 너비를 볼 수 있게 한다.
  // const scaleRatio = Math.max(1, 800 / window.innerWidth);
  // canvas.width = scaleRatio * window.innerWidth;
  // canvas.height = scaleRatio * window.innerHeight;

  canvas.width = 1200;
  canvas.height = 800;

}

// 화면 크기가 변경될 때 캔버스 크기를 업데이트
window.addEventListener('resize', debounce(40, setCanvasDimensions));

let animationFrameRequestId;

// 게임의 현재 상태를 그리는 함수
function render() {
  const { me, others, bullets,meteors } = getCurrentState();
  if (me) {

    // 배경 그리기
    renderBackground(me.x, me.y);

    // 경계선 그리기
    context.strokeStyle = 'white';
    context.lineWidth = 5;
    context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);

    // 모든 총알 그리기
    //bullets.forEach(renderBullet.bind(null, me));
    meteors.forEach(renderMeteor.bind(null, me));
    // 모든 플레이어 그리기
    
    renderPlayer(me, me);
    others.forEach(renderPlayer.bind(null, me));
  }

  // 다음 프레임에서 이 render 함수를 다시 실행
  animationFrameRequestId = requestAnimationFrame(render);
}


// 배경을 그리는 역할, 그라데이션
function renderBackground(x, y) {


  // Draw black background
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid
  const gridSize = 50; // Define the size of the grid here
  context.strokeStyle = 'white';
  context.lineWidth = 0.5;

  // Calculate the boundary in canvas coordinates
  const boundaryX = canvas.width / 2 - x;
  const boundaryY = canvas.height / 2 - y;

  // Draw vertical lines
  for (let i = 0; i < MAP_SIZE; i += gridSize) {
    const canvasX = canvas.width / 2 + i - x;
    if (canvasX >= boundaryX && canvasX <= boundaryX + MAP_SIZE) {
      context.beginPath();
      context.moveTo(canvasX, boundaryY);
      context.lineTo(canvasX, boundaryY + MAP_SIZE);
      context.stroke();
    }
  }

  // Draw horizontal lines
  for (let i = 0; i < MAP_SIZE; i += gridSize) {
    const canvasY = canvas.height / 2 + i - y;
    if (canvasY >= boundaryY && canvasY <= boundaryY + MAP_SIZE) {
      context.beginPath();
      context.moveTo(boundaryX, canvasY);
      context.lineTo(boundaryX + MAP_SIZE, canvasY);
      context.stroke();
    }
  }
}

function renderShields(me,player, i){
  const { x, y ,direction} = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;
  let ssize = 50;
  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction);
  context.drawImage(
    getAsset('shield.png'),
    -PLAYER_RADIUS - (ssize/2*i),
    -PLAYER_RADIUS - (ssize/2*i),
    PLAYER_RADIUS * 2 + (ssize*i),
    PLAYER_RADIUS * 2 + (ssize*i),
  );
  context.restore();

}

// 주어진 좌표에서 배를 그리는 함수
function renderPlayer(me, player) {
  const { x, y, direction ,username ,shields} = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;

  // 배 그리기
  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction);
  context.drawImage(
    getAsset('ship.svg'),
    -PLAYER_RADIUS,
    -PLAYER_RADIUS,
    PLAYER_RADIUS * 2,
    PLAYER_RADIUS * 2,
  );
  context.restore();

  context.fillStyle = 'white'; // 텍스트 색상 설정
  context.font = '20px Arial'; // 텍스트 폰트 설정
  context.textAlign = 'center'; // 텍스트 정렬 설정
  context.fillText(username, canvasX, canvasY + PLAYER_RADIUS + 20); // 텍스트 그리기

  for(let i = me.shields ; i > 0 ; i--){
    console.log(i);
    renderShields(me,player, i);
  }
}

// 총알을 그리는 함수
function renderBullet(me, bullet) {
  const { x, y } = bullet;
  context.drawImage(
    getAsset('bullet.svg'),
    canvas.width / 2 + x - me.x - BULLET_RADIUS,
    canvas.height / 2 + y - me.y - BULLET_RADIUS,
    BULLET_RADIUS * 2,
    BULLET_RADIUS * 2,
  );
}

function renderMeteor(old_pos, new_pos) {
  const { x, y, direction,word } = new_pos;
  const canvasX = canvas.width / 2 + x - old_pos.x;
  const canvasY = canvas.height / 2 + y - old_pos.y;

  // 배 그리기
  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(direction);
  context.drawImage(
      getAsset('circle.png'),
      -PLAYER_RADIUS,
      -PLAYER_RADIUS,
      PLAYER_RADIUS * 2,
      PLAYER_RADIUS * 2,
  );
  context.restore();


  context.fillStyle = 'white'; // 텍스트 색상 설정
  context.font = '20px Arial'; // 텍스트 폰트 설정
  context.textAlign = 'center'; // 텍스트 정렬 설정
  context.fillText(word, canvasX, canvasY + PLAYER_RADIUS + 20); // 텍스트 그리기
}

// 메인 메뉴를 그리는 함수
function renderMainMenu() {
  const t = Date.now() / 7500;
  // const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  // const y = MAP_SIZE / 2 + 800 * Math.sin(t);
  const x = MAP_SIZE / 2;
  const y = MAP_SIZE / 2;
  renderBackground(x, y);

  // 다음 프레임에서 이 render 함수를 다시 실행
  animationFrameRequestId = requestAnimationFrame(renderMainMenu);
}

// 초기 애니메이션 프레임 요청
animationFrameRequestId = requestAnimationFrame(renderMainMenu);

// 메인 메뉴 렌더링을 게임 렌더링으로 교체하는 함수
export function startRendering() {
  cancelAnimationFrame(animationFrameRequestId);
  animationFrameRequestId = requestAnimationFrame(render);
}

// 게임 렌더링을 메인 메뉴 렌더링으로 교체하는 함수
export function stopRendering() {
  cancelAnimationFrame(animationFrameRequestId);
  animationFrameRequestId = requestAnimationFrame(renderMainMenu);
}
