const express = require('express');
const router = express.Router();
const services = require('../services/settings');

router.post('/get', get);
router.post('/set', set);
router.post('/getLandShowInfo', getLandShowInfo);
router.post('/setLandShowInfo', setLandShowInfo);
router.post('/getBgMusic', getBgMusic);
router.post('/setBgMusic', setBgMusic);
router.post('/getEffMusic', getEffMusic);
router.post('/setEffMusic', setEffMusic);

module.exports = router;

function get(req, res, next) {
    services.get(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function set(req, res, next) {
    services.set(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function getLandShowInfo(req, res, next) {
    services.getLandShowInfo(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function setLandShowInfo(req, res, next) {
    services.setLandShowInfo(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function getBgMusic(req, res, next) {
    services.getBgMusic(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function setBgMusic(req, res, next) {
    services.setBgMusic(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function getEffMusic(req, res, next) {
    services.getEffMusic(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function setEffMusic(req, res, next) {
    services.setEffMusic(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}