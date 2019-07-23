module.exports = {
    receiveGiftFromBox,
    createPercentArray,
    shuffle,
    random,
};

const NORMAL_GIFT_DATA = [
    //character
    {
        "name": "일반 나무",
        "typeCode": "normal-sprout",
        "description": "새싹을 20일동안 키우면 브론즈 블러드 나무가 된다. 나무에서 40일이 지나면 열매가 열린다는데어떤 열매가 생길까?",
        "image" : "normal-sprout.png",
        "price": 0,
        "profit": 0,
        "profitDay": 0.0016/100,
        "profitMonth": 0.05/100,
        "profitYear": 0.6/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "normal-tree",
        "type":"bud"
    },{
        "name": "일반 나무",
        "typeCode": "white-sprout",
        "description": "새싹을 20일동안 키우면 브론즈 블러드 나무가 된다. 나무에서 40일이 지나면 열매가 열린다는데어떤 열매가 생길까?",
        "image" : "white-sprout.png",
        "price": 180,
        "profit": 0,
        "profitDay": 0.0197/100,
        "profitMonth": 0.6/100,
        "profitYear": 7.2/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "white-tree",
        "type":"bud"
    },{
        "name": "일반 나무",
        "typeCode": "green-sprout",
        "description": "새싹을 20일동안 키우면 브론즈 블러드 나무가 된다. 나무에서 40일이 지나면 열매가 열린다는데어떤 열매가 생길까?",
        "image" : "green-sprout.png",
        "price": 260,
        "profit": 0,
        "profitDay": 0.0213/100,
        "profitMonth": 0.65/100,
        "profitYear": 7.8/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "green-tree",
        "type":"bud"
    },{
        "name": "일반 나무",
        "typeCode": "blue-sprout",
        "description": "새싹을 20일동안 키우면 브론즈 블러드 나무가 된다. 나무에서 40일이 지나면 열매가 열린다는데어떤 열매가 생길까?",
        "image" : "blue-sprout.png",
        "price": 350,
        "profit": 0,
        "profitDay": 0.0230/100,
        "profitMonth": 0.7/100,
        "profitYear": 8.4/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "blue-tree",
        "type":"bud"
    },{
        "name": "일반 나무",
        "typeCode": "bronze-sprout",
        "description": "새싹을 20일동안 키우면 브론즈 블러드 나무가 된다. 나무에서 40일이 지나면 열매가 열린다는데어떤 열매가 생길까?",
        "image" : "bronze-sprout.png",
        "price": 480,
        "profit": 0,
        "profitDay": 0.0263/100,
        "profitMonth": 0.8/100,
        "profitYear": 9.6/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "bronze-tree",
        "type":"bud"
    },{
        "name": "일반 나무",
        "typeCode": "silver-sprout",
        "description": "새싹을 20일동안 키우면 브론즈 블러드 나무가 된다. 나무에서 40일이 지나면 열매가 열린다는데어떤 열매가 생길까?",
        "image" : "silver-sprout.png",
        "price": 760,
        "profit": 0,
        "profitDay": 0.0312/100,
        "profitMonth": 0.95/100,
        "profitYear": 11.4/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "silver-tree",
        "type":"bud"
    },
    //item
    {
        "name": "골드 블러드 새싹",
        "typeCode": "water-spray",
        "description": "트리 수준의 물방울은 3 개월 동안 살 수 있습니다.",
        "image" : "water-spray.png",
        "price": 50,
        "type" : "forTree",
    },{
        "name": "신비한 새싹",
        "typeCode": "water-bucket",
        "description": "6 개월 동안 생존 할 수있는 나무 수위의 물방울",
        "image" : "water-bucket.png",
        "price": 95,
        "type" : "forTree",
    },{
        "name": "쑥쑥 영양제",
        "typeCode": "nutritional-supplements",
        "description": "씨앗이 잘자랄 수 있도록 도움을 준다.나무까지 되는 시간이 짧아질 수도...",
        "image" : "nutrition.png",
        "price": 25,
        "type" : "forTree",
    },{
        "name": "없애버려 삽",
        "typeCode": "shovel",
        "description": "기본으로 제공되는 블러드 나무를제거 할 수 있다.",
        "image" : "shovel.png",
        "price": 50,
        "type" : "remove",
    },
]

