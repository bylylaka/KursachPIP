var forDb = require('./forDb');

function PathPage(path) {
    switch (path) {
        case '/':
        case '/index':
            return 'index.html';
        case '/castle':
            return 'index.html';
        default:
            return 'error.html'
    }
}


function PathDb(parsedurl, res) {
    switch (parsedurl.pathname) {
        case '/caslte':
            return forDb.findAl(forDb.Fraction, res);
        case '/hero':
            return forDb.findAl(forDb.Hero, res);
        case '/magic':
            return forDb.findAl(forDb.Magic, res);
        case '/army':
            return forDb.findAl(forDb.Army, res);
        case '/caslte':
            return forDb.findAl(forDb.Castle, res);
        default:
            res.end();
    }
}


exports.PathPage = PathPage;
exports.PathDb = PathDb;
