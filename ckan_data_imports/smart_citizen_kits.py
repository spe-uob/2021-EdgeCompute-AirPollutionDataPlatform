#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
This module imports data from smart citizen kits
and pushes it in the smart citizen dataset
and the aggregated air pollution datasets.
"""

import logging
import utils

LOGGER = logging.getLogger('ckan_import_default_log')

ID_SMARTCITIZENKITS = "2398321b-cb1b-43da-8d33-c33f4c37b1dd"
# List of geohashes covering Bristol in order to know from which kits to take the data
BRISTOL_GEOHASHES = ["gcnh", "gcnj"]
BRISTOL_CENTER = "51.456074, -2.605626"
READING_NAMES = [
    "TVOC",
    "eCO2",
    "BH1730FVC",
    "Battery",
    "Noise",
    "Barometric Pressure",
    "PM1",
    "PM2.5",
    "PM10",
    "NO2",
    "CO",
    "Humidity",
    "Temperature"
]
EQUI_READING_NAMES = [
    "tvoc",
    "eCO2",
    "light",
    "battery",
    "noise",
    "pressure",
    "pm1",
    "pm25",
    "pm10",
    "no2",
    "co",
    "rh",
    "temperature"
]

def get_hourly_data(url, first_date_to_retrieve_sck, last_date_to_retrieve_sck, id_dataset):
    """
    Get Smart Citizen Kit data every hour and push to the necessary datasets

    Keyword arguments:
    url -- the url to get the data
    first_date_to_retrieve_SCK -- the start of the hour
    last_date_to_retrieve_SCK -- the end of the hour
    id_dataset -- the id of the dataset to push data every hour
    """
    push_smartcitizenkits(url, first_date_to_retrieve_sck, last_date_to_retrieve_sck, id_dataset)

####### SMART CITIZEN KITS ########

def push_smartcitizenkits(url, first_date_to_retrieve_sck, last_date_to_retrieve_sck, id_dataset):
    """
    Push Smart Citizen Kit data to the necessary datasets

    Keyword arguments:
    url -- the url to get the data
    first_date_to_retrieve_sck -- the start of the hour
    last_date_to_retrieve_sck -- the end of the hour
    id_dataset -- the id of the dataset to push data every hour
    """
    page = 1
    finish = False
    while not finish:
        result_from_get = get_smartcitizenkits(url,
                                               page,
                                               first_date_to_retrieve_sck,
                                               last_date_to_retrieve_sck)
        if result_from_get is not None:
            if result_from_get["records"] is not None:
                utils.ckan_upsert(ID_SMARTCITIZENKITS, result_from_get["records"])
                push_to_hourly(id_dataset, result_from_get["records"])
            if result_from_get["finish"]:
                finish = True
            else:
                page += 1
        else:
            finish = True

def get_smartcitizenkits(url, page, first_date_to_retrieve_sck, last_date_to_retrieve_sck):
    """
    Get the data from the url

    Keyword arguments:
    url -- the url to get the data
    first_date_to_retrieve_sck -- the start of the hour
    last_date_to_retrieve_sck -- the end of the hour
    page -- page of the response
    """
    params = {
        "near":BRISTOL_CENTER,
        "page":page
    }
    records = utils.get_data(url, params)
    if records is not None:
        if len(records) != 0:
            to_push = transform_smartcitizenkits(records,
                                                 first_date_to_retrieve_sck,
                                                 last_date_to_retrieve_sck)
            return to_push
        else:
            LOGGER.warning("Records imported from the Smart Citizen API are empty")
            return None
    else:
        LOGGER.error("Records imported from the Smart Citizen API are NONE")
        return None

def transform_smartcitizenkits(records, first_date_to_retrieve_sck, last_date_to_retrieve_sck):
    """
    Transform the data to records that can be pushed in the Smart Citizen dataset

    Keyword arguments:
    records -- the records taken from the API
    first_date_to_retrieve_sck -- the start of the hour
    last_date_to_retrieve_sck -- the end of the hour
    """
    finished = False
    to_return = {}
    new_records = []
    new_record = {}
    record_with_data = False
    for record in records:
        record_with_data = False
        new_record = {}
        if ("data" in record) and ("id" in record):
            record_data = record["data"]
            deviceid = str(record["id"])
            new_record["deviceid"] = deviceid
            if "location" in record_data and "sensors" in record_data:
                location = record_data["location"]
                if "geohash" in location:
                    if test_record_in_zone(location):
                        sensors = record_data["sensors"]
                        if "longitude" in location and "latitude" in location:
                            geo_json = {
                                "type": "Point",
                                "coordinates": [
                                    float(location["longitude"]),
                                    float(location["latitude"])
                                ]
                            }
                            new_record["geojson"] = utils.fix_geojson(geo_json)
                            for sensor in sensors:
                                if ("id" in sensor) and ("name" in sensor):
                                    sensor_id = sensor["id"]
                                    reading_name = sensor["name"]
                                    reading_description = sensor["description"]
                                    new_record_rn = ""
                                    for k in range(len(READING_NAMES)):
                                        if READING_NAMES[k] in reading_name:
                                            new_record_rn = EQUI_READING_NAMES[k]
                                    if new_record_rn == "":
                                        for k in range(len(READING_NAMES)):
                                            if READING_NAMES[k] in reading_description:
                                                new_record_rn = EQUI_READING_NAMES[k]
                                    if new_record_rn != "":
                                        value = get_data_by_sensor(deviceid,
                                                                   sensor_id,
                                                                   first_date_to_retrieve_sck,
                                                                   last_date_to_retrieve_sck)
                                        if value is not None:
                                            record_with_data = True
                                            new_record[new_record_rn] = value
                    else:
                        finished = True
            if record_with_data:
                new_record["date_time"] = last_date_to_retrieve_sck
                new_records.append(new_record)
    to_return = {
        "finish": finished,
        "records": new_records
    }
    return to_return

def test_record_in_zone(location):
    """
    Test if the record is in the desirable location

    Keyword arguments:
    location -- location of the record
    """
    in_zone = False
    if location["country_code"] == "GB":
        for elem in BRISTOL_GEOHASHES:
            if elem in location["geohash"]:
                in_zone = True
    return in_zone


def get_data_by_sensor(device_id, sensor_id, first_date_to_retrieve_sck, last_date_to_retrieve_sck):
    """
    Get the data by sensor of a device that can be pushed in the Smart Citizen dataset

    Keyword arguments:
    device_id -- id of the kit
    sensor_id -- id of the sensor of the kit
    first_date_to_retrieve_sck -- the start of the hour
    last_date_to_retrieve_sck -- the end of the hour
    """
    params = {
        "sensor_id":sensor_id,
        "function":"avg",
        "rollup":"61m",
        "from":first_date_to_retrieve_sck,
        "to":last_date_to_retrieve_sck
    }
    import_result = utils.get_data("https://api.smartcitizen.me/v0/devices/"+device_id+"/readings",
                                   params)
    if import_result is not None:
        if "readings" in import_result:
            readings = import_result["readings"]
            if (readings is not None) and (len(readings) != 0):
                list_in_readings = readings[0]
                if (list_in_readings is not None) and (len(list_in_readings) >= 1):
                    value = list_in_readings[1]
                    return value
    return None

def push_to_hourly(id_dataset, records):
    """
    Push the data every hour to the aggregated dataset

    Keyword arguments:
    id_dataset -- the id of the dataset where to push data
    records -- records that were pushed to the Smart Citizen dataset
    """
    for record in records:
        try:
            record["recordid"] = record.pop("deviceid")
        except KeyError:
            pass
        record["dataset_id"] = ID_SMARTCITIZENKITS
        record["dataset_name"] = "smart-citizen-kits"
    utils.ckan_upsert(id_dataset, records)

###########################################
