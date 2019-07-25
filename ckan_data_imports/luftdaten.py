#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
This module imports data from luftdaten
and pushes it in the luftdaten dataset
and the aggregated air pollution datasets.
"""

from datetime import datetime
import utils

ID_LUFTDATEN = "8c8389f9-3dac-4fa4-9170-69ef72af0cbb"

def get_hourly_data(url, id_dataset):
    """
    Get Luftdaten data every hour and push to the necessary datasets

    Keyword arguments:
    url -- the url to get the data
    id_dataset -- the id of the dataset to push data every hour
    """
    push_luftdaten(url, id_dataset)

####### LUFTDATEN ########

def push_luftdaten(url, id_dataset):
    """
    Push Luftdaten data to the necessary datasets

    Keyword arguments:
    url -- the url to get the data
    id_dataset -- the id of the dataset to push data every hour
    """
    to_push = get_luftdaten(url)
    if to_push is not None:
        utils.ckan_upsert(ID_LUFTDATEN, to_push)
        push_to_hourly(id_dataset, to_push)


def get_luftdaten(url):
    """
    Get the data from the url

    Keyword arguments:
    url -- the url to get the data
    """
    records = utils.get_data(url, [])
    if records is not None:
        if len(records) != 0:
            to_push = keep_last_records(records)
            return to_push
        else:
            return None
    else:
        return None

def keep_last_records(records):
    """
    Only keep the last readings from the sensors of the data retrieved

    Keyword arguments:
    records -- the records taken from the API
    """
    updated_records = []
    location_ids = []
    sensor_ids = []
    both_ok = []
    records = records[::-1]
    for record in records:
        if ("sensor" in record) and ("location" in record):
            sensor = record["sensor"]
            location = record["location"]
            if location["id"] not in location_ids:
                location_ids.append(location["id"])
                sensor_ids.append(sensor["id"])
                both_ok.append(False)
                updated_records.append(record)
            else:
                position = location_ids.index(location["id"])
                if (sensor_ids[position] != sensor["id"]) and (not both_ok[position]):
                    updated_record = updated_records[position]
                    sensordatavalues = record["sensordatavalues"]
                    for item in sensordatavalues:
                        updated_record["sensordatavalues"].append(item)
                    both_ok[position] = True
                    updated_records[position] = updated_record
    if len(updated_records) != 0:
        to_push = transform_luftdaten(updated_records)
        return to_push
    else:
        return None

def transform_luftdaten(records):
    """
    Transform the data to records that can be pushed in the Luftdaten dataset

    Keyword arguments:
    records -- the records taken from the API
    """
    to_return = []
    new_record = {}
    for record in records:
        new_record = {}
        if ("id" in record) and ("sensordatavalues" in record) and ("sensor" in record) and \
            ("location" in record):
            location = record["location"]
            sensordatavalues = record["sensordatavalues"]
            new_record["recordid"] = str(record["id"])
            if "timestamp" in record:
                new_record["date_time"] = datetime.strptime(record["timestamp"],
                                                            '%Y-%m-%d %H:%M:%S') \
                                                  .strftime("%Y-%m-%dT%H:%M:%S")
            if ("longitude" in location) and ("latitude" in location) and ("altitude" in location):
                geo_json = {
                    "type": "Point",
                    "coordinates": [
                        float(location["longitude"]),
                        float(location["latitude"]),
                        float(location["altitude"])
                    ]
                }
                new_record["geojson"] = geo_json
            for data_value in sensordatavalues:
                if data_value["value_type"] == "humidity":
                    new_record["rh"] = float(data_value["value"])
                elif data_value["value_type"] == "temperature":
                    new_record["temperature"] = float(data_value["value"])
                elif data_value["value_type"] == "P1":
                    new_record["pm10"] = float(data_value["value"])
                elif data_value["value_type"] == "P2":
                    new_record["pm25"] = float(data_value["value"])
            to_return.append(new_record)
    return to_return

def push_to_hourly(id_dataset, records):
    """
    Push the data every hour to the aggregated dataset

    Keyword arguments:
    id_dataset -- the id of the dataset where to push data
    records -- records that were pushed to the Luftdaten dataset
    """
    for record in records:
        record["dataset_id"] = ID_LUFTDATEN
        record["dataset_name"] = "luftdaten"
    utils.ckan_upsert(id_dataset, records)

############################################
