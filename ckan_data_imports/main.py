#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
This script is run by crontabs
and calls other necessary scripts
"""

# IMPORTS
import sys
import datetime
from dateutil.relativedelta import relativedelta

from utility import log_config
from plugins import open_bristol_data
from plugins import luftdaten
from plugins import defra_aurn
from plugins import smart_citizen_kits
from utility import rmv_and_create_reccurent_datasets
from utility import utils
from utility import config
from utility import variables as var

# LOGGER
LOGGER = log_config.setup_logger('ckan_import_default_log')

# GLOBAL VARIABLES
ARG_COMMAND = sys.argv[1]
AREAS = config.AREAS

def do_hour():
    """
    Act if the parameter given is hour
    """

    # Date minus 1 hour to get previous values
    current_date = datetime.datetime.utcnow()
    date_of_interest = current_date - datetime.timedelta(hours=1)
    last_date_to_retrieve = date_of_interest.strftime('%Y-%m-%dT%H')

    last_date_to_retrieve_sck = current_date.strftime('%Y-%m-%dT%H:%M:%SZ')
    first_date_to_retrieve_sck = date_of_interest.strftime('%Y-%m-%dT%H:%M:%SZ')

    # ID of datasets
    #id_hourlypointdataset = "665b5270-9867-4ba6-889d-c9d5c46e310f"

    # Delete previous data form Hourly Dataset, then recreate the table structure (necessary due to bug from CKAN), insertions are done in files of datasets
    try:
        for area in AREAS:
            if "hour" in area:
                if "last_records" in area:
                    if "point_ids" in area["last_records"]:
                        if "hourly" in area["last_records"]["point_ids"]:
                            id_hourlypointdataset = area["last_records"]["point_ids"]["hourly"]
                            rmv_and_create_reccurent_datasets.rmv_and_create_dataset_back(id_hourlypointdataset,
                                                                                          var.hourly_point_aggregation_fields_data,
                                                                                          ["recordid"])
                            if "open_data_bristol" in area["hour"]:
                                if "id_air_quality_data_continuous" in area["hour"]["open_data_bristol"] and "url" in area["hour"]["open_data_bristol"]:
                                    url_open_bristol_data = area["hour"]["open_data_bristol"]["url"]
                                    id_air_quality_data_continuous = area["hour"]["open_data_bristol"]["id_air_quality_data_continuous"]
                                    open_bristol_data.get_hourly_data(url_open_bristol_data,
                                                                      last_date_to_retrieve,
                                                                      id_hourlypointdataset,
                                                                      id_air_quality_data_continuous)
                            if "luftdaten" in area["hour"]:
                                if "id" in area["hour"]["luftdaten"] and "url" in area["hour"]["luftdaten"]:
                                    url_luftdaten = area["hour"]["luftdaten"]["url"]
                                    id_luftdaten = area["hour"]["luftdaten"]["id"]
                                    luftdaten.get_hourly_data(url_luftdaten,
                                                              id_hourlypointdataset,
                                                              id_luftdaten)
                            if "sck" in area["hour"]:
                                if "id" in area["hour"]["sck"] and "url" in area["hour"]["sck"] and "geohashes" in area["hour"]["sck"] and "center" in area["hour"]["sck"]:
                                    url_sck = area["hour"]["sck"]["url"]
                                    id_sck = area["hour"]["sck"]["id"]
                                    geohashes = area["hour"]["sck"]["geohashes"]
                                    center = area["hour"]["sck"]["center"]
                                    smart_citizen_kits.get_hourly_data(url_sck,
                                                                       first_date_to_retrieve_sck,
                                                                       last_date_to_retrieve_sck,
                                                                       id_hourlypointdataset,
                                                                       id_sck,
                                                                       geohashes,
                                                                       center)
    except Exception as exception_returned:
        LOGGER.error(exception_returned)

def do_day():
    """
    Act if parameter given is day
    """

    # Delete previous data form Hourly Dataset, then recreate the table structure (necessary due to bug from CKAN), insertions are done in files of datasets
    try:
        for area in AREAS:
            if "day" in area:
                if "last_records" in area:
                    if "point_ids" in area["last_records"]:
                        if "daily" in area["last_records"]["point_ids"]:
                            id_dailypointdataset = area["last_records"]["point_ids"]["daily"]
                            rmv_and_create_reccurent_datasets.rmv_and_create_dataset_back(id_dailypointdataset,
                                                                                          var.daily_point_aggregation_fields_data,
                                                                                          ["recordid"])
                            if "defra_aurn" in area["day"]:
                                if "files_folder" in area["day"]["defra_aurn"] and "id" in area["day"]["defra_aurn"] and "stations" in area["day"]["defra_aurn"]:
                                    files_folder_defra_aurn = area["day"]["defra_aurn"]["files_folder"]
                                    id_defra_aurn = area["day"]["defra_aurn"]["id"]
                                    stations_defra_aurn = area["day"]["defra_aurn"]["stations"]
                                    defra_aurn.get_daily_data(id_dailypointdataset,
                                                              files_folder_defra_aurn,
                                                              id_defra_aurn,
                                                              stations_defra_aurn)
    except Exception as exception_returned:
        LOGGER.error(exception_returned)

def do_year():
    """
    Act if parameter given is year
    """

    # Run crontab every 1st January so that
    # for e.g. we retrieve data from 2018 on 01-01-2020
    # (at the end of the year 2019)
    date_of_interest = datetime.datetime.utcnow() - relativedelta(years=2)
    # date_of_interest = datetime.datetime.utcnow() - relativedelta(years=1)
    last_year_to_retrieve = date_of_interest.strftime('%Y')

    try:
        for area in AREAS:
            if "year" in area:
                if "last_records" in area:
                    if "point_ids" in area["last_records"]:
                        if "yearly" in area["last_records"]["point_ids"]:
                            id_yearlypointdataset = area["last_records"]["point_ids"]["yearly"]
                            rmv_and_create_reccurent_datasets.rmv_and_create_dataset_back(id_yearlypointdataset,
                                                                                          var.yearly_point_aggregation_fields_data,
                                                                                          ["recordid"])
                            if "open_data_bristol" in area["year"]:
                                if "id_no2" in area["year"]["open_data_bristol"] and "url" in area["year"]["open_data_bristol"]:
                                    url_open_bristol_data = area["year"]["open_data_bristol"]["url"]
                                    id_no2 = area["year"]["open_data_bristol"]["id_no2"]
                                    open_bristol_data.get_yearly_data_point(url_open_bristol_data,
                                                                            last_year_to_retrieve,
                                                                            id_yearlypointdataset,
                                                                            id_no2)
                        LOGGER.info("First If") 
                    if "polygon_ids" in area["last_records"]:
                        if "yearly" in area["last_records"]["polygon_ids"]:
                            id_yearlypolygondataset = area["last_records"]["polygon_ids"]["yearly"]
                            rmv_and_create_reccurent_datasets.rmv_and_create_dataset_back(id_yearlypolygondataset,
                                                                                          var.yearly_polygon_aggregation_fields_data,
                                                                                          ["recordid"])
                            LOGGER.info("Second If") 
                            if "open_data_bristol" in area["year"]:
                                if "id_car_availability" in area["year"]["open_data_bristol"] and "url" in area["year"]["open_data_bristol"] and "id_wards" in area["year"]["open_data_bristol"] and "id_population_estimates" in area["year"]["open_data_bristol"]:
                                    url_open_bristol_data = area["year"]["open_data_bristol"]["url"]
                                    id_car_availability = area["year"]["open_data_bristol"]["id_car_availability"]
                                    id_wards = area["year"]["open_data_bristol"]["id_wards"]
                                    id_population_estimates = area["year"]["open_data_bristol"]["id_population_estimates"]
                                    LOGGER.info("Inside if")
                                    open_bristol_data.get_yearly_data_polygon(url_open_bristol_data,
                                                                              last_year_to_retrieve,
                                                                              id_yearlypolygondataset,
                                                                              id_car_availability,
                                                                              id_wards,
                                                                              id_population_estimates)
    except Exception as exception_returned:
        LOGGER.error(exception_returned)

# ACTION
if ARG_COMMAND == "hour":
    do_hour()

elif ARG_COMMAND == "day":
    do_day()

elif ARG_COMMAND == "year":
    do_year()
