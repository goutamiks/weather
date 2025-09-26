import React from "react";
import Card from "./components/Card";
import Input from "./components/Input";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>🌤 Weather App</h1>
      <Input />
      <Card />
    </div>
  );
}

export default App;
