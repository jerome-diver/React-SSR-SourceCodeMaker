var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json( { 
    title: 'infos',
    content: "Welcome to my web site.\nMy name is Jérôme Lanteri and i'm french dev freelance.\nThis web site is build with Express.js backend simple framework and React.js frontend framework.\nI can also build other backend code with Ruby (Rails-5 framework) or Python-3 (Flask or Django-3 framework).\I can link them as you want with any ORM database (MySQL/MariaDB, Postgresql, MongoDB)\nI can install your web site on a remote server for you on Nginx http server."
  });
});

module.exports = router;