const RARE_GIFT_DATA = [
    //character
    {
        "name": "일반 나무",
        "typeCode": "normal-sprout",
        "description": "새싹을 20일동안 키우면 브론즈 블러드 나무가 된다. 나무에서 40일이 지나면 열매가 열린다는데어떤 열매가 생길까?",
        "image" : "normal-sprout.png",
        "price": 0,
        "profit": 0,
        "profitDay": 0.0016/100,
        "profitMonth": 0.05/100,
        "profitYear": 0.6/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "normal-tree",
        "type":"bud"
    },{
        "name": "일반 나무",
        "typeCode": "blue-sprout",
        "description": "새싹을 20일동안 키우면 브론즈 블러드 나무가 된다. 나무에서 40일이 지나면 열매가 열린다는데어떤 열매가 생길까?",
        "image" : "blue-sprout.png",
        "price": 350,
        "profit": 0,
        "profitDay": 0.0230/100,
        "profitMonth": 0.7/100,
        "profitYear": 8.4/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "blue-tree",
        "type":"bud"
    },{
        "name": "일반 나무",
        "typeCode": "bronze-sprout",
        "description": "새싹을 20일동안 키우면 브론즈 블러드 나무가 된다. 나무에서 40일이 지나면 열매가 열린다는데어떤 열매가 생길까?",
        "image" : "bronze-sprout.png",
        "price": 480,
        "profit": 0,
        "profitDay": 0.0263/100,
        "profitMonth": 0.8/100,
        "profitYear": 9.6/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "bronze-tree",
        "type":"bud"
    },{
        "name": "일반 나무",
        "typeCode": "silver-sprout",
        "description": "새싹을 20일동안 키우면 브론즈 블러드 나무가 된다. 나무에서 40일이 지나면 열매가 열린다는데어떤 열매가 생길까?",
        "image" : "silver-sprout.png",
        "price": 760,
        "profit": 0,
        "profitDay": 0.0312/100,
        "profitMonth": 0.95/100,
        "profitYear": 11.4/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "silver-tree",
        "type":"bud"
    },{
        "name": "일반 나무",
        "typeCode": "gold-sprout",
        "description": "새싹을 20일동안 키우면 브론즈 블러드 나무가 된다. 나무에서 40일이 지나면 열매가 열린다는데어떤 열매가 생길까?",
        "image" : "gold-sprout.png",
        "price": 1100,
        "profit": 0,
        "profitDay": 0.0361/100,
        "profitMonth": 1.1/100,
        "profitYear": 13.2/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "gold-tree",
        "type":"bud"
    },{
        "name": "일반 나무",
        "typeCode": "platinum-sprout",
        "description": "새싹을 20일동안 키우면 브론즈 블러드 나무가 된다. 나무에서 40일이 지나면 열매가 열린다는데어떤 열매가 생길까?",
        "image" : "platinum-sprout.png",
        "price": 1500,
        "profit": 0,
        "profitDay": 0.0410/100,
        "profitMonth": 1.25/100,
        "profitYear": 15/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "platinum-tree",
        "type":"bud"
    },
    //item
    {
        "name": "골드 블러드 새싹",
        "typeCode": "water-spray",
        "description": "트리 수준의 물방울은 3 개월 동안 살 수 있습니다.",
        "image" : "water-spray.png",
        "price": 50,
        "type" : "forTree",
    },{
        "name": "신비한 새싹",
        "typeCode": "water-bucket",
        "description": "6 개월 동안 생존 할 수있는 나무 수위의 물방울",
        "image" : "water-bucket.png",
        "price": 95,
        "type" : "forTree",
    },{
        "name": "쑥쑥 영양제",
        "typeCode": "nutritional-supplements",
        "description": "씨앗이 잘자랄 수 있도록 도움을 준다.나무까지 되는 시간이 짧아질 수도...",
        "image" : "nutrition.png",
        "price": 25,
        "type" : "forTree",
    },{
        "name": "없애버려 삽",
        "typeCode": "shovel",
        "description": "기본으로 제공되는 블러드 나무를제거 할 수 있다.",
        "image" : "shovel.png",
        "price": 50,
        "type" : "remove",
    },
]


