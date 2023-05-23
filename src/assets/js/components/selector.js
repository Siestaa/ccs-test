const selectorValue = document.querySelector('[data-type="selector"]'); //текущее значение селектора
const selector = document.querySelector('#selector');
const selectorFormValue = selector.querySelector('input'); //инпут для отправки данных
const selectorList = selector.querySelector('ul'); //Выпадающий список селектора
const selectorVariants = [...selector.querySelectorAll('[data-value]')];

const openSelector = () => {
  selectorList.classList.remove('form__selector-list--hide');
  selector.classList.add('form__selector--open');
};

const closeSelector = () => {
  selectorList.classList.add('form__selector-list--hide');
  selector.classList.remove('form__selector--open');
};

const changeValue = (item) => {
  selectorValue.innerText = item.dataset.value;
  selectorFormValue.value = item.dataset.value;
};

const onDocumentKeydownSelector = (evt) => {
  if (evt.key === 'Escape') {
    closeSelector();
  }
};

const onDocumentClickSelector = (evt) => {
  if (!evt.target.closest('#selector')) {
    closeSelector();
  }
};

const onSelector = () => {
  selectorVariants.map((item) => {
    item.addEventListener('click', () => changeValue(item));
  });

  selector.addEventListener('click', () => {
    if (selectorList.classList.contains('form__selector-list--hide')) {
      openSelector();
      document.addEventListener('keydown', (evt) => onDocumentKeydownSelector(evt));
      document.addEventListener('click', (evt) => onDocumentClickSelector(evt));
    } else {
      closeSelector();
      document.removeEventListener('keydown', (evt) => onDocumentKeydownSelector(evt));
      document.removeEventListener('click', (evt) => onDocumentClickSelector(evt));
    }
  });
};
