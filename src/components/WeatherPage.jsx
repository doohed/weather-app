import React, { useState, useEffect } from "react";

function WeatherPage() {
  const [city, setCity] = useState("boston");
  const [holder, setHolder] = useState("");
  const [weather, setWeather] = useState(null);
  const apiKey = "7601d27d1a2f01b4687648daeedc6e6b";

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => setWeather(data))
      .catch((error) => console.error("Error fetching weather data:", error));
  }, [apiKey, city]);

  console.log(weather);

  const handleCityChange = (event) => {
    setHolder(event.target.value);
  };

  function change() {
    setCity(holder);
  }

  useEffect(() => {
    const setBackgroundImage = () => {
      if (weather) {
        const backgroundImages = {
          Clear: "https://source.unsplash.com/1600x900/?clear-sky",
          Clouds: "https://source.unsplash.com/1600x900/?cloudy",
          Rain: "https://source.unsplash.com/1600x900/?rain",
          Drizzle: "https://source.unsplash.com/1600x900/?rain",
          Thunderstorm: "https://source.unsplash.com/1600x900/?thunderstorm",
          Snow: "https://source.unsplash.com/1600x900/?snow",
          Mist: "https://source.unsplash.com/1600x900/?fog",
        };
        const weatherMain = weather.weather[0].main;
        if (backgroundImages.hasOwnProperty(weatherMain)) {
          document.body.style.backgroundImage = `url(${backgroundImages[weatherMain]})`;
        } else {
          document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?weather')`;
        }
      }
    };

    setBackgroundImage();
  }, [weather]);
  return (
    <div className="weather-container">
      <h1>Weather Information</h1>
      {weather ? (
        <div>
          <div>
            <input
              type="text"
              placeholder={weather.name}
              value={holder}
              onChange={handleCityChange}
            />
            <button onClick={change}>search</button>
          </div>
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <p>Temperature: {weather.main.temp}°C</p>
          <p>Weather: {weather.weather[0].main}</p>
          <p>Description: {weather.weather[0].description}</p>
          {weather.weather[0].icon && (
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt="Weather Icon"
            />
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default WeatherPage;
