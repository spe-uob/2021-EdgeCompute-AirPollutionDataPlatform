var CKAN = require('ckan')
const client = new CKAN.Client('http://ckan.bitvijays.local');

function getDataFromDataset(datasetID) {
    return new Promise((resolve, reject) => {
        client.action('datastore_search', { resource_id: datasetID, limit: 9999 }, (error, out) => {
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
}

module.exports = exports = new DatasetDao();
