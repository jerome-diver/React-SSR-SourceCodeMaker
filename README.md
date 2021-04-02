# Web site example (SourceCodeMaker - infos)

used to show Fullstack: Server Side Rendering with Express backend and React frontend.
This will also be a contact point to my freelance activity contact web site.

## Technology used

### Backend (server side)

* [Express.js](https://expressjs.com/) Node backend server
* JSON Web Token with [express-jwt](https://www.npmjs.com/package/express-jwt) to enforce secret access control
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) to create JSON token JWT
* [express-jwt](https://www.npmjs.com/package/express-jwt) to use JWT with Express.js server
* JWT and user role authorization with [express-jwt-permissions](https://github.com/MichielDeMey/express-jwt-permissions)
* Babel transpiler with [@babel/core](https://github.com/babel/babel) and some other
* [Mongoose](https://mongoosejs.com/) for MongoDB database
* [Pug](https://pugjs.org/api/getting-started.html) HTML markup template (HTML easier)
* [node-sass](https://pugjs.org/api/getting-started.html) SASS stylesheet loader
* [validator](https://github.com/validatorjs/validator.js) and [express-validator](https://express-validator.github.io/docs/) to check entries validation to be sanitized.
* [date-fns.js](https://date-fns.org/) to get better time/date library to use with Node.js at lower size cost
* [express-mailer](https://www.npmjs.com/package/express-mailer) to send email easy with express.js Node server
* [cookie-parser](https://www.npmjs.com/package/cookie-parser) to use cookies server side
* [Webpack-5](https://v5.webpack.js.org/) bundler tool
  * autoprefixer builder plugin for CSS facility
* [dotenv](https://www.npmjs.com/package/dotenv) to use files ".env" to embed config and secrets (to not update on version server)
* [i18next](https://www.i18next.com/) to get server side internationalization from translated entries

### Frontend (client side)

* [React.js](https://reactjs.org/) frontend framework
* [react-cookie](https://www.npmjs.com/package/react-cookie) to use cookie client side with React.js
* Redux with [react-redux](https://github.com/reduxjs/react-redux) and toolkit to manage states components of React.js
* Bootstrap-4 UI stylesheet framework with [react-bootstrap](https://react-bootstrap.github.io/)
* Fontawesome fonts and icons with [@fontawesome/react-fontawesome](https://github.com/FortAwesome/react-fontawesome)
* [SweetAlert2](https://sweetalert2.github.io/) nice dialog modal customized
* [React-i18next](https://react.i18next.com/) to get internationalization from translated entries
* [react-awesome-gravatar](https://github.com/ignaciojcano/react-awesome-gravatar) to show Gravatar of users

## DevOps part

* Nginx HTTP server
* Letsencrypt SSL
* Contabo Virtual Host & Reverse IP provider & CDN
* OS: FreeBSD-12.1
* Docker
* Git
* Visual Studio Code for Linux IDE editor
* Build under Archlinux OS laptop & Awesome WM
* Javascript with Node.js engine server side installed
