#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
This module has functions that can get data
from an API url and also push data into CKAN,
create CKAN datasets and delete them
"""

import csv
import requests
import ckanapi


REMOTE_CONTROL = ckanapi.RemoteCKAN(
    'http://localhost', apikey='7b470db5-0e89-4a02-90a9-6fcdab52a0d5')
DEFRA_AURN_FILES_FOLDER = "/home/kevin/import_scripts/defra_aurn_imports/"

def get_data(url_param, dataset_params):
    """
    Get data from url with params

    Keyword arguments:
    url_param -- url
    dataset_params -- params after the url
    """
    try:
        requested_data = requests.get(url=url_param, params=dataset_params)
        data = requested_data.json()
        if "error" in data:
            return None
        else:
            return data
    except Exception as exception_returned:
        print(exception_returned)
        return None

def get_defra_data(file):
    """
    Get data from csv file of defra

    Keyword arguments:
    file -- name of the file
    """
    try:
        with open(DEFRA_AURN_FILES_FOLDER+file) as file_opened:
            res = [{k: int(v) for \
                    k, v in row.items()} for \
                    row in csv.DictReader(file_opened, skipinitialspace=True)]
            reader = csv.DictReader(file_opened)
            list_read = list(reader)
            print(list_read)
        return res
    except Exception as exception_returned:
        print(exception_returned)
        return None

def ckan_insert(resource_id, records_data):
    """
    Insert data into dataset of CKAN

    Keyword arguments:
    resource_id -- id of resource dataset
    records_data -- data to insert
    """
    try:
        _ = REMOTE_CONTROL.action.datastore_upsert(resource_id=resource_id,
                                                   method="insert",
                                                   records=records_data,
                                                   calculate_record_count=True)
    except Exception as exception_returned:
        print(exception_returned)

def ckan_upsert(resource_id, records_data):
    """
    Upsert (inserts or updates if primary key exists) data into dataset of CKAN

    Keyword arguments:
    resource_id -- id of resource dataset
    records_data -- data to upsert
    """
    try:
        _ = REMOTE_CONTROL.action.datastore_upsert(resource_id=resource_id,
                                                   method="upsert",
                                                   records=records_data,
                                                   calculate_record_count=True)
    except Exception as exception_returned:
        print(exception_returned)

def ckan_delete(resource_id, filters):
    """
    Deletes data from dataset
    Put filters = {} to delete all data

    Keyword arguments:
    resource_id -- id of resource dataset
    filters -- filters to know what data to remove
    """
    try:
        _ = REMOTE_CONTROL.action.datastore_delete(resource_id=resource_id, filters=filters)
    except Exception as exception_returned:
        print(exception_returned)

def ckan_create_from_scratch(package_id, fields_data, primary_keys):
    """
    Create dataset from scratch

    Keyword arguments:
    package_id -- id of the package of datasets
    fields_data -- fields
    primary_keys -- list of fields name which are primary keys
    """
    try:
        _ = REMOTE_CONTROL.action.datastore_create(resource={'package_id':package_id},
                                                   fields=fields_data,
                                                   primary_key=primary_keys,
                                                   calculate_record_count=True)
    except Exception as exception_returned:
        print(exception_returned)

def ckan_create_after_delete(resource_id, fields_data, primary_keys):
    """
    Recreate the structure of the dataset after deleting all data inside.
    Necessary if deleted all the data from dataset.

    Keyword arguments:
    resource_id -- id of the resource dataset
    fields_data -- fields
    primary_keys -- list of fields name which are primary keys
    """
    try:
        _ = REMOTE_CONTROL.action.datastore_create(resource_id=resource_id,
                                                   fields=fields_data,
                                                   primary_key=primary_keys,
                                                   calculate_record_count=True)
    except Exception as exception_returned:
        print(exception_returned)
