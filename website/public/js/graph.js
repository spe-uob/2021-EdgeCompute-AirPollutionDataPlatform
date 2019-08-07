
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
    console.log(list_parameters);
    if (list_parameters.length > 0) {
        const fields = JSON.parse($("#data_res").text()).fields;
        const records = JSON.parse($("#data_res").text()).records;

        var series = [];
        var LyAxis = [];
        var infoField = [];
        var list_param_yAxis = [];
        var indexYaxis = 0;
        var recLength = records.length;
        for (var i = 0; i < list_parameters.length; i++) {
            infoField = findField(fields, list_parameters[i]);
            if (infoField[2] != null) {
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
            }

            series.push({
                name: infoField[1],
                data: [],
                yAxis: list_param_yAxis[i],
                tooltip: {
                    valueSuffix: " " + infoField[2]
                }
            });
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
                    stylePlotBands["font-size"] = "16px";
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
        }
    }
}
