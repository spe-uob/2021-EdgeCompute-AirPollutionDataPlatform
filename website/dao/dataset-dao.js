var CKAN = require('ckan')
const client = new CKAN.Client('http://ckan.bitvijays.local');
const limitData = 999;

function getDataFromDataset(datasetID) {
    return new Promise((resolve, reject) => {
        client.action('datastore_search', { resource_id: datasetID, limit: limitData }, (error, out) => {
            if (error) {
                reject(error);
            } else {
                resolve(out);
            }
        });
    });
}

function getDataFDOverTime(datasetID, geojsonData) {
    return new Promise((resolve, reject) => {
        var data = {
            resource_id: datasetID,
            q: {geojson: JSON.stringify(geojsonData)},
            sort: "date_time desc",
            limit: 999
          };
        client.action('datastore_search', data, (error, out) => {
            if (error) {
                reject(error);
            } else {
                resolve(out);
            }
        });
    });
}

function getPackageNameFromPackageIDPr(packageID) {
    return new Promise((resolve, reject) => {
        client.action('package_show', { id: packageID }, (error, out) => {
            if (error) {
                reject(error);
            } else {
                resolve(out);
            }
        });
    });
}

function getPackageFromDatasetPr(datasetID) {
    return new Promise((resolve, reject) => {
        client.action('resource_show', { id: datasetID }, (error, out) => {
            if (error) {
                reject(error);
            } else {
                resolve(out);
            }
        });
    });
}

class DatasetDao {
    async getData(datasetID) {
        const response = await getDataFromDataset(datasetID);
        return response.result;
    }

    async getDataOverTime(datasetID, geojson) {
        const response = await getDataFDOverTime(datasetID, geojson);
        return response.result;
    }
    
    async getPackageFromDataset(datasetID) {
        const response = await getPackageFromDatasetPr(datasetID);
        return response.result.package_id;
    }

    async getPackageNameFromPackageID(packageID) {
        const response = await getPackageNameFromPackageIDPr(packageID);
        return {
            package_name: response.result.title, 
            organization: response.result.organization.title
        };
    }
}

module.exports = exports = new DatasetDao();
