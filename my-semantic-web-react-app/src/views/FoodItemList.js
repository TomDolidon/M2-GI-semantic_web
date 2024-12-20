import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllFoods, getGroups } from "../services/sparqlService";
import PageLayout from "../components/PageLayout";
import { GET_ALL_FOODS, GET_ALL_GROUPS } from "../api/sparqlQueries";
import { getIdFromUri } from "../utils/turtleUtils";

const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [selectedGroupLabel, setSelectedGroupLabel] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");

  useEffect(() => {
    const fetchFoods = async () => {
      const foodItems = await getAllFoods();
      setFoods(foodItems);

      const groupItems = await getGroups();
      setGroups(groupItems);
    };

    fetchFoods();
  }, []);

  if (error) {
    return <div>Erreur : {error}</div>;
  }

  const filteredFoods = selectedGroupId
    ? foods.filter((food) => food.group.value === selectedGroupId)
    : foods;

  const handleFoodClick = (foodId) => {
    navigate("/food/" + foodId);
  };

  const handleGroupChange = (event) => {
    const label = event.target.value;
    setSelectedGroupLabel(label);
    const selectedGroup = groups.find((group) => group.label.value === label);
    if (selectedGroup) {
      setSelectedGroupId(selectedGroup.group.value);
    }
  };

  const queries = [
    {
      description: "Récupérer tous les aliments",
      query: GET_ALL_FOODS,
    },
    {
      description: "Récupérer tous les groupes",
      query: GET_ALL_GROUPS,
    },
  ];

  const content = (
    <div>
      <h1>Liste des aliments</h1>

      <div className="group-select-container">
        <label htmlFor="group-select" className="group-label">
          Sélectionnez un groupe :
        </label>
        <input
          type="text"
          id="group-select"
          list="group-list"
          value={selectedGroupLabel}
          onChange={handleGroupChange}
          placeholder="Rechercher un groupe"
          className="group-input"
        />
        <datalist id="group-list">
          {groups.map((group) => (
            <option key={group.id} value={group.label.value}>
              {" "}
              {group.label.value}
            </option>
          ))}
        </datalist>
      </div>

      {filteredFoods.length === 0 ? (
        <p>Chargement en cours...</p>
      ) : (
        <ul className="food-list">
          {filteredFoods.map((food) => (
            <li
              className="food-item"
              onClick={() => handleFoodClick(getIdFromUri(food.foodItem.value))}
            >
              <strong>{food.label.value}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return <PageLayout content={content} queries={queries} />;
};

export default FoodList;
