const express = require('express');
const router = express.Router();
const services = require('../services/friends');

router.post('/add', add);
router.post('/block', block);
router.post('/unFriend', unFriend);
router.post('/unBlock', unBlock);
router.post('/checkStatusByUserName', checkStatusByUserName);
router.post('/getFriendListBlockList', getFriendListBlockList);

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

function block(req, res, next) {

    services.block(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function unFriend(req, res, next) {
    services.unFriend(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function unBlock(req, res, next) {
    services.unBlock(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function checkStatusByUserName(req, res, next) {
    services.checkStatusByUserName(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function getFriendListBlockList(req, res, next) {
    services.getFriendListBlockList(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}