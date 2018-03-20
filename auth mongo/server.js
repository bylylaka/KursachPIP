var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var wsport     = process.env.PORT || 8081;
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var configDB = require('./config/database.js');
require('./config/passport')(passport); // pass passport for configuration
var WebSocketServer = require('ws').Server;
var forDb = require('./app/models/forDb');
var expressWs = require('express-ws')(app);


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







// //WebSocket
// var clients = {};
// var wss = new WebSocketServer({ port: wsport });
//
// wss.on('connection', function (ws, req) {
//
//     var id = Math.random();
//     clients[id] = ws;
//
//     forDb.Messages.findAll().then(message => {
//         message.forEach(function(mes) {
//             ws.send(mes.dataValues.message);
//         });
//     });
//
//     ws.on('message', function (message) {
//         for (var key in clients) {
//             clients[key].send(message);
//         }
//         console.log('\n\n\n\n')
//         forDb.addMessage(message);
//     });
//
//     ws.on('close', function() {
//         console.log('соединение закрыто ' + id);
//         delete clients[id];
//     });
//     console.log('User connected');
// });



// launch ======================================================================
app.listen(port);

console.log('The magic happens on port ' + port);
