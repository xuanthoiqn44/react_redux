let BOX_PERCENT = [
    { type: 0, percent: 80 }, //Hộp Bình Thường (normal-box)
    { type: 1, percent: 19 }, //Hộp Hiếm (rare-box)
    { type: 2, percent: 1 }, //Hộp Legend (legend-box)
];
let BOX_DATA = [
    {
        "name": "일반 박스",
        "typeCode": "normal-box",
        "description": "무엇이 나올지 알수가 없다.",
        "image" : "normal-box.png",
        "price": 500,
        "type" : "item",
    },{
        "name": "희귀 박스",
        "typeCode": "rare-box",
        "description": "무엇이 나올지 알수가 없다.",
        "image" : "rare-box.png",
        "price": 1000,
        "type" : "item",
    },{
        "name": "전설 박스",
        "typeCode": "legend-box",
        "description": "무엇이 나올지 알수가 없다.",
        "image" : "legend-box.png",
        "price": 5000,
        "type" : "item",
    }
];

//500
const NORMAL_GIFT_PERCENT = [
    { type: 0, percent: 30 }, //Cây Bình Thường - ( normal-sprout )
    { type: 1, percent: 20 }, //Cây Trắng - ( white-sprout )
    { type: 2, percent: 10 }, /// Cây Xanh Lá Cây - ( green-sprout )
    { type: 3, percent: 6 }, //Cây Xanh Biển - ( blue-sprout )
    { type: 4, percent: 3 }, //Cây Đồng - ( bronze-sprout )
    { type: 5, percent: 1 }, //Cây Bạc - ( silver-sprout )
    //item
    { type: 6, percent: 15 }, //Thuốc Dinh Dưỡng - (nutritional-supplements)
    { type: 7, percent: 15 }, //Xẻng - (shovel)
];

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

//1000
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
const RARE_GIFT_PERCENT = [
    { type: 0, percent: 30 }, //Cây Bình Thường
    { type: 1, percent: 20 }, //Cây Xanh Biển
    { type: 2, percent: 10 }, //Cây Đồng
    { type: 3, percent: 6 }, //Cây Bạc
    { type: 4, percent: 3 }, //Cây Vàng - (gold-sprout)
    { type: 5, percent: 1 }, //Cây Bạch kim - (platinum-sprout)
    //item
    { type: 6, percent: 15 }, //Thuốc Dinh Dưỡng
    { type: 7, percent: 15 }, //Xẻng
]

//5000
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
];

const LEGEND_GIFT_PERCENT = [
    { type: 0, percent: 30 }, //Cây Bình Thường
    { type: 1, percent: 20 }, //Cây Đồng
    { type: 2, percent: 10 }, //Cây Bạc
    { type: 3, percent: 6 }, //Cây Vàng
    { type: 4, percent: 3 }, //Cây Bạch kim
    { type: 5, percent: 1 }, //Cây Kim Cương - (diamond-sprout)
    //item
    { type: 6, percent: 15 }, //Thuốc Dinh Dưỡng
    { type: 7, percent: 15 }, //Xẻng
];

module.exports = {
    BOX_PERCENT,
    BOX_DATA,
    NORMAL_GIFT_PERCENT,
    NORMAL_GIFT_DATA,
    RARE_GIFT_PERCENT,
    RARE_GIFT_DATA,
    LEGEND_GIFT_PERCENT,
    LEGEND_GIFT_DATA,
};
