import Snake from './SnakeClass';
import directions from './directions';
import apple from './Apple';
// import barrier from './Barrier';
import { MODE_CLASSIC } from './modes';
import { TouchStart, TouchMove, TouchEnd } from './touchFunctions';
import { width, height, blockSize } from './blockSizes';
import Refs from '../refs';
import { setStatsHTML } from '../stats';
import { updateUserStats, userGetTop, userLoggedIn } from '../firebase';
import '../../css/snake.css';

const modeInputs = Refs.modeWrp.querySelectorAll('input');
export const ctx = Refs.canvas.getContext('2d');

let playing = false;
let snake = null;
let score = 0;

//handlers
const arrowKeysHandler = e => {
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
    localStorage.setItem('mode', mode);
  }
  setStatsHTML();
};

const drawGameOver = () => {
  ctx.font = '500 52px Arial';
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

//=======================================swipes

export const swipeDirectionsMaker = newDirection => {
  //set new directions
  if (playing) {
    if (
      newDirection === 'up' ||
      newDirection === 'down' ||
      newDirection === 'right' ||
      newDirection === 'left'
    ) {
      if (newDirection !== undefined) {
        snake.setDirection(newDirection);
      }
    }
  }
};

//=======================================swipes

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
    document.removeEventListener('keydown', directionsMaker);
    modeInputs.forEach(e => {
      e.removeAttribute('disabled', 'disabled');
    });
    window.removeEventListener('keydown', arrowKeysHandler, false);

    canvas.removeEventListener('touchstart', e => TouchStart(e)); //first touch
    canvas.removeEventListener('touchmove', e => TouchMove(e)); //moving touch
    canvas.removeEventListener('touchend', TouchEnd); // user end touching
    canvas.removeEventListener('touchcancel', TouchEnd); // user end touching
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
    document.addEventListener('keydown', directionsMaker);

    //listeners for touching(swiping) in canvas

    canvas.addEventListener('touchstart', e => TouchStart(e)); //first touch
    canvas.addEventListener('touchmove', e => TouchMove(e)); //moving touch
    canvas.addEventListener('touchend', TouchEnd); // user end touching
    canvas.addEventListener('touchcancel', TouchEnd); // user end touching
  }
};
drawBorder();

//listeners
Refs.startButton.addEventListener('click', startBtnHandler);
Refs.modeWrp.addEventListener('click', setNewMode);
