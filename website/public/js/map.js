var enableAddMarkerByClick = false;

function formatDate(date) {
    var monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];
    return date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear() + ' at ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}

function choiceProcess(choice, firstTime) {
    const results = JSON.parse($("#data_res").text());
    if (firstTime){
        buildChoiceLegend(results);
        map.setCenter(JSON.parse("["+$("#area_center").attr("data-value")+"]"));
    }
    if (choice === "All") {
        processAllResult(results);
    } else {
        processResult(results[choice]);
    }
}

function buildLegend(colors, assoColors){
    var elemStr = '<h4><a href="#" id="map-legend-close" class="text-info"><i class="material-icons md-28 align-middle">keyboard_arrow_right</i><span class="align-middle">Datasets</span></a></h4>';
    for (var k=0; k<assoColors.length; k++){
        if (k !== colors.length){
            elemStr += '<div><span style="background-color: '+colors[k]+'"></span>'+assoColors[k]+'</div>';
        } else {
            elemStr += '<div><span style="background-color: black"></span>'+assoColors[k]+'</div>';
        }
    }
    $("#map-legend").html(elemStr);
}

function buildChoiceLegend(results){
    var elemStr = '<option value="All" selected>All</option>';
    for (var property in results) {
        if (results.hasOwnProperty(property)) {
            elemStr += '<option value=\"'+property+'\">'+property+'</option>';
        }
    }
    $("#choiceInterval").html(elemStr);
}

function processResult(result) {
    const markerColors = ["blue", "red", "green", "yellow", "purple", "orange", "cyan", "grey", "black"];
    var assoColors = [];
    var records = result["records"];
    for (var i = 0; i < records.length; i++) {
        assoColors = buildMarkPopRecord(records[i], i.toString(), result["fields"], markerColors, assoColors);
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
            assoColors = buildMarkPopRecord(records[i], index.toString(), fields, markerColors, assoColors);
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

function buildMarkPopRecord(record, index, fields, colors, assoColors) {
    var returnElem = '<ul class="nav nav-tabs" id="popupTab' + index + '" role="tablist">\
                      <li class="nav-item">\
                      <a class="nav-link active link-popup-tab" id="infoTab'+ index + '" data-toggle="tab" href="#info' + index + '" role="tab" aria-controls="info' + index + '" aria-selected="true">Info</a>\
                      </li><li class="nav-item">\
                      <a class="nav-link link-popup-tab" id="lastdataTab'+ index + '" data-toggle="tab" href="#lastdata' + index + '" role="tab" aria-controls="lastdata' + index + '" aria-selected="false">Last data</a>\
                      </li><li class="nav-item">\
                      <a class="nav-link link-popup-tab" id="moreTab'+ index + '" data-toggle="tab" href="#more' + index + '" role="tab" aria-controls="more' + index + '" aria-selected="false">More data</a>\
                      </li></ul>';
    var info = "";
    var last_data = "";
    var position;
    var linkRecordID = "";
    var linkDatasetID = "";
    var linkPosition =  "";
    var infoField = [];
    var color;
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
                } else if (property === "geojson") {
                    position = record[property].coordinates.slice(0, 2);
                    info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="Longitude, Latitude, (Altitude)">Position</a>: ' + record[property].coordinates.toString() + '</li>';
                } else if (property === "recordid") {
                    linkRecordID = record[property];
                    infoField = findField(fields, property);
                    if (infoField != null) {
                        info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-container="body" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: ' + record[property] + '</li>';
                    } else {
                        info += '<li class="list-group-item">' + property + ': ' + record[property] + '</li>';
                    }
                } else if (property === "dataset_id") {
                    linkDatasetID = record[property];
                    infoField = findField(fields, property);
                    if (infoField != null) {
                        info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: ' + record[property] + '</li>';
                    } else {
                        info += '<li class="list-group-item">' + property + ': ' + record[property] + '</li>';
                    }
                } else if (property === "dataset_name") {
                    infoField = findField(fields, property);
                    if (infoField != null) {
                        info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: ' + record[property] + '</li>';
                    } else {
                        info += '<li class="list-group-item">' + property + ': ' + record[property] + '</li>';
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
                } else if ((property === "siteid") || (property === "location") || (property === "year") || (property === "readings_count")) {
                    infoField = findField(fields, property);
                    if (infoField != null) {
                        info += '<li class="list-group-item"><a href="#" class="text-info" data-toggle="tooltip" data-placement="top" title="' + infoField[1] + '">' + infoField[0] + '</a>: ' + record[property] + '</li>';
                    } else {
                        info += '<li class="list-group-item">' + property + ': ' + record[property] + '</li>';
                    }
                } else if (property === "_id") {
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
                   <div class="text-center tab-pane fade show" id="more' + index + '" role="tabpanel" aria-labelledby="more' + index + '-tab">\
                   <p class="text-justify">If you want to see parameters over time for this device, click on the link below.</p>\
                   <a onclick=\"getDataOverTime('+ linkRecordID + ',' + linkDatasetID + ')\" href="#">\
                   <span class="align-middle">More data</span>\
                   <i class="material-icons md-28 align-middle">launch</i></a></div></div>';
    new mapboxgl.Marker({
        color: color
    })
        .setLngLat(position)
        .setPopup(new mapboxgl.Popup({ className: 'popups' }) // add popups
            .setHTML(returnElem))
            .addTo(map);
    return assoColors;
}

if ((window.location.href.indexOf("fromlocation") > -1) || (window.location.href.indexOf("anydevice") > -1)) {

    // Map
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2V2am9sbHk3OCIsImEiOiJjanl0bHBrN2owNTAyM21wcmJwMGFja3J4In0.VnKj_T9KkVVjkVdcG65KYA';

    // Define marker
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-2.6, 51.47], // Default Bristol Center
        zoom: 10
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
                enableAddMarkerByClick = false;
            }
        });

    }

    if (window.location.href.indexOf("anydevice") > -1) {
        choiceProcess("All", true);
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
            $('[data-toggle-second="tooltip"]').tooltip();
        });
    }
}
