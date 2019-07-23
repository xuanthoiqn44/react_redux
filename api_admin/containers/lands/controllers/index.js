const express = require('express');
const router = express.Router();
const services = require('../services');

//router.post('/getAllHistoryTradingLandById', getAllHistoryTradingLandById);
router.post('/updateLandsState', updateLandsState);
router.post('/getAllLand', getAllLand);
router.post('/getAllCategory', getAllCategory);
router.post('/transferLandCategory', transferLandCategory);
router.post('/addCategory', addCategory);
router.post('/editCategory', editCategory);
router.post('/deleteLandCategory', deleteLandCategory);
router.post('/editLand', editLand);
router.post('/addLand', addLand);
router.post('/getAllHistoryTradingLandById', getAllHistoryTradingLandById);
router.post('/removeHistory',removeHistory);
router.post('/createPrivateKey',createPrivateKey);
module.exports = router;

// function getAllHistoryTradingLandById(req, res, next) {
//     services.getAllHistoryTradingLandById(req.body)
//         .then(histories => histories ? res.json(histories) : res.sendStatus(404))
//         .catch(err => next(err));
// }

function getAllLand(req, res, next) {
    services.getAllLand(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function updateLandsState(req, res, next) {
    services.updateLandsState(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function getAllCategory(req, res, next) {
    services.getAllCategory(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function transferLandCategory(req, res, next) {
    services.transferLandCategory(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function addCategory(req, res, next) {
    services.addCategory(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function editCategory(req, res, next) {
    services.editCategory(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function deleteLandCategory(req, res, next) {
    services.deleteLandCategory(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function editLand(req, res, next) {
    services.editLand(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function addLand(req, res, next) {
    services.purchaseLand(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}


function getAllHistoryTradingLandById(req,res,next){
    services.getAllHistoryTradingLandById(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function removeHistory(req,res,next){
    services.removeHistory(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function createPrivateKey(req,res,next){
    services.createPrivateKey()
        .then(result => res.json(result))
        .catch(err => next(err));
}