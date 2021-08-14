/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./dist/js/db/connection.js":
/*!**********************************!*\
  !*** ./dist/js/db/connection.js ***!
  \**********************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nconst sequelize_1 = __webpack_require__(/*! sequelize */ \"sequelize\");\nconst dotenv_1 = __importDefault(__webpack_require__(/*! dotenv */ \"dotenv\"));\ndotenv_1.default.config();\n// @ts-ignore\nconst sequelize = new sequelize_1.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {\n    host: process.env.DB_HOST,\n    dialect: 'mysql',\n    dialectOptions: {\n        decimalNumbers: true,\n    },\n});\nmodule.exports = sequelize;\n\n\n//# sourceURL=webpack://backend/./dist/js/db/connection.js?");

/***/ }),

/***/ "./dist/js/models/account.js":
/*!***********************************!*\
  !*** ./dist/js/models/account.js ***!
  \***********************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nconst sequelize_1 = __webpack_require__(/*! sequelize */ \"sequelize\");\nconst connection_1 = __importDefault(__webpack_require__(/*! ../db/connection */ \"./dist/js/db/connection.js\"));\nclass Account extends sequelize_1.Model {\n}\nAccount.init({\n    id: {\n        autoIncrement: true,\n        primaryKey: true,\n        type: sequelize_1.DataTypes.INTEGER\n    },\n    username: {\n        type: sequelize_1.DataTypes.TEXT\n    },\n    password: {\n        type: sequelize_1.DataTypes.STRING,\n        allowNull: false\n    },\n}, {\n    sequelize: connection_1.default,\n    timestamps: false,\n    freezeTableName: true,\n    underscored: true,\n    modelName: 'user',\n});\nmodule.exports = Account;\n\n\n//# sourceURL=webpack://backend/./dist/js/models/account.js?");

/***/ }),

/***/ "./dist/js/models/blogentry.js":
/*!*************************************!*\
  !*** ./dist/js/models/blogentry.js ***!
  \*************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nconst sequelize_1 = __webpack_require__(/*! sequelize */ \"sequelize\");\nconst connection_1 = __importDefault(__webpack_require__(/*! ../db/connection */ \"./dist/js/db/connection.js\"));\nconst account_1 = __importDefault(__webpack_require__(/*! ./account */ \"./dist/js/models/account.js\"));\nclass BlogEntry extends sequelize_1.Model {\n}\nBlogEntry.init({\n    id: {\n        autoIncrement: true,\n        primaryKey: true,\n        type: sequelize_1.DataTypes.INTEGER\n    },\n    title: {\n        type: sequelize_1.DataTypes.STRING,\n        allowNull: false\n    },\n    content: {\n        type: sequelize_1.DataTypes.STRING\n    },\n    createdBy: {\n        type: sequelize_1.DataTypes.INTEGER,\n        references: {\n            model: account_1.default,\n            key: \"id\"\n        }\n    },\n    changedOn: {\n        type: sequelize_1.DataTypes.BIGINT,\n        allowNull: false\n    }\n}, {\n    sequelize: connection_1.default,\n    timestamps: false,\n    freezeTableName: true,\n    underscored: true,\n    modelName: 'blogentry',\n});\nmodule.exports = BlogEntry;\n\n\n//# sourceURL=webpack://backend/./dist/js/models/blogentry.js?");

/***/ }),

/***/ "./dist/js/models/comment.js":
/*!***********************************!*\
  !*** ./dist/js/models/comment.js ***!
  \***********************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nconst sequelize_1 = __webpack_require__(/*! sequelize */ \"sequelize\");\nconst connection_1 = __importDefault(__webpack_require__(/*! ../db/connection */ \"./dist/js/db/connection.js\"));\nconst account_1 = __importDefault(__webpack_require__(/*! ./account */ \"./dist/js/models/account.js\"));\nconst blogentry_1 = __importDefault(__webpack_require__(/*! ./blogentry */ \"./dist/js/models/blogentry.js\"));\nclass Comment extends sequelize_1.Model {\n}\nComment.init({\n    id: {\n        autoIncrement: true,\n        primaryKey: true,\n        type: sequelize_1.DataTypes.INTEGER\n    },\n    content: {\n        type: sequelize_1.DataTypes.STRING\n    },\n    createdBy: {\n        type: sequelize_1.DataTypes.INTEGER,\n        references: {\n            model: account_1.default,\n            key: \"id\"\n        }\n    },\n    commentOn: {\n        type: sequelize_1.DataTypes.INTEGER,\n        references: {\n            model: blogentry_1.default,\n            key: \"id\"\n        },\n    },\n    changedOn: {\n        type: sequelize_1.DataTypes.BIGINT,\n        allowNull: false\n    }\n}, {\n    sequelize: connection_1.default,\n    timestamps: false,\n    freezeTableName: true,\n    underscored: true,\n    modelName: 'comment',\n});\nmodule.exports = Comment;\n\n\n//# sourceURL=webpack://backend/./dist/js/models/comment.js?");

