#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
This module imports data from defra
and pushes it in the defra dataset
and the aggregated air pollution datasets.
"""

import uuid
from datetime import datetime
import logging
from utility import utils

LOGGER = logging.getLogger('ckan_import_default_log')


def isfloat(value):
    try:
        float(value)
        return True
    except ValueError:
        return False


def get_daily_data(id_dataset, files_folder, id_defra_aurn, stations):
    """
    Get Defra data every day and push to the necessary datasets

    Keyword arguments:
    id_dataset -- the id of the dataset to push data every day
    files_folder -- folder of the files
    id_defra_aurn -- id of the aurn dataset
    stations --  stations to check (files to check in folder)
    """
    push_aurn(id_dataset, files_folder, id_defra_aurn, stations)

####### DEFRA AURN ########


def push_aurn(id_dataset, files_folder, id_defra_aurn, stations):
    """
    Push AURN data to the necessary datasets

    Keyword arguments:
    id_dataset -- the id of the dataset to push data every day
    files_folder -- folder of the files
    id_defra_aurn -- id of the aurn dataset
    stations --  stations to check (files to check in folder)
    """
    for file_aurn in stations:
        to_push = get_aurn(file_aurn, files_folder)
        if to_push is not None:
            utils.ckan_upsert(id_defra_aurn, to_push)
            push_to_daily(id_dataset, to_push, id_defra_aurn)


def get_aurn(file_aurn, files_folder):
    """
    Get the data from the csv file

    Keyword arguments:
    file -- name of the csv file in the defra_imports folder
    files_folder -- folder of the files
    """
    records = utils.get_defra_data(file_aurn, files_folder)
    if records is not None:
        if (len(records) > 1):
            to_push = transform_aurn(records)
            return to_push
        else:
            LOGGER.warning("Records imported from Defra are empty")
            return None
    else:
        LOGGER.warning("Records imported from Defra are NONE")
        return None


def transform_aurn(records):
    """
    Transform the data to records that can be pushed in the AURN dataset

    Keyword arguments:
    records -- the records taken from the csv file
    """
    to_return = []
    keys = []
    new_record = {}
    wait_record = {}
    first_row = True
    second_row = True
    add_record = False
    new_record["recordid"] = str(uuid.uuid4())
    geo_json = {
        "type": "Point",
                "coordinates": [None, None]
    }
    for record in records:
        if (first_row):
            first_row = False
            keys = record
        else:
            if (len(keys) == len(record)):
                if (second_row):
                    second_row = False
                    for k in range(len(keys)):
                        if record[k] != None:
                            if (keys[k] == 'date'):
                                new_record["day"] = record[k].split()[0]
                            elif (keys[k] == 'code'):
                                if "location" in new_record:
                                    new_record["location"] += " "+record[k]
                                else:
                                    new_record["location"] = record[k]
                            elif (keys[k] == 'site'):
                                if "location" in new_record:
                                    new_record["location"] += " "+record[k]
                                else:
                                    new_record["location"] = record[k]
                            elif (keys[k] == 'site.type'):
                                if "location" in new_record:
                                    new_record["location"] += " "+record[k]
                                else:
                                    new_record["location"] = record[k]
                            elif (keys[k] == "longitude"):
                                geo_json["coordinates"][0] = record[k]
                            elif (keys[k] == "latitude"):
                                geo_json["coordinates"][1] = record[k]

                for i in range(len(keys)):
                    if record[i] != None:
                        if isfloat(record[i]):
                            if (record[i] != '0'):
                                add_record = True
                                if (keys[i] == 'no'):
                                    if "no" in wait_record:
                                        wait_record["no"].append(
                                            float(record[i]))
                                    else:
                                        wait_record["no"] = []
                                        wait_record["no"].append(
                                            float(record[i]))
                                elif (keys[i] == 'no2'):
                                    if "no2" in wait_record:
                                        wait_record["no2"].append(
                                            float(record[i]))
                                    else:
                                        wait_record["no2"] = []
                                        wait_record["no2"].append(
                                            float(record[i]))
                                elif (keys[i] == 'nox'):
                                    if "nox" in wait_record:
                                        wait_record["nox"].append(
                                            float(record[i]))
                                    else:
                                        wait_record["nox"] = []
                                        wait_record["nox"].append(
                                            float(record[i]))
                                elif (keys[i] == 'pm25'):
                                    if "pm10" in wait_record:
                                        wait_record["pm10"].append(
                                            float(record[i]))
                                    else:
                                        wait_record["pm10"] = []
                                        wait_record["pm10"].append(
                                            float(record[i]))            
                                elif (keys[i] == 'pm10'):
                                    if "pm10" in wait_record:
                                        wait_record["pm10"].append(
                                            float(record[i]))
                                    else:
                                        wait_record["pm10"] = []
                                        wait_record["pm10"].append(
                                            float(record[i]))
                                elif (keys[i] == 'ws'):
                                    if "ws" in wait_record:
                                        wait_record["ws"].append(
                                            float(record[i]))
                                    else:
                                        wait_record["ws"] = []
                                        wait_record["ws"].append(
                                            float(record[i]))
                                elif (keys[i] == 'wd'):
                                    if "wd" in wait_record:
                                        wait_record["wd"].append(
                                            float(record[i]))
                                    else:
                                        wait_record["wd"] = []
                                        wait_record["wd"].append(
                                            float(record[i]))
    for key, key_list in wait_record.items():
        new_record[key] = sum(key_list)/float(len(key_list))
    new_record["geojson"] = geo_json
    to_return.append(new_record)
    if add_record:
        return to_return
    else:
        return None


def push_to_daily(id_dataset, records, id_defra_aurn):
    """
    Push the data every day to the aggregated dataset

    Keyword arguments:
    id_dataset -- the id of the dataset where to push data
    id_defra_aurn -- id of the aurn dataset
    """
    for record in records:
        record["dataset_id"] = id_defra_aurn
        record["dataset_name"] = "automatic-urban-and-rural-network-aurn"
    utils.ckan_upsert(id_dataset, records)

############################################
