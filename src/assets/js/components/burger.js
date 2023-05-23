const header = document.querySelector('[data-header]');
const burgerButton = document.querySelector('[data-burger]');

const menuOpen = () => {
  header.classList.add('is-open');
  document.querySelector('html').style.overflow = 'hidden';
};

const menuClose = () => {
  header.classList.remove('is-open');
  document.querySelector('html').style.overflow = 'scroll';
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    menuClose();
  }
};

const onDocumentClick = (evt) => {
  if (!evt.target.closest('.header')) {
    menuClose();
  }
};

const burgerOn = () => {
  burgerButton.addEventListener('click', () => {
    if (header.classList.contains('is-open')) {
      menuClose();
      document.removeEventListener('keydown',(evt) => onDocumentKeydown(evt));
      document.removeEventListener('click', (evt) => onDocumentClick(evt));
    } else {
      menuOpen();
      document.addEventListener('keydown', (evt) => onDocumentKeydown(evt));
      document.addEventListener('click', (evt) => onDocumentClick(evt));
    }
  });
};
