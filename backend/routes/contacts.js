var express = require('express');
var router = express.Router();

/* GET contacts page. */
router.get('/', function(req, res, next) {
  res.render('contacts', { 
    title: 'Contacts',
    mobile: "+33 769 488 739",
    email: "jerome.archlinux@gmail.com",
    caption: "Envoyez moi un message",
    f_fname: "Nom de famille",
    f_sname: "Prénom",
    f_email: "email",
    f_message: "Vôtre message",
    f_submit: "Envoyer"
  });
});

module.exports = router;
