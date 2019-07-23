const express = require('express');
const router = express.Router();
const services = require('../services');

router.post('/add', add);
router.post('/edit', edit);
router.post('/delete', _delete);
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

function edit(req, res, next) {
    services.edit(req.body)
        .then(result => {
            if(result) res.json(result);
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