"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const debug_1 = __importDefault(require("debug"));
const index_1 = require("../models/index");
const moment_1 = __importDefault(require("moment"));
const SocketManager_1 = __importDefault(require("../util/SocketManager"));
const router = express_1.default.Router();
const rDebug = debug_1.default('api');
/* Comments API -
*    comments are retrieved with the tech blog entries, but we need to supply
*    API calls for creating and deleting.
* */
router.post('/comment', (req, res) => {
    rDebug('Creating a Comment');
    const changedOn = parseInt(moment_1.default().format("YYYYMMDDHHmmss"));
    req.body["changedOn"] = changedOn;
    rDebug(req.body);
    index_1.Comment.create(req.body)
        .then((comment) => {
        // @ts-ignore
        let message = { type: "create", objectType: "Comment", data: comment, user: req.user.id, };
        SocketManager_1.default.sendMessage(message);
        res.json(comment);
    })
        .catch((err) => {
        rDebug(err);
        res.status(400).json(err);
    });
});
router.put('/comment/:id', (req, res) => {
    rDebug(`Updating Comment with id ${req.params.id}`);
    const changedOn = parseInt(moment_1.default().format("YYYYMMDDHHmmss"));
    req.body["changedOn"] = changedOn;
    rDebug(req.body);
    index_1.Comment.update(req.body, {
        where: { id: req.params.id }
    }).then((comment) => {
        // @ts-ignore
        const message = { type: "update", objectType: "Comment", data: comment, user: req.user.id, };
        SocketManager_1.default.sendMessage(message);
        res.json(comment);
    })
        .catch((err) => {
        rDebug(err);
        res.status(400).json(err);
    });
});
router.delete('/comment/:id', (req, res) => {
    rDebug(`Deleting Comment with id ${req.params.id}`);
    // find the comment first
    index_1.Comment.findOne({
        where: {
            id: req.params.id
        }
    })
        .then((comment) => {
        // @ts-ignore
        index_1.Comment.destroy({ where: { id: comment.id }
        }).then((result) => {
            // @ts-ignore
            const message = { type: "delete", objectType: "Comment", data: comment, user: req.user.id, };
            SocketManager_1.default.sendMessage(message);
            res.json({ result: true });
        })
            .catch((err) => {
            rDebug(err);
            res.status(400).json(err);
        });
    })
        .catch((err) => {
        rDebug(err);
        res.status(400).json(err);
    });
});
/*
  Tech Blog entries API - CRUD
*/
router.get('/blog', (req, res) => {
    rDebug('Getting all blog entries, their creators and any comments');
    index_1.BlogEntry.findAll({
        include: [index_1.Account, index_1.Comment],
        order: ['id', 'changedOn']
    })
        .then((blog) => {
        res.json(blog);
    })
        .catch((err) => {
        rDebug(err);
        res.status(400).json(err);
    });
});
router.post('/blog', (req, res) => {
    rDebug('Creating a blog entry');
    rDebug(req.body);
    const changedOn = parseInt(moment_1.default().format("YYYYMMDDHHmmss"));
    req.body["changedOn"] = changedOn;
    index_1.BlogEntry.create(req.body)
        .then((blog) => {
        // @ts-ignore
        rDebug(`Created new blog entry with id ${blog.id} need full object now`);
        // @ts-ignore
        index_1.BlogEntry.findOne({ include: [index_1.Account, index_1.Comment], where: { id: blog.id }
        })
            .then((blog) => {
            // @ts-ignore
            const message = { type: "create", objectType: "BlogEntry", data: blog, user: req.user.id, };
            SocketManager_1.default.sendMessage(message);
            res.json(blog);
        })
            .catch((err) => {
            rDebug(err);
            res.status(400).json(err);
        });
    })
        .catch((err) => {
        rDebug(err);
        res.status(400).json(err);
    });
});
router.put('/blog/:id', (req, res) => {
    rDebug(`Updating blog entry with id ${req.params.id}`);
    rDebug(req.body);
    const changedOn = parseInt(moment_1.default().format("YYYYMMDDHHmmss"));
    req.body["changedOn"] = changedOn;
    index_1.BlogEntry.update(req.body, {
        where: { id: req.params.id }
    })
        .then((blog) => {
        // @ts-ignore
        rDebug(`Updated new blog entry with id ${blog.id} need full object now`);
        index_1.BlogEntry.findOne({
            include: [index_1.Account, index_1.Comment],
            where: {
                id: req.params.id
            }
        })
            .then((blog) => {
            // @ts-ignore
            const message = { type: "update", objectType: "BlogEntry", data: blog, user: req.user.id, };
            SocketManager_1.default.sendMessage(message);
            res.json(blog);
        })
            .catch((err) => {
            rDebug(err);
            res.status(400).json(err);
        });
    })
        .catch((err) => {
        rDebug(err);
        res.status(400).json(err);
    });
});
router.delete('/blog/:id', (req, res) => {
    rDebug(`Deleting blog entry with id ${req.params.id}`);
    index_1.BlogEntry.destroy({
        where: { id: req.params.id }
    })
        .then((result) => {
        // @ts-ignore
        const message = { type: "delete", objectType: "BlogEntry", data: { id: parseInt(req.params.id) }, user: req.user.id, };
        SocketManager_1.default.sendMessage(message);
        res.json({ result: true });
    })
        .catch((err) => {
        rDebug(err);
        res.status(400).json(err);
    });
});
/*
  User entries API - Read only, for ids and names
*/
router.get('/users', (req, res) => {
    rDebug('Getting all user entries');
    index_1.Account.findAll({ attributes: ['id', 'username'] })
        .then((users) => {
        // be sure to include its associated Products
        res.json(users);
    })
        .catch((err) => {
        rDebug(err);
        res.status(400).json(err);
    });
});
module.exports = router;
module.exports = router;
//# sourceMappingURL=api.js.map