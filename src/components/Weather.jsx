// src/components/Weather.js
import React, { createContext, useContext, useState } from "react";

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getWeather = async (cityName) => {
    try {
      setLoading(true);
      setError(null);
      setCity(cityName);

      // Step 1: Get coordinates
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found");
        setWeather(null);
        setLoading(false);
        return;
      }

      const { latitude, longitude } = geoData.results[0];

      // Step 2: Get weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherRes.json();

      setWeather(weatherData.current_weather);
    } catch (err) {
      setError("Failed to fetch weather");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WeatherContext.Provider
      value={{ city, setCity, weather, loading, error, getWeather }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

// ✅ Custom hook
export const useWeather = () => useContext(WeatherContext);
