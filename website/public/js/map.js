var enableAddMarkerByClick = false;
const mapbox_public_key="pk.eyJ1IjoibWFydGluc3BlIiwiYSI6ImNrenllMmViODA5dDYydXA5dGQ5c29rNWwifQ.T-9kU_3Db4A7VGaeXT0Rag"

function addZeroForDate(t) {
    if (t < 10) {
        t = "0" + t;
    }
    return t;
}

function formatDate(date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
    return date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear() + ' at ' + addZeroForDate(date.getHours()) + ':' + addZeroForDate(date.getMinutes()) + ':' + addZeroForDate(date.getSeconds());
}

function choiceProcess(choice, firstTime) {
    const results = JSON.parse($("#data_res").text());
    if (firstTime) {
        buildChoiceLegend(results);
        map.setCenter(JSON.parse("[" + $("#area_center").attr("data-value") + "]"));
    }
    if (choice === "All") {
        processAllResult(results);
    } else {
        processResult(results[choice], choice);
    }
}

// Builds the sensors legend in "Get Pollution Data" functionality
function buildLegend(colors, assoColors) {
    var elemStr = '<h4><a href="#" id="map-legend-close" class="text-info"><i class="material-icons md-28 align-middle">keyboard_arrow_right</i><span class="align-middle">Sensors</span></a></h4>';
    for (var k = 0; k < assoColors.length; k++) {

        if (assoColors[k] != null) {

            // Currently, we want to display human-friendly names on the front-end. This is a hack
            if (assoColors[k] == "luftdaten") {
                (kilolima = "Luftdaten")
            }
            else if (assoColors[k] == "smart-citizen-kits") {
                (kilolima = "Smart Citizen Kit")
            }
            else if (assoColors[k] == "automatic-urban-and-rural-network-aurn") {
                kilolima = "DEFRA AURN";
            }
            else if (assoColors[k] == "air-quality-data-continuous") {
                kilolima = "Bristol Air Quality Continuous";
            }

            else if (assoColors[k] == "air-quality-no2-diffusion-tube-data") {
                kilolima = "Bristol NO2 Diffusion Tubes";
            }

            else {
                kilolima = assoColors[k]
            }
        }
        if (k !== colors.length) {
            if (kilolima != null) {
                elemStr += '<div><span style="background-color: ' + colors[k] + '"></span>' + kilolima + '</div>';

            } else {
                elemStr += '<div><span style="background-color: ' + colors[k] + '"></span>' + assoColors[k] + '</div>';
            }
        }

    }
    if (window.location.href.indexOf("datalocation") > -1) {
        elemStr += '<div><span style="background-color: #97CBFF"></span>Chosen location</div>';
    }
    $("#map-legend").html(elemStr);
}

function buildChoiceLegend(results) {
    var elemStr = '<option value="All" selected>All</option>';
    for (var property in results) {
        if (results.hasOwnProperty(property)) {
            elemStr += '<option value=\"' + property + '\">' + property + '</option>';
        }
    }
    $("#choiceInterval").html(elemStr);
}

function processResult(result, choice) {
    const markerColors = ["blue", "red", "green", "yellow", "purple", "orange", "cyan", "grey", "black"];
    var assoColors = [];
    var records = result["records"];
    for (var i = 0; i < records.length; i++) {
        assoColors = buildMarkPopRecord(records[i], i.toString(), result["fields"], markerColors, assoColors, choice);
    }
    buildLegend(markerColors, assoColors);
}

function processAllResult(results) {
    const markerColors = ["blue", "red", "green", "yellow", "purple", "orange", "cyan", "grey", "black"];
    var assoColors = [];
    var index = 0;
    var offset = 0;
    var records = [];
    var fields = [];
    for (var property in results) {
        records = results[property].records;
        fields = results[property].fields;
        for (var i = 0; i < records.length; i++) {
            index = i + offset;
            assoColors = buildMarkPopRecord(records[i], index.toString(), fields, markerColors, assoColors, property);

        }
        offset += records.length;
    }
    buildLegend(markerColors, assoColors);
}

function findField(fields, crtProperty) {
    try {
        for (var j = 0; j < fields.length; j++) {
            if (fields[j].id === crtProperty) {
                if ("unit" in fields[j]) {
                    return [fields[j].info.label, fields[j].info.notes, fields[j].unit];
                } else {
                    return [fields[j].info.label, fields[j].info.notes, null];
                }
            }
        }
        return null;
    } catch (error) {
        return null;
    }
}

