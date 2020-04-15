# Setting up the CKAN Database

## Install Other packages requirements

```
apt-get install python-pip
pip install requests ckanapi
pip install python-dateutil
```

### Install R for AURN Database

Add the [Ubuntu Packages for R](https://cran.r-project.org/bin/linux/ubuntu/README.html) Repo for the latest R.

Install the [OpenAir Package](http://www.openair-project.org/GettingStarted/Default.aspx) by

```
sudo R
install.packages('openair')
```


## Install CKAN Database

Refer [Installing CKAN](https://docs.ckan.org/en/2.8/maintaining/installing/index.html)

## Setup CKAN Sysadmin User

Refer [Getting Started](https://docs.ckan.org/en/2.8/maintaining/getting-started.html)

## Enable DataStore Extension

Refer [DataStore Extension](https://docs.ckan.org/en/2.8/maintaining/datastore.html)

## Creating Groups - From CKAN GUI

Group is quite similar to regions or areas and depends on what scale, we want to seperate the latest records.

Groups can be created by following

```
CKAN Homepage > Groups > Add Group
```

### Bristol Group

Currently, we have created a group named Bristol.

## Creating Organisations - From CKAN GUI

Organisation are equivalent to different organization (or from where the data is coming). 

If it is units or a mix of the records (latest records datasets). I just put it in the University of Britol organization but it could have been anything else for that one

Currently, we gather data from the below sources

### Defra

### Luftdaten

### Open Data Bristol

### Smart Citizen

### Main Repositry

Organisation to Group the above data.

## Create Datasets - From CKAN GUI

Now, we need to create datasets from CKAN - GUI

IMPORTANT: We need to provide an initial data file to be able to finish the creation of the dataset. A simple small json file or csv file could be used so that the import is fast.

### DEFRA

DEFRA Organisation would have one dataset 

1. Automatic Urban and Rural Network (AURN)

### Luftdaten

Luftdaten Organisation would have one dataset

1. Luftdaten

### Smart Citizen Kit

SCK Organisation would have one dataset

1. Smart Citizen Kit

### Open Data Bristol

ODB would have 5 datasets

1. Wards
2. Air Quality (NO2 diffusion tube) data
3. Car Availability Data (By Ward)
4. Population Estimates
5. Air Quality Data Continous

### Main Repository

Main Repo would contain two datasets

1. Reading Units - Units of the reading of the different datasets in the CKAN data platform.
2. Air Pollution Data - Bristol and Bath : Aggregation of data from all datasets in one dataset to simplify the imports. Only the last readings are kept here because only these are necessary for the primary function of the website.

If we want to add more dataset e.g Greater London, we can do it here.

## Clone the Air Pollution Data Git Repo

Clone the [Air Pollution Data Git Repo](https://github.com/bitvijays/AirPollutionDataPlatform)

```shell
git clone https://github.com/bitvijays/AirPollutionDataPlatform.git
```

## Prepare the Utils

Change directory to 

```
cd ~/AirPollutionDataPlatform/ckan_data_imports
```

and edit `utils.py`

The `apikey` in the below line needs to be changed with the `apikey` of the admin profile on the CKAN website.

```python
REMOTE_CONTROL = ckanapi.RemoteCKAN('http://localhost', apikey='xxxxxxxxxxxxxxxxxx')
```

## Create Resources

Now, inside a dataset, there can be multiple resources. In this project, it is a PostgreSQL table from the DataStore, but it could also be a JSON or CSV file. In the case of a PostgreSQL table, a dataset has a set of fields (the columns of the table;) and contains a list of records (the rows of the table). Resources and packages are identified with IDs.

To create a resource in a dataset of a particular organisation.

Visit CKAN GUI > Organisations > Select Particular Organisation > Select Particular Dataset > Select the "Random Data Resource" which we create while creating the package. In the additional information, we would find the Package ID 

```
id		40906d6d-0f12-470e-850a-840b4c9f025d
package id	53ad3894-dfb9-4987-b5a8-63de6c59e887
revision id	93f09b86-65cd-4892-9a53-5dac6b4500be
```

Copy that package it and copy that in `create_dataset.py` in line

```
try:
    #utils.ckan_create_from_scratch("", , [])
    utils.ckan_create_from_scratch("<Insert Package ID here>", smart_citizen_fields_data, ["recordid"])
    print("done")
except Exception as exception_returned:
    print(exception_returned)
```

The three spaces are for three parameters. Add as parameters:

- AS A STRING: the ID of the package retrieved (PACKAGE_ID)
- AS A LIST of dictionnaries : the list of fields of the parameters that are going to be in that resource. We have created a lot of those lists and advised to use those. The variables describing those lists are just above the try-except block.
- AS A LIST of STRING: the primary fields (primary key) of the resource you are creating. It is usually "recordid" but not always!. The primary fields are probably indicated on the website.

Example of a request:

```python
utils.ckan_create_from_scratch("8c8389f9-3dac-4fa4-9170-69ef72af0cbb", units_fields_data, ["reading"])
```

It should notify success or error I think in the terminal.

3. Check on the website if the new created resource appears in the intended package.

Go in that resource and now retrieve the RESOURCE_ID (in the url or in the metadata at the end of the file). It will be useful to be added in the main.py file (on the CKAN VM) and on the airdata-service.js (on the webserver VM -https://github.com/Kevjolly/AirPollutionDataPlatform/blob/master/website/service/airdata-service.js). These two files are the most important ones and the ones that need changes

## Insert Reading Units in Reading Units Resource

At one point we will have to create the units package and resource. We need to insert data into Reading unit resource. To do so, use the units.py file:
- change the RESOURCE_ID at the top of the file to the one of the Reading Units
- [OPTIONAL] add the units you want in the dictionnaries if you want to add new ones, you don't need to add anything if you are just trying to reproduce what I did first. 
- Just so you know, there are two list of dictionnaries: one for the units of the data recorded at one point, one for the units of the data recorded in a polygon like population for example.
- uncomment the two lines at the end of the file (120-121) and just run the file

## Insert Necessary Fields in "Air Pollution Data - City"

We need to create a resource "necessary_fields" in the package containing the latest data (called Air Pollution Data - Bristol & Bath Area OR/AND Air Pollution Data - Greater London). These resource contains the fields that the website will have to at least look for to present to the end user. 

Just like the units package/resource, there is a `necessary_fields.py` file where you need to change the RESOURCE_ID at the beginning corresponding to the area. And at the end uncomment the line with the upsert function and accordingly change the two parameters given.

## Changes in the Main.py

The structure in main.py and airdata-service.js are pretty straight forward I think, you only need to twist the demanded RESOURCE_IDs in both corresponding variables: "AREAS" in main.py and "areas" in airdata-service.js. Then if you want you can change the other parameters indicating where to take data and which data to take. Chapter 3 in the thesis indicates the parameters or where to find information on this matter.
