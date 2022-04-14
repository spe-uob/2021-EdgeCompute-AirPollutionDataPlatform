const confFile = require('./config')

var inside = require('point-in-polygon');
var turfSquareGrid = require('@turf/square-grid');

const groupDao = require('../dao/group-dao');
const datasetDao = require('../dao/dataset-dao');
const limitData = 999;
const limitDataLarge = 99999;
const squareCellSizeDefault = 5; // square mesh diameter in kilometers
const intervalSquareCellSize = [0.5, 10];
const stepIntervalSCS = 0.1;
const limitDistance = [2.0, null];
const unitsID = confFile.unitsID;
const areas = confFile.areas; 
const eu_aqi = confFile.eu_aqi;

function getIndexes(aqi) {
    var indexes = [];
    if (Object.prototype.toString.call(aqi) === '[object Array]') {
        for (var k = 0; k < aqi.length; k++) {
            if ("name" in aqi[k]) {
                indexes.push(aqi[k].name);
            }
        }
        return indexes;
    } else {
        throw { name: "IntervalError", message: "There is an issue in the internal server regarding the aqi." };
    }
}

function polygonToBbox(polygon) {
    return [polygon[0][0], polygon[0][1], polygon[1][0], polygon[2][1]]
}

function checkIfInputsCorrect(location) {
    for (var k = 0; k < location.length; k++) {
        if (!/^[-+]?[0-9]*\.?[0-9]+$/.test(location[k])) {
            return false;
        }
    }
    return true;
}

function checkIfWord(word) {
    if ((/^[a-zA-Z]+$/.test(word))) {
        return true;
    } else {
        return false;
    }
}

