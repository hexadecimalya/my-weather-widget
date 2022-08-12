//setting current date and time
let apiKey = "c92aa008c831e4682122a5ffc70b2cbf";
let tempCelsius;

function formatDateTime(dateTime) {
  let day = dateTime.getDate();
  let hours = dateTime.getHours();
  let minutes = dateTime.getMinutes();

  minutes = minutes < 10 ? "0" + minutes : minutes;
  hours = hours < 10 ? "0" + hours : hours;

  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let month = months[dateTime.getMonth()];
  let daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let dayOfWeek = daysOfWeek[dateTime.getDay()];
  let newFormat = `${dayOfWeek}, ${month} ${day} ${hours}:${minutes}`;
  return newFormat;
}

function setCurrentDateTime() {
  let dateTimeBlock = document.querySelector("#current-datetime");
  let currentDate = new Date();
  let dateTime = formatDateTime(currentDate);
  dateTimeBlock.innerHTML = dateTime;
}

//setting current city
function cityNotFound(error) {
  if (error.response.status === 404) {
    alert("City not found, try again");
  }
}

function setWeatherByName(cityName = "Kyiv") {
  let apiUrlCity = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
  axios.get(apiUrlCity).then(showWeatherParams).catch(cityNotFound);
}

function searchCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#city-input");
  if (searchInput.value) {
    setWeatherByName(searchInput.value);
  } else {
    alert("You didn't enter the city");
  }
}

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);



function showWeatherParams(response) {
  tempCelsius = Math.round(response.data.main.temp);
  let currentCity = document.querySelector("#current-city");
  let searchInput = document.querySelector("#city-input");
  currentCity.innerHTML = response.data.name;
  let tempElement = document.querySelector("#current-temp");
  tempElement.innerHTML = tempCelsius;
  let humidityElem = document.querySelector("#humidity");
  humidityElem.innerHTML = response.data.main.humidity;
  let windElem = document.querySelector("#wind");
  windElem.innerHTML = Math.round(response.data.wind.speed);
  let pressureElem = document.querySelector("#pressure");
  pressureElem.innerHTML = response.data.main.pressure;
  let descriptionElem = document.querySelector("#weather-description");
  descriptionElem.innerHTML = response.data.weather[0].description;
  searchInput.value = "";
  setImageByCondition(response.data);

  getForecast(response.data.coord);
}

function getCurrentCity(response) {
  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML = response.data.name;
}

function handleSuccessPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrlCoords = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  axios.get(apiUrlCoords).then(showWeatherParams);
}

function positionFailed() {
  console.log("Failed to get position");
}

function getPosition() {
  navigator.geolocation.getCurrentPosition(
    handleSuccessPosition,
    positionFailed
  );
}

function setImageByCondition(condition) {
  let imageCode = condition.weather[0].icon;
  let weatherImageElem = document.querySelector("#image-weather-main");
  let imageUrl = `http://openweathermap.org/img/wn/${imageCode}@2x.png`;
  weatherImageElem.innerHTML = `<img src="${imageUrl}" alt="" />`;
}
function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElem = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2 forecast-element">
    <div class="forecast-date">${formatDay(forecastDay.dt)}</div>
    <img src="http://openweathermap.org/img/wn/${
      forecastDay.weather[0].icon
    }.png" alt="" width="60" />
    <div class="forecast-temps">
      <span class="forecast-temp-max">${Math.round(
        forecastDay.temp.max
      )} </span> |
      <span class="forecast-temp-min"> ${Math.round(
        forecastDay.temp.min
      )} </span>
    </div>
  </div>`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElem.innerHTML = forecastHTML;
}

function getForecast(coords) {
  let lat = coords.lat;
  let lon = coords.lon;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

let currentCityButton = document.querySelector("#current-position");
currentCityButton.addEventListener("click", getPosition);

setCurrentDateTime();
setInterval(setCurrentDateTime, 10000);

setWeatherByName();
