const express = require('express');
const router = express.Router();
const services = require('../services/items');

router.post('/get', get);
router.post('/addItem', addItem);
router.post('/getItemByUser', getItemByUser);
router.post('/moveItem', moveItem);
router.post('/moveItemToInventory', moveItemToInventory);
router.post('/transformItem', transformItem);
router.post('/useItem', useItem);
router.post('/useGift', useGift);
router.post('/harvestItems', harvestItems);
router.post('/harvestItemsSchedule',harvestItemsSchedule);


module.exports = router;


function harvestItemsSchedule(req,res,next){
    services.harvestItemsSchedule().then(result => res.json(result));
}

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

function addItem(req, res, next) {
    services.addItem(req.body)
        .then(result => {
            if (result) res.json(result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function getItemByUser(req, res, next) {
    services.getItemByUser(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function moveItem(req, res, next) {
    services.moveItem(req.body)
        .then(result => {
            if (result) res.json(result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function moveItemToInventory(req, res, next) {
    services.moveItemToInventory(req.body)
        .then(result => {
            if (result) res.json(result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function transformItem(req, res, next) {
    services.transformItem(req.body)
        .then(result => {
            if (result) res.json(result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function useItem(req, res, next) {
    services.useItem(req.body)
        .then(result => {
            if (result) res.json(result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function useGift(req, res, next) {
    services.useGift(req.body)
        .then(result => {
            if (result) res.json(result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function harvestItems(req, res, next) {
    services.harvestItems(req.body)
        .then(result => {
            if (result) res.json(result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}