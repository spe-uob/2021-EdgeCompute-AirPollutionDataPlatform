#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
This module imports data from open bristol data
and pushes it in the open bristol data datasets
and the aggregated air pollution datasets.
"""

import logging
from datetime import datetime
from utility import utils

LOGGER = logging.getLogger('ckan_import_default_log')

def get_hourly_data(url, last_date_to_retrieve, id_hourlypointdataset, id_air_quality_data_continuous):
    """
    Get data every hour and push to the necessary datasets

    Keyword arguments:
    url -- the url to get the data
    last_date_to_retrieve -- the date to retrieve
    id_dataset -- the id of the dataset to push data every hour
    id_air_quality_data_continuous -- id of the air quality continuous dataset
    """
    push_airqualitydatacontinous(url, last_date_to_retrieve, id_hourlypointdataset, id_air_quality_data_continuous)

def get_yearly_data_point(url, last_year_to_retrieve, id_yearlypointdataset, id_no2):
    """
    Get data every year and push to the necessary datasets

    Keyword arguments:
    url -- the url to get the data
    last_year_to_retrieve -- the year to retrieve
    id_yearlypointdataset -- the id of the point dataset to push data every year
    id_no2 -- the id of the no2 dataset
    """
    push_no2(url, last_year_to_retrieve, id_yearlypointdataset, id_no2)

def get_yearly_data_polygon(url, last_year_to_retrieve, id_yearlypolygondataset, id_car_availability, id_wards, id_population_estimates):
    """
    Get data every year and push to the necessary datasets

    Keyword arguments:
    url -- the url to get the data
    last_year_to_retrieve -- the year to retrieve
    id_yearlypolygondataset -- the id of the polygon dataset to push data every year
    id_car_availability -- the id of the car availaibility dataset
    id_wards -- the id of the wards dataset
    id_population_estimates -- the id of the population estimates dataset
    """
    LOGGER.info("Inside get yearly data polygon")
    wards = push_wards(url, id_wards)

    LOGGER.info("After ward")
    cars = push_caravailability(url, id_car_availability)
    LOGGER.info("After cars")
    if (wards is not None) and (cars is not None):
        push_to_yrly_caravail_wth_wards(id_yearlypolygondataset, wards, cars, id_car_availability)
    LOGGER.info("Before push")
    push_populationestimates(url, last_year_to_retrieve, id_yearlypolygondataset, id_population_estimates)

####### AIR QUALITY DATA CONTINUOUS ########

def push_airqualitydatacontinous(url, last_date_to_retrieve, id_hourlypointdataset, id_air_quality_data_continuous):
    """
    Push data to the necessary datasets

    Keyword arguments:
    url -- the url to get the data
    last_date_to_retrieve -- date to retrieve
    id_dataset -- the id of the dataset to push data every hour
    id_air_quality_data_continuous -- id of the air quality continuous dataset
    """
    to_push = get_airqualitydatacontinous(url, last_date_to_retrieve)
    if to_push is not None:
        utils.ckan_upsert(id_air_quality_data_continuous, to_push)
        push_to_hourly(id_hourlypointdataset, to_push, id_air_quality_data_continuous)

def get_airqualitydatacontinous(url, last_date_to_retrieve):
    """
    Get the data from the url

    Keyword arguments:
    url -- the url to get the data
    last_date_to_retrieve -- date to retrieve data
    """
    params = {
        "dataset":"air-quality-data-continuous",
        "rows":100,
        "sort":"date_time",
        "q": "date_time="+last_date_to_retrieve, #replacement of line under this
        # "refine.date_time":last_date_to_retrieve, #Doesn't work anymore no idea why
        "timezone":"UTC"
    }
    res = utils.get_data(url, params)
    if res is not None:
        records = res["records"]
        if len(records) != 0:
            to_push = transform_aqdcontinuous(records)
            return to_push
        else:
            LOGGER.warning("Records imported from the Open Bristol Data API for Air Quality Continuous Data are empty")
            return None
    else:
        LOGGER.error("Records imported from the Open Bristol Data API for Air Quality Continuous Data are NONE")
        return None

def transform_aqdcontinuous(records):
    """
    Transform the data to records that can be pushed in the dataset

    Keyword arguments:
    records -- the records taken from the API
    """
    to_return = []
    new_record = {}
    for record in records:
        new_record = {}
        fields = record["fields"]
        if "recordid" in record:
            new_record["recordid"] = record["recordid"]
            if "date_time" in fields:
                new_record["date_time"] = fields["date_time"]
            if "geometry" in record:
                new_record["geojson"] = utils.fix_geojson(record["geometry"])
            if "pm25" in fields:
                new_record["pm25"] = fields["pm25"]
            if "pm10" in fields:
                new_record["pm10"] = fields["pm10"]
            if "no" in fields:
                new_record["no"] = fields["no"]
            if "nox" in fields:
                new_record["nox"] = fields["nox"]
            if "no2" in fields:
                new_record["no2"] = fields["no2"]
            if "o3" in fields:
                new_record["o3"] = fields["o3"]
            if "temperature" in fields:
                new_record["temperature"] = fields["temperature"]
            if "rh" in fields:
                new_record["rh"] = fields["rh"]
            if "location" in fields:
                new_record["location"] = fields["location"]
            if "siteid" in fields:
                new_record["siteid"] = fields["siteid"]
            to_return.append(new_record)
    return to_return

def push_to_hourly(id_hourlypointdataset, records, id_air_quality_data_continuous):
    """
    Push the data every hour to the aggregated dataset

    Keyword arguments:
    id_hourlypointdataset -- the id of the dataset where to push data
    records -- records that were pushed to the dataset
    id_air_quality_data_continuous -- id of the air quality continuous dataset
    """
    for record in records:
        record["dataset_id"] = id_air_quality_data_continuous
        record["dataset_name"] = "air-quality-data-continuous"
    utils.ckan_upsert(id_hourlypointdataset, records)

############################################
################ WARDS #####################

def push_wards(url, id_wards):
    """
    Push data to the necessary datasets

    Keyword arguments:
    url -- the url to get the data
    id_wards -- the id of the wards dataset
    """
    to_push = get_wards(url)
    LOGGER.info("After Get wards")
    if to_push is not None:
        utils.ckan_upsert(id_wards, to_push)
        return to_push
    else:
        return None

def get_wards(url):
    """
    Get the data from the url

    Keyword arguments:
    url -- the url to get the data
    """
    params = {
        "dataset":"wards",
        "rows":100,
        "timezone":"UTC"
    }
    imported_result = utils.get_data(url, params)
    LOGGER.info("After imported_results")
    if imported_result is not None:
        records = imported_result["records"]
        if len(records) != 0:
            to_push = transform_wards(records)
            return to_push
        else:
            LOGGER.warning("Records imported from the Open Bristol Data API for Wards are empty")
            return None
    else:
        LOGGER.error("Records imported from the Open Bristol Data API for Wards are NONE")
        return None

def transform_wards(records):
    """
    Transform the data to records that can be pushed in the dataset

    Keyword arguments:
    records -- the records taken from the API
    """
    to_return = []
    new_record = {}
    for record in records:
        new_record = {}
        fields = record["fields"]
        if "ward_id" in fields:
            new_record["wardid"] = fields["ward_id"]
            LOGGER.info("inside Hula1")
            if "geo_shape" in fields:
#                new_record["geojson"] = utils.fix_geojson(fields["geo_shape"])
                new_record["geojson"] = fields["geo_shape"]
                LOGGER.info("inside Hula2")
            if "geometry" in record:
                new_record["ward_center"] = record["geometry"]
            if "name" in fields:
                new_record["ward_name"] = fields["name"]
            if "objectid" in fields:
                new_record["objectid"] = fields["objectid"]
            if "recordid" in record:
                new_record["recordid"] = record["recordid"]
            if "record_timestamp" in record:
                new_record["date_time"] = record["record_timestamp"]
            to_return.append(new_record)
    return to_return

############################################
############### CAR AVAILABILITY ###########

def push_caravailability(url, id_car_availability):
    """
    Push data to the necessary datasets

    Keyword arguments:
    url -- the url to get the data
    id_car_availability -- the id of the car availaibility dataset
    """
    to_push = get_caravailability(url)
    if to_push is not None:
        utils.ckan_upsert(id_car_availability, to_push)
        return to_push
    else:
        return None

def get_caravailability(url):
    """
    Get the data from the url

    Keyword arguments:
    url -- the url to get the data
    """
    params = {
        "dataset":"car-availability",
        "rows":100,
        "timezone":"UTC"
    }
    imported_result = utils.get_data(url, params)
    if imported_result is not None:
        records = imported_result["records"]
        if len(records) != 0:
            to_push = transform_caravailability(records)
            return to_push
        else:
            LOGGER.warning("Records imported from the Open Bristol Data API for Car Availability are empty")
            return None
    else:
        LOGGER.error("Records imported from the Open Bristol Data API for Car Availability are NONE")
        return None

def transform_caravailability(records):
    """
    Transform the data to records that can be pushed in the dataset

    Keyword arguments:
    records -- the records taken from the API
    """
    to_return = []
    new_record = {}
    for record in records:
        new_record = {}
        fields = record["fields"]
        if ("2016_ward_code" in fields) and ("recordid" in record):
            new_record["wardid"] = fields["2016_ward_code"]
            new_record["recordid"] = record["recordid"]
            if "2016_ward_name" in fields:
                new_record["ward_name"] = fields["2016_ward_name"]
            if "average_number_of_cars_per_household" in fields:
                new_record["average_number_of_cars_per_household"] = fields["average_number_of_cars_per_household"]
            if "number_of_cars_or_vans_in_the_area" in fields:
                new_record["number_of_cars_or_vans_in_the_area"] = fields["number_of_cars_or_vans_in_the_area"]
            if "all_households" in fields:
                new_record["all_households"] = fields["all_households"]
            if "no_cars_or_vans_in_household" in fields:
                new_record["no_cars_or_vans_in_household"] = fields["no_cars_or_vans_in_household"]
            if "of_households_with_no_car" in fields:
                new_record["per_of_households_with_no_car"] = fields["of_households_with_no_car"]
            if "1_car_or_van_in_household" in fields:
                new_record["1_car_or_van_in_household"] = fields["1_car_or_van_in_household"]
            if "of_households_with_1_car" in fields:
                new_record["per_of_households_with_1_car"] = fields["of_households_with_1_car"]
            if "2_cars_or_vans_in_household" in fields:
                new_record["2_cars_or_vans_in_household"] = fields["2_cars_or_vans_in_household"]
            if "of_households_with_2_cars" in fields:
                new_record["per_of_households_with_2_cars"] = fields["of_households_with_2_cars"]
            if "3_cars_or_vans_in_household" in fields:
                new_record["3_cars_or_vans_in_household"] = fields["3_cars_or_vans_in_household"]
            if "of_households_with_3_cars" in fields:
                new_record["per_of_households_with_3_cars"] = fields["of_households_with_3_cars"]
            if "4_or_more_cars_or_vans_in_household" in fields:
                new_record["4_or_more_cars_or_vans_in_household"] = fields["4_or_more_cars_or_vans_in_household"]
            if "of_households_with_4_or_more_cars" in fields:
                new_record["per_of_households_with_4_or_more_cars"] = fields["of_households_with_4_or_more_cars"]
            if "record_timestamp" in record:
                new_record["date_time"] = record["record_timestamp"]
            to_return.append(new_record)
    return to_return

def push_to_yrly_caravail_wth_wards(id_yearlypolygondataset, wards, cars, id_car_availability):
    """
    Push the data every year to the aggregated dataset

    Keyword arguments:
    id_yearlypolygondataset -- the id of the dataset where to push data
    wards -- wards that were pushed to the dataset
    cars -- cars data that were pushed to the dataset
    id_car_availability -- the id of the car availaibility dataset
    """
    new_cars = []
    for car in cars:
        found = False
        for ward in wards:
            if car["wardid"] == ward["wardid"]:
                found = True
                if "geojson" in ward:
                    car["geojson"] = ward["geojson"]
                if "ward_center" in ward:
                    car["ward_center"] = ward["ward_center"]
                if "objectid" in ward:
                    car["objectid"] = ward["objectid"]
        if found:
            LOGGER.info("Inside Push_to_trly_car")
            new_cars.append(car)
    for new_car in new_cars:
        try:
            LOGGER.info("Inside Push_to_trly_car 2")
            LOGGER.info(new_car)
            new_car["year"] = int(datetime.strptime(new_car.pop("date_time"),
                                                    '%Y-%m-%dT%H:%M:%S+00:00').year)
            LOGGER.info("Inside Push_to_trly_car 3")
        except KeyError:
            pass
        new_car["dataset_id"] = id_car_availability
        new_car["dataset_name"] = "car-availability-by-ward"
    utils.ckan_upsert(id_yearlypolygondataset, new_cars)
    LOGGER.info("Outside Push_to_trly_car 2")
############################################
## AIR QUALITY (NO2 DIFFUSION TUBE) DATA ###

def push_no2(url, last_year_to_retrieve, id_yearlypointdataset, id_no2):
    """
    Push data to the necessary datasets

    Keyword arguments:
    url -- the url to get the data
    last_year_to_retrieve -- year to retrieve
    id_yearlypointdataset -- the id of the dataset to push data every year
    id_no2 -- the id of the no2 dataset
    """
    to_push = get_no2(url, last_year_to_retrieve)
    if to_push is not None:
        utils.ckan_upsert(id_no2, to_push)
        push_to_yearly_point(id_yearlypointdataset, to_push, id_no2)

def get_no2(url, last_year_to_retrieve):
    """
    Get the data from the url

    Keyword arguments:
    url -- the url to get the data
    last_year_to_retrieve -- year to retrieve data
    """
    params = {
        "dataset":"no2-diffusion-tube-data",
        "rows":500,
        "refine.year":last_year_to_retrieve,
        "timezone":"UTC"
    }
    imported_result = utils.get_data(url, params)
    if imported_result is not None:
        records = imported_result["records"]
        if len(records) != 0:
            to_push = transform_no2(records)
            return to_push
        else:
            LOGGER.warning("Records imported from the Open Bristol Data API for the NO2 dataset are empty")
            return None
    else:
        LOGGER.error("Records imported from the Open Bristol Data API for the NO2 dataset are NONE")
        return None

def transform_no2(records):
    """
    Transform the data to records that can be pushed in the dataset

    Keyword arguments:
    records -- the records taken from the API
    """
    to_return = []
    new_record = {}
    for record in records:
        new_record = {}
        fields = record["fields"]
        if "recordid" in record:
            new_record["recordid"] = record["recordid"]
            if "year" in fields:
                new_record["year"] = fields["year"]
            if "geometry" in record:
                new_record["geojson"] = utils.fix_geojson(record["geometry"])
            if "conc_ugm3" in fields:
                new_record["no2"] = fields["conc_ugm3"]
            if "count" in fields:
                new_record["readings_count"] = fields["count"]
            if "location" in fields:
                new_record["location"] = fields["location"]
            if "siteid" in fields:
                new_record["siteid"] = fields["siteid"]
            to_return.append(new_record)
    return to_return

def push_to_yearly_point(id_yearlypointdataset, records, id_no2):
    """
    Push the data every year to the aggregated dataset

    Keyword arguments:
    id_yearlypointdataset -- the id of the dataset where to push data
    records -- records that were pushed to the dataset
    id_no2 -- the id of the no2 dataset
    """
    for record in records:
        record["dataset_id"] = id_no2
        record["dataset_name"] = "air-quality-no2-diffusion-tube-data"
    utils.ckan_upsert(id_yearlypointdataset, records)

############################################
######### POPULATION ESTIMATES #############

def push_populationestimates(url, last_year_to_retrieve, id_yearlypolygondataset, id_population_estimates):
    """
    Push data to the necessary datasets

    Keyword arguments:
    url -- the url to get the data
    last_year_to_retrieve -- year to retrieve
    id_yearlypolygondataset -- the id of the dataset to push data every year
    id_population_estimates -- the id of the population estimates dataset
    """
    to_push = get_populationestimates(url, last_year_to_retrieve)
    if to_push is not None:
        utils.ckan_upsert(id_population_estimates, to_push)
        push_to_yearly_poly_popest(id_yearlypolygondataset, to_push, id_population_estimates)

def get_populationestimates(url, last_year_to_retrieve):
    """
    Get the data from the url

    Keyword arguments:
    url -- the url to get the data
    last_year_to_retrieve -- year to retrieve data
    """
    params = {
        "dataset":"population-estimates-2005-2016-lsoa11",
        "rows":500,
        "sort":"lsoa11_code",
        "refine.mid_year":last_year_to_retrieve,
        "timezone":"UTC"
    }
    imported_result = utils.get_data(url, params)
    if imported_result is not None:
        records = imported_result["records"]
        if len(records) != 0:
            to_push = transform_populationestimates(records)
            return to_push
        else:
            LOGGER.warning("Records imported from the Open Bristol Data API for Population Estimates are empty")
            return None
    else:
        LOGGER.error("Records imported from the Open Bristol Data API for Population Estimates are NONE")
        return None

def transform_populationestimates(records):
    """
    Transform the data to records that can be pushed in the dataset

    Keyword arguments:
    records -- the records taken from the API
    """
    to_return = []
    new_record = {}
    for record in records:
        new_record = {}
        fields = record["fields"]
        if ("lsoa11_code" in fields) and ("recordid" in record):
            new_record["lsoa11_code"] = fields["lsoa11_code"]
            new_record["recordid"] = record["recordid"]
            if "lsoa11_local_name" in fields:
                new_record["lsoa11_local_name"] = fields["lsoa11_local_name"]
            if "ward" in fields:
                new_record["ward_name"] = fields["ward"]
            if "mid_year" in fields:
                new_record["year"] = fields["mid_year"]
            if "geo_shape" in fields:
#                new_record["geojson"] = utils.fix_geojson(fields["geo_shape"])
                new_record["geojson"] = fields["geo_shape"]
            if "population_estimate" in fields:
                new_record["population_estimate"] = fields["population_estimate"]
            to_return.append(new_record)
    return to_return

def push_to_yearly_poly_popest(id_yearlypolygondataset, records, id_population_estimates):
    """
    Push the data every year to the aggregated dataset

    Keyword arguments:
    id_yearlypolygondataset -- the id of the dataset where to push data
    records -- records that were pushed to the dataset
    id_population_estimates -- the id of the population estimates dataset
    """
    for record in records:
        record["dataset_id"] = id_population_estimates
        record["dataset_name"] = "population-estimates"
    utils.ckan_upsert(id_yearlypolygondataset, records)

############################################
