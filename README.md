# SEMANTIC WEB - COURSE PROJECT

## 🧑‍💻 **Description**

This repository contains all the source code and data used for the semantic web project in Master 2 Computer Engineering at Im2ag in Grenoble

This project contains :

- Dataset in CSV format
- An .owl ontology for this dataset, this ontology use custom and already existing ontology
- A python script to transform csv fils to turtle, respecting the created ontology
- The generated Turtle file
- A list of sparql requests
- A small React app wich exploit data and sparql request in triple store

## 🎉 **Getting started**

### 💿 **Prerequisites**

- Node.js LTS
- Python 3
- Apache Jena Fuseki

### 📦 **Installation**

**Python :**

Install rdflib in your python environment :

```
pyp install rdflib
```

**React app setup :**

Install depedencies :

```
npm i
```

## ⏯️ **Startup**

Start the react app in terminal 1:
`npm start`

Start fuseki server in terminal 2:
`./fuseki-server`

If not done yet, create a new dataset and upload 'data/turtle/ciqual_nutriments'

You can also regenerate turtle file using python script in "transformer" directory :
`python csvToTurle.py`

# 🧱 Architecture

## Project's structure

```
┣ 📂 data
┃ ┣ 📂 datasets : contain the datasets used in the projet
┃ ┃ ┣ 📜 ciqual_2020.csv
┃ ┃ ┗ 📜 synthese_agribalise.csv
┃ ┗ 📂 turtle : the datasets transformed to turtle
┃ ┃ ┗ 📜 ciqual_2020.ttl
┣ 📂 my-semantic-web-react-app : the react app
┃ ┣ 📂 src
┃ ┃ ┣ 📂 services
┃ ┃ ┃ ┗ 📜 sparqlService.js
┃ ┃ ┣ 📂 views : contains view components list
┃ ┃ ┗ 📜 App.js : react main entry
┣ 📂 schemas
┃ ┗ 📜 my_food_ontology.owl : the ontology created for this project
┣ 📂 sparql
┃ ┗ 📜 requests.md : contains the list of sparql request used in the react app
┣ 📂 transformer
┃ ┣ 📜 ciqual_columns_config.py : the cyqual dataset column name list
┃ ┗ 📜 csvToTurtle.py : the csv to turtle transformer
┣ 📜 README.md
```

## 🔗 Useful links

- [Apache Jena Fuseki official doc](https://jena.apache.org/documentation/fuseki2/)
- [Python RDFLib](https://rdflib.readthedocs.io/en/stable/)