//takes care of the sensor popup window, all the elements and a link to more data
function buildMarkPopRecord(record, index, fields, colors, assoColors, choice) {
    const eu_aqi = JSON.parse($("#eu_aqi").text());
    /*var returnElem = '<ul class="nav nav-tabs" id="popupTab' + index + '" role="tablist">\
                      <li class="nav-item">\
                      <a class="nav-link active link-popup-tab" id="infoTab'+ index + '" data-toggle="tab" href="#info' + index + '" role="tab" aria-controls="info' + index + '" aria-selected="true">Info</a>\
                      </li><li class="nav-item">\
                      <a class="nav-link link-popup-tab" id="lastdataTab'+ index + '" data-toggle="tab" href="#lastdata' + index + '" role="tab" aria-controls="lastdata' + index + '" aria-selected="false">Recent Reading</a>\
                      </li><li class="nav-item">\
                      <a class="nav-link link-popup-tab" id="moreTab'+ index + '" data-toggle="tab" href="#more' + index + '" role="tab" aria-controls="more' + index + '" aria-selected="false">More data</a>\
                      </li></ul>';*/
    var returnElem = ""
    for (var k = 0; k < assoColors.length; k++) {
        if (assoColors[k] != null) {
            // Currently, we want to display human-friendly names on the front-end. This is a hack
            if (assoColors[k] == "luftdaten") {
                kilolima = "Luftdaten";
            }
            else if (assoColors[k] == "automatic-urban-and-rural-network-aurn") {
                kilolima = "DEFRA AURN";
            }
            else if (assoColors[k] == "air-quality-data-continuous") {
                kilolima = "Bristol Air Quality Continuous";
            }
            else if (assoColors[k] == "air-quality-no2-diffusion-tube-data") {
                kilolima = "Bristol NO2 Diffusion Tubes";
            }
            else {
                kilolima = assoColors[k];
            }

            color = getPopupAqiColor(record, eu_aqi);
            // If all pollutants are null, use white
            if (color === null) {
                color = '#ffffff';
            }
            returnElem += '<span class="legend" id="pointer" style="background-color: ' + color + '"></span>';
        }
    }

    var info = "";
    info += "<div class='container' style='display:flex'>";
    var last_data = "";
    var position;
    last_data += "<table class='table'><thead style='display:none'><tr><th>field</th><th>data</th></tr></thead><tbody>"
    var linkToMore = {
        interval: choice
    };
    var infoField = [];
    var color;
    
    // confusing function, does some checks if the data is correct.
    // processes the data from the record and uses it to correctly build the pop up
    // info is the main part that the loop ads all the elements to
    for (var property in record) {
        if (record.hasOwnProperty(property)) {
            if (record[property] != null) {
                if (record["location"] != null) {
                    check = false;
                }
                else {
                    check = true;
                }
                if (property === "date_time") {
                    infoField = findField(fields, property);
                    info = handleDateTime(infoField, info, record, property);
//                     if (infoField != null) {
//                         if (record[property].includes("Z")) {
//                             info += '<div class="container-2"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" style="color:black !important" title="' + infoField[1] + '"><b>Updated:</b><br>' + formatDate(new Date(record[property])) + '</a></div>';
//                             /*info += '<tr><td><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">Record time (UTC)</a>:</td><td> ' + record[property] + '</td></tr>';*/
//                         } else if (record[property].includes("+")) {
//                             info += '<div class="container-2"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" style="color:black !important" title="' + infoField[1] + '"><b>Updated:</b><br>' + formatDate(new Date(record[property])) + '</a></div>';
//                             /*info += '<tr><td><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">Record time (UTC)</a>:</td><td> ' + record[property] + '</td></tr>';*/
//                         } else {
//                             info += '<div class="container-2"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" style="color:black !important" title="' + infoField[1] + '"><b>Updated:</b><br>' + formatDate(new Date(record[property] + "Z")) + '</a></td></div>';
//                             /*info += '<tr><td><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">Record time (UTC)</a>:</td><td> ' + record[property] + "Z" + '</td></tr>';*/
//                         }
//                     } else {
//                         if (record[property].includes("Z")) {
//                             info += '<div class="container-2" style="color:black !important"><b>Updated:</b><br>' + formatDate(new Date(record[property])) + '</div>';
//                             /*info += '<tr><td>Record time (UTC):</td><td> ' + record[property] + '</li>';*/
//                         } else if (record[property].includes("+")) {
//                             info += '<div class="container-2" style="color:black !important"><b>Updated:</b><br>' + formatDate(new Date(record[property])) + '</div>';
//                             /*info += '<tr><td>Record time (UTC):</td><td> ' + frecord[property] + '</td></tr>';*/
//                         } else {
//                             info += '<div class="container-2" style="color:black !important"><b>Updated:</b><br>' + formatDate(new Date(record[property] + "Z")) + '</div>';
//                             /*info += '<tr><td>Record time (UTC):</td><td> ' + record[property] + "Z" + '</td></tr>';*/
//                         }
//                     }
                } else if (property === "recordid") {
                    linkToMore["recordid"] = record[property];
                    infoField = findField(fields, property);
                    /*if (infoField != null) {
                        info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-container="body" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: ' + record[property] + '</li>';
                    } else {
                        info += '<li class="list-group-item">' + property + ': ' + record[property] + '</li>';
                    }*/
                } else if (property === "dataset_id") {
                    linkToMore["dataset_id"] = record[property];
                    infoField = findField(fields, property);
                    /*if (infoField != null) {
                        info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: ' + record[property] + '</li>';
                    } else {
                        info += '<li class="list-group-item">Dataset id: ' + record[property] + '</li>';
                    }*/
                } else if (property === "dataset_name") {
                    infoField = findField(fields, property);
                    // changes the name based on the system
                    if (record[property] != null) {
                        if (record[property] == "luftdaten") {
                            kilolima = "Luftdaten";
                        }
                        else if (record[property] == "smart-citizen-kits") {
                            kilolima = "Smart Citizen Kit";
                        }
                        else if (record[property] == "automatic-urban-and-rural-network-aurn") {
                            kilolima = "DEFRA AURN";
                        }
                        else if (record[property] == "air-quality-data-continuous") {
                            kilolima = "Bristol Air Quality Continuous";
                        }
                        else if (record[property] == "air-quality-no2-diffusion-tube-data") {
                            kilolima = "Bristol NO2 Diffusion Tubes";
                        }
                        else {
                            kilolima = record[property];
                        }
                    }
                    if (infoField != null) {
                        info += '<div class = "container-1" id = "sensorName"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" style="color:black !important" "title="' + infoField[1] + '">' + kilolima + '</a></div>';
                    } else {
                        info += '<div class = "container-1 style="color:black !important" ">'+ kilolima +'</td></div>';
                    }
                    if (assoColors.indexOf(record[property]) !== -1) {
                        color = colors[assoColors.indexOf(record[property])];
                    } else {
                        if (assoColors.length >= (colors.length - 1)) {
                            color = "black";
                            assoColors.push(record[property]);
                        }
                        color = colors[assoColors.length];
                        assoColors.push(record[property]);
                    }
                } else if ((property === "year") || (property === "day")) {
                    infoField = findField(fields, property);
                    if (infoField != null) {
                        info += '<div class="container-2"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" style="color:black !important" title="' + infoField[1] + '"><b>Updated:</b><br>' + record[property] + '</a></div>';
                    } else {
                        info += '<div class="container-2" style="color:black !important"><b>Updated:</b><br>' + record[property] + '</div>';
                    }
                } else if (property === "location") {

                    check = true;
                    infoField = findField(fields, property);
                    if (infoField != null) {
                        info += '<div class="container-3"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" style="color:black !important" title="' + infoField[1] + '">' + record[property] + '</a></div>';
                    } else {
                        info += '<div class="container-3 style="color:black !important" ">' + property + record[property] + '</div>';
                    }
                } else if (property === "geojson") {
                    // the commented code can ebe removed (it's present to help debug if necessary)
//                     linkToMore["geojson"] = JSON.stringify(record[property]);
                    position = record[property].coordinates.slice(0, 2);
                    info = handleGeojson(info, record, property, linkToMore, check);
//                     if (check != true) {
//                         //info += '<tr><td><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="Longitude, Latitude, (Altitude)">Position</a>:</td><td> ' + record[property].coordinates.toString() + '</td></tr>';
//                     } else {

//                         //reverse geocode from api
//                      var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+
//                      record[property].coordinates.toString()
//                      +".json?access_token="+mapbox_public_key;

//                      var addressName
//                      $.ajaxSettings.async = false;
//                      $.getJSON(url, function(geoJSON) {
//                      // JSON result in `data` variable
//                         addressName = geoJSON["features"][0]["text"];
//                     });
//                         if(addressName!=null){
//                         //info += '<div class="container-3"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" style="color:black !important" title="Longitude, Latitude, (Altitude)">' + record[property].coordinates.toString() + '</a></div>';
//                         info += '<div class="container-3"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" style="color:black !important" title="Longitude, Latitude, (Altitude)">' + addressName.toString() + '</a></div>';
//                         }
//                     }
                }
                else if (property === "siteid") {
                    infoField = findField(fields, property);
                    if (infoField != null) {
                        /*info += '<tr><td><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>:</td><td> ' + record[property] + '</td></tr>';*/
                    } else {
                        /*info += '<tr><td>' + property + ':</td><td> ' + record[property] + '</td></tr>';*/
                    }
                }

                else if ((property === "_id") || (property.includes("rank"))) {
                    // Dismiss
                } else {
                    infoField = findField(fields, property);
                    if (!isNaN(record[property])) {
                        valueToDisplay = +record[property].toFixed(2)
                    } else {
                        valueToDisplay = +parseFloat(record[property]).toFixed(2);
                    }
                    if (infoField != null) {
                        if (infoField[2] != null) {
                            last_data += '<tr><td><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: </td><td>' + valueToDisplay + ' ' + infoField[2] + '</td></tr>';
                        } else {
                            last_data += '<tr><td><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: </td><td>' + valueToDisplay + '</td></tr>';
                        }
                    } else {
                        last_data += '<tr><td>' + property + ': </td><td>' + record[property] + '</td></tr>';
                    }
                }
            }
        }
    }

// Function to get color in popup marker based on aqi level
function getPopupAqiColor(record, aqi) {
    // The pollutants to use in order of importance
    var pollutants = ["pm25", "pm10", "no2", "o3", "so2"]; 
    for (var pollutant of pollutants) {
        if (record[pollutant] != null && record[pollutant] >= 0) {
            return getAQIValue(pollutant, record[pollutant], aqi)[2];
        }
    }
    return null;  // If all pollutants to use are null, return null
}

    //make changes here
    /*returnElem += '<div class="tab-content" id="popupTabContent' + index + '">\
                   <div class="tab-pane fade show active" id="info' + index + '" role="tabpanel" aria-labelledby="info' + index + '-tab"><ul class="list-group">' + info + '</tbody></table></ul></div>\
                   <div class="tab-pane fade show" id="lastdata' + index + '" role="tabpanel" aria-labelledby="lastdata' + index + '-tab"><ul class="list-group">' + last_data + '</tbody></table></ul></div>\
                   <div class="text-center tab-pane fade show" id="more' + index + '" role="tabpanel" aria-labelledby="more' + index + '-tab">\
                   <p class="text-justify">If you want to see parameters over time for this device, click on the link below.</p>\
                   <a href="/airdata/dataovertime?device=' + encodeURIComponent(JSON.stringify(linkToMore)) + '" target="_blank">\
                   <span class="align-middle">More data</span>\
                   <i class="material-icons md-28 align-middle">launch</i></a></div></div>';*/

    returnElem += info + '</div>\
                    <ul class="list-group">' + last_data + '</tbody></table></ul>\
                    \
                    <p class="text-justify">If you want to see parameters over time for this device, click on the link below.</p>\
                    <a href="/airdata/dataovertime?device=' + encodeURIComponent(JSON.stringify(linkToMore)) + '" target="_blank">\
                    <span class="align-middle">More data</span>\
                    <i class="material-icons md-28 align-middle">launch</i></a></div></div>';
    new mapboxgl.Marker({
        color: color
    })
        .setLngLat(position)
        .setPopup(new mapboxgl.Popup({ className: 'popups' })
            .setHTML(returnElem))
        .addTo(map);
    return assoColors;
}

