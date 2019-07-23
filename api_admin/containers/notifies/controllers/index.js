const express = require('express');
const router = express.Router();
const services = require('../services');

router.post('/getById', getById);
router.post('/updateStatus', updateStatus);
router.post('/send', send);

module.exports = router;

function getById(req, res, next) {
    services.getById(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function updateStatus(req, res, next) {
    services.updateStatus(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function send(req, res, next) {
    services.send(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}