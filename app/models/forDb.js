const Sequelize = require('sequelize');
const Op = Sequelize.Op;

   // const sequelize = new Sequelize('heroes', 'postgres', '1qaz@WSX', {
   //     host: 'localhost',
   //     dialect: 'postgres',
   //   });
const sequelize = new Sequelize('postgres://postgres:muxus123@localhost:5432/testDB');

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:\n\n\n\n\n\n', err);
    });


const Fraction = sequelize.define('Fraction', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING
    }},{
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'fraction'
    });



const Castle = sequelize.define('Castle', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fraction: {
        type: Fraction
    },
    name: {
        type: Sequelize.STRING
    },
    rating: {
        type: Sequelize.INTEGER
    },
    gold: {
        type: Sequelize.INTEGER
    }},{
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'castle'
});


const Hero = sequelize.define('Hero', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING
    },
    gender: {
        type: Sequelize.STRING
    },
    castle: {///////////////
        type: Castle
    },
    experience: {
        type: Sequelize.INTEGER
    },
    user: {
        type: Sequelize.BIGINT
    },
    avatarka: {
        type: Sequelize.STRING
    },
    gold: {
        type: Sequelize.INTEGER
    }},{
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'hero'
});




const Magic = sequelize.define('Magic', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING
    },
    attack: {
        type: Sequelize.INTEGER
    },
    protection: {
        type: Sequelize.INTEGER
    },
    recovery: {
        type: Sequelize.INTEGER
    },
    bonus: {
        type: Sequelize.STRING
    },
    curse: {
        type: Sequelize.STRING
    },
    id_hero: {
        type: Hero
    }},{
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'magic'
});




const Army = sequelize.define('Army', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    morality: {
        type: Sequelize.INTEGER
    },
    id_hero: {
        type: Hero
    }},{
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'army'
});







const User = sequelize.define('user', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    local : {
        type: Sequelize.STRING
    },
    twitter : {
        type: Sequelize.STRING
    },
    google : {
        type: Sequelize.STRING
    },
    facebook : {
        type: Sequelize.STRING
    }},{
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'user'
});




const Local = sequelize.define('local', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    email : {
        type: Sequelize.STRING,
        unique: true
    },
    password: {
        type: Sequelize.STRING
    }},{
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'local'
});




const facebook = sequelize.define('Facebook', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    email : {
        type: Sequelize.STRING,
        unique: true
    },
    name : {
        type: Sequelize.STRING
    },
    token: {
        type: Sequelize.STRING
    }},{
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'facebook'
});



const twitter = sequelize.define('Twitter', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    displayname : {
        type: Sequelize.STRING,
        unique: true
    },
    username : {
        type: Sequelize.STRING
    },
    token: {
        type: Sequelize.STRING
    }},{
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'twitter'
});




const google = sequelize.define('Google', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name : {
        type: Sequelize.STRING,
        unique: true
    },
    email : {
        type: Sequelize.STRING
    },
    token: {
        type: Sequelize.STRING
    }},{
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'google'
});





const messages = sequelize.define('Messages', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    hero: {
        type: Sequelize.STRING,
    },
    heroid: {
        type: Sequelize.INTEGER,
    },
    castle: {
        type: Sequelize.INTEGER,
    },
    message: {
        type: Sequelize.STRING
    }},{
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'messages'
});


const Post = sequelize.define('Post', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING,
    },
    content: {
        type: Sequelize.STRING
    },
    date_and_time: {
        type: Sequelize.STRING
    },
    hero_id: {
        type: Sequelize.INTEGER
    },
    file: {
        type: Sequelize.STRING
    }},{
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'post'
});

const Comment = sequelize.define('Comment', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: Sequelize.STRING,
    },
    post_id: {
        type: Post
    },
    hero_id: {
        type: Hero
    },
    date_and_time: {
        type: Sequelize.STRING
    }},{
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'comment'
});

const Likes = sequelize.define('Likes', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    post_id: {
        type: Post
    },
    hero_id: {
        type: User
    }},{
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'likes'
});


const avatarka = sequelize.define('Avatarka', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    fraction: {
        type: Sequelize.INTEGER
    },
    name: {
        type: Sequelize.STRING
    },
    pathname: {
        type: Sequelize.STRING
    }},{
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'avatarka'
});


const Achievements = sequelize.define('Achievements', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: Sequelize.INTEGER
    },
    achievement: {
        type: Sequelize.STRING
    },
    quantity: {
        type: Sequelize.INTEGER
    },
    gold: {
        type: Sequelize.INTEGER
    }},{
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'achievements'
});

const achievements_to_hero = sequelize.define('achievements_to_hero', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    hero_id: {
        type: Hero
    },
    achievement_id: {
        type: Achievements
    }},{
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'achievements_to_hero'
});





// var newCastle = Castle.build({       //save
//     fraction: 3
// });
// newCastle.save();