function handleGeojson(info, record, property, linkToMore, check) {
    //linkToMore refers to More data link in a pop up
    linkToMore["geojson"] = JSON.stringify(record[property]);
    if (check == false) {
        //info += '<tr><td><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="Longitude, Latitude, (Altitude)">Position</a>:</td><td> ' + record[property].coordinates.toString() + '</td></tr>';
    } else {
        //reverse geocode from api
        var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/"+
        record[property].coordinates.toString()
        +".json?access_token="+mapbox_public_key;

        var addressName
        $.ajaxSettings.async = false;
        $.getJSON(url, function(geoJSON) {
        // JSON result in `data` variable
            addressName = geoJSON["features"][0]["text"];
        });
        if(addressName!=null){
            //info += '<div class="container-3"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" style="color:black !important" title="Longitude, Latitude, (Altitude)">' + record[property].coordinates.toString() + '</a></div>';
            info += '<div class="container-3"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" style="color:black !important" title="Longitude, Latitude, (Altitude)">' + addressName.toString() + '</a></div>';
        }
    }
    return info;
}

function handleDateTime (infoField, info, record, property) {
    if (infoField != null) {
        if (record[property].includes("Z")) {
            info += '<div class="container-2"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" style="color:black !important" title="' + infoField[1] + '"><b>Updated:</b><br>' + formatDate(new Date(record[property])) + '</a></div>';
            /*info += '<tr><td><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">Record time (UTC)</a>:</td><td> ' + record[property] + '</td></tr>';*/
        } else if (record[property].includes("+")) {
            info += '<div class="container-2"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" style="color:black !important" title="' + infoField[1] + '"><b>Updated:</b><br>' + formatDate(new Date(record[property])) + '</a></div>';
            /*info += '<tr><td><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">Record time (UTC)</a>:</td><td> ' + record[property] + '</td></tr>';*/
        } else {
            info += '<div class="container-2"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" style="color:black !important" title="' + infoField[1] + '"><b>Updated:</b><br>' + formatDate(new Date(record[property] + "Z")) + '</a></td></div>';
            /*info += '<tr><td><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">Record time (UTC)</a>:</td><td> ' + record[property] + "Z" + '</td></tr>';*/
        }
    } else {
        if (record[property].includes("Z")) {
            info += '<div class="container-2" style="color:black !important"><b>Updated:</b><br>' + formatDate(new Date(record[property])) + '</div>';
            /*info += '<tr><td>Record time (UTC):</td><td> ' + record[property] + '</li>';*/
        } else if (record[property].includes("+")) {
            info += '<div class="container-2" style="color:black !important"><b>Updated:</b><br>' + formatDate(new Date(record[property])) + '</div>';
            /*info += '<tr><td>Record time (UTC):</td><td> ' + frecord[property] + '</td></tr>';*/
        } else {
            info += '<div class="container-2" style="color:black !important"><b>Updated:</b><br>' + formatDate(new Date(record[property] + "Z")) + '</div>';
            /*info += '<tr><td>Record time (UTC):</td><td> ' + record[property] + "Z" + '</td></tr>';*/
        }
    }
    return info;
}

