const express = require('express');
const router = express.Router();
const services = require('../services');

router.post('/create', create);
router.post('/findUser', findUser);
router.post('/getAll', getAll);
router.post('/history',getLastHistory);

module.exports = router;

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

function findUser(req, res, next) {
    services.findUser(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function getAll(req, res, next) {
    services.getAll()
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function getLastHistory(req,res,next){
    services.getLastHistory()
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}