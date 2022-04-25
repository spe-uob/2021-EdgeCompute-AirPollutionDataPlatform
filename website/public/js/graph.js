function getTrafficDataFromAPI(lat, long, startDate) {
    var today = new Date();

    //round startDate and today to the mid night
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    //todays' date to ISOString
    today = encodeURIComponent(today.toISOString().replace(/\.\d+Z/,'Z'));
    startDate = encodeURIComponent(startDate.toISOString().replace(/\.\d+Z/,'Z'));

    //get data of detectors that is within 999999m of the selected location
    var deviceIDurl = "https://opendata.bristol.gov.uk/api/records/1.0/search/?dataset=dim-traffic-counters&q=&rows=100&facet=countdevicedescription&facet=link&exclude.effectiveforcounts=No&geofilter.distance="
                +lat+"%2C"+long+"%2C"+"999999";

    var devideID;
    $.ajaxSettings.async = false;
    $.getJSON(deviceIDurl, function(data) {
        var records = data["records"];
        //get the device ID of the first record,
        //the first record is always the closest one
        devideID = records[0].fields.sk_dim_countdeviceid;
   });

   //get data from the selected device
    var dataurl = "https://opendata.bristol.gov.uk/api/records/1.0/search/?dataset=fact-traffic-counts&q=rollupdatetime%3A%5B"
                    +startDate+"+TO+"+today
                    +"%5D&rows=600&refine.sk_dim_countdeviceid="+devideID;
   var trafficData;
   $.ajaxSettings.async = false;
   $.getJSON(dataurl, function(data) {
        trafficData = data["records"];
    });
    return trafficData;
}


function sameHour(date1, date2) {
    //check if the date is the same and the hour is the same
    return ( date1.getMonth() == date2.getMonth() &&
        date1.getDate() == date2.getDate() &&
        date1.getHours() == date2.getHours());
}

function sameDate(date1, date2){
    //check if the date is the same
    return ( date1.getMonth() == date2.getMonth() &&
        date1.getDate() == date2.getDate());
}

function getIndexInLyAxis(list_yaxis, info) {
    for (var i = 0; i < list_yaxis.length; i++) {
        if (list_yaxis[i].title.text === info) {
            return i;
        }
    }
    return null
}

function isEven(n) {
    return n % 2 == 0;
}

function getLineTitle(unit, info) {
    if (unit.includes("μg/m3")) {
        return "Concentration";
    } else if (unit.includes("%")) {
        return "Pourcentage";
    } else {
        return info;
    }
}

