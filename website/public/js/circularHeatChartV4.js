// 7 days
var radial_labels = Last7Days();
// 24 hours
var segment_labels = ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00"];
//today's date
var today = new Date();
//parameter enum
const parameterEnum = Object.freeze({"pm10":0, "pm25":1, "no":2, "no2":3, "noX":4});

//populate radial_labels with previous 7 days


//get data from data_res
const data_res = document.getElementById('data_res').innerHTML;
const data_res_json = JSON.parse(data_res);


//if any select changed
$(document).ready(function() {
    //pop locations option to select
    //get all keys from data_res_json
    var keys = Object.keys(data_res_json);
    //populate select
    for (var i = 0; i < keys.length; i++) {
        $('#sensor-1').append($('<option>', {
            value: keys[i],
            text: keys[i]
        }));
        $('#sensor-2').append($('<option>', {
            value: keys[i],
            text: keys[i]
        }));
    }

    //when select changed
    $('#sensor-1').change(function() {
        $("#chart-1").empty();
        $("#chart-2").empty();
        //get selected value
        whenSelected()})
    //when select changed
    $('#sensor-2').change(function() {
        $("#chart-1").empty();
        $("#chart-2").empty();
        //get selected value
        whenSelected()})
        //when select changed
    $('#parameter').change(function() {
        $("#chart-1").empty();
        $("#chart-2").empty();
        //get selected value
        whenSelected()})
})  //end of document ready

function whenSelected(){
    var selected_value1 = $('#sensor-1').val();
    var selected_value2 = $('#sensor-2').val();
    var charts = [];

    //for location 1
    //get recent 7 days data from data_res_json
    var dataset1 = getRecentData(data_res_json[selected_value1], $('#parameter').val())
    var dataset2 = getRecentData(data_res_json[selected_value2], $('#parameter').val())
    loadCircularHeatMap(dataset1, document.getElementById('chart-1'),
    radial_labels, segment_labels)
    loadCircularHeatMap(dataset2, document.getElementById('chart-2'),
    radial_labels, segment_labels)
}

function Last7Days () {
    var result = [];
    for (var i=0; i<7; i++) {
        var d = new Date();
        d.setDate(d.getDate() - i);
        result.push( d.getDate())
    }
    return(result.join(','));
}

function getRecentData(data, param){
    var unixDate;
    var theDate;
    i = parameterEnum[param];
    dataset = [];
    var diff;
    //iterate through data and populate the dataset
    for (var key in data) {
        unixDate = Date.parse(key);
        theDate = new Date(key)
        // To calculate the time difference of two dates
        diff = today - unixDate;
        if(diff< 604800000){
            dataset.push({
            Date: theDate.getDate(),
            Time: segment_labels[theDate.getHours()],
            value: data[key][i]})
        }
    }
    return dataset;
}

function location2Name(data, location){
    return 0
}


function loadCircularHeatMap (dataset, dom_element_to_append_to,radial_labels,segment_labels) {

    var margin = {top: 50, right: 50, bottom: 50, left: 50};
    var width = 600 - margin.left - margin.right;

    var height = width;
    var innerRadius = width/14;
    var segmentHeight = (width - margin.top - margin.bottom - 2*innerRadius )/(2*radial_labels.length)

    var chart = circularHeatChart()
    .innerRadius(innerRadius)
    .segmentHeight(segmentHeight)
    .range(["white", "#01579b"])
    .radialLabels(radial_labels)
    .segmentLabels(segment_labels);

    chart.accessor(function(d) {return d.value;})

    var svg = d3.select(dom_element_to_append_to)
    .selectAll('svg')
    .data([dataset])
    .enter()
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append('g')
    .attr("transform",
        "translate(" + ( (width )/2 - (radial_labels.length*segmentHeight + innerRadius)  ) + "," + margin.top + ")")
    .call(chart);

    var tooltip = d3.select(dom_element_to_append_to)
    .append('div')
    .attr('class', 'tooltip');

    tooltip.append('div')
    .attr('class', 'month');
    tooltip.append('div')
    .attr('class', 'value');
    tooltip.append('div')
    .attr('class', 'type');

    svg.selectAll("path")
    .on('mouseover', function(d) {
        tooltip.select('.month').html("<b> Date: " + d.Date + "</b>");
        tooltip.select('.type').html("<b> Time: " + d.Time + "</b>");
        tooltip.select('.value').html("<b> Value: " + d.value + "</b>");

        tooltip.style('display', 'block');
        tooltip.style('opacity',2);
    })
    .on('mousemove', function(d) {

        tooltip.style('top', (d3.event.layerY + 10) + 'px')
        .style('left', (d3.event.layerX - 25) + 'px');
    })
    .on('mouseout', function(d) {
        tooltip.style('display', 'none');
        tooltip.style('opacity',0);
    });
}

