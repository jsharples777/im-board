# I'm Board      [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Table of Contents
- [Project Description](#project-description)
- [Installation Instructions](#installation-instructions)
- [Configuration Variables](#configuration-variables)
- [User Story](#user-story)
- [Screenshot](#screenshot)
- [How To Contribute](#how-to-contribute)
- [Technology](#technology)
- [Questions](#questions)
- [License](#license)


# Project Description
This [web application](https://im-board.herokuapp.com/) allows the user to find board games from Board Game Geek and add them to a local collection.  From there they can manage that
collection adding and removing as they choose.  They can also start a score sheet for a board game, which is maintained in the browser and has some simple display and math functionality built-in.  
The user can run a timer on the scoresheet to track the game length and then save the score sheet for that board game and review them at a later date.

A new user can choose register and create a login with the Options menu, and then be able to manage their collections and scoresheets stored in a database.

A logged in user also has access to:
1.  A user search function (by username)
2.  The ability to create chat sessions with users, including group chats
3.  A user can leave a chat at any time
4.  A user can note some users as favourites, and will be notified if a user in their favourite list logs in/out
5.  A user can note some users as blocked, preventing those users from invite them to chat rooms and sending them messages

Finally a user can start a score sheet, when logged in, and make it collaborative, inviting other logged in users and allow all users to enter data and share that data during the game.

As a technical note, the chat sessions are persisted and offline messages are received on login.

If the user is idle, the session expires in 30 minutes.

# Installation Instructions

1.  Install [node.js](http://nodejs.org)
2.  Using the installed Node Package Manager `npm`, execute `npm install`  in the `frontend` directory, and again in the `backend` directory.
3.  In the `frontend` directory, execute `npm run build.prod`, to build the webpacks for the backend `public/js` directory.
4.  In the `backend` directory, execute `npm run build`, to build the `.js` files from the Typescript, which are compiled to the `dist` directory.
5.  Configure the `.env` file with the specifics of your database, configuration files, and other parameters (message queue persistence, room timeouts):

# Configuration Variables

`API_SERVER_URL` - URL of the server completing the API calls (default `blank`)
`DB_HOST` - address of the MySQL server machine
`DB_NAME` - the name of the database to use
`DB_USER` - the username to login to the database
`DB_PW` - the password of the database user
`DEBUG` - activate debug output (sub-options are space separated names (e.g. `server socket db api route message-queue`)
`MODE` - `Production`
`MQ_FILE` - Location of the offline message queue storage file (default `./db/queue.json`)


# User Story

1. To execute the application, use a command line interface (CLI) such as terminal (or in windows command), goto the `backend` directory and execute `npm run start` or alternatively `node src/server.ts`
2. Open a web browser and navigate to the homepage of the web application ([default is](http://localhost:3000))


# Screenshot

![screenshot](./backend/public/img/screenshot.png)

## How to contribute

Please access the [Questions](#questions) section to send me an email, or access the repository link if you wish to help contribute to this project.


# Technology

1. [Node.js](http://nodejs.org)
2. NPM
4. [Moment](https://npmjs.com/package/moment)
5. [React](https://www.npmjs.com/package/react)
6. [BCrypt](https://www.npmjs.com/package/bcrypt)
7. [Bootstrap](https://getbootstrap.com/)
8. [Webpack](https://www.typescriptlang.org/)
9. [Babel](https://babeljs.io/)
10. [MySQL](https://www.mysql.com/)
11. [MySQL2](https://www.npmjs.com/package/mysql2)
12. [DotENV](https://www.npmjs.com/package/dotenv)
13. [Git-Crypt](https://github.com/AGWA/git-crypt)
14. [Express](https://www.npmjs.com/package/express)
15. [Sequelize](https://www.npmjs.com/package/sequelize)
16. [Passport](https://www.npmjs.com/package/passport)
17. [Socket.io](https://socket.io/)
18. [Typescript](https://www.typescriptlang.org/)
19. [ts-node](https://github.com/TypeStrong/ts-node)
20. [tsc-watch](https://www.npmjs.com/package/tsc-watch)
21. [ts-loader](https://github.com/TypeStrong/ts-loader)
22. GraphQL
23. XML2js



# Questions

>  **Direct your questions about this project to:**
>
>  *GitHub:* [Github Project Link](https://github.com/jsharples777/im-board)
>
>  *Email:* [jamie.sharples@gmail.com](mailto:jamie.sharples@gmail.com)

# License

### [MIT License](https://opensource.org/licenses/MIT)
A short and simple permissive license with conditions only requiring preservation of copyright and license notices. Licensed works, modifications, and larger works may be distributed under different terms and without source code.
