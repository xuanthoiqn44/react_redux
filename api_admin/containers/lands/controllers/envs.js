const express = require('express');
const router = express.Router();
const services = require('../services/envs');

router.post('/add', add);
router.post('/get', get);
module.exports = router;

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