const nodeMailer = require('nodemailer');

module.exports={
    connectHost: 'mongodb://localhost/admin-db',
    secret: 'THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING',
    clientHost: 'http://178.128.109.233',
    sendEmail,
};

function sendEmail(message) {
    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: 'hienviluong125@gmail.com',
            clientId: '343022202252-oagtg55hvlopr46l46jalleu46nd003t.apps.googleusercontent.com',
            clientSecret: 'Fceguvgx_y6e2Y06i4bXYCuC',
            accessToken: 'ya29.GltBBn8Gymch6bXycJH2soOER3m30bH0jvM0OycetAnEi6T1-F8gJ3swv7VX-UpaRPhxr8hBcyERujobCp6_0mhOTXskJeWB-QyUWrtVQGAaM6zlGxMViSslOncI',
            refreshToken: '1/71wZwtIHhvqMBj0ahRTONwCw34JCgfA4tfOmYF8pfPg',
        }
    });

    transporter.sendMail(message, (error, info) => {
        console.log(error?error:'Email sent: ' + info.response);
    });
}
