/* eslint-disable no-param-reassign */
import { format } from 'date-fns';
import api from './api';
import handlers from './handlers';
import errors from './errors';

export default class App {
  static init() {
    this.DOM = this.cacheDOM();
    this.processData();
    this.formSubmit();
  }

  static cacheDOM() {
    return {
      main: document.querySelector('.main'),
      location: document.querySelector('.location'),
      date: document.querySelector('.date-time'),
      icon: document.querySelector('.image-icon'),
      temp: document.querySelector('.temp'),
      desc: document.querySelector('.day-desc'),
      feelsLike: document.querySelector('.feels-like'),
      windSpeed: document.querySelector('.wind-speed'),
      loader: document.querySelector('.loader'),
      week: document.querySelector('.week'),
      visibility: document.getElementById('visibility'),
      humidity: document.getElementById('humidity'),
      chance: document.getElementById('chance'),
      preasure: document.getElementById('preasure'),
      uv: document.getElementById('uv'),
      wind: document.getElementById('wind'),
      toggleBtn: document.querySelector('.metric-toggle'),
      form: document.querySelector('.formSubmit'),
      error: document.querySelector('.error'),
    };
  }

  static async processData(name = 'London', isMetric = true) {
    try {
      const data = await api.getData(name);
      this.toggleMetric(this.DOM, data, isMetric);
      this.displayData(this.DOM, data, isMetric);
      this.displayWeekData(this.DOM, data, isMetric);
      handlers.hideElements([this.DOM.loader, this.DOM.error]);
    } catch (err) {
      errors.handleInputError(this.DOM, 'City not found');
      this.DOM.toggleBtn.disabled = true;
    }
  }

  static displayData(dom, data, isMetric) {
    dom.loader.classList.remove('hide');
    dom.location.textContent = `${data.city}, ${data.country}`;
    dom.date.textContent = `${format(
      new Date(data.date),
      // eslint-disable-next-line comma-dangle
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
      return 1;
    });
    handlers.showElements([this.DOM.week, this.DOM.main]);
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
      // eslint-disable-next-line no-unused-expressions
      isMetric ? ball.classList.remove('active') : ball.classList.add('active');
      this.displayData(dom, data, isMetric);
      this.displayWeekData(dom, data, isMetric);
      this.DOM.loader.classList.add('hide');
    });
  }

  static formSubmit() {
    this.DOM.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      handlers.showElements([this.DOM.loader]);
      const input = document.querySelector('#input').value.trim();
      this.DOM.error.classList.add('hide');
      if (input === '') {
        errors.handleInputError(this.DOM, 'Invalid input.Please try again');
      } else {
        this.processData(input);
        this.DOM.form.reset();
      }
    });
  }
}
