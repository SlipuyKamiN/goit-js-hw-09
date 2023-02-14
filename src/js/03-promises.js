import Notiflix from 'notiflix';

const refs = {
  delay: document.querySelector('[name="delay"]'),
  step: document.querySelector('[name="step"]'),
  amount: document.querySelector('[name="amount"]'),
  createBtn: document.querySelector('button'),
};

let position = 0;
let delay = 0;
let intervalId = null;

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;
  return new Promise((resolve, reject) => {
    if (shouldResolve) {
      resolve({ position, delay });
    } else {
      reject({ position, delay });
    }
  });
}

const onCreateBtnClick = event => {
  event.preventDefault();
  delay = Number(refs.delay.value);
  step = Number(refs.step.value);
  amount = Number(refs.amount.value);
  if (amount <= 0 || delay < 0 || step < 0) {
    Notiflix.Notify.failure(` Please input correct values (>=0)`);
    return;
  }
  position = 1;

  setTimeout(() => {
    createPromise(position, delay)
      .then(({ position, delay }) => {
        Notiflix.Notify.success(` Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notiflix.Notify.failure(` Rejected promise ${position} in ${delay}ms`);
      });
    intervalId = setInterval(() => {
      if (position === amount) {
        clearInterval(intervalId);
        return;
      }
      position += 1;
      delay += step;

      createPromise(position, delay)
        .then(({ position, delay }) => {
          Notiflix.Notify.success(
            ` Fulfilled promise ${position} in ${delay}ms`
          );
        })
        .catch(({ position, delay }) => {
          Notiflix.Notify.failure(
            ` Rejected promise ${position} in ${delay}ms`
          );
        });
    }, step);
  }, delay);
};

refs.createBtn.addEventListener('click', onCreateBtnClick);
