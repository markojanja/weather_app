/* eslint-disable object-curly-newline */
const api = (() => {
  function getWeekData(arr) {
    const ls = [];
    arr.forEach((element) => {
      const obj = {
        date: element.date,
        icon: element.day.condition.icon,
        text: element.day.condition.text,
        maxtemp_c: element.day.maxtemp_c,
        maxtemp_f: element.day.maxtemp_f,
        mintemp_c: element.day.mintemp_c,
        mintemp_f: element.day.mintemp_f,
      };

      ls.push(obj);
    });

    ls.shift();

    return ls;
  }

  const getData = async (name) => {
    const key = '6ed80fefc86a422aa5c133955231406 ';
    const url = `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${name}&days=7&aqi=no&alerts=no`;

    const reposnse = await fetch(url);
    if (!reposnse.ok) {
      throw new Error(`Error data not found ${reposnse.status}`);
    }
    const data = await reposnse.json();
    const { current, location, forecast } = data;

    return {
      city: location.name,
      country: location.country,
      date: location.localtime,
      current,
      week: getWeekData(forecast.forecastday),
    };
  };

  return { getData };
})();

export default api;
