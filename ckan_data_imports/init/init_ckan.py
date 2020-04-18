#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
This script was made in order
to be able to create a organisations, datasets and resource
in a package
"""
import logging
from utility import utils
from utility import variables as var
LOGGER = logging.getLogger('ckan_import_default_log')

dict_org_id = {}
dict_dataset_id = {}
dict_resource_id = {}

# Create Organization Using the CKAN API -- Parameters are as below:
# utils.ckan_create_org("Title","Name","Description","image_url")
def create_org():

   try:
	# DEFRA
      org_id_defra = utils.ckan_create_org("Defra","defra", "The AURN is the UK's largest automatic monitoring network and is the main network used for compliance reporting against the Ambient Air Quality Directives", "https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Department_for_Environment%2C_Food_and_Rural_Affairs_logo.svg/2560px-Department_for_Environment%2C_Food_and_Rural_Affairs_logo.svg.png")

	# Luftdaten
      org_id_luftdaten = utils.ckan_create_org("Luftdaten", "luftdaten", "Luftdaten.info generates a continuously updated particular matter map from the transmitted data. Fine dust becomes visible.", "https://pbs.twimg.com/profile_images/1101239765679124480/Aelq0qEJ_400x400.png")
	
	# Smart Citizen Kit
      org_id_sck = utils.ckan_create_org("Smart Citizen Kit", "smart-citizen-kit", "Data retrieved from the Smart Citizen Kits in Bristol.", "http://2012.cities.io/wp-content/uploads/2014/06/SmartCitizen_logo.png")

	# Open Data Bristol
      org_id_odb = utils.ckan_create_org("Open Data Bristol", "open-data-bristol", "Data is collected by Bristol City Council", "https://s3-eu-central-1.amazonaws.com/aws-ec2-eu-central-1-opendatasoft-staticfileset/bristol/logo?tstamp=153563322821")

	# Main Repositry
      org_id_main = utils.ckan_create_org("Main Repositry", "main-repositry", "Main Repositry to store the data", "https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/Bristol_City_Council_logo.svg/591px-Bristol_City_Council_logo.svg.png")
      dict_org_id["org_id_defra"] = org_id_defra["id"]
      dict_org_id["org_id_luftdaten"] = org_id_luftdaten["id"]
      dict_org_id["org_id_sck"] = org_id_sck["id"]
      dict_org_id["org_id_odb"] = org_id_odb["id"]
      dict_org_id["org_id_main"] = org_id_main["id"]
      print (dict_org_id)
   except Exception as exception_returned:
      print(exception_returned)

# Create Datasets Using the CKAN API -- Parameters are as below:
# utils.ckan_create_org("Title","Name","Private","Datasource URL","owner_org")
# title, name, private, url, group
def create_package():
   """Function to create datasets/ packages"""

   org_id = {'org_id_main': 'ab6995bc-b8cf-404d-b0e0-7666913e378b', 'org_id_odb': '41e37dc3-ebc7-41bc-afb6-83162b26e0ad', 'org_id_luftdaten': '2644b7c5-e9d7-4529-b39a-a18f62de38f8', 'org_id_sck': '13c0cdf9-2c74-4157-a9fd-980928a0ebe1', 'org_id_defra': 'ecc9ae47-7337-4d3f-9fad-d4f6fd6bd201'} 

   org_id_luftdaten = org_id["org_id_luftdaten"]
   org_id_defra     = org_id["org_id_defra"]
   org_id_odb       = org_id["org_id_odb"]
   org_id_main      = org_id["org_id_main"]
   org_id_sck       = org_id["org_id_sck"]

   try:
# One Package/ Dataset for Defra AURN
      dataset_id_defra = utils.ckan_create_package("Automatic Urban and Rural Network", "automatic-urban-and-rural-network-aurn", False, "http://uk-air.defra.gov.uk/data/", org_id_defra)
# One Package/ Dataset for Luftdaten
      dataset_id_luftdaten = utils.ckan_create_package("Luftdaten", "luftdaten", False, "https://luftdaten.info/en/home-en/", org_id_luftdaten)

# One Package/ Dataset for Smart Citizen Kit
      dataset_id_sck = utils.ckan_create_package("Smart Citizen Kits", "smart-citizen-kit", False, "https://smartcitizen.me", org_id_sck)

# Five Package/ Dataset for Open Bristol Data
      dataset_id_odb_wards = utils.ckan_create_package("Wards", "wards", False, "https://opendata.bristol.gov.uk/explore/dataset/wards/information/", org_id_odb)
      dataset_id_odb_cars = utils.ckan_create_package("Car availability", "car-availability", False, "https://opendata.bristol.gov.uk/explore/dataset/car-availability/information/", org_id_odb)
      dataset_id_odb_air_no2 = utils.ckan_create_package("Air Quality (NO2 diffusion tube) data", "air-quality-no2-diffusion-tube-data", False, "https://opendata.bristol.gov.uk/explore/dataset/no2-diffusion-tube-data/information/?disjunctive.location", org_id_odb)
      dataset_id_odb_population = utils.ckan_create_package("Population Estimates (by LSOA11)", "population-estimates", False, "https://opendata.bristol.gov.uk/explore/dataset/population-estimates-2005-2016-lsoa11/information/?disjunctive.ward", org_id_odb)
      dataset_id_odb_air_continous = utils.ckan_create_package("Air Quality Data Continuous", "air-quality-data-continuous", False, "https://opendata.bristol.gov.uk/explore/dataset/air-quality-data-continuous/information/?disjunctive.location", org_id_odb)

# Two Package/ Datasets for Main Repository
      dataset_id_main_units = utils.ckan_create_package("Reading units", "reading-units", False, "None", org_id_main)
      dataset_id_main_air_pollution_bristol = utils.ckan_create_package("Air pollution data - Bristol & Bath area", "air-pollution-data-bristol-bath", False, "None", org_id_main)

# Storing the Dataset ID for the Datasets, this would be required in creating Resource ID
      dict_dataset_id["dataset_id_defra"]                      = dataset_id_defra["id"]
      dict_dataset_id["dataset_id_luftdaten"]                  = dataset_id_luftdaten["id"]
      dict_dataset_id["dataset_id_sck"]                        = dataset_id_sck["id"]
      dict_dataset_id["dataset_id_odb_wards"]                  = dataset_id_odb_wards["id"]
      dict_dataset_id["dataset_id_odb_cars"]                   = dataset_id_odb_cars["id"]
      dict_dataset_id["dataset_id_odb_air_no2"]                = dataset_id_odb_air_no2["id"]
      dict_dataset_id["dataset_id_odb_population"]             = dataset_id_odb_population["id"]
      dict_dataset_id["dataset_id_odb_air_continous"]          = dataset_id_odb_air_continous["id"]
      dict_dataset_id["dataset_id_main_units"]                 = dataset_id_main_units["id"]
      dict_dataset_id["dataset_id_main_air_pollution_bristol"] = dataset_id_main_air_pollution_bristol["id"]
      print (dict_dataset_id)

   except Exception as exception_returned:
      print(exception_returned)


def create_resource():
   dataset_id = {'dataset_id_defra': '97dacfb1-39d7-4a08-aba8-f722acab5a5b', 'dataset_id_main_air_pollution_bristol': '0af75016-2c67-4dc6-ab08-aa25a4b42b1a', 'dataset_id_odb_air_no2': 'cc19a2d6-5ad7-4438-b296-742d9b578f02', 'dataset_id_luftdaten': 'e3c6539f-549c-4b42-9ca6-07b6c6da3dcb', 'dataset_id_main_units': '390c15ef-e01c-4690-b779-4ccbf573c789', 'dataset_id_sck': '8075d7d3-f5da-46e7-86db-44bb9303ebeb', 'dataset_id_odb_air_continous': '056ae668-dbb6-417e-a0c9-8d8968de5163', 'dataset_id_odb_cars': 'd6758020-9887-4e0b-919c-dd8083214d57', 'dataset_id_odb_population': '55dbe48a-450a-4efe-94b8-106b8a9d21aa', 'dataset_id_odb_wards': '43825963-bd18-41ce-a0d9-d2a38990fbc9'} 

   dataset_id_defra                      = dataset_id["dataset_id_defra"]
   dataset_id_luftdaten                  = dataset_id["dataset_id_luftdaten"]
   dataset_id_sck                        = dataset_id["dataset_id_sck"]
   dataset_id_odb_wards                  = dataset_id["dataset_id_odb_wards"]
   dataset_id_odb_cars                   = dataset_id["dataset_id_odb_cars"]
   dataset_id_odb_air_no2                = dataset_id["dataset_id_odb_air_no2"]
   dataset_id_odb_population             = dataset_id["dataset_id_odb_population"]
   dataset_id_odb_air_continous          = dataset_id["dataset_id_odb_air_continous"]
   dataset_id_main_units                 = dataset_id["dataset_id_main_units"]
   dataset_id_main_air_pollution_bristol = dataset_id["dataset_id_main_air_pollution_bristol"]

   try:
    #utils.ckan_create_resource("", , [])
      resource_id_defra                                     = utils.ckan_create_resource( dataset_id_defra,                     "Defra AURN Resource",                       var.defra_aurn_fields_data,                  ["recordid"])
      resource_id_luftdaten                                 = utils.ckan_create_resource( dataset_id_luftdaten,                  "Luftdaten Resource",                       var.luftdaten_fields_data,                   ["recordid"])
      resource_id_sck                                       = utils.ckan_create_resource( dataset_id_sck,                        "Smart Citizen Kit Resource",               var.smart_citizen_fields_data,               ["deviceid", "date_time"])
      resource_id_odb_wards                                 = utils.ckan_create_resource( dataset_id_odb_wards,                  "Wards Resource",                           var.wards_fields_data,                       ["recordid"])
      resource_id_odb_air_continous                         = utils.ckan_create_resource( dataset_id_odb_air_continous,          "Air Quality Data Continous Resource",      var.air_quality_data_continuous_fields_data, ["recordid"])
      resource_id_odb_cars                                  = utils.ckan_create_resource( dataset_id_odb_cars,                   "Car Availability Resource",                var.car_availability_fields_data,            ["recordid"])
      resource_id_odb_air_no2                               = utils.ckan_create_resource( dataset_id_odb_air_no2,                "Air Quality NO2 Diffusion Tubes Resource", var.no2_fields_data,                         ["recordid"])
      resource_id_odb_population                            = utils.ckan_create_resource( dataset_id_odb_population,             "Population Estimates Resource",            var.population_estimate_fields_data,         ["recordid"])
      resource_id_main_units                                = utils.ckan_create_resource( dataset_id_main_units,                 "Reading Units Resource",                   var.units_fields_data,                       ["reading"])
      resource_id_main_air_pollution_bristol_hourly_point   = utils.ckan_create_resource( dataset_id_main_air_pollution_bristol, "Hourly Point Resource",                    var.hourly_point_aggregation_fields_data,    ["recordid"])
      resource_id_main_air_pollution_bristol_daily_point    = utils.ckan_create_resource( dataset_id_main_air_pollution_bristol, "Daily Point Resource",                     var.daily_point_aggregation_fields_data,     ["recordid"])
      resource_id_main_air_pollution_bristol_yearly_polygon = utils.ckan_create_resource( dataset_id_main_air_pollution_bristol, "Yearly Polygon Resource",                  var.yearly_polygon_aggregation_fields_data,  ["recordid"])
      resource_id_main_air_pollution_bristol_yearly_point   = utils.ckan_create_resource( dataset_id_main_air_pollution_bristol, "Yearly Point Resource",                    var.yearly_point_aggregation_fields_data,    ["recordid"])
      resource_id_main_air_pollution_bristol_necessary      = utils.ckan_create_resource( dataset_id_main_air_pollution_bristol, "Necessary Field Resource",                 var.necessary_fields_fields_data,            ["geometry"])
      print (resource_id_defra)
      print (resource_id_sck)
      dict_resource_id["resource_id_defra"]                                     = resource_id_defra["resource_id"]
      dict_resource_id["resource_id_luftdaten"]                                 = resource_id_luftdaten["resource_id"]
      dict_resource_id["resource_id_sck"]                                       = resource_id_sck["resource_id"]
      dict_resource_id["resource_id_odb_wards"]                                 = resource_id_odb_wards["resource_id"]
      dict_resource_id["resource_id_odb_air_continous"]                         = resource_id_odb_air_continous["resource_id"]
      dict_resource_id["resource_id_odb_cars"]                                  = resource_id_odb_cars["resource_id"]
      dict_resource_id["resource_id_odb_air_no2"]                               = resource_id_odb_air_no2["resource_id"]
      dict_resource_id["resource_id_odb_population"]                            = resource_id_odb_population["resource_id"]
      dict_resource_id["resource_id_main_units"]                                = resource_id_main_units["resource_id"]
      dict_resource_id["resource_id_main_air_pollution_bristol_hourly_point"]   = resource_id_main_air_pollution_bristol_hourly_point["resource_id"]
      dict_resource_id["resource_id_main_air_pollution_bristol_daily_point"]    = resource_id_main_air_pollution_bristol_daily_point["resource_id"]
      dict_resource_id["resource_id_main_air_pollution_bristol_yearly_polygon"] = resource_id_main_air_pollution_bristol_yearly_polygon["resource_id"]
      dict_resource_id["resource_id_main_air_pollution_bristol_yearly_point"]   = resource_id_main_air_pollution_bristol_yearly_point["resource_id"]
      dict_resource_id["resource_id_main_air_pollution_bristol_necessary"]      = resource_id_main_air_pollution_bristol_necessary["resource_id"]
      print("done")
      print (dict_resource_id)
   except Exception as exception_returned:
      print(exception_returned)

def init_ckan():
#   create_org()
#   create_package()
   create_resource()
