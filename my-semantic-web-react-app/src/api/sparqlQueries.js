// src/sparqlQueries.js
const PREFIXES = `
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX mfo: <http://my_food_ontology.org/AlimOntology#>
`;

export const GET_ALL_FOODS = `
  ${PREFIXES}
  SELECT ?foodItem ?label ?group ?subgroup WHERE {       
    ?foodItem a mfo:foodItem .       
    ?foodItem rdfs:label ?label .
    ?foodItem mfo:belongsToGroup ?group .
    ?foodItem mfo:belongsToSubgroup ?subgroup .
  }
`;

export const GET_ALL_GROUPS = `
  ${PREFIXES}
  SELECT ?group ?label WHERE {
    ?group a mfo:foodGroup .
    ?group rdfs:label ?label .
}
`;

export const GET_FOOD_DETAIL = `
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

  FILTER(?foodItem=mfo:food_10001)

 }
`;

export const GET_ATOM_DETAILS = `
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
                 
    FILTER(?atom=mfo:atom_10001)
 }

`;

export const GET_TOP_10_FOOD_BY_NUTRIENTS = `
PREFIX rdf: http://www.w3.org/1999/02/22-rdf-syntax-ns
PREFIX md: http://www.w3.org/ns/md
PREFIX rdfs: http://www.w3.org/2000/01/rdf-schema
PREFIX mfo: http://my_food_ontology.org/AlimOntology

SELECT ?label ?ironValue ?proteinValue WHERE {
  ?foodItem a mfo:foodItem .
  ?foodItem rdfs:label ?label .
  ?foodItem mfo:ironQuantity ?iron .
  ?iron mfo:numericalValue ?ironValue .

  ?foodItem mfo:proteinQuantity ?protein .
  ?protein mfo:numericalValue ?proteinValue .
  FILTER(?proteinValue > 9) .
  FILTER(?ironValue > 25) .
}
ORDER BY ?ironValue
LIMIT 10
`;
