import React, { createContext, useContext, useState } from "react";

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [forecast, setForecast] = useState([]);

  const getWeather = async (cityName) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate input
      if (!cityName || cityName.trim().length === 0) {
        setError("Please enter a city name");
        setLoading(false);
        return;
      }

      // Step 1: Get coordinates using Open-Meteo Geocoding API
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName.trim())}&count=1&language=en&format=json`;
      
      const geoResponse = await fetch(geoUrl);
      if (!geoResponse.ok) {
        throw new Error(`Geocoding API error: ${geoResponse.status}`);
      }
      
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError(`City "${cityName}" not found. Please check the spelling and try again.`);
        setWeather(null);
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, admin1, country } = geoData.results[0];
      const fullCityName = `${name}${admin1 ? `, ${admin1}` : ''}, ${country}`;
      setCity(fullCityName);

      // Persist last searched city (original query string for future searches)
      try {
        localStorage.setItem("lastCityQuery", cityName.trim());
      } catch (_) {}

      // Step 2: Get weather data using Open-Meteo Weather API (current + 5-day daily)
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh&precipitation_unit=mm&daily=weathercode,temperature_2m_max,temperature_2m_min`;
      
      const weatherResponse = await fetch(weatherUrl);
      if (!weatherResponse.ok) {
        throw new Error(`Weather API error: ${weatherResponse.status}`);
      }
      
      const weatherData = await weatherResponse.json();

      if (!weatherData.current_weather) {
        throw new Error("No weather data available");
      }

      setWeather(weatherData.current_weather);

      // Build 5-day forecast from daily data if present
      if (weatherData.daily && Array.isArray(weatherData.daily.time)) {
        const days = weatherData.daily.time
          .map((dateString, index) => ({
            date: dateString,
            weathercode: weatherData.daily.weathercode?.[index],
            tempMax: weatherData.daily.temperature_2m_max?.[index],
            tempMin: weatherData.daily.temperature_2m_min?.[index],
          }))
          .slice(0, 5);
        setForecast(days);
      } else {
        setForecast([]);
      }
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError(err.message || "Failed to fetch weather data. Please try again.");
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  // Note: We intentionally do not auto-fetch on mount to avoid errors when
  // a saved string is not directly resolvable by the geocoding API.

  return (
    <WeatherContext.Provider
      value={{ 
        city, 
        setCity, 
        weather, 
        loading, 
        error, 
        getWeather,
        forecast,
        clearError: () => setError(null),
        clearWeather: () => {
          setWeather(null);
          setCity("");
          setError(null);
          setForecast([]);
        }
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
};