// Note.findOne({where : {title: 'Joi'}}).then(function(user) {
//     console.log(user.dataValues.id);
// });










exports.addMessage = function addMessage(message, hero, heroId, castle) {        //Show all entities
    let newMessage = messages.build({       //save
        message: message,
        hero: hero,
        heroid: heroId,
        castle: castle
    });
    newMessage.save();
};

exports.addComment = function addComment(comment, hero_id, post_id) {        //Show all entities
    console.log('\n\n\n\n\n\n\n' + hero_id)
    let newComment = Comment.build({
        content: comment,
        post_id: post_id,
        hero_id: hero_id
    });
    newComment.save().then(() => {});
};




exports.findAl = function findAl(Obj, res) {        //Show all entities
    Obj.findAll().then(objes => {
        res.send(objes.reverse());
    });
};

exports.availableCastles = function availableCastles(castle, hero, user, res) {;
    //res.write(her.dataValues.user + '');
    //res.end();
    hero.findOne({
        where : { user: user.user_id }
    }).then(function(heroChild) {
        castle.findOne({
            where : { id: heroChild.castle }
        }).then(function(castleChild) {
            castle.findAll({
                where: {fraction: castleChild.fraction}
            }).then(function (fractionChildren) {
                res.send(fractionChildren);
            })
        })
    })
};



exports.getFraction = function getFraction(hero, res) {        //Get Fraction AND AVATARKY!!!!!!!
    sequelize.query("select name FROM fraction WHERE id in (select fraction from Castle WHERE" +
        " id in (select Hero.castle from Hero WHERE Hero.id = " + hero[0].dataValues.id + "))").spread((results, metadata) => {

        sequelize.query('SELECT name, pathname from avatarka where id in ' +
            '(select Hero.avatarka FROM Hero WHERE id = ' + hero[0].dataValues.id + ')').spread((resultsAva, metadataAva) => {

            sequelize.query('SELECT name, pathname from avatarka where fraction in (select id FROM fraction WHERE id in ' +
                '(select fraction from Castle WHERE id in (select Hero.castle from Hero ' +
                'WHERE Hero.id = ' + hero[0].dataValues.id + ')))').spread((resultsAvS, metadataAvS) => {

                    if (results[0])
                        hero[0].dataValues.fraction = results[0].name;
                    if (resultsAva[0]) {
                        hero[0].dataValues.avaname = resultsAva[0].name;
                        hero[0].dataValues.avapath = resultsAva[0].pathname;
                    }
                    if (resultsAvS) {
                        hero[0].dataValues.avaS = resultsAvS;
                    }

                    //console.log(hero[0].dataValues)
                    res.send(hero);
            });
        });
    });
};



exports.getMyCastleInf = function getMyCastleInf(req, res) {        //Get Heroes in Castle
    Hero.findAll({ where: { user : req.user.user_id } }).then(function (hero) {
        Castle.findAll({ where: { id : hero[0].dataValues.castle } }).then(function (castle) {
            Fraction.findAll({where: {id: castle[0].dataValues.fraction}}).then(function (fraction) {
                sequelize.query("SELECT Hero.id as id, Hero.name as name, avatarka.pathname as photo FROM Hero JOIN avatarka" +
                    " ON Hero.avatarka = avatarka.id where Hero.castle = " + castle[0].dataValues.id).spread((heroesCastle, metadata) => {
                        castle[0].dataValues.heroesCastle = heroesCastle;
                        castle[0].dataValues.fractionName = fraction[0].dataValues.name;
                        res.send(castle);
                    });
            })
        });
    });
}

exports.getCastleInf = function getCastleInf(req, res) {        //Get Heroes in Castle
    Castle.findAll({ where: { name : req.params.castle } }).then(function (castle) {
        Fraction.findAll({where: {id : castle[0].dataValues.fraction}}).then(function(fraction){
            sequelize.query("SELECT Hero.id as id, Hero.name as name, avatarka.pathname as photo FROM Hero JOIN avatarka" +
                " ON Hero.avatarka = avatarka.id where Hero.castle = " +  castle[0].dataValues.id).spread((heroesCastle, metadata) => {

                castle[0].dataValues.heroesCastle = heroesCastle;
                castle[0].dataValues.fractionName = fraction[0].dataValues.name;
                res.send(castle);
            });
        })
    });
}


exports.Fraction = Fraction;
exports.Hero = Hero;
exports.Magic = Magic;
exports.Army = Army;
exports.Castle = Castle;
exports.User = User;
exports.Local = Local;
exports.Facebook = facebook;
exports.Twitter = twitter;
exports.Google = google;
exports.Messages = messages;
exports.avatarka = avatarka;

exports.Post = Post;
exports.Comment = Comment;
exports.Likes = Likes;


exports.Achievements = Achievements;
exports.achievements_to_hero = achievements_to_hero;
exports.Op = Op;