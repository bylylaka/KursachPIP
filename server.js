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


var xmpp = require('simple-xmpp');

xmpp.connect({
    jid: 'maximus1998g@jabber.ru',
    password: '1qaz@WSX',
    host: 'jabber.ru',
    port: 5222
},
    xmpp.send('maximus1998g@jabber.ru', 'СХОДИ ПРОГУЛЯЙСЯ, СОВСЕМ ОДИЧАЛ УЖЕ - ЗА СВОИМ КОМПУКТЕРОМ СУТКАМИ СИДИШЬ!')
);

xmpp.on('chat', function (from, message) {
    if (message != '' && message != null && message != ' ') {
        console.log('\n\n\n' + message);
        io.sockets.emit('achievements', message);

        setTimeout(function () {
            xmpp.send(from, 'СХОДИ ПРОГУЛЯЙСЯ, СОВСЕМ ОДИЧАЛ УЖЕ - ЗА СВОИМ КОМПУКТЕРОМ СУТКАМИ СИДИШЬ!ы');
        }, 5000000);
    }
});
xmpp.getRoster();

exports.xmpp = xmpp;























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