const express = require('express');
const router = express.Router();
const services = require('../services/characters');

router.post('/get', get);
router.post('/add', add);

module.exports = router;

function get(req, res, next) {
    services.get()
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function add(req, res, next) {
    services.add(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}