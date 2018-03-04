var http = require('http');
var url = require('url');
var fs = require('fs');
var express = require('express');
var app = express();

var port = process.env.PORT || 8888;

require('./app/routes.js')(app);

app.listen(port);
