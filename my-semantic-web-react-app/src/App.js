// src/App.js
import React, { useState } from "react";
import "./App.css";
import FoodDetails from "./views/FoodDetails";
import FoodItemList from "./views/FoodItemList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import AtomDetails from "./views/AtomDetails";

function App() {
  const [selectedGroup, setSelectedGroup] = useState(null);

  return (
    <Router>
      <div className="App">
        <Header />

        <Routes>
          <Route path="/" element={<FoodItemList />} />
          <Route path="/food/:foodId" element={<FoodDetails />} />
          <Route path="/atom/:atomId" element={<AtomDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
