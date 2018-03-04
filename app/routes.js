var forDb = require('./model/forDb');
var path = require("path");

module.exports = function(app) {

    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname+'/../views/index.html'));
    });


    app.get('/fraction',function(req, res) {
        return forDb.findAl(forDb.Fraction, res);
    });

    app.get('/hero',function(req, res) {
        return forDb.findAl(forDb.Hero, res);
    });

    app.get('/magic',function(req, res) {
        return forDb.findAl(forDb.Magic, res);
    });

    app.get('/army',function(req, res) {
        return forDb.findAl(forDb.Army, res);
    });

    app.get('/castle',function(req, res) {
        return forDb.findAl(forDb.Castle, res);
    });




    
    app.get('*', function(req, res){
        res.sendFile(path.join(__dirname+'/../views/error.html'));
    });

};
