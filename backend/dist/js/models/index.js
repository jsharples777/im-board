"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = exports.BlogEntry = exports.Account = void 0;
const Account = require("./account");
exports.Account = Account;
const BlogEntry = require("./blogentry");
exports.BlogEntry = BlogEntry;
const Comment = require("./comment");
exports.Comment = Comment;
Account.hasMany(BlogEntry, { foreignKey: 'createdBy' });
Account.hasMany(Comment, { foreignKey: 'createdBy' });
BlogEntry.hasMany(Comment, { foreignKey: 'commentOn', onDelete: 'cascade' });
BlogEntry.belongsTo(Account, { foreignKey: 'createdBy' });
//# sourceMappingURL=index.js.map