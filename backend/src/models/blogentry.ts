import { Model, DataTypes }  from 'sequelize';
import sequelize from '../db/connection';
import Account from './account';

class BlogEntry extends Model {}

BlogEntry.init({
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
    },

    title: {
        type: DataTypes.STRING,
        allowNull:false
    },

    content: {
        type: DataTypes.STRING
    },

    createdBy: {
        type: DataTypes.INTEGER,
        references: {
            model:Account,
            key:"id"
        }
    },
    changedOn: {
        type: DataTypes.BIGINT,
        allowNull:false
    }

},
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'blogentry',
    });

export = BlogEntry;
