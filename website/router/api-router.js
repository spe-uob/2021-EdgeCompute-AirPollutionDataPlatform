var express = require('express')
const { decorateRouter } = require('@awaitjs/express');

var router = decorateRouter(express.Router());

const airdataService = require('../service/airdata-service');

router.get('/', async function (req, res, next) {
    try {
        const response = await airdataService.getLists();
        res.render('api.html', {
            code: 0,
            data: response
        });
    } catch (err) {
        next(err);
    }
});

router.get('/fromlocation', async function (req, res, next) {
    try {
        if (!('longitude' in req.query)) {
            throw {name: "InputMissingError", message: "Parameters are missing in the query url."};
        }
        if (!('latitude' in req.query)) {
            throw {name: "InputMissingError", message: "Parameters are missing in the query url."};
        }

        if (!(typeof req.query.longitude === 'string' || req.query.longitude instanceof String)) {
            throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
        }
        if (!(typeof req.query.latitude === 'string' || req.query.latitude instanceof String)) {
            throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
        }
        
        const response = await airdataService.getDataLocation(req.query.longitude, req.query.latitude);
        res.send(JSON.stringify(response));
    } catch (err) {
        next(err);
    }
});

router.get('/aqi', async function (req, res, next) {
    try {
        if (!('area' in req.query)) {
            throw { name: "InputMissingError", message: "Parameters are missing in the query url." };
        }
        if (!('diameter' in req.query)) {
            throw { name: "InputMissingError", message: "Parameters are missing in the query url." };
        }
        if (!(typeof req.query.area === 'string' || req.query.area instanceof String)) {
            throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
        }
        if (!(typeof req.query.diameter === 'string' || req.query.diameter instanceof String)) {
            throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
        }

        const response = await airdataService.getAQIArea(req.query.diameter, req.query.area);
        res.send(JSON.stringify(response));
    } catch (err) {
        next(err);
    }
});

router.get('/anydevice', async function (req, res, next) {
    try {
        if (!('interval' in req.query)) {
            throw { name: "InputMissingError", message: "Parameters are missing in the query url" };
        }
        if (!('area' in req.query)) {
            throw { name: "InputMissingError", message: "Parameters are missing in the query url." };
        }
        if (!(typeof req.query.area === 'string' || req.query.area instanceof String)) {
            throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
        }
        if (!(typeof req.query.interval === 'string' || req.query.interval instanceof String)) {
            throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
        }

        const response = await airdataService.getAllDataAPI(req.query.area, req.query.interval);
        res.send(JSON.stringify(response));
    } catch (err) {
        next(err);
    }
});

router.get('/dataset_search', async function (req, res, next) {
    try {
        if (!('dataset_id' in req.query)) {
            throw { name: "InputMissingError", message: "Parameters are missing in the query url." };
        }

        if (!(typeof req.query.dataset_id === 'string' || req.query.dataset_id instanceof String)) {
            throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
        }

        if (!('options' in req.query)) {
            const response = (!('filters' in req.query)) ? await airdataService.getDatasearch(req.query.dataset_id, [], null) : await airdataService.getDatasearch(req.query.dataset_id, req.query.filters, null);
            res.send(JSON.stringify(response));
        } else if (typeof req.query.options === 'object' && req.query.options !== null) {
            const responseOpt = (!('filters' in req.query)) ? await airdataService.getDatasearch(req.query.dataset_id, [], req.query.options) : await airdataService.getDatasearch(req.query.dataset_id, req.query.filters, req.query.options);
            res.send(JSON.stringify(responseOpt));
        } else {
            throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
        }
    } catch (err) {
        next(err);
    }
});

router.get('/dataset_info', async function (req, res, next) {
    try {
        if (!('dataset_id' in req.query)) {
            throw { name: "InputMissingError", message: "Parameters are missing in the query url." };
        }
        if (!(typeof req.query.dataset_id === 'string' || req.query.dataset_id instanceof String)) {
            throw { name: "QueryParameterError", message: "The parameter given does not respect the format required." };
        }

        const response = await airdataService.getFieldsAPI(req.query.dataset_id);
        res.send(JSON.stringify(response));
    } catch (err) {
        next(err);
    }
});

module.exports = router;
