/* jshint esversion: 6*/


// Weather HTML Elements UI
const apiContainer = document.querySelector("#api");
const apiKey = document.querySelector("#apiKey");

const notificationElement = document.querySelector(".notification");

const weatherLocation = document.querySelector(".weather-location h3");

const airQualityContainer = document.querySelector(".air-quality");
const airQualityIcon = document.querySelector(".air-quality-icon");
const airQualityIndex = document.querySelector(".air-quality-index h3");
const airQualityDesc = document.querySelector(".air-quality-index h4");

const weatherContainer = document.querySelector(".weather-container");
const weatherIcon = document.querySelector(".weather-icon");
const weatherTempIndex = document.querySelector(".weather-temperature h3");
const weatherTempDesc = document.querySelector(".weather-temperature h4");

const weatherHumidityIndex = document.querySelector(".weather-humidity p");

const updatedTime = document.querySelector("#updated-time");

// Weather Object
const weather = {
  temperature: {
      value: 18,
      unit: "celcius"
  }
};

// const key = "c68fc769-a4d3-41d3-bb08-2609d7abebe0";

// Check if API key is set in Local Storage
function checkApiInLocalStorage(){
  if(localStorage.getItem("apiKey") === null){
      apiKey.focus();
      airQualityContainer.style.visibility = "hidden";
      weatherContainer.style.visibility = "hidden";

  } else {
      apiKey.value = "";
      getLocation();
      apiContainer.style.display = "none";
      airQualityContainer.style.visibility = "visible";
      weatherContainer.style.visibility = "visible";
  }
}

// Set API Key in Local Storage
function setApiKey(e){
  if(e.type === "keydown"){
      // Make sure enter is pressed
      if(e.code === "Enter") {
        if (validateInputValue(e) !== false) {
          localStorage.setItem("apiKey", e.target.value);
          getLocation();
          apiKey.blur();
          apiContainer.style.display = "none";
          airQualityContainer.style.visibility = "visible";
          weatherContainer.style.visibility = "visible";
        }  
      }
  }
}

// Validate Input Value
function validateInputValue(e) {
  if (e.target.value == "") {
    alert("API Key must be filled out");
    return false;

  } else if (e.target.value.length < 35) {
    alert("API Key should be at least 35 characters");
    return false;
  }
  apiKey.focus();
}

// Check if browser supports geolocation
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);

  } else { 
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Geolocation is not supported by this browser.</p>";
  }
}

// Set User's Position
function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  // API call every hour
  setInterval(getAir(latitude, longitude), 3600000);
}

// Show Error if there is any issues with geolocation service
function showError(error) {
  airQualityContainer.style.display = "none";
  weatherContainer.style.display = "none";
  apiContainer.style.display = "none";
  notificationElement.style.display = "block";
  notificationElement.style.fontSize = "1em";
  notificationElement.style.textAlign = "center";
  notificationElement.style.color = "red";
  notificationElement.style.margin = "5px";
  notificationElement.innerHTML = `<p>${error.message}</p>`;
}

// Set the time when the weather was updated
function setTimeFromCurrentTime(time) {
  let reg = /\<span>:<\/span>/g;
  let currentTime = time.innerHTML.replace(reg, ':');
  return currentTime.slice(0,5);
}

// Get Weather From API
function getAir(latitude, longitude) {
  const airApiKey = localStorage.getItem("apiKey");
  let airQualityRequest = `https://api.airvisual.com/v2/nearest_city?lat=${latitude}&lon=${longitude}&key=${airApiKey}`;
  let requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  fetch(airQualityRequest, requestOptions)
    .then(response => response.json())
    .then(result => {
        let data = result.data;
        weather.temperature.value = data.current.weather.tp;
        weather.pollution = data.current.pollution.aqius;
        weather.humidity = data.current.weather.hu;
        weather.iconId = data.current.weather.ic;
        weather.city = data.city;
        weather.country = data.country;
        weather.updatedTime = setTimeFromCurrentTime(time);
    })
    .then(function(){
        displayWeather();
    })
    .catch(error => console.log('error', error));
}

// Set the Air Quality Description and Icon
  // based on air quality index, which we get from API call
