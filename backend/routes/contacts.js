var express = require('express')
var router = express.Router()

/* 
Should find the admin user
Then populate a JSON constant 
with: Name (first & second), address, email and mobil
from the MongoDB content with Mongoose
*/

/* GET contacts page. */
router.get('/', function(req, res, next) {
  res.json( { 
    fname: "Lanteri",
    sname: "Jérôme",
    address_road: "13 avenue des Pins",
    address_CP: "06200",
    address_city: "Nice",
    address_country: "France",
    enterprise_SIRET: "483 662 854 00015",
    email: "jerome.archlinux@gmail.com",
    caption: "Écrivez-moi un message",
    f_fname: "Nom de famille",
    f_sname: "Prénom",
    f_email: "email",
    f_message: "Vôtre message",
    f_submit: "Envoyer"
  })
})

module.exports = router
