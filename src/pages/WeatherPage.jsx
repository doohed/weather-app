import React, { useState, useEffect } from "react";

function WeatherPage() {
  const [city, setCity] = useState("boston");
  const [holder, setHolder] = useState("");
  const [closest, setClosest] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(false);
  const [cityNames, setCityNames] = useState([]);
  const [isCityValid, setIsCityValid] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const apiKey = "7601d27d1a2f01b4687648daeedc6e6b";
  const [errorMessage, setErrorMessage] = useState(null); // Changed name to errorMessage
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update time every second

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const formatTime = (time) => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };


  useEffect(() => {
    // Check if geolocation is supported by the browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          //fetch the data for the city so can load to the client location
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`
          )
            .then((response) => response.json())
            .then((data) => setCity(data.name))
            .catch((error) =>
              console.error("Error fetching weather data:", error)
            );
        },
        (error) => {
          // On error, set the errorMessage state
          setErrorMessage(error.message);
        }
      );
    } else {
      // Geolocation is not supported by the browser
      setErrorMessage("Geolocation is not supported by your browser");
    }
  }, []); // Empty dependency array ensures the effect runs only once

  useEffect(() => {
    fetchCityNames();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        if (showDropdown && cityNames.length > 0) {
          if (closest[0]) {
            selectCity(closest[0]);
          } else {
            setError(true);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [showDropdown, cityNames, closest]);

  const fetchCityNames = async () => {
    fetch("https://countriesnow.space/api/v0.1/countries/population/cities")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data from the API");
        }
        return response.json();
      })
      .then((data) => {
        const cities = data.data.map((cityData) => cityData.city.toLowerCase());
        setCityNames(cities);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCityChange = (event) => {
    const value = event.target.value.toLowerCase();
    setHolder(value);
    setIsCityValid(cityNames.includes(value));
    setClosest(
      cityNames.filter((city) => city.toLowerCase().startsWith(value))
    );
    if (!isCityValid) {
      console.error("Invalid city entered");
    }
    setShowDropdown(value.length > 0); // Show dropdown only when input has characters
  };

  const selectCity = (selectedCity) => {
    setHolder(selectedCity);
    setCity(selectedCity);
    setShowDropdown(false); // Hide dropdown when city is selected
  };

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => setWeather(data))
      .catch((error) => console.error("Error fetching weather data:", error));
  }, [apiKey, city]);
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
    <div className="weather-container bg-[#10fffffff] backdrop-blur-sm w-[300px] ml-[50%] translate-x-[-50%]">
      <h1>Weather Information</h1>
      {weather ? (
        <div>
          <div>
            <input
              className="w-[300px]"
              type="text"
              placeholder={weather.name}
              value={holder}
              onChange={handleCityChange}
            />
            {error && <div>error bro</div>}
            {showDropdown && (
              <div className="dropdown absolute">
                {cityNames
                  .filter((cityName) =>
                    cityName.toLowerCase().includes(holder.toLowerCase())
                  )
                  .slice(0, 20) // Only display the first 10 options
                  .map((cityName) => (
                    <div
                      className="cursor-pointer bg-white m-1 w-[300px] ml-0"
                      key={cityName}
                      onClick={() => selectCity(cityName)}
                    >
                      {cityName}
                    </div>
                  ))}
              </div>
            )}
          </div>

          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <div>Current time: {formatTime(currentTime)}</div>
          <p>Temperature: {weather.main.temp || 1}°C</p>
          <p>Weather: {weather.weather[0].main}</p>
          <div>
            <p>Description: {weather.weather[0].description}</p>
            {weather.weather[0].icon && (
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                alt="Weather Icon"
              />
            )}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default WeatherPage;
