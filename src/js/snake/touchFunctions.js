import { swipeDirectionsMaker } from './snake';

const sensitivity = 20; // sensitivity - amount of pixels, after witch gesture will be listening with swipe
let touchStart = null; //first position of touch
let touchPosition = null; //current position of touch

export const TouchStart = e => {
  e.preventDefault();
  e.stopPropagation();
  //get current position of touch
  touchStart = {
    x: e.changedTouches[0].clientX,
    y: e.changedTouches[0].clientY,
  };
  touchPosition = { x: touchStart.x, y: touchStart.y };
};

export const TouchMove = e => {
  e.preventDefault();
  e.stopPropagation();
  //get new position
  touchPosition = {
    x: e.changedTouches[0].clientX,
    y: e.changedTouches[0].clientY,
  };
};

export const TouchEnd = e => {
  e.preventDefault();
  e.stopPropagation();
  CheckAction(); //check witch gesture it was
  //clearing positions
  touchStart = null;
  touchPosition = null;
};

const CheckAction = () => {
  let d = {
    x: touchStart.x - touchPosition.x,
    y: touchStart.y - touchPosition.y,
    //get distance from start to ends points of touching (two axis)
  };

  let newDirection = '';

  if (Math.abs(d.x) > Math.abs(d.y)) {
    //Проверяем, движение по какой оси было длиннее
    if (Math.abs(d.x) > sensitivity) {
      //Проверяем, было ли движение достаточно длинным
      if (d.x > 0) {
        //Если значение больше нуля, значит пользователь двигал пальцем справа налево
        newDirection = 'left';
      } //Иначе он двигал им слева направо
      else {
        newDirection = 'right';
      }
    }
  } else {
    //Аналогичные проверки для вертикальной оси
    if (Math.abs(d.y) > sensitivity) {
      if (d.y > 0) {
        //swipe up
        newDirection = 'up';
      } else {
        //swipe down
        newDirection = 'down';
      }
    }
  }

  swipeDirectionsMaker(newDirection);
  console.log(newDirection);
};
