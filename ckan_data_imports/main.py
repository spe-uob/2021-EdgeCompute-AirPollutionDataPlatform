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

import open_bristol_data
import luftdaten
#import defra_aurn
import smart_citizen_kits
import rmv_and_create_reccurent_datasets

# GLOBAL VARIABLES
ARG_COMMAND = sys.argv[1]

# URLs
URL_OPEN_BRISTOL_DATA = "https://opendata.bristol.gov.uk/api/records/1.0/search/"

BRISTOL_CENTER_POINT = "51.454762,-2.597043"
LUFTDATEN_DISTANCE = "25"
URL_LUFTDATEN = "http://api.luftdaten.info/v1/filter/area="+ BRISTOL_CENTER_POINT+","+LUFTDATEN_DISTANCE

URL_SMART_CITIZEN = "https://api.smartcitizen.me/v0/devices"

# ACTION
if ARG_COMMAND == "hour":
    do_hour()

elif ARG_COMMAND == "day":
    do_day()

elif ARG_COMMAND == "year":
    do_year()

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
    id_hourlypointdataset = "665b5270-9867-4ba6-889d-c9d5c46e310f"

    # AIR POLLUTION HOURLY AGGREGATION
    hourly_aggregation_fields_data = [
        {
            'id': 'recordid',
            'type': 'text',
            "info": {
                "label": "Record ID",
                "notes": "ID of the record"
            }
        }, {
            'id': 'date_time',
            'type': 'timestamp',
            "info": {
                "label": "Date Time",
                "notes": "Time of the record"
            }
        }, {
            'id': 'geojson',
            'type': 'json',
            "info": {
                "label": "Position of the record",
                "notes": "JSON positioning of the record with longitude and latitude"
            }
        }, {
            'id': 'dataset_name',
            'type': 'text',
            "info": {
                "label": "Dataset name",
                "notes": "Name of the dataset the data comes from"
            }
        }, {
            'id': 'dataset_id',
            'type': 'text',
            "info": {
                "label": "Dataset ID",
                "notes": "ID of the dataset the data comes from"
            }
        }, {
            'id': 'pm1',
            'type': 'float',
            "info": {
                "label": "Particle Matter PM 1",
                "notes": "Particle Matter PM 1"
            }
        }, {
            'id': 'pm25',
            'type': 'float',
            "info": {
                "label": "PM2.5",
                "notes": "PM2.5 Concetration"
            }
        }, {
            'id': 'pm10',
            'type': 'float',
            "info": {
                "label": "PM10",
                "notes": "PM10 Concetration"
            }
        }, {
            'id': 'no',
            'type': 'float',
            "info": {
                "label": "NO",
                "notes": "NO Concetration"
            }
        }, {
            'id': 'nox',
            'type': 'float',
            "info": {
                "label": "NOx",
                "notes": "NOx Concentration"
            }
        }, {
            'id': 'no2',
            'type': 'float',
            "info": {
                "label": "NO2",
                "notes": "NO2 Concetration"
            }
        }, {
            'id': 'co',
            'type': 'float',
            "info": {
                "label": "CO",
                "notes": "Carbon monoxyde"
            }
        }, {
            'id': 'o3',
            'type': 'float',
            "info": {
                "label": "O3",
                "notes": "O3 Concetration"
            }
        }, {
            'id': 'temperature',
            'type': 'float',
            "info": {
                "label": "Temperature",
                "notes": "Temperature"
            }
        }, {
            'id': 'rh',
            'type': 'float',
            "info": {
                "label": "Relative Humidity",
                "notes": "Relative Humidity"
            }
        }, {
            'id': 'tvoc',
            'type': 'float',
            "info": {
                "label": "TVOC",
                "notes": "Total Volatile Organic Compounds Digital Indoor Sensor"
            }
        }, {
            'id': 'eCO2',
            'type': 'float',
            "info": {
                "label": "eCO2",
                "notes": "Equivalent Carbon Dioxide Digital Indoor Sensor"
            }
        }, {
            'id': 'light',
            'type': 'float',
            "info": {
                "label": "Ambient Light",
                "notes": "Digital Ambient Light Sensor"
            }
        }, {
            'id': 'battery',
            'type': 'float',
            "info": {
                "label": "Battery",
                "notes": "Battery SCK 1.1"
            }
        }, {
            'id': 'noise',
            'type': 'float',
            "info": {
                "label": "Noise Microphone",
                "notes": "I2S Digital Mems Microphone with custom Audio Processing Algorithm"
            }
        }, {
            'id': 'pressure',
            'type': 'float',
            "info": {
                "label": "Barometric Pressure",
                "notes": "Digital Barometric Pressure Sensor"
            }
        }, {
            'id': 'location',
            'type': 'text',
            "info": {
                "label": "Location",
                "notes": "Name of the location"
            }
        }, {
            'id': 'siteid',
            'type': 'int',
            "info": {
                "label": "Site ID",
                "notes": "ID of the site"
            }
        }
    ]

    # Delete previous data form Hourly Dataset, then recreate the table structure (necessary due to bug from CKAN), insertions are done in files of datasets
    try:
        rmv_and_create_reccurent_datasets.rmv_and_create_dataset_back(id_hourlypointdataset,
                                                                      hourly_aggregation_fields_data,
                                                                      ["recordid"])

        open_bristol_data.get_hourly_data(URL_OPEN_BRISTOL_DATA,
                                          last_date_to_retrieve,
                                          id_hourlypointdataset)
        luftdaten.get_hourly_data(URL_LUFTDATEN,
                                  id_hourlypointdataset)
        smart_citizen_kits.get_hourly_data(URL_SMART_CITIZEN,
                                           first_date_to_retrieve_sck,
                                           last_date_to_retrieve_sck,
                                           id_hourlypointdataset)
    except Exception as exception_returned:
        print(exception_returned)