/***/ }),

/***/ "./dist/js/models/index.js":
/*!*********************************!*\
  !*** ./dist/js/models/index.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Comment = exports.BlogEntry = exports.Account = void 0;\nconst Account = __webpack_require__(/*! ./account */ \"./dist/js/models/account.js\");\nexports.Account = Account;\nconst BlogEntry = __webpack_require__(/*! ./blogentry */ \"./dist/js/models/blogentry.js\");\nexports.BlogEntry = BlogEntry;\nconst Comment = __webpack_require__(/*! ./comment */ \"./dist/js/models/comment.js\");\nexports.Comment = Comment;\nAccount.hasMany(BlogEntry, { foreignKey: 'createdBy' });\nAccount.hasMany(Comment, { foreignKey: 'createdBy' });\nBlogEntry.hasMany(Comment, { foreignKey: 'commentOn', onDelete: 'cascade' });\nBlogEntry.belongsTo(Account, { foreignKey: 'createdBy' });\n\n\n//# sourceURL=webpack://backend/./dist/js/models/index.js?");

/***/ }),

/***/ "./dist/js/passport/passport.js":
/*!**************************************!*\
  !*** ./dist/js/passport/passport.js ***!
  \**************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nconst bcrypt_nodejs_1 = __importDefault(__webpack_require__(/*! bcrypt-nodejs */ \"bcrypt-nodejs\"));\nconst SocketManager_1 = __importDefault(__webpack_require__(/*! ../util/SocketManager */ \"./dist/js/util/SocketManager.js\"));\n// @ts-ignore\nfunction setupPassport(passport, user) {\n    const User = user;\n    const LocalStrategy = __webpack_require__(/*! passport-local */ \"passport-local\").Strategy;\n    // Register strategy\n    passport.use('local-register', new LocalStrategy({\n        usernameField: 'username',\n        passwordField: 'password',\n        passReqToCallback: true // allows us to pass back the entire request to the callback\n    }, function (req, username, password, done) {\n        const generateHash = function (password) {\n            return bcrypt_nodejs_1.default.hashSync(password, bcrypt_nodejs_1.default.genSaltSync(8));\n        };\n        // @ts-ignore\n        User.findOne({\n            where: {\n                username: username\n            }\n        }).then(function (user) {\n            if (user) {\n                return done(null, false, {\n                    message: 'That username is already taken'\n                });\n            }\n            else {\n                const userPassword = generateHash(password);\n                const data = {\n                    username: username,\n                    password: userPassword,\n                };\n                // @ts-ignore\n                User.create(data).then(function (newUser) {\n                    // @ts-ignore\n                    User.findOne({\n                        where: {\n                            username: username\n                        }\n                    }).then(function (user) {\n                        // @ts-ignore\n                        let message = { type: \"create\", objectType: \"User\", data: user, user: user.id };\n                        SocketManager_1.default.sendMessage(message);\n                    });\n                    if (!newUser) {\n                        return done(null, false);\n                    }\n                    if (newUser) {\n                        return done(null, newUser);\n                    }\n                });\n            }\n        });\n    }));\n    // Login strategy\n    passport.use('local-login', new LocalStrategy({\n        usernameField: 'username',\n        passwordField: 'password',\n        passReqToCallback: true // allows us to pass back the entire request to the callback\n    }, function (req, username, password, done) {\n        const User = user;\n        const isValidPassword = function (hashedPassword, password) {\n            return bcrypt_nodejs_1.default.compareSync(password, hashedPassword);\n        };\n        // @ts-ignore\n        User.findOne({\n            where: {\n                username: username\n            }\n        }).then(function (user) {\n            if (!user) {\n                return done(null, false, {\n                    message: 'Username and/or password is incorrect'\n                });\n            }\n            // @ts-ignore\n            if (!isValidPassword(user.password, password)) {\n                return done(null, false, {\n                    message: 'Username and/or password is incorrect'\n                });\n            }\n            const userinfo = user.get();\n            return done(null, userinfo);\n        }).catch(function (err) {\n            return done(err);\n        });\n    }));\n    //serialize\n    passport.serializeUser(function (user, done) {\n        // @ts-ignore\n        done(null, user.id);\n    });\n    // deserialize user\n    passport.deserializeUser(function (id, done) {\n        // @ts-ignore\n        User.findByPk(id).then(function (user) {\n            if (user) {\n                done(null, user.get());\n            }\n            else {\n                // @ts-ignore\n                done(user.errors, null);\n            }\n        });\n    });\n}\nmodule.exports = setupPassport;\n\n\n//# sourceURL=webpack://backend/./dist/js/passport/passport.js?");

