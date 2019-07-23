const config = require('./config');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const dbURI = config.connectHost;
try {
    mongoose.connect(dbURI, {
        useNewUrlParser: true
    })
} catch (error) { }

// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

mongoose.Promise = global.Promise;
module.exports = {
    User: require('../containers/users/models/user'),
    UserMail: require('../containers/users/models/userMail'),
    UserFriend: require('../containers/users/models/userFriend'),
    UserSetting: require('../containers/users/models/userSetting'),
    Chat: require('../containers/chats/models/chat'),
    RpsEvent: require('../containers/events/models/rpsEvent'),
    RpsHistory: require('../containers/events/models/rpsHistory'),
    Land: require('../containers/lands/models/land'),
    Notify: require('../containers/notifies/models/notify'),
    AdminNotify: require('../containers/notifies/models/notifyAdmin'),
    InventoryCharacter: require('../containers/inventories/models/inventoryCharacter'),
    InventoryItem: require('../containers/inventories/models/inventoryItem'),
    LandEnv: require('../containers/lands/models/landEnv'),
    LandCharacter: require('../containers/lands/models/landCharacter'),
    LandItem: require('../containers/lands/models/landItem'),
    LandNpc: require('../containers/lands/models/landNpc'),
    LandGroup: require('../containers/lands/models/landGroup'),
    Character: require('../containers/characters/models/character'),
    Npc: require('../containers/npcs/models/npc'),
    Item: require('../containers/items/models/item'),
    ShopCharacter: require('../containers/shops/models/shopCharacter'),
    ShopItem: require('../containers/shops/models/shopItem'),

    Email: require('../containers/email/models/email'),
    AdminEmail: require('../containers/email/models/emailAdmin'),
    Product: require('../containers/products/models/product'),
    Language: require('../containers/languages/models/language'),
    Translation: require('../containers/translation/models/translation'),
    //add new category
    Category: require('../containers/categories/models/category'),
};
