const express = require('express');
const router = express.Router();
const services = require('../services');

router.post('/get', get);
router.post('/create', create);
router.post('/update', update);
router.post('/delete', _delete);

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