function fillDeviceDetails() {
    const record = JSON.parse($("#last_record").text()).record;
    const fields = JSON.parse($("#last_record").text()).fields;
    var info = "";
    var last_data = "";
    var select_options = "";
    var position;
    var infoField = [];
    for (var property in record) {
        if (record.hasOwnProperty(property)) {
            if (record[property] != null) {
                if (property === "date_time") {
                    infoField = findField(fields, property);
                    if (infoField != null) {
                        if (record[property].includes("Z")) {
                            last_data += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">Date</a>: <span>' + formatDate(new Date(record[property])); + '</span></li>';
                            last_data += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">Record time (UTC)</a>: <span>' + record[property] + '</span></li>';
                        } else if (record[property].includes("+")) {
                            last_data += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">Date</a>: ' + formatDate(new Date(record[property])); + '</span></li>';
                            last_data += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">Record time (UTC)</a>: <span>' + frecord[property] + '</span></li>';
                        } else {
                            last_data += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">Date</a>: <span>' + formatDate(new Date(record[property] + "Z")); + '</span></li>';
                            last_data += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">Record time (UTC)</a>: <span>' + record[property] + "Z" + '</span></li>';
                        }
                    } else {
                        if (record[property].includes("Z")) {
                            last_data += '<li class="list-group-item">Date: <span>' + formatDate(new Date(record[property])); + '</span></li>';
                            last_data += '<li class="list-group-item">Record time (UTC): <span>' + record[property] + '</span></li>';
                        } else if (record[property].includes("+")) {
                            last_data += '<li class="list-group-item">Date: <span>' + formatDate(new Date(record[property])); + '</span></li>';
                            last_data += '<li class="list-group-item">Record time (UTC): <span>' + frecord[property] + '</span></li>';
                        } else {
                            last_data += '<li class="list-group-item">Date: <span>' + formatDate(new Date(record[property] + "Z")); + '</span></li>';
                            last_data += '<li class="list-group-item">Record time (UTC): <span>' + record[property] + "Z" + '</span></li>';
                        }
                    }
                } else if (property === "geojson") {
                    position = record[property].coordinates.slice(0, 2);
                    last_data += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="Longitude, Latitude, (Altitude)">Position</a>: <span>' + record[property].coordinates.toString() + '</span></li>';
                } else if (property === "recordid") {
                    infoField = findField(fields, property);
                    if (infoField != null) {
                        last_data += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-container="body" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: <span>' + record[property] + '</span></li>';
                    } else {
                        last_data += '<li class="list-group-item">' + property + ': ' + record[property] + '</li>';
                    }
                } else if (property === "dataset_id") {
                    infoField = findField(fields, property);
                    if (infoField != null) {
                        info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: <span>' + record[property] + '</span></li>';
                    } else {
                        info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="ID of the dataaset">Dataset id</a>: <span>' + record[property] + '</span></li>';
                    }
                } else if (property === "dataset_name") {
                    infoField = findField(fields, property);
                    if (infoField != null) {
                        info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: <span>' + record[property] + '</span></li>';
                    } else {
                        info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="Name of the dataset">Dataset name</a>: <span>' + record[property] + '</span></li>';
                    }
                } else if (property === "organization") {
                    info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="Source of the dataset">Source</a>: <span>' + record[property] + '</span></li>';
                } else if ((property === "siteid") || (property === "location") || (property === "deviceid")) {
                    infoField = findField(fields, property);
                    if (infoField != null) {
                        info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: <span>' + record[property] + '</span></li>';
                    } else {
                        info += '<li class="list-group-item">' + property + ': ' + record[property] + '</li>';
                    }
                } else if ((property === "year") || (property === "readings_count") || (property === "day")) {
                    infoField = findField(fields, property);
                    if (infoField != null) {
                        last_data += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: <span>' + record[property] + '</span></li>';
                    } else {
                        last_data += '<li class="list-group-item">' + property + ': </span>' + record[property] + '</span></li>';
                    }
                } else if ((property === "_id") || (property.includes("rank"))) {
                    // Dismiss
                } else {
                    infoField = findField(fields, property);
                    if (infoField != null) {
                        if (infoField[2] != null) {
                            last_data += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: <span>' + record[property] + ' ' + infoField[2] + '</span></li>';
                            if (!isNaN(record[property])) {
                                select_options += '<option value="' + property + '">' + infoField[0] + ' (' + infoField[2] + ')' + '</option>';
                            }
                        } else {
                            last_data += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: <span>' + record[property] + '</span></li>';
                            if (!isNaN(record[property])) {
                                select_options += '<option value="' + property + '">' + infoField[0] + '</option>';
                            }
                        }
                    } else {
                        last_data += '<li class="list-group-item">' + property + ': <span>' + record[property] + '</span></li>';
                    }
                }
            }
        }
    }
    $("#device_info").html(info);
    $("#select-parameters").html(select_options);
    $("#last_data").html(last_data);
    new mapboxgl.Marker({
        color: "#3f5ece"
    })
        .setLngLat(position)
        .addTo(map);
    map.setCenter(position);
    map.setZoom(13);
}