const LEGEND_GIFT_DATA = [
    //character
    {
        "name": "일반 나무",
        "typeCode": "normal-sprout",
        "description": "새싹을 20일동안 키우면 브론즈 블러드 나무가 된다. 나무에서 40일이 지나면 열매가 열린다는데어떤 열매가 생길까?",
        "image" : "normal-sprout.png",
        "price": 0,
        "profit": 0,
        "profitDay": 0.0016/100,
        "profitMonth": 0.05/100,
        "profitYear": 0.6/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "normal-tree",
        "type":"bud"
    },{
        "name": "일반 나무",
        "typeCode": "bronze-sprout",
        "description": "새싹을 20일동안 키우면 브론즈 블러드 나무가 된다. 나무에서 40일이 지나면 열매가 열린다는데어떤 열매가 생길까?",
        "image" : "bronze-sprout.png",
        "price": 480,
        "profit": 0,
        "profitDay": 0.0263/100,
        "profitMonth": 0.8/100,
        "profitYear": 9.6/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "bronze-tree",
        "type":"bud"
    },{
        "name": "일반 나무",
        "typeCode": "silver-sprout",
        "description": "새싹을 20일동안 키우면 브론즈 블러드 나무가 된다. 나무에서 40일이 지나면 열매가 열린다는데어떤 열매가 생길까?",
        "image" : "silver-sprout.png",
        "price": 760,
        "profit": 0,
        "profitDay": 0.0312/100,
        "profitMonth": 0.95/100,
        "profitYear": 11.4/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "silver-tree",
        "type":"bud"
    },{
        "name": "일반 나무",
        "typeCode": "gold-sprout",
        "description": "새싹을 20일동안 키우면 브론즈 블러드 나무가 된다. 나무에서 40일이 지나면 열매가 열린다는데어떤 열매가 생길까?",
        "image" : "gold-sprout.png",
        "price": 1100,
        "profit": 0,
        "profitDay": 0.0361/100,
        "profitMonth": 1.1/100,
        "profitYear": 13.2/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "gold-tree",
        "type":"bud"
    },{
        "name": "일반 나무",
        "typeCode": "platinum-sprout",
        "description": "새싹을 20일동안 키우면 브론즈 블러드 나무가 된다. 나무에서 40일이 지나면 열매가 열린다는데어떤 열매가 생길까?",
        "image" : "platinum-sprout.png",
        "price": 1500,
        "profit": 0,
        "profitDay": 0.0410/100,
        "profitMonth": 1.25/100,
        "profitYear": 15/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "platinum-tree",
        "type":"bud"
    },{
        "name": "일반 나무",
        "typeCode": "diamond-sprout",
        "description": "새싹을 20일동안 키우면 브론즈 블러드 나무가 된다. 나무에서 40일이 지나면 열매가 열린다는데어떤 열매가 생길까?",
        "image" : "diamond-sprout.png",
        "price": 0,
        "profit": 0,
        "profitDay": 0.1232/100,
        "profitMonth": 3.75/100,
        "profitYear": 45/100,
        "transformPeriod": 20*24*60*60, //20 days
        "transformToTypeCode": "diamond-tree",
        "type":"bud"
    },
    //item
    {
        "name": "골드 블러드 새싹",
        "typeCode": "water-spray",
        "description": "트리 수준의 물방울은 3 개월 동안 살 수 있습니다.",
        "image" : "water-spray.png",
        "price": 50,
        "type" : "forTree",
    },{
        "name": "신비한 새싹",
        "typeCode": "water-bucket",
        "description": "6 개월 동안 생존 할 수있는 나무 수위의 물방울",
        "image" : "water-bucket.png",
        "price": 95,
        "type" : "forTree",
    },{
        "name": "쑥쑥 영양제",
        "typeCode": "nutritional-supplements",
        "description": "씨앗이 잘자랄 수 있도록 도움을 준다.나무까지 되는 시간이 짧아질 수도...",
        "image" : "nutrition.png",
        "price": 25,
        "type" : "forTree",
    },{
        "name": "없애버려 삽",
        "typeCode": "shovel",
        "description": "기본으로 제공되는 블러드 나무를제거 할 수 있다.",
        "image" : "shovel.png",
        "price": 50,
        "type" : "remove",
    },
]

