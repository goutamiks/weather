import React from "react";
import { WeatherProvider } from "./components/Weather";
import Card from "./components/Card";
import Input from "./components/Input";
import "./App.css";

function App() {
  return (
    <WeatherProvider>
      <div className="app">
        <div className="main-container">
          {/* Header Section */}
          <div className="header-section">
            <div className="logo-container">
              <div className="logo-icon">🌤️</div>
              <h1 className="app-title">WeatherNow</h1>
            </div>
            <p className="app-tagline">Real-time weather for your adventures</p>
          </div>

          {/* Search Section */}
          <div className="search-container">
            <div className="search-wrapper">
              <Input />
            </div>
          </div>

          {/* Weather Display Section */}
          <div className="weather-container">
            <Card />
          </div>

          {/* Footer */}
          <div className="app-footer">
            <p>Made for outdoor enthusiasts</p>
            <p style={{ marginTop: '8px', fontSize: '0.75rem' }}>© 2025 WeatherNow. All rights reserved.</p>
          </div>
        </div>
      </div>
    </WeatherProvider>
  );
}

export default App;
