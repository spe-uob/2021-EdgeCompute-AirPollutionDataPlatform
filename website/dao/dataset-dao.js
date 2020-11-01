var CKAN = require('ckan')
const client = new CKAN.Client('http://ckan.bitvijays.local');

function getDataFromDatasetLimited(datasetID, limitData) {
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

function getDataFromDataset(data) {
    return new Promise((resolve, reject) => {
        client.action('datastore_search', data, (error, out) => {
            if (error) {
                reject(error);
            } else {
                resolve(out);
            }
        });
    });
}

function getDataFDOverTimeHourly(datasetID, geojsonData, limitData) {
    return new Promise((resolve, reject) => {
        var data = {
            resource_id: datasetID,
            q: { geojson: JSON.stringify(geojsonData) },
            sort: "date_time desc",
            limit: limitData
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

function getDataFDOverTimeDaily(datasetID, geojsonData, limitData) {
    return new Promise((resolve, reject) => {
        var data = {
            resource_id: datasetID,
            q: { geojson: JSON.stringify(geojsonData) },
            sort: "day desc",
            limit: limitData
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

function getDataFDOverTimeYearly(datasetID, geojsonData, limitData) {
    return new Promise((resolve, reject) => {
        var data = {
            resource_id: datasetID,
            q: { geojson: JSON.stringify(geojsonData) },
            sort: "year desc",
            limit: limitData
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

function getDatasetNamePr(datasetID) {
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

function getFieldsPr(datasetID) {
    return new Promise((resolve, reject) => {
        var data = {
            resource_id: datasetID,
            limit: 0
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

class DatasetDao {
    async getData(datasetID, limitData) {
        const response = await getDataFromDatasetLimited(datasetID, limitData);
        return response.result;
    }

    async getDataAPI(data) {
        const response = await getDataFromDataset(data);
        return response.result;
    }

    async getDataOverTimeHourly(datasetID, geojson, limitData) {
        const response = await getDataFDOverTimeHourly(datasetID, geojson, limitData);
        return response.result;
    }

    async getDataOverTimeDaily(datasetID, geojson, limitData) {
        const response = await getDataFDOverTimeDaily(datasetID, geojson, limitData);
        return response.result;
    }

    async getDataOverTimeYearly(datasetID, geojson, limitData) {
        const response = await getDataFDOverTimeYearly(datasetID, geojson, limitData);
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

    async getDatasetName(datasetID) {
        const response = await getDatasetNamePr(datasetID);
        return response.result.name;
    }

    async getDatasetFields(datasetID) {
        const response = await getFieldsPr(datasetID);
        return response.result;
    }
}

module.exports = exports = new DatasetDao();
