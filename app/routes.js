var forDb = require('./models/forDb');
var path    = require("path");
var server = require('../server');

module.exports = function(app, passport) {
    var expressWs = require('express-ws')(app);
    var bodyParser = require ( "body-parser" ) ;

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    var clients = {};
    var castleCh = {};

// normal routes ===============================================================

    // show the home page (will also have our login links)
    /*
    f, function(req, res) {
        res.render('index.ejs');
    });
    */
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
        res.end();
        //res.render('login.ejs', { message: req.flash('loginMessage') });
    });


    // process the login form

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/loginFailure', // redirect back to the signup page if there is an error
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
        failureRedirect : '/signupFailure', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // facebook -------------------------------

    // send to facebook to do the authentication
    app.post('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : 'http://localhost:3000/profile',
            failureRedirect : 'http://localhost:3000/NeLink'
        }));

    // twitter --------------------------------

    // send to twitter to do the authentication
    app.post('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : 'http://localhost:3000/profile',
            failureRedirect : 'http://localhost:3000/NeLink'
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
    app.post('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect : 'http://localhost:3000/profile',
            failureRedirect : '/qwe'
        }));

    // twitter --------------------------------

    // send to twitter to do the authentication
    app.post('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

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

    app.get('/subHeroMoney/:castle', isLoggedIn, function(req, res) {
        forDb.Castle.findOne({ where: { id : req.params.castle } }).then(function (castle) {
            let goldSub = castle.gold;

            forDb.Hero.findOne({ where: { user : req.user.user_id } }).then(function (hero) {
                let goldPrev = hero.gold;

                forDb.Hero.update({ gold: goldPrev - goldSub }, { where : {user: req.user.user_id } }).then(function () {
                    res.send("Success!");
                });
            });
        });
    });

    app.get('/castles/:castle', isLoggedIn, function(req, res) {
        forDb.getCastleInf(req, res);
    });

    app.get('/myCastle', isLoggedIn, function(req, res) {
        forDb.getMyCastleInf(req, res);
    });

    app.get('/myHero', isLoggedIn, function(req, res) {
        forDb.Hero.findAll({ where: { user : req.user.user_id } }).then(function (hero) {
            forDb.getFraction(hero, res)
        });
    });

    app.get('/accountAuthInfo', isLoggedIn, function(req, res) {
        res.send(req.user)
    });

    app.get('/profiles/:profile', isLoggedIn,  function(req, res) {
        forDb.Hero.findAll({ where: { id : req.params.profile } }).then(function (hero) {
            forDb.getFraction(hero, res)
            //console.log(hero.dataValues);
        });
    });

    app.post('/changeProlile', isLoggedIn, function (req, res) {
        //console.log('\n\n\n');
        forDb.avatarka.findOne({where : {pathname:req.body.photo}}).then(function(avatarka) {
            forDb.Hero.update({ name: req.body.name, castle: req.body.castle, gender: req.body.gender, gold: req.body.gold, avatarka: avatarka.id},
                { where : {user: req.user.user_id } }).then(function () {
                res.send();
            });
        });
    });


    app.get('/sessionUser', function(req, res) {
        res.send(req.user);
    });

    app.get('/sessionHero', isLoggedIn, function(req, res) {
        forDb.Hero.findOne({where : { user: req.user.user_id }}).then(function(hero) {
            res.send(hero);
        });
    });

    /**************************************POSTS LOGIC(BEGIN)**********************************************************/

    const promise = require('bluebird');
    const initOptions = {
        promiseLib: promise // overriding the default (ES6 Promise);
    };
    const pgp = require('pg-promise')(initOptions);
    const cn = {
        host: 'localhost', // 'localhost' is the default;
        port: 5432, // 5432 is the default;
        database: 'heroes',
        user: 'postgres',
        password: '1qaz@WSX'
    };

    const db = pgp(cn); // database instance;


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

    app.use('/post/:post/addComment', bodyParser.urlencoded({
        extended: true
    }));

    app.get('/hero_achievements', isLoggedIn, function(req, res) {
        forDb.Hero.findOne({where : {user: req.user.user_id}}).then(function(hero) {
            forDb.achievements_to_hero.findAll({where : {hero_id: hero.id}}).then(function (achievements) {
                res.send(achievements);
            });
        });
    });

    app.get('/some_hero_achievements/:hero', isLoggedIn, function(req, res) {
        forDb.achievements_to_hero.findAll({where : {hero_id: req.params.hero}}).then(function (achievements) {
            res.send(achievements);
        });
    });

    app.get('/all_achievements', isLoggedIn, function(req, res) {
        forDb.Achievements.findAll({order: [['id', 'ASC']]}).then(function(achievements) {
            res.send(achievements);
        });
    });



    app.get('/test', isLoggedIn, function(req, res) {
        forDb.heroAvatar(2, res)
    });


    app.ws('/post/:post/addComment', function(ws, req) {
        let id;
        let name;
        let heroi;
        forDb.Hero.findOne({where : {user: req.user.user_id}}).then(function(hero) {
            name = hero.dataValues.name;
            heroi = hero.dataValues.id;
            id = hero.dataValues.user;
            clients[id] = ws;
        });

        forDb.Comment.findAll({ where: { post_id : req.params.post } }).then(function (comments) {
            comments.forEach(function(comment) {
                forDb.Hero.findOne({where : {id: comment.dataValues.hero_id}}).then(function(hero) {

                    let newComment = {
                        hero_id: hero.id,
                        hero: hero.name,
                        date: comment.dataValues.date_and_time,
                        content: comment.dataValues.content,
                    };

                    ws.send(JSON.stringify(newComment));
                });
            });
        });

        ws.on('message', function (comment) {
            for (let key in clients) {

                let newComment = {
                    hero_id: heroi,
                    hero: name,
                    date: 'только что',
                    content: comment,
                };
                //name + ' (сейчас): ' + comment
                clients[key].send(JSON.stringify(newComment));
            }
            forDb.addComment(comment, heroi, req.params.post);

            /*******************************ADD GOLD FOR COMMENTS****************************************/
            forDb.Hero.findOne({ where: { user : req.user.user_id } }).then(function (hero) {
                forDb.Comment.findAndCountAll({ where: { hero_id : hero.dataValues.id }}).then(comments => {
                    //res.send(result.rows);
                    forDb.Achievements.findAll({ where: { type : 'comment', quantity: {[forDb.Op.gte]: comments.count + 1}}, order: [['id', 'ASC']], limit: 1 }).then(function (achievements) {
                        achievements.forEach(function(achievement) {
                            // check achievements of user
                            forDb.achievements_to_hero.findOne({ where: { hero_id : hero.dataValues.id, achievement_id: achievement.dataValues.id } }).then(relation => {
                                // add gold
                                if(achievement.dataValues.quantity === comments.count + 1 && !relation){
                                    let gold = hero.dataValues.gold;
                                    hero.update({ gold: gold + achievement.dataValues.gold }).then(function () {
                                        // add achievement to achievements_to_user table
                                        let newAchievementToHero = forDb.achievements_to_hero.build({
                                            hero_id: hero.dataValues.id,
                                            achievement_id: achievement.dataValues.id
                                        });
                                        //server.xmpp.send('maximus1998g@jabber.ru', 'НОВОЕ ДОСТИЖЕНИЕ!\n' + '<<< ' + achievement.dataValues.achievement + ' >>>' + '\n +' + achievement.dataValues.gold +  ' голды!');
                                        newAchievementToHero.save().then();
                                    });
                                }
                            });
                        });
                    });
                });
            });
        });

        ws.on('close', function() {
            console.log('соединение закрыто ' + id);
            delete clients[id];
        });
        console.log('User connected');
    });

    app.get('/post/:post/addLike', isLoggedIn, function(req, res) {
        forDb.Hero.findOne({ where: { user : req.user.user_id } }).then(function (hero) {
            forDb.Likes.findOne({ where: { post_id : req.params.post, hero_id: hero.dataValues.id } }).then(like => {
                if(!like){
                    let newLike = forDb.Likes.build({
                        post_id: req.params.post,
                        hero_id: hero.dataValues.id
                    });
                    newLike.save().then();

                    /*******************************ADD GOLD FOR LIKES ****************************************/
                    forDb.Likes.findAndCountAll({ where: { hero_id : hero.dataValues.id }}).then(likes => {
                        //res.send(result.rows);
                        forDb.Achievements.findAll({ where: { type : 'like', quantity: {[forDb.Op.gte]: likes.count + 1}}, order: [['id', 'ASC']], limit: 1 }).then(function (achievements) {
                            achievements.forEach(function(achievement) {
                                // check achievements of user
                                forDb.achievements_to_hero.findOne({ where: { hero_id : req.user.user_id, achievement_id: achievement.dataValues.id } }).then(relation => {
                                    // add gold
                                    if(achievement.dataValues.quantity === likes.count + 1 && !relation){
                                        forDb.Hero.findOne({ where: { user : req.user.user_id } }).then(function (hero) {
                                            let gold = hero.dataValues.gold;
                                            hero.update({ gold: gold + achievement.dataValues.gold }).then(function () {
                                                // add achievement to achievements_to_user table
                                                let newAchievementToHero = forDb.achievements_to_hero.build({
                                                    hero_id: hero.dataValues.id,
                                                    achievement_id: achievement.dataValues.id
                                                });
                                                //server.xmpp.send('maximus1998g@jabber.ru', 'НОВОЕ ДОСТИЖЕНИЕ!\n' + '<<< ' + achievement.dataValues.achievement + ' >>>' + '\n +' + achievement.dataValues.gold +  ' голды!');
                                                newAchievementToHero.save().then( res.send("Gold added") );
                                            });
                                        });
                                    }
                                });
                            });
                        });
                    });
                }
                else{
                    let newLike = forDb.Likes.destroy({
                        where:{
                            post_id: req.params.post,
                            hero_id: hero.dataValues.id
                        }
                    });
                    res.send("Success!");
                }
            });
        });
    });



    app.get('/post/:post/isPuttedLike', isLoggedIn, function(req, res) {
        forDb.Hero.findOne({ where: { user : req.user.user_id } }).then(function (hero) {
            forDb.Likes.findAndCountAll({ where: { post_id : req.params.post, hero_id: hero.dataValues.id } }).then(like => {
                if(!like){
                    res.send(null);
                }
                else{
                    res.send(like.rows);
                }
            });
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
        //console.log(req.files);
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



    app.get('/post/:post/img', isLoggedIn, function(req, res) {
        forDb.Post.findOne({ where: { id : req.params.post } }).then(function (post) {
            res.sendfile(path.resolve(`./client/public/uploads/${post.dataValues.file}`));
        });
    });

    app.get('/current-post/:post', isLoggedIn, function(req, res) {
        forDb.Post.findAll({ where: { id : req.params.post } }).then(function (post) {
            res.send(post);
        });
    });



    app.get('/posts', isLoggedIn, function(req, res) {
        forDb.findAl(forDb.Post, res);
    });

    app.get('/getAvatars', isLoggedIn, function(req, res) {
        forDb.avatars(req, res);
    });


    /**************************************POSTS LOGIC(END)************************************************************/




    app.post('/submitfraction', isLoggedIn, function(req, res) {
        forDb.Hero.findOne({where : {user: req.user.user_id}}).then(function(hero) {

            forDb.Fraction.findOne({where : {name: req.body.fraction}}).then(function(fraction) {
                forDb.Castle.findOne({where : {fraction: fraction.dataValues.id}, order: [['rating', 'ASC']]}).then(function(castle) {
                    let gold = hero.gold - 500;
                    if (castle != null)
                        hero.updateAttributes({
                            castle: castle.id,
                            gold: gold
                        });
                    res.send("Added castle!");
                });
            });
        });
    });

    /*
    app.post('/submitfraction', isLoggedIn, function(req, res) {        //После регистрации
        console.log("\n\n\n\n" + req.body.fraction + "\n\n\n\n");
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
        var castle;

        forDb.User.findOne({where : {id: req.user.user_id}}).then(function(user) {
            id = user.dataValues.id;
            clients[id] = ws;
        });
        forDb.Hero.findOne({where : {user: req.user.user_id}}).then(function(hero) {
            name = hero.dataValues.name;
            heroid = hero.dataValues.id;
        });

        forDb.Messages.findAll({ where: { castle: null}}).then(message => {
            message.forEach(function(mes) {
                ws.send(JSON.stringify(mes.dataValues));
                // ws.send(mes.dataValues.hero+ ':\t'+ mes.dataValues.message);
            });
        });

        ws.on('message', function (message) {
            for (var key in clients) {
                var newMessage = {
                    hero: name,
                    heroid: heroid,
                    message: message,
                    date_and_time: 'только что'
                };
                clients[key].send(JSON.stringify(newMessage));
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

        // forDb.User.findOne({where : {id: req.user.user_id}}).then(function(user) {
        id = req.user.user_id;
        clients[id] = ws;
        // });

        forDb.Hero.findOne({where : {user: req.user.user_id}}).then(function(hero) {
            name = hero.dataValues.name;
            heroid = hero.dataValues.id;
            castle = hero.dataValues.castle;
            castleCh[id] = hero.dataValues.castle;

            forDb.Messages.findAll({ where: { castle: castle}}).then(message => {
                //console.log('\n\n\n' + castle)
                message.forEach(function(mes) {
                    ws.send(JSON.stringify(mes.dataValues));
                });
            });
        });


        ws.on('message', function (message) {
            for (var key in clients) {
                if (castleCh[key] == castle)
                    var newMessage = {
                        hero: name,
                        heroid: heroid,
                        message: message,
                        date_and_time: 'только что'
                    };
                clients[key].send(JSON.stringify(newMessage));
            }
            forDb.addMessage(message, name, heroid, castle);
        });

        ws.on('close', function() {
            console.log('соединение закрыто ' + id);
            delete clients[id];
        });
        console.log('User connected');
    });


    /************************************GETTING GOLD******************************/

    setInterval(function() {
        forDb.Hero.findAll().then(function (heroes) {
            heroes.forEach(function(hero) {
                let id = hero.dataValues.id;
                let gold = hero.dataValues.gold;
                forDb.Hero.update({ gold: gold + 10 }, { where : {id: id } }).then(function () {
                    return 0;
                });
            });
        });
        server.xmpp.send('maximus1998g@jabber.ru', ' +10 голды!');
    }, 500000);

};




// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.send();
}




