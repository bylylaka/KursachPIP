var forDb = require('./../app/models/forDb');
const Sequelize = require('sequelize');


 // const sequelize = new Sequelize('heroes', 'postgres', '1qaz@WSX', {
 //     host: 'localhost',
 //     dialect: 'postgres',
 // });
const sequelize = new Sequelize('postgres://postgres:muxus123@localhost:5432/testDB');

sequelize
    .authenticate()
    .then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:\n\n\n\n\n\n', err);
});


// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

// load the auth variables
var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(id, done) {

        sequelize.query("SELECT \"user\".\"id\" as \"user_id\", \"facebook\".\"id\" as \"facebook_id\", \"local\".\"id\" as \"local_id\", \"local\".\"email\" AS \"local_email\", \"local\".\"password\" AS \"local_password\", \"facebook\".\"token\" AS \"facebook_token\", \"facebook\".\"email\" AS \"facebook_email\", \"facebook\".\"name\" AS \"facebook_name\",\n" +
            "\"twitter\".\"id\" as \"twitter_id\", \"twitter\".displayName as \"twitter_displayname\", \"twitter\".\"token\" as \"twitter_token\", \"twitter\".\"username\" as \"twitter_username\"\n" +
            "FROM \"user\" LEFT JOIN \"facebook\" ON \"user\".\"facebook\" = \"facebook\".\"id\" LEFT JOIN \"local\" ON \"user\".\"local\" = \"local\".\"id\" LEFT JOIN \"twitter\" ON \"user\".twitter = \"twitter\".\"id\" WHERE \"user\".\"id\" = "+id).spread((results, metadata) => {
            // console.log('\n\n\n\n\n\n');
            // console.log(results[0]);
            done(null, results[0]);
        });
    });



    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        // forDb.User.findOne({where : {id: id}}).then(user => {        //FORLOCAL
        done(null, user);
        // });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {

            // asynchronous
            process.nextTick(function() {

                    forDb.Local.findOne({where : {email: email}}).then(user => {
                        if (!user) {
                            return done(null, false, req.flash('loginMessage', 'No user found.'));
                        }
                        else {
                            forDb.User.findOne({where : {local: user.id}}).then(usero => {
                                return done(null, usero.id);
                            });
                        }
                    });
            });
        }));


    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {

            // asynchronous
            process.nextTick(function() {

                if (!req.user) {

                    forDb.Local.findOne({where: {email: email}}).then(function (user) {

                        if (!user) {
                            var newLocal = forDb.Local.build({       //saveLocal
                                email: email,
                                password: password
                            });
                            newLocal.save().done(function () {
                                forDb.Local.findOne({where: {email: email}}).then(function (user) {
                                    var newUser = forDb.User.build({       //saveUser
                                        local: user.dataValues.id
                                    }).save().done(function () {
                                        forDb.User.findOne({where: {local: user.dataValues.id}}).then(function (usero) {





                                            var newHero = forDb.Hero.build({       //saveLocal
                                                name: email,
                                                user: usero.dataValues.id
                                            });
                                            newHero.save();





                                            return done(null, usero.dataValues.id);
                                        });
                                    });
                                });
                            });
                        }
                        else {
                            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                        }
                    });
                }
                else {
                    forDb.Local.findOne({where : {email: email}}).then(user => {
                        if (!user) {
                            forDb.User.findOne({where : {id: req.user.id}}).then(function(usero) {
                                var newLocal = forDb.Local.build({       //save
                                    email: email,
                                    password : password
                                });
                                newLocal.save().done(function () {
                                    forDb.Local.findOne({where : {email: email}}).then(function(userL) {
                                        usero.updateAttributes({
                                            local: userL.id
                                        }).done(function () {
                                            return done(null, usero.dataValues.id);
                                            });
                                        });
                                    });
                                });
                            }
                        else {
                                console.log('That account was already taken.');
                                return done(null, false, req.flash('signupMessage', 'That account was already taken.'));
                            }
                        });
                }
            });
        }));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

            clientID        : configAuth.facebookAuth.clientID,
            clientSecret    : configAuth.facebookAuth.clientSecret,
            callbackURL     : configAuth.facebookAuth.callbackURL,
            profileURL      : configAuth.facebookAuth.profileURL,
            profileFields   : configAuth.facebookAuth.profileFields,
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

        },
        function(req, token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function() {

                // check if the user is already logged in
                if (!req.user) {

                    forDb.Facebook.findOne({where : {id: profile.id}}).then(function(user) {
                        if (!user){
                            var newFacebook = forDb.Facebook.build({       //save
                                id: profile.id,
                                email: profile.emails[0].value,
                                name: profile.name.givenName+' '+profile.name.familyName,
                                token: token
                            });
                            newFacebook.save().done(function() {
                                var newUser = forDb.User.build({       //save
                                    facebook: profile.id
                                }).save().done(function() {
                                    forDb.User.findOne({where : {facebook: profile.id}}).then(function(usero) {






                                        var newHero = forDb.Hero.build({       //saveLocal
                                            name: profile.name.givenName+' '+profile.name.familyName,
                                            user: usero.dataValues.id
                                        });
                                        newHero.save();





                                        return done(null, usero.dataValues.id);
                                    });
                                });
                            });
                        }
                        else {
                            if (!profile.emails)
                                profile.emails=["null"];
                            user.updateAttributes({
                                id: profile.id,
                                email: profile.emails[0].value,
                                name: profile.name.givenName+' '+profile.name.familyName,
                                token: token
                            });

                            forDb.User.findOne({where: {facebook: profile.id}}).then(function (usero) {
                                return done(null, usero.dataValues.id);
                            });
                        }
                    });
                }
                else {              //if Already login

                    forDb.Facebook.findOne({where : {id: profile.id}}).then(function(userF) {
                        if (!userF) {
                            forDb.User.findOne({where : {id: req.user.id}}).then(function(usero) {

                                var newFacebook = forDb.Facebook.build({       //save
                                    id: profile.id,
                                    email: profile.emails[0].value,
                                    name: profile.name.givenName + ' ' + profile.name.familyName,
                                    token: token
                                });
                                newFacebook.save().done(function () {

                                    usero.updateAttributes({
                                        facebook: profile.id
                                    }).done(function () {
                                        return done(null, usero.dataValues.id);
                                    });
                                });
                            });
                        }
                        else {
                            console.log('That account was already taken.');
                            return done(null, false, req.flash('signupMessage', 'That account was already taken.'));
                        }
                    });
                }
            });
        }));

    // =========================================================================
    // TWITTER =================================================================
    // =========================================================================
    passport.use(new TwitterStrategy({

            consumerKey     : configAuth.twitterAuth.consumerKey,
            consumerSecret  : configAuth.twitterAuth.consumerSecret,
            callbackURL     : configAuth.twitterAuth.callbackURL,
            passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

        },
        function(req, token, tokenSecret, profile, done) {

            // asynchronous
            process.nextTick(function() {

                // check if the user is already logged in
                if (!req.user) {

                    forDb.Twitter.findOne({where : {id: profile.id}}).then(function(user) {
                        if (!user){
                            var newTwitter = forDb.Twitter.build({       //save
                                id: profile.id,
                                username: profile._json.name,
                                displayname: profile._json.screen_name,
                                token: token
                            });
                            newTwitter.save().done(function() {
                                var newUser = forDb.User.build({       //save
                                    twitter: profile.id
                                }).save().done(function() {
                                    forDb.User.findOne({where : {twitter: profile.id}}).then(function(usero) {





                                        var newHero = forDb.Hero.build({       //saveLocal
                                            name: profile._json.name,
                                            user: usero.dataValues.id
                                        });
                                        newHero.save();





                                        return done(null, usero.dataValues.id);
                                    });
                                });
                            });
                        }
                        else {
                            user.updateAttributes({
                                id: profile.id,
                                username: profile.name,
                                displayname: profile.screen_name,
                                token: token
                            });

                            forDb.User.findOne({where: {twitter: profile.id}}).then(function (usero) {
                                return done(null, usero.dataValues.id);
                            });
                        }
                    });
                }
                else {              //if Already login

                    forDb.Twitter.findOne({where : {id: profile.id}}).then(function(userT) {
                        if (!userT) {
                            forDb.User.findOne({where : {id: req.user.id}}).then(function(usero) {

                                var newTwitter = forDb.Twitter.build({       //save
                                    id: profile.id,
                                    username: profile.name,
                                    displayname: profile.screen_name,
                                    token: token
                                });
                                newTwitter.save().done(function () {

                                    usero.updateAttributes({
                                        twitter: profile.id
                                    }).done(function () {
                                        return done(null, usero.dataValues.id);
                                    });
                                });
                            });
                        }
                        else {
                             console.log('That account was already taken.');
                            return done(null, false, req.flash('signupMessage', 'That account was already taken.'));
                        }
                    });
                }
            });

        }));

    // =========================================================================
    // GOOGLE =================================
    // =================================
    // =========================================================================
    // passport.use(new GoogleStrategy({        //СЛОЖНА С АЙДИ((((99((((((((9
    //
    //         clientID        : configAuth.googleAuth.clientID,
    //         clientSecret    : configAuth.googleAuth.clientSecret,
    //         callbackURL     : configAuth.googleAuth.callbackURL,
    //         passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    //
    //     },
    //     function(req, token, refreshToken, profile, done) {
    //
    //         // asynchronous
    //         process.nextTick(function() {
    //
    //             // check if the user is already logged in
    //             if (!req.user) {
    //
    //                 forDb.Google.findOne({where : {id: profile.id}}).then(function(user) {
    //                     if (!user){
    //                         var newGoogle = forDb.Google.build({       //save
    //                             id: profile.id,
    //                             name: profile._json.displayName,
    //                             email: profile._json.emails[0].value,
    //                             token: token
    //                         });
    //                         newGoogle.save().done(function() {
    //                             var newUser = forDb.User.build({       //save
    //                                 google: profile.id
    //                             }).save().done(function() {
    //                                 forDb.User.findOne({where : {google: profile.id}}).then(function(usero) {
    //                                     return done(null, usero.dataValues.id);
    //                                 });
    //                             });
    //                         });
    //                     }
    //                     else {
    //                         user.updateAttributes({
    //                             id: profile.id,
    //                             name: profile._json.displayName,
    //                             email: profile._json.emails[0].value,
    //                             token: token
    //                         });
    //
    //                         forDb.User.findOne({where: {google: profile.id}}).then(function (usero) {
    //                             return done(null, usero.dataValues.id);
    //                         });
    //                     }
    //                 });
    //             }
    //             else {              //if Already login
    //
    //                 forDb.Google.findOne({where : {id: profile.id}}).then(function(userF) {
    //                     if (!userF) {
    //                         forDb.User.findOne({where : {id: req.user.id}}).then(function(usero) {
    //
    //                             var newGoogle = forDb.Google.build({       //save
    //                                 id: profile.id,
    //                                 name: profile._json.displayName,
    //                                 email: profile._json.emails[0].value,
    //                                 token: token
    //                             });
    //                             newGoogle.save().done(function () {
    //
    //                                 usero.updateAttributes({
    //                                     google: profile.id
    //                                 }).done(function () {
    //                                     return done(null, usero.dataValues.id);
    //                                 });
    //                             });
    //                         });
    //                     }
    //                     else {
    //                         console.log('That account was already taken.');
    //                         return done(null, false, req.flash('signupMessage', 'That account was already taken.'));
    //                     }
    //                 });
    //             }
    //         });
    //     }));
};