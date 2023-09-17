const dateElem = document.querySelector(".weather-data .date");
const searchForm = document.querySelector(".main-weather form");
const defaultCityWeatherElem = document.querySelector(".default-city-weather");
const defaultCityWeather = defaultCityWeatherElem.querySelector(
  ".default-city-weather-data"
);

// month list
const monthsList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
// day list
const daysList = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const getCurrentTime = () => {
  let second = new Date().getSeconds();
  let minute = new Date().getMinutes();
  let hour = new Date().getHours();
  let day = new Date().getDay();
  let date = new Date().getDate();
  let month = new Date().getMonth();
  let year = new Date().getFullYear();
  let am_pm;
  setInterval(() => {
    am_pm = new Date().getHours() > 12 ? "PM" : "AM";
    if (second === 60) {
      minute++;
      second = 0;
    }
    if (minute > 59) {
      hour++;
      minute = 0;
    }
    if (hour > 12) {
      hour = 1;
    }
    second++;
    dateElem.innerHTML = `
    <div>${hour}:${minute === 60 ? 0 : minute}:${
      second === 60 ? 0 : second
    } ${am_pm}</div>
    <div>${daysList[day]}, ${date} ${monthsList[month]}, ${year}</div>
    `;
  }, 1000);
};
getCurrentTime();

const getFullDate = (timeStamp) => {
  const dateObj = new Date(timeStamp * 1000);
  const year = dateObj.getFullYear();
  const month = ("0" + dateObj.getMonth()).slice(-2);
  const day = ("0" + dateObj.getDay()).slice(-2);
  const date = ("0" + dateObj.getDate()).slice(-2);
  const hour = ("0" + dateObj.getMonth()).slice(-2);
  const minute = ("0" + dateObj.getMinutes()).slice(-2);
  const second = ("0" + dateObj.getSeconds()).slice(-2);
  return `
  <div>${hour}:${minute}:${second}</div>
  <div>${daysList[parseInt(day)]}, ${date} ${
    monthsList[parseInt(month)]
  }, ${year}</div>
  `;
};
getFullDate(1690166726);

const showWeatherData = (data) => {
  console.log(data);

  const dateElem = getFullDate(data.dt);
  defaultCityWeather.innerHTML = `
  <div class="city">
    <a href="https://www.google.com/maps/place/${data.name}" target="_blank">
      <i class="fa-solid fa-location-dot"></i>
      <p class="city-name">${data.name}, ${data.sys.country}</p>
    </a>
    <i class="fa-solid fa-rotate-right"></i>
  </div>
  <div class="img-container">
  <img src=http://openweathermap.org/img/wn/${data.weather[0].icon}.png alt="weather-icon" class="weather-icon">
  </div>
  <div class="date">${dateElem}</div>
  <div class="temperature">
   ${data.main.temp}<sup>o</sup>
  </div>
  <div class="weather-name">${data.weather[0].main}</div>
  <div class="wind">
    <i class="fa fa-wind"></i>
    <span>Wind</span>
    <span class="divider"></span>
    <span class="wind-speed">${data.wind.speed} km/h</span>
  </div>
  <div class="hum">
    <i class="fa-solid fa-droplet"></i>
    <span>Hum</span>
    <span class="divider"></span>
    <span class="hum">${data.main.humidity} %</span>
  </div>
  `;
  console.log(defaultCityWeather);
  // const { weather_icons } = current;
  // const { name, country, region } = location;
  // defaultCityWeatherElem.querySelector(
  //   ".city-name"
  // ).textContent = `${data.name}, ${data.sys.country}`;
  // defaultCityWeatherElem
  //   .querySelector(".weather-icon")
  //   .setAttribute("src", `http://openweathermap.org/img/wn/${data.weather.icon}.png`);
  // defaultCityWeatherElem.querySelector(
  //   ".temperature"
  // ).innerHTML = `${data.main.temp}<sup>o</sup`;

  // defaultCityWeatherElem.querySelector('.weather-name').textContent = `${data.weather.main}`
};

const API_KEY = "a9eff1a8b2bc670c4017e376978cbcb5";

const getWeatherData = async ({ lat, lon }) => {
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
  console.log(URL);
  const response = await fetch(URL);
  const data = await response.json();
  showWeatherData(data);
};

const getCoordinate = async (location) => {
  const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${API_KEY}`;
  const response = await fetch(URL);
  const data = await response.json();
  return data;
};

const getLocation = async (e) => {
  e.preventDefault();
  const searchInput = e.currentTarget[0];
  if (!searchInput.value) return;
  const location = searchInput.value;
  const coordinate = await getCoordinate(location);
  getWeatherData(coordinate[0]);
};

searchForm.addEventListener("submit", getLocation);

const successCallback = (position) => {
  const { latitude: lat, longitude: lon } = position.coords;
  // console.log(lat, lon);
  getWeatherData({ lat, lon });
};

const errorCallback = (error) => {
  console.log(error);
};
const options = {
  enableHighAccuracy: true,
  timeout: 10000,
};

navigator.geolocation.getCurrentPosition(
  successCallback,
  errorCallback,
  options
);
