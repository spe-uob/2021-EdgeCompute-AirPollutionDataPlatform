#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
This module inserts data into the units datasets
"""

import log_config
import utils

LOGGER = log_config.setup_logger('ckan_import_default_log')

ID_UNITS = "10df8c8d-f681-4325-bf75-21064ba81a2f"

RECORDS_POINT = [
    {
        "reading": "pm1",
        "unit": "μg/m3"
    }, {
        "reading": "pm25",
        "unit": "μg/m3"
    }, {
        "reading": "pm10",
        "unit": "μg/m3"
    }, {
        "reading": "no",
        "unit": "μg/m3"
    }, {
        "reading": "nox",
        "unit": "μg/m3"
    }, {
        "reading": "no2",
        "unit": "μg/m3"
    }, {
        "reading": "o3",
        "unit": "μg/m3"
    }, {
        "reading": "co",
        "unit": "μg/m3"
    }, {
        "reading": "temperature",
        "unit": "°C"
    }, {
        "reading": "rh",
        "unit": "%"
    }, {
        "reading": "tvoc",
        "unit": "ppb"
    }, {
        "reading": "eCO2",
        "unit": "ppm"
    }, {
        "reading": "light",
        "unit": "Lux"
    }, {
        "reading": "noise",
        "unit": "dB"
    }, {
        "reading": "pressure",
        "unit": "KPa"
    }, {
        "reading": "battery",
        "unit": "%"
    }, {
        "reading": "wd",
        "unit": "°"
    }, {
        "reading": "ws",
        "unit": "m/s"
    }
]

RECORDS_POLYGON = [
    {
        "reading": "population_estimate",
        "unit": None
    }, {
        "reading": "average_number_of_cars_per_household",
        "unit": None
    }, {
        "reading": "number_of_cars_or_vans_in_the_area",
        "unit": None
    }, {
        "reading": "all_households",
        "unit": None
    }, {
        "reading": "no_cars_or_vans_in_household",
        "unit": None
    }, {
        "reading": "per_of_households_with_no_car",
        "unit": "%"
    }, {
        "reading": "1_car_or_van_in_household",
        "unit": None
    }, {
        "reading": "per_of_households_with_1_car",
        "unit": "%"
    }, {
        "reading": "2_cars_or_vans_in_household",
        "unit": None
    }, {
        "reading": "per_of_households_with_2_cars",
        "unit": "%"
    }, {
        "reading": "3_cars_or_vans_in_household",
        "unit": None
    }, {
        "reading": "per_of_households_with_3_cars",
        "unit": "%"
    }, {
        "reading": "4_or_more_cars_or_vans_in_household",
        "unit": None
    }, {
        "reading": "per_of_households_with_4_or_more_cars",
        "unit": "%"
    }
]

try:
    #utils.ckan_upsert(ID_UNITS, RECORDS_POINT)
    #utils.ckan_upsert(ID_UNITS, RECORDS_POLYGON)
except Exception as exception_returned:
    print(exception_returned)