// Function to prepare the data for Home > Get Pollution Data > From Location
function fromLocationDisplay() {
    const results = JSON.parse($("#data_res").text());
    const long = $("#long").text();
    const lat = $("#lat").text();
    const eu_aqi = JSON.parse($("#eu_aqi").text());
    map.setCenter(JSON.parse("[" + long + "," + lat + "]"));
    map2.setCenter(JSON.parse("[" + long + "," + lat + "]"));
    buildDataTable(results.data, results.fields, eu_aqi, results.devices);
    var sendToAllProcess = {};
    for (var property in results.devices) {
        if (results.devices.hasOwnProperty(property)) {
            sendToAllProcess[property] = {
                fields: results.fields,
                records: results.devices[property]
            };
        }
    }
    processAllResult(sendToAllProcess);
    addMarkerUser(parseFloat(long), parseFloat(lat), map);
    map.setZoom(11);
    map2.setZoom(13);
    prepPolygons(results.zones, results.fields);
    addMarkerUser(parseFloat(long), parseFloat(lat), map2);
}

function addMarkerUser(long, lat, name) {
    new mapboxgl.Marker({
        color: "#97CBFF"
    })
        .setLngLat([long, lat])
        .setPopup(new mapboxgl.Popup({ className: 'popups-req-location' })
            .setHTML("This is the requested location"))
        .addTo(name);
}

function prepPolygons(zones, fields) {
    var newZones = [];
    for (var property in zones) {
        if (zones.hasOwnProperty(property)) {
            newZones = newZones.concat(zones[property]);
        }
    }
    addPolygonsMap(newZones, fields);
}

function addPolygonsMap(records, fields) {
    const markerColors = ["blue", "red", "green", "yellow", "purple", "orange", "cyan", "grey", "black"];
    var remainColors = true;
    var assoColors = [];
    var elemStr = '<h4><a href="#" id="map-legend-close-2" class="text-info"><i class="material-icons md-28 align-middle">keyboard_arrow_right</i><span class="align-middle">Area Info</span></a></h4>';
    elemStr += '<div><span style="background-color: #97CBFF"></span>Chosen location</div>';
    $("#map-legend-2").html(elemStr);
    map2.on('load', function () {
        var record = {};
        for (var k = 0; k < records.length; k++) {
            if (records[k] != null) {
                if ((records[k].hasOwnProperty("geojson")) && (records[k].hasOwnProperty("recordid"))) {
                    record = records[k];
                    record["surface_area"] = Math.abs(polygonArea(records[k].geojson.coordinates[0]));
                }
            }
        }
        records.sort(function (a, b) { return b["surface_area"] - a["surface_area"] });

        for (var k = 0; k < records.length; k++) {
            if (k >= markerColors.length) {
                remainColors = false;
            }

            if (records[k] != null) {
                if ((records[k].hasOwnProperty("geojson")) && (records[k].hasOwnProperty("recordid"))) {
                    assoColors.push(records[k].dataset_name);
                    map2.addLayer({
                        'id': records[k].recordid,
                        'type': 'fill',
                        'source': {
                            'type': 'geojson',
                            'data': {
                                'type': 'Feature',
                                'geometry': records[k].geojson,
                                "properties": {
                                    "description": formatPopupPolygon(records[k], k, fields)
                                }
                            }
                        },
                        'layout': {},
                        'paint': {
                            'fill-color': (remainColors ? markerColors[k] : "black"),
                            "fill-opacity": ["case",
                                ["boolean", ["feature-state", "hover"], false],
                                1,
                                0.5
                            ]
                        }
                    });

                    map2.on('click', records[k].recordid, function (e) {
                        new mapboxgl.Popup({ className: 'popups' })
                            .setLngLat(e.lngLat)
                            .setHTML(e.features[0].properties.description)
                            .addTo(map2);
                    });

                    map2.on('mouseenter', records[k].recordid, function (e) {
                        // Change the cursor style as a UI indicator.
                        map2.getCanvas().style.cursor = 'pointer';
                    });

                    map2.on('mouseleave', records[k].recordid, function () {
                        map2.getCanvas().style.cursor = '';
                    });
                }
            }
        }

        var elemStr = '';
        for (var k = 0; k < assoColors.length; k++) {
            if (k !== markerColors.length) {
                elemStr += '<div><span style="background-color: ' + markerColors[k] + '"></span>' + assoColors[k] + '</div>';
            } else {
                elemStr += '<div><span style="background-color: black"></span>' + assoColors[k] + '</div>';
            }
        }
        $("#map-legend-2").append(elemStr);
    });
}

function polygonArea(arr) {
    var sum = 0;
    for (var i = 0, l = arr.length - 1; i < l; i++) {
        sum += (arr[i][0] * arr[i + 1][1] - arr[i + 1][0] * arr[i][1]);
    }
    return sum / 2;
}