/***/ }),

/***/ "./dist/js/routes/api.js":
/*!*******************************!*\
  !*** ./dist/js/routes/api.js ***!
  \*******************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nconst debug_1 = __importDefault(__webpack_require__(/*! debug */ \"debug\"));\nconst index_1 = __webpack_require__(/*! ../models/index */ \"./dist/js/models/index.js\");\nconst moment_1 = __importDefault(__webpack_require__(/*! moment */ \"moment\"));\nconst SocketManager_1 = __importDefault(__webpack_require__(/*! ../util/SocketManager */ \"./dist/js/util/SocketManager.js\"));\nconst router = express_1.default.Router();\nconst rDebug = debug_1.default('api');\n/* Comments API -\n*    comments are retrieved with the tech blog entries, but we need to supply\n*    API calls for creating and deleting.\n* */\nrouter.post('/comment', (req, res) => {\n    rDebug('Creating a Comment');\n    const changedOn = parseInt(moment_1.default().format(\"YYYYMMDDHHmmss\"));\n    req.body[\"changedOn\"] = changedOn;\n    rDebug(req.body);\n    index_1.Comment.create(req.body)\n        .then((comment) => {\n        // @ts-ignore\n        let message = { type: \"create\", objectType: \"Comment\", data: comment, user: req.user.id, };\n        SocketManager_1.default.sendMessage(message);\n        res.json(comment);\n    })\n        .catch((err) => {\n        rDebug(err);\n        res.status(400).json(err);\n    });\n});\nrouter.put('/comment/:id', (req, res) => {\n    rDebug(`Updating Comment with id ${req.params.id}`);\n    const changedOn = parseInt(moment_1.default().format(\"YYYYMMDDHHmmss\"));\n    req.body[\"changedOn\"] = changedOn;\n    rDebug(req.body);\n    index_1.Comment.update(req.body, {\n        where: { id: req.params.id }\n    }).then((comment) => {\n        // @ts-ignore\n        const message = { type: \"update\", objectType: \"Comment\", data: comment, user: req.user.id, };\n        SocketManager_1.default.sendMessage(message);\n        res.json(comment);\n    })\n        .catch((err) => {\n        rDebug(err);\n        res.status(400).json(err);\n    });\n});\nrouter.delete('/comment/:id', (req, res) => {\n    rDebug(`Deleting Comment with id ${req.params.id}`);\n    // find the comment first\n    index_1.Comment.findOne({\n        where: {\n            id: req.params.id\n        }\n    })\n        .then((comment) => {\n        // @ts-ignore\n        index_1.Comment.destroy({ where: { id: comment.id }\n        }).then((result) => {\n            // @ts-ignore\n            const message = { type: \"delete\", objectType: \"Comment\", data: comment, user: req.user.id, };\n            SocketManager_1.default.sendMessage(message);\n            res.json({ result: true });\n        })\n            .catch((err) => {\n            rDebug(err);\n            res.status(400).json(err);\n        });\n    })\n        .catch((err) => {\n        rDebug(err);\n        res.status(400).json(err);\n    });\n});\n/*\n  Tech Blog entries API - CRUD\n*/\nrouter.get('/blog', (req, res) => {\n    rDebug('Getting all blog entries, their creators and any comments');\n    index_1.BlogEntry.findAll({\n        include: [index_1.Account, index_1.Comment],\n        order: ['id', 'changedOn']\n    })\n        .then((blog) => {\n        res.json(blog);\n    })\n        .catch((err) => {\n        rDebug(err);\n        res.status(400).json(err);\n    });\n});\nrouter.post('/blog', (req, res) => {\n    rDebug('Creating a blog entry');\n    rDebug(req.body);\n    const changedOn = parseInt(moment_1.default().format(\"YYYYMMDDHHmmss\"));\n    req.body[\"changedOn\"] = changedOn;\n    index_1.BlogEntry.create(req.body)\n        .then((blog) => {\n        // @ts-ignore\n        rDebug(`Created new blog entry with id ${blog.id} need full object now`);\n        // @ts-ignore\n        index_1.BlogEntry.findOne({ include: [index_1.Account, index_1.Comment], where: { id: blog.id }\n        })\n            .then((blog) => {\n            // @ts-ignore\n            const message = { type: \"create\", objectType: \"BlogEntry\", data: blog, user: req.user.id, };\n            SocketManager_1.default.sendMessage(message);\n            res.json(blog);\n        })\n            .catch((err) => {\n            rDebug(err);\n            res.status(400).json(err);\n        });\n    })\n        .catch((err) => {\n        rDebug(err);\n        res.status(400).json(err);\n    });\n});\nrouter.put('/blog/:id', (req, res) => {\n    rDebug(`Updating blog entry with id ${req.params.id}`);\n    rDebug(req.body);\n    const changedOn = parseInt(moment_1.default().format(\"YYYYMMDDHHmmss\"));\n    req.body[\"changedOn\"] = changedOn;\n    index_1.BlogEntry.update(req.body, {\n        where: { id: req.params.id }\n    })\n        .then((blog) => {\n        // @ts-ignore\n        rDebug(`Updated new blog entry with id ${blog.id} need full object now`);\n        index_1.BlogEntry.findOne({\n            include: [index_1.Account, index_1.Comment],\n            where: {\n                id: req.params.id\n            }\n        })\n            .then((blog) => {\n            // @ts-ignore\n            const message = { type: \"update\", objectType: \"BlogEntry\", data: blog, user: req.user.id, };\n            SocketManager_1.default.sendMessage(message);\n            res.json(blog);\n        })\n            .catch((err) => {\n            rDebug(err);\n            res.status(400).json(err);\n        });\n    })\n        .catch((err) => {\n        rDebug(err);\n        res.status(400).json(err);\n    });\n});\nrouter.delete('/blog/:id', (req, res) => {\n    rDebug(`Deleting blog entry with id ${req.params.id}`);\n    index_1.BlogEntry.destroy({\n        where: { id: req.params.id }\n    })\n        .then((result) => {\n        // @ts-ignore\n        const message = { type: \"delete\", objectType: \"BlogEntry\", data: { id: parseInt(req.params.id) }, user: req.user.id, };\n        SocketManager_1.default.sendMessage(message);\n        res.json({ result: true });\n    })\n        .catch((err) => {\n        rDebug(err);\n        res.status(400).json(err);\n    });\n});\n/*\n  User entries API - Read only, for ids and names\n*/\nrouter.get('/users', (req, res) => {\n    rDebug('Getting all user entries');\n    index_1.Account.findAll({ attributes: ['id', 'username'] })\n        .then((users) => {\n        // be sure to include its associated Products\n        res.json(users);\n    })\n        .catch((err) => {\n        rDebug(err);\n        res.status(400).json(err);\n    });\n});\nmodule.exports = router;\nmodule.exports = router;\n\n\n//# sourceURL=webpack://backend/./dist/js/routes/api.js?");