function setAirQualityDescIcon(){
  
  let airIndex = weather.pollution;

  if (airIndex <= 50) {
    airQualityIcon.innerHTML = `<img src="/icons/pollution/ic-face-green.svg"/>`;
    airQualityDesc.innerHTML = "Good";
    airQualityContainer.style.backgroundColor = "#b0e867";
    airQualityContainer.style.color = "#718b3a";

  } else if (airIndex <= 100) {
    airQualityIcon.innerHTML = `<img src="/icons/pollution/ic-face-yellow.svg"/>`;
    airQualityDesc.innerHTML = "Moderate";
    airQualityContainer.style.backgroundColor = "#ffdf58";
    airQualityContainer.style.color = "#a57f23";
    airQualityIcon.style.backgroundColor = "#fdd74b";

  } else if (airIndex <= 150) {
    
    if (document.documentElement.clientWidth <= 834) {
      unhealthyAirForSensitife();

    } else {
      airQualityContainer.lastElementChild.style.width = "70%";
      airQualityIndex.style.fontSize = "150%";
      airQualityDesc.style.fontSize = "75%";
    }
      airQualityIcon.innerHTML = `<img src="/icons/pollution/ic-face-orange.svg"/>`;
      airQualityDesc.innerHTML = "Unhealthy for Sensitive Groups";
      airQualityContainer.style.backgroundColor = "#fe9b57";
      airQualityContainer.style.color = "#b25826";
    
  } else if (airIndex <= 200) {
    airQualityIcon.innerHTML = `<img src="/icons/pollution/ic-face-red.svg"/>`;
    airQualityDesc.innerHTML = "Unhealthy";
    airQualityContainer.style.backgroundColor = "#fe6a69";
    airQualityContainer.style.color = "#af2c3b";

  } else if (airIndex <= 300) {
    airQualityIcon.innerHTML = `<img src="/icons/pollution/ic-face-purple.svg"/>`;
    airQualityDesc.innerHTML = "Very Unhealthy";
    airQualityContainer.style.backgroundColor = "#a97abc";
    airQualityContainer.style.color = "#634675";

  } else if (airIndex <= 500) {
    airQualityIcon.innerHTML = `<img src="/icons/pollution/ic-face-maroon.svg"/>`;
    airQualityDesc.innerHTML = "Hazardous";
    airQualityContainer.style.backgroundColor = "#a87383";
    airQualityContainer.style.color = "#683e51";
  }
}

// Set the Weather Description
  // based on weather icon, which we get from API call
function setWeatherDesc() {
  if (weather.iconId === "01d" || weather.iconId === "01n") {
    weather.temperature.description = "Clear Sky";

  } else if (weather.iconId === "02d" || weather.iconId === "02n") {
    weather.temperature.description = "Few Clouds";

  } else if (weather.iconId === "03d") {
    weather.temperature.description = "Scattered Clouds";

  } else if (weather.iconId === "04d") {
    weather.temperature.description = "Broken Clouds";

  } else if (weather.iconId === "09d") {
    weather.temperature.description = "Shower Rain";

  } else if (weather.iconId === "10d" || weather.iconId === "10n") {
    weather.temperature.description = "Rain";

  } else if (weather.iconId === "11d") {
    weather.temperature.description = "Thunderstorm";

  } else if (weather.iconId === "13d") {
    weather.temperature.description = "Snow";

  } else if (weather.iconId === "50d") {
    weather.temperature.description = "Mist";
  }
  return weather.temperature.description;
}

// Display air & weather to UI
function displayWeather() {

  setAirQualityDescIcon();
  
  weatherLocation.innerHTML = `${weather.city}, ${weather.country}`;

  airQualityIndex.innerHTML = weather.pollution;

  weatherIcon.innerHTML = `<img src="/icons/weather/${weather.iconId}.png"/>`;
  weatherTempIndex.innerHTML = `${weather.temperature.value}\xB0<span>C</span>`;
  weatherTempDesc.innerHTML = setWeatherDesc();

  weatherHumidityIndex.innerHTML = `${weather.humidity}<span>%</span>`;

  updatedTime.innerHTML = `Updated ${weather.updatedTime}`;
}

apiKey.addEventListener("keydown", setApiKey);
apiKey.addEventListener("blur", setApiKey);
checkApiInLocalStorage();

window.addEventListener("resize", unhealthyAirForSensitife);


// HELPER FUNCTION
  // When Air Quality Index between 101 - 150
  // Air description is to long
  // Change the width and font-size
function unhealthyAirForSensitife() {
  let airIndex = weather.pollution;
  // target mobile devices and tablets
  if (document.documentElement.clientWidth <= 896 && (airIndex > 100 && airIndex < 150)) {
    if (window.matchMedia("(orientation: landscape)").matches) {
      // you're in LANDSCAPE mode
      airQualityIndex.style.marginBottom = "0.8em";
   } else {
    airQualityIndex.style.marginBottom = "0.6em";
   }

    airQualityContainer.lastElementChild.style.width = "60%";
    airQualityContainer.lastElementChild.style.marginRight = "-6em";
    airQualityIndex.style.fontSize = "100%";
    airQualityDesc.style.fontSize = "70%";
    console.log("yes");
  }
}