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

import log_config

import open_bristol_data
import luftdaten
import defra_aurn
import smart_citizen_kits
import rmv_and_create_reccurent_datasets
import utils

# LOGGER
LOGGER = log_config.setup_logger('ckan_import_default_log')

# GLOBAL VARIABLES
ARG_COMMAND = sys.argv[1]

AREAS = [
    {
        "name": "Bristol",
        "last_records": {
            "necessary_fields": "6a0c2e53-f6a8-4198-bd52-c9655890e381",
            "point_ids": {
                "yearly": "0e6c4aaa-eef3-41a1-b70c-fb3a826a27be",
                "daily": "7e96b4d8-854c-489a-94aa-1f9c19bedd07",
                "hourly": "665b5270-9867-4ba6-889d-c9d5c46e310f"

            },
            "polygon_ids": {
                "yearly": "eb10e278-9766-4f12-9f1d-cf9dbce8bec4"
            }
        },
        "hour": {
            "luftdaten": {
                "url": "http://api.luftdaten.info/v1/filter/area=51.454762,-2.597043,25",
                "id": "8c8389f9-3dac-4fa4-9170-69ef72af0cbb"
            },
            "sck": {
                "url": "https://api.smartcitizen.me/v0/devices",
                "id": "2398321b-cb1b-43da-8d33-c33f4c37b1dd",
                "geohashes": ["gcnh", "gcnj"],
                "center": "51.456074, -2.605626"
            },
            "open_data_bristol": {
                "url": "https://opendata.bristol.gov.uk/api/records/1.0/search/",
                "id_air_quality_data_continuous": "9bdded4d-17a7-4cf2-95ab-621ca856e4e4",
            }
        },
        "day": {
            "defra_aurn": {
                "files_folder": "/home/kevin/import_scripts/defra_aurn_imports/",
                "id": "09d1c1a9-1364-4ef3-a56f-50614d1dad4f",
                "stations": ["brs8", "br11"]
            }
        },
        "year": {
            "open_data_bristol": {
                "url": "https://opendata.bristol.gov.uk/api/records/1.0/search/",
                "id_wards": "2be61e5f-d0e8-4328-b467-fa6c923dacb8",
                "id_car_availability": "597c07fd-231c-4693-9787-284470abb2ee",
                "id_no2": "e87634f2-58e7-4db8-a677-a513f4d6705b",
                "id_population_estimates": "3f6fc44e-2fdc-44f6-8edd-f338ed3f2467"
            }
        }
    }, {
        "name": "London",
        "last_records": {
            "necessary_fields": "262940a0-7d73-4eb4-abf5-a7711cc025b5",
            "point_ids": {
                "daily": "06f747ed-0b42-4350-8aef-bd761589b3f8",
                "hourly": "341031b0-8fee-469a-accc-b1dccc1d738c"

            }
        },
        "hour": {
            "luftdaten": {
                "url": "http://api.luftdaten.info/v1/filter/area=51.505,-0.129,35",
                "id": "8c8389f9-3dac-4fa4-9170-69ef72af0cbb"
            },
            "sck": {
                "url": "https://api.smartcitizen.me/v0/devices",
                "id": "2398321b-cb1b-43da-8d33-c33f4c37b1dd",
                "geohashes": ["gcpe", "gcps", "gcpt", "gcpw",
                              "gcpy", "u10n", "u10j", "u10h",
                              "gcpu", "gcpv", "gcpg", "u105"],
                "center": "51.505,-0.129"
            }
        },
        "day": {
            "defra_aurn": {
                "files_folder": "/home/kevin/import_scripts/defra_aurn_imports/",
                "id": "09d1c1a9-1364-4ef3-a56f-50614d1dad4f",
                "stations": ["a3", "bex", "bren",
                             "bri", "brn", "by2",
                             "by1", "cll2", "crd",
                             "ea8", "hg1", "hg2",
                             "hg4", "hil", "hk4",
                             "hors", "hr3", "hrl",
                             "hs1", "ks1", "lon5",
                             "lon6", "lw1", "my1",
                             "sk1", "sk2", "sk5",
                             "sut1", "sut3", "ted",
                             "ted2", "th2", "wa2",
                             "wl"]
            }
        }
    }
]

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
                "label": "PM1",
                "notes": "Particulate matter PM1 Concentration"
            }
        }, {
            'id': 'pm25',
            'type': 'float',
            "info": {
                "label": "PM2.5",
                "notes": "Particulate matter PM2.5 Concentration"
            }
        }, {
            'id': 'pm10',
            'type': 'float',
            "info": {
                "label": "PM10",
                "notes": "Particulate matter PM10 Concentration"
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
        for area in AREAS:
            if "hour" in area:
                if "last_records" in area:
                    if "point_ids" in area["last_records"]:
                        if "hourly" in area["last_records"]["point_ids"]:
                            id_hourlypointdataset = area["last_records"]["point_ids"]["hourly"]
                            rmv_and_create_reccurent_datasets.rmv_and_create_dataset_back(id_hourlypointdataset,
                                                                                          hourly_aggregation_fields_data,
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

    # AIR POLLUTION HOURLY AGGREGATION
    daily_aggregation_fields_data = [
        {
            'id': 'recordid',
            'type': 'text',
            "info": {
                "label": "Record ID",
                "notes": "ID of the record"
            }
        }, {
            'id': 'day',
            'type': 'text',
            "info": {
                "label": "Day",
                "notes": "Day of the record"
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
            'id': 'pm25',
            'type': 'float',
            "info": {
                "label": "PM2.5",
                "notes": "Particulate matter PM2.5 Concentration"
            }
        }, {
            'id': 'pm10',
            'type': 'float',
            "info": {
                "label": "PM10",
                "notes": "Particulate matter PM10 Concentration"
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
            'id': 'ws',
            'type': 'float',
            "info": {
                "label": "Wind Speed",
                "notes": "Wind Speed"
            }
        }, {
            'id': 'wd',
            'type': 'float',
            "info": {
                "label": "Wind Direction",
                "notes": "Wind Direction"
            }
        }, {
            'id': 'location',
            'type': 'text',
            "info": {
                "label": "Location",
                "notes": "Name of the location"
            }
        }
    ]

    # Delete previous data form Hourly Dataset, then recreate the table structure (necessary due to bug from CKAN), insertions are done in files of datasets
    try:
        for area in AREAS:
            if "day" in area:
                if "last_records" in area:
                    if "point_ids" in area["last_records"]:
                        if "daily" in area["last_records"]["point_ids"]:
                            id_dailypointdataset = area["last_records"]["point_ids"]["daily"]
                            rmv_and_create_reccurent_datasets.rmv_and_create_dataset_back(id_dailypointdataset,
                                                                                          daily_aggregation_fields_data,
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
        for area in AREAS:
            if "year" in area:
                if "last_records" in area:
                    if "point_ids" in area["last_records"]:
                        if "yearly" in area["last_records"]["point_ids"]:
                            id_yearlypointdataset = area["last_records"]["point_ids"]["yearly"]
                            rmv_and_create_reccurent_datasets.rmv_and_create_dataset_back(id_yearlypointdataset,
                                                                                          yearly_point_fields_data,
                                                                                          ["recordid"])
                            if "open_data_bristol" in area["year"]:
                                if "id_no2" in area["year"]["open_data_bristol"] and "url" in area["year"]["open_data_bristol"]:
                                    url_open_bristol_data = area["year"]["open_data_bristol"]["url"]
                                    id_no2 = area["year"]["open_data_bristol"]["id_no2"]
                                    open_bristol_data.get_yearly_data_point(url_open_bristol_data,
                                                                            last_year_to_retrieve,
                                                                            id_yearlypointdataset,
                                                                            id_no2)
                    if "polygon_ids" in area["last_records"]:
                        if "yearly" in area["last_records"]["polygon_ids"]:
                            id_yearlypolygondataset = area["last_records"]["polygon_ids"]["yearly"]
                            rmv_and_create_reccurent_datasets.rmv_and_create_dataset_back(id_yearlypolygondataset,
                                                                                          yearly_polygon_fields_data,
                                                                                          ["recordid"])
                            if "open_data_bristol" in area["year"]:
                                if "id_car_availability" in area["year"]["open_data_bristol"] and "url" in area["year"]["open_data_bristol"] and "id_wards" in area["year"]["open_data_bristol"] and "id_population_estimates" in area["year"]["open_data_bristol"]:
                                    url_open_bristol_data = area["year"]["open_data_bristol"]["url"]
                                    id_car_availability = area["year"]["open_data_bristol"]["id_car_availability"]
                                    id_wards = area["year"]["open_data_bristol"]["id_wards"]
                                    id_population_estimates = area["year"]["open_data_bristol"]["id_population_estimates"]
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