//500
const NORMAL_GIFT = [
    { type: 0, percent: 25 }, //Cây Bình Thường - ( normal-sprout )
    { type: 1, percent: 15 }, //Cây Trắng - ( white-sprout )
    { type: 2, percent: 10 }, /// Cây Xanh Lá Cây - ( green-sprout )
    { type: 3, percent: 6 }, //Cây Xanh Biển - ( blue-sprout )
    { type: 4, percent: 3 }, //Cây Đồng - ( bronze-sprout )
    { type: 5, percent: 1 }, //Cây Bạc - ( silver-sprout )
    //item
    { type: 6, percent: 15 }, //Bình Xịt Nước - (water-spray)
    { type: 7, percent: 5 }, //Bình Nước Lớn - (water-bucket)
    { type: 8, percent: 10 }, //Thuốc Dinh Dưỡng - (nutritional-supplements)
    { type: 9, percent: 10 }, //Xẻng - (shovel)
]
//1000
const RARE_GIFT = [
    { type: 0, percent: 25 }, //Cây Bình Thường
    { type: 1, percent: 15 }, //Cây Xanh Biển
    { type: 2, percent: 10 }, //Cây Đồng
    { type: 3, percent: 6 }, //Cây Bạc
    { type: 4, percent: 3 }, //Cây Vàng - (gold-sprout)
    { type: 5, percent: 1 }, //Cây Bạch kim - (platinum-sprout)
    //item
    { type: 6, percent: 15 }, //Bình Xịt Nước
    { type: 7, percent: 5 }, //Bình Nước Lớn
    { type: 8, percent: 10 }, //Thuốc Dinh Dưỡng
    { type: 9, percent: 10 }, //Xẻng
]
//5000
const LEGEND_GIFT = [
    { type: 0, percent: 25 }, //Cây Bình Thường
    { type: 1, percent: 15 }, //Cây Đồng
    { type: 2, percent: 10 }, //Cây Bạc
    { type: 3, percent: 6 }, //Cây Vàng
    { type: 4, percent: 3 }, //Cây Bạch kim
    { type: 5, percent: 1 }, //Cây Kim Cương - (diamond-sprout)
    //item
    { type: 6, percent: 15 }, //Bình Xịt Nước
    { type: 7, percent: 5 }, //Bình Nước Lớn
    { type: 8, percent: 10 }, //Thuốc Dinh Dưỡng
    { type: 9, percent: 10 }, //Xẻng
]

//console.log( receiveGiftFromBox('normal') );
//typePercent = 'normal' | 'rare' | 'legend'
function receiveGiftFromBox(typePercent){
    if(typePercent === 'normal'){
        let sfItems = shuffle(createPercentArray(NORMAL_GIFT));
        let iRandom = random(0, sfItems.length-1);
        return NORMAL_GIFT_DATA[sfItems[iRandom]];
    } else if(typePercent === 'rare'){
        let sfItems = shuffle(createPercentArray(RARE_GIFT));
        let iRandom = random(0, sfItems.length-1);
        return RARE_GIFT_DATA[sfItems[iRandom]];
    } else if(typePercent === 'legend'){
        let sfItems = shuffle(createPercentArray(LEGEND_GIFT));
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
