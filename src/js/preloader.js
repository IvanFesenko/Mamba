function loadData() {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 1000);
  });
}

loadData().then(() => {
  const body = document.querySelector('body');
  const preloader = document.getElementById('preloader');

  preloader.classList.add('hidden');
  preloader.classList.remove('visible');
  body.classList.remove('hidden');
});