function recreateGraph(list_parameters) {
    if (list_parameters.length > 0) {
        const fields = JSON.parse($("#data_res").text()).fields;
        const records = JSON.parse($("#data_res").text()).records;


        //if records does not contains traffic
        if (records[0].traffic == null) {
        //set coordinates
        //if the number is smaller than 0, then it is longtitude
        //if the number is larger than 0, then it is latitude
        var last_record = JSON.parse($("#last_record").text()).record;
        var coordinates = last_record.geojson.coordinates;
        if (coordinates[0] < 0) {
            var longitude = coordinates[0];
            var latitude = coordinates[1];
        }else {
            var longitude = coordinates[1];
            var latitude = coordinates[0];
        }

        //get traffic data via API
        //get the date of the last record
        var startDate = new Date((records[records.length-1].date_time));
        var data = getTrafficDataFromAPI(latitude, longitude, startDate);
    
        //insert traffic data to the records by using the the_date
        var data_date;
        var records_date;
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < records.length; j++) {
                data_date = data[i].fields.rollupdatetime;
                records_date = records[j].date_time;
                if (sameHour(new Date(data_date), new Date(records_date))) {
                    records[j].traffic = data[i].fields.hourlyflow;
                }
            }
        }
        //for records that has no traffic data
        //use the data from the same date
        for (var i = 0; i < records.length; i++) {
            if (records[i].traffic == null) {
                for (var j = 0; j < records.length; j++) {
                    data_date = data[i].fields.rollupdatetime;
                    records_date = records[j].date_time;
                    if (sameDate(new Date(data_date), new Date(records_date))) {
                        records[j].traffic = data[i].fields.hourlyflow;
                    }
                }
            }
        }
    }


        var series = [];
        var LyAxis = [];
        var infoField = [];
        var list_param_yAxis = [];
        var indexYaxis = 0;
        var recLength = records.length;
        for (var i = 0; i < list_parameters.length; i++) {
            //if the parameter is traffic
            if (list_parameters[i] == "traffic") {
                infoField = ["traffic count", "hourly flow", "verhicles"];
            }else{
                infoField = findField(fields, list_parameters[i]);
            }
            if (infoField != null && infoField[2] != null) {
                indexYaxis = getIndexInLyAxis(LyAxis, getLineTitle(infoField[2], infoField[1]));
                if (indexYaxis != null) {
                    list_param_yAxis.push(indexYaxis);
                } else {
                    LyAxis.push({
                        labels: {
                            format: '{value} (' + infoField[2] + ')',
                        },
                        title: {
                            text: getLineTitle(infoField[2], infoField[1]),
                        },
                        opposite: !isEven(LyAxis.length)
                    });
                    list_param_yAxis.push(LyAxis.length - 1);
                }
                series.push({
                    name: infoField[1],
                    data: [],
                    yAxis: list_param_yAxis[i],
                    tooltip: {
                        valueSuffix: " " + infoField[2]
                    }
                });
            } else {
                indexYaxis = getIndexInLyAxis(LyAxis, "Value");
                if (indexYaxis != null) {
                    list_param_yAxis.push(indexYaxis);
                } else {
                    LyAxis.push({
                        labels: {
                            format: '{value}',
                        },
                        title: {
                            text: "Value",
                        },
                        opposite: !isEven(LyAxis.length)
                    });
                    list_param_yAxis.push(LyAxis.length - 1);
                }
                series.push({
                    name: infoField[1],
                    data: [],
                    yAxis: list_param_yAxis[i],
                    tooltip: {
                        valueSuffix: " "
                    }
                });
            }
        }

        var record = {};
        var dataToAdd = [];
        var dateToPush;
        for (var i = 0; i < list_parameters.length; i++) {
            dataToAdd = [];
            for (var k = 0; k < recLength; k++) {
                record = records[recLength - (k + 1)];
                if (record.hasOwnProperty(list_parameters[i])) {
                    if (record.hasOwnProperty("date_time")) {
                        if ((record["date_time"].includes("Z")) || (record["date_time"].includes("+"))) {
                            dateToPush = (new Date(record["date_time"])).getTime();
                        } else {
                            dateToPush = (new Date(record["date_time"] + "Z")).getTime();
                        }
                        dataToAdd.push([dateToPush, record[list_parameters[i]]]);
                    } else if (record.hasOwnProperty("year")) {
                        dateToPush = (new Date(record["year"] + "-01-01T00:00Z")).getTime();
                        dataToAdd.push([dateToPush, record[list_parameters[i]]]);
                    } else if (record.hasOwnProperty("day")) {
                        dateToPush = (new Date(record["day"] + "T00:00Z")).getTime();
                        dataToAdd.push([dateToPush, record[list_parameters[i]]]);
                    }
                }
            }
            series[i].data = dataToAdd;
        }

        if (list_parameters.length == 1) {
            const eu_aqi = JSON.parse($("#eu_aqi").text());
            for (var i = 0; i < eu_aqi.length; i++) {
                if (eu_aqi[i].name === list_parameters[0]) {
                    const index_levels = eu_aqi[i].index_levels;
                    var il_values = [];
                    var plotBands = [];
                    var stylePlotBands = {
                        color: '#606060'
                    };
                    stylePlotBands["font-size"] = "12px";
                    for (var k = 0; k < index_levels.length; k++) {
                        il_values = index_levels[k];
                        plotBands.push({
                            from: il_values.values[0],
                            to: il_values.values[1],
                            color: il_values.color,
                            label: {
                                text: il_values.name,
                                rotation: -90,
                                textAlign: "center",
                                x: 20,
                                style: stylePlotBands
                            }
                        });
                    }
                    var only_lyaxis = LyAxis[0];
                    only_lyaxis["plotBands"] = plotBands;
                    LyAxis[0] = only_lyaxis;
                    break;
                }
            }
        }

        if (list_parameters.length != 1) {
            Highcharts.chart('graphs', {
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: 'Choose the parameters you want to display above'
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: LyAxis,
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                series: series
            });
        } else {
            Highcharts.chart('graphs', {
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: 'Parameters selected as functions of time'
                },
                xAxis: {
                    type: 'datetime'
                },
                yAxis: LyAxis,
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                },
                series: series
            });
        }
    }
}
