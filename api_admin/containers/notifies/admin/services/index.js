const db = require('../../../../helpers/db');
const AdminNotify = db.AdminNotify;
const Notify = db.Notify;
const User = db.User;
module.exports = {
    get,
    getById,
    create,
    update,
    delete: _delete,
    send
};

async function get(){
    return await AdminNotify.find({});
}

async function getById(param){
    return await AdminNotify.findById(param.id);
}

async function create(param) {
    const newAdminNotify = new AdminNotify(param);
    return await newAdminNotify.save();
}

async function update(param){
    let id = param._id;
    let updateObj = Object.assign({}, param);
    delete updateObj._id;
    return await AdminNotify.findByIdAndUpdate(id,updateObj,{new: true});
}

async function _delete(param){
    return await AdminNotify.findByIdAndRemove(param.id);
}

async function send(param) {
    const adminNotifies = await AdminNotify.findByIdAndUpdate(param.id, { $set: { statusSent: true, dateSent : new Date()  } });

    let notifies = await User.find({}).select('id');
    notifies = notifies.map(u => {
        return {
            userId: u._id,
            title: adminNotifies.title,
            content: adminNotifies.content,
            type: 'admin',
        }
    });
    return await Notify.insertMany(notifies);
}