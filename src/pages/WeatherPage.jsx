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
          Clear: "https://images.unsplash.com/photo-1612251276789-9b1a8f2add8b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          Clouds: "https://images.unsplash.com/photo-1536514498073-50e69d39c6cf?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          Rain: "https://images.unsplash.com/photo-1437624155766-b64bf17eb2ce?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          Drizzle: "https://images.unsplash.com/photo-1556485689-33e55ab56127?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          Thunderstorm: "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          Snow: "https://images.unsplash.com/photo-1551582045-6ec9c11d8697?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          Mist: "https://images.unsplash.com/photo-1585508889431-a1d0d9c5a324?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        };
        const weatherMain = weather.weather[0].main;
        if (backgroundImages.hasOwnProperty(weatherMain)) {
          document.body.style.backgroundImage = `url(${backgroundImages[weatherMain]})`;
        } else {
          document.body.style.backgroundImage = `url('https://images.unsplash.com/photo-1611497601666-d443be26befe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`;
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
            <div className="absolute bottom-10 left-[5vw] max-[1090px]:inline max-[1090px]:border-l-[0px] max-[1090px]:m-0 max-[1090px]:w-[100%] max-[1090px]:top-[130px] max-[1090px]:left-[-15px]">
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
