//Bubble Graph

//get data
const keys = JSON.parse($("#data_res").text()).fields;
const records = JSON.parse($("#data_res").text()).records;
console.log(keys);
console.log(records);

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

        let btn1 = document.createElement("button");
        let btn2 = document.createElement("button");
        btn1.innerHTML = "previous";
        btn1.setAttribute("id", "previousSelector-a-previous");
        btn1.setAttribute("class", "btn btn-primary");
        btn2.innerHTML = "next";
        btn2.setAttribute("id", "previousSelector-a-next");
        btn2.setAttribute("class", "btn btn-primary");
        document.getElementById("heatmap").append(btn1);
        document.getElementById("heatmap").append(btn2);

        var obj = new Object();
        var dtime;

        //create data to cal
        for (var record of records) 
        {
          dtime = Date.parse(record.date_time)/1000;
          obj[dtime] = record[key];
        }


        var start = new Date(Date.parse(records[records.length-1].date_time));
        var range = records.length;



        var cal = new CalHeatMap();
        cal.init({
          itemSelector: document.getElementById("heatmap"),
          domain: "day",
          subDomain: "hour",
          cellSize: 20,
          data: obj,
          start: start,
          minDate: start,
          //maxDate: new Date(Date.parse(records[0].date_time)),
          displayLegend: true,
          legendHorizontalPosition: "center",
          legendVerticalPosition: "top",
          range: range,
          previousSelector: "#previousSelector-a-previous",
          nextSelector: "#previousSelector-a-next",
          legend: legendThresholds[key]
        })
}
