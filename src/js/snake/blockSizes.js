import Refs from '../refs';
const { canvas } = Refs;

const getSize = () => {
  const size = document.body.clientWidth;
  if (size < 576 && size > 362) {
    return 360;
  } else if (size < 362) {
    return 324;
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
