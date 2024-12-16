// src/App.js
import React, { useState } from "react";
import "./App.css";
import FoodGroupList from "./views/FoodGroupList";
import SubgroupList from "./views/SubgroupList";

function App() {
  const [selectedGroup, setSelectedGroup] = useState(null);

  return (
    <div className="App">
      <h1>Food Ontology</h1>
      <FoodGroupList onSelectGroup={setSelectedGroup} />
      {selectedGroup && <SubgroupList group={selectedGroup} />}
    </div>
  );
}

export default App;
