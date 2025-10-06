import React, { useState } from "react";
import { useWeather } from "./Weather";

const Input = () => {
  const { getWeather, loading } = useWeather();
  const [cityName, setCityName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cityName.trim()) return;
    try {
      await getWeather(cityName.trim());
      // persist the raw query for next time
      localStorage.setItem("lastCityQuery", cityName.trim());
    } catch (_) {}
  };

  const handleInputChange = (e) => {
    setCityName(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="input-group">
        <input
          type="text"
          className="input-field"
          placeholder="Search any city..."
          value={cityName}
          onChange={handleInputChange}
          disabled={loading}
        />
        <button 
          type="submit" 
          className="search-button"
          disabled={loading || !cityName.trim()}
          title="Get Weather"
        >
          {loading ? (
            <span className="loading-spinner">⏳</span>
          ) : (
            <span>🔍</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default Input;