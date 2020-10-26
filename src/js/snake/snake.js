import Snake from './SnakeClass';
import directions from './directions';
import apple from './Apple';
import { MODE_CLASSIC } from './modes';
import { width, height, blockSize } from './blockSizes';
import Refs from '../refs';
import { setStatsHTML } from '../stats';
import { updateUserStats, userGetTop, userLoggedIn } from '../firebase';
import '../../css/snake.css';

const modeInputs = Refs.modeWrp.querySelectorAll('input');
export const ctx = Refs.canvas.getContext('2d');

let playing = true;
let snake = null;
let score = 0;

//handlers
const arrowKeysHandler = e => {
  console.log('block');
  switch (e.code) {
    case 'ArrowLeft':
    case 'ArrowUp':
    case 'ArrowRight':
    case 'ArrowDown':
    case 'Space':
      e.preventDefault();
      break; // Space
    default:
      break; // do not block other keys
  }
};

const directionsMaker = e => {
  const newDirection = directions[e.code];
  if (newDirection !== undefined) {
    console.log(snake);
    snake.setDirection(newDirection);
  }
};

const startBtnHandler = () => {
  if (userLoggedIn()) {
    createNewSnake();
    gameLoop();
  } else {
    alert('You need to sign in first');
  }
};

const setNewMode = e => {
  const mode = e.target.dataset.mode;
  if (mode) {
    console.log(mode);
    localStorage.setItem('mode', mode);
  }
};

const drawGameOver = () => {
  ctx.font = '500 60px Arial';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Game Over', width / 2, height / 2);
};

// ========border========

const grd = ctx.createLinearGradient(0, 0, 170, 0);
grd.addColorStop(0, '#6ab1d7 ');
grd.addColorStop(0.5, '#38d9de  ');
grd.addColorStop(1, '#33d9de ');

const drawBorder = () => {
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, width, blockSize);
  ctx.fillRect(0, height - blockSize, width, blockSize);
  ctx.fillRect(0, 0, blockSize, height);
  ctx.fillRect(width - blockSize, 0, blockSize, height);
};
//============================

export const gameOver = () => {
  playing = false;

  updateUserStats(score);
  if (userGetTop(score)) {
    // можно что-то показать
  } else {
    setStatsHTML();
  }

  snake.setScore = 0;

  if (!playing) {
    Refs.startButton.removeAttribute('disabled', 'disabled');
    // document.removeEventListener('keydown', directionsMaker);
    modeInputs.forEach(e => {
      e.removeAttribute('disabled', 'disabled');
    });
    window.removeEventListener('keydown', arrowKeysHandler, false);
  }

  drawGameOver();
};

//game mode

if (localStorage.getItem('mode') === null) {
  localStorage.setItem('mode', MODE_CLASSIC);
}

if (localStorage.getItem('mode') !== null) {
  const mode = localStorage.getItem('mode');
  modeInputs.forEach(e => {
    if (mode === e.dataset.mode) {
      e.setAttribute('checked', 'checked');
    }
  });
}

//__________create snake and apple__________

const createNewSnake = () => {
  snake = new Snake(localStorage.getItem('mode'));
  playing = true;
};

//start actions
const gameLoop = function () {
  let animationTime;
  if (snake !== null) {
    animationTime = snake.getAnimationTime;
    score = snake.getScore;
    ctx.clearRect(0, 0, width, height);
    Refs.snakeScore.textContent = `Score: ${score}`;
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
  }

  if (playing) {
    setTimeout(gameLoop, animationTime);
    Refs.startButton.setAttribute('disabled', 'disabled');
    modeInputs.forEach(e => {
      e.setAttribute('disabled', 'disabled');
    });
    window.addEventListener('keydown', arrowKeysHandler, false);
  }
};
drawBorder();

//listeners
document.addEventListener('keydown', directionsMaker);
Refs.startButton.addEventListener('click', startBtnHandler);
Refs.modeWrp.addEventListener('click', setNewMode);
