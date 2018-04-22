var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var wsport = process.env.PORT || 8081;
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var configDB = require('./config/database.js');
require('./config/passport')(passport); // pass passport for configuration
var WebSocketServer = require('ws').Server;
var forDb = require('./app/models/forDb');
var expressWs = require('express-ws')(app);














const http = require('http')
const socketIO = require('socket.io')
const server = http.createServer(app)
const io = socketIO(server)
server.listen(8888, () => console.log(`Listening on port ${8888}`))



io.on('connection', socket => {
    // console.log('New client connected')

    socket.on('change color', (color) => {
        // console.log('Color Changed to: ', color);
        io.sockets.emit('change color', color)
    })
    socket.on('disconnect', () => {
        // console.log('user disconnected')
    })
})


var xmpp = require('simple-xmpp');

xmpp.connect({
    jid: 'maximus1998g@jabber.ru',
    password: '1qaz@WSX',
    host: 'jabber.ru',
    port: 5222
});

xmpp.on('online', function (data) {
    // console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n');
    // console.log('Connected with JID: ' + data.jid.user);
    // console.log('Yes, I\'m connected!');
});

xmpp.on('chat', function (from, message) {
    // console.log('\n\n\n' + message + 'n\n\n');
    io.sockets.emit('change color', message);
    // xmpp.send(from, 'echo: ' + message);
});

xmpp.on('error', function (err) {
    // console.log('\n\n\n\n\n\n\nerror\n\n\n\n\n\n');
    console.error(err);
});

xmpp.on('subscribe', function (from) {
    // console.log('\n\n\n\n\n\n\nsubssscribe\n\n\n\n\n\n');
    if (from === 'a.friend@gmail.com') {
        xmpp.acceptSubscription(from)
    }
});

xmpp.getRoster();

setInterval(function() {
    xmpp.send('maximus1998g@jabber.ru', 'СХОДИ ПРОГУЛЯЙСЯ, СОВСЕМ ОДИЧАЛ УЖЕ - ЗА СВОИМ КОМПУКТЕРОМ СУТКАМИ СИДИШЬ!ы');
}, 20000);


























// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// launch ======================================================================
app.listen(port);

console.log('The magic happens on port ' + port);