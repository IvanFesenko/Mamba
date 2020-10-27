import refs from './refs';

function onOpenAuthModal() {
  refs.authModal.classList.add('is-open');

  window.addEventListener('keydown', onPressEsc);
}

function onCloseModal() {
  refs.authModal.classList.remove('is-open');
  window.removeEventListener('keydown', onPressEsc);
}

function onPressEsc() {
  if (event.key === 'Escape') {
    onCloseModal();
  }
}

function onClickBackDrop(event) {
  if (event.target === event.currentTarget) {
    onCloseModal();
  }
}

// function createAuthForm() {
//   const modalForm = refs.authForm.cloneNode(true);
//   refs.authForm.remove();
//   refs.authModalContent.appendChild(modalForm);
// }

// function returnAuthForm() {
//   const modalForm = refs.authForm.cloneNode(true);
//   refs.authForm.remove();
//   refs.head.prepend(modalForm);
// }

refs.openModal.addEventListener('click', event => {
  console.dir(event.target);
  if (
    event.target.dataset.type !== 'logout' &&
    event.target.nodeName === 'BUTTON'
  ) {
    onOpenAuthModal();
  }

  if (event.target.dataset.type === 'signin') {
    refs.userName.style.display = 'none';
    refs.email.style.display = 'inline-block';
    refs.password.style.display = 'inline-block';
    refs.login.style.display = 'inline';
    refs.singup.style.display = 'none';
  }

  if (event.target.dataset.type === 'signup') {
    refs.userName.style.display = 'inline';
    refs.email.style.display = 'inline-block';
    refs.password.style.display = 'inline-block';
    refs.login.style.display = 'none';
    refs.singup.style.display = 'inline';
  }
});

refs.closeModalBtn.addEventListener('click', event => {
  onCloseModal();
});

refs.authModalOverlay.addEventListener('click', onClickBackDrop);
