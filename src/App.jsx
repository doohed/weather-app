
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [weather, setWeather] = useState("")

  const api = {
    key: "7601d27d1a2f01b4687648daeedc6e6b",
    base: "https://api.openweathermap.org/data/2.5/",
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      fetch(`${api.base}weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${api.key}`)
      .then((res) => res.json())
      .then((result)=>{
        setWeather(result)
      })
    });
  });

  return (
    <div className="App">
      <h1>Weather app</h1>
      <input type="text" placeholder="Search..."></input>
      <p>{weather.name}</p>
    </div>
  );
}

export default App;
