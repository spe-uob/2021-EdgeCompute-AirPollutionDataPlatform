# Variables to store variables

aurn_files_folder = "/home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/plugins/defra_aurn_imports/"
apikey = "def41a89-8b9f-4225-9637-b9a015aa4546"

dict_resource_id = {'resource_id_defra': '13842986-d7d0-4f9c-8c53-db84b942e27f', 'resource_id_main_air_pollution_bristol_daily_point': '5d04cb24-3ccd-487e-8b77-b85f87a9cdb9', 'resource_id_main_air_pollution_bristol_yearly_polygon': '614cda15-3b0d-4638-9533-c85e91acf77a', 'resource_id_odb_air_continous': 'edfa9460-24d4-4d07-b19a-fb9c50b7e3cc', 'resource_id_main_air_pollution_bristol_necessary': '2d5f55e5-a02e-4c47-a035-5e86dcb66142','resource_id_sck': 'db48fe66-4223-4e42-93e7-17c9de6cd254', 'resource_id_luftdaten': 'e823b631-fa9f-4100-9cc7-a4e65ed14f31', 'resource_id_main_air_pollution_bristol_yearly_point': '31c02b9d-56df-4678-9812-74ed415cdba7', 'resource_id_main_air_pollution_bristol_hourly_point': '12b25365-55a8-4cf8-9dd7-77fff461feec', 'resource_id_odb_air_no2': '9c43c99b-e04b-45a2-81a4-431172ede58f', 'resource_id_odb_population': '7608066d-dda9-48bd-973b-f48ae44dcabd', 'resource_id_main_units': 'fd9f1067-43d8-4c69-b71a-3f3eb13bb67e', 'resource_id_odb_wards': '1b74a32e-33c9-4f0a-9d3c-a2ddaf713481', 'resource_id_odb_cars': '01d7a1f8-0dd5-4592-8bb3-478fb895ff18'}

## Areas where we are doing the Air Pollutino Monitoring

AREAS = [
    {
        "name": "Bristol",
        "last_records": {
            "necessary_fields": dict_resource_id["resource_id_main_air_pollution_bristol_necessary"],
            "point_ids": {
                "yearly": dict_resource_id["resource_id_main_air_pollution_bristol_yearly_point"],
                "daily": dict_resource_id["resource_id_main_air_pollution_bristol_daily_point"],
                "hourly": dict_resource_id["resource_id_main_air_pollution_bristol_hourly_point"]

            },
            "polygon_ids": {
                "yearly": dict_resource_id["resource_id_main_air_pollution_bristol_yearly_polygon"]
            }
        },
        "hour": {
            "luftdaten": {
                "url": "http://api.luftdaten.info/v1/filter/area=51.454762,-2.597043,25",
                "id": dict_resource_id["resource_id_luftdaten"]
            },
            "sck": {
                "url": "https://api.smartcitizen.me/v0/devices",
                "id": dict_resource_id["resource_id_sck"],
                "geohashes": ["gcnh", "gcnj"],
                "center": "51.456074, -2.605626"
            },
            "open_data_bristol": {
                "url": "https://opendata.bristol.gov.uk/api/records/1.0/search/",
                "id_air_quality_data_continuous": dict_resource_id["resource_id_odb_air_continous"],
            }
        },
        "day": {
            "defra_aurn": {
                "files_folder": aurn_files_folder,
                "id": dict_resource_id["resource_id_defra"],
                "stations": ["brs8", "br11"]
            }
        },
        "year": {
            "open_data_bristol": {
                "url": "https://opendata.bristol.gov.uk/api/records/1.0/search/",
                "id_wards": dict_resource_id["resource_id_odb_wards"],
                "id_car_availability": dict_resource_id["resource_id_odb_cars"],
                "id_no2": dict_resource_id["resource_id_odb_air_no2"],
                "id_population_estimates": dict_resource_id["resource_id_odb_population"]
            }
        }
    }, 
]
