document.getElementById("searchBtn").addEventListener("click", getWeather);

async function getWeather() {
  const city = document.getElementById("city").value;
  if (!city) {
    alert("Please enter a city name");
    return;
  }

  // Get latitude & longitude using Geocoding API
  const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
  const geoData = await geoRes.json();

  if (!geoData.results || geoData.results.length === 0) {
    alert("City not found!");
    return;
  }

  const { latitude, longitude, name, country } = geoData.results[0];

  // Fetch current weather
  const weatherRes = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
  );
  const weatherData = await weatherRes.json();
  const weather = weatherData.current_weather;

  document.getElementById("weatherInfo").innerHTML = `
    <h2>${name}, ${country}</h2>
    <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
    <p><strong>Wind Speed:</strong> ${weather.windspeed} km/h</p>
    <p><strong>Condition:</strong> ${getWeatherCondition(weather.weathercode)}</p>
    <p><small>Last Updated: ${weather.time}</small></p>
  `;
}


function getWeatherCondition(code) {
  const conditions = {
    0: "Clear sky ☀️",

    1: "Mainly clear 🌤",

    2: "Partly cloudy ⛅",

    3: "Overcast ☁️",

    45: "Fog 🌫",

    48: "Depositing rime fog ❄️",

    51: "Light drizzle 🌦",

    61: "Rain 🌧",

    71: "Snowfall 🌨",

    95: "Thunderstorm ⛈"
  };
  return conditions[code] || "Unknown";
}
