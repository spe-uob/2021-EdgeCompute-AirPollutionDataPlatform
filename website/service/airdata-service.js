var inside = require('point-in-polygon');
const groupDao = require('../dao/group-dao');
const datasetDao = require('../dao/dataset-dao');
const unitsIDs = {
    packageID: "711c7ddd-4566-49c3-be1e-4f7368748229",
    pointID: "10df8c8d-f681-4325-bf75-21064ba81a2f",
    polygonID: "86ee6685-1c2a-46ce-adbe-59a91039b65f"
};
const areas = [{
    area: "Bristol",
    center: [-2.6, 51.47],
    groupID: "8e049fd6-4407-4d7f-ad32-16a5d405790a",
    lastData: {
        packageID: "0c1d36fe-96c3-4266-ab87-b72977dec1e7",
        pointIDS: {
            Yearly: "0e6c4aaa-eef3-41a1-b70c-fb3a826a27be",
            Daily: null,
            Hourly: "665b5270-9867-4ba6-889d-c9d5c46e310f"

        },
        polygonIDS: {
            yearlyPolygonID: "eb10e278-9766-4f12-9f1d-cf9dbce8bec4"
        }
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
            Yearly: "0e6c4aaa-eef3-41a1-b70c-fb3a826a27be",
            Daily: null,
            Hourly: "665b5270-9867-4ba6-889d-c9d5c46e310f"
        },
        polygonIDS: {
            yearlyPolygonID: "eb10e278-9766-4f12-9f1d-cf9dbce8bec4"
        }
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
const eu_aqi = [{
    name: "pm25",
    index_levels: [{
        name: "Good",
        values: [0, 10],
        color: "#50f0e6"
    }, {
        name: "Fair",
        values: [10, 20],
        color: "#50ccaa"
    }, {
        name: "Moderate",
        values: [20, 25],
        color: "#f0e641"
    }, {
        name: "Poor",
        values: [25, 50],
        color: "#ff5050"
    }, {
        name: "Very Poor",
        values: [50, 800],
        color: "#960032"
    }]
}, {
    name: "pm10",
    index_levels: [{
        name: "Good",
        values: [0, 20],
        color: "#50f0e6"
    }, {
        name: "Fair",
        values: [20, 35],
        color: "#50ccaa"
    }, {
        name: "Moderate",
        values: [35, 50],
        color: "#f0e641"
    }, {
        name: "Poor",
        values: [50, 100],
        color: "#ff5050"
    }, {
        name: "Very Poor",
        values: [100, 1200],
        color: "#960032"
    }]
}, {
    name: "no2",
    index_levels: [{
        name: "Good",
        values: [0, 40],
        color: "#50f0e6"
    }, {
        name: "Fair",
        values: [40, 100],
        color: "#50ccaa"
    }, {
        name: "Moderate",
        values: [100, 200],
        color: "#f0e641"
    }, {
        name: "Poor",
        values: [200, 400],
        color: "#ff5050"
    }, {
        name: "Very Poor",
        values: [400, 1000],
        color: "#960032"
    }]
}, {
    name: "o3",
    index_levels: [{
        name: "Good",
        values: [0, 80],
        color: "#50f0e6"
    }, {
        name: "Fair",
        values: [80, 120],
        color: "#50ccaa"
    }, {
        name: "Moderate",
        values: [120, 180],
        color: "#f0e641"
    }, {
        name: "Poor",
        values: [180, 240],
        color: "#ff5050"
    }, {
        name: "Very Poor",
        values: [240, 600],
        color: "#960032"
    }]
}, {
    name: "so2",
    index_levels: [{
        name: "Good",
        values: [0, 100],
        color: "#50f0e6"
    }, {
        name: "Fair",
        values: [100, 200],
        color: "#50ccaa"
    }, {
        name: "Moderate",
        values: [200, 350],
        color: "#f0e641"
    }, {
        name: "Poor",
        values: [350, 500],
        color: "#ff5050"
    }, {
        name: "Very Poor",
        values: [500, 1250],
        color: "#960032"
    }]
}]

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
        if (areaToTake.area !== areas[k].area) {
            areaCovered.push(areas[k].area);
        }
    }
    return areaCovered;
}

function linkUnits(data, units) {
    for (var i = 0; i < data.fields.length; i++) {
        for (var k = 0; k < units.length; k++) {
            if (units[k].reading === data.fields[i].id) {
                data.fields[i].unit = units[k].unit;
            }
        }
    }
    return data;
}

function formatResp(data, listProps) {
    var result = {};
    for (var k = 0; k < listProps.length; k++) {
        result[listProps[k]] = data[listProps[k]];
    }
    return result;
}

function tryParseJSON(jsonString) {
    try {
        var jsonParsed = JSON.parse(jsonString);
        if (jsonParsed && typeof (jsonParsed) === "object") {
            return jsonParsed;
        } else {
            throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
        }
    }
    catch (e) {
        throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
    }
};

function formatDeviceRaw(deviceRaw) {
    const device = tryParseJSON(decodeURIComponent(deviceRaw));
    if ("recordid" in device) {
        if (/^[a-zA-Z0-9_-]+$/.test(device["recordid"])) {
            if ("dataset_id" in device) {
                if (/^[a-zA-Z0-9_-]+$/.test(device["dataset_id"])) {
                    if ("geojson" in device) {
                        const geojson = tryParseJSON(device["geojson"]);
                        return [device, geojson];
                    } else {
                        throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
                    }
                } else {
                    throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
                }
            } else {
                throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
            }
        } else {
            throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
        }
    } else {
        throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
    }
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
                const units = await datasetDao.getData(unitsIDs.pointID);
                var data = {}
                for (var property in pointIDS) {
                    if (pointIDS.hasOwnProperty(property)) {
                        if (pointIDS[property] != null) {
                            data[property] = await datasetDao.getData(pointIDS[property]);
                            data[property] = linkUnits(data[property], units.records);
                            data[property] = formatResp(data[property], ["fields", "records"]);
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

    async getDataOverTime(deviceRaw) {
        const [device, geojson] = formatDeviceRaw(decodeURIComponent(deviceRaw));
        const units = await datasetDao.getData(unitsIDs.pointID);
        var data;
        if (device != null) {
            data = await datasetDao.getDataOverTime(device.dataset_id, geojson);
            data = linkUnits(data, units.records);
            data = formatResp(data, ["fields", "records"]);
            var record = data.records[0];
            record["dataset_id"] = device.dataset_id;
            const package_id = await datasetDao.getPackageFromDataset(device.dataset_id);
            const response = await datasetDao.getPackageNameFromPackageID(package_id);
            record["dataset_name"] = response["package_name"];
            record["organization"] = response["organization"];
            return {
                last_record: JSON.stringify({
                    fields: data.fields,
                    record: record
                }),
                data: JSON.stringify(data),
                eu_aqi: JSON.stringify(eu_aqi)
            }
        } else {
            throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
        }
    }
}

module.exports = exports = new AirDataService();
