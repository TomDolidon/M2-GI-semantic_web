import csv
import uuid
from rdflib import Graph, Namespace, URIRef, Literal
from rdflib.namespace import RDF, RDFS, XSD
from ciqual_columns_config import ciqual_columns
from agribalise_column_config import agribalise_columns

# Namespaces
MFO = Namespace("http://my_food_ontology.org/AlimOntology#")
FOODON = Namespace("http://purl.obolibrary.org/obo/foodon#")
QUDT = Namespace("http://qudt.org/schema/qudt#")
SIO = Namespace("http://semanticscience.org/resource/")

def generate_turtle(input_csv_path, intput_csv_path2, output_file_name):
    """
    Generates a Turtle file from a CSV file, including food items, groups, subgroups, and their relations.

    :param input_csv_path: Path to the input CSV file.
    :param output_file_name: Path to the output Turtle file.
    """
    # RDF Graph Initialization
    g = Graph()
    g.bind("mfo", MFO)
    g.bind("foodon", FOODON)
    g.bind("qudt", QUDT)
    g.bind("sio", SIO)

    food_groups = {}
    food_subgroups = {}
    food_items = []

    # Read the CSV File
    with open(input_csv_path, mode="r", encoding="utf-8-sig") as csvfile, open(intput_csv_path2, mode="r", encoding="utf-8-sig") as csvfile2:
        reader = csv.DictReader(csvfile, delimiter=";")
        reader2 = csv.DictReader(csvfile2, delimiter=",")

        for row in reader:
            group_name = row[ciqual_columns["alim_grp_nom_fr"]]
            group_code = row["alim_grp_code"]

            subgroup_name = row[ciqual_columns["alim_ssgrp_nom_fr"]]
            subgroup_code = row[ciqual_columns["alim_ssgrp_code"]]

            food_name = row[ciqual_columns["alim_nom_fr"]]
            food_code = row[ciqual_columns["alim_code"]]

            # Create or Retrieve Food Group
            if group_name not in food_groups:
                group_uri = MFO[f"group_{group_code}"]
                food_groups[group_name] = group_uri
                g.add((group_uri, RDF.type, MFO["foodGroup"]))
                g.add((group_uri, RDFS.label, Literal(group_name, lang="fr")))

            # Create or Retrieve Food Subgroup
            if subgroup_name not in food_subgroups:
                subgroup_uri = MFO[f"subgroup_{subgroup_code}"]
                food_subgroups[subgroup_name] = subgroup_uri
                g.add((subgroup_uri, RDF.type, MFO["foodSubgroup"]))
                g.add((subgroup_uri, RDFS.label, Literal(subgroup_name, lang="fr")))
                g.add((subgroup_uri, MFO["belongsToGroup"], food_groups[group_name]))

            # Create Food Item
            if food_code not in food_items:
                food_items.append(food_code)
                food_uri = MFO[f"food_{food_code}"]
                g.add((food_uri, RDF.type, MFO["foodItem"]))
                g.add((food_uri, RDFS.label, Literal(food_name, lang="fr")))
                g.add((food_uri, MFO["belongsToGroup"], food_groups[group_name]))
                g.add((food_uri, MFO["belongsToSubgroup"], food_subgroups[subgroup_name]))
                g.add((food_uri, MFO["energy"], Literal((row[ciqual_columns["energie_kcal"]]))))
                g.add((food_uri, MFO["protein"], Literal((row[ciqual_columns["proteines"]]), datatype=XSD.float)))
                g.add((food_uri, MFO["carbohydrate"], Literal((row[ciqual_columns["glucides"]]), datatype=XSD.float)))
                g.add((food_uri, MFO["fat"], Literal((row[ciqual_columns["lipides"]]), datatype=XSD.float)))

        # Problème : je dois ajouter dans un aliment ses caractéristiques environnementales en les important d'un autre fichier csv
        
        for row in reader2:
            food_code = row[agribalise_columns["code_ciqual"]]
            food_uri = MFO[f"food_{food_code}"]
            if food_code not in food_items:
                g.add((food_uri, RDF.type, MFO["foodItem"]))
                g.add((food_uri, RDFS.label, Literal(food_name, lang="fr")))
            g.add((food_uri, MFO["dqr"], Literal(float(row[agribalise_columns["dqr"]]), datatype=XSD.float)))
            g.add((food_uri, MFO["score_unique_ef"], Literal(float(row[agribalise_columns["score_unique_ef"]]), datatype=XSD.float)))
            g.add((food_uri, MFO["changement_climatique"], Literal(float(row[agribalise_columns["changement_climatique"]]), datatype=XSD.float)))


    # Serialize the RDF Graph
    g.serialize(destination=output_file_name, format="turtle")
    print(f"Turtle file generated at: {output_file_name}")

def parse_float(value):
    """Converts a string to a float, replacing commas with periods first."""
    try:
        return float(value.replace(",", "."))
    except ValueError:
        return None

if __name__ == "__main__":
    try:
        input_csv = "../data/datasets/ciqual_2020.csv"
        input_csv2 = "../data/datasets/synthese_agribalise.csv"
        output_ttl = "../data/turtle/ciqual_2020.ttl"
        generate_turtle(input_csv, input_csv2, output_ttl)
    except Exception as e:
        print(f"Error: {e}")
