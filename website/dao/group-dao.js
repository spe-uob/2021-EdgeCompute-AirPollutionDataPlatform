var CKAN = require('ckan')
const client = new CKAN.Client('http://192.168.56.3');

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

function getPackagesListWithResources() {
    return new Promise((resolve, reject) => {
        client.action('current_package_list_with_resources', {limit: 1000, page: 1}, (error, out) => {
            if (error) {
                reject(error);
            } else {
                resolve(out.result);
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
    
    async packagesListWithResources() {
        const response = await getPackagesListWithResources();
        var dataToReturn = [];
        var insertData = {};
        var resources = [];
        var crtElem = {};
        var groups = [];
        for (var k=0; k<response.length; k++){
            crtElem = response[k];
            insertData = {};
            if ("title" in crtElem) {
                insertData["package_name"] = crtElem.title;
            }
            if ("organization" in crtElem) {
                if(crtElem.organization!=null){
                if ("title" in crtElem.organization){
                    insertData["organization"] = crtElem.organization.title;
                }
            }
            }
            if ("groups" in crtElem){
                insertData["groups"] = [];
                groups = crtElem.groups;
                for (var j=0; j<groups.length; j++){
                    insertData["groups"].push(groups[j].title);
                }
            }
            if ("resources" in crtElem) {
                insertData["resources"] = [];
                resources = crtElem.resources;
                for (var i=0; i<resources.length; i++){
                    insertData["resources"].push({
                        "name": resources[i].name,
                        "id": resources[i].id
                    });
                }
            }
            dataToReturn.push(insertData);
        }
        return dataToReturn;
    }  
}

module.exports = exports = new GroupDao();
