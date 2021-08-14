"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const account_1 = __importDefault(require("./account"));
class BlogEntry extends sequelize_1.Model {
}
BlogEntry.init({
    id: {
        autoIncrement: true,
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER
    },
    title: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: sequelize_1.DataTypes.STRING
    },
    createdBy: {
        type: sequelize_1.DataTypes.INTEGER,
        references: {
            model: account_1.default,
            key: "id"
        }
    },
    changedOn: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false
    }
}, {
    sequelize: connection_1.default,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'blogentry',
});
module.exports = BlogEntry;
//# sourceMappingURL=blogentry.js.map