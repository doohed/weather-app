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
  const apiKey = "f294009b9a4437d54d118149fc958565";

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
        const cities = data.data.map((cityData) => cityData.city.toLowerCase().replace(/\s*\(.*?\)\s*/, ''));
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
    <div className="weather-container bg-[#00000069]">
      {weather ? (
        <div className="flex max-[1090px]:inline " onClick={() => setShowDropdown(false)} >
          <div className="hidden absolute h-[100vh] w-[100vw] max-[1090px]:bg-[#00000069] max-[1090px]:backdrop-blur max-[1090px]:block"></div>
          <div className="left w-[60vw] h-[100vh] max-[1090px]:h-auto">
            <div className="absolute left-[5vw] top-10 max-[1090px]:left-0 max-[1090px]:w-[100vw]">
              <h1 className="text-7xl max-[1090px]:text-5xl max-[1090px]:text-center">Weather.app</h1>
            </div>
            <div className="absolute flex bottom-10 left-[5vw] max-[1090px]:inline max-[1090px]:border-l-[0px] max-[1090px]:mb-[0vmin] max-[1090px]:w-[90%] max-[1090px]:top-[130px] max-[1090px]:left-[-8px] ">
              <h1 className="text-8xl font-semibold max-[1090px]:text-6xl max-[1090px]:ml-8 ">
                {weather.main.temp | 0}°C
              </h1>
              <div className="text-4xl text-left mt-3 ml-4 border-l-[3px] max-[1090px]:border-l-[0px] max-[1090px]:text-center">
                <div className="ml-4">
                  <h2>
                    {weather.name}, {weather.sys.country}
                  </h2>
                  <h2>{weather.weather[0].description}</h2>
                </div>
              </div>
            </div>
          </div>
          <div className="relative bg-[#0000002d] backdrop-blur-lg right w-[40vw] h-[100vh] max-[1090px]:h-auto max-[1090px]:w-[100vw] max-[1090px]:top-[250px]">
            <div className="absolute mt-[7vh] w-[30vw] left-[50%] translate-x-[-50%] max-[1090px]:w-[90vw]">
              <div>
                <input
                  className="rounded placeholder:text-gray-400 bg-[#00000011] border-0 w-[100%] p-3 outline-none hover:bg-[#00000048] ease-in-out duration-300 max-[1090px]:placeholder:text-gray-400"
                  type="text"
                  placeholder={weather.name}
                  value={holder}
                  onChange={handleCityChange}
                />
                {error && showDropdown && <div className="rounded absolute left-[50%] translate-x-[-50%] bg-[#830909fd] p-1 mt-2">No matches</div>}
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
              <div className="grid grid-cols-2 text-2xl mt-10 font-light">
                <p className="text-left mt-10">Weather:</p>                
                <p className="text-right mt-10">{weather.weather[0].main}</p>
                <p className="text-left mt-10">Humidity:</p>
                <p className="text-right mt-10">{weather.main.humidity} %</p>
                <p className="text-left mt-10">Wind:</p>
                <p className="text-right mt-10">{weather.wind.speed} Km/h</p>
              </div>
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
