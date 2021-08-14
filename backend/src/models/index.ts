import Account = require('./account');
import BlogEntry = require('./blogentry');
import Comment = require('./comment');

Account.hasMany(BlogEntry,{foreignKey: 'createdBy'});
Account.hasMany(Comment,{foreignKey: 'createdBy'});
BlogEntry.hasMany(Comment, {foreignKey: 'commentOn', onDelete:'cascade'});

BlogEntry.belongsTo(Account,{foreignKey: 'createdBy'})

export {Account,BlogEntry,Comment};