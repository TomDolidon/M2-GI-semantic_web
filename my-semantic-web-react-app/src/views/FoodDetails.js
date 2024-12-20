import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getFoodDetails } from "../services/sparqlService";
import PageLayout from "../components/PageLayout";
import { GET_FOOD_DETAIL } from "../api/sparqlQueries";
import { getIdFromUri } from "../utils/turtleUtils";

const FoodDetail = () => {
  const { foodId } = useParams();
  const [foodDetail, setFoodDetail] = useState(null);

  useEffect(() => {
    const fetchFoodDetail = async () => {
      const detail = await getFoodDetails(foodId);
      console.log("🔊 ~ fetchFoodDetail ~ foodId:", foodId);
      console.log("🔊 ~ fetchFoodDetail ~ detail:", detail);
      setFoodDetail(detail[0]);
    };

    fetchFoodDetail();
  }, [foodId]);

  if (!foodDetail) {
    return <div>Chargement des détails...</div>;
  }

  const content = (
    <div>
      <h1>{foodDetail.label.value}</h1>

      {foodDetail.ironId && foodDetail.ironLabel && (
        <p>
          <strong>
            <Link to={`/atom/${getIdFromUri(foodDetail.ironId.value)}`}>
              Fer
            </Link>{" "}
            :
          </strong>{" "}
          {foodDetail.ironValue.value} mg
        </p>
      )}
      {foodDetail.calciumId && foodDetail.calciumLabel && (
        <p>
          <strong>
            <Link to={`/atom/${getIdFromUri(foodDetail.calciumId.value)}`}>
              Calcium
            </Link>{" "}
            :
          </strong>{" "}
          {foodDetail.calciumValue.value} mg
        </p>
      )}

      <p>
        <strong>Lipides :</strong> {foodDetail.lipidValue.value} g/100g
      </p>
      <p>
        <strong>Protéines :</strong> {foodDetail.proteinValue.value} g/100g
      </p>
      {/* <p>
        <strong>Glucides :</strong> {foodDetail.carbohydratesValue.value} g/100g
      </p> */}
      <p>
        <strong>Changement climatique :</strong>{" "}
        {foodDetail.climateChangeValue.value} kg CO2
      </p>
      <p>
        <strong>Qualité des données :</strong>{" "}
        {foodDetail.DataQualityRatingValue.value}
      </p>
      <p>
        <strong>Score environnemental :</strong>{" "}
        {foodDetail.EFSingleScoreValue.value}
      </p>

      <p>
        <strong>Groupe :</strong> {foodDetail.belongsToGroupValue.value}
      </p>
      <p>
        <strong>Sous-groupe :</strong> {foodDetail.belongsToSubgroupValue.value}
      </p>
    </div>
  );

  return (
    <PageLayout
      content={content}
      queries={[
        {
          description: "Récupérer les détails de l'aliment",
          query: GET_FOOD_DETAIL,
        },
      ]}
    />
  );
};

export default FoodDetail;
