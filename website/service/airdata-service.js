var inside = require('point-in-polygon');
const groupDao = require('../dao/group-dao');
const datasetDao = require('../dao/dataset-dao');
const areas = [{
    area: "Bristol",
    center: [-2.6, 51.47],
    groupID: "8e049fd6-4407-4d7f-ad32-16a5d405790a",
    lastData: {
        packageID: "0c1d36fe-96c3-4266-ab87-b72977dec1e7",
        pointIDS: {
            Hourly: "665b5270-9867-4ba6-889d-c9d5c46e310f",
            Daily: null,
            Yearly: "0e6c4aaa-eef3-41a1-b70c-fb3a826a27be"
        },
        polygonIDS: {
            yearlyPolygonID: "eb10e278-9766-4f12-9f1d-cf9dbce8bec4"
        }
    },
    unitsID: {
        packageID: "711c7ddd-4566-49c3-be1e-4f7368748229",
        pointID: "10df8c8d-f681-4325-bf75-21064ba81a2f",
        polygonID: "86ee6685-1c2a-46ce-adbe-59a91039b65f"
    },
    polygon: [
        [
            -2.83172607421875,
            51.34433866059924
        ],
        [
            -2.3345947265625,
            51.34433866059924
        ],
        [
            -2.3345947265625,
            51.65722279808633
        ],
        [
            -2.83172607421875,
            51.65722279808633
        ],
        [
            -2.83172607421875,
            51.34433866059924
        ]
    ]
},
{
    area: "London",
    center: [-0.1, 51.49],
    groupID: "8e049fd6-4407-4d7f-ad32-16a5d405790a",
    lastData: {
        packageID: "0c1d36fe-96c3-4266-ab87-b72977dec1e7",
        pointIDS: {
            Hourly: "665b5270-9867-4ba6-889d-c9d5c46e310f",
            Daily: null,
            Yearly: "0e6c4aaa-eef3-41a1-b70c-fb3a826a27be"
        },
        polygonIDS: {
            yearlyPolygonID: "eb10e278-9766-4f12-9f1d-cf9dbce8bec4"
        }
    },
    unitsID: {
        packageID: "711c7ddd-4566-49c3-be1e-4f7368748229",
        pointID: "10df8c8d-f681-4325-bf75-21064ba81a2f",
        polygonID: "86ee6685-1c2a-46ce-adbe-59a91039b65f"
    },
    polygon: [
        [
            -2.83172607421875,
            51.34433866059924
        ],
        [
            -2.3345947265625,
            51.34433866059924
        ],
        [
            -2.3345947265625,
            51.65722279808633
        ],
        [
            -2.83172607421875,
            51.65722279808633
        ],
        [
            -2.83172607421875,
            51.34433866059924
        ]
    ]
}];

function checkIfInputsCorrect(location) {
    for (var k = 0; k < location.length; k++) {
        if (!/^[-+]?[0-9]*\.?[0-9]+$/.test(location[k])) {
            return false;
        }
    }
    return true;
}

function checkIfAreaCorrect(area) {
    if ((/^[a-zA-Z]+$/.test(area)) || (area == null)) {
        return true;
    } else {
        return false;
    }
}

function getArea(area) {
    if (area == null) {
        return areas[0];
    } else {
        for (var k = 0; k < areas.length; k++) {
            if (areas[k].area === area) {
                return areas[k];
            }
        }
        return null;
    }
}

function getAreaID(location) {
    for (var k = 0; k < areas.length; k++) {
        if (inside(location, areas[k].polygon)) {
            return areas[k].groupID;
        }
    }
    return null;
}

function getListAreaCovered() {
    var areaCovered = [];
    for (var k = 0; k < areas.length; k++) {
        areaCovered.push(areas[k].area);
    }
    return areaCovered;
}

function getListAreaCoveredWithoutCrt(areaToTake) {
    var areaCovered = [];
    for (var k = 0; k < areas.length; k++) {
        if (areaToTake.area !== areas[k].area){
            areaCovered.push(areas[k].area);
        }
    }
    return areaCovered;
}

function linkUnitsToFields(data, units){ 
    for (var i = 0; i < data.fields.length; i++) {
        for (var k = 0; k < units.length; k++){
            if (units[k].reading === data.fields[i].id){
                data.fields[i].unit = units[k].unit;
            }
        }
    }
    return {fields: data.fields, records: data.records};
}

class AirDataService {
    async getDataLocation(long, lat) {
        const locationStr = [long, lat];
        if (checkIfInputsCorrect(locationStr)) {
            var location = [];
            for (var j = 0; j < locationStr.length; j++) {
                location.push(parseFloat(locationStr[j]));
            }
            const areaID = getAreaID(location);
            if (areaID != null) {
                const packages = await groupDao.packagesList(areaID);
                return packages;
            } else {
                throw { name: "NotInAreaError", message: "The chosen location is not in any area covered by our data." };
            }
        } else {
            throw { name: "InputsError", message: "The inputs given are not accepted real numbers." };
        }
    }

    async checkDataLocation(long, lat) {
        const locationStr = [long, lat];
        if (checkIfInputsCorrect(locationStr)) {
            var location = [];
            for (var j = 0; j < locationStr.length; j++) {
                location.push(parseFloat(locationStr[j]));
            }
            const areaID = getAreaID(location);
            if (areaID != null) {
                return {
                    inzone: true,
                };
            } else {
                return {
                    inzone: false,
                    listcover: getListAreaCovered()
                };
            }
        } else {
            throw { name: "InputsError", message: "The inputs given are not accepted real numbers." };
        }
    }

    async getAllData(area) {
        if (checkIfAreaCorrect(area)) {
            const areaToTake = getArea(area);
            if (areaToTake != null) {
                const pointIDS = areaToTake.lastData.pointIDS;
                const units = await datasetDao.getData(areaToTake.unitsID.pointID);
                var data = {}
                for (var property in pointIDS) {
                    if (pointIDS.hasOwnProperty(property)) {
                        if (pointIDS[property] != null) {
                            data[property] = await datasetDao.getData(pointIDS[property]);
                            data[property] = linkUnitsToFields(data[property], units.records);
                        }
                    }
                }
                return {
                    currentarea: {
                        area: areaToTake.area,
                        center: areaToTake.center
                    },
                    listcover: getListAreaCoveredWithoutCrt(areaToTake),
                    data: JSON.stringify(data)
                };
            } else {
                throw { name: "AreaError", message: "The area given is not supported by our data platform" };
            }
        } else {
            throw { name: "AreaError", message: "The area given can only accept letters." };
        }
    }
}

module.exports = exports = new AirDataService();
