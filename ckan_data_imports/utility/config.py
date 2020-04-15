# Variables to store variables

aurn_files_folder = "/home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/plugins/defra_aurn_imports/"

AREAS = [
    {
        "name": "Bristol",
        "last_records": {
            "necessary_fields": "b6e26b86-6b32-4b38-b672-3f513e5a6bd4",
            "point_ids": {
                "yearly": "00eb0180-0fe2-4a25-9137-7ca570d9efae",
                "daily": "74928f7f-5e25-43cf-8a94-d330ff1f2c03",
                "hourly": "565fa9e3-1644-44a5-aa38-5005b76cac24"

            },
            "polygon_ids": {
                "yearly": "80956db6-336c-4e12-aba4-fc52057d9d69"
            }
        },
        "hour": {
            "luftdaten": {
                "url": "http://api.luftdaten.info/v1/filter/area=51.454762,-2.597043,25",
                "id": "5239cbd6-563e-44d3-aea0-3bfe9e8f9c31"
            },
            "sck": {
                "url": "https://api.smartcitizen.me/v0/devices",
                "id": "011bfff3-24a4-4a09-80b1-97d1bd04395f",
                "geohashes": ["gcnh", "gcnj"],
                "center": "51.456074, -2.605626"
            },
            "open_data_bristol": {
                "url": "https://opendata.bristol.gov.uk/api/records/1.0/search/",
                "id_air_quality_data_continuous": "af64436f-5171-4d6e-a13e-8caeeb5d1a4c",
            }
        },
        "day": {
            "defra_aurn": {
                "files_folder": aurn_files_folder,
                "id": "0ceda6f1-9ce0-4a54-96f5-9651a612cd20",
                "stations": ["brs8", "br11"]
            }
        },
        "year": {
            "open_data_bristol": {
                "url": "https://opendata.bristol.gov.uk/api/records/1.0/search/",
                "id_wards": "b3464d18-23b3-407e-8a93-1b062ab8593b",
                "id_car_availability": "95c09bf9-6438-4e57-9af2-784359fd97a0",
                "id_no2": "a37a3f86-691e-4f7a-99c1-9225e40fb6bf",
                "id_population_estimates": "5d22da6d-eea3-4ebd-a769-555c92253191"
            }
        }
    }, 
]