/***/ }),

/***/ "./dist/js/routes/auth.js":
/*!********************************!*\
  !*** ./dist/js/routes/auth.js ***!
  \********************************/
/***/ ((module) => {

eval("\nfunction ensureAuthenticated(req, res, next) {\n    if (req.isAuthenticated()) {\n        return next();\n    }\n    res.redirect('/login');\n}\nfunction forwardAuthenticated(req, res, next) {\n    if (!req.isAuthenticated()) {\n        return next();\n    }\n    res.redirect('/');\n}\nmodule.exports = { ensureAuthenticated, forwardAuthenticated };\n\n\n//# sourceURL=webpack://backend/./dist/js/routes/auth.js?");

/***/ }),

/***/ "./dist/js/routes/index.js":
/*!*********************************!*\
  !*** ./dist/js/routes/index.js ***!
  \*********************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nconst passport_1 = __importDefault(__webpack_require__(/*! passport */ \"passport\"));\nconst account_1 = __importDefault(__webpack_require__(/*! ../models/account */ \"./dist/js/models/account.js\"));\nconst debug_1 = __importDefault(__webpack_require__(/*! debug */ \"debug\"));\nconst passport_2 = __importDefault(__webpack_require__(/*! ../passport/passport */ \"./dist/js/passport/passport.js\"));\n// @ts-ignore\npassport_2.default(passport_1.default, account_1.default);\nconst rDebug = debug_1.default('route');\nconst router = express_1.default.Router();\nconst auth_1 = __importDefault(__webpack_require__(/*! ./auth */ \"./dist/js/routes/auth.js\"));\n/* GET home page. */\nrouter.get('/', (req, res, next) => {\n    res.render('index', { user: req.user });\n});\nrouter.get('/dashboard', auth_1.default.ensureAuthenticated, (req, res, next) => {\n    res.render('index', { user: req.user });\n});\nrouter.get('/register', (req, res) => {\n    res.render('register', { layout: \"login-register\", user: req.user, error: req.flash()[\"error\"] });\n});\nrouter.post('/register', passport_1.default.authenticate('local-register', {\n    successRedirect: '/',\n    failureRedirect: '/register',\n    failureFlash: true\n}));\nrouter.get('/login', (req, res) => {\n    res.render('login', { layout: \"login-register\", user: req.user, error: req.flash()[\"error\"] });\n});\nrouter.post('/login', passport_1.default.authenticate('local-login', {\n    successRedirect: '/dashboard',\n    failureRedirect: '/login',\n    failureFlash: true\n}));\nrouter.get('/logout', (req, res) => {\n    req.session.destroy((err) => {\n        res.redirect('/');\n    });\n});\nrouter.get('/ping', (req, res) => {\n    res.status(200).send('pong!');\n});\nrouter.get('/test', (req, res) => {\n    console.log(`url: ${req.url}`);\n    res.send('Hello World');\n});\nmodule.exports = router;\n\n\n//# sourceURL=webpack://backend/./dist/js/routes/index.js?");

