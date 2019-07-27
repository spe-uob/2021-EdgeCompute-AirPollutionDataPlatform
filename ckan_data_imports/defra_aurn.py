#!/usr/bin/env python

# from datetime import datetime

# import logging

# import utils


# LOGGER = logging.getLogger('ckan_import_default_log')

# ID_AURN = ""
# AURN_files = ["brs8.csv", "br11.csv"]

# def get_daily_data():
#     push_AURN(file)

# ####### DEFRA AURN ########

# def push_AURN(file):
#     for f in AURN_files:
#         toPush = get_AURN(f)
#         # if toPush is not None:
#         #     res = utils.ckanUpsert(ID_AURN, toPush)

# def get_AURN(file):
#     records = utils.getDefraData(file)
#     print(records)
#     return None
#     # if records is not None:
#     #     if (len(records) != 0):
#     #         toPush = transform_AURN(records)
#     #         return toPush
    #     else:
    #         LOGGER.warning("Records imported from Defra are empty")
    #         return None
    # else:
    #     LOGGER.error("Records imported from Defra are NONE")
    #     return None

# def transform_AURN(records):
#     toReturn = []
#     new_record = {}
#     for record in records:
#         new_record = {}
#         if ("id" in record) and ("sensordatavalues" in record) and ("sensor" in record) and ("location" in record):
#             location = record["location"]
#             sensordatavalues = record["sensordatavalues"]
#             new_record["recordid"] = str(record["id"])
#             if "timestamp" in record:
#                 new_record["date_time"] = datetime.strptime(record["timestamp"], '%Y-%m-%d %H:%M:%S').strftime("%Y-%m-%dT%H:%M:%S")
#             if ("longitude" in location) and ("latitude" in location) and ("altitude" in location):
#                 geo_json = {
#                     "type": "Point",
#                     "coordinates": [
#                         float(location["longitude"]),
#                         float(location["latitude"]),
#                         float(location["altitude"])
#                     ]
#                 }
#                 new_record["geojson"] = geo_json
#             for data_value in sensordatavalues:
#                 if data_value["value_type"] == "humidity":
#                     new_record["rh"] = float(data_value["value"])
#                 elif data_value["value_type"] == "temperature":
#                     new_record["temperature"] = float(data_value["value"])
#                 elif data_value["value_type"] == "P1":
#                     new_record["pm10"] = float(data_value["value"])
#                 elif data_value["value_type"] == "P2":
#                     new_record["pm25"] = float(data_value["value"])
#             toReturn.append(new_record)
#     return toReturn

# ############################################
