import './css/styles.css';
import './scss/main.scss';

//

//

import './js/script.js';
import './js/snake/snake.js';
import './js/auth-modal.js';
// import './js/preloader';

// setup materialize components
// document.addEventListener('DOMContentLoaded', function () {
//   const modals = document.querySelectorAll('.modal');
//   M.Modal.init(modals);

//   const items = document.querySelectorAll('.collapsible');
//   M.Collapsible.init(items);
// });
function loadData() {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 1000);
  });
}

loadData().then(() => {
  const body = document.querySelector('.homepage');
  const preloader = document.getElementById('preloader');

  preloader.classList.add('hidden');
  preloader.classList.remove('visible');
  body.classList.remove('hidden');
});
