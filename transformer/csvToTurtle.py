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
DB = Namespace("http://dbpedia.org/resource/")
WIKIDATA = Namespace("http://www.wikidata.org/entity/")
OWL = Namespace("http://www.w3.org/2002/07/owl#")

base_uri = "http://my_food_ontology.org/AlimOntology#"

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

    ###### Adding env units
    pefUnit = URIRef(f"envunit_{uuid.uuid4()}")
    g.add((pefUnit, RDF.type, MFO["unit"]))
    g.add((pefUnit, RDFS.label, Literal("mPt", lang="en")))
    g.add((pefUnit, RDFS.comment, Literal("Used for Product Environmental Footprint", lang="en")))

    dqrUnit = URIRef(f"envunit_{uuid.uuid4()}")
    g.add((dqrUnit, RDF.type, MFO["unit"]))
    g.add((dqrUnit, RDFS.label, Literal("rating", lang="en")))
    g.add((dqrUnit, RDFS.comment, Literal("Used for Data Quality Rating", lang="en")))

    climateChangeUnit = URIRef(f"envunit_{uuid.uuid4()}")
    g.add((climateChangeUnit, RDF.type, MFO["unit"]))
    g.add((climateChangeUnit, RDFS.label, Literal("kg CO2 eq", lang="en")))
    g.add((climateChangeUnit, RDFS.comment, Literal("Used for Climate Change", lang="en")))

    ####### Adding atoms and diatery chemical components
    protein = URIRef(f"{base_uri}atom_{uuid.uuid4()}")
    g.add((protein, RDF.type, MFO["dietaryChemicalComponent"]))
    g.add((protein, RDFS.label, Literal("Protein", lang="en")))
    g.add((protein, RDFS.comment, Literal("More than 10,000 types are found in everything from your organs to your muscles and tissues to your bones, skin, and hair. also a critical part of the processes that fuel your energy and carry oxygen throughout your body in your blood. It also helps make antibodies that fight off infections and illnesses and helps keep cells healthy and create new ones. Plus, protein helps you feel full, so it's often part of a healthy weight-loss plan")))
    g.add((protein, RDFS.seeAlso, DB.Proteins))
    g.add((protein, OWL.sameAs, WIKIDATA.Q8054))

    lipids = URIRef(f"{base_uri}atom_{uuid.uuid4()}")
    g.add((lipids, RDF.type, MFO["dietaryChemicalComponent"]))
    g.add((lipids, RDFS.label, Literal("Lipids", lang="en")))
    g.add((lipids, RDFS.comment, Literal("Lipids are fatty, waxy, or oily compounds that are essential to many body functions and serve as the building blocks for all living cells. Lipids help regulate hormones, transmit nerve impulses, cushion organs, and store energy in the form of body fat.", lang="en")))
    g.add((lipids, RDFS.seeAlso, DB.Lipids))
    g.add((lipids, OWL.sameAs, WIKIDATA.Q11367))

    carbohydrates = URIRef(f"{base_uri}atom_{uuid.uuid4()}")
    g.add((carbohydrates, RDF.type, MFO["Carbohydrates"]))
    g.add((carbohydrates, RDFS.label, Literal("Carbohydrates", lang="en")))
    g.add((carbohydrates, RDFS.comment, Literal("Classified into two main categories: simple and complex. Simples are simple sugars such as glucose, fructose and sucrose, found naturally in fruits, honey and milk, as well as in processed foods and sugary drinks. Complex carbohydrates, on the other hand, are made up of longer chains of sugar molecules and include the starch found in grains, legumes and tubers.", lang="en")))
    g.add((carbohydrates, RDFS.seeAlso, DB.Carbohydrates))
    g.add((carbohydrates, OWL.sameAs, WIKIDATA.Q11358))

    calcium = URIRef(f"{base_uri}atom_{uuid.uuid4()}")
    g.add((calcium, RDF.type, MFO["atom"]))
    g.add((calcium, RDFS.label, Literal("Calcium", lang="en")))
    g.add((calcium, RDFS.comment, Literal("plays a key role in skeletal mineralization and structure. It is necessary for many biological functions such as muscle contraction, blood clotting, hormone release and even enzyme activatio", lang="en")))
    g.add((calcium, RDFS.seeAlso, DB.Calcium))
    g.add((calcium, OWL.sameAs, WIKIDATA.Q706))

    iron = URIRef(f"{base_uri}atom_{uuid.uuid4()}")
    g.add((iron, RDF.type, MFO["atom"]))
    g.add((iron, RDFS.label, Literal("Iron", lang="en")))
    g.add((iron, RDFS.comment, Literal("necessary for the transport and use of oxygen by red blood cells, as well as for the functioning of certain enzymes. The balance between iron intake and loss is generally well regulated in healthy people.", lang="en")))
    g.add((iron, RDFS.seeAlso, DB.Iron))
    g.add((iron, OWL.sameAs, WIKIDATA.Q677))

    ####### Adding atoms and diatery chemical components UNITS 
    mg100g = URIRef(f"envunit_{uuid.uuid4()}")
    g.add((mg100g, RDF.type, MFO["unit"]))
    g.add((mg100g, RDFS.label, Literal("mg/100g", lang="en")))

    g100g = URIRef(f"envunit_{uuid.uuid4()}")
    g.add((g100g, RDF.type, MFO["unit"]))
    g.add((g100g, RDFS.label, Literal("g/100g", lang="en")))

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

                food_uri = URIRef(f"{base_uri}food_{food_code}")
                # food_uri = URIRef(f"food_{food_code}")
                g.add((food_uri, RDF.type, MFO["foodItem"]))
                g.add((food_uri, RDFS.label, Literal(food_name, lang="fr")))
                g.add((food_uri, MFO["belongsToGroup"], food_groups[group_name]))
                g.add((food_uri, MFO["belongsToSubgroup"], food_subgroups[subgroup_name]))

                protein_value = row[ciqual_columns["proteines"]].strip()
                if protein_value and protein_value != '-' and not protein_value.startswith('<') and not protein_value == 'traces':
                    g.add((food_uri, MFO["contain"], protein))
                    proteinQuantity = URIRef(f"qv_{uuid.uuid4()}")
                    g.add((proteinQuantity, RDF.type, MFO["quantityValue"]))
                    g.add((proteinQuantity, MFO.numericalValue, Literal(float(row[ciqual_columns["proteines"]].replace(',', '.')))))
                    g.add((proteinQuantity, MFO["hasUnit"], g100g))
                    g.add((food_uri, MFO["proteinQuantity"], proteinQuantity))           
                
                carbohydrates_value = row[ciqual_columns["glucides"]].strip()
                if carbohydrates_value and carbohydrates_value != '-' and not carbohydrates_value.startswith('<') and not carbohydrates_value == 'traces':
                    g.add((food_uri, MFO["contain"], carbohydrates))
                    carbohydratesQuantity = URIRef(f"qv_{uuid.uuid4()}")
                    g.add((carbohydratesQuantity, RDF.type, MFO["quantityValue"]))
                    g.add((carbohydratesQuantity, MFO.numericalValue, Literal(float(row[ciqual_columns["glucides"]].replace(',', '.')))))
                    g.add((carbohydratesQuantity, MFO["hasUnit"], g100g))
                    g.add((food_uri, MFO["carbohydratesQuantity"], carbohydratesQuantity))  

                lipids_value = row[ciqual_columns["lipides"]].strip()
                if lipids_value and lipids_value != '-' and not lipids_value.startswith('<') and not lipids_value == 'traces':
                    g.add((food_uri, MFO["contain"], lipids))
                    lipidQuantity = URIRef(f"qv_{uuid.uuid4()}")
                    g.add((lipidQuantity, RDF.type, MFO["quantityValue"]))
                    g.add((lipidQuantity, MFO.numericalValue, Literal(float(row[ciqual_columns["lipides"]].replace(',', '.')))))
                    g.add((lipidQuantity, MFO["hasUnit"], g100g))
                    g.add((food_uri, MFO["lipidQuantity"], lipidQuantity)) 
                                    
                iron_value = row[ciqual_columns["fer"]].strip()
                if iron_value and iron_value != '-' and not iron_value.startswith('<') and not iron_value == 'traces':
                    g.add((food_uri, MFO["contain"], iron))
                    ironQuantity = URIRef(f"qv_{uuid.uuid4()}")
                    g.add((ironQuantity, RDF.type, MFO["quantityValue"]))
                    g.add((ironQuantity, MFO.numericalValue, Literal(float(row[ciqual_columns["fer"]].replace(',', '.')))))
                    g.add((ironQuantity, MFO["hasUnit"], mg100g))
                    g.add((food_uri, MFO["ironQuantity"], ironQuantity)) 
                    
                calcium_value = row[ciqual_columns["calcium"]].strip()
                if calcium_value and calcium_value != '-' and not calcium_value.startswith('<') and not calcium_value == 'traces':
                    g.add((food_uri, MFO["contain"], calcium))
                    calciumQuantity = URIRef(f"qv_{uuid.uuid4()}")
                    g.add((calciumQuantity, RDF.type, MFO["quantityValue"]))
                    g.add((calciumQuantity, MFO.numericalValue, Literal(float(row[ciqual_columns["calcium"]].replace(',', '.')))))
                    g.add((calciumQuantity, MFO["hasUnit"], mg100g))
                    g.add((food_uri, MFO["calciumQuantity"], calciumQuantity)) 
        
        for row in reader2:
            food_code = row[agribalise_columns["code_ciqual"]]
            food_uri = MFO[f"food_{food_code}"]
            if food_code not in food_items:
                g.add((food_uri, RDF.type, MFO["foodItem"]))
                g.add((food_uri, RDFS.label, Literal(food_name, lang="en")))

            # adding climate change quantity value
            climateChangeQuantityValue = URIRef(f"qv_{uuid.uuid4()}")
            g.add((climateChangeQuantityValue, RDF.type, MFO["quantityValue"]))
            g.add((climateChangeQuantityValue, MFO.numericalValue, Literal(float(row[agribalise_columns["changement_climatique"]]))))
            g.add((climateChangeQuantityValue, MFO["hasUnit"], climateChangeUnit))
            g.add((food_uri, MFO["ClimateChange"], climateChangeQuantityValue))

            # adding dqr quantity value
            dqrQuantityValue = URIRef(f"qv_{uuid.uuid4()}")
            g.add((dqrQuantityValue, RDF.type, MFO["quantityValue"]))
            g.add((dqrQuantityValue, MFO.numericalValue, Literal(float(row[agribalise_columns["dqr"]]))))
            g.add((dqrQuantityValue, MFO["hasUnit"], dqrUnit))
            g.add((food_uri, MFO["DataQualityRating"], dqrQuantityValue))

            # adding pef quantity value
            pefQuantityValue = URIRef(f"qv_{uuid.uuid4()}")
            g.add((pefQuantityValue, RDF.type, MFO["quantityValue"]))
            g.add((pefQuantityValue, MFO.numericalValue, Literal(float(row[agribalise_columns["score_unique_ef"]]))))
            g.add((pefQuantityValue, MFO["hasUnit"], pefUnit))
            g.add((food_uri, MFO["EFSingleScore"], pefQuantityValue))


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
        output_ttl = "../data/turtle/my_dataset.ttl"
        generate_turtle(input_csv, input_csv2, output_ttl)
    except Exception as e:
        print(f"Error: {e}")