function formatPopupPolygon(record, index, fields) {
    var returnElem = '<ul class="nav nav-tabs" id="popupTab' + index + '" role="tablist">\
                      <li class="nav-item">\
                      <a class="nav-link active link-popup-tab" id="infoTab'+ index + '" data-toggle="tab" href="#info' + index + '" role="tab" aria-controls="info' + index + '" aria-selected="true">Info</a>\
                      </li><li class="nav-item">\
                      <a class="nav-link link-popup-tab" id="lastdataTab'+ index + '" data-toggle="tab" href="#lastdata' + index + '" role="tab" aria-controls="lastdata' + index + '" aria-selected="false">Recent Reading</a>\
                      </li>';
    var info = "";
    var last_data = "";
    var infoField = [];
    for (var property in record) {
        if (record.hasOwnProperty(property)) {
            if (record[property] != null) {
                if (property === "date_time") {
                    infoField = findField(fields, property);
                    if (infoField != null) {
                        if (record[property].includes("Z")) {
                            info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">Date</a>: ' + formatDate(new Date(record[property])); + '</li>';
                            info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">Record time (UTC)</a>: ' + record[property] + '</li>';
                        } else if (record[property].includes("+")) {
                            info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">Date</a>: ' + formatDate(new Date(record[property])); + '</li>';
                            info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">Record time (UTC)</a>: ' + frecord[property] + '</li>';
                        } else {
                            info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">Date</a>: ' + formatDate(new Date(record[property] + "Z")); + '</li>';
                            info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">Record time (UTC)</a>: ' + record[property] + "Z" + '</li>';
                        }
                    } else {
                        if (record[property].includes("Z")) {
                            info += '<li class="list-group-item">Date: ' + formatDate(new Date(record[property])); + '</li>';
                            info += '<li class="list-group-item">Record time (UTC): ' + record[property] + '</li>';
                        } else if (record[property].includes("+")) {
                            info += '<li class="list-group-item">Date: ' + formatDate(new Date(record[property])); + '</li>';
                            info += '<li class="list-group-item">Record time (UTC): ' + frecord[property] + '</li>';
                        } else {
                            info += '<li class="list-group-item">Date: ' + formatDate(new Date(record[property] + "Z")); + '</li>';
                            info += '<li class="list-group-item">Record time (UTC): ' + record[property] + "Z" + '</li>';
                        }
                    }
                } else if (property === "recordid") {
                    infoField = findField(fields, property);
                    if (infoField != null) {
                        info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-container="body" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: ' + record[property] + '</li>';
                    } else {
                        info += '<li class="list-group-item">' + property + ': ' + record[property] + '</li>';
                    }
                } else if (property === "dataset_id") {
                    infoField = findField(fields, property);
                    if (infoField != null) {
                        info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: ' + record[property] + '</li>';
                    } else {
                        info += '<li class="list-group-item">Dataset id: ' + record[property] + '</li>';
                    }
                } else if (property === "dataset_name") {
                    infoField = findField(fields, property);
                    if (infoField != null) {
                        info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: ' + record[property] + '</li>';
                    } else {
                        info += '<li class="list-group-item">Dataset name: ' + record[property] + '</li>';
                    }
                } else if ((property === "siteid") || (property === "location") || (property === "year") || (property === "readings_count") || (property === "wardid") || (property === "ward_name") || (property === "objectid") || (property === "lsoa11_code") || (property === "lsoa11_local_name") || (property === "day")) {
                    infoField = findField(fields, property);
                    if (infoField != null) {
                        info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: ' + record[property] + '</li>';
                    } else {
                        info += '<li class="list-group-item">' + property + ': ' + record[property] + '</li>';
                    }
                } else if ((property === "_id") || (property.includes("rank")) || (property === "geojson") || (property === "ward_center") || (property === "surface_area")) {
                    // Dismiss
                } else {
                    infoField = findField(fields, property);
                    if (infoField != null) {
                        if (infoField[2] != null) {
                            last_data += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: ' + record[property] + ' ' + infoField[2] + '</li>';
                        } else {
                            last_data += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: ' + record[property] + '</li>';
                        }
                    } else {
                        last_data += '<li class="list-group-item">' + property + ': ' + record[property] + '</li>';
                    }
                }
            }
        }
    }
    returnElem += '<div class="tab-content" id="popupTabContent' + index + '">\
                   <div class="tab-pane fade show active" id="info' + index + '" role="tabpanel" aria-labelledby="info' + index + '-tab"><ul class="list-group">' + info + '</ul></div>\
                   <div class="tab-pane fade show" id="lastdata' + index + '" role="tabpanel" aria-labelledby="lastdata' + index + '-tab"><ul class="list-group">' + last_data + '</ul></div>\
                   </div>';
    return returnElem;
}

