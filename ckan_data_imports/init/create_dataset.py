#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
This script was made in order
to be able to create a dataset
in a package
"""

import logging
from utility import utils
LOGGER = logging.getLogger('ckan_import_default_log')

# Create Organization Using the CKAN API -- Parameters are as below:
# utils.ckan_create_org("Name","Description","image_url")

def create_org():

   try:
	# DEFRA
      utils.ckan_create_org("Defra", "The AURN is the UK's largest automatic monitoring network and is the main network used for compliance reporting against the Ambient Air Quality Directives", "https://uk-air.defra.gov.uk/images/theme/uk-gov-logo.png")

	# Luftdaten
      utils.ckan_create_org("Luftdaten", "Luftdaten.info generates a continuously updated particular matter map from the transmitted data. Fine dust becomes visible.", "https://luftdaten.info/wp-content/uploads/2018/01/luftdaten_logo_partner.png")
	
	# Smart Citizen Kit
      utils.ckan_create_org("Smart Citizen Kit", "Data retrieved from the Smart Citizen Kits in Bristol.", "http://2012.cities.io/wp-content/uploads/2014/06/SmartCitizen_logo.png")

	# Open Data Bristol
      utils.ckan_create_org("Open Data Bristol", "https://s3-eu-central-1.amazonaws.com/aws-ec2-eu-central-1-opendatasoft-staticfileset/bristol/logo?tstamp=153563322821")

	# Main Repositry
      utils.ckan_create_org("Main Repositry", "Main Repositry to store the data", "https://upload.wikimedia.org/wikipedia/en/thumb/b/bd/Bristol_City_Council_logo.svg/591px-Bristol_City_Council_logo.svg.png")
   except Exception as exception_returned:
      print(exception_returned)


def create_resource():

   try:
    #utils.ckan_create_from_scratch("", , [])
#    utils.ckan_create_from_scratch("53ad3894-dfb9-4987-b5a8-63de6c59e887", "Defra AURN Resource", defra_aurn_fields_data, ["recordid"])
#    utils.ckan_create_from_scratch("53ad3894-dfb9-4987-b5a8-63de6c59e887", "Luftdaten Resource", luftdaten_fields_data, ["recordid"])
      utils.ckan_create_from_scratch("2805c2af-4a10-4467-88f5-ad7eb8bcefcc", "Smart Citizen Kit Resource", smart_citizen_fields_data , ["deviceid", "date_time"])
#    utils.ckan_create_from_scratch("1470f9c5-6f90-4cff-8245-6c63e8d6976f", "Air Quality Data Continous Resource", air_quality_data_continuous_fields_data, ["recordid"])
#    utils.ckan_create_from_scratch("72ad36d6-85e3-459e-b687-babf7d3e56fd", "Wards Resource", wards_fields_data, ["recordid"])
#    utils.ckan_create_from_scratch("895aab2f-9cb5-4754-ab22-e3bcb9b9cd37", "Car Availability Resource", car_availability_fields_data, ["recordid"])
#    utils.ckan_create_from_scratch("95e2ca86-f2f3-431a-903d-4e4b8263cfe9", "Air Quality NO2 Diffusion Tubes Resource", no2_fields_data, ["recordid"])
#    utils.ckan_create_from_scratch("c83ee2f7-6a9c-4640-b6f7-019b9c90d54b", "Population Estimates Resource", population_estimate_fields_data, ["recordid"])
#    utils.ckan_create_from_scratch("aef09138-77c8-4674-9383-738ba22cd3f9", "Reading Units Resource", units_fields_data, ["reading"])
#    utils.ckan_create_from_scratch("8289c6c6-62ff-4012-9b99-12a02eac2d94", "Hourly Point Resource", hourly_point_aggregation_fields_data, ["recordid"])
#    utils.ckan_create_from_scratch("8289c6c6-62ff-4012-9b99-12a02eac2d94", "Daily Point Resource", daily_point_aggregation_fields_data, ["recordid"])
#    utils.ckan_create_from_scratch("8289c6c6-62ff-4012-9b99-12a02eac2d94", "Yearly Polygon Resource", yearly_polygon_aggregation_fields_data, ["recordid"])
#    utils.ckan_create_from_scratch("8289c6c6-62ff-4012-9b99-12a02eac2d94", "Yearly Point Resource", yearly_point_aggregation_fields_data, ["recordid"])
#    utils.ckan_create_from_scratch("8289c6c6-62ff-4012-9b99-12a02eac2d94", "Necessary Field Resource", necessary_fields_fields_data, ["geometry"])
      print("done")
   except Exception as exception_returned:
      print(exception_returned)

def main():
   create_org()


if __name__ == "__main__":
    main()
