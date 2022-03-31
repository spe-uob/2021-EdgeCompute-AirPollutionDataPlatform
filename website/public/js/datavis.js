//Bubble Graph
// Source: https://cal-heatmap.com/

//get data from the page
const keys = JSON.parse($("#data_res").text()).fields;
const records = JSON.parse($("#data_res").text()).records;


// set the dimensions and margins of the graph
var margin = {top: 40, right: 80, bottom: 60, left: 30},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Thresholds for aqi ratings
const legendThresholds = {
    "pm25": [10, 20, 25, 50],
    "pm10": [20, 25, 50, 100],
    "no2": [40, 100, 200, 400],
    "o3": [80, 120, 180, 240],
    "so2": [100, 200, 350, 500]
};

if (window.location.href.indexOf("dataovertime") > -1) {
      $('#select-parameters').on('change', function (e) {
          var key = ($(this).val())[0];
          generateHeatMap(key)
      });
}

function generateHeatMap(key){
        d3.selectAll('svg').remove();
        d3.selectAll('button').remove();
        d3.selectAll('span').remove();
        d3.selectAll('p').remove();

        let btn1 = document.createElement("button");
        let btn2 = document.createElement("button");
        let title = document.createElement("span");
        let description = document.createElement("p");
        title.innerHTML = "Calendar Heatmap";
        title.style.display = "table";
        title.style.margin = "0 auto";
        description.innerHTML = "Hover over a coloured box to show parameter value for the given time";
        btn1.innerHTML = "previous";
        btn1.setAttribute("id", "previousSelector-a-previous");
        btn1.setAttribute("class", "btn btn-primary");
        btn2.innerHTML = "next";
        btn2.setAttribute("id", "previousSelector-a-next");
        btn2.setAttribute("class", "btn btn-primary");
        document.getElementById("heatmap").append(btn1);
        document.getElementById("heatmap").append(btn2);
        document.getElementById("heatmap").append(title);
        document.getElementById("heatmap").append(description);

        var obj = new Object();
        var dtime;

        for (const field of keys) {
            if (field.id === key) {
                var unit = field.unit;
            }
        }

        //create data to cal
        for (var record of records) 
        {
          dtime = Date.parse(record.date_time)/1000;
          obj[dtime] = record[key];
        }


        var start = new Date(Date.parse(records[records.length-1].date_time));
        var range = records.length;


//config the heatmap
        var cal = new CalHeatMap();
        cal.init({
          itemSelector: document.getElementById("heatmap"),
          itemName: [key, key],
          domain: "day",
          subDomain: "hour",
          cellSize: 20,
          data: obj,
          start: start,
          minDate: start,
          //maxDate: new Date(Date.parse(records[0].date_time)),
          displayLegend: true,
          legendHorizontalPosition: "left",
          legendVerticalPosition: "top",
          legendMargin: [10, 0, 10, 0],
          legendTitleFormat: {
              lower: "{name}: less than {min}" + unit,
              inner: "{name}: between {down} and {up}" + unit,
              upper: "{name}: more than {max}" + unit
          },
          subDomainTitleFormat: {
            empty: "{date}",
            filled: "{name}: {count}" + unit + " {connector} {date}"
          },
          range: range,
          previousSelector: "#previousSelector-a-previous",
          nextSelector: "#previousSelector-a-next"
        });

        cal.setLegend(getLegendThreshold(cal, key));
}

function getLegendThreshold(cal, key) {
    if (legendThresholds.hasOwnProperty(key)) {
        return legendThresholds[key];
    } else {
        cal.removeLegend();  // If threshold not available, remove legend
        return [];  // Empty array makes all blocks the same color
    }
}
