require('rootpath')();
const express = require('express');
const app = express();
var path = require('path');
var debug = require('debug')('api-app:server');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');
const fileUpload = require('express-fileupload');
const server = http.createServer(app);
const io = module.exports.io = socketIO(server);

var indexRouter = require('./routes/index');

const config = require('./helpers/config');

const socketManager = require('./helpers/socket').socketHandle;
const jwt = require('./helpers/jwt');
require('./helpers/cron')(io);

io.on('connection', socketManager);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use(fileUpload());
app.use(jwt());

// app.use(bodyParser.urlencoded({
//     limit: '5mb',
//     parameterLimit: 100000,
//     extended: false
// }));
//
// app.use(bodyParser.json({
//     limit: '5mb'
// }));
// app.use(bodyParser.urlencoded({extended:true, limit: "15MB"}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

// app.use(bodyParser.urlencoded({ extended: false }));app.use(bodyParser.json());
// let allowedOrigins = ['http://test.blood.land:3000','http://localhost:3001','https://wallet.blood.land','http://35.240.205.194:3002'];
// app.use(cors({
//     origin: function(origin, callback){
//         if(!origin) return callback(null, true);
//         if(allowedOrigins.indexOf(origin) === -1){
//             let msg = 'The CORS policy for this site does not ' +
//                 'allow access from the specified Origin.';
//             return callback(new Error(msg), false);
//         }
//         return callback(null, true);
//     }
// }));
app.use(cors());

app.use('/users', require('./containers/users/controllers'));
app.use('/users/friends', require('./containers/users/controllers/friends'));
app.use('/users/mails', require('./containers/users/controllers/mails'));
app.use('/users/settings', require('./containers/users/controllers/settings'));

app.use('/lands', require('./containers/lands/controllers'));
app.use('/lands/envs', require('./containers/lands/controllers/envs'));
app.use('/lands/characters', require('./containers/lands/controllers/characters'));
app.use('/lands/items', require('./containers/lands/controllers/items'));
app.use('/lands/npcs', require('./containers/lands/controllers/npcs'));
app.use('/lands/groups', require('./containers/lands/controllers/groups'));

app.use('/characters', require('./containers/characters/controllers'));
app.use('/items', require('./containers/items/controllers'));
app.use('/npcs', require('./containers/npcs/controllers'));

app.use('/chats', require('./containers/chats/controllers'));
app.use('/events', require('./containers/events/controllers'));

app.use('/inventories/characters', require('./containers/inventories/controllers/characters'));
app.use('/inventories/items', require('./containers/inventories/controllers/items'));

app.use('/shops/characters', require('./containers/shops/controllers/characters'));
app.use('/shops/items', require('./containers/shops/controllers/items'));

app.use('/notifies/admin', require('./containers/notifies/admin/controllers'));
app.use('/notifies', require('./containers/notifies/controllers'));
app.use('/email/admin', require('./containers/email/admin/controllers'));
app.use('/email', require('./containers/email/controllers'));


app.use('/products', require('./containers/products/controllers'));
app.use('/categories', require('./containers/categories/controllers'));
app.use('/languages', require('./containers/languages/controllers'));
app.use('/translation', require('./containers/translation/controllers'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function errorHandler(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    //res.status(err.status || 500);
    //res.render('error');

    if (typeof (err) === 'string') {
        // custom application error
        console.log('Error:',err);
        return res.status(400).json({
            status: 400,
            message: err
        });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        console.log('Error:',err.message);
        return res.status(400).json({
            status: 400,
            message: err.message
        });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        console.log('Error:', err.message);
        return res.status(401).json({
            status: 401,
            message: err.message
        });
    }

    // default to 500 server error
    console.log('Error:',err.message);
    return res.status(500).json({
        status: 500,
        message: err.message
    });
});

// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 5000;
server.listen(port, function () {
    console.log('Server listening on port ' + port);
});

server.on('error', function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.on('listening', function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
});
