import Snake from './SnakeClass';
import directions from './directions';
import apple from './Apple';
import { MODE_CLASSIC } from './modes';
import { width, height, blockSize } from './blockSizes';
import { startButton, canvas, modeWrp } from './snakeRefs';
import '../../css/snake.css';

export const ctx = canvas.getContext('2d');

let playing = true;
let snake = null;
let score = 0;

const drawScore = () => {
  ctx.font = '20px Courier';
  ctx.fillStyle = 'Gold';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  // ctx.globalCompositeOperation = "destination-over"; что-то на подобии з-индекса надо тестировать
  ctx.fillText('Score: ' + score, blockSize, blockSize);
};
// ========border========
const drawBorder = () => {
  ctx.fillStyle = 'Gray';
  ctx.fillRect(0, 0, width, blockSize);
  ctx.fillRect(0, height - blockSize, width, blockSize);
  ctx.fillRect(0, 0, blockSize, height);
  ctx.fillRect(width - blockSize, 0, blockSize, height);
};

export const gameOver = () => {
  playing = false;
  snake.setScore = 0;
  if (!playing) {
    startButton.removeAttribute('disabled', 'disabled');
    // document.removeEventListener('keydown', directionsMaker);
  }

  ctx.font = '60px Courier';
  ctx.fillStyle = 'Gold';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Game Over', width / 2, height / 2);
};

//game mode

if (localStorage.getItem('mode') === null) {
  localStorage.setItem('mode', MODE_CLASSIC);
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
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
  }

  if (playing) {
    setTimeout(gameLoop, animationTime);
    startButton.setAttribute('disabled', 'disabled');
  }
};
drawBorder();

//handlers
const directionsMaker = e => {
  const newDirection = directions[e.code];
  if (newDirection !== undefined) {
    console.log(snake);
    snake.setDirection(newDirection);
  }
};

const startBtnHandler = () => {
  createNewSnake();
  gameLoop();
};

const setNewMode = e => {
  const mode = e.target.dataset.mode;
  localStorage.setItem('mode', mode);
};

//listeners
document.addEventListener('keydown', directionsMaker);
startButton.addEventListener('click', startBtnHandler);
modeWrp.addEventListener('click', setNewMode);