/***/ }),

/***/ "./dist/js/server.js":
/*!***************************!*\
  !*** ./dist/js/server.js ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("var __dirname = \"/\";\n\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\n// Configuration and Logging handlers\n/* eslint-disable import/first */\n__webpack_require__(/*! dotenv */ \"dotenv\").config();\nconst morgan_1 = __importDefault(__webpack_require__(/*! morgan */ \"morgan\"));\nconst debug_1 = __importDefault(__webpack_require__(/*! debug */ \"debug\"));\n// HTTP handlers\nconst http_1 = __importDefault(__webpack_require__(/*! http */ \"http\"));\nconst path_1 = __importDefault(__webpack_require__(/*! path */ \"path\"));\n// Express framework and additional middleware\nconst express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nconst express_handlebars_1 = __importDefault(__webpack_require__(/*! express-handlebars */ \"express-handlebars\"));\nconst body_parser_1 = __importDefault(__webpack_require__(/*! body-parser */ \"body-parser\"));\nconst express_session_1 = __importDefault(__webpack_require__(/*! express-session */ \"express-session\"));\nconst cookie_parser_1 = __importDefault(__webpack_require__(/*! cookie-parser */ \"cookie-parser\"));\nconst connect_flash_1 = __importDefault(__webpack_require__(/*! connect-flash */ \"connect-flash\"));\n// Sockets\nconst SocketManager_1 = __importDefault(__webpack_require__(/*! ./util/SocketManager */ \"./dist/js/util/SocketManager.js\"));\n// Authentication middleware\nconst passport_1 = __importDefault(__webpack_require__(/*! passport */ \"passport\"));\n//Passport and User model\nconst passport_2 = __importDefault(__webpack_require__(/*! ./passport/passport */ \"./dist/js/passport/passport.js\"));\nconst connection_1 = __importDefault(__webpack_require__(/*! ./db/connection */ \"./dist/js/db/connection.js\"));\nconst models_1 = __webpack_require__(/*! ./models */ \"./dist/js/models/index.js\");\n// routes\nconst routes_1 = __importDefault(__webpack_require__(/*! ./routes */ \"./dist/js/routes/index.js\"));\nconst api_1 = __importDefault(__webpack_require__(/*! ./routes/api */ \"./dist/js/routes/api.js\"));\nconst serverDebug = debug_1.default('server');\nconst isDevelopment = (process.env.MODE === 'Development');\nserverDebug(`Is development mode ${isDevelopment}`);\n// Create and configure the express app\nconst app = express_1.default();\n// Express view/template engine setup\nserverDebug('setting up templating engine');\nlet relPath = (isDevelopment) ? process.env.VIEW_RELATIVE_PATH_DEV : process.env.VIEW_RELATIVE_PATH;\nserverDebug(`Base directory is: ${__dirname}`);\nserverDebug(`Relative path is: ${relPath}`);\nserverDebug(`${__dirname}${relPath}views`);\napp.set('views', `${__dirname}${relPath}views`);\napp.engine('handlebars', express_handlebars_1.default({\n    defaultLayout: 'default',\n    partialsDir: path_1.default.join(app.get('views'), 'partials'),\n    layoutsDir: path_1.default.join(app.get('views'), 'layouts'),\n}));\nserverDebug('setting up templating engine - handlebars');\napp.set('view engine', 'handlebars');\napp.set('view cache', !isDevelopment); // view caching in production\nserverDebug('Installing middlewares');\nserverDebug('Sequelizing database');\n//Sync Database\nconnection_1.default.sync().then(function () {\n    serverDebug('Database sync successful');\n}).catch(function (err) {\n    serverDebug(err, \"Something went wrong with the Database Update!\");\n});\n// Express middlewares\napp.use('/', express_1.default.static('./public')); // root directory of static content\napp.use('/dist', express_1.default.static('./dist')); // root directory of static content\napp.use(cookie_parser_1.default()); // add cookie support\napp.use(body_parser_1.default.json()); // add POST JSON support\napp.use(body_parser_1.default.urlencoded({ extended: true })); // and POST URL Encoded form support\napp.use(express_session_1.default({\n    secret: 'frankie',\n    resave: true,\n    saveUninitialized: false,\n    cookie: {\n        maxAge: 30 * 60 * 1000,\n    },\n    proxy: true,\n}));\napp.use(connect_flash_1.default()); // flash messages\napp.use(passport_1.default.initialize()); // initialise the authentication\napp.use(passport_1.default.session()); // setup authentication to use cookie/sessions\n/* Are we in Development or in Production? */\nserverDebug('Setting up server side logging with Morgan');\nif (isDevelopment) {\n    app.use(morgan_1.default('dev')); /* log server calls with performance timing with development details */\n    /* log call requests with body */\n    app.use((request, response, next) => {\n        serverDebug(`Received request for ${request.url} with/without body`);\n        if (request.body)\n            console.log(request.body);\n        next();\n    });\n}\nelse {\n    app.use(morgan_1.default('combined')); /* log server calls per standard combined Apache combined format */\n}\n// ensure the user is logged in with a path\nserverDebug('Installing routes');\napp.use('/', routes_1.default); // add the middleware path routing\napp.use('/api', api_1.default); // add the api path routing\n// Setup authentication\nserverDebug('Setting up User model and authentication with Passport');\n// @ts-ignore\npassport_2.default(passport_1.default, models_1.Account);\n// route for the env.js file being served to the client\nserverDebug('Setting the environment variables for the browser to access');\nconst port = process.env.PORT || 3000;\nconst LOCAL_HOST_API_DEVELOPMENT = `http://localhost:${port}/api`;\nconst LOCAL_HOST_API_PRODUCTION = `https://localhost:${port}/api`;\nlet localhostAPIURL = LOCAL_HOST_API_DEVELOPMENT;\nif (!isDevelopment)\n    localhostAPIURL = LOCAL_HOST_API_PRODUCTION;\nconst API_SERVER_URL = process.env.API_SERVER_URL || localhostAPIURL;\nlet env = { serverURL: API_SERVER_URL };\napp.get('/js/env.js', (req, res) => {\n    let session = req.session;\n    if (session.id) {\n        env.id = session.id;\n    }\n    res.send(`window.ENV = ${JSON.stringify(env)}`);\n});\n// catch 404 and forward to error handler\nserverDebug('Setting up 404 handler');\napp.use((req, res, next) => {\n    serverDebug('404 forwarder');\n    const err = new Error('Not Found');\n    // @ts-ignore\n    err.status = 404;\n    next(err);\n});\n// error handler\nif (isDevelopment) {\n    serverDebug('Setting up DEV 500 handler');\n    // @ts-ignore\n    app.use((err, req, res, next) => {\n        serverDebug(err);\n        res.status(err.status || 500);\n        res.render('error', {\n            message: err.message,\n            error: err,\n        });\n    });\n}\nelse {\n    serverDebug('Production 500 handler');\n    // @ts-ignore\n    app.use((err, req, res, next) => {\n        serverDebug(err);\n        res.status(err.status || 500);\n        res.render('error', {\n            message: err.message,\n            error: {},\n        });\n    });\n}\nconst httpServer = new http_1.default.Server(app);\n// setup the sockets manager with the server\nSocketManager_1.default.connectToServer(httpServer);\nhttpServer.listen(port, () => {\n    serverDebug(`Server started on port ${port}`);\n    // start listening for socket events\n    SocketManager_1.default.listen();\n});\n\n\n//# sourceURL=webpack://backend/./dist/js/server.js?");

