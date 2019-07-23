const db = require('../../../helpers/db');
const AdminEmail = db.AdminEmail;
const Email = db.Email;
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
    return await AdminEmail.find({});
}

async function getById(param){
    return await AdminEmail.findById(param.id);
}

async function create(param) {
    const newAdminEmail = new AdminEmail(param);
    return await newAdminEmail.save();
}

async function update(param){
    let id = param._id;
    let updateObj = Object.assign({}, param);
    delete updateObj._id;
    return await AdminEmail.findByIdAndUpdate(id,updateObj,{new: true});
}

async function _delete(param){
    await Email.deleteOne({_id: new ObjectId(param.id.id)});
    return await get();
}

async function send(param) {
    const adminEmails = await AdminEmail.findByIdAndUpdate(param.id, { $set: { statusSent: true, dateSent : new Date()  } });

    let emails = await User.find({}).select('id');
    emails = emails.map(u => {
        return {
            userId: u._id,
            title: adminEmails.title,
            content: adminEmails.content,
            type: 'admin',
        }
    });
    return await get();
}