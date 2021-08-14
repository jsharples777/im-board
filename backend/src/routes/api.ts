import express from 'express';
import debug from 'debug';
import {Account,BlogEntry,Comment} from '../models/index';
import moment from 'moment';
import socketManager from '../util/SocketManager';
import DataMessage from "../util/DataMessage";

const router = express.Router();
const rDebug = debug('api');

/* Comments API -
*    comments are retrieved with the tech blog entries, but we need to supply
*    API calls for creating and deleting.
* */
router.post('/comment', (req,res) => {
    rDebug('Creating a Comment');

    const changedOn = parseInt(moment().format("YYYYMMDDHHmmss"));
    req.body["changedOn"] = changedOn;
    rDebug(req.body);
    Comment.create(req.body)
    .then((comment) => {
        // @ts-ignore
        let message:DataMessage = {type:"create", objectType: "Comment", data:comment, user:req.user.id,};
        socketManager.sendMessage(message);
        res.json(comment);
    })
    .catch((err) => {
        rDebug(err);
        res.status(400).json(err);
    });
});

router.put('/comment/:id', (req,res) => {
    rDebug(`Updating Comment with id ${req.params.id}`);

    const changedOn = parseInt(moment().format("YYYYMMDDHHmmss"));
    req.body["changedOn"] = changedOn;
    rDebug(req.body);
    Comment.update(req.body,
    {
        where: {id: req.params.id}
    }).then((comment) => {
        // @ts-ignore
        const message:DataMessage = {type:"update",objectType: "Comment",data:comment,user:req.user.id,}
        socketManager.sendMessage(message);

        res.json(comment);
    })
    .catch((err) => {
        rDebug(err);
        res.status(400).json(err);
    });
});

router.delete('/comment/:id', (req,res) => {
    rDebug(`Deleting Comment with id ${req.params.id}`);
    // find the comment first
    Comment.findOne({
        where: {
            id: req.params.id
        }
    })
    .then ((comment) => {
        // @ts-ignore
        Comment.destroy({where: {id: comment.id}
        }).then((result) => {
            // @ts-ignore
            const message:DataMessage = {type:"delete",objectType: "Comment",data:comment,user:req.user.id,}
            socketManager.sendMessage(message);
            res.json({result:true});
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
router.get('/blog', (req,res) => {
    rDebug('Getting all blog entries, their creators and any comments');

    BlogEntry.findAll({
        include: [Account, Comment],
        order: ['id','changedOn']
    })
        .then((blog) => {
            res.json(blog);
        })
        .catch((err) => {
            rDebug(err);
            res.status(400).json(err);
        });
});

router.post('/blog', (req,res) => {
    rDebug('Creating a blog entry');


    rDebug(req.body);
    const changedOn = parseInt(moment().format("YYYYMMDDHHmmss"));
    req.body["changedOn"] = changedOn;
    BlogEntry.create(req.body)
        .then((blog) => {
            // @ts-ignore
            rDebug(`Created new blog entry with id ${blog.id} need full object now`);
            // @ts-ignore
            BlogEntry.findOne({include: [Account, Comment], where: {id: blog.id}
            })
            .then((blog) => {
                // @ts-ignore
                const message:DataMessage = {type:"create",objectType: "BlogEntry",data:blog, user:req.user.id,}
                socketManager.sendMessage(message);
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

router.put('/blog/:id', (req,res) => {
    rDebug(`Updating blog entry with id ${req.params.id}`);

    rDebug(req.body);
    const changedOn = parseInt(moment().format("YYYYMMDDHHmmss"));
    req.body["changedOn"] = changedOn;
    BlogEntry.update(req.body,
        {
            where: {id: req.params.id}
        })
        .then((blog) => {
            // @ts-ignore
            rDebug(`Updated new blog entry with id ${blog.id} need full object now`);
            BlogEntry.findOne({
                include: [Account, Comment],
                where: {
                    id: req.params.id
                }
            })
                .then((blog) => {
                    // @ts-ignore
                    const message:DataMessage = {type:"update",objectType: "BlogEntry",data:blog,user:req.user.id,}
                    socketManager.sendMessage(message);
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

router.delete('/blog/:id', (req,res) => {
    rDebug(`Deleting blog entry with id ${req.params.id}`);
    BlogEntry.destroy({
        where: {id: req.params.id}
    })
        .then((result) => {
            // @ts-ignore
            const message:DataMessage = {type:"delete",objectType: "BlogEntry",data:{ id: parseInt(req.params.id) },user:req.user.id,}
            socketManager.sendMessage(message);
            res.json({result:true});
         })
        .catch((err) => {
            rDebug(err);
            res.status(400).json(err);
        });
});

/*
  User entries API - Read only, for ids and names
*/
router.get('/users', (req,res) => {
    rDebug('Getting all user entries');
    Account.findAll({attributes: ['id','username']})
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
export = router;