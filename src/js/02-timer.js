import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';
// one by one

const refs = {
  startBtn: document.querySelector('[data-start]'),
  stopBtn: document.querySelector('[data-stop]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

refs.startBtn.setAttribute('disabled', 'disabled');
refs.stopBtn.setAttribute('disabled', 'disabled');
let selectedDate = null;
let currentDate = null;

class Timer {
  constructor() {
    this.intervalId = null;
    this.isActive = false;
  }

  start(selectedDate, currentDate) {
    this.isActive = true;
    updateTimer(selectedDate - currentDate);
    currentDate += 1000;

    this.intervalId = setInterval(() => {
      let remainder = selectedDate - currentDate;
      currentDate += 1000;
      if (remainder <= 0) {
        refs.stopBtn.setAttribute('disabled', 'disabled');
        this.stop();
        return;
      }
      updateTimer(remainder);
    }, 1000);
    Notiflix.Notify.success('Timer started');
  }

  stop() {
    clearInterval(this.intervalId);
    this.isActive = false;
  }

  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }
}

const timer = new Timer();

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    refs.startBtn.setAttribute('disabled', 'disabled');
    selectedDate = selectedDates[0].getTime();
    currentDate = new Date().getTime();

    if (selectedDate < currentDate) {
      //   window.alert('Please choose a date in the future');
      Notiflix.Notify.failure('Please choose a date in the future');
      return;
    }

    refs.startBtn.removeAttribute('disabled');
  },
};

const updateTimer = remainder => {
  const time = timer.convertMs(remainder);
  refs.days.textContent = addLeadingZero(time.days);
  refs.hours.textContent = addLeadingZero(time.hours);
  refs.minutes.textContent = addLeadingZero(time.minutes);
  refs.seconds.textContent = addLeadingZero(time.seconds);
};

const onStartBtnClick = () => {
  //   updateTimer(remainder);
  timer.start(selectedDate, currentDate);
  refs.stopBtn.textContent = 'Stop';

  refs.startBtn.setAttribute('disabled', 'disabled');
  refs.stopBtn.removeAttribute('disabled');
};
const onStopBtnClick = () => {
  refs.stopBtn.textContent = 'Reset';
  if (!timer.isActive) {
    refs.days.textContent = '00';
    refs.hours.textContent = '00';
    refs.minutes.textContent = '00';
    refs.seconds.textContent = '00';
    refs.stopBtn.setAttribute('disabled', 'disabled');
  }
  timer.stop();

  //   isActive = false;
};
const addLeadingZero = value => {
  return String(value).padStart(2, '0');
};

flatpickr('#datetime-picker', options);
refs.startBtn.addEventListener('click', onStartBtnClick);
refs.stopBtn.addEventListener('click', onStopBtnClick);

// let selectedDate = null;
// let currentDate = null;
// let intervalId = null;
// let isActive = false;

// const convertMs = ms => {
//   // Number of milliseconds per unit of time
//   const second = 1000;
//   const minute = second * 60;
//   const hour = minute * 60;
//   const day = hour * 24;

//   // Remaining days
//   const days = Math.floor(ms / day);
//   // Remaining hours
//   const hours = Math.floor((ms % day) / hour);
//   // Remaining minutes
//   const minutes = Math.floor(((ms % day) % hour) / minute);
//   // Remaining seconds
//   const seconds = Math.floor((((ms % day) % hour) % minute) / second);

//   return { days, hours, minutes, seconds };
// };

// const timer = (begin, end) => {
//   intervalId = setInterval(() => {
//     let remainder = end - begin;
//     begin += 1000;
//     if (remainder <= 0) {
//       clearInterval(intervalId);
//       return;
//     }

//     const time = convertMs(remainder);
//     refs.days.textContent = addLeadingZero(time.days);
//     refs.hours.textContent = addLeadingZero(time.hours);
//     refs.minutes.textContent = addLeadingZero(time.minutes);
//     refs.seconds.textContent = addLeadingZero(time.seconds);
//   }, 1000);
// };
