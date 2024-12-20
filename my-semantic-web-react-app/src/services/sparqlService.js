// src/sparqlService.js
import axios from "axios";
import { GET_ALL_FOODS, GET_ALL_GROUPS } from "../api/sparqlQueries";

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
const getGroups = () => {
  return sparqlQuery(GET_ALL_GROUPS);
};

// Get all food subgroups
const getSubgroupsByGroup = (group) => {
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

const getAllFoods = () => {
  return sparqlQuery(GET_ALL_FOODS);
};

const getFoodDetails = (foodId) => {
  const query = `
  PREFIX mf: <http://www.w3.org/2001/sw/DataAccess/tests/test-manifest#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX md: <http://www.w3.org/ns/md#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX mfo: <http://my_food_ontology.org/AlimOntology#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>

 SELECT ?foodItem ?label ?ironId ?ironLabel ?calciumId ?calciumLabel ?ironValue ?calciumValue ?lipidValue ?carbohydratesValue ?proteinValue ?climateChangeValue ?DataQualityRatingValue ?EFSingleScoreValue ?belongsToGroupValue ?belongsToSubgroupValue WHERE {       
    ?foodItem a mfo:foodItem .       
    ?foodItem rdfs:label ?label .
  
    ?foodItem mfo:belongsToSubgroup ?belongsToSubgroup .
  ?belongsToSubgroup rdfs:label ?belongsToSubgroupValue .
  
  ?foodItem mfo:belongsToGroup ?belongsToGroup .
  ?belongsToGroup rdfs:label ?belongsToGroupValue .
  
  ?foodItem mfo:ironQuantity ?iron .
  ?iron mfo:numericalValue ?ironValue .
  
  ?foodItem mfo:calciumQuantity ?calcium .
  ?calcium mfo:numericalValue ?calciumValue .
  
  ?foodItem mfo:lipidQuantity ?lipid .
  ?lipid mfo:numericalValue ?lipidValue .
  
  ?foodItem mfo:proteinQuantity ?carbohydratesValue .
  ?carbohydratesValue mfo:numericalValue ?carbohydratesValueValue .
  
  ?foodItem mfo:proteinQuantity ?protein .
  ?protein mfo:numericalValue ?proteinValue . 
  
  ?foodItem mfo:ClimateChange ?climateChange .
  ?climateChange mfo:numericalValue ?climateChangeValue .
  
  ?foodItem mfo:DataQualityRating ?dataQualityRating .
  ?dataQualityRating mfo:numericalValue ?DataQualityRatingValue .
  
  ?foodItem mfo:EFSingleScore ?eFSingleScoreValue .
  ?eFSingleScoreValue mfo:numericalValue ?EFSingleScoreValue .

  OPTIONAL {
    ?foodItem mfo:contain ?ironId .
    ?ironId rdfs:label ?ironLabel ;
            owl:sameAs <http://www.wikidata.org/entity/Q677> .  # ID de fer
  }
    OPTIONAL {
    ?foodItem mfo:contain ?calciumId .
    ?calciumId rdfs:label ?calciumLabel ;
            owl:sameAs <http://www.wikidata.org/entity/Q706> .  # ID de fer
  }

  FILTER(?foodItem=mfo:${foodId})

 }
`;

  return sparqlQuery(query);
};

const getAtomDetails = (atomId) => {
  const query = `
    PREFIX mf: <http://www.w3.org/2001/sw/DataAccess/tests/test-manifest#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX md: <http://www.w3.org/ns/md#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX mfo: <http://my_food_ontology.org/AlimOntology#>
    PREFIX owl: <http://www.w3.org/2002/07/owl#>

    SELECT ?atom ?label ?comment ?seelAlso ?sameAs ?dbpediaAbstract ?wikidataLabel WHERE {   
      ?atom a mfo:atom ;        
          rdfs:label ?label ;
            rdfs:comment ?comment;
            rdfs:seeAlso ?seelAlso; 
            owl:sameAs ?sameAs .
      
        SERVICE <http://dbpedia.org/sparql> {
            ?seelAlso rdfs:comment ?dbpediaAbstract .
            FILTER (LANG(?dbpediaAbstract) = "en")
        }
        SERVICE <https://query.wikidata.org/sparql> {
            ?sameAs rdfs:label ?wikidataLabel .
            FILTER (LANG(?wikidataLabel) = "en")
        }
                    
        FILTER(?atom=mfo:${atomId})
    }
  `;
  console.log("🔊 ~ getAtomDetails ~ query:", query);
  return sparqlQuery(query);
};

const fetchTopFoods = (atom) => {};

export {
  getGroups,
  getSubgroupsByGroup,
  getFood,
  getAllFoods,
  getFoodDetails,
  getAtomDetails,
};

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