def do_day():
    """
    Act if parameter given is day
    """
    print("hello")
    #defra_aurn.get_daily_data()

def do_year():
    """
    Act if parameter given is year
    """

    # IDs of datasets
    id_yearlypolygondataset = "eb10e278-9766-4f12-9f1d-cf9dbce8bec4"
    id_yearlypointdataset = "0e6c4aaa-eef3-41a1-b70c-fb3a826a27be"

    # Run crontab every 1st January so that
    # for e.g. we retrieve data from 2018 on 01-01-2020
    # (at the end of the year 2019)
    date_of_interest = datetime.datetime.utcnow() - relativedelta(years=2)
    # date_of_interest = datetime.datetime.utcnow() - relativedelta(years=1)
    last_year_to_retrieve = date_of_interest.strftime('%Y')

    # AIR POLLUTION AGGREGATION
    yearly_polygon_fields_data = [
        {
            'id': 'recordid',
            'type': 'text',
            "info": {
                "label": "Record ID",
                "notes": "ID of the record"
            }
        }, {
            'id': 'year',
            'type': 'int',
            "info": {
                "label": "Year",
                "notes": "Year"
            }
        }, {
            'id': 'geojson',
            'type': 'json',
            "info": {
                "label": "Position of the record",
                "notes": "JSON positioning of the record with longitude and latitude"
            }
        }, {
            'id': 'dataset_name',
            'type': 'text',
            "info": {
                "label": "Dataset name",
                "notes": "Name of the dataset the data comes from"
            }
        }, {
            'id': 'dataset_id',
            'type': 'text',
            "info": {
                "label": "Dataset ID",
                "notes": "ID of the dataset the data comes from"
            }
        }, {
            'id': 'wardid',
            'type': 'text',
            "info": {
                "label": "Ward ID",
                "notes": "ID of the Ward"
            }
        }, {
            'id': 'ward_center',
            'type': 'json',
            "info": {
                "label": "Position of the ward center",
                "notes": "JSON positioning of the record with longitude and latitude"
            }
        }, {
            'id': 'ward_name',
            'type': 'text',
            "info": {
                "label": "Ward Name",
                "notes": "Name of the ward"
            }
        }, {
            'id': 'objectid',
            'type': 'int',
            "info": {
                "label": "Site ID",
                "notes": "ID of the site"
            }
        }, {
            'id': 'lsoa11_code',
            'type': 'text',
            "info": {
                "label": "LSOA11 Code",
                "notes": "LSOA11 Code"
            }
        }, {
            'id': 'lsoa11_local_name',
            'type': 'text',
            "info": {
                "label": "LSOA11 Local name",
                "notes": "LSOA11 Local name"
            }
        }, {
            'id': 'population_estimate',
            'type': 'int',
            "info": {
                "label": "Population estimate",
                "notes": "Population estimate"
            }
        }, {
            'id': 'average_number_of_cars_per_household',
            'type': 'float',
            "info": {
                "label": "Average number of cars per household",
                "notes": "Average number of cars per household"
            }
        }, {
            'id': 'number_of_cars_or_vans_in_the_area',
            'type': 'int',
            "info": {
                "label": "Number of cars or vans in the area",
                "notes": "Number of cars or vans in the area"
            }
        }, {
            'id': 'all_households',
            'type': 'int',
            "info": {
                "label": "All houselholds",
                "notes": "Number of houselholds"
            }
        }, {
            'id': 'no_cars_or_vans_in_household',
            'type': 'int',
            "info": {
                "label": "No cars or vans in houselhold",
                "notes": "Number of houselholds with no cars or no vans"
            }
        }, {
            'id': 'per_of_households_with_no_car',
            'type': 'float',
            "info": {
                "label": "Percentage of houselholds with no car",
                "notes": "Percentage of houselholds with no car"
            }
        }, {
            'id': '1_car_or_van_in_household',
            'type': 'int',
            "info": {
                "label": "One car or van in houselhold",
                "notes": "Number of houselholds with one car or van"
            }
        }, {
            'id': 'per_of_households_with_1_car',
            'type': 'float',
            "info": {
                "label": "Percentage of houselholds with one car",
                "notes": "Percentage of houselholds with one car"
            }
        }, {
            'id': '2_cars_or_vans_in_household',
            'type': 'int',
            "info": {
                "label": "Two cars or vans in houselhold",
                "notes": "Number of houselholds with two cars or vans"
            }
        }, {
            'id': 'per_of_households_with_2_cars',
            'type': 'float',
            "info": {
                "label": "Percentage of houselholds with two cars",
                "notes": "Percentage of houselholds with two cars"
            }
        }, {
            'id': '3_cars_or_vans_in_household',
            'type': 'int',
            "info": {
                "label": "Three cars or vans in houselhold",
                "notes": "Number of houselholds with three cars or vans"
            }
        }, {
            'id': 'per_of_households_with_3_cars',
            'type': 'float',
            "info": {
                "label": "Percentage of houselholds with three cars",
                "notes": "Percentage of houselholds with three cars"
            }
        }, {
            'id': '4_or_more_cars_or_vans_in_household',
            'type': 'int',
            "info": {
                "label": "Four cars or vans in houselhold",
                "notes": "Number of houselholds with four cars or vans"
            }
        }, {
            'id': 'per_of_households_with_4_or_more_cars',
            'type': 'float',
            "info": {
                "label": "Percentage of houselholds with four cars or more",
                "notes": "Percentage of houselholds with four cars or more"
            }
        }
    ]

    yearly_point_fields_data = [
        {
            'id': 'recordid',
            'type': 'text',
            "info": {
                "label": "Record ID",
                "notes": "ID of the record"
            }
        }, {
            'id': 'year',
            'type': 'int',
            "info": {
                "label": "Year",
                "notes": "Year"
            }
        }, {
            'id': 'geojson',
            'type': 'json',
            "info": {
                "label": "Position of the record",
                "notes": "JSON positioning of the record with longitude and latitude"
            }
        }, {
            'id': 'dataset_name',
            'type': 'text',
            "info": {
                "label": "Dataset name",
                "notes": "Name of the dataset the data comes from"
            }
        }, {
            'id': 'dataset_id',
            'type': 'text',
            "info": {
                "label": "Dataset ID",
                "notes": "ID of the dataset the data comes from"
            }
        }, {
            'id': 'no2',
            'type': 'float',
            "info": {
                "label": "NO2",
                "notes": "NO2 Concetration"
            }
        }, {
            'id': 'readings_count',
            'type': 'int',
            "info": {
                "label": "Readings count",
                "notes": "Number of readings"
            }
        }, {
            'id': 'location',
            'type': 'text',
            "info": {
                "label": "Location",
                "notes": "Name of the location"
            }
        }, {
            'id': 'siteid',
            'type': 'int',
            "info": {
                "label": "Site ID",
                "notes": "ID of the site"
            }
        }
    ]

    try:
        rmv_and_create_reccurent_datasets.rmv_and_create_dataset_back(id_yearlypointdataset,
                                                                      yearly_polygon_fields_data,
                                                                      ["recordid"])
        rmv_and_create_reccurent_datasets.rmv_and_create_dataset_back(id_yearlypolygondataset,
                                                                      yearly_point_fields_data,
                                                                      ["recordid"])

        open_bristol_data.get_yearly_data(URL_OPEN_BRISTOL_DATA,
                                          last_year_to_retrieve,
                                          id_yearlypolygondataset,
                                          id_yearlypointdataset)
    except Exception as exception_returned:
        print(exception_returned)
