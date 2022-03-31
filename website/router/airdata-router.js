var express = require('express')
const { decorateRouter } = require('@awaitjs/express');

var router = decorateRouter(express.Router());

const airdataService = require('../service/airdata-service');

// Manages the "Get Pollution Data > From Location" Functionality and render Data from Location?
router.get('/datalocation', async function (req, res, next) {
    try {
        if (!('longitude' in req.query)) {
            throw {name: "InputMissingError", message: "Parameters are missing in the query url."};
        }
        if (!('latitude' in req.query)) {
            throw {name: "InputMissingError", message: "Parameters are missing in the query url."};
        }
        
        const response = await airdataService.getDataLocation(req.query.longitude, req.query.latitude);
        const aqi = await airdataService.getAQI();
        res.render('datafromlocation.html', {
            code: 0,
            location: response.location,
            data: JSON.stringify(response.result),
            aqi: JSON.stringify(aqi)
        });
    } catch (err) {
        next(err);
    }
});

// Manages the "Get Pollution Data > From Location" Functionality and checks that the co-ordinates submitted are correct
router.get('/checkcoordinates', async function (req, res, next) {
    try {
        if (!('longitude' in req.query)) {
            throw {name: "InputMissingError", message: "Parameters are missing in the query url."};
        }
        if (!('latitude' in req.query)) {
            throw {name: "InputMissingError", message: "Parameters are missing in the query url."};
        }
        
        const response = await airdataService.checkDataLocation(req.query.longitude, req.query.latitude);
        res.send(JSON.stringify({
            code: 0,
            data: response
        }));
    } catch (err) {
        next(err);
    }
});

// Manage Get Pollution Data > Any Device (View All Sensors)
router.get('/anydevice', async function (req, res, next) {
    try {
        const response = (!('area' in req.query)) ? await airdataService.getAllData(null) : await airdataService.getAllData(req.query.area);
        res.render('anydevice.html', {
            code: 0,
            data: response
        });
    } catch (err) {
        next(err);
    }
});

// Manage Air Quality Map Functionality
router.get('/aqi', async function (req, res, next) {
    try {
        if (!('area' in req.query)) {
            const response = (!('diameter' in req.query)) ? await airdataService.getAQIArea(null, null) : await airdataService.getAQIArea(req.query.diameter, null);
            const listareas =  await airdataService.getListAreas(null);
            const diameterParams = await airdataService.getCellValues();
            res.render('aqi.html', {
                code: 0,
                data: JSON.stringify(response),
                aqiMust: response.aqi,
                listareas: listareas,
                diameterParams: diameterParams,
                diameter: (!('diameter' in req.query)) ? diameterParams.size_default : req.query.diameter
            });
        } else {
            const responseBis = (!('diameter' in req.query)) ? await airdataService.getAQIArea(null, req.query.area) : await airdataService.getAQIArea(req.query.diameter, req.query.area);
            const listareas =  await airdataService.getListAreas(req.query.area);
            const diameterParams = await airdataService.getCellValues();
            res.render('aqi.html', {
                code: 0,
                data: JSON.stringify(responseBis),
                aqiMust: responseBis.aqi,
                listareas: listareas,
                diameterParams: diameterParams,
                diameter: (!('diameter' in req.query)) ? diameterParams.size_default : req.query.diameter
            });
        }
    } catch (err) {
        next(err);
    }
});


// Manage the About page
router.get('/about', async function (req, res, next) {
    try {
        const aqi = await airdataService.getAQI();
        res.render('about.html', {
            code: 0,
            aqiMust: aqi
        });
    } catch (err) {
        next(err);
    }
});

// Manages the "More Data" Functionality
router.get('/dataovertime', async function (req, res, next) {
    try {
        if (!('device' in req.query)) {
            throw {name: "InputMissingError", message: "Parameter is missing in the query url."};
        }
        
        const response = await airdataService.getDataOverTime(req.query.device);

        console.log(response);
        res.render('dataovertime.html',{
            code: 0,
            data: response
        });
    } catch (err) {
        next(err);
    }
});



module.exports = router;
