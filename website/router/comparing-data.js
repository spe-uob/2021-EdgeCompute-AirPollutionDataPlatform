var express = require('express');
const { decorateRouter } = require('@awaitjs/express');

var router = decorateRouter(express.Router());

const airdataService = require('../service/airdata-service');


//Manage the "Comparing data from 2 locations" Functionality
router.get('/', async function (req, res, next) {
    try {
        var allDevices = (!('area' in req.query)) ? await airdataService.getAllData(null) : await airdataService.getAllData(req.query.area);
        //get geo location as key and get data as value
        var locations = {};
        //allLocations["Hourly"]["records"] is a list of all the data
        allDevices = JSON.parse(allDevices["data"]);
        for (let i = 0; i < allDevices["Hourly"]["records"].length; i++) {
            //get the geo location
            let location = allDevices["Hourly"]["records"][i]["location"];
            //if the geo location is not in the locations object, add it
            if (!(location in locations)) {
                //add data that needed by dataOverTime function to
                //the first element of the value in locations object
                locations[location] = [{},{},{}];
                locations[location][0]["interval"] = "Hourly";
                locations[location][0]["recordid"] = allDevices["Hourly"]["records"][i]["recordid"];
                locations[location][0]["dataset_id"] = allDevices["Hourly"]["records"][i]["dataset_id"];
                locations[location][0]["geojson]"] = JSON.stringify(allDevices["Hourly"]["records"][i]["geojson"]);

                //add geojson to the second element of the value in locations object
                locations[location][1] = allDevices["Hourly"]["records"][i]["geojson"];

                //add data that got from dataOverTime function to
                //the second element of the value in locations object
                locations[location][2] = (await airdataService.getDataOverTime(locations[location])).data;
            }
        }

        res.render('comparing.ejs', {
            code: 0,
            data: JSON.stringify(locations)
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;