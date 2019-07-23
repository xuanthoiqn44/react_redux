const db = require('../../../helpers/db');
const dateFormat = require('dateformat');
const ObjectId = require('mongoose').Types.ObjectId;
const Product = db.Product;
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require("rimraf");
const base64ToImage = require('base64-to-image');
const image2base64 = require('image-to-base64');

module.exports = {
    getByUserId,
    create,
    update,
    updateState,
    delete: _delete,
};

async function getByUserId(userId){
    let productsById = await Product.find({ userId: userId.userId });
    let newProduct = await productsById.map((item) => {
        let temp = [];
        if (typeof item.path !== 'undefined') {
            for(let i = 0; i < item.path.length; i++) {
                temp[i] = image2base64(path.join(process.cwd(), '/images/products/', item.path[i]));
            }
        }
        Promise.all(temp).then(function(values) {
            for(let i = 0; i < values.length; i++) {
                item.path[i] = 'data:image/png;base64,' + values[i];
            }
        });
        return item;
    });
    return newProduct;
}

async function create(param) {
    await new Promise((resolve) => {
        Product.find({ 'title.us': param.title.us.trim(), userId: param.userId }, async function (err, doc) {
            if(doc.length > 0) {
                resolve(true);
            } else {
                const newProduct = new Product();
                newProduct.title = param.title;
                newProduct.image = param.image;
                newProduct.content = param.content;
                newProduct.price = param.price ? param.price : 0;
                newProduct.sale = param.sale ? param.sale : 0;
                newProduct.status = param.status;
                newProduct.language = param.language;
                param.listSelected.forEach((val) => {
                    newProduct.categoryId.push(val.id);
                });
                newProduct.userId = param.userId;
                newProduct.createdDate = dateFormat(Date.now(), "dd/mm/yyyy");
                newProduct.path = await createPath(param, param.image);
                await newProduct.save();
                resolve(true);
            }
        })
    });
    return await Product.find({ userId: new ObjectId(param.userId) });
}

async function update(param){
    let directory = './images/products/user_' + param.userId + '/' + param.title.us.trim() + '/';
    const list = param.path.concat(param.image)
    const url = [];
    if (!fs.existsSync(directory)){
        param.path = await createPath(param, list);
    } else {
        await new Promise((resolve) => {
            rimraf(directory + '*.png', async function (err) {
                if(err) {
                    return console.error(err);
                } else {
                    for ( let i=0; i<list.length; i++ ) {
                        let base64Str = list[i];
                        await base64ToImage(base64Str,directory,{'fileName': param.title.us.trim() + '_' + [i+1], 'type':'png'});
                        url[i] = 'user_' + param.userId + '/' + param.title.us.trim() + '/' + param.title.us.trim() + '_' + [i+1] + '.png';
                    }
                    param.path = url;
                    resolve(true)
                }
            });
        })
    }
    param.categoryId = [];
    param.listSelected.map((val) => {
        param.categoryId.push(val.id);
    });
    let id = param._id;
    let updateObj = Object.assign({}, param);
    delete updateObj._id;
    await Product.findByIdAndUpdate(id,updateObj,{new: true});
    return await getByUserId(param);
}

async function updateState(param){
    await Product.findByIdAndUpdate(param.id,{status: param.value});
    return await Product.find({});
}

async function _delete(param){
    rimraf('./images/products/user_' + param.param.data.userId + '/' + param.param.data.title, function(err) {
        if (err) console.log(err);
    });
    await Product.deleteOne({_id: new ObjectId(param.param.data.id)});
    return await getByUserId(param.param.data);
}

async function createPath(param, array) {
    let dir = './images/products/user_' + param.userId + '/' + param.title.us.trim() + '/';
    const url = [];
    await new Promise((resolve) => {
        mkdirp(path.join(process.cwd(), '/images/products/', 'user_' + param.userId, param.title.us.trim()), async function(err){
            if (err) {
                return console.error(err);
            } else {
                for ( let i=0; i<array.length; i++ ) {
                    let base64Str = array[i];
                    await base64ToImage(base64Str,dir,{'fileName': param.title.us.trim() + '_' + [i+1], 'type':'png'});
                    url[i] = 'user_' + param.userId + '/' + param.title.us.trim() + '/' + param.title.us.trim() + '_' + [i+1] + '.png';
                }
                resolve(true);
            }
        });
    });
    return url;
}
