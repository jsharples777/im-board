import { Model, DataTypes }  from 'sequelize';
import sequelize from '../db/connection';
import Account from './account';

class BoardGame extends Model {}

BoardGame.init({
    id: {
        autoIncrement: false,
        primaryKey: true,
        type: DataTypes.INTEGER
    },

    thumb: {
        type: DataTypes.STRING,
        allowNull:false
    },

    image: {
        type: DataTypes.STRING,
        allowNull:false
    },
        name: {
            type: DataTypes.STRING,
            allowNull:false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull:false
        },
        year: {
            type: DataTypes.INTEGER
        },
        minPlayers: {
            type: DataTypes.INTEGER
        },
        maxPlayers: {
            type: DataTypes.INTEGER
        },
        minPlayTime: {
            type: DataTypes.INTEGER
        },
        maxPlayTime: {
            type: DataTypes.INTEGER
        },
        minAge: {
            type: DataTypes.INTEGER
        },
        designers: {
            type: DataTypes.STRING
        },
        artists: {
            type: DataTypes.STRING
        },
        publisher: {
            type: DataTypes.STRING
        },
        categories: {
            type: DataTypes.STRING
        },
        numOfRaters: {
            type: DataTypes.INTEGER
        },
        rank: {
            type: DataTypes.INTEGER
        },
        averageScore: {
            type: DataTypes.INTEGER
        },

    createdBy: {
        type: DataTypes.INTEGER,
        references: {
            model:Account,
            key:"id"
        }
    },
},
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'boardgame',
    });

export = BoardGame;