/***/ }),

/***/ "./dist/js/util/SocketManager.js":
/*!***************************************!*\
  !*** ./dist/js/util/SocketManager.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\nconst debug = __webpack_require__(/*! debug */ \"debug\");\nconst socket_io_1 = __webpack_require__(/*! socket.io */ \"socket.io\");\nconst socketDebug = debug('socket');\nclass SocketManager {\n    constructor() {\n        this.io = null;\n    }\n    connectToServer(httpServer) {\n        socketDebug('Connecting up to the HTTP server');\n        this.io = new socket_io_1.Server(httpServer);\n    }\n    listen() {\n        socketDebug('starting to listen for connections');\n        if (this.io)\n            this.io.on('connection', (socket) => {\n                socketDebug('Sockets: a user connected');\n                socket.on('disconnect', () => {\n                    socketDebug('Sockets: user disconnected');\n                });\n                socket.on('message', (msg) => {\n                    socketDebug(\"Sockets: Received message \" + msg);\n                    if (this.io)\n                        this.io.emit('message', msg);\n                    socketDebug(\"Sockets: Sending message \" + msg);\n                });\n            });\n    }\n    sendMessage(message) {\n        socketDebug(\"Sending data \" + message);\n        if (this.io)\n            this.io.emit('data', JSON.stringify(message));\n    }\n}\nlet socketManager = new SocketManager();\nmodule.exports = socketManager;\n\n\n//# sourceURL=webpack://backend/./dist/js/util/SocketManager.js?");

/***/ }),

/***/ "bcrypt-nodejs":
/*!********************************!*\
  !*** external "bcrypt-nodejs" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("bcrypt-nodejs");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("body-parser");

/***/ }),

/***/ "connect-flash":
/*!********************************!*\
  !*** external "connect-flash" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("connect-flash");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("cookie-parser");

/***/ }),

/***/ "debug":
/*!************************!*\
  !*** external "debug" ***!
  \************************/
/***/ ((module) => {

module.exports = require("debug");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "express-handlebars":
/*!*************************************!*\
  !*** external "express-handlebars" ***!
  \*************************************/
/***/ ((module) => {

module.exports = require("express-handlebars");

/***/ }),

/***/ "express-session":
/*!**********************************!*\
  !*** external "express-session" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("express-session");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "moment":
/*!*************************!*\
  !*** external "moment" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("moment");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("morgan");

/***/ }),

/***/ "passport":
/*!***************************!*\
  !*** external "passport" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("passport");

/***/ }),

/***/ "passport-local":
/*!*********************************!*\
  !*** external "passport-local" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("passport-local");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "sequelize":
/*!****************************!*\
  !*** external "sequelize" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("sequelize");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("socket.io");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./dist/js/server.js");
/******/ 	
/******/ })()
;