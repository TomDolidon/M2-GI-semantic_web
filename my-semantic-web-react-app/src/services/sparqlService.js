// src/sparqlService.js
import axios from "axios";

const endpoint = "http://localhost:3030/food/query";

const sparqlQuery = async (query) => {
  try {
    const response = await axios.post(endpoint, null, {
      params: {
        query: query,
        format: "application/sparql-results+json",
      },
      headers: {
        Accept: "application/sparql-results+json",
      },
    });

    return response.data.results.bindings;
  } catch (error) {
    console.error("Error when executing sparql request", error);
    return [];
  }
};

// Get all food groups
const getFoodGroups = () => {
  const query = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX mfo: <http://my_food_ontology.org/AlimOntology#>

    SELECT ?group ?label WHERE {
      ?group a mfo:foodGroup .
      ?group rdfs:label ?label .
    }
  `;
  return sparqlQuery(query);
};

// Get all food subgroups
const getSubgroups = (group) => {
  const query = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX mfo: <http://my_food_ontology.org/AlimOntology#>

    SELECT ?subgroup ?label WHERE {
      ?subgroup a mfo:foodSubgroup .
      ?subgroup mfo:belongsToGroup <${group}> .
      ?subgroup rdfs:label ?label .
    }
  `;
  return sparqlQuery(query);
};

const getFood = (subgroup) => {
  const query = `
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX mfo: <http://my_food_ontology.org/AlimOntology#>

    SELECT ?foodItem ?label ?energy WHERE {       
      ?foodItem a mfo:foodItem .
      ?foodItem mfo:belongsToSubgroup <${subgroup}> .
      ?foodItem rdfs:label ?label .
      ?foodItem mfo:energy ?energy
    }
  `;
  return sparqlQuery(query);
};

export { getFoodGroups, getSubgroups, getFood };


/*
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX md: <http://www.w3.org/ns/md#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>     
PREFIX mfo: <http://my_food_ontology.org/AlimOntology#>      
SELECT ?foodItem ?label ?energy ?protein ?fat ?carbohydrate WHERE {       
  ?foodItem a mfo:foodItem .       
  ?foodItem rdfs:label ?label .
  ?foodItem mfo:energy ?energy .
  ?foodItem mfo:protein ?protein .
  ?foodItem mfo:fat ?fat .
  ?foodItem mfo:carbohydrate ?carbohydrate
}
*/
