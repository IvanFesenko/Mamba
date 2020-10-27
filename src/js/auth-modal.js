import refs from './refs';

function onOpenAuthModal() {
  refs.authModal.classList.add('is-open');

  window.addEventListener('keydown', onPressEsc);
}

export function onCloseModal() {
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
    refs.email.style.display = 'block';
    refs.password.style.display = 'block';
    refs.login.style.display = 'block';
    refs.singup.style.display = 'none';
  }

  if (event.target.dataset.type === 'signup') {
    refs.userName.style.display = 'block';
    refs.email.style.display = 'block';
    refs.password.style.display = 'block';
    refs.login.style.display = 'none';
    refs.singup.style.display = 'inline-block';
  }
});

refs.closeModalBtn.addEventListener('click', event => {
  onCloseModal();
});

refs.authModalOverlay.addEventListener('click', onClickBackDrop);
