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

      // Step 2: Get weather data using Open-Meteo Weather API
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius&windspeed_unit=kmh&precipitation_unit=mm`;
      
      const weatherResponse = await fetch(weatherUrl);
      if (!weatherResponse.ok) {
        throw new Error(`Weather API error: ${weatherResponse.status}`);
      }
      
      const weatherData = await weatherResponse.json();

      if (!weatherData.current_weather) {
        throw new Error("No weather data available");
      }

      setWeather(weatherData.current_weather);
    } catch (err) {
      console.error("Weather fetch error:", err);
      setError(err.message || "Failed to fetch weather data. Please try again.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WeatherContext.Provider
      value={{ 
        city, 
        setCity, 
        weather, 
        loading, 
        error, 
        getWeather,
        clearError: () => setError(null),
        clearWeather: () => {
          setWeather(null);
          setCity("");
          setError(null);
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
