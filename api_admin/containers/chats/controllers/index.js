const express = require('express');
const router = express.Router();
const services = require('../services');
const fs = require('fs');

router.post('/getAll', getAll);
router.post('/add', addRoom);
router.post('/uploadImage', uploadImage);
router.post('/loadMoreMessage', loadMoreMessage);

function addRoom(req, res, next) {
    services.create(req.body, req.files)
        .then(() => {
            res.json({ 'success': 'success' })
        })
        .catch(err => next(err));
}
function getAll(req, res, next) {
    services.getAll()
        .then(result => {
            if (result) res.json(result);
            else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }
        })
        .catch(err => next(err));
}
function uploadImage(req, res, next) {
    let imageFile = req.files.selectedFile;
    let imageName = `image-${imageFile.name}`;
    let isExistImage = fs.existsSync(`../public/img/upload/${imageName}`);

    //not exist then save image to folder
    if (!isExistImage) {
        imageFile.mv(`../public/img/upload/${imageName}`);
    }

    return res.json({ imageName: imageName });
}

function loadMoreMessage(req, res, next) {
    services.getMessInRoomByOffset(req.body)
        .then(rs => {
            if (rs) {
                // if (rs.nextN === -1) {
                //     next();
                // }
                res.json(rs);

            } else {
                console.log('Object Return Failed: (', result, ')');
                res.sendStatus(500);
            }


        })
        .catch(err => next(err));
}
module.exports = router;