// Function to prepare the data for Home > Get Pollution Data > From Location
function buildDataTable(record, fields, aqi, results) {
    var valueAQI, result,
        returnElem = "",
        infoField = [],
        valueToDisplay,
        valuesAQI = [],
        colorAQI = "",
        classToAdd = "",
        foundDevice = false;
    for (var property in record) {
        classToAdd = "";
        if (record.hasOwnProperty(property)) {
            if (record[property] != null) {
                foundDevice = false;
                for (var propertyDev in results) {
                    if (results.hasOwnProperty(propertyDev)) {
                        for (var k = 0; k < results[propertyDev].length; k++) {
                            if ((results[propertyDev][k]).hasOwnProperty(property)) {
                                if (results[propertyDev][k][property] === record[property]) {
                                    if (propertyDev === "Yearly") {
                                        classToAdd = "table-warning";
                                    } else if (propertyDev === "Daily") {
                                        classToAdd = "table-info";
                                    }
                                    foundDevice = true;
                                    break;
                                }
                            }
                        }
                        if (foundDevice) {
                            break;
                        }
                    }
                }

                infoField = findField(fields, property);
                if (!isNaN(record[property])) {
                    valueToDisplay = +record[property].toFixed(2)
                } else {
                    valueToDisplay = +parseFloat(record[property]).toFixed(2);
                }
                result = getAQIValue(property, valueToDisplay, aqi);
                if (result != null) {
                    valueAQI = result[0];
                    valuesAQI.push(result[1]);
                    colorAQI = result[2];
                    if (infoField != null) {
                        if (infoField[2] != null) {
                            returnElem += '<tr class="' + classToAdd + '"><th scope="row" data-toggle="tooltip" data-placement="bottom" title="' + infoField[1] + '">' + infoField[0] + '</th>\
                                        <td data-toggle="tooltip" data-placement="bottom" title="' + valueToDisplay.toString() + ' ' + infoField[2] + '">' + valueToDisplay.toString() + ' ' + infoField[2] + '</td>\
                                        <td style="color:'+ colorAQI + '";>' + valueAQI + '</td></tr>';
                        } else {
                            returnElem += '<tr class="' + classToAdd + '><th scope="row" data-toggle="tooltip" data-placement="bottom" title="' + infoField[1] + '">' + infoField[0] + '</th>\
                                        <td data-toggle="tooltip" data-placement="bottom" title="' + valueToDisplay.toString() + " " + infoField[2] + + '">' + valueToDisplay.toString() + '</td>\
                                        <td></td></tr>';
                        }
                    } else {
                        returnElem += '<tr class="' + classToAdd + '><th scope="row">' + property + '</th>\
                                    <td data-toggle="tooltip" data-placement="bottom" title="' + valueToDisplay.toString() + " " + infoField[2] + + '">' + valueToDisplay.toString() + '</td>\
                                    <td></td></tr>';
                    }
                } else {
                    if (infoField != null) {
                        if (infoField[2] != null) {
                            returnElem += '<tr class="' + classToAdd + '"><th scope="row" data-toggle="tooltip" data-placement="bottom" title="' + infoField[1] + '">' + infoField[0] + '</th>\
                                        <td data-toggle="tooltip" data-placement="bottom" title="' + valueToDisplay.toString() + " " + infoField[2] + '">' + valueToDisplay.toString() + ' ' + infoField[2] + '</td>\
                                        <td></td></tr>';
                        } else {
                            returnElem += '<tr class="' + classToAdd + '"><th scope="row" data-toggle="tooltip" data-placement="bottom" title="' + infoField[1] + '">' + infoField[0] + '</th>\
                                        <td data-toggle="tooltip" data-placement="bottom" title="' + valueToDisplay.toString() + " " + infoField[2] + '">' + valueToDisplay.toString() + '</td>\
                                        <td></td></tr>';
                        }
                    } else {
                        returnElem += '<tr class="' + classToAdd + '"><th scope="row">' + property + '</th>\
                                    <td data-toggle="tooltip" data-placement="bottom" title="' + valueToDivalueToDisplay.toString() + " " + infoField[2] + '">' + valueToDisplay.toString() + '</td>\
                                    <td></td></tr>';
                    }
                }
            }
        }
    }
    if (valuesAQI.length > 0) {
        $("#aqi_result").html(aqi[0].index_levels[Math.max.apply(null, valuesAQI)].name);
        $("#aqi_result").css("color", aqi[0].index_levels[Math.max.apply(null, valuesAQI)].color);
        var levels_pol = "Levels of pollution are: ";
        for (k = 0; k < aqi[0].index_levels.length; k++) {
            levels_pol += '<span style="color:' + aqi[0].index_levels[k].color + ';">' + aqi[0].index_levels[k].name + ' </span>';
        }
        $("#levels_pollution").html(levels_pol + ".");
    }
    $("#data_table_body").html(returnElem);
}

