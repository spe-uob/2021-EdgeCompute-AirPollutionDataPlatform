#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
This module handles logging
"""

import logging

def setup_logger(name):
    """
    customize logger

    Keyword arguments:
    name -- name of the logger
    """
    logging.basicConfig(filename="/home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/logs/ckan.import.default.log",
                        filemode='a',
                        format='%(asctime)s - %(filename)s - %(funcName)s - %(levelname)s - %(message)s',
                        datefmt='%Y-%m-%dT%H:%M:%S',
                        level=logging.INFO)
    logger = logging.getLogger(name)
    return logger
