const express = require('express');
const router = express.Router();
const services = require('../services');

router.post('/get', get);
router.post('/getLanguages', getLanguages);
router.post('/update', update);

module.exports = router;

function get(req, res, next) {
    services.get(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function getLanguages(req, res, next) {
    services.getLanguages()
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function update(req, res, next) {
    services.update(req.body)
        .then(result => {
            if(result) {
                res.json(result);
            }
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}