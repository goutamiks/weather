import React from "react";
import { useWeather } from "./Weather";
const Input = () => {
    const weather = useWeather();
    
const { setCity } = useWeather();

<input
  type="text"
  onChange={(e) => setCity(e.target.value)}   // ✅ use setCity
/>

  return (
    <input
      className="input-field"
      placeholder="Search here"
      value={weather.searchCity}
      onChange={(e) => weather.setSearchCity(e.target.value)}
    />
  );
};

export default Input;