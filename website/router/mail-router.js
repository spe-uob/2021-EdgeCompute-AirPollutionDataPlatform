var express = require('express')
const { decorateRouter } = require('@awaitjs/express');
var router = decorateRouter(express.Router());
const mailService = require('../service/mail-service');

router.postAsync('/feedback', async function (req, res, next) {
    try {
        await mailService.sendMail(req.body.email, req.body.message)
        res.send(JSON.stringify({
            code: 0,
            data: {
            }
        }));
    } catch (err) {
        next(err);
    }
})

module.exports = router;