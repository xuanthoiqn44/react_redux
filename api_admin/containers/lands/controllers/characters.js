const express = require('express');
const router = express.Router();
const services = require('../services/characters');

router.post('/get', get);
router.post('/addCharacter', addCharacter);
router.post('/getCharacterByUser', getCharacterByUser);
router.post('/moveCharacter', moveCharacter);
router.post('/moveCharacterToInventory', moveCharacterToInventory);

module.exports = router;

function get(req, res, next) {
    services.get()
        .then(result => {
            if (result) res.json(result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function addCharacter(req, res, next) {
    services.addCharacter(req.body)
        .then(result => {
            if (result) res.json(result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function getCharacterByUser(req, res, next) {
    services.getCharacterByUser(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function moveCharacter(req, res, next) {
    services.moveCharacter(req.body)
        .then(result => {
            if (result) res.json(result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function moveCharacterToInventory(req, res, next) {
    services.moveCharacterToInventory(req.body)
        .then(result => {
            if (result) res.json(result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}