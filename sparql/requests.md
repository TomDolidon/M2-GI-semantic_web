Renvoi les 10 premiers aliments

```
PREFIX mfo: <http://my_food_ontology.org/AlimOntology#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?f ?l WHERE {
      ?m a  mfo:foodItem;
      rdfs:label ?l .
} LIMIT 10
```

Récupère la liste de tous les groupes

```
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX mfo: <http://my_food_ontology.org/AlimOntology#>

SELECT ?group ?label WHERE {
  ?group a mfo:foodGroup .
  ?group rdfs:label ?label .
}
```

Renvoie les 10 premiers aliments ayant une valeur de changement climatique > 2

```
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX md: <http://www.w3.org/ns/md#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX mfo: <http://my_food_ontology.org/AlimOntology#>

SELECT ?label ?climateChangeValue WHERE {
  ?foodItem a mfo:foodItem .
  ?foodItem rdfs:label ?label .
  ?foodItem mfo:ClimateChange ?climateChange .
  ?climateChange mfo:numericalValue ?climateChangeValue
  FILTER(?climateChangeValue > 2.0)
}
LIMIT 10
```
