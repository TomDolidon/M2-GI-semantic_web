import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAtomDetails, getTopFoodsForAtom } from "../services/sparqlService";
import PageLayout from "../components/PageLayout";
import {
  GET_ATOM_DETAILS,
  GET_TOP_10_FOOD_BY_NUTRIENTS,
} from "../api/sparqlQueries";

const AtomDetails = () => {
  const { atomId } = useParams();
  const [atom, setAtom] = useState(null);
  const [topFoods, setTopFoods] = useState([]);

  useEffect(() => {
    const fetchAtomDetails = async () => {
      const data = await getAtomDetails(atomId);
      console.log("🔊 Atom details fetched:", data);
      setAtom(data[0]);
    };
    fetchAtomDetails();

    // const fetchTopFoods = async () => {
    //   const data = await getTopFoodsForAtom(atomId);
    //   console.log("🔊 Top foods fetched:", data);
    //   setTopFoods(data);
    // };

    // fetchTopFoods();
  }, [atomId]);

  if (!atom) {
    return (
      <div className="loading">Chargement des détails du nutriment...</div>
    );
  }

  const content = (
    <div className="atom-detail">
      <h1 className="atom-title">{atom.label.value}</h1>
      <div className="atom-info">
        <p>
          <strong>Description :</strong> {atom.comment.value}
        </p>
        <p>
          <strong>Résumé (DBpedia) :</strong> {atom.dbpediaAbstract.value}
        </p>
        <p>
          <strong>Nom (Wikidata) :</strong> {atom.wikidataLabel.value}
        </p>
      </div>

      <div className="links-section">
        <h2>Liens externes :</h2>
        <ul>
          <li>
            <a
              href={atom.seelAlso.value}
              target="_blank"
              rel="noopener noreferrer"
            >
              Page DBpedia
            </a>
          </li>
          <li>
            <a
              href={atom.sameAs.value}
              target="_blank"
              rel="noopener noreferrer"
            >
              Page Wikidata
            </a>
          </li>
        </ul>
      </div>

      <div className="top-foods">
        <h2>Top 10 des aliments contenant le plus de {atom.label.value}</h2>
        {topFoods.length === 0 ? (
          <p>Chargement des aliments...</p>
        ) : (
          <ul>
            {topFoods.map((food, index) => (
              <li key={index}>
                <strong>{food.label}</strong>: {food.value} g
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <PageLayout
      content={content}
      queries={[
        {
          description: "Récupérer les détails et données liées de l'atome",
          query: GET_ATOM_DETAILS,
        },
        {
          description: "Récupérer les 10 aliments qui en contiennent le plus",
          query: GET_TOP_10_FOOD_BY_NUTRIENTS,
        },
      ]}
    />
  );
};

export default AtomDetails;
