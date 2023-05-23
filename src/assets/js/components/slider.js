const sliderElement = document.querySelector('.form__slider');
const discontField = document.querySelector('#discont');
const discontValue = document.querySelector('#discount-value');

noUiSlider.create(sliderElement, {
  range: {
    min: 0,
    max: 100,
  },
  start: 75,
  step: 1,
});

sliderElement.noUiSlider.on('update', () => {
  let currentValue = Number(sliderElement.noUiSlider.get());
  discontField.value = currentValue;
  discontValue.innerText = `${currentValue}%`;
});
