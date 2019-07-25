#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
This script was made in order
to be able to create a dataset
in a package
"""

import utils

# AIR QUALITY CONTINUOUS DATA

recordid = {'id': 'recordid',
            'type': 'text',
            "info": {
                    "label": "Record ID",
                    "notes": "ID of the record"
            }
            }
date_time = {'id': 'date_time',
             'type': 'timestamp',
             "info": {
                 "label": "Date Time",
                 "notes": "Time of the record"
             }
             }
geojson = {'id': 'geojson',
           'type': 'json',
           "info": {
               "label": "Position of the record",
               "notes": "JSON positioning of the record with longitude and latitude"
           }
           }
pm25 = {'id': 'pm25',
        'type': 'float',
        "info": {
            "label": "PM2.5",
            "notes": "PM2.5 Concetration"
        }
        }
pm10 = {'id': 'pm10',
        'type': 'float',
        "info": {
            "label": "PM10",
            "notes": "PM10 Concetration"
        }
        }
no = {'id': 'no',
      'type': 'float',
      "info": {
            "label": "NO",
            "notes": "NO Concetration"
      }
      }
nox = {'id': 'nox',
       'type': 'float',
       "info": {
           "label": "NOx",
           "notes": "NOx Concentration"
       }
       }
no2 = {'id': 'no2',
       'type': 'float',
       "info": {
           "label": "NO2",
           "notes": "NO2 Concetration"
       }
       }
o3 = {'id': 'o3',
      'type': 'float',
      "info": {
            "label": "O3",
            "notes": "O3 Concetration"
      }
      }
temperature = {'id': 'temperature',
               'type': 'float',
               "info": {
                   "label": "Temperature",
                   "notes": "Temperature"
               }
               }
rh = {'id': 'rh',
      'type': 'float',
      "info": {
            "label": "Relative Humidity",
            "notes": "Relative Humidity"
      }
      }
location = {'id': 'location',
            'type': 'text',
            "info": {
                "label": "Location",
                "notes": "Name of the location"
            }
            }
siteid = {'id': 'siteid',
          'type': 'int',
          "info": {
              "label": "Site ID",
              "notes": "ID of the site"
          }
          }

# WARD

wardid = {'id': 'wardid',
          'type': 'text',
          "info": {
              "label": "Ward ID",
              "notes": "ID of the Ward"
          }
          }
ward_center = {'id': 'ward_center',
               'type': 'json',
               "info": {
                   "label": "Position of the ward center",
                   "notes": "JSON positioning of the record with longitude and latitude"
               }
               }
objectid = {'id': 'objectid',
            'type': 'int',
            "info": {
                "label": "Site ID",
                "notes": "ID of the site"
            }
            }
ward_name = {'id': 'ward_name',
             'type': 'text',
             "info": {
                 "label": "Ward Name",
                 "notes": "Name of the ward"
             }
             }

# CAR AVAILABILITY

average_number_of_cars_per_household = {'id': 'average_number_of_cars_per_household',
                                        'type': 'float',
                                        "info": {
                                            "label": "Average number of cars per household",
                                            "notes": "Average number of cars per household"
                                        }
                                        }
number_of_cars_or_vans_in_the_area = {'id': 'number_of_cars_or_vans_in_the_area',
                                      'type': 'int',
                                      "info": {
                                          "label": "Number of cars or vans in the area",
                                          "notes": "Number of cars or vans in the area"
                                      }
                                      }
all_households = {'id': 'all_households',
                  'type': 'int',
                  "info": {
                      "label": "All houselholds",
                      "notes": "Number of houselholds"
                  }
                  }
no_cars_or_vans_in_household = {'id': 'no_cars_or_vans_in_household',
                                'type': 'int',
                                "info": {
                                    "label": "No cars or vans in houselhold",
                                    "notes": "Number of houselholds with no cars or no vans"
                                }
                                }
per_of_households_with_no_car = {'id': 'per_of_households_with_no_car',
                                 'type': 'float',
                                 "info": {
                                     "label": "Percentage of houselholds with no car",
                                     "notes": "Percentage of houselholds with no car"
                                 }
                                 }
one_car_or_van_in_household = {'id': '1_car_or_van_in_household',
                               'type': 'int',
                               "info": {
                                   "label": "One car or van in houselhold",
                                   "notes": "Number of houselholds with one car or van"
                               }
                               }
per_of_households_with_1_car = {'id': 'per_of_households_with_1_car',
                                'type': 'float',
                                "info": {
                                    "label": "Percentage of houselholds with one car",
                                    "notes": "Percentage of houselholds with one car"
                                }
                                }
two_cars_or_vans_in_household = {'id': '2_cars_or_vans_in_household',
                                 'type': 'int',
                                 "info": {
                                     "label": "Two cars or vans in houselhold",
                                     "notes": "Number of houselholds with two cars or vans"
                                 }
                                 }
per_of_households_with_2_cars = {'id': 'per_of_households_with_2_cars',
                                 'type': 'float',
                                 "info": {
                                     "label": "Percentage of houselholds with two cars",
                                     "notes": "Percentage of houselholds with two cars"
                                 }
                                 }
three_cars_or_vans_in_household = {'id': '3_cars_or_vans_in_household',
                                   'type': 'int',
                                   "info": {
                                       "label": "Three cars or vans in houselhold",
                                       "notes": "Number of houselholds with three cars or vans"
                                   }
                                   }
per_of_households_with_3_cars = {'id': 'per_of_households_with_3_cars',
                                 'type': 'float',
                                 "info": {
                                     "label": "Percentage of houselholds with three cars",
                                     "notes": "Percentage of houselholds with three cars"
                                 }
                                 }
four_or_more_cars_or_vans_in_household = {'id': '4_or_more_cars_or_vans_in_household',
                                          'type': 'int',
                                          "info": {
                                              "label": "Four cars or vans in houselhold",
                                              "notes": "Number of houselholds with four cars or vans"
                                          }
                                          }
per_of_households_with_4_or_more_cars = {'id': 'per_of_households_with_4_or_more_cars',
                                         'type': 'float',
                                         "info": {
                                             "label": "Percentage of houselholds with four cars or more",
                                             "notes": "Percentage of houselholds with four cars or more"
                                         }
                                         }

# NO2 DIFFUSION TUBE

year = {'id': 'year',
        'type': 'int',
        "info": {
            "label": "Year",
            "notes": "Year"
        }
        }
readings_count = {'id': 'readings_count',
                  'type': 'int',
                  "info": {
                      "label": "Readings count",
                      "notes": "Number of readings"
                  }
                  }

# POPULATION ESTIMATE

lsoa11_code = {'id': 'lsoa11_code',
               'type': 'text',
               "info": {
                   "label": "LSOA11 Code",
                   "notes": "LSOA11 Code"
               }
               }
lsoa11_local_name = {'id': 'lsoa11_local_name',
                     'type': 'text',
                     "info": {
                         "label": "LSOA11 Local name",
                         "notes": "LSOA11 Local name"
                     }
                     }
population_estimate = {'id': 'population_estimate',
                       'type': 'int',
                       "info": {
                           "label": "Population estimate",
                           "notes": "Population estimate"
                       }
                       }

# SMART CITIZEN KITS

deviceid = {'id': 'deviceid',
            'type': 'text',
            "info": {
                "label": "Device ID",
                "notes": "ID of the SCK"
            }
            }
tvoc = {'id': 'tvoc',
        'type': 'float',
        "info": {
            "label": "TVOC",
            "notes": "Total Volatile Organic Compounds Digital Indoor Sensor"
        }
        }
eCO2 = {'id': 'eCO2',
        'type': 'float',
        "info": {
            "label": "eCO2",
            "notes": "Equivalent Carbon Dioxide Digital Indoor Sensor"
        }
        }
light = {'id': 'light',
         'type': 'float',
         "info": {
             "label": "Ambient Light",
             "notes": "Digital Ambient Light Sensor"
         }
         }
battery = {'id': 'battery',
           'type': 'float',
           "info": {
               "label": "Battery",
               "notes": "Battery SCK 1.1"
           }
           }
noise = {'id': 'noise',
         'type': 'float',
         "info": {
             "label": "Noise Microphone",
             "notes": "I2S Digital Mems Microphone with custom Audio Processing Algorithm"
         }
         }
pressure = {'id': 'pressure',
            'type': 'float',
            "info": {
                "label": "Barometric Pressure",
                "notes": "Digital Barometric Pressure Sensor"
            }
            }
pm1 = {'id': 'pm1',
       'type': 'float',
       "info": {
           "label": "Particle Matter PM 1",
           "notes": "Particle Matter PM 1"
       }
       }
co = {'id': 'co',
      'type': 'float',
      "info": {
            "label": "CO",
            "notes": "Carbon monoxyde"
      }
      }

# UNITS
reading = {'id': 'reading',
           'type': 'text',
           "info": {
               "label": "Reading name",
               "notes": "Name of the reading"
           }
           }
unit = {'id': 'unit',
        'type': 'text',
        "info": {
            "label": "Unit",
            "notes": "Unit of the reading"
        }
        }

# AIR POLLUTION AGGREGATION
dataset_name = {'id': 'dataset_name',
                'type': 'text',
                "info": {
                    "label": "Dataset name",
                    "notes": "Name of the dataset the data comes from"
                }
                }
dataset_id = {'id': 'dataset_id',
              'type': 'text',
              "info": {
                  "label": "Dataset ID",
                  "notes": "ID of the dataset the data comes from"
              }
              }

# OPEN BRISTOL DATA
air_quality_data_continuous_fields_data = [
    recordid, date_time, geojson, pm25, pm10,
    no, nox, no2, o3, temperature, rh,
    location, siteid]
wards_fields_data = [wardid, geojson, ward_center,
                     ward_name, objectid, recordid, date_time]
car_availability_fields_data = [recordid, wardid, ward_name,
                                date_time, average_number_of_cars_per_household,
                                number_of_cars_or_vans_in_the_area,
                                all_households,
                                no_cars_or_vans_in_household,
                                per_of_households_with_no_car,
                                one_car_or_van_in_household,
                                per_of_households_with_1_car,
                                two_cars_or_vans_in_household,
                                per_of_households_with_2_cars,
                                three_cars_or_vans_in_household,
                                per_of_households_with_3_cars,
                                four_or_more_cars_or_vans_in_household,
                                per_of_households_with_4_or_more_cars]
no2_fields_data = [recordid, year, geojson,
                   no2, readings_count,
                   location, siteid]
population_estimate_fields_data = [
    recordid, lsoa11_code, lsoa11_local_name,
    ward_name, year, geojson, population_estimate]

# LUTDATEN
luftdaten_fields_data = [recordid, date_time,
                         geojson, pm25, pm10,
                         temperature, rh]

# SMART CITIZEN KITS
smart_citizen_fields_data = [deviceid, date_time, geojson, tvoc, eCO2,
                             light, battery, noise, pressure, pm1,
                             pm25, pm10, no2, co, rh, temperature]

# UNITS
units_fields_data = [reading, unit]

# AIR POLLUTION HOURLY AGGREGATION
hourly_point_aggregation_fields_data = [recordid, date_time, geojson,
                                        dataset_name, dataset_id, pm1, pm25,
                                        pm10, no, nox, no2, co, o3,
                                        temperature, rh, tvoc, eCO2, light,
                                        battery, noise, pressure, location,
                                        siteid]

# AIR POLLUTION YEARLY POLYGON AGGREGATION
yearly_polygon_aggregation_fields_data = [recordid, year, geojson, dataset_name,
                                          dataset_id, wardid, ward_center,
                                          ward_name, objectid,
                                          lsoa11_code, lsoa11_local_name,
                                          population_estimate,
                                          average_number_of_cars_per_household,
                                          number_of_cars_or_vans_in_the_area,
                                          all_households, no_cars_or_vans_in_household,
                                          per_of_households_with_no_car,
                                          one_car_or_van_in_household,
                                          per_of_households_with_1_car,
                                          two_cars_or_vans_in_household,
                                          per_of_households_with_2_cars,
                                          three_cars_or_vans_in_household,
                                          per_of_households_with_3_cars,
                                          four_or_more_cars_or_vans_in_household,
                                          per_of_households_with_4_or_more_cars]

# AIR POLLUTION YEARLY POINT AGGREGATION
yearly_point_aggregation_fields_data = [
    recordid, year, geojson, dataset_name, dataset_id, no2,
    readings_count, location, siteid]

try:
    #utils.ckan_create_from_scratch("", "", [])
    #utils.ckan_create_after_delete("", "", [])
    #utils.ckan_delete("", {})
    print("done")
except Exception as exception_returned:
    print(exception_returned)
