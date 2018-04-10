var forDb = require('./models/forDb');
var path    = require("path");

module.exports = function(app, passport) {
    var expressWs = require('express-ws')(app);
    var bodyParser = require ( "body-parser" ) ;
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    var clients = {};

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('loginMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // facebook -------------------------------

    // send to facebook to do the authentication
    app.post('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : 'http://localhost:3000/profile',
            failureRedirect : 'http://localhost:3000'
        }));

    // twitter --------------------------------

    // send to twitter to do the authentication
    app.post('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : 'http://localhost:3000/profile',
            failureRedirect : 'http://localhost:3000'
        }));


    // google ---------------------------------

    // send to google to do the authentication
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

    // locally --------------------------------
    app.get('/connect/local', function(req, res) {
        res.render('connect-local.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect : 'http://localhost:3000/profile',
            failureRedirect : '/'
        }));

    // twitter --------------------------------

    // send to twitter to do the authentication
    app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

    // handle the callback after twitter has authorized the user
    app.get('/connect/twitter/callback',
        passport.authorize('twitter', {
            successRedirect : 'http://localhost:3000/profile',
            failureRedirect : '/'
        }));


    // google ---------------------------------

    // send to google to do the authentication
    app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

    // the callback after google has authorized the user
    app.get('/connect/google/callback',
        passport.authorize('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', function(req, res) {
        var user            = req.user;
        user.facebook.token = undefined;
        user.save(function(err) {
            res.redirect('http://localhost:3000/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', function(req, res) {
        var user           = req.user;
        user.twitter.token = undefined;
        user.save(function(err) {
            res.redirect('http://localhost:3000/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', function(req, res) {
        var user          = req.user;
        user.google.token = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });





    app.get('/fraction', isLoggedIn, function(req, res) {
        return forDb.findAl(forDb.Fraction, res);
    });

    app.get('/hero', isLoggedIn, function(req, res) {
        return forDb.findAl(forDb.Hero, res);
    });

    app.get('/magic', isLoggedIn, function(req, res) {
        return forDb.findAl(forDb.Magic, res);
    });

    app.get('/army', isLoggedIn, function(req, res) {
        return forDb.findAl(forDb.Army, res);
    });

    app.get('/castle', isLoggedIn, function(req, res) {

        //forDb.findAl(forDb.Castle, res);
        //forDb.Local.findOne({where : {id: req.user.user_id}}).then(function(user) {
        //forDb.findAl(forDb.Castle, res);
        //forDb.Local.findOne({where : {id: req.user}}).then(function(user) {
            forDb.availableCastles(forDb.Castle, forDb.Hero, req.user, res);
        //});
    });


    app.get('/enter/:id', isLoggedIn, function(req, res) {
        forDb.Hero.update({ castle: req.params.id }, { where : {user: req.user.user_id } }).then(function () {
            res.send("Success!");
        });
    });


    app.get('/castles/:castle', isLoggedIn, function(req, res) {
        //res.send("castle is " + req.params.castle);
        forDb.Castle.findAll({ where: { name : req.params.castle } }).then(function (castle) {
            res.send(castle);
        });
    });

    app.get('/myHero', isLoggedIn, function(req, res) {
        forDb.Hero.findAll({ where: { user : req.user.user_id } }).then(function (hero) {
            res.send(hero);
        });
    });

    app.get('/profiles/:profile', isLoggedIn,  function(req, res) {
        forDb.Hero.findAll({ where: { id : req.params.profile } }).then(function (hero) {
            console.log(hero.dataValues);
            res.send(hero);
        });
    });

    app.post('/changeProlile', isLoggedIn, function (req, res) {
        console.log('\n\n\n');
        console.log(req.body);
        forDb.Hero.update({ name: req.body.name, castle: req.body.castle, gender: req.body.gender, gold: req.body.gold},
            { where : {user: req.user.user_id } }).then(function () {
            res.send();
        });
    });

    /**************************************POSTS LOGIC(BEGIN)**********************************************************/


    app.get('/post/:post/comments', isLoggedIn, function(req, res) {
        forDb.Comment.findAll({ where: { post_id : req.params.post } }).then(function (comments) {
            res.send(comments);
        });
    });

    app.get('/addPost/heroes', isLoggedIn, function(req, res) {
        forDb.Hero.findAll().then(function (heroes) {
            res.send(heroes);
        });
    });

    app.get('/post/:post/likes', isLoggedIn, function(req, res) {
        forDb.Likes.findAndCountAll({ where: { post_id : req.params.post } }).then(result => {
            res.send(result.rows);
        });

    });

    app.get('/post/:post/heroes', isLoggedIn, function(req, res) {
        forDb.Hero.findAll().then(function (heroes) {
            res.send(heroes);
        });
    });

///////////////////////////////////////////////////////////////////////////////////////////////////////////
    app.use('/post/:post/addComment', bodyParser.urlencoded({
        extended: true
    }));

    app.ws('/post/:post/addComment', function(ws, req) {
        let id;
        let name;
        forDb.Hero.findOne({where : {user: req.user.user_id}}).then(function(hero) {
            name = hero.name;
            id = hero.user;
            clients[id] = ws;
        });

        forDb.Comment.findAll({ where: { post_id : req.params.post } }).then(function (comments) {
            comments.forEach(function(comment) {
                forDb.Hero.findOne({where : {user: comment.dataValues.user_id}}).then(function(hero) {
                    ws.send(hero.name + ' (' + comment.dataValues.date_and_time + '): ' + comment.dataValues.content);
                });
            });
        });

        ws.on('message', function (comment) {
            for (let key in clients) {
                clients[key].send(name + ' (сейчас): ' + comment);
            }
            forDb.addComment(comment, id, req.params.post);
        });

        ws.on('close', function() {
            console.log('соединение закрыто ' + id);
            delete clients[id];
        });
        console.log('User connected');
    });

    app.get('/post/:post/addLike', isLoggedIn, function(req, res) {
        forDb.Likes.findOne({ where: { post_id : req.params.post, user_id: req.user.user_id } }).then(like => {
            if(!like){
                let newLike = forDb.Likes.build({
                    post_id: req.params.post,
                    user_id: req.user.user_id
                });
                newLike.save().then( res.send("Success!") );
            }
            else{
                let newLike = forDb.Likes.destroy({
                    where:{
                        post_id: req.params.post,
                        user_id: req.user.user_id
                    }
                });
                res.send("Success!");
            }
        });
    });



    app.get('/post/:post/isPuttedLike', isLoggedIn, function(req, res) {
        forDb.Likes.findAndCountAll({ where: { post_id : req.params.post, user_id: req.user.user_id } }).then(like => {
            if(!like){
                res.send(null);
            }
            else{
                res.send(like.rows);
            }

        });
    });

//////////////////////////////////////////////////////////
    var crypt = require('crypto-js/aes');
    var SHA256 = require("crypto-js/sha256");
    var CryptoJS = require("crypto-js");

    const Crypto = require('node-crypt');
    const crypto = new Crypto({
        key: 'b95d8cb128734ff8821ea634dc34334535afe438524a782152d11a5248e71b01',
        hmacKey: 'dcf8cd2a90b1856c74a9f914abbb5f467c38252b611b138d8eedbe2abb4434fc'
    });


    let upload = require("express-fileupload");
    app.use(upload());

    app.post('/addPost', isLoggedIn, function(req, res) {

        let filename = null;
        console.log(req.files);
        if(req.files != null){
            let hash = Date.now() + req.files.file.name;
            let format = hash.split('.')[1];
            hash = crypto.encrypt(hash);

            filename = hash + "." + format;
            filename = filename.replace(/[|]/g, "");

            let imageFile = req.files.file;
            imageFile.mv(`./client/public/uploads/${filename}`, function(err) {
                if (err) {
                    console.log("error");
                }
                console.log("file was saved");
            });

        }

        let newPost = forDb.Post.build({
            title: req.body.title,
            content: req.body.content,
            hero_id: req.body.hero_id,
            file: filename
        });
        newPost.save().then( res.send("Done!") );
    });


    app.get('/post/:post', isLoggedIn, function(req, res) {
        forDb.Post.findAll({ where: { id : req.params.post } }).then(function (post) {
            res.send(post);
        });
    });

    app.get('/post/:post/img', isLoggedIn, function(req, res) {
        forDb.Post.findOne({ where: { id : req.params.post } }).then(function (post) {
            res.sendfile(path.resolve(`./client/public/uploads/${post.dataValues.file}`));
        });

    });


    app.get('/posts', isLoggedIn, function(req, res) {
        forDb.findAl(forDb.Post, res);
    });


    /**************************************POSTS LOGIC(END)************************************************************/


    /*
    app.post('/submitfraction', isLoggedIn, function(req, res) {        //После регистрации
        forDb.Hero.findOne({where : {user: req.user.user_id}}).then(function(hero) {
            forDb.Fraction.findOne({where : {name: req.body.fraction}}).then(function(fraction) {
                if (fraction != null)
                    hero.updateAttributes({
                        fraction: fraction.id
                    });
                res.send("Added fraction!");
            });
        });
    });


    app.get('/submitfraction', isLoggedIn, function(req, res) {        //После входа
        forDb.Hero.findOne({where : {user: req.user.user_id}}).then(function(hero) {
            if (hero.dataValues.fraction == null)
                res.send("Этот пидр не выбрал фракцию!");
            else
                res.send("Он уже выбрал фракцию");
        });
    });

*/











    // PROFILE SECTION =========================
    app.get('/chat', isLoggedIn, function(req, res) {
        res.sendFile(path.join(__dirname+'/../views/ws.html'));
    });

    app.ws('/echo', function(ws, req) {         //Тут типо WebSocket
        var id;
        var name;
        var heroid;

        forDb.User.findOne({where : {id: req.user.user_id}}).then(function(user) {
            id = user.dataValues.id;
            clients[id] = ws;
        });
        forDb.Hero.findOne({where : {user: req.user.user_id}}).then(function(hero) {
            name = hero.dataValues.name;
            heroid = hero.dataValues.id;
        });

        forDb.Messages.findAll().then(message => {
            message.forEach(function(mes) {
                ws.send(mes.dataValues.hero+ ':\t'+ mes.dataValues.message);
            });
        });

        ws.on('message', function (message) {
            for (var key in clients) {
                clients[key].send(name+':\t'+message);
            }
            forDb.addMessage(message, name, heroid);
        });

        ws.on('close', function() {
            console.log('соединение закрыто ' + id);
            delete clients[id];
        });
        console.log('User connected');
    });


    app.ws('/echoCastle', function(ws, req) {         //Тут типо WebSocket ДЛЯ ЧАТА ЗАМКА!
        var id;
        var name;
        var heroid;
        var castle;

        forDb.User.findOne({where : {id: req.user.user_id}}).then(function(user) {
            id = user.dataValues.id;
            clients[id] = ws;
        });

        forDb.Hero.findOne({where : {user: req.user.user_id}}).then(function(hero) {
            name = hero.dataValues.name;
            heroid = hero.dataValues.id;
            castle = hero.dataValues.castle;

            forDb.Messages.findAll({ where: { castle: castle}}).then(message => {
                console.log('\n\n\n' + castle)
                message.forEach(function(mes) {
                    ws.send(mes.dataValues.hero+ ':\t'+ mes.dataValues.message);
                });
            });
        });


        ws.on('message', function (message) {
            for (var key in clients) {
                clients[key].send(name+':\t'+message);
            }
            forDb.addMessage(message, name, heroid, castle);
        });

        ws.on('close', function() {
            console.log('соединение закрыто ' + id);
            delete clients[id];
        });
        console.log('User connected');
    });
};




// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.send();
}