const MODE_CLASSIC = 'classic';
const MODE_IGNORE_WALLS_COLLISION = 'ignoreWallsCollisionMode';

const startButton = document.querySelector('.snake-start');
const canvas = document.querySelector('#canvas');
const modeWrp = document.querySelector('.mode-wrp');
const ctx = canvas.getContext('2d');

import '../../css/snake.css';

const width = canvas.width;
const height = canvas.height;

//=====DIRECTIONS=====
const directions = {
  ArrowLeft: 'left',
  ArrowUp: 'up',
  ArrowRight: 'right',
  ArrowDown: 'down',
  KeyA: 'left',
  KeyW: 'up',
  KeyD: 'right',
  KeyS: 'down',
};

//=======blocks======
const blockSize = 10;
const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;

// time
let playing = true;
let animationTime = 100;
//======= SCORE=======

let score = 0;

const drawScore = function () {
  ctx.font = '20px Courier';
  ctx.fillStyle = 'Gold';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  // ctx.globalCompositeOperation = "destination-over"; что-то на подобии з-индекса надо тестировать
  ctx.fillText('Score: ' + score, blockSize, blockSize);
};

// ========border========
const drawBorder = function () {
  ctx.fillStyle = 'Gray';
  ctx.fillRect(0, 0, width, blockSize);
  ctx.fillRect(0, height - blockSize, width, blockSize);
  ctx.fillRect(0, 0, blockSize, height);
  ctx.fillRect(width - blockSize, 0, blockSize, height);
};

//==========game over==========
const gameOver = function () {
  playing = false;

  if (!playing) {
    startButton.removeAttribute('disabled', 'disabled');
    document.removeEventListener('keydown', directionsMaker);
  }

  ctx.font = '60px Courier';
  ctx.fillStyle = 'Gold';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Game Over', width / 2, height / 2);
};

//========circle========
const circle = function (x, y, radius, fillCircle) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  if (fillCircle) {
    ctx.fill();
  }
};

// ====== block ========
class Block {
  constructor(col, row) {
    this.col = col;
    this.row = row;
  }

  drawSquare(color) {
    const x = this.col * blockSize;
    const y = this.row * blockSize;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, blockSize, blockSize);
  }

  drawCircle(color) {
    const centerX = this.col * blockSize + blockSize / 2;
    const centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true);
  }

  equal(otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
  }
}

//=========SNAKE========
class Snake {
  constructor(mode = 'classic') {
    this.segments = [new Block(7, 5), new Block(6, 5), new Block(5, 5)];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.mode = mode;
  }
  draw() {
    // this.segments.forEach((element) => element.drawSquare("blue"));

    let isEvenSegment = false;
    for (let i = 0; i < this.segments.length; i += 1) {
      if (isEvenSegment) {
        this.segments[i].drawSquare('gold');
      } else {
        this.segments[i].drawSquare('blue');
      }
      isEvenSegment = !isEvenSegment;
    }
    this.segments[0].drawSquare('silver');
  }

  move() {
    const head = this.segments[0];
    let newHead;

    this.direction = this.nextDirection;

    if (this.direction === 'right') {
      newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === 'down') {
      newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === 'left') {
      newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === 'up') {
      newHead = new Block(head.col, head.row - 1);
    }

    if (this.checkCollision(newHead)) {
      console.log('dtp');
      gameOver();
      return;
    }

    this.segments.unshift(newHead);

    if (newHead.equal(apple.position)) {
      score += 1;
      animationTime -= 2;
      apple.move();
    } else {
      this.segments.pop();
    }
  }

  ignoreWallsCollisionMode(
    leftCollision,
    topCollision,
    rightCollision,
    bottomCollision,
    wallCollision,
    selfCollision,
    head,
  ) {
    //змейка умеет ходить сквозь стены
    //=================================
    if (wallCollision && rightCollision) {
      head.col = 1;
    } else if (wallCollision && leftCollision) {
      head.col = widthInBlocks - 1;
    } else if (wallCollision && topCollision) {
      head.row = heightInBlocks - 1;
    } else if (wallCollision && bottomCollision) {
      head.row = 1;
    }

    return selfCollision;
  }

  classicMode(wallCollision, selfCollision) {
    return wallCollision || selfCollision; // if snake has dtp wit wall or herself
  }

  checkCollision(head) {
    const leftCollision = head.col === 0;
    const topCollision = head.row === 0;
    const rightCollision = head.col === widthInBlocks - 1;
    const bottomCollision = head.row === heightInBlocks - 1;
    const wallCollision =
      leftCollision || topCollision || rightCollision || bottomCollision;

    let selfCollision = false;
    this.segments.forEach(element => {
      if (head.equal(element)) {
        selfCollision = true;
      }
    });

    if (this.mode !== null) {
      if (this.mode === MODE_CLASSIC) {
        return this.classicMode(wallCollision, selfCollision);
      } else if (this.mode === MODE_IGNORE_WALLS_COLLISION) {
        return this.ignoreWallsCollisionMode(
          leftCollision,
          topCollision,
          rightCollision,
          bottomCollision,
          wallCollision,
          selfCollision,
          head,
        );
      }
    }

    // return wallCollision || selfCollision; // if snake has dtp wit wall or herself
  }

  setDirection(newDirection) {
    if (this.direction === 'up' && newDirection === 'down') {
      return;
    } else if (this.direction === 'right' && newDirection === 'left') {
      return;
    } else if (this.direction === 'down' && newDirection === 'up') {
      return;
    } else if (this.direction === 'left' && newDirection === 'right') {
      return;
    }
    this.nextDirection = newDirection;
  }
}

//======apple======
class Apple {
  constructor() {
    this.position = new Block(10, 10);
  }

  draw() {
    this.position.drawCircle('Gold');
  }

  move() {
    const randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    const randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
    this.position = new Block(randomCol, randomRow);

    //check to see if apple has been moved to a block currently occupied by the snake
  }
}

//game mode

if (localStorage.getItem('mode') === null) {
  localStorage.setItem('mode', 'classic');
}

//__________create snake and apple__________
const apple = new Apple();
const snake = new Snake(localStorage.getItem('mode'));
// const snake = new Snake('ignoreWallsCollisionMode');

//================
//start actions
const gameLoop = function () {
  if (!!snake) {
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
gameLoop();

//handlers
const directionsMaker = e => {
  const newDirection = directions[e.code];
  if (newDirection !== undefined) {
    snake.setDirection(newDirection);
  }
};

const startBtnHandler = () => {
  window.location.reload();
  // gameLoop();
};

const setNewMode = e => {
  const mode = e.target.dataset.mode;
  localStorage.setItem('mode', mode);
};

//listeners
document.addEventListener('keydown', directionsMaker);
startButton.addEventListener('click', startBtnHandler);
modeWrp.addEventListener('click', setNewMode);