function circularHeatChart() {
    var margin = {top: 20, right: 20, bottom: 20, left: 20},
    innerRadius = 20,
    numSegments = 12,
    segmentHeight = 20,
    domain = null,
    range = ["white", "red"],
    accessor = function(d) {return d;},
    radialLabels = segmentLabels = [];

    function chart(selection) {
        selection.each(function(data) {
            var svg = d3.select(this);

            var offset = innerRadius + Math.ceil(data.length / numSegments) * segmentHeight;
            g = svg.append("g")
                .classed("circular-heat", true)
                .attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")");

            var autoDomain = false;
            if (domain === null) {
                domain = d3.extent(data, accessor);
                autoDomain = true;
            }
            var color = d3.scale.linear().domain(domain).range(range);
            if(autoDomain)
                domain = null;

            g.selectAll("path").data(data)
                .enter().append("path")
                .attr("d", d3.svg.arc().innerRadius(ir).outerRadius(or).startAngle(sa).endAngle(ea))
                .attr("stroke", function(d) {return "#4f5b69";})
                .attr("fill", function(d) {return color(accessor(d));});

            // Unique id so that the text path defs are unique - is there a better way to do this?
            var id = d3.selectAll(".circular-heat")[0].length;

            //Radial labels
            var lsa = 0.01; //Label start angle
            var labels = svg.append("g")
                .classed("labels", true)
                .classed("radial", true)
                .attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")");

            labels.selectAll("def")
                .data(radialLabels).enter()
                .append("def")
                .append("path")
                .attr("id", function(d, i) {return "radial-label-path-"+id+"-"+i;})
                .attr("d", function(d, i) {
                    var r = innerRadius + ((i + 0.2) * segmentHeight);
                    return "m" + r * Math.sin(lsa) + " -" + r * Math.cos(lsa) +
                            " a" + r + " " + r + " 0 1 1 -1 0";
                });

            labels.selectAll("text")
                .data(radialLabels).enter()
                .append("text")
                .append("textPath")
                .attr("xlink:href", function(d, i) {return "#radial-label-path-"+id+"-"+i;})
                .style("font-size", "16px")
                .text(function(d) {return d;});

            //Segment labels
            var segmentLabelOffset = 2;
            var r = innerRadius + Math.ceil(data.length / numSegments) * segmentHeight + segmentLabelOffset;
            labels = svg.append("g")
                .classed("labels", true)
                .classed("segment", true)
                .attr("transform", "translate(" + parseInt(margin.left + offset) + "," + parseInt(margin.top + offset) + ")");

            labels.append("def")
                .append("path")
                .attr("id", "segment-label-path-"+id)
                .attr("d", "m0 -" + r + " a" + r + " " + r + " 0 1 1 -1 0");

            labels.selectAll("text")
                .data(segmentLabels).enter()
                .append("text")
                .append("textPath")
                .attr("xlink:href", "#segment-label-path-"+id)
                .style("font-size", "16px")
                .attr("startOffset", function(d, i) {return i * 100 / numSegments + "%";})
                .text(function(d) {return d;});
        });

    }

    /* Arc functions */
    ir = function(d, i) {
        return innerRadius + Math.floor(i/numSegments) * segmentHeight;
    }
    or = function(d, i) {
        return innerRadius + segmentHeight + Math.floor(i/numSegments) * segmentHeight;
    }
    sa = function(d, i) {
        return (i * 2 * Math.PI) / numSegments;
    }
    ea = function(d, i) {
        return ((i + 1) * 2 * Math.PI) / numSegments;
    }

    /* Configuration getters/setters */
    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.innerRadius = function(_) {
        if (!arguments.length) return innerRadius;
        innerRadius = _;
        return chart;
    };

    chart.numSegments = function(_) {
        if (!arguments.length) return numSegments;
        numSegments = _;
        return chart;
    };

    chart.segmentHeight = function(_) {
        if (!arguments.length) return segmentHeight;
        segmentHeight = _;
        return chart;
    };

    chart.domain = function(_) {
        if (!arguments.length) return domain;
        domain = _;
        return chart;
    };

    chart.range = function(_) {
        if (!arguments.length) return range;
        range = _;
        return chart;
    };

    chart.radialLabels = function(_) {
        if (!arguments.length) return radialLabels;
        if (_ == null) _ = [];
        radialLabels = _;
        return chart;
    };

    chart.segmentLabels = function(_) {
        if (!arguments.length) return segmentLabels;
        if (_ == null) _ = [];
        segmentLabels = _;
        return chart;
    };

    chart.accessor = function(_) {
        if (!arguments.length) return accessor;
        accessor = _;
        return chart;
    };

    return chart;
}