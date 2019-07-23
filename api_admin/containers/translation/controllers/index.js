const express = require('express');
const router = express.Router();
const services = require('../services');

router.post('/get', get);

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