function checkIfArea(area) {
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

function getFullArea(location) {
    for (var k = 0; k < areas.length; k++) {
        if (inside(location, areas[k].polygon)) {
            return areas[k];
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

function getListAreaCoveredWithIntervalsAndAll() {
    var areaCovered = [];
    var pointIDS;
    var pushArea = {};
    for (var k = 0; k < areas.length; k++) {
        pushArea = {};
        pushArea["name"] = areas[k].area;
        pushArea["intervals"] = [];
        pointIDS = areas[k].lastData.pointIDS;
        for (var property in pointIDS) {
            if (pointIDS.hasOwnProperty(property)) {
                if (pointIDS[property] != null) {
                    pushArea["intervals"].push(property);
                }
            }
        }
        if (pushArea["intervals"].length > 0) {
            pushArea["intervals"].unshift("All");
        }
        areaCovered.push(pushArea);
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

function linkUnitsOnlyFields(data, units) {
    for (var i = 0; i < data.length; i++) {
        for (var k = 0; k < units.length; k++) {
            if (units[k].reading === data[i].id) {
                data[i].unit = units[k].unit;
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
}

function checkDiameterArea(diameter, area) {
    if (diameter != null) {
        if (/^[+]?([0-9]*[.])?[0-9]{0,2}$/.test(diameter)) {
            if (parseFloat(diameter) <= intervalSquareCellSize[1] && parseFloat(diameter) >= intervalSquareCellSize[0]) {
                if (area != null) {
                    if (/^[a-zA-Z]+$/.test(area)) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            }
        } else {
            return false;
        }
    } else {
        if (area != null) {
            if (/^[a-zA-Z]+$/.test(area)) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }
}

function getSquareGrid(polygon, diameter) {
    if (diameter != null) {
        return turfSquareGrid.default(polygonToBbox(polygon), parseFloat(diameter)).features;
    } else {
        return turfSquareGrid.default(polygonToBbox(polygon), squareCellSizeDefault).features;
    }
}

function formatDeviceRaw(deviceRaw) {
    const device = tryParseJSON(decodeURIComponent(deviceRaw));
    if ("recordid" in device) {
        if (/^[a-zA-Z0-9_-]+$/.test(device["recordid"])) {
            if ("dataset_id" in device) {
                if (/^[a-zA-Z0-9_-]+$/.test(device["dataset_id"])) {
                    if ("geojson" in device) {
                        const geojson = tryParseJSON(device["geojson"]);
                        if ("interval" in device) {
                            if (/^[a-zA-Z]+$/.test(device["interval"])) {
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
        } else {
            throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
        }
    } else {
        throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
    }
}

function formatFilters(filters) {
    var newFilters = {};
    var crtField = {};

    for (var j = 0; j < filters.length; j++) {
        crtField = filters[j];
        if (typeof crtField === 'object' && crtField !== null) {
            if ("id" in crtField) {
                if (typeof crtField.id === 'string' || crtField.id instanceof String) {
                    if (crtField.id === "all") {
                        if ("value" in crtField) {
                            if (typeof crtField.value === 'string' || crtField.value instanceof String) {
                                return crtField.value;
                            }
                        }
                    } else if ("type" in crtField) {
                        if (typeof crtField.type === 'string' || crtField.type instanceof String) {
                            if ("value" in crtField) {
                                if (typeof crtField.value === 'string' || crtField.value instanceof String) {
                                    newFilters[crtField.id] = crtField.value;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return newFilters;
}

function addOptions(data, options) {
    if (options != null) {
        for (var property in options) {
            if (options.hasOwnProperty(property)) {
                if (property === "limit") {
                    if (!isNaN(options[property])) {
                        data[property] = parseInt(options[property]);
                    }
                } else if (property === "fields") {
                    if (typeof options[property] === 'string' || options[property] instanceof String) {
                        data[property] = options[property];
                    }
                } else if (property === "sort") {
                    if (typeof options[property] === 'string' || options[property] instanceof String) {
                        data[property] = options[property];
                    }
                }
            }
        }
    }
    return data;
}

function distance(long, lat, point) {
    // Code from https://www.geodatasource.com/developers/javascript
    const p_lat = point.geojson.coordinates[1];
    const p_long = point.geojson.coordinates[0];
    var radlat = Math.PI * lat / 180
    var p_radlat = Math.PI * p_lat / 180
    var theta = long - p_long
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat) * Math.sin(p_radlat) + Math.cos(radlat) * Math.cos(p_radlat) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    // Convert to kilometers
    dist = dist * 1.609344;
    return dist
}

function closest_point(long, lat, points) {
    var dist;
    if (typeof points !== 'undefined' && points.length > 0) {
        var minDistance = distance(long, lat, points[0]);
        var index = 0;
        for (var i = 1; i < points.length; i++) {
            dist = distance(long, lat, points[i])
            if (dist < minDistance) {
                index = i;
                minDistance = dist;
            }
        }
        return [minDistance, index];
    } else {
        return null;
    }
}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

class AirDataService {

    // Funtion to manage the "Get Pollution Data > From Location" Functionality
    // AreaToTake: return the area that location is in the polygon

    async getDataLocation(long, lat) {
        const locationStr = [long, lat];
        if (checkIfInputsCorrect(locationStr)) {
            const location = [parseFloat(locationStr[0]), parseFloat(locationStr[1])];
            const areaToTake = getFullArea(location);
            if (areaToTake != null) {
                if ("lastData" in areaToTake) {
                    if ("necessaryFields" in areaToTake.lastData) {
                        var lastDataProps, necessaryFields, geometries, closest, data_record,
                            fromLocDevices = {},
                            fromLocZones = {},
                            fromLocRecord = {},
                            fieldsLocRecord = [],
                            newNF = [],
                            recordTaken = false,
                            limitAttaigned = false,
                            breakCheck = false;

                        if ("pointIDS" in areaToTake.lastData) {
                            //Yearly Monthly Hourly, in reverse order
                            lastDataProps = Object.keys(areaToTake.lastData.pointIDS).reverse();
                            necessaryFields = (await datasetDao.getDataAPI({
                                resource_id: areaToTake.lastData.necessaryFields,
                                q: { geometry: 'Point' },
                                limit: 1,
                                fields: 'necessary_fields'
                            })).records[0].necessary_fields;
                            if (typeof necessaryFields !== 'undefined') {
                                for (var i = 0; i < limitDistance.length; i++) {
                                    //i dont see the chance breakCheck can be false here.
                                    //but i will leave it here
                                    if (breakCheck) {
                                        break;
                                    } else {
                                        //no2, pm 2.5 etc, names of pollution in air
                                        //use them as sort of foreign keys, store data got to
                                        //dictionary
                                        //limitAttaiged is for error handling in case of "no such a field"
                                        for (var j = 0; j < lastDataProps.length; j++) {
                                            if (necessaryFields.length > 0) {
                                                if (areaToTake.lastData.pointIDS[lastDataProps[j]] != null) {
                                                    if (i == 0) {
                                                        fieldsLocRecord = fieldsLocRecord.concat((await datasetDao.getDatasetFields(areaToTake.lastData.pointIDS[lastDataProps[j]])).fields);
                                                        fromLocDevices[lastDataProps[j]] = [];
                                                    }
                                                    geometries = (await datasetDao.getDataAPI({
                                                        resource_id: areaToTake.lastData.pointIDS[lastDataProps[j]],
                                                        fields: 'recordid, geojson',
                                                        limit: limitDataLarge
                                                    })).records;
                                                    while (necessaryFields.length !== 0 && !limitAttaigned && geometries.length > 0) {
                                                        closest = closest_point(long, lat, geometries);
                                                        if (closest != null) {
                                                            if (closest[0] < limitDistance[i] || limitDistance[i] === null) {
                                                                data_record = (await datasetDao.getDataAPI({
                                                                    resource_id: areaToTake.lastData.pointIDS[lastDataProps[j]],
                                                                    q: { recordid: geometries[closest[1]].recordid },
                                                                    limit: 1
                                                                })).records[0];
                                                                geometries.splice(closest[1], 1);
                                                                if (typeof data_record === 'object' && data_record != null) {
                                                                    newNF = [];
                                                                    for (var k = 0; k < necessaryFields.length; k++) {
                                                                        if (data_record.hasOwnProperty(necessaryFields[k])) {
                                                                            if (data_record[necessaryFields[k]] !== null) {
                                                                                recordTaken = true;
                                                                                fromLocRecord[necessaryFields[k]] = data_record[necessaryFields[k]];
                                                                            } else {
                                                                                newNF.push(necessaryFields[k]);
                                                                            }
                                                                        } else {
                                                                            newNF.push(necessaryFields[k]);
                                                                        }
                                                                    }
                                                                    if (recordTaken) {
                                                                        fromLocDevices[lastDataProps[j]].push(data_record);
                                                                    }
                                                                    necessaryFields = newNF;
                                                                }
                                                            } else {
                                                                limitAttaigned = true;
                                                            }
                                                        } else {
                                                            limitAttaigned = true;
                                                        }
                                                        recordTaken = false;
                                                    }
                                                    limitAttaigned = false;
                                                }
                                            } else {
                                                breakCheck = true;
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        if ("polygonIDS" in areaToTake.lastData) {
                            lastDataProps = Object.keys(areaToTake.lastData.polygonIDS).reverse();
                            //getDataAPI is the ckan js api
                            necessaryFields = (await datasetDao.getDataAPI({
                                resource_id: areaToTake.lastData.necessaryFields,
                                q: { geometry: 'Polygon' },
                                limit: 1,
                                fields: 'necessary_fields'
                            })).records[0].necessary_fields;
                            if (typeof necessaryFields !== 'undefined') {
                                for (var j = 0; j < lastDataProps.length; j++) {
                                    fromLocZones[lastDataProps[j]] = [];
                                    if (necessaryFields.length > 0) {
                                        if (areaToTake.lastData.polygonIDS[lastDataProps[j]] != null) {
                                            fieldsLocRecord = fieldsLocRecord.concat((await datasetDao.getDatasetFields(areaToTake.lastData.polygonIDS[lastDataProps[j]])).fields);
                                            geometries = (await datasetDao.getDataAPI({
                                                resource_id: areaToTake.lastData.polygonIDS[lastDataProps[j]],
                                                fields: 'recordid, geojson',
                                                limit: limitDataLarge
                                            })).records;
                                            if (geometries.length > 0) {
                                                for (var p = 0; p < geometries.length; p++) {
                                                    if (necessaryFields.length > 0) {
                                                        if (geometries[p].geojson.hasOwnProperty("coordinates")) {
                                                            if (inside(location, geometries[p].geojson.coordinates[0])) {
                                                                data_record = (await datasetDao.getDataAPI({
                                                                    resource_id: areaToTake.lastData.polygonIDS[lastDataProps[j]],
                                                                    q: { recordid: geometries[p].recordid },
                                                                    limit: 1
                                                                })).records[0];
                                                                if (typeof data_record === 'object' && data_record != null) {
                                                                    newNF = [];
                                                                    for (var k = 0; k < necessaryFields.length; k++) {
                                                                        if (data_record.hasOwnProperty(necessaryFields[k])) {
                                                                            if (data_record[necessaryFields[k]] !== null) {
                                                                                recordTaken = true;
                                                                                fromLocRecord[necessaryFields[k]] = data_record[necessaryFields[k]];
                                                                            } else {
                                                                                newNF.push(necessaryFields[k]);
                                                                            }
                                                                        } else {
                                                                            newNF.push(necessaryFields[k]);
                                                                        }
                                                                    }
                                                                    if (recordTaken) {
                                                                        fromLocZones[lastDataProps[j]].push(data_record);
                                                                    }
                                                                    necessaryFields = newNF;
                                                                }
                                                            }
                                                        }
                                                    } else {
                                                        break;
                                                    }
                                                }
                                            }
                                        }
                                    } else {
                                        break;
                                    }
                                }
                            }
                        }

                        const units = (await datasetDao.getData(unitsID, limitData)).records;
                        fieldsLocRecord = linkUnitsOnlyFields(fieldsLocRecord, units);
                        return {
                            location: {
                                coordinates: location,
                                area_name: areaToTake.area,
                                area_center: areaToTake.center
                            },
                            result: {
                                //data you have
                                fields: fieldsLocRecord,
                                data: fromLocRecord,
                                devices: fromLocDevices,
                                zones: fromLocZones
                            }
                        };
                    } else {
                        throw { name: "NecessaryFieldsError", message: "The necessary fields for this location seem to not have been defined." };
                    }
                } else {
                    throw { name: "AreaWithoutDataError", message: "The chosen location is in an area covered but it seems the datasets haven't been configured." };
                }
            } else {
                throw { name: "NotInAreaError", message: "The chosen location is not in any area covered by our data." };
            }
        } else {
            throw { name: "InputsError", message: "The inputs given are not accepted real numbers." };
        }
    }

    // Function to return eu_aqi (EU Air Quality Indicator - The value ranges of poor, good, very good air quality levels)
    async getAQI() {
        return eu_aqi;
    }

    async getCellValues() {
        return {
            size_default: squareCellSizeDefault,
            min: intervalSquareCellSize[0],
            max: intervalSquareCellSize[1],
            step: stepIntervalSCS
        }
    }

    // Function to provide AQI Levels for square grids based on diameter on "Air Quality Map"
    async getAQIArea(diameter, area) {
        if (checkDiameterArea(diameter, area)) {
            const areaToTake = getArea(area);
            if (areaToTake != null) {
                if ("polygon" in areaToTake) {
                    var squareGrid = getSquareGrid(areaToTake.polygon, diameter);
                    const listIndexes = getIndexes(eu_aqi);
                    if (squareGrid.length > 0 && listIndexes.length > 0) {
                        if ("lastData" in areaToTake) {
                            if ("pointIDS" in areaToTake.lastData) {
                                const lastDataProps = Object.keys(areaToTake.lastData.pointIDS).reverse();
                                var squareCell, results, sum, avg,
                                    squareCellData = {},
                                    fieldsToSend = [];
                                for (var k = 0; k < listIndexes.length; k++) {
                                    squareCellData[listIndexes[k]] = [];
                                }
                                for (var j = 0; j < lastDataProps.length; j++) {
                                    if (areaToTake.lastData.pointIDS[lastDataProps[j]] != null) {
                                        fieldsToSend = fieldsToSend.concat((await datasetDao.getDatasetFields(areaToTake.lastData.pointIDS[lastDataProps[j]])).fields);
                                        results = (await datasetDao.getDataAPI({
                                            resource_id: areaToTake.lastData.pointIDS[lastDataProps[j]],
                                            limit: limitDataLarge
                                        })).records;
                                        for (var i = 0; i < squareGrid.length; i++) {
                                            squareCell = squareGrid[i];
                                            if (isEmpty(squareCell.properties)) {
                                                for (var k = 0; k < listIndexes.length; k++) {
                                                    squareCellData[listIndexes[k]] = [];
                                                }

                                                for (var k = results.length - 1; k >= 0; k--) {
                                                    if (inside(results[k].geojson.coordinates, squareCell.geometry.coordinates[0])) {
                                                        for (var property in squareCellData) {
                                                            if (squareCellData.hasOwnProperty(property)) {
                                                                if (results[k].hasOwnProperty(property)) {
                                                                    if (results[k][property] != null) {
                                                                        squareCellData[property].push(results[k][property]);
                                                                    }
                                                                }
                                                            }
                                                        }
                                                        results.splice(k, 1);
                                                    }
                                                }

                                                for (var property in squareCellData) {
                                                    if (squareCellData.hasOwnProperty(property)) {
                                                        if (squareCellData[property].length > 0) {
                                                            sum, avg = 0;
                                                            sum = squareCellData[property].reduce(function (a, b) { return a + b; });
                                                            avg = sum / squareCellData[property].length;
                                                            squareCell.properties[property] = avg;
                                                        }
                                                    }
                                                }

                                                squareGrid[i] = squareCell;
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        const units = (await datasetDao.getData(unitsID, limitData)).records;
                        fieldsToSend = linkUnitsOnlyFields(fieldsToSend, units);
                        return {
                            area: {
                                name: areaToTake.area,
                                center: areaToTake.center,
                                delimitations: areaToTake.polygon
                            },
                            aqi: eu_aqi,
                            fields: fieldsToSend,
                            data: {
                                type: "FeatureCollection",
                                features: squareGrid
                            }
                        }
                    } else {
                        throw { name: "AreaError", message: "This area is too small or there is an internal server error" };
                    }
                } else {
                    throw { name: "IntervalError", message: "There is an issue in the internal server regarding this area." };
                }
            } else {
                throw { name: "AreaError", message: "The area given is not supported by our data platform" };
            }
        }
    }

    async getListAreas(area) {
        if (checkIfArea(area)) {
            const areaToTake = getArea(area);
            if (areaToTake != null) {
                return {
                    currentarea: {
                        area: areaToTake.area,
                        center: areaToTake.center
                    },
                    listcover: getListAreaCoveredWithoutCrt(areaToTake)
                };
            } else {
                throw { name: "AreaError", message: "The area given is not supported by our data platform" };
            }
        } else {
            throw { name: "AreaError", message: "The area given can only accept letters." };
        }
    }

    // Function to check that the longitude, latitude submitted are within the range of the city platform is serving.
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

    // Function to manage "Get Pollution Data > Any Device (View All Sensors)"
    async getAllData(area) {
        if (checkIfArea(area)) {
            const areaToTake = getArea(area);
            if (areaToTake != null) {
                const pointIDS = areaToTake.lastData.pointIDS;
                const units = await datasetDao.getData(unitsID, limitData);
                var data = {}
                for (var property in pointIDS) {
                    if (pointIDS.hasOwnProperty(property)) {
                        if (pointIDS[property] != null) {
                            data[property] = await datasetDao.getData(pointIDS[property], limitData);
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

    // Function to manage "Get Pollution Data > Any Device (View All Sensors)" when called via API
    async getAllDataAPI(area, interval) {
        if (checkIfWord(interval)) {
            if (checkIfArea(area)) {
                const areaToTake = getArea(area);
                if (areaToTake != null) {
                    const pointIDS = areaToTake.lastData.pointIDS;
                    const units = await datasetDao.getData(unitsID, limitData);
                    var data = {}
                    if (interval === "All") {
                        for (var property in pointIDS) {
                            if (pointIDS.hasOwnProperty(property)) {
                                if (pointIDS[property] != null) {
                                    data[property] = await datasetDao.getData(pointIDS[property], limitData);
                                    data[property] = linkUnits(data[property], units.records);
                                    data[property] = formatResp(data[property], ["fields", "records"]);
                                }
                            }
                        }
                    } else if (pointIDS.hasOwnProperty(interval)) {
                        if (pointIDS[interval] != null) {
                            data = await datasetDao.getData(pointIDS[interval], limitData);
                            data = linkUnits(data, units.records);
                            data = formatResp(data, ["fields", "records"]);
                        }
                    } else {
                        throw { name: "IntervalError", message: "The interval given is not correct." };
                    }
                    return {
                        area: {
                            name: areaToTake.area,
                            center: areaToTake.center,
                            delimitations: areaToTake.polygon
                        },
                        data: data
                    };
                } else {
                    throw { name: "AreaError", message: "The area given is not supported by our data platform" };
                }
            } else {
                throw { name: "AreaError", message: "The area given can only accept letters." };
            }
        } else {
            throw { name: "IntervalError", message: "The interval given can only accept letters." };
        }
    }

    // Function to manages the "More Data" Functionality
    async getDataOverTime(deviceRaw) {
        var device, geojson;
        if (typeof deviceRaw === "string") {
        [device, geojson] = formatDeviceRaw(decodeURIComponent(deviceRaw));
        } else {
            device = deviceRaw[0];
            geojson = deviceRaw[1];
        }

        const units = await datasetDao.getData(unitsID, limitData);
        var data;
        if (device != null) {
            if (device.interval === "Hourly") {
                data = await datasetDao.getDataOverTimeHourly(device.dataset_id, geojson, limitData);
            } else if (device.interval === "Daily") {
                data = await datasetDao.getDataOverTimeDaily(device.dataset_id, geojson, limitData);
            } else if (device.interval === "Yearly") {
                data = await datasetDao.getDataOverTimeYearly(device.dataset_id, geojson, limitData);
            } else {
                throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
            }

            

            data = linkUnits(data, units.records);
            data = formatResp(data, ["fields", "records"]);
            if (data.records.length !== 0) {
                var record = data.records[0];
                const package_id = await datasetDao.getPackageFromDataset(device.dataset_id);
                const response = await datasetDao.getPackageNameFromPackageID(package_id);
                record["dataset_id"] = device.dataset_id;
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
                throw { name: "DeviceError", message: "The device requested appears to have no records in the dataset" };
            }
        } else {
            throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
        }
    }

    // Function to populate the API drop down menu
    async getLists() {
        const datasets_list = await groupDao.packagesListWithResources();
        return {
            base: {
                list_options: [{
                    name: "Last pollution data from a given location",
                    id: "fromlocation"
                }, {
                    name: "Last pollution data for all the devices in an area",
                    id: "anydevice",
                }, {
                    name: "Get air quality index levels",
                    id: "aqi"
                }],
                anydevice: getListAreaCoveredWithIntervalsAndAll(),
                aqi: {
                    size_default: squareCellSizeDefault,
                    min: intervalSquareCellSize[0],
                    max: intervalSquareCellSize[1],
                    step: stepIntervalSCS
                }
            },
            data_search: datasets_list,
            limit: limitData.toString()
        }
    }

    async getFieldsAPI(datasetID) {
        if (/^[a-zA-Z0-9_-]+$/.test(datasetID)) {
            var fields = await datasetDao.getDatasetFields(datasetID);
            const package_id = await datasetDao.getPackageFromDataset(datasetID);
            const package_name = await datasetDao.getPackageNameFromPackageID(package_id);
            const dataset_name = await datasetDao.getDatasetName(datasetID);
            fields["resource_name"] = dataset_name;
            fields["resource_info"] = package_name;
            fields["total_records_dataset"] = fields["total"];
            return formatResp(fields, ["resource_name", "resource_id", "resource_info", "total_records_dataset", "fields"]);
        } else {
            throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
        }
    }

    async getDatasearch(dataset_id, filters, options) {
        if (!(Object.prototype.toString.call(filters) === '[object Array]')) {
            throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
        }
        if (/^[a-zA-Z0-9_-]+$/.test(dataset_id)) {
            var data = {
                resource_id: dataset_id,
            };
            var response;
            if (filters.length !== 0) {
                const updatedFilters = formatFilters(filters);
                if (typeof updatedFilters === 'string' || updatedFilters instanceof String) {
                    data["q"] = updatedFilters;
                    data["limit"] = limitData;
                    data = addOptions(data, options);
                    response = await datasetDao.getDataAPI(data);
                } else if (typeof updatedFilters === 'object' && updatedFilters !== null) {
                    data["q"] = updatedFilters;
                    data["limit"] = limitData;
                    data = addOptions(data, options);
                    response = await datasetDao.getDataAPI(data);
                } else {
                    throw { name: "FormatError", message: "The server failed to format the request parameters." };
                }
            } else {
                data["limit"] = limitData;
                data = addOptions(data, options);
                response = await datasetDao.getDataAPI(data);
            }
            const package_id = await datasetDao.getPackageFromDataset(dataset_id);
            const package_name = await datasetDao.getPackageNameFromPackageID(package_id);
            const dataset_name = await datasetDao.getDatasetName(dataset_id);
            response["resource_name"] = dataset_name;
            response["resource_info"] = package_name;
            response["total_records_result"] = response["records"].length;
            return formatResp(response, ["resource_name", "resource_id", "resource_info", "total_records_result", "fields", "records"]);
        } else {
            throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
        }
    }
}

module.exports = exports = new AirDataService();
