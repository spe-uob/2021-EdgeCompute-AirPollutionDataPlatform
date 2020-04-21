# Setting up the CKAN Database

## Install Other packages requirements

```shell
apt-get install python3-pip
pip3 install requests ckanapi
pip3 install python-dateutil
```

### Install R for AURN Database

Add the [Ubuntu Packages for R](https://cran.r-project.org/bin/linux/ubuntu/README.html) Repo for the latest R.

Install the [OpenAir Package](http://www.openair-project.org/GettingStarted/Default.aspx) by

```shell
sudo R
install.packages('openair')
```

## Install CKAN Database

Refer [Installing CKAN](https://docs.ckan.org/en/2.8/maintaining/installing/index.html)

## Setup CKAN Sysadmin User

Refer [Getting Started](https://docs.ckan.org/en/2.8/maintaining/getting-started.html)

## Enable DataStore Extension

Refer [DataStore Extension](https://docs.ckan.org/en/2.8/maintaining/datastore.html)

## Creating Groups/ Organisation/ Dataset/ Resource - From CKAN GUI

This can also be done using Python Script

Group is quite similar to regions or areas and depends on what scale, we want to seperate the latest records.

Groups can be created by following

```shell
CKAN Homepage > Groups > Add Group
```

```shell
Bristol Group
```

Currently, we have created a group named Bristol.

### Creating Organisations - From CKAN GUI

Organisation are equivalent to different organization (or from where the data is coming).

If it is units or a mix of the records (latest records datasets). We can create a group called `Main Repository`.

Currently, we gather data from the below sources

#### Defra

#### Luftdaten

#### Open Data Bristol

#### Smart Citizen

#### Main Repositry

Organisation to Group the above data.

So, currently, it looks like

```shell
Bristol -- Group
|
| --------> Organisations (From where the data comes)
---> Defra
---> Luftdaten
---> Open Data Bristol
---> Smart Citizen
---> Main Repositry
```

### Create Datasets - From CKAN GUI

Now, we need to create datasets from CKAN - GUI

IMPORTANT: If you are doing the setup using GUI, We need to provide an initial data file to be able to finish the creation of the dataset. A simple small json file or csv file could be used so that the import is fast.

#### DEFRA

DEFRA Organisation would have one dataset

1. Automatic Urban and Rural Network (AURN)

#### Luftdaten

Luftdaten Organisation would have one dataset

1. Luftdaten

#### Smart Citizen Kit

SCK Organisation would have one dataset

1. Smart Citizen Kit

#### Open Data Bristol

ODB would have 5 datasets

1. Wards
2. Air Quality (NO2 diffusion tube) data
3. Car Availability Data (By Ward)
4. Population Estimates
5. Air Quality Data Continous

#### Main Repository

Main Repo would contain two datasets

1. Reading Units - Units of the reading of the different datasets in the CKAN data platform.
2. Air Pollution Data - Bristol and Bath : Aggregation of data from all datasets in one dataset to simplify the imports. Only the last readings are kept here because only these are necessary for the primary function of the website.

If we want to add more dataset e.g Greater London, we can do it here.

## Clone the Air Pollution Data Git Repo

Clone the [Air Pollution Data Git Repo](https://github.com/bitvijays/AirPollutionDataPlatform)

```shell
git clone https://github.com/bitvijays/AirPollutionDataPlatform.git
```

### Prepare the Config

Change directory to

```shell
cd ~/AirPollutionDataPlatform/ckan_data_imports
```

and edit `utility/config.py`

The `apikey` in the below line needs to be changed with the `apikey` of the admin profile on the CKAN website.

```python
apikey = "def41a89-8b9f-4225-9637-b9a015aa4546"
```

### Create Organisations

Edit `utility/init_ckan.py`

In the function `create_org`

```python
utils.ckan_create_org("Title","Name","Description","image_url")
```

Provide the parameters as the function and uncomment the unrequired function.

Comment the other called functions in the `init_ckan`

```python
def init_ckan():
    create_org()
#   create_package()
#   create_resource()
```

Once, the organisations, you require are defined in the `create_org` function and the other functions are commented in the `init_ckan` function.

Do,

```shell
python3 main.py init
```

This would call the `init_ckan.init()` function which would call the `create_org` function, which would create the organisations.

Running the above command would provide you the `organisation_id` for the organisations created.

```python
{'org_id_main': 'ab6995bc-b8cf-404d-b0e0-7666913e378b', 'org_id_odb': '41e37dc3-ebc7-41bc-afb6-83162b26e0ad', 'org_id_luftdaten': '2644b7c5-e9d7-4529-b39a-a18f62de38f8', 'org_id_sck': '13c0cdf9-2c74-4157-a9fd-980928a0ebe1', 'org_id_defra': 'ecc9ae47-7337-4d3f-9fad-d4f6fd6bd201'}
```

We would need the `organisation_id` to create the datasets, so copy the organisation id created above and paste it in the `create_package` function.

### Create Packages/ Datasets

`Create_package` function would create the packages defined

```python
utils.ckan_create_dataset("Title","Name","Private","Datasource URL","owner_org")
```

A sample function is

```python
      dataset_id_defra = utils.ckan_create_package("Automatic Urban and Rural Network", "automatic-urban-and-rural-network-aurn", False, "http://uk-air.defra.gov.uk/data/", org_id_defra)
```

which would create a Dataset with title `Automatic Urban and Rural Network` and name `automatic-urban-and-rural-network-aurn` as a `Public` dataset with datasource url as `http://uk-air.defra.gov.uk` in the organisation of `Defra` (Created using `create_org` function.)

### Create Resources

Now, inside a dataset, there can be multiple resources. In this project, it is a PostgreSQL table from the DataStore, but it could also be a JSON or CSV file. In the case of a PostgreSQL table, a dataset has a set of fields (the columns of the table;) and contains a list of records (the rows of the table). Resources and packages are identified with IDs.

To create a resource in a dataset of a particular organisation.

#### GUI Way

Visit CKAN GUI > Organisations > Select Particular Organisation > Select Particular Dataset > Select the "Random Data Resource" which we create while creating the package. In the additional information, we would find the Package ID

```shell
id 40906d6d-0f12-470e-850a-840b4c9f025d
package id 53ad3894-dfb9-4987-b5a8-63de6c59e887
revision id 93f09b86-65cd-4892-9a53-5dac6b4500be
```

Copy that package it and copy that in `create_dataset.py` in line

```python
try:
    utils.ckan_create_resource("<Insert Package ID here>", smart_citizen_fields_data, ["recordid"])
    print("done")
except Exception as exception_returned:
    print(exception_returned)
```

The four parameters are:

- AS A STRING: the ID of the package retrieved (`PACKAGE_ID`)
- Name for the resource
- AS A LIST of dictionnaries : the list of fields of the parameters that are going to be in that resource. We have created a lot of those lists and advised to use those. The variables describing those lists are just above the try-except block.
- AS A LIST of STRING: the primary fields (primary key) of the resource we are creating. It is usually "recordid" but not always!. The primary fields are probably indicated on the website.

Example of a request:

```python
utils.ckan_create_resource( dataset_id_defra,                     "Defra AURN Resource",                       var.defra_aurn_fields_data,                  ["recordid"])
```

It should notify success or error in the terminal.

Check on the website if the new created resource appears in the intended package.

Running the `create_resource` function the same way `python main.pu init` would create all the resources under the respective datasets and provide with the resource ID.

Copy the `resource_id` printed and copy it in the `config.py` in the utility folder

A sample below:

```python
dict_resource_id = {'resource_id_defra': '13842986-d7d0-4f9c-8c53-db84b942e27f', 'resource_id_main_air_pollution_bristol_daily_point': '5d04cb24-3ccd-487e-8b77-b85f87a9cdb9', 'resource_id_main_air_pollution_bristol_yearly_polygon': '614cda15-3b0d-4638-9533-c85e91acf77a', 'resource_id_odb_air_continous': 'edfa9460-24d4-4d07-b19a-fb9c50b7e3cc', 'resource_id_main_air_pollution_bristol_necessary': '2d5f55e5-a02e-4c47-a035-5e86dcb66142','resource_id_sck': 'db48fe66-4223-4e42-93e7-17c9de6cd254', 'resource_id_luftdaten': 'e823b631-fa9f-4100-9cc7-a4e65ed14f31', 'resource_id_main_air_pollution_bristol_yearly_point': '31c02b9d-56df-4678-9812-74ed415cdba7', 'resource_id_main_air_pollution_bristol_hourly_point': '12b25365-55a8-4cf8-9dd7-77fff461feec', 'resource_id_odb_air_no2': '9c43c99b-e04b-45a2-81a4-431172ede58f', 'resource_id_odb_population': '7608066d-dda9-48bd-973b-f48ae44dcabd', 'resource_id_main_units': 'fd9f1067-43d8-4c69-b71a-3f3eb13bb67e', 'resource_id_odb_wards': '1b74a32e-33c9-4f0a-9d3c-a2ddaf713481', 'resource_id_odb_cars': '01d7a1f8-0dd5-4592-8bb3-478fb895ff18'}
```

## Insert Reading Units in Reading Units Resource

At one point we will have to create the units package and resource. We need to insert data into Reading unit resource. To do so, use the units.py file:

- [OPTIONAL] add the units you want in the dictionnaries if you want to add new ones, you don't need to add anything if you are just trying to reproduce what we did first.
- There are two list of dictionaries: one for the units of the data recorded at one point, one for the units of the data recorded in a polygon like population for example.

## Insert Necessary Fields in "Air Pollution Data - City"

We need to create a resource `necessary_fields` in the package containing the latest data (called Air Pollution Data - Bristol & Bath Area OR/AND Air Pollution Data - Greater London). These resource contains the fields that the website will have to at least look for to present to the end user.

To do the above, just run

```shell
python main.py units
```

which would create the Reading Units and the Necessary Fields

## Setup CronJobs

```shell
30 3 * * 0 > /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/logs/ckan.import.default.log
30 4 1 * * > /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/logs/ckan.import.error.log
0 * * * * /usr/bin/python3 /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/main.py "hour" >> /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/logs/ckan.import.default.log 2>> /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/logs/ckan.import.error.log
15 0 1 1 * /usr/bin/python3 /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/main.py "year" >> /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/logs/ckan.import.default.log 2>> /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/logs/ckan.import.error.log
20 4 * * * /usr/bin/Rscript /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/plugins/defra_aurn_imports/defra_aurn_import.R >> /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/logs/ckan.import.default.log 2>> /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/logs/ckan.import.error.log
40 4 * * * /usr/bin/python3 /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/main.py "day" >> /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/logs/ckan.import.default.log 2>> /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/logs/ckan.import.error.log
```
