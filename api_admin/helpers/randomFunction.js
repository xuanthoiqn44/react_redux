const {
    BOX_PERCENT,
    BOX_DATA,
    NORMAL_GIFT_PERCENT,
    NORMAL_GIFT_DATA,
    RARE_GIFT_PERCENT,
    RARE_GIFT_DATA,
    LEGEND_GIFT_PERCENT,
    LEGEND_GIFT_DATA,
} = require('./randomdb');

module.exports = {
    receiveRandomBoxGift,
    receiveGiftFromBox,
    createPercentArray,
    shuffle,
    random,
};

//console.log('receiveRandomBoxGift() ', receiveRandomBoxGift());
function receiveRandomBoxGift(){
    const sfItems = shuffle(createPercentArray(BOX_PERCENT));
    const iRandom = random(0, sfItems.length-1);
    //console.log('iRandom ', iRandom)
    return BOX_DATA[sfItems[iRandom]];
}

// for(let i = 0; i < 12; i++){
//     console.log( receiveGiftFromBox('normal') );
// }

//console.log( receiveGiftFromBox('normal') );
//typePercent = 'normal' | 'rare' | 'legend'
function receiveGiftFromBox(typePercent){
    if(typePercent === 'normal'){
        let sfItems = shuffle(createPercentArray(NORMAL_GIFT_PERCENT));
        let iRandom = random(0, sfItems.length-1);
        return NORMAL_GIFT_DATA[sfItems[iRandom]];
    } else if(typePercent === 'rare'){
        let sfItems = shuffle(createPercentArray(RARE_GIFT_PERCENT));
        let iRandom = random(0, sfItems.length-1);
        return RARE_GIFT_DATA[sfItems[iRandom]];
    } else if(typePercent === 'legend'){
        let sfItems = shuffle(createPercentArray(LEGEND_GIFT_PERCENT));
        let iRandom = random(0, sfItems.length-1);
        return LEGEND_GIFT_DATA[sfItems[iRandom]];
    }
    return;
}

function createPercentArray(arrPercent){
    return arrPercent.reduce((arrayPercent, aType) => arrayPercent.concat(Array(aType.percent).fill(aType.type)), []);
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function random(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}