var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('./router');
var $ = require('jQuery');


var server = new http.Server;
server.listen('8888');

server.on('request', function(req, res) {
    var parsedurl = url.parse(req.url, true);

    // if (parsedurl.query.message)
    //     console.log(parsedurl.query.message);
    //
    // fs.readFile(path.PathPage(parsedurl.path), function (error, data) {
    //     if (error) throw new Error(error);
    //
    //     res.end(data);
    // });

    path.PathDb(parsedurl, res);

});
