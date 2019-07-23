const db = require('../../../helpers/db');
const ObjectId = require('mongoose').Types.ObjectId;
const Category = db.Category;
const Product = db.Product;

module.exports = {
    get,
    create,
    update,
    delete: _delete,
};

async function get(userId){
    return await Category.find({ userId: userId.userId });
}

async function create(param) {
    const newCategory = new Category();
    newCategory.title = param.title.trim();
    newCategory.userId = param.userId;
    newCategory.flags = true;
    await new Promise((resolve) => {
        Category.find({ title: newCategory.title }, async function (err, doc) {
            if(doc.length > 0) {
                resolve(true);
            } else {
                await newCategory.save();
                resolve(true);
            }
        })
    });
    return await Category.find({ userId: new ObjectId(param.userId) });
}

async function update(param){
    let id = param._id;
    let updateObj = Object.assign({}, param);
    delete updateObj._id;
    await Category.findByIdAndUpdate(id,updateObj,{new: true});
    return await get(param)
}

async function _delete(param){
    let temp;
    let categories = [];
    await new Promise((resolve) => {
        Product.find({'categoryId': param.rowData.id}, async function (err,value) {
            if (err) console.error(err);
            if (value.length === 0) {
                temp = true;
                await Category.deleteOne({_id: new ObjectId(param.rowData.id)});
                categories = await get(param.rowData);
                resolve(true);
            } else {
                temp = false;
                categories = await get(param.rowData);
                resolve(true);
            }
        });
    });
    if(temp) {
        return await {check: true, categories: categories};
    } else {
        return await {check: false, categories: categories};
    }
}
