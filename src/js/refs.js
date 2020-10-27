const Refs = {
  email: document.querySelector('#inputEmail'),
  userName: document.querySelector('#inputUserName'),
  password: document.querySelector('#inputPassword'),
  login: document.querySelector('#loginbtn'),
  singup: document.querySelector('#singupbtn'),
  logout: document.querySelector('#logoutbtn'),
  startButton: document.querySelector('.snake-start'),
  canvas: document.querySelector('#canvas'),
  modeWrp: document.querySelector('.mode-wrp'),
  snakeScore: document.querySelector('.snake-score'),
  topList: document.querySelector('.players-list'),
  game: document.querySelector('.snake-wrp'),

  //auth-modal
  authModal: document.getElementById('auth-modal'),
  authModalOverlay: document.getElementById('auth-modal-overlay'),
  openModal: document.querySelector('.sing-in-wrap'),
  closeModalBtn: document.getElementById('close-auth-modal'),
};

export default Refs;
