//setting current date and time
let apiKey = "c92aa008c831e4682122a5ffc70b2cbf";
let tempCelsius;
let tempFarenheit;

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

function celToFarenheit(temp) {
  return Math.round(temp * 1.8 + 32);
}

function switchTemp(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#current-temp");
  let celsiusLink = document.querySelector("#celsius-link");
  let farenheitLink = document.querySelector("#farenheit-link");
  if (event.currentTarget.isCelsius) {
    currentTemp.innerHTML = tempCelsius;
    celsiusLink.style.color = "#000";
    farenheitLink.style.color = "#818080";
  } else {
    currentTemp.innerHTML = tempFarenheit;
    celsiusLink.style.color = "#818080";
    farenheitLink.style.color = "#000";
  }
}

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", switchTemp);
celsiusLink.isCelsius = true;
let farenheitLink = document.querySelector("#farenheit-link");
farenheitLink.addEventListener("click", switchTemp);
farenheitLink.isCelsius = false;

function showWeatherParams(response) {
  tempCelsius = Math.round(response.data.main.temp);
  tempFarenheit = celToFarenheit(tempCelsius);
  console.log(response);
  //console.log(response.status);
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
}

function getCurrentCity(response) {
  let currentCity = document.querySelector("#current-city");
  currentCity.innerHTML = response.data.name;
  //console.log(currentCity);
}

function handleSuccessPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrlCoords = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
  // axios.get(apiUrlCoords).then(getCurrentCity);
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

let currentCityButton = document.querySelector("#current-position");
currentCityButton.addEventListener("click", getPosition);

setCurrentDateTime();
setInterval(setCurrentDateTime, 10000);

setWeatherByName();