function getAQIValue(name, value, aqi) {
    for (var k = 0; k < aqi.length; k++) {
        if (aqi[k] != null) {
            if (aqi[k].name === name) {
                for (var i = 0; i < aqi[k].index_levels.length; i++) {
                    if ((aqi[k].index_levels[i].values[0] <= value) && (aqi[k].index_levels[i].values[1] >= value)) {
                        return [aqi[k].index_levels[i].name, i, aqi[k].index_levels[i].color];
                    }
                }
            }
        }
    }
    return null;
}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function findColorFeature(properties, aqi) {
    var colorValue = 0;
    var value;
    for (var k = 0; k < aqi.length; k++) {
        if (aqi[k] != null) {
            for (var property in properties) {
                if (properties.hasOwnProperty(property)) {
                    if (property !== "description") {
                        if (aqi[k].name === property) {
                            value = properties[property];
                            for (var i = 0; i < aqi[k].index_levels.length; i++) {
                                if ((aqi[k].index_levels[i].values[0] <= value) && (aqi[k].index_levels[i].values[1] >= value)) {
                                    if (i > colorValue) {
                                        colorValue = i;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return aqi[0].index_levels[colorValue].color;
}

//Function to setup data for Air Quality Map
function setPopupFeature(properties, aqi, fields) {
    var returnElem = '<br><ul class="list-group">';
    var infoField, color,
        newProperty = {};

    for (var property in properties) {
        if (properties.hasOwnProperty(property)) {
            newProperty[property] = properties[property]
            color = findColorFeature(newProperty, aqi);
            infoField = findField(fields, property);
            if (!isNaN(properties[property])) {
                valueToDisplay = +properties[property].toFixed(2)
            } else {
                valueToDisplay = +parseFloat(properties[property]).toFixed(2);
            }
            if (infoField != null) {
                returnElem += '<li class="list-group-item" style="color:' + color + '; width:13em"><a href="#" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: ' + valueToDisplay + ' ' + infoField[2] + '</li>';
            } else {
                returnElem += '<li class="list-group-item" style="color:' + color + '; width:13em"><a href="#">' + property + '</a>: ' + valueToDisplay + '</li>';
            }
        }
    }
    returnElem += '</ul>';
    return returnElem;
}

function displayPolygonCollection() {
    const results = JSON.parse($("#data_res").text());
    map.setCenter(results.area.center);
    $('#table_index_levels > tbody > tr > th').each(function () {
        var value = $(this).text();
        var infoField = findField(results.fields, value);
        if (infoField != null) {
            $(this).text(infoField[0].toUpperCase());
        } else {
            $(this).text(value.toUpperCase());
        }
    });

    map.on("load", function () {
        var feature;
        var colorForLayer;
        for (var k = 0; k < results.data.features.length; k++) {
            feature = results.data.features[k];
            if (!isEmpty(feature.properties)) {
                feature.properties["description"] = setPopupFeature(feature.properties, results.aqi, results.fields);
                colorForLayer = findColorFeature(feature.properties, results.aqi);
                map.addLayer({
                    'id': 'cell' + k.toString(),
                    'type': 'fill',
                    'source': {
                        'type': 'geojson',
                        'data': feature,
                    },
                    'layout': {},
                    'paint': {
                        'fill-color': colorForLayer,
                        "fill-opacity": 0.5
                    }
                });

                map.on('click', 'cell' + k.toString(), function (e) {
                    new mapboxgl.Popup({ className: 'popups' })
                        .setLngLat(e.lngLat)
                        .setHTML(e.features[0].properties.description)
                        .addTo(map);
                    $(function () {
                        $('[data-toggle="tooltip"]').tooltip({
                            container: 'body'
                        });
                    });
                });

                map.on('mouseenter', 'cell' + k.toString(), function (e) {
                    map.getCanvas().style.cursor = 'pointer';
                });

                map.on('mouseleave', 'cell' + k.toString(), function () {
                    map.getCanvas().style.cursor = '';
                });
            }
        }
    });

    if (results.aqi[0].index_levels.length > 0) {
        var elemStr = '<h4><a href="#" id="map-legend-close" class="text-info"><i class="material-icons md-28 align-middle">keyboard_arrow_right</i><span class="align-middle">Levels</span></a></h4>';
        for (var k = 0; k < results.aqi[0].index_levels.length; k++) {
            if ("color" in results.aqi[0].index_levels[k] && "name" in results.aqi[0].index_levels[k])
                elemStr += '<div><span style="background-color: ' + results.aqi[0].index_levels[k].color + '"></span>' + results.aqi[0].index_levels[k].name + '</div>';
        }
        elemStr += '<div><span style="border: 1px solid black; background-color: white"></span>No data found in this cell</div>'
        $("#map-legend").prepend(elemStr);
    }
}

if ((window.location.href.indexOf("fromlocation") > -1) || (window.location.href.indexOf("anydevice") > -1) || (window.location.href.indexOf("dataovertime") > -1) || (window.location.href.indexOf("datalocation") > -1) || (window.location.href.indexOf("aqi") > -1)) {

    // Map
    mapboxgl.accessToken = mapbox_public_key;
    console.log("MApbox token: " + mapboxgl.accessToken)

    var bounds = [
        [-3.0092414592144143, 51.30440291202908,], // Southwest coordinates
        [-2.3307087078190345, 51.5741181250848] // Northeast coordinates
    ];

    // Define marker
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-2.6, 51.47], // Default Bristol Center
        zoom: 10,
        maxBounds: bounds
    });

    /* Map parameters */
    // Scale indicator
    var scale = new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: 'metric'
    });
    map.addControl(scale);

    // Full screen button
    map.addControl(new mapboxgl.FullscreenControl());

    // Navigation controls
    var nav = new mapboxgl.NavigationControl();
    map.addControl(nav);

    if ((window.location.href.indexOf("anydevice") > -1) || (window.location.href.indexOf("fromlocation") > -1)) {

        // Geocoder
        var geocoder = new MapboxGeocoder({ // Initialize the geocoder
            accessToken: mapboxgl.accessToken, // Set the access token
            mapboxgl: mapboxgl, // Set the mapbox-gl instance
            marker: false
        });
        // Add the geocoder to the map
        map.addControl(geocoder, 'top-left');

        // Geolocator
        var geolocate = new mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        });
        map.addControl(geolocate);
    }

    if (window.location.href.indexOf("fromlocation") > -1) {

        /* Choose location */
        // Define marker
        var marker;

        // Geocoder
        geocoder.on('result', function (result) {
            if (marker != null) {
                marker.remove();
            }
            marker = new mapboxgl.Marker({
                color: "#3f5ece"
            })
                .setLngLat(result.result.center)
                .addTo(map);
            $("#longitudeInput").val(result.result.center[0]);
            $("#latitudeInput").val(result.result.center[1]);
        })

        // Geolocator
        geolocate.on('geolocate', function (e) {
            if (marker != null) {
                marker.remove();
            }
            $("#longitudeInput").val(e.coords.longitude);
            $("#latitudeInput").val(e.coords.latitude);
        });

        // Add a marker by click
        map.on('click', function (e) {
            if (enableAddMarkerByClick) {
                if (marker != null) {
                    marker.remove();
                }
                marker = new mapboxgl.Marker({
                    color: "#3f5ece"
                })
                    .setLngLat(e.lngLat) // Marker [lng, lat] coordinates
                    .addTo(map); // Add the marker to the map
                $("#longitudeInput").val(e.lngLat.lng);
                $("#latitudeInput").val(e.lngLat.lat);
            }
        });

    } else if (window.location.href.indexOf("anydevice") > -1) {
        choiceProcess("All", true);
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
            $('[data-toggle-second="tooltip"]').tooltip();
        });
    } else if (window.location.href.indexOf("dataovertime") > -1) {
        fillDeviceDetails();
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
            $('[data-toggle-second="tooltip"]').tooltip();
        });
    } else if (window.location.href.indexOf("datalocation") > -1) {
        // Define marker
        var map2 = new mapboxgl.Map({
            container: 'map2',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-2.6, 51.47], // Default Bristol Center
            zoom: 10
        });

        /* Map parameters */
        // Scale indicator
        var scale2 = new mapboxgl.ScaleControl({
            maxWidth: 100,
            unit: 'metric'
        });
        map2.addControl(scale2);

        // Full screen button
        map2.addControl(new mapboxgl.FullscreenControl());

        // Navigation controls
        var nav2 = new mapboxgl.NavigationControl();
        map2.addControl(nav2);

        fromLocationDisplay();
        $(function () {
            $('[data-toggle="tooltip"]').tooltip({
                container: 'body'
            });
        });
    } else if (window.location.href.indexOf("aqi") > -1) {
        displayPolygonCollection();
        $(function () {
            $('[data-toggle="tooltip"]').tooltip({
                container: 'body'
            });
        });
    }
}
