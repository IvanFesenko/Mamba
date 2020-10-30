import Refs from '../refs';
const { canvas } = Refs;

const getSize = () => {
  if (document.body.clientWidth < 576) {
    return 360;
  } else {
    return 528;
  }
};

canvas.width = getSize();
canvas.height = getSize();
export const width = canvas.width;
export const height = canvas.height;

//=======blocks======
export const blockSize = 12;
export const widthInBlocks = width / blockSize;
export const heightInBlocks = height / blockSize;
