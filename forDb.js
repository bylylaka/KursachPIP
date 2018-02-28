const Sequelize = require('sequelize');

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
    fraction: {///////////////
        type: Fraction
    },
    experience: {
        type: Sequelize.INTEGER
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




const Castle = sequelize.define('Castle', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fraction: {
        type: Fraction
    }},{
    timestamps: false,
    freezeTableName: true,
    // define the table's name
    tableName: 'castle'
});


// var newCastle = Castle.build({       //save
//     fraction: 3
// });
// newCastle.save();


// Note.findOne({where : {title: 'Joi'}}).then(function(user) {
//     console.log(user.dataValues.id);
// });





exports.findAl = function findAl(Obj, res) {        //Show all entities
    Obj.findAll().then(objes => {
        objes.forEach(function(ob) {
            res.write(JSON.stringify(ob.dataValues));
        });
        res.end();
    });
};

exports.Fraction = Fraction;
exports.Hero = Hero;
exports.Magic = Magic;
exports.Army = Army;
exports.Castle = Castle;