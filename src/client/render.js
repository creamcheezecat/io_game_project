import { getAsset } from './assets';
import { getCurrentState } from './state';
import { debounce } from 'throttle-debounce';

const Constants = require('../shared/constants');

const { PLAYER_RADIUS,PLAYER_MAX_HP, LAZER_SIZE, MAP_SIZE } = Constants;

// Setup the canvas and get the graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');

setCanvasDimensions();

function setCanvasDimensions() {
    // On small screens (e.g. phones), we want to "zoom out" so players can still see at least
    // 800 in-game units of width.
    const scaleRatio = Math.max(1, 800 / window.innerWidth);
    canvas.width = scaleRatio * window.innerWidth;
    canvas.height = scaleRatio * window.innerHeight;
}
// ???
window.addEventListener('resize', debounce(40, setCanvasDimensions));

function render() {
    const { me, others, lazers } = getCurrentState();
    if (!me) {
        return;
    }

    // Draw background
    renderBackground(me.x, me.y);

    // Draw boundaries
    context.strokeStyle = 'black';
    context.lineWidth = 1;
    context.strokeRect(canvas.width / 2 - me.x, canvas.height / 2 - me.y, MAP_SIZE, MAP_SIZE);

    // Draw all bullets
    lazers.forEach(renderBullet.bind(null, me));

    // Draw all players
    renderPlayer(me, me);
    others.forEach(renderPlayer.bind(null, me));
}

function renderBackground(x, y) {
    const backgroundX = MAP_SIZE / 2 - x + canvas.width / 2;
    const backgroundY = MAP_SIZE / 2 - y + canvas.height / 2;
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
}

function renderPlayer(me, player) {
    const { x, y, direction } = player;
    const canvasX = canvas.width / 2 + x - me.x;
    const canvasY = canvas.height / 2 + y - me.y;

    // Draw player
    context.save();
    context.translate(canvasX,canvasY);
    context.rotate(direction);
    context.drawImage(
        getAsset('player.svg'),
        -PLAYER_RADIUS,
        -PLAYER_RADIUS,
        PLAYER_RADIUS * 2,
        PLAYER_RADIUS * 2,
    );
    context.restore();

    // Draw health bar
    context.fillStyle = 'white';
    context.fillRect(
        canvasX - PLAYER_RADIUS,
        canvasY + PLAYER_RADIUS + 8,
        PLAYER_RADIUS * 2,
        2,
    );
    context.fillStyle = 'red';
    context.fillRect(
        canvasX - PLAYER_RADIUS + PLAYER_RADIUS * 2 * player.hp / PLAYER_MAX_HP,
        canvasY + PLAYER_RADIUS + 8,
        PLAYER_RADIUS * 2 * (1 - player.hp / PLAYER_MAX_HP),
        2,
    );
}

function renderLazer(me, Lazer) {
    const { x, y } = Lazer;
    context.drawImage(
        getAsset('lazer.svg'),
        canvas.width / 2 + x - me.x - LAZER_SIZE,
        canvas.height / 2 + y - me.y - LAZER_SIZE,
        LAZER_SIZE * 2,
        LAZER_SIZE * 2,
    );
}

function renderMainMenu() {
    const t = Date.now() / 7500;
    const x = MAP_SIZE / 2 + 800 * Math.cos(t);
    const y = MAP_SIZE / 2 + 800 * Math.sin(t);
    renderBackground(x, y);
}

let renderInterval = setInterval(renderMainMenu, 1000 / 60);

export function startRendering() {
    // Render at 60 FPS
    clearInterval(renderInterval);
    renderInterval = setInterval(render, 1000 / 60);
}

export function stopRendering() {
    clearInterval(renderInterval);
    renderInterval = setInterval(renderMainMenu, 1000 / 60);
}

/* 
모듈에서 여러 개의 값들을 내보내고 싶다면 export 문을 사용하여 각각의 값을 명시적으로 내보낼 수 있다.
export default는 한 번의 모듈에서 하나의 값만을 기본적으로 내보내고자 할 때 편리하게 사용

export default function startRendering() {
    return downloadAssets().then(() => {
      // Render at 60 FPS
      console.log('Downloaded all assets.');
      setInterval(render, 1000 / 60);
    });
}
*/