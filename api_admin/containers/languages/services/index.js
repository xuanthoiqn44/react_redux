const db = require('../../../helpers/db');
const Language = db.Language;

module.exports = {
    get,
    update,
};

async function get(param){
    return await Language.find({userId: param.userId});
}

async function update(param){
    await Language.find({ userId: param.userId }, async function (err, doc) { {
        if(err) {
            console.error(err)
        } else {
            for(let val of doc) {
                val.languages = param.languages;
                let updateObj = Object.assign({}, param);
                delete val._id;
                await Language.findByIdAndUpdate(val._id,updateObj,{new: true});
            }
        }
    }});

    return await get(param);
}
