const express = require('express');
const router = express();
const services = require('../services');

router.post('/getByUserId', getByUserId);
router.post('/create', create);
router.post('/update', update);
router.post('/delete', _delete);
router.post('/updateState', updateState);

module.exports = router;

function getByUserId(req, res, next) {
    services.getByUserId(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function create(req, res, next) {
    services.create(req.body)
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

function _delete(req, res, next) {
    services.delete(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function updateState(req, res, next) {
    services.updateState(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}