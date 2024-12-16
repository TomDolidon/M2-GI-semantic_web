// src/FoodGroupList.js
import React, { useState, useEffect } from "react";
import { getFoodGroups } from "../services/sparqlService";

const FoodGroupList = ({ onSelectGroup }) => {
  const [foodGroups, setFoodGroups] = useState([]);

  useEffect(() => {
    const fetchFoodGroups = async () => {
      const groups = await getFoodGroups();
      setFoodGroups(
        groups.map((binding) => ({
          group: binding.group.value,
          label: binding.label.value,
        }))
      );
    };
    fetchFoodGroups();
  }, []);

  return (
    <div>
      <h2>Food Groups</h2>
      <ul>
        {foodGroups.map((group) => (
          <li key={group.group} onClick={() => onSelectGroup(group.group)}>
            {group.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FoodGroupList;
