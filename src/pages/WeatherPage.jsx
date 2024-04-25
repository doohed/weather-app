import React, { useState, useEffect } from "react";

function WeatherPage() {
  const [city, setCity] = useState("los mochis");
  const [holder, setHolder] = useState("");
  const [closest, setClosest] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(false);
  const [cityNames, setCityNames] = useState([]);
  const [isCityValid, setIsCityValid] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const apiKey = "7601d27d1a2f01b4687648daeedc6e6b";
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update time every second

    // Clear the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const formatTime = (time) => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
    // Check if geolocation is supported by the browser
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        //fetch the data for the city so can load to the client location
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`
        )
          .then((response) => response.json())
          .then((data) => setCity(data.name))
          .catch((error) =>
            console.error("Error fetching weather data:", error)
          );
      });
    } else {
      // Geolocation is not supported by the browser
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
    setError(value.length < 0);
  };

  const selectCity = (selectedCity) => {
    setHolder(selectedCity);
    setCity(selectedCity);
    setShowDropdown(false); // Hide dropdown when city is selected
    setError(false);
  };

  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => setWeather(data))
      .catch((error) => console.error("Error fetching weather data:", error));
      console.log(weather);
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
    <div className="weather-container bg-[#00000034]">
      {weather ? (
        <div className="flex" onClick={() => setShowDropdown(false)}>
          <div className="left w-[60vw] h-[100vh]">
            <div className="absolute left-[5vw] top-10">
              <h1 className="text-7xl">Weather.app</h1>
            </div>
            <div className="absolute flex bottom-10 left-[5vw]">
              <h1 className="text-8xl font-semibold">
                {weather.main.temp || 1}°C
              </h1>
              <div className="text-4xl text-left mt-3 ml-4 border-l-[3px]">
                <div className="ml-4">
                  <h2>
                    {weather.name}, {weather.sys.country}
                  </h2>
                  <h2>{formatTime(currentTime)}</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="relative bg-[#0000002d] backdrop-blur-sm right w-[40vw] h-[100vh]">
            <div className="absolute mt-[7vh] w-[30vw] bg-gray-800 left-[50%] translate-x-[-50%]">
              <div>
                <input
                  className="rounded placeholder:text-gray-700 bg-[#00000079] border-0 w-[100%] p-3 outline-none hover:bg-[#00000028] ease-in-out duration-300"
                  type="text"
                  placeholder={weather.name}
                  value={holder}
                  onChange={handleCityChange}
                />
                {error && showDropdown && <div>error bro</div>}
                {showDropdown && (
                  <div className="text-left pl-3 rounded dropdown absolute w-[100%] bg-[#000000cb]">
                    {cityNames
                      .filter((cityName) =>
                        cityName.toLowerCase().includes(holder.toLowerCase())
                      )
                      .slice(0, 10) // Only display the first 10 options
                      .map((cityName) => (
                        <div
                          className="cursor-pointer m-1 ml-0 ease-in-out duration-300 hover:text-gray-600"
                          key={cityName}
                          onClick={() => selectCity(cityName)}
                        >
                          {cityName}
                        </div>
                      ))}
                  </div>
                )}
              </div>

              <p>Weather: {weather.weather[0].main}</p>
              <div>
                <p>Description: {weather.weather[0].description}</p>
              </div>
              <p>humidity: {weather.main.humidity}</p>
              <p>wind: {weather.main.humidity}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default WeatherPage;
