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
    // user_id: {
    //     type: User
    // },
    hero_id: {
        type: Sequelize.INTEGER
    },
    date_and_time: {
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
    user_id: {
        type: User
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
    user_id: {
        type: User
    }},{
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'likes'
});





// var newCastle = Castle.build({       //save
//     fraction: 3
// });
// newCastle.save();


// Note.findOne({where : {title: 'Joi'}}).then(function(user) {
//     console.log(user.dataValues.id);
// });










exports.addMessage = function addMessage(message, hero, heroId, castle) {        //Show all entities
    var newMessage = messages.build({       //save
        message: message,
        hero: hero,
        heroid: heroId,
        castle: castle
    });
    newMessage.save();
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

exports.Post = Post;
exports.Comment = Comment;
exports.Likes = Likes;