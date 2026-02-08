// Run when website loads
window.onload = function () {
  requestLocation();
};


/* ===============================
   REQUEST USER LOCATION
================================ */

function requestLocation() {

  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    locationSuccess,
    locationFailed
  );
}


/* ===============================
   IF LOCATION ALLOWED
================================ */

function locationSuccess(position) {

  const lat = position.coords.latitude;
  const lon = position.coords.longitude;

  console.log("Lat:", lat, "Lon:", lon);

  fetchWeather(lat, lon);
}


/* ===============================
   IF LOCATION DENIED
================================ */

function locationFailed() {

  alert("Please allow location to see live weather");
}


/* ===============================
   FETCH WEATHER (OPEN-METEO)
================================ */

async function fetchWeather(lat, lon) {

  const url =
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${lat}` +
    `&longitude=${lon}` +
    "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code" +
    "&timezone=auto";

  try {

    const response = await fetch(url);
    const data = await response.json();

    console.log("API Data:", data);

    if (!data.current) {
      alert("Live weather not available");
      return;
    }

    const current = data.current;

    const temperature = current.temperature_2m;
    const humidity = current.relative_humidity_2m;
    const windSpeed = current.wind_speed_10m;
    const code = current.weather_code;


    // Update UI
    document.getElementById("temp").innerText =
      Math.round(temperature) + "°C";

    document.getElementById("humidity").innerText =
      humidity + "%";

    document.getElementById("wind").innerText =
      windSpeed + " km/h";

    document.getElementById("condition").innerText =
      getWeatherText(code);


  } catch (error) {

    console.log("Fetch Error:", error);
    alert("Failed to fetch weather");

  }
}


/* ===============================
   WEATHER CODE → TEXT
================================ */

function getWeatherText(code) {

  const map = {

    0: "Clear Sky ☀️",
    1: "Mainly Clear 🌤",
    2: "Partly Cloudy ⛅",
    3: "Cloudy ☁️",

    45: "Fog 🌫",
    48: "Fog 🌫",

    51: "Drizzle 🌦",
    61: "Rain 🌧",

    71: "Snow ❄️",

    95: "Thunderstorm ⛈"
  };

  return map[code] || "Normal Weather";
}
/* ===============================
   SEARCH BY CITY (OPTIONAL)
================================ */

async function getWeather() {

  const city = document.getElementById("cityInput").value;

  if (city === "") {
    alert("Enter city name");
    return;
  }

  const geoURL =
    "https://geocoding-api.open-meteo.com/v1/search" +
    `?name=${city}&count=1`;

  try {

    const res = await fetch(geoURL);
    const data = await res.json();

    if (!data.results) {
      alert("City not found");
      return;
    }

    const lat = data.results[0].latitude;
    const lon = data.results[0].longitude;

    fetchWeather(lat, lon);

  } catch (err) {

    alert("City search failed");

  }
}