#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
This module inserts data into the units datasets
"""

import utils

ID_UNITS_HOUR_POINT = "10df8c8d-f681-4325-bf75-21064ba81a2f"
ID_UNITS_DAY_POINT = ""
ID_UNITS_YEAR_POINT = "439b51f6-6d44-4106-a17e-46cb803158a7"
ID_UNITS_YEAR_POLYGON = "86ee6685-1c2a-46ce-adbe-59a91039b65f"

RECORDS_HOUR_POINT = [
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
    }
]

RECORDS_DAY_POINT = []

RECORDS_YEAR_POINT = [
    {
        "reading":"no2",
        "unit":"μg/m3"
    }
]
RECORDS_YEAR_POLYGON = [
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
    utils.ckan_upsert(ID_UNITS_HOUR_POINT, RECORDS_HOUR_POINT)
    #utils.ckan_upsert(ID_UNITS_DAY_POINT, RECORDS_DAY_POINT)
    utils.ckan_upsert(ID_UNITS_YEAR_POINT, RECORDS_YEAR_POINT)
    utils.ckan_upsert(ID_UNITS_YEAR_POLYGON, RECORDS_YEAR_POLYGON)
except Exception as exception_returned:
    print(exception_returned)
