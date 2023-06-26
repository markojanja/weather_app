/* eslint-disable no-param-reassign */
import { format } from 'date-fns';
import api from './api';

export default class App {
  static init() {
    this.DOM = this.cashDOM();
    App.processData();
    this.formSubmit();
  }

  static cashDOM() {
    const main = document.querySelector('.main');
    const location = document.querySelector('.location');
    const date = document.querySelector('.date-time');
    const icon = document.querySelector('.image-icon');
    const temp = document.querySelector('.temp');
    const desc = document.querySelector('.day-desc');
    const feelsLike = document.querySelector('.feels-like');
    const windSpeed = document.querySelector('.wind-speed');
    const loader = document.querySelector('.loader');
    const week = document.querySelector('.week');
    const visibility = document.getElementById('visibility');
    const humidity = document.getElementById('humidity');
    const chance = document.getElementById('chance');
    const preasure = document.getElementById('preasure');
    const uv = document.getElementById('uv');
    const wind = document.getElementById('wind');
    const toggleBtn = document.querySelector('.metric-toggle');
    const form = document.querySelector('.formSubmit');
    const error = document.querySelector('.error2');

    return {
      main,
      form,
      location,
      date,
      icon,
      temp,
      desc,
      feelsLike,
      windSpeed,
      week,
      visibility,
      humidity,
      chance,
      preasure,
      uv,
      wind,
      loader,
      toggleBtn,
      error,
    };
  }

  static async processData(name = 'London', isMetric = true) {
    try {
      const data = await api.getData(name);
      console.log(data);
      this.toggleMetric(this.DOM, data, isMetric);
      this.displayData(this.DOM, data, isMetric);
      this.displayWeekData(this.DOM, data, isMetric);
      this.hideElements([this.DOM.loader, this.DOM.error]);
    } catch (err) {
      console.log(err);
      this.handleError();
      this.DOM.toggleBtn.disabled = true;
    }
  }

  static displayData(dom, data, isMetric) {
    dom.loader.classList.remove('hide');
    dom.location.textContent = `${data.city}, ${data.country}`;
    dom.date.textContent = `${format(
      new Date(data.date),
      'EEE dd, MMM yyyy | HH:MM'
    )}`;
    dom.temp.textContent = isMetric
      ? `${data.current.temp_c}\u00B0C`
      : `${data.current.temp_f}\u00B0F`;
    dom.icon.src = `${data.current.condition.icon}`;
    dom.desc.textContent = `${data.current.condition.text}`;
    dom.feelsLike.textContent = isMetric
      ? `Feels like: ${data.current.feelslike_c}\u00B0C`
      : `Feels like: ${data.current.feelslike_f}\u00B0F`;
    dom.visibility.textContent = isMetric
      ? `${data.current.vis_km}km`
      : `${data.current.vis_miles}miles`;
    dom.humidity.textContent = `${data.current.humidity}%`;
    dom.chance.textContent = isMetric
      ? `${data.current.precip_mm}mm`
      : `${data.current.precip_in}in`;
    dom.preasure.textContent = isMetric
      ? `${data.current.pressure_mb}mb`
      : `${data.current.pressure_in}in`;
    dom.uv.textContent = `${data.current.uv}`;
    dom.wind.textContent = isMetric
      ? `${data.current.wind_kph}km/h`
      : `${data.current.wind_mph}mp/h`;
  }

  static displayWeekData(dom, data, isMetric) {
    dom.week.innerHTML = '';

    data.week.map((item) => {
      const day = format(new Date(item.date), 'cccc');
      const { icon } = item;
      const { text } = item;
      const max = isMetric
        ? `${item.maxtemp_c}\u00B0C`
        : `${item.maxtemp_f}\u00B0F`;
      const min = isMetric
        ? `${item.mintemp_c}\u00B0C`
        : `${item.mintemp_f}\u00B0F`;
      dom.week.innerHTML += `
      <div class="week-card">
        <p class="card-title">${day}</p>
        <p class="max">${max}</p>
        <img src="${icon}" alt="" srcset="">
        <p class="card-text">${text}</p>
        <p class="min">${min}</p>
      </div>`;
    });
    this.showElements([this.DOM.week, this.DOM.main]);
  }
  static toggleMetric(dom, data, isMetric) {
    const ball = document.querySelector('.ball');
    if (isMetric && ball.classList.contains('active')) {
      ball.classList.remove('active');
    }
    if (!isMetric && !ball.classList.contains('active')) {
      ball.classList.add('active');
    }
    if (data) {
      this.DOM.toggleBtn.disabled = false;
    }

    dom.toggleBtn.addEventListener('click', () => {
      isMetric = !isMetric;
      if (!isMetric) {
        ball.classList.add('active');
      }
      if (isMetric) {
        ball.classList.remove('active');
      }

      this.displayData(dom, data, isMetric);
      this.displayWeekData(dom, data, isMetric);
      this.DOM.loader.classList.add('hide');
    });
  }
  static formSubmit() {
    this.DOM.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      this.DOM.loader.classList.remove('hide');
      const input = document.querySelector('#input').value.trim();
      const error = document.querySelector('.error');
      error.classList.add('hide');
      if (input === '') {
        console.log('form is empty');
        this.hideElements([
          this.DOM.loader,
          this.DOM.main,
          this.DOM.week,
          this.DOM.error,
        ]);
        this.showElements([error]);
        this.DOM.toggleBtn.disabled = true;
      } else {
        this.processData(input);
        this.DOM.form.reset();
      }
    });
  }

  static handleError() {
    this.hideElements([this.DOM.loader, this.DOM.main, this.DOM.week]);
    this.showElements([this.DOM.error]);
  }
  static hideElements(arr) {
    arr.forEach((element) => {
      element.classList.add('hide');
    });
  }
  static showElements(arr) {
    arr.forEach((element) => element.classList.remove('hide'));
  }
}