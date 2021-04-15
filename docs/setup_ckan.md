# Setting up the CKAN Database

## Step 1: Install Other packages requirements

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

## Step 2: Install CKAN Database

Refer [Installing CKAN](https://docs.ckan.org/en/2.8/maintaining/installing/index.html)

## Step 3: Setup CKAN Sysadmin User

Refer [Getting Started](https://docs.ckan.org/en/2.8/maintaining/getting-started.html)

## Step 4: Enable DataStore Extension

Refer [DataStore Extension](https://docs.ckan.org/en/2.8/maintaining/datastore.html)

## Step 5: Creating Groups/ Organisation/ Dataset/ Resource

There are two ways to perform this step either would do

1. GUI
2. Python script

### Step 5A: Via GUI

#### Step 5A-1 Creating Groups

Group is quite similar to regions or areas and depends on what scale, we want to seperate the latest records.

Groups can be created by following

```shell
CKAN Homepage > Groups > Add Group
```

```shell
Bristol Group
```

Currently, we have created a group named Bristol.

#### Step 5A-2 Creating Organisations

Organisation are equivalent to different organization (or from where the data is coming).

If it is units or a mix of the records (latest records datasets). We can create a group called `Main Repository`.

Currently, we gather data from the below sources

##### Defra

##### Luftdaten

##### Open Data Bristol

##### Smart Citizen

##### Main Repositry

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

#### Step 5A-3 Create Datasets

Now, we need to create datasets from CKAN - GUI

IMPORTANT: If you are doing the setup using GUI, We need to provide an initial data file to be able to finish the creation of the dataset. A simple small json file or csv file could be used so that the import is fast.

##### DEFRA

DEFRA Organisation would have one dataset

1. Automatic Urban and Rural Network (AURN)

##### Luftdaten

Luftdaten Organisation would have one dataset

1. Luftdaten

##### Smart Citizen Kit

SCK Organisation would have one dataset

1. Smart Citizen Kit

##### Open Data Bristol

ODB would have 5 datasets

1. Wards
2. Air Quality (NO2 diffusion tube) data
3. Car Availability Data (By Ward)
4. Population Estimates
5. Air Quality Data Continous

##### Main Repository

Main Repo would contain two datasets

1. Reading Units - Units of the reading of the different datasets in the CKAN data platform.
2. Air Pollution Data - Bristol and Bath : Aggregation of data from all datasets in one dataset to simplify the imports. Only the last readings are kept here because only these are necessary for the primary function of the website.

If we want to add more dataset e.g Greater London, we can do it here.

#### Step 5A-4 Create Resource

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

### Step 5B: Via python script

#### Step 5B-1 git clone Repo

Clone the Air Pollution Data Git Repo

Clone the [Air Pollution Data Git Repo](https://github.com/bitvijays/AirPollutionDataPlatform)

```shell
git clone https://github.com/bitvijays/AirPollutionDataPlatform.git
```

#### Step 5B-2 Prepare Config

The python script would require the admin API Key of the CKAN in order to have permissions to create the groups, organisations, dataset and resources.

Change directory to

```shell
cd ~/AirPollutionDataPlatform/ckan_data_imports
```

and edit `utility/config.py`

The `apikey` in the below line needs to be changed with the `apikey` of the admin profile on the CKAN website.

```python
apikey = "def41a89-8b9f-4225-9637-b9a015aa4546"
```

#### Step 5B-3 Analyse init_ckan.py

Take a momemt to analyse init_ckan.

There are four functions defined

1. create_org : used to create organisations
2. create_package : used to create packages
3. create_resource : used to create resources
4. init_ckan - which calls the above functions based on requirement

If you want to add new data sources, based on what you want, we can use the above functions.

We will use the above funtions one-by-one.

#### Step 5B-4 Create Organisations

Edit `init/init_ckan.py`

We utilise [Create Organization](https://docs.ckan.org/en/2.8/api/index.html#ckan.logic.action.create.organization_create) to create the organisations.

Function `create_org` uses the below format

```python
utils.ckan_create_org("Title","Name","Description","image_url")
```

A sample entry is

```python
utils.ckan_create_org("Smart Citizen Kit", "smart-citizen-kit", "Data retrieved from the Smart Citizen Kits in Bristol.", "http://2012.cities.io/wp-content/uploads/2014/06/SmartCitizen_logo.png")
```

Provide the parameters as the function and as currently, we are creating only organisation, comment the `create_package` and `create_resource` function from the `init_ckan` function.

To create the default organisations (Defra, Luftdaten, Open Data Bristol, Main repository), just comment the other called functions in the `init_ckan` function.

```python
def init_ckan():
    create_org()
#   create_package()
#   create_resource()
```

Once, the organisations required by your requirement are defined in the `create_org` function and the other functions are commented in the `init_ckan` function, we can run the main python script using

```shell
python3 main.py init
```

This would call the `init_ckan.init()` function which would call the `create_org` function, which would create the organisations.

Running the above command would provide you the `organisation_id` for the organisations created.

For example:

```python
{'org_id_main': 'ab6995bc-b8cf-404d-b0e0-7666913e378b', 'org_id_odb': '41e37dc3-ebc7-41bc-afb6-83162b26e0ad', 'org_id_luftdaten': '2644b7c5-e9d7-4529-b39a-a18f62de38f8', 'org_id_sck': '13c0cdf9-2c74-4157-a9fd-980928a0ebe1', 'org_id_defra': 'ecc9ae47-7337-4d3f-9fad-d4f6fd6bd201'}
```

We would need the `organisation_id` to create the datasets, so copy the organisation id created above and paste it in the `create_package` function.

#### Step 5B-5 Create Packages/ Datasets

Now, we create packages under the organisations, hence we need the `org_id_` retreived using the above function.

`Create_package` function would create the packages defined

```python
utils.ckan_create_dataset("Title","Name","Private","Datasource URL","owner_org")
```

A sample function is

```python
dataset_id_defra = utils.ckan_create_package("Automatic Urban and Rural Network", "automatic-urban-and-rural-network-aurn", False, "http://uk-air.defra.gov.uk/data/", org_id_defra)
```

which would create a Dataset with title `Automatic Urban and Rural Network` and name `automatic-urban-and-rural-network-aurn` as a `Public` dataset with datasource url as `http://uk-air.defra.gov.uk` in the organisation of `Defra` (Created using `create_org` function.)

To create the default packages/ datasets, just comment the other called functions in the `init_ckan` function.

```python
def init_ckan():
# create_org()
create_package()
# create_resource()
```

Once, the datasets required by your requirement are defined in the `create_package` function and the other functions are commented in the `init_ckan` function. Once, we have defined the datasets required to be created, we can

```shell
python3 main.py init
```

This would call the `init_ckan.init()` function which would call the `create_package` function, which would create the packages/ datasets.

#### Step 5B-6 Create Resources

Now, inside a dataset, there can be multiple resources. In this project, it is a PostgreSQL table from the DataStore, but it could also be a JSON or CSV file. In the case of a PostgreSQL table, a dataset has a set of fields (the columns of the table;) and contains a list of records (the rows of the table). Resources and packages are identified with IDs.

To create a resource in a dataset of a particular organisation.

Example of a request:

```python
utils.ckan_create_resource( dataset_id_defra, "Defra AURN Resource", var.defra_aurn_fields_data, ["recordid"])
```

`var.defra.aurn_fields_data` is a important field, it defines the structure of the resource/ (postgresql) table. Refer `utility/variables.py` file to understand how tables/columns are defined.

It should notify success or error in the terminal.

Check on the website if the new created resource appears in the intended package.

Running the `create_resource` function the same way `python main.py init` would create all the resources under the respective datasets and provide with the resource ID.

To create the default packages/ datasets, just comment the other called functions in the `init_ckan` function.

```python
def init_ckan():
#    create_org()
#   create_package()
   create_resource()
```

Once, the datasets required by your requirement are defined in the `create_resource` function and the other functions are commented in the `init_ckan` function, we can perform

```shell
python3 main.py init
```

This would call the `init_ckan.init()` function which would call the `create_resource` function, which would create the resources.

### Step 5C: Update the config file

Running the last command of creating resources, the resource_id would have been printed. Copy the `resource_id` printed and copy it in the `config.py` in the utility folder

A sample below:

```python
dict_resource_id = {'resource_id_defra': '13842986-d7d0-4f9c-8c53-db84b942e27f', 'resource_id_main_air_pollution_bristol_daily_point': '5d04cb24-3ccd-487e-8b77-b85f87a9cdb9', 'resource_id_main_air_pollution_bristol_yearly_polygon': '614cda15-3b0d-4638-9533-c85e91acf77a', 'resource_id_odb_air_continous': 'edfa9460-24d4-4d07-b19a-fb9c50b7e3cc', 'resource_id_main_air_pollution_bristol_necessary': '2d5f55e5-a02e-4c47-a035-5e86dcb66142','resource_id_sck': 'db48fe66-4223-4e42-93e7-17c9de6cd254', 'resource_id_luftdaten': 'e823b631-fa9f-4100-9cc7-a4e65ed14f31', 'resource_id_main_air_pollution_bristol_yearly_point': '31c02b9d-56df-4678-9812-74ed415cdba7', 'resource_id_main_air_pollution_bristol_hourly_point': '12b25365-55a8-4cf8-9dd7-77fff461feec', 'resource_id_odb_air_no2': '9c43c99b-e04b-45a2-81a4-431172ede58f', 'resource_id_odb_population': '7608066d-dda9-48bd-973b-f48ae44dcabd', 'resource_id_main_units': 'fd9f1067-43d8-4c69-b71a-3f3eb13bb67e', 'resource_id_odb_wards': '1b74a32e-33c9-4f0a-9d3c-a2ddaf713481', 'resource_id_odb_cars': '01d7a1f8-0dd5-4592-8bb3-478fb895ff18'}
```

### Step 5D: Insert Reading Units in Reading Units Resource

At one point we will have to create the units package and resource. We need to insert data into Reading unit resource. To do so, use the units.py file:

- [OPTIONAL] add the units you want in the dictionnaries if you want to add new ones, you don't need to add anything if you are just trying to reproduce what we did first.
- There are two list of dictionaries: one for the units of the data recorded at one point, one for the units of the data recorded in a polygon like population for example.

### Step 5E: Insert Necessary Fields in "Air Pollution Data - City"

We need to create a resource `necessary_fields` in the package containing the latest data (called Air Pollution Data - Bristol & Bath Area OR/AND Air Pollution Data - Greater London). These resource contains the fields that the website will have to at least look for to present to the end user.

To do the above, just run

```shell
python main.py units
```

which would create the Reading Units and the Necessary Fields

## Step 6: Setup CronJobs

Now to fetch the data from the websites, we utilise cronjob to run the scripts. Before copy and pasting, please do change the username or make sure that location of the scripts is correct.

```shell
30 3 * * 0 > /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/logs/ckan.import.default.log
30 4 1 * * > /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/logs/ckan.import.error.log
0 * * * * /usr/bin/python3 /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/main.py "hour" >> /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/logs/ckan.import.default.log 2>> /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/logs/ckan.import.error.log
15 0 1 1 * /usr/bin/python3 /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/main.py "year" >> /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/logs/ckan.import.default.log 2>> /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/logs/ckan.import.error.log
20 4 * * * /usr/bin/Rscript /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/plugins/defra_aurn_imports/defra_aurn_import.R >> /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/logs/ckan.import.default.log 2>> /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/logs/ckan.import.error.log
40 4 * * * /usr/bin/python3 /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/main.py "day" >> /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/logs/ckan.import.default.log 2>> /home/ubuntu/AirPollutionDataPlatform/ckan_data_imports/logs/ckan.import.error.log
```
