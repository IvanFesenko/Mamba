import Block from './Block';
import apple from './Apple';
import { gameOver } from './snake';
import { MODE_CLASSIC, MODE_IGNORE_WALLS_COLLISION } from './modes';
import { widthInBlocks, heightInBlocks } from './blockSizes';

class Snake {
  constructor(mode = MODE_CLASSIC) {
    this.segments = [new Block(7, 5), new Block(6, 5), new Block(5, 5)];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.mode = mode;
    this.score = 0;
    this.animationTime = 100;
  }

  get getScore() {
    return this.score;
  }

  set setScore(score) {
    return (this.score = score);
  }

  get getAnimationTime() {
    return this.animationTime;
  }

  set setAnimationTime(time) {
    this.animationTime = time;
  }

  draw() {
    let isEvenSegment = false;
    for (let i = 0; i < this.segments.length; i += 1) {
      if (isEvenSegment) {
        this.segments[i].drawSquare('#33d9de ');
      } else {
        this.segments[i].drawSquare('#6ab1d7 ');
      }
      isEvenSegment = !isEvenSegment;
    }
    this.segments[0].drawSquare('#fff');
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
      this.score += 1;

      if (this.animationTime >= 3) {
        if (this.mode === MODE_CLASSIC) {
          this.score > 20
            ? (this.animationTime -= 1)
            : (this.animationTime -= 2);
        } else if (this.mode === MODE_IGNORE_WALLS_COLLISION) {
          if (this.score < 10) {
            this.animationTime -= 3;
          } else if (this.score > 10 && this.score < 28) {
            this.animationTime -= 2;
          } else if (this.score > 28 && this.score < 40) {
            this.animationTime -= 1;
          } else if (this.score > 40) {
            this.animationTime -= 0.5;
          } else if (this.score > 50) {
            this.animationTime = this.animationTime;
          }
        }
      } else if (this.animationTime === 1 || this.animationTime === 0) {
        this.animationTime = 1;
      }

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

    if (this.mode !== null && this.mode) {
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

export default Snake;
