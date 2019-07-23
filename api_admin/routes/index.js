var express = require('express');
var router = express.Router();
//const config = require('../helpers/config');
//var rp = require('request-promise');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Api Server' });
});

module.exports = router;