#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
This module removes data from a dataset
and create the structure of the dataset again
(which is necessary due to a bug from CKAN)
"""

import logging
import utils

LOGGER = logging.getLogger('ckan_import_default_log')

def rmv_and_create_dataset_back(id_dataset, fields_data, primary_keys):
    """
    Remove all data from the dataset and recreate the structure of the dataset

    Keyword arguments:
    id_dataset -- id of the dataset
    fields_data -- fields of the dataset
    primary_keys -- list of primary keys for the dataset
    """
    utils.ckan_delete(id_dataset, {})
    utils.ckan_create_after_delete(id_dataset, fields_data, primary_keys)
    
