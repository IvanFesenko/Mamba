import Block from './Block';
import { widthInBlocks, heightInBlocks } from './blockSizes';

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

const apple = new Apple();
export default apple;
