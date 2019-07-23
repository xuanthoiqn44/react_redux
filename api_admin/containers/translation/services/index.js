const db = require('../../../helpers/db');
const Translation = db.Translation;

const languages = [
    { language: 'English', characters: 'us' },
    { language: 'Viet Nam', characters: 'vn' },
    { language: 'Korea', characters: 'kr' },
    { language: 'ThaiLan', characters: 'th' },
    { language: 'Indonesia', characters: 'id' },
    { language: 'China', characters: 'cn' },
   
];

module.exports = {
    get,
};

async function get(){
    await new Promise((resolve) => {
        for(let elem of languages) {
            Translation.find({ characters: elem.characters }, async function (err, doc) {
                if(err) console.error(err);
                if(doc.length < 1) {
                    await createLanguage(elem);
                }
            })
        }
        resolve(true)
    });
    return await Translation.find({}).sort({ language: 1 });
}

async function createLanguage(data) {
    let insert = new Translation();
    insert.language = data.language;
    insert.characters = data.characters;
    return await insert.save();
}