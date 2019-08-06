var CKAN = require('ckan')
const client = new CKAN.Client('http://ckan.bitvijays.local');

function getGroupList() {
    return new Promise((resolve, reject) => {
        client.action('group_list', { all_fields: true }, (error, out) => {
            if (error) {
                reject(error);
            } else {
                resolve(out);
            }
        });
    });
}

function getPackagesList(areaID) {
    return new Promise((resolve, reject) => {
        client.action('member_list', { id:areaID ,  object_type: "package" }, (error, out) => {
            if (error) {
                reject(error);
            } else {
                resolve(out);
            }
        });
    });
}

class GroupDao {
    async groupList() {
        const response = await getGroupList();
        return response;
    }

    async packagesList(areaID) {
        const response = await getPackagesList(areaID);
        return response;
    }   
}

module.exports = exports = new GroupDao();
