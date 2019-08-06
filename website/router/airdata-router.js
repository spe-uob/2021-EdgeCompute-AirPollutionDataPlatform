var express = require('express')
const { decorateRouter } = require('@awaitjs/express');

var router = decorateRouter(express.Router());

const airdataService = require('../service/airdata-service');

router.get('/fromlocation', async function (req, res, next) {
    try {
        if (!('longitude' in req.query)) {
            throw {name: "InputMissingError", message: "Parameters are missing in the query url."};
        }
        if (!('latitude' in req.query)) {
            throw {name: "InputMissingError", message: "Parameters are missing in the query url."};
        }
        
        const response = await airdataService.getDataLocation(req.query.longitude, req.query.latitude);
        res.send(JSON.stringify({
            code: 0,
            data: {
                result: response
            }
        }));
    } catch (err) {
        next(err);
    }
});

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

module.exports = router;
