import React from "react";
import { useWeather } from "./Weather";

const Card = () => {
  const { weather, city, loading, error, forecast } = useWeather();

  if (loading) {
    return (
      <div className="weather-card loading">
        <div className="loading-content">
          <div className="loading-spinner-large">⏳</div>
          <p>Getting weather data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weather-card error">
        <div className="error-content">
          <div className="error-icon">🔍</div>
          <h3>City Not Found</h3>
          <p>{error}</p>
          <p className="error-hint">Try searching for a different city</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="weather-card placeholder">
        <div className="placeholder-content">
          <div className="placeholder-icon">🌍</div>
          <h3>Welcome to Weather Now!</h3>
        </div>
      </div>
    );
  }

  const getWeatherIcon = (code) => {
    const weatherIcons = {
      0: "☀️", // Clear sky
      1: "🌤️", // Mainly clear
      2: "⛅", // Partly cloudy
      3: "☁️", // Overcast
      45: "🌫️", // Fog
      48: "🌫️", // Depositing rime fog
      51: "🌦️", // Light drizzle
      53: "🌦️", // Moderate drizzle
      55: "🌦️", // Dense drizzle
      61: "🌧️", // Slight rain
      63: "🌧️", // Moderate rain
      65: "🌧️", // Heavy rain
      71: "❄️", // Slight snow
      73: "❄️", // Moderate snow
      75: "❄️", // Heavy snow
      77: "🌨️", // Snow grains
      80: "🌦️", // Slight rain showers
      81: "🌧️", // Moderate rain showers
      82: "🌧️", // Violent rain showers
      85: "🌨️", // Slight snow showers
      86: "🌨️", // Heavy snow showers
      95: "⛈️", // Thunderstorm
      96: "⛈️", // Thunderstorm with slight hail
      99: "⛈️", // Thunderstorm with heavy hail
    };
    return weatherIcons[code] || "🌤️";
  };

  const getWeatherDescription = (code) => {
    const descriptions = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      77: "Snow grains",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
      85: "Slight snow showers",
      86: "Heavy snow showers",
      95: "Thunderstorm",
      96: "Thunderstorm with slight hail",
      99: "Thunderstorm with heavy hail",
    };
    return descriptions[code] || "Unknown";
  };

  return (
    <div className="weather-card">
      <div className="weather-header">
        <div className="weather-icon-large">
          {getWeatherIcon(weather.weathercode)}
        </div>
        <div className="weather-main">
          <h2 className="temperature">{weather.temperature}°C</h2>
          <p className="weather-description">{getWeatherDescription(weather.weathercode)}</p>
          <p className="location">{city}</p>
        </div>
      </div>
      
      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-icon">💨</span>
          <div className="detail-info">
            <span className="detail-label">Wind Speed</span>
            <span className="detail-value">{weather.windspeed} km/h</span>
          </div>
        </div>
        
        <div className="detail-item">
          <span className="detail-icon">🧭</span>
          <div className="detail-info">
            <span className="detail-label">Wind Direction</span>
            <span className="detail-value">{weather.winddirection}°</span>
          </div>
        </div>
      </div>
      
      <div className="weather-footer">
        <p className="last-updated">
          Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>

      {/* 5-Day Forecast */}
      {forecast && forecast.length > 0 && (
        <div className="forecast-container">
          <h3 className="forecast-title">Next 5 Days</h3>
          <div className="forecast-grid">
            {forecast.map((day) => {
              const dateObj = new Date(day.date);
              const weekday = dateObj.toLocaleDateString(undefined, { weekday: 'short' });
              const monthDay = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
              return (
                <div className="forecast-item" key={day.date}>
                  <div className="forecast-day">{weekday}</div>
                  <div className="forecast-date">{monthDay}</div>
                  <div className="forecast-icon">{getWeatherIcon(day.weathercode)}</div>
                  <div className="forecast-temps">
                    <span className="temp-max">{Math.round(day.tempMax)}°</span>
                    <span className="temp-min">{Math.round(day.tempMin)}°</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;