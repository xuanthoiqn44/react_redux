const express = require('express');
const router = express.Router();
const services = require('../services/mails');

router.post('/send', send);
router.post('/read', read);
router.post('/deleteSentMail', deleteSentMail);
router.post('/deleteReceivedMail', deleteReceivedMail);
router.post('/getAll',getAll);

module.exports = router;

function send(req, res, next) {
    services.send(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function read(req, res, next) {
    services.read(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function deleteSentMail(req, res, next) {
    services.deleteSentMail(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}

function deleteReceivedMail(req, res, next) {
    services.deleteReceivedMail(req.body)
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
    services.getAll(req.body)
        .then(result => {
            if(result) res.json(result);
            else {
                console.log('Object Return Failed: (',result,')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}