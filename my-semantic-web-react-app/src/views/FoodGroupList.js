import React, { useState, useEffect } from "react";
import { getFoodGroups } from "../services/sparqlService";

const FoodGroupList = ({ onSelectGroup }) => {
  const [foodGroups, setFoodGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null); // État pour le groupe sélectionné

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

  const handleGroupClick = (group) => {
    setSelectedGroup(group); // Met à jour le groupe sélectionné
    onSelectGroup(group);    // Notifie le parent
  };

  return (
    <div>
      <h2>Food Groups</h2>
      <ul>
        {foodGroups.map((group) => (
          <li
            key={group.group}
            onClick={() => handleGroupClick(group.group)}
            style={{
              cursor: "pointer",
              color: selectedGroup === group.group ? "blue" : "black", // Couleur dynamique
              fontWeight: selectedGroup === group.group ? "bold" : "normal", // Optionnel : mise en valeur
            }}
          >
            {group.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FoodGroupList;
