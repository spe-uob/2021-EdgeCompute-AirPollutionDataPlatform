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
    logging.basicConfig(filename="/home/kevin/import_scripts/logs/ckan.import.default.log",
                        filemode='a',
                        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                        datefmt='%Y-%m-%dT%H:%M:%S')
    logger = logging.getLogger(name)
    return logger
