import { CircularProgress, Slide, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import "./App.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";

function App() {
  const [isRaining, setIsRaining] = useState(false);
  const [cityName, setCityName] = useState("Astana");
  const [inputText, setInputText] = useState("");
  const [data, setData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDay, setIsDay] = useState(true);
  const [bgClass, setBgClass] = useState("day-bg");
  const [hourlyWeather, setHourlyWeather] = useState([]);

  function foo() {
    window.location.href = "hello.html";
  }

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setCityName(e.target.value);
      setInputText("");
    }
  };

  const sliderSettings = {
    infinite: true,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 2,
  };

  const fetchWeatherData = () => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=189271b827844bff7388350c44848615&units=metric`
    )
      .then((res) => {
        if (res.status === 200) {
          error && setError(false);
          return res.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((weatherData) => {
        setData(weatherData);

        const currentTime = new Date().getTime() / 1000;
        const sunriseTime = weatherData.sys.sunrise;
        const sunsetTime = weatherData.sys.sunset;
        const isDay = currentTime > sunriseTime && currentTime < sunsetTime;

        if (data.weather && data.weather.length > 0) {
          const weatherCondition = data.weather[0].main.toLowerCase();
          if (weatherCondition === "rain" || weatherCondition == "drizzle") {
            isRaining(true);
          } else {
            setIsRaining(false);
          }
        }

        setIsDay(isDay);

        if (isDay) {
          setBgClass("day-bg");
        } else {
          setBgClass("night-bg");
        }

        // Fetch forecast data after receiving weather data
        return fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=189271b827844bff7388350c44848615&units=metric`
        );
      })
      .then((res) => {
        if (res.status === 200) {
          error && setError(false);
          return res.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((forecastData) => {
        setHourlyWeather(forecastData.list);
        setLoading(false);
      })
      .catch(() => setError(true));
  };

  useEffect(() => {
    fetchWeatherData();
    if (data.weather && data.weather.length > 0) {
      const weatherCondition = data.weather[0].main.toLowerCase();
      if (weatherCondition === "rain") {
        setIsRaining(true);
      } else {
        setIsRaining(false);
      }
    }
  }, [cityName, error]);

  return (
    <div className={`bg_img ${bgClass}`}>
      {!loading ? (
        <>
          <div className="search-container">
            <TextField
              color=""
              size="small"
              variant="outlined"
              label="Search"
              className="input"
              error={error}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          {isRaining && (
            <div className="rain-animation">
              {[...Array(100)].map((_, index) => (
                <hr
                  key={index}
                  style={{
                    left: `${Math.floor(Math.random() * window.innerWidth)}px`,
                    animationDuration: `${0.2 + Math.random() * 0.3}s`,
                    animationDelay: `${Math.random() * 5}s`,
                  }}
                />
              ))}
            </div>
          )}

          <h1 className="city">{data.name}</h1>

          <h1 className="temp">{data.main.temp.toFixed()} °C</h1>

          <div className="group">
            <img
              src={`http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
              alt="status icon"
            />
            <h1>{data.weather[0].main}</h1>
          </div>

          {/* Обновленный блок для погоды по времени с использованием слайдера */}

          <div className="back-slider">
            <Slider className="hourly-container" {...sliderSettings}>
              {hourlyWeather.map((hour, index) => (
                <div key={index} className="hourly-item">
                  <p>
                    {new Date(hour.dt * 1000).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <img
                    src={`http://openweathermap.org/img/wn/${hour.weather[0].icon}@2x.png`}
                    alt="weather icon"
                  />
                  <p>{hour.main.temp.toFixed()} °C</p>
                </div>
              ))}
            </Slider>
          </div>

          <Slide direction="up" timeout={800} in={!loading}>
            <div className="box_container">
              <div className="box">
                <p>Humidity</p>
                <h1>{data.main.humidity.toFixed()}%</h1>
              </div>

              <div className="box">
                <p>Wind</p>
                <h1>{data.wind.speed.toFixed()} km/h</h1>
              </div>

              <div className="box">
                <p>Feels Like</p>
                <h1>{data.main.feels_like.toFixed()} °C</h1>
              </div>
            </div>
          </Slide>
        </>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
}

export default